
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode, useState } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, GitBranchPlus } from 'lucide-react';
import Header from '@/components/layout/Header';
import SplashScreen from '@/components/layout/SplashScreen';
import { mockOrganizations } from '@/lib/mock-organizations';
import Logo from '@/components/layout/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [organizationName, setOrganizationName] = useState('');
  const [organizationLogo, setOrganizationLogo] = useState('');

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user?.role !== 'Organization')) {
      router.replace('/login');
    }
  }, [isLoggedIn, user, router, isLoading]);

  useEffect(() => {
    if (user && user.organizationId) {
        const org = mockOrganizations.find(o => o.id === user.organizationId);
        if (org) {
            setOrganizationName(org.name);
            setOrganizationLogo(org.logoUrl || '');
        }
    }
  }, [user]);

  if (isLoading || !isLoggedIn || user?.role !== 'Organization') {
     return <SplashScreen />;
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                <div className="p-2 flex justify-center">
                    <Logo />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Dashboard"}} isActive={router.pathname === '/dashboard'}>
                            <Link href="/dashboard">
                                <LayoutDashboard/>
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Offers"}} isActive={router.pathname === '/dashboard/offers'}>
                             <Link href="/dashboard/offers">
                                <ShoppingBag />
                                <span>Offers</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Branches"}} isActive={router.pathname === '/dashboard/branches'}>
                             <Link href="/dashboard/branches">
                                <GitBranchPlus />
                                <span>Branches</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <Header>
                <div className="flex items-center gap-2">
                    <SidebarTrigger/>
                    {organizationName && (
                        <div className="flex items-center gap-3">
                             <Avatar className="h-8 w-8 hidden sm:flex">
                                <AvatarImage src={organizationLogo} alt={organizationName} />
                                <AvatarFallback>{organizationName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-base hidden sm:block">{organizationName}</span>
                        </div>
                    )}
                </div>
            </Header>
            <main className="p-4 md:p-6">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
