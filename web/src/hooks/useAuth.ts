'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import React from 'react';
import { apiPost } from '@/lib/api';
import { getToken, setToken, removeToken, getUser } from '@/lib/auth';

interface User {
  sub: string;
  email: string;
  role: string;
  companyId: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiPost<{ accessToken: string }>('/api/auth/login', {
      email,
      password,
    });
    setToken(response.accessToken);
    const decoded = getUser();
    setUser(decoded);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    window.location.href = '/login';
  }, []);

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      },
    },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
