'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { AuthContextType, User } from '@/types/auth';
import { authApi } from '@/src/lib/api';
import { getQueryClient } from '@/src/components/QueryProvider';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, senha: string): Promise<void> => {
    try {
      const response = await authApi.login({ email, senha });
      
      const decoded: any = jwtDecode(response.token);
      
      const user: User = {
        id: decoded?.user || '',
        email: decoded?.sub || email,
        nome: decoded?.name || email.split('@')[0],
        role: decoded?.scope?.replace('ROLE_', '') || 'USUARIO',
      };
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(response.token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setToken(null);
    setUser(null);
    
    const queryClient = getQueryClient();
    if (queryClient) {
      queryClient.clear();
    }
    
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
