'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Este código só é executado no lado do cliente
    const token = localStorage.getItem('cognicore_token');
    if (token) {
      try {
        const userData: any = jwtDecode(token);
        if (userData.exp * 1000 < Date.now()) {
          // Token expirado
          localStorage.removeItem('cognicore_token');
          router.replace('/login');
        } else {
          setUser({
            id: userData.sub,
            name: userData.name,
            email: userData.email,
            roles: userData.roles,
          });
        }
      } catch (error) {
        console.error("Failed to decode token", error);
        localStorage.removeItem('cognicore_token');
        router.replace('/login');
      }
    }
    setIsLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('cognicore_token');
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};