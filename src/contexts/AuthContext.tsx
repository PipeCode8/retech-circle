import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  points?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@ecocollect.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    phone: '+1-234-567-8900',
    address: '123 Green St, Eco City'
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    phone: '+1-234-567-8901',
    address: '456 Recycle Ave, Green Town',
    points: 1250
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('ecocollect-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
  setIsLoading(true);
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
    if (res.data.token && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('ecocollect-user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  } catch (error) {
    setIsLoading(false);
    return false;
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecocollect-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export async function login(email: string, password: string) {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
    if (res.data.token && res.data.user) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return true;
    } else {
      // Mostrar error de credenciales
    }
  } catch (error) {
    return false;
  }
}