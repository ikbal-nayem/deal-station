import Header from './Header';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex min-h-screen flex-col bg-muted/20'>
			<Header />
			<main className='flex flex-1 items-center justify-center p-4 pt-14'>{children}</main>
		</div>
	);
}
