
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode, useState } from 'react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Building, LayoutDashboard, ShoppingBag, User, Users, ChevronDown, LayoutGrid, Tag } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMasterDataOpen, setMasterDataOpen] = useState(false);

  useEffect(() => {
    if (pathname.includes('/admin/master-data')) {
      setMasterDataOpen(true);
    }
  }, [pathname]);

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
                        <SidebarMenuButton asChild tooltip={{children: "Dashboard"}} isActive={pathname === '/admin'}>
                            <Link href="/admin">
                                <LayoutDashboard/>
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Organizations"}} isActive={pathname.startsWith('/admin/organizations')}>
                             <Link href="/admin/organizations">
                                <Building />
                                <span>Organizations</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Users"}} isActive={pathname.startsWith('/admin/users')}>
                             <Link href="/admin/users">
                                <Users/>
                                <span>Users</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Offers"}} isActive={pathname.startsWith('/admin/offers')}>
                             <Link href="/admin/offers">
                                <ShoppingBag/>
                                <span>Offers</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <Collapsible open={isMasterDataOpen} onOpenChange={setMasterDataOpen}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full">
                            <LayoutGrid />
                            <span>Master Data</span>
                             <ChevronDown className="ml-auto h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                      </SidebarMenuItem>
                      <CollapsibleContent className="pl-6">
                         <SidebarMenu>
                           <SidebarMenuItem>
                              <SidebarMenuButton asChild size="sm" variant="ghost" className="w-full justify-start" isActive={pathname.startsWith('/admin/master-data/categories')}>
                                <Link href="/admin/master-data/categories">
                                  <LayoutGrid className="mr-2"/>
                                  <span>Categories</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                              <SidebarMenuButton asChild size="sm" variant="ghost" className="w-full justify-start" isActive={pathname.startsWith('/admin/master-data/tags')}>
                                <Link href="/admin/master-data/tags">
                                  <Tag className="mr-2"/>
                                  <span>Tags</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                         </SidebarMenu>
                      </CollapsibleContent>
                    </Collapsible>
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
