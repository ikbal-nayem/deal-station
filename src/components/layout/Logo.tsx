
import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline px-2">
        <Image
          src="/logo.png"
          alt="The Deal Station Logo"
          width={40}
          height={40}
          className='dark:invert'
        />
       <span>The Deal Station</span>
    </Link>
  );
}
