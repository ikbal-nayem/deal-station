'use client';

import Header from '@/components/layout/Header';
import SplashScreen from '@/components/layout/SplashScreen';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarSeparator,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { ROLES } from '@/constants/auth.constant';
import { useAuth } from '@/context/AuthContext';
import { Building, ChevronDown, LayoutDashboard, LayoutGrid, ShoppingBag, Tag, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

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
		if (
			!isLoading &&
			(!isLoggedIn || (!user?.roles.includes(ROLES.ADMIN) && !user?.roles.includes(ROLES.SUPER_ADMIN)))
		) {
			router.replace('/login');
		}
	}, [isLoggedIn, user, router, isLoading]);

	if (
		isLoading ||
		!isLoggedIn ||
		(!user?.roles.includes(ROLES.ADMIN) && !user?.roles.includes(ROLES.SUPER_ADMIN))
	) {
		return <SplashScreen />;
	}

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader>
					<h1 className='font-bold text-xl border-b border-muted-foreground pt-2 pb-3'>Admin Panel</h1>
				</SidebarHeader>
				<SidebarContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild tooltip={{ children: 'Dashboard' }} isActive={pathname === '/admin'}>
								<Link href='/admin'>
									<LayoutDashboard />
									<span>Dashboard</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								tooltip={{ children: 'Organizations' }}
								isActive={pathname.startsWith('/admin/organizations')}
							>
								<Link href='/admin/organizations'>
									<Building />
									<span>Organizations</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								tooltip={{ children: 'Users' }}
								isActive={pathname.startsWith('/admin/users')}
							>
								<Link href='/admin/users'>
									<Users />
									<span>Users</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								tooltip={{ children: 'Offers' }}
								isActive={pathname.startsWith('/admin/offers')}
							>
								<Link href='/admin/offers'>
									<ShoppingBag />
									<span>Offers</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarSeparator className='my-2' />

						<Collapsible open={isMasterDataOpen} onOpenChange={setMasterDataOpen}>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton className='w-full'>
										<LayoutGrid />
										<span>Master Data</span>
										<ChevronDown className='ml-auto h-4 w-4 transition-transform data-[state=open]:rotate-180' />
									</SidebarMenuButton>
								</CollapsibleTrigger>
							</SidebarMenuItem>
							<CollapsibleContent className='pl-6'>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											size='sm'
											variant='ghost'
											className='w-full justify-start'
											isActive={pathname.startsWith('/admin/master-data/categories')}
										>
											<Link href='/admin/master-data/categories'>
												<LayoutGrid className='mr-2' />
												<span>Categories</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											size='sm'
											variant='ghost'
											className='w-full justify-start'
											isActive={pathname.startsWith('/admin/master-data/tags')}
										>
											<Link href='/admin/master-data/tags'>
												<Tag className='mr-2' />
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
				<Header>
					<SidebarTrigger />
				</Header>
				<main className='p-4 md:p-6'>{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
