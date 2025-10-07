
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { mockSupabaseClient, AuthCredentials } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (details: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await mockSupabaseClient.auth.getUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (credentials: AuthCredentials) => {
    const loggedInUser = await mockSupabaseClient.auth.signIn(credentials);
    setUser(loggedInUser);
    navigate('/');
  };

  const register = async (details: any) => {
    const newUser = await mockSupabaseClient.auth.signUp(details);
    setUser(newUser);
    navigate('/');
  };

  const logout = async () => {
    await mockSupabaseClient.auth.signOut();
    setUser(null);
    navigate('/auth');
  };

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
