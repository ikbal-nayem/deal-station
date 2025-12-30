
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-users';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a logged-in user from a session
    try {
      const storedUser = sessionStorage.getItem('localperks-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
      sessionStorage.removeItem('localperks-user');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    console.log('Attempting login with:', email);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === pass
    );

    if (foundUser) {
      const { password, ...userToStore } = foundUser;
      setUser(userToStore as User);
      sessionStorage.setItem('localperks-user', JSON.stringify(userToStore));
      
      if (userToStore.role === 'Admin') {
        router.push('/admin');
      } else if (userToStore.role === 'Organization') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }

    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('localperks-user');
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
