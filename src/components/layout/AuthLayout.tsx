import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Logo from './Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	const placeholderImage = PlaceHolderImages[0];
	return (
		<div className='w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen'>
			<div className='flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>{children}</div>
			<div className='hidden bg-muted lg:block'>
				<Image
					src={placeholderImage.imageUrl}
					alt='A bustling storefront'
					width='1920'
					height='1080'
					className='h-full w-full object-cover dark:brightness-[0.4] dark:grayscale'
					data-ai-hint='storefront urban'
				/>
			</div>
		</div>
	);
}
