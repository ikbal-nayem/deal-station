'use client';

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { useState } from "react";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email(),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function UpdateProfileForm() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      sessionStorage.setItem('localperks-user', JSON.stringify(updatedUser));
    }
    
    toast({
      title: "Profile Updated",
      description: "Your information has been updated successfully.",
    });
    setSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your name, email, and phone number.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormInput 
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="Your first name"
              />
               <FormInput
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Your last name"
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  control={form.control}
                  name="email"
                  label="Email Address"
                  placeholder="Your email address"
                />
                 <FormInput
                  control={form.control}
                  name="phone"
                  label="Phone Number"
                  placeholder="Your phone number"
                />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}