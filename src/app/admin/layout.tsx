
'use client';

import Header from '@/components/layout/Header';
import Logo from '@/components/layout/Logo';
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
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/context/AuthContext';
import { checkPermission } from '@/lib/check-permission';
import { NavLink, adminNavLinks } from '@/lib/nav-links';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

const renderNavLinks = (links: NavLink[], userRoles: ROLES[], pathname: string): React.ReactNode => {
	return links.map((link) => {
		if (link.separator) {
			return <SidebarSeparator key={link.key} className='my-2' />;
		}

		// Hide if user does not have permission
		if (!checkPermission(link.key, userRoles)) {
			return null;
		}

		if (link.submenu) {
			// Filter submenu items based on permissions
			const accessibleSubmenu = link.submenu.filter((subItem) => checkPermission(subItem.key, userRoles));
			if (accessibleSubmenu.length === 0) return null;

			const isMasterDataOpen = pathname.startsWith('/admin/master-data');

			return (
				<Collapsible key={link.key} defaultOpen={isMasterDataOpen}>
					<SidebarMenuItem>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton className='w-full'>
								{link.icon && <link.icon />}
								<span>{link.label}</span>
								<ChevronDown className='ml-auto h-4 w-4 transition-transform data-[state=open]:rotate-180' />
							</SidebarMenuButton>
						</CollapsibleTrigger>
					</SidebarMenuItem>
					<CollapsibleContent className='pl-6'>
						<SidebarMenu>{renderNavLinks(accessibleSubmenu, userRoles, pathname)}</SidebarMenu>
					</CollapsibleContent>
				</Collapsible>
			);
		}

		return (
			<SidebarMenuItem key={link.key}>
				<SidebarMenuButton
					asChild
					tooltip={{ children: link.label }}
					isActive={link.isActive ? link.isActive(pathname) : pathname === link.href}
				>
					<Link href={link.href}>
						{link.icon && <link.icon />}
						<span>{link.label}</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		);
	});
};

export default function AdminLayout({ children }: { children: ReactNode }) {
	const { user, isLoggedIn, isLoading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (
			!isLoading &&
			(!isLoggedIn || (!user?.roles.includes(ROLES.ADMIN) && !user?.roles.includes(ROLES.SUPER_ADMIN)))
		) {
			router.replace(ROUTES.AUTH.LOGIN);
		}
	}, [isLoggedIn, user, router, isLoading]);

	if (
		isLoading ||
		!isLoggedIn ||
		!user ||
		(!user.roles.includes(ROLES.ADMIN) && !user.roles.includes(ROLES.SUPER_ADMIN))
	) {
		return <SplashScreen />;
	}

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader>
					<Logo />
				</SidebarHeader>
				<SidebarContent>
					<SidebarMenu>{renderNavLinks(adminNavLinks, user.roles, pathname)}</SidebarMenu>
				</SidebarContent>
			</Sidebar>
			<SidebarInset>
				<Header>
					<SidebarTrigger />
				</Header>
				<main className='p-4 md:p-6 pt-14'>{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
