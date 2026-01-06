'use client';

import AuthLayout from '@/components/layout/AuthLayout';
import SplashScreen from '@/components/layout/SplashScreen';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { ROLES } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { UserService } from '@/services/api/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const registrationFormSchema = z.object({
	firstName: z.string().min(2, 'First name is required'),
	lastName: z.string().min(2, 'Last name is required'),
	email: z.string().email('Invalid email address'),
	phone: z
		.string()
		.min(1, 'Phone number is required')
		.regex(/^(?:\+8801|01)[3-9]\d{8}$/, 'Must be a valid Bangladeshi phone number.'),
	password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export default function RegisterPage() {
	const router = useRouter();
	const { toast } = useToast();
	const { isLoggedIn, isAuthLoading, user } = useAuth();

	const form = useForm<RegistrationFormValues>({
		resolver: zodResolver(registrationFormSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			password: '',
		},
	});

	useEffect(() => {
		if (!isAuthLoading && isLoggedIn) {
			if (user?.roles.includes(ROLES.ADMIN) || user?.roles.includes(ROLES.SUPER_ADMIN)) {
				router.replace('/admin');
			} else if (user?.roles.includes(ROLES.OPERATOR)) {
				router.replace('/dashboard');
			} else {
				router.replace('/');
			}
		}
	}, [isLoggedIn, isAuthLoading, user, router]);

	const handleRegister = async (values: RegistrationFormValues) => {
		try {
			await UserService.publicRegistration(values);
			toast.success({
				title: 'Registration Successful',
				description: 'You can now log in with your new account.',
			});
			router.push('/login');
		} catch (error: any) {
			toast.error({
				title: 'Registration Failed',
				description: error.message || 'An unexpected error occurred.',
			});
		}
	};

	if (isAuthLoading || isLoggedIn) {
		return <SplashScreen />;
	}

	return (
		<AuthLayout>
			<div className='mx-auto grid w-[350px] gap-6'>
				<div className='grid gap-2 text-center'>
					<h1 className='text-3xl font-bold font-headline'>Create an Account</h1>
					<p className='text-balance text-muted-foreground'>Enter your information to get started.</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleRegister)} className='grid gap-4'>
						<div className='grid grid-cols-2 gap-4'>
							<FormInput
								control={form.control}
								name='firstName'
								label='First Name'
								placeholder='John'
								required
								disabled={form.formState.isSubmitting}
							/>
							<FormInput
								control={form.control}
								name='lastName'
								label='Last Name'
								placeholder='Doe'
								required
								disabled={form.formState.isSubmitting}
							/>
						</div>
						<FormInput
							control={form.control}
							name='email'
							label='Email'
							type='email'
							placeholder='m@example.com'
							required
							disabled={form.formState.isSubmitting}
						/>
						<FormInput
							control={form.control}
							name='phone'
							label='Phone'
							placeholder='+8801...'
							required
							disabled={form.formState.isSubmitting}
						/>
						<FormInput
							control={form.control}
							name='password'
							label='Password'
							type='password'
							required
							disabled={form.formState.isSubmitting}
						/>
						<Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
						</Button>
					</form>
				</Form>
				<div className='mt-4 text-center text-sm'>
					Already have an account?{' '}
					<Link href={ROUTES.AUTH.LOGIN} className='underline'>
						Sign in
					</Link>
				</div>
			</div>
		</AuthLayout>
	);
}
