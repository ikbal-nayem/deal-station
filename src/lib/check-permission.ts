
import { rolePermissions, NavPermission } from '@/config/access.config';
import { ROLES } from '@/constants/auth.constant';

export function checkPermission(permissionKey: string, userRoles: ROLES[]): boolean {
	// If the permission key is not a valid NavPermission, deny access.
	const key = permissionKey as NavPermission;

	// Loop through each role the user has
	for (const role of userRoles) {
		const permissions = rolePermissions[role];

		if (!permissions) {
			continue; // This role has no specific permissions defined
		}

		// Check for wildcard allow
		if (permissions.allow?.includes('*')) {
			return true;
		}

		// Check if the permission is explicitly allowed
		if (permissions.allow?.includes(key)) {
			return true;
		}

		// Check if the permission is explicitly disallowed (takes precedence over general allows)
		if (permissions.notAllow?.includes(key)) {
			return false;
		}
	}

	// If no specific rule was found for any of the user's roles, deny access by default
	return false;
}
