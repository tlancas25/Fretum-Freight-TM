"use client";

/**
 * Authentication Context Provider - Fretum-Freight TMS
 * 
 * Provides authentication state and methods to the entire application.
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  AuthUser,
  onAuthStateChange,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  signOut as firebaseSignOut,
  signOutClientOnly,
  resetPassword,
  isFirebaseConfigured,
  SignUpData,
  AuthError,
  getFirebaseAuth,
} from '@/lib/firebase';

// =============================================================================
// TYPES
// =============================================================================

export type UserRole = 'admin' | 'dispatcher' | 'driver' | 'accountant' | 'viewer';

export interface User extends AuthUser {
  role: UserRole;
  tenantId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (data: SignUpData) => Promise<{ error: AuthError | null }>;
  signInGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: AuthError | null }>;
  refreshUser: () => Promise<void>;
}

// =============================================================================
// CONTEXT
// =============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured] = useState(isFirebaseConfigured());
  const isSigningOutRef = useRef(false);

  // Fetch user data from API to get role and other server-side data
  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    if (!isConfigured) {
      // Development mode - set a mock user
      setUser({
        uid: 'dev-user',
        email: 'dev@fretumfreight.com',
        displayName: 'Development User',
        photoURL: null,
        emailVerified: true,
        role: 'admin',
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChange(async (authUser) => {
      // Skip if we're in the process of signing out to prevent loops
      if (isSigningOutRef.current) {
        return;
      }
      
      if (authUser) {
        // Get additional user data from API to verify session is valid
        const userData = await fetchUserData();
        
        // Only set user as authenticated if server confirms valid session
        if (userData) {
          setUser({
            ...authUser,
            role: userData?.role || 'viewer',
            tenantId: userData?.tenantId,
          });
        } else {
          // Firebase has auth but no valid server session
          // Sign out from Firebase client only (don't touch server session)
          console.log('Firebase auth exists but no valid server session - clearing client state');
          isSigningOutRef.current = true;
          try {
            await signOutClientOnly();
          } catch (e) {
            console.error('Failed to clear stale client state:', e);
          }
          isSigningOutRef.current = false;
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isConfigured, fetchUserData]);

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string) => {
    if (!isConfigured) {
      // Development mode - allow any login
      setUser({
        uid: 'dev-user',
        email,
        displayName: 'Development User',
        photoURL: null,
        emailVerified: true,
        role: 'admin',
      });
      return { error: null };
    }

    const result = await signInWithEmail(email, password);
    if (result.user) {
      const userData = await fetchUserData();
      setUser({
        ...result.user,
        role: userData?.role || 'viewer',
        tenantId: userData?.tenantId,
      });
    }
    return { error: result.error };
  }, [isConfigured, fetchUserData]);

  // Sign up with email/password
  const signUp = useCallback(async (data: SignUpData) => {
    if (!isConfigured) {
      return { error: { code: 'auth/not-configured', message: 'Firebase is not configured' } };
    }

    const result = await signUpWithEmail(data);
    if (result.user) {
      const userData = await fetchUserData();
      setUser({
        ...result.user,
        role: userData?.role || 'viewer',
        tenantId: userData?.tenantId,
      });
    }
    return { error: result.error };
  }, [isConfigured, fetchUserData]);

  // Sign in with Google
  const signInGoogle = useCallback(async () => {
    if (!isConfigured) {
      return { error: { code: 'auth/not-configured', message: 'Firebase is not configured' } };
    }

    const result = await signInWithGoogle();
    if (result.user) {
      const userData = await fetchUserData();
      setUser({
        ...result.user,
        role: userData?.role || 'viewer',
        tenantId: userData?.tenantId,
      });
    }
    return { error: result.error };
  }, [isConfigured, fetchUserData]);

  // Sign out
  const signOut = useCallback(async () => {
    await firebaseSignOut();
    setUser(null);
    router.push('/login');
  }, [router]);

  // Reset password
  const handleResetPassword = useCallback(async (email: string) => {
    return await resetPassword(email);
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!isConfigured) return;
    
    const userData = await fetchUserData();
    if (userData && user) {
      setUser({
        ...user,
        role: userData.role || 'viewer',
        tenantId: userData.tenantId,
      });
    }
  }, [isConfigured, fetchUserData, user]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isConfigured,
    signIn,
    signUp,
    signInGoogle,
    signOut,
    resetPassword: handleResetPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// =============================================================================
// HELPER HOOKS
// =============================================================================

/**
 * Hook to check if user has a specific role or higher
 */
export function useHasRole(requiredRole: UserRole): boolean {
  const { user } = useAuth();
  
  if (!user) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    admin: 100,
    dispatcher: 50,
    accountant: 40,
    driver: 20,
    viewer: 10,
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

/**
 * Hook to require authentication - redirects to login if not authenticated
 */
export function useRequireAuth(redirectTo = '/login') {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user && isConfigured) {
      router.push(redirectTo);
    }
  }, [user, loading, isConfigured, router, redirectTo]);
  
  return { user, loading };
}
