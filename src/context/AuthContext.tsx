'use client';

import { axiosIns } from '@/config/api.config';
import { ACCESS_TOKEN, REFRESH_TOKEN, ROLES } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { IUser } from '@/interfaces/auth.interface';
import { AuthService } from '@/services/api/auth.service';
import { UserService } from '@/services/api/user.service';
import { LocalStorageService, clearAuthInfo } from '@/services/storage.service';
import { useRouter } from 'next/navigation';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
	isLoggedIn: boolean;
	user: IUser | null;
	setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
	isLoading: boolean;
	login: (email: string, pass: string) => Promise<void>;
	logout: () => void;
	isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<IUser | null>(null);
	const [isAuthLoading, setIsAuthLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const loadUser = async () => {
			const token = LocalStorageService.get(ACCESS_TOKEN);
			if (token) {
				try {
					axiosIns.defaults.headers.common['Authorization'] = `Bearer ${token}`;
					const userDetailsResponse = await UserService.getUserDetails();
					setUser(userDetailsResponse.body);
				} catch (error) {
					console.error('Failed to fetch user details', error);
					clearAuthInfo();
					setUser(null);
				}
			}
			setIsAuthLoading(false);
		};

		loadUser();
	}, []);

	const login = async (email: string, pass: string) => {
		const response = await AuthService.login({
			username: email,
			password: pass,
		});

		const authInfo = response.body;

		if (authInfo && authInfo.access_token) {
			LocalStorageService.set(ACCESS_TOKEN, authInfo.access_token);
			LocalStorageService.set(REFRESH_TOKEN, authInfo.refresh_token);
			axiosIns.defaults.headers.common['Authorization'] = `Bearer ${authInfo.access_token}`;

			const userDetailsResponse = await UserService.getUserDetails();
			const userDetails = userDetailsResponse.body;
			setUser(userDetails);

			if (userDetails.roles.includes(ROLES.ADMIN) || userDetails.roles.includes(ROLES.SUPER_ADMIN)) {
				router.push(ROUTES.ADMIN.DASHBOARD);
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
		router.push(ROUTES.AUTH.LOGIN);
	};

	const value = { isLoggedIn: !!user, user, setUser, isLoading: isAuthLoading, login, logout, isAuthLoading };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
