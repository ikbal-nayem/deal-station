'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Fake login function
  const login = async (email: string, pass: string) => {
    // In a real app, you'd call your backend here.
    console.log('Attempting login with:', email, pass);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    if (email && pass) {
      setIsLoggedIn(true);
      router.push('/');
    } else {
        throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    router.push('/login');
  };

  const value = { isLoggedIn, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}