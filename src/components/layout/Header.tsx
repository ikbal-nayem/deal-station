
'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { LogIn, UserPlus, UserCircle, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { isLoggedIn, logout, user, isLoading } = useAuth();
  const pathname = usePathname();

  const getDashboardLink = () => {
    if (user?.role === 'Admin') return '/admin';
    if (user?.role === 'Organization') return '/dashboard';
    return '/';
  }

  return (
    <header className="flex shrink-0 items-center justify-between border-b p-2">
      <div className="flex items-center gap-2">
        {children}
        <Link href="/" className="text-xl font-bold font-headline px-2">
          LocalPerks
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {isLoading ? (
          <div className="w-24 h-9 animate-pulse bg-muted rounded-full" />
        ) : isLoggedIn && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <UserCircle className="mr-2 h-4 w-4" />
                {user.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className='flex flex-col'>
                <span>Signed in as</span>
                <span className="text-muted-foreground font-normal -mt-1">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem>
                <Badge variant="secondary">{user.role}</Badge>
              </DropdownMenuItem>
              {(user.role === 'Admin' || user.role === 'Organization') && !pathname.startsWith('/admin') && !pathname.startsWith('/dashboard') && (
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
