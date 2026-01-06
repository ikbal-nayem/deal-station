
'use client';

import AuthLayout from '@/components/layout/AuthLayout';
import SplashScreen from '@/components/layout/SplashScreen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

const loginFormSchema = z.object({
	email: z.string().email('Please enter a valid email address.'),
	password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
	const { login, isLoggedIn, user, isAuthLoading } = useAuth();
	const router = useRouter();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: { email: '', password: '' },
	});

	useEffect(() => {
		if (!isAuthLoading && isLoggedIn) {
			if (user?.roles.includes(ROLES.ADMIN) || user?.roles.includes(ROLES.SUPER_ADMIN)) {
				router.replace(ROUTES.ADMIN.DASHBOARD);
			} else {
				router.replace('/');
			}
		}
	}, [isLoggedIn, isAuthLoading, user, router]);

	const handleLogin = async (values: LoginFormValues) => {
		form.clearErrors();
		try {
			await login(values.email, values.password);
		} catch (error: any) {
			toast.error({
				title: 'Login Failed',
				description: error.message || 'Please check your email and password.',
			});
		}
	};

	if (isAuthLoading || isLoggedIn) {
		return <SplashScreen />;
	}

	return (
		<AuthLayout>
			<Card className='w-full max-w-sm'>
				<CardHeader className='text-center'>
					<CardTitle className='text-2xl font-bold font-headline'>Welcome Back!</CardTitle>
					<CardDescription>Enter your credentials to access your account</CardDescription>
				</CardHeader>
				<CardContent className='grid gap-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleLogin)} className='grid gap-4'>
							<FormInput
								control={form.control}
								name='email'
								label='Email'
								type='email'
								placeholder='m@example.com'
								required
								disabled={form.formState.isSubmitting}
							/>
							<div className='grid gap-2'>
								<FormInput
									control={form.control}
									name='password'
									label='Password'
									type='password'
									required
									disabled={form.formState.isSubmitting}
								/>
								<Link
									href={ROUTES.AUTH.FORGOT_PASSWORD}
									className='ml-auto inline-block text-sm underline'
								>
									Forgot your password?
								</Link>
							</div>
							<Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
							</Button>
						</form>
					</Form>
					<div className='mt-4 text-center text-sm'>
						Don&apos;t have an account?{' '}
						<Link href={ROUTES.AUTH.SIGNUP} className='underline font-semibold'>
							Register
						</Link>
					</div>
				</CardContent>
			</Card>
		</AuthLayout>
	);
}
