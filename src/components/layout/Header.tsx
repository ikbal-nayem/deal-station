
'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, LogIn, UserPlus, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '../ui/badge';
import Logo from './Logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


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

  const userName = user ? `${user.firstName} ${user.lastName}` : '';
  const userFallback = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : '';

  return (
    <header className="flex shrink-0 items-center justify-between border-b p-2">
      <div className="flex items-center gap-2">
        {children}
        <Logo/>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {isLoading ? (
          <div className="w-24 h-9 animate-pulse bg-muted rounded-full" />
        ) : isLoggedIn && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 rounded-full p-1 h-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={userName} />
                  <AvatarFallback>{userFallback}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:block">{userName}</span>
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
               <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
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
