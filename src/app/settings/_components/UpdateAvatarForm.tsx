
'use client';

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormControl, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useState } from "react";

const avatarFormSchema = z.object({
  avatar: z.any()
    .refine(files => files?.length === 1, 'Avatar image is required.')
    .refine(files => files?.[0]?.size <= 2 * 1024 * 1024, `Max file size is 2MB.`)
    .refine(
      files => ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

type AvatarFormValues = z.infer<typeof avatarFormSchema>;

export default function UpdateAvatarForm() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setSubmitting] = useState(false);

  const form = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarFormSchema),
  });

  const onSubmit = async (data: AvatarFormValues) => {
    setSubmitting(true);
    // Simulate upload and update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAvatarUrl = URL.createObjectURL(data.avatar[0]);
    if(user){
        const updatedUser = { ...user, avatarUrl: newAvatarUrl };
        setUser(updatedUser);
        sessionStorage.setItem('localperks-user', JSON.stringify(updatedUser));
    }

    toast({
      title: "Avatar Updated",
      description: "Your profile picture has been changed successfully.",
    });
    setSubmitting(false);
    form.reset();
  };

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Update your avatar. This will be displayed publicly.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <FormField
              control={form.control}
              name="avatar"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem className="flex-1">
                    <FormLabel>New Avatar</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => onChange(e.target.files)}
                            {...rest}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
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
