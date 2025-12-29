
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { type User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-users';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, pass: string) => {
    console.log('Attempting login with:', email);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === pass
    );

    if (foundUser) {
      setUser(foundUser);
      router.push('/');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  const value = { isLoggedIn: !!user, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
