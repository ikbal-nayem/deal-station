'use client';

import Header from '@/components/layout/Header';
import SplashScreen from '@/components/layout/SplashScreen';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function SettingsLayout({ children }: { children: ReactNode }) {
	const { isLoggedIn, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isLoggedIn) router.replace(ROUTES.AUTH.LOGIN);
	}, [isLoggedIn, router, isLoading]);

	if (isLoading || !isLoggedIn) {
		return <SplashScreen />;
	}

	return (
		<div className='flex min-h-screen w-full flex-col bg-background'>
			<Header />
			<main className='flex-1 p-4 md:p-6 pt-20'>
				<div className='mx-auto max-w-4xl space-y-6'>
					<div>
						<h1 className='text-xl font-bold'>Settings</h1>
						<p className='text-muted-foreground'>Manage your account settings and preferences.</p>
					</div>
					{children}
				</div>
			</main>
		</div>
	);
}
