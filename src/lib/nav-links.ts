import { NavPermission } from '@/config/access.config';
import { ROUTES } from '@/constants/routes.constant';
import type { LucideIcon } from 'lucide-react';
import { Building, LayoutDashboard, LayoutGrid, ShoppingBag, Tag, Users } from 'lucide-react';

export interface NavLink {
	key: NavPermission | string;
	href: string;
	label: string;
	icon?: LucideIcon;
	separator?: boolean;
	isActive?: (pathname: string, hash?: string) => boolean;
	submenu?: NavLink[];
}

export const adminNavLinks: NavLink[] = [
	{
		key: 'DASHBOARD',
		href: ROUTES.ADMIN.DASHBOARD,
		label: 'Dashboard',
		icon: LayoutDashboard,
		isActive: (pathname) => pathname === ROUTES.ADMIN.DASHBOARD,
	},
	{
		key: 'ORGANIZATIONS',
		href: '/admin/organizations',
		label: 'Organizations',
		icon: Building,
		isActive: (pathname) => pathname.startsWith('/admin/organizations'),
	},
	{
		key: 'USERS',
		href: '/admin/users',
		label: 'Users',
		icon: Users,
		isActive: (pathname) => pathname.startsWith('/admin/users'),
	},
	{
		key: 'OFFERS',
		href: '/admin/offers',
		label: 'Offers',
		icon: ShoppingBag,
		isActive: (pathname) => pathname.startsWith('/admin/offers'),
	},
	{
		key: 'SEPARATOR_1',
		href: '#',
		label: 'Separator',
		separator: true,
	},
	{
		key: 'MASTER_DATA',
		href: '#',
		label: 'Master Data',
		icon: LayoutGrid,
		isActive: (pathname) => pathname.startsWith('/admin/master-data'),
		submenu: [
			{
				key: 'MASTER_DATA_CATEGORIES',
				href: ROUTES.ADMIN.MASTER_DATA.CATEGORIES,
				label: 'Categories',
				icon: LayoutGrid,
			},
			{
				key: 'MASTER_DATA_TAGS',
				href: ROUTES.ADMIN.MASTER_DATA.TAGS,
				label: 'Tags',
				icon: Tag,
			},
		],
	},
];
