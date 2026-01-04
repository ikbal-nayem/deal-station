'use client';

import { axiosIns } from '@/config/api.config';
import { ACCESS_TOKEN, AUTH_INFO, REFRESH_TOKEN, ROLES } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { IOrganizationUser } from '@/interfaces/master-data.interface';
import { type User } from '@/lib/types';
import { CookieService, LocalStorageService, clearAuthInfo } from '@/services/storage.service';
import { useRouter } from 'next/navigation';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
	isLoggedIn: boolean;
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	isLoading: boolean;
	login: (email: string, pass: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapApiUserToAppContextUser = (apiUser: IOrganizationUser): User => ({
	id: apiUser.id,
	firstName: apiUser.firstName,
	lastName: apiUser.lastName,
	email: apiUser.email,
	phone: apiUser.phone,
	role: (apiUser.roles as any[])?.find((role) => role.roleCode === 'ADMIN' || role.roleCode === 'SUPER_ADMIN')
		? 'Admin'
		: 'Organization',
	organizationId: apiUser.organizationId,
	avatarUrl: apiUser.profileImage?.filePath,
});

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		try {
			const storedUser = LocalStorageService.get(AUTH_INFO);
			if (storedUser) {
				setUser(mapApiUserToAppContextUser(storedUser.user));
			}
		} catch (error) {
			console.error('Failed to parse user from session storage', error);
			clearAuthInfo();
		}
		setIsLoading(false);
	}, []);

	const login = async (email: string, pass: string) => {
		console.log('Attempting login with:', email);

		const response = await axiosIns.post('/api/auth/login', {
			username: email,
			password: pass,
		});

		const { body: authInfo } = response.data;

		if (authInfo && authInfo.access_token) {
			CookieService.set(ACCESS_TOKEN, authInfo.access_token);
			CookieService.set(REFRESH_TOKEN, authInfo.refresh_token);
			axiosIns.defaults.headers.common['Authorization'] = `Bearer ${authInfo.access_token}`;

			const userDetailsResponse = await axiosIns.get('/user/get-details');
			const userDetails = userDetailsResponse.data.body;

			LocalStorageService.set(AUTH_INFO, { user: userDetails, ...authInfo });

			const appUser = mapApiUserToAppContextUser(userDetails);
			setUser(appUser);

			if (appUser.role === ROLES.ADMIN || appUser.role === ROLES.SUPER_ADMIN) {
				router.push(ROUTES.DASHBOARD.ADMIN);
			} else {
				router.push('/');
			}
		} else {
			throw new Error('Invalid credentials');
		}
	};

	const logout = () => {
		clearAuthInfo();
		setUser(null);
		router.push('/login');
	};

	const value = { isLoggedIn: !!user, user, setUser, isLoading, login, logout };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
