import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="The Deal Station Logo"
      width={64}
      height={64}
      className={cn(className)}
    />
  );
}
