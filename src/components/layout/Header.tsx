
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
import { ROLES } from '@/constants/auth.constant';
import { ENV } from '@/constants/env.constant';

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { isLoggedIn, logout, user, isLoading } = useAuth();
  const pathname = usePathname();

  const getDashboardLink = () => {
    if (user?.roles.includes(ROLES.ADMIN) || user?.roles.includes(ROLES.SUPER_ADMIN)) return '/admin';
    if (user?.roles.includes(ROLES.OPERATOR)) return '/dashboard';
    return '/';
  };

  const userName = user && user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'User';
  const userFallback = user && user.firstName && user.lastName ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'U';
  const avatarUrl = user?.profileImage ? `${ENV.API_GATEWAY}/${user.profileImage.filePath}` : undefined;

  return (
    <header className="flex shrink-0 items-center justify-between border-b p-2">
      <div className="flex items-center gap-2">
        {children}
        <Logo />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {isLoading ? (
          <div className="w-24 h-9 animate-pulse bg-muted rounded-md" />
        ) : isLoggedIn && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 rounded-full p-1 h-auto pr-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt={userName} />
                  <AvatarFallback>{userFallback}</AvatarFallback>
                </Avatar>
                <div className='hidden sm:flex flex-col items-start'>
                    <span className="text-sm font-medium">{userName}</span>
                    <Badge variant="secondary" className="text-xs h-auto px-1 py-0">{user.roles[0].replace(/_/g, ' ')}</Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
               <DropdownMenuLabel className='flex flex-col space-y-1'>
                <p className="font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(user.roles.includes(ROLES.ADMIN) || user.roles.includes(ROLES.SUPER_ADMIN)) && (
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
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
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
