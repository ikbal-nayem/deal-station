
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import SplashScreen from '@/components/layout/SplashScreen';
import { ROLES } from '@/constants/auth.constant';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { UserService } from '@/services/api/user.service';

const registrationFormSchema = z.object({
	firstName: z.string().min(2, 'First name is required'),
	lastName: z.string().min(2, 'Last name is required'),
	email: z.string().email('Invalid email address'),
	phone: z
		.string()
		.min(1, 'Phone number is required')
		.regex(/^(?:\+?8801|01)[3-9]\d{8}$/, 'Must be a valid Bangladeshi phone number.'),
	password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export default function RegisterPage() {
	const [isLoading, setIsLoading] = useState(false);
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
		setIsLoading(true);
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
		} finally {
			setIsLoading(false);
		}
	};

	if (isAuthLoading || isLoggedIn) {
		return <SplashScreen />;
	}

	return (
		<div className='flex h-screen w-full flex-col bg-background'>
			<Header />
			<div className='flex flex-1 items-center justify-center px-4'>
				<Card className='w-full max-w-sm'>
					<CardHeader className='text-center'>
						<CardTitle className='text-xl font-bold font-headline'>
							<UserPlus className='inline-block mr-2' />
							Create Account
						</CardTitle>
						<CardDescription>Join The Deal Station to unlock exclusive deals.</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleRegister)} className='space-y-4'>
								<div className='flex gap-4'>
									<FormInput
										control={form.control}
										name='firstName'
										label='First Name'
										placeholder='John'
										required
										disabled={isLoading}
									/>
									<FormInput
										control={form.control}
										name='lastName'
										label='Last Name'
										placeholder='Doe'
										required
										disabled={isLoading}
									/>
								</div>
								<FormInput
									control={form.control}
									name='email'
									label='Email'
									type='email'
									placeholder='m@example.com'
									required
									disabled={isLoading}
								/>
								<FormInput
									control={form.control}
									name='phone'
									label='Phone'
									placeholder='+8801...'
									required
									disabled={isLoading}
								/>
								<FormInput
									control={form.control}
									name='password'
									label='Password'
									type='password'
									required
									disabled={isLoading}
								/>
								<Button type='submit' className='w-full' disabled={isLoading}>
									{isLoading ? 'Creating Account...' : 'Register'}
								</Button>
							</form>
						</Form>
					</CardContent>
					<CardContent className='mt-4 text-center text-sm flex flex-col gap-4'>
						<p>
							<Link href='/' className='text-sm text-muted-foreground hover:text-primary'>
								Back to Home
							</Link>
						</p>
						<p>
							Already have an account?{' '}
							<Link href='/login' className='font-semibold text-primary hover:underline'>
								Login
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
