
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-users';
import { axiosIns } from '@/config/api.config';
import { ACCESS_TOKEN, REFRESH_TOKEN, AUTH_INFO } from '@/constants/auth.constant';
import { CookieService, LocalStorageService, clearAuthInfo } from '@/services/storage.service';
import { IOrganizationUser, IRole } from '@/interfaces/master-data.interface';
import { ROUTES } from '@/constants/routes.constant';

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
    role: apiUser.roles?.[0] as User['role'] || 'End User', // simplify role
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
      console.error("Failed to parse user from session storage", error);
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
    
    if (authInfo && authInfo.user) {
      CookieService.set(ACCESS_TOKEN, authInfo.access_token);
      CookieService.set(REFRESH_TOKEN, authInfo.refresh_token);
      LocalStorageService.set(AUTH_INFO, authInfo);
      
      const appUser = mapApiUserToAppContextUser(authInfo.user);
      setUser(appUser);
      
      const userRole = (authInfo.user.roles as IRole[]).find(role => role.roleCode === 'SUPER_ADMIN' || role.roleCode === 'ADMIN');
      if (userRole) {
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
