
'use client';

import Logo from './Logo';
import { Loader2 } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <div className="flex flex-col items-center gap-8">
        <Logo />
        <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="w-full h-full bg-primary animate-pulse-fast-long"></div>
        </div>
      </div>
    </div>
  );
}
