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
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
	const { toast } = useToast();
	const { isLoggedIn, isAuthLoading, user } = useAuth();
	const router = useRouter();

	const form = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: '' },
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

	const handleReset = async (values: ForgotPasswordFormValues) => {
		// In a real app, you'd call your backend.
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('Password reset requested for:', values.email);

		toast({
			title: 'Password Reset Sent',
			description: 'If an account exists for that email, a reset link has been sent.',
		});
	};

	if (isAuthLoading || isLoggedIn) {
		return <SplashScreen />;
	}

	return (
		<AuthLayout>
			<div className='mx-auto grid w-[350px] gap-6'>
				<div className='grid gap-2 text-center'>
					<h1 className='text-3xl font-bold font-headline'>Forgot Password?</h1>
					<p className='text-balance text-muted-foreground'>
						No worries! Enter your email and we&apos;ll send you a reset link.
					</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleReset)} className='grid gap-4'>
						<FormInput
							control={form.control}
							name='email'
							label='Email'
							type='email'
							placeholder='m@example.com'
							required
							disabled={form.formState.isSubmitting}
						/>
						<Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? 'Sending...' : 'Send Reset Link'}
						</Button>
					</form>
				</Form>
				<div className='mt-4 text-center text-sm'>
					Remembered your password?{' '}
					<Link href={ROUTES.AUTH.LOGIN} className='underline'>
						Sign in
					</Link>
				</div>
			</div>
		</AuthLayout>
	);
}
