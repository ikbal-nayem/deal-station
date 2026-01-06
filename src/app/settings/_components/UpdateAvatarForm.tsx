
'use client';

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { ENV } from "@/constants/env.constant";
import { UserService } from "@/services/api/user.service";
import { compressImage } from "@/lib/compresser";
import { LocalStorageService } from "@/services/storage.service";
import { AUTH_INFO } from "@/constants/auth.constant";

const avatarFormSchema = z.object({
  avatar: z.any()
    .refine(files => files === null || (files && files.length === 1), 'Avatar image is required.')
    .refine(files => files === null || files?.[0]?.size <= 2 * 1024 * 1024, `Max file size is 2MB.`)
    .refine(
      files => files === null || ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ).nullable(),
});

type AvatarFormValues = z.infer<typeof avatarFormSchema>;

export default function UpdateAvatarForm() {
  const { user, setUser } = useAuth();
  
  const [isSubmitting, setSubmitting] = useState(false);

  const form = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarFormSchema),
    defaultValues: {
        avatar: null
    }
  });

  const onSubmit = async (data: AvatarFormValues) => {
    setSubmitting(true);
    
    if (!data.avatar || data.avatar.length === 0) {
      toast.warning({ title: "No Image Selected", description: "Please select an image to upload." });
      setSubmitting(false);
      return;
    }

    try {
      const imageFile = data.avatar[0];
      const compressedFile = await compressImage(imageFile);
      
      const formData = new FormData();
      formData.append('file', compressedFile);

      const response = await UserService.saveProfileImage(formData);
      const newProfileImage = response.body;

      if(user){
          const updatedUser = { ...user, profileImage: newProfileImage };
          setUser(updatedUser);
          LocalStorageService.set(AUTH_INFO, updatedUser);
      }
      
      toast.success({
        title: "Avatar Updated",
        description: "Your profile picture has been changed successfully.",
      });
      form.reset({ avatar: null });

    } catch (error: any) {
        toast.error({
            title: 'Upload Failed',
            description: error.message || 'Could not update your profile picture.'
        });
    } finally {
        setSubmitting(false);
    }
  };

  if (!user) return null;
  
  const fallbackText = user.firstName && user.lastName ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : '';
  const currentImageUrl = user.profileImage ? `${ENV.API_GATEWAY}/${user.profileImage.filePath}` : undefined;


  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Update your avatar. This will be displayed publicly.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormImageUpload
                control={form.control}
                name="avatar"
                label="Your Avatar"
                description="Upload a new photo for your profile."
                currentImage={currentImageUrl}
                fallbackText={fallbackText}
                />
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Upload & Save'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
