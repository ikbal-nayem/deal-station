
'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="flex shrink-0 items-center justify-between border-b p-2">
       <Link href="/" className="text-xl font-bold font-headline px-2">LocalPerks</Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {children}
        {isLoggedIn ? (
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">
                <UserPlus className="mr-2 h-4 w-4" /> Register
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
