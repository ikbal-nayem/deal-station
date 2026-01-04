
'use client';

import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SplashScreen from '@/components/layout/SplashScreen';
import { ROLES } from '@/constants/auth.constant';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { login, isLoggedIn, user, isLoading: isAuthLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthLoading && isLoggedIn) {
			if (user?.roles.includes(ROLES.ADMIN)) {
				router.replace('/admin');
			} else if (user?.roles.includes(ROLES.OPERATOR)) {
				router.replace('/dashboard');
			} else {
				router.replace('/');
			}
		}
	}, [isLoggedIn, isAuthLoading, user, router]);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await login(email, password);
			toast.success({
				title: 'Login Successful',
				description: 'Welcome back! Redirecting...',
			});
			// The redirection is now handled by the useEffect above and AuthContext
		} catch (error: any) {
			toast.error({
				title: 'Login Failed',
				description: error.message || 'Please check your email and password.',
			});
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
						<CardTitle className='text-2xl font-bold font-headline'>
							<LogIn className='inline-block mr-2' />
							Login
						</CardTitle>
						<CardDescription>Enter your credentials to access your account.</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleLogin} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									placeholder='m@example.com'
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={isLoading}
								/>
							</div>
							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<Label htmlFor='password'>Password</Label>
									<Link href='/forgot-password' className='text-xs text-primary hover:underline'>
										Forgot password?
									</Link>
								</div>
								<Input
									id='password'
									type='password'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={isLoading}
								/>
							</div>
							<Button type='submit' className='w-full' disabled={isLoading}>
								{isLoading ? 'Signing in...' : 'Sign In'}
							</Button>
						</form>
					</CardContent>
					<CardFooter className='flex flex-col gap-4 text-center text-sm'>
						<p>
							<Link href='/' className='text-sm text-muted-foreground hover:text-primary'>
								Back to Home
							</Link>
						</p>
						<p>
							Don't have an account?{' '}
							<Link href='/register' className='font-semibold text-primary hover:underline'>
								Register
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
