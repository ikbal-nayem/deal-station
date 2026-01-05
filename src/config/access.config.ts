
import { ROLES } from '@/constants/auth.constant';

export type NavPermission =
	| '*'
	| 'DASHBOARD'
	| 'ORGANIZATIONS'
	| 'USERS'
	| 'OFFERS'
	| 'MASTER_DATA'
	| 'MASTER_DATA_CATEGORIES'
	| 'MASTER_DATA_TAGS';

export const rolePermissions: Record<ROLES, { allow?: NavPermission[]; notAllow?: NavPermission[] }> = {
	[ROLES.SUPER_ADMIN]: {
		allow: ['*'], // Wildcard for all permissions
	},
	[ROLES.ADMIN]: {
		allow: ['DASHBOARD', 'ORGANIZATIONS', 'USERS', 'OFFERS', 'MASTER_DATA', 'MASTER_DATA_CATEGORIES', 'MASTER_DATA_TAGS'],
	},
	[ROLES.OPERATOR]: {
		allow: ['DASHBOARD', 'OFFERS'],
	},
	[ROLES.USER]: {
		// No admin access
	},
};
