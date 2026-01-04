
'use client';

import { axiosIns } from '@/config/api.config';
import { ACCESS_TOKEN, AUTH_INFO, REFRESH_TOKEN, ROLES } from '@/constants/auth.constant';
import { IAuthInfo, IUser } from '@/interfaces/auth.interface';
import { AuthService } from '@/services/api/auth.service';
import { UserService } from '@/services/api/user.service';
import { CookieService, LocalStorageService, clearAuthInfo } from '@/services/storage.service';
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

const mapApiUserToAppContextUser = (apiUser: any): IUser => {
	return {
		id: apiUser.id,
		username: apiUser.username,
		email: apiUser.email,
		roles: apiUser.roles || [],
		firstName: apiUser.firstName,
		lastName: apiUser.lastName,
		fullName: apiUser.fullName,
		phone: apiUser.phone,
		profileImage: apiUser.profileImage,
		dateOfBirth: apiUser.dateOfBirth,
		gender: apiUser.gender,
		genderDTO: apiUser.genderDTO,
		organizationId: apiUser.organizationId,
		organization: apiUser.organization,
	};
};


export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<IUser | null>(null);
	const [isAuthLoading, setIsAuthLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		try {
			const storedUser = LocalStorageService.get(AUTH_INFO);
			if (storedUser) setUser(storedUser);
		} catch (error) {
			console.error('Failed to parse user from session storage', error);
			clearAuthInfo();
		}
		setIsAuthLoading(false);
	}, []);

	const login = async (email: string, pass: string) => {
		const response = await AuthService.login({
			username: email,
			password: pass,
		});

		const authInfo = response.body;

		if (authInfo && authInfo.access_token) {
			CookieService.set(ACCESS_TOKEN, authInfo.access_token);
			CookieService.set(REFRESH_TOKEN, authInfo.refresh_token);
			axiosIns.defaults.headers.common['Authorization'] = `Bearer ${authInfo.access_token}`;

			const userDetailsResponse = await UserService.getUserDetails();
			const userDetails = mapApiUserToAppContextUser(userDetailsResponse.body);
			
			const userToStore = {
				...userDetails,
				...authInfo
			}
			LocalStorageService.set(AUTH_INFO, userToStore);

			setUser(userDetails);
			
			if (userDetails.roles.includes(ROLES.ADMIN) || userDetails.roles.includes(ROLES.SUPER_ADMIN)) {
				router.push('/admin');
			} else if (userDetails.roles.includes(ROLES.OPERATOR)) {
				router.push('/dashboard');
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
