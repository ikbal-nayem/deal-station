import { COMMON_URL } from '@/constants/common.constant';
import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
	return (
		<Link href='/' className='flex items-center gap-2 text-xl font-bold font-headline px-2'>
			<Image src={COMMON_URL.SITE_LOGO} alt='The Deal Station Logo' width={40} height={40} />
			<span className='hidden sm:inline-block'>The Deal Station</span>
		</Link>
	);
}
