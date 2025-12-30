
'use client';

import Logo from './Logo';
import { Loader2 } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <div className="flex flex-col items-center gap-6">
        <Logo />
        <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-lg">Loading...</span>
        </div>
      </div>
    </div>
  );
}
