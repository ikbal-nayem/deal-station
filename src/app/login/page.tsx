'use client';

import AuthLayout from '@/components/layout/AuthLayout';
import SplashScreen from '@/components/layout/SplashScreen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { ROLES } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
			<div className='mx-auto grid w-[350px] gap-6'>
				<div className='grid gap-2 text-center'>
					<h1 className='text-3xl font-bold font-headline'>Welcome Back!</h1>
					<p className='text-balance text-muted-foreground'>Enter your credentials to access your account</p>
				</div>
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
							<div className='flex items-center'>
								<FormInput
									control={form.control}
									name='password'
									label='Password'
									type='password'
									required
									disabled={form.formState.isSubmitting}
									className='flex-1'
								/>
							</div>
							<Link href={ROUTES.AUTH.FORGOT_PASSWORD} className='ml-auto inline-block text-sm underline'>
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
					<Link href={ROUTES.AUTH.SIGNUP} className='underline'>
						Register
					</Link>
				</div>
			</div>
		</AuthLayout>
	);
}
