export const ROUTES = {
	AUTH: {
		LOGIN: '/login',
		SIGNUP: '/register',
		FORGOT_PASSWORD: '/forgot-password',
		RESET_PASSWORD: '/reset-password',
	},

	ADMIN: {
		DASHBOARD: '/admin',
		USERS: '/admin/master-data/users',
		MASTER_DATA: {
			CATEGORIES: '/admin/master-data/categories',
			TAGS: '/admin/master-data/tags',
		},
	},
};
