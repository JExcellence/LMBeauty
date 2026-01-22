'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { clearAuthData } from '@/lib/api';
import { authService } from '@/lib/services';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUserFromOAuth: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch current user on mount
  useEffect(() => {
    // Skip auth check on OAuth callback pages
    if (typeof window !== 'undefined' && window.location.pathname.includes('/auth/')) {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('accessToken');
    
    if (token) {
      // Always fetch fresh user data from server - don't trust localStorage for roles
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const userData = await authService.getMe();
      if (!userData?.id) throw new Error('Invalid user data');
      
      setUser(userData);
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      
      // Be very conservative about clearing auth - only on explicit 401 token errors
      const isTokenError = error?.response?.status === 401;
      
      // Don't clear auth for network errors, 500 errors, or other temporary issues
      if (isTokenError) {
        console.log('Authentication error detected, clearing auth data');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        
        // Only redirect if we're on a protected route
        if (typeof window !== 'undefined' && 
            (window.location.pathname.startsWith('/mein-bereich') || window.location.pathname.startsWith('/admin'))) {
          window.location.href = '/anmelden?session=expired';
        }
      } else {
        // For other errors, keep the user logged in but log the error
        console.log('Non-auth error, keeping user logged in:', error?.response?.status, error?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setUserFromOAuth = useCallback((data: any) => {
    const { token, accessToken, refreshToken, id, username, email, role, firstName, lastName, profilePicture, oauthAccounts } = data;
    
    const finalToken = accessToken || token;
    if (finalToken) localStorage.setItem('accessToken', finalToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    
    const userData: User = {
      id: String(id),
      username,
      email,
      role: role as UserRole,
      firstName,
      lastName,
      profileImage: profilePicture,
      oauthAccounts: oauthAccounts || [],
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    
    setUser(userData);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData(false);
      setUser(null);
      setIsLoggingOut(false);
      window.location.href = '/';
    }
  }, []);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error: any) {
      console.error('Failed to refresh user:', error);
      // Don't clear auth on refresh errors - just keep the existing user
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAdmin = !!user && user.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      isLoggingOut,
      isAdmin,
      logout,
      refreshUser,
      setUserFromOAuth,
    }}>
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
