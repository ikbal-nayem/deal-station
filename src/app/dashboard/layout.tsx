
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, GitBranchPlus, Building } from 'lucide-react';
import Header from '@/components/layout/Header';


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user?.role !== 'Organization')) {
      router.replace('/login');
    }
  }, [isLoggedIn, user, router, isLoading]);

  if (isLoading || !isLoggedIn || user?.role !== 'Organization') {
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
                     <h2 className="font-semibold text-lg px-2">Org Dashboard</h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Dashboard"}}>
                            <Link href="/dashboard">
                                <LayoutDashboard/>
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Offers"}}>
                             <Link href="/dashboard/offers">
                                <ShoppingBag />
                                <span>Offers</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Branches"}}>
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
                <SidebarTrigger/>
            </Header>
            <main className="p-4 md:p-6">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
