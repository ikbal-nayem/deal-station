
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Building, LayoutDashboard, ShoppingBag, User, Users } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user?.role !== 'Admin')) {
      router.replace('/login');
    }
  }, [isLoggedIn, user, router, isLoading]);

  if (isLoading || !isLoggedIn || user?.role !== 'Admin') {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-xl">Loading...</div>
        </div>
    );
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 p-2">
                    <SidebarTrigger />
                    <h2 className="font-semibold text-lg">Admin Panel</h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Dashboard"}}>
                            <Link href="/admin">
                                <LayoutDashboard/>
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Organizations"}}>
                             <Link href="/admin/organizations">
                                <Building />
                                <span>Organizations</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Users"}}>
                             <Link href="/admin/users">
                                <Users/>
                                <span>Users</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Offers"}}>
                             <Link href="/admin/offers">
                                <ShoppingBag/>
                                <span>Offers</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <Header/>
            <main className="p-4 md:p-6">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
