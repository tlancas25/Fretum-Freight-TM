/**
 * Firebase Authentication Service - Fretum-Freight TMS
 * 
 * Client-side authentication methods for sign in, sign up, and session management.
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from './config';

// =============================================================================
// TYPES
// =============================================================================

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthError {
  code: string;
  message: string;
}

// =============================================================================
// AUTHENTICATION METHODS
// =============================================================================

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  if (!isFirebaseConfigured()) {
    return {
      user: null,
      error: { code: 'auth/not-configured', message: 'Firebase is not configured' },
    };
  }

  try {
    const auth = getFirebaseAuth();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = mapFirebaseUser(credential.user);
    
    // Create session cookie via API
    await createSessionFromCredential(credential);
    
    return { user, error: null };
  } catch (error: unknown) {
    const authError = mapFirebaseError(error);
    return { user: null, error: authError };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  data: SignUpData
): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  if (!isFirebaseConfigured()) {
    return {
      user: null,
      error: { code: 'auth/not-configured', message: 'Firebase is not configured' },
    };
  }

  try {
    const auth = getFirebaseAuth();
    const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    
    // Update profile with name
    await updateProfile(credential.user, {
      displayName: `${data.firstName} ${data.lastName}`,
    });
    
    // Send email verification
    await sendEmailVerification(credential.user);
    
    const user = mapFirebaseUser(credential.user);
    
    // Create session cookie via API
    await createSessionFromCredential(credential);
    
    return { user, error: null };
  } catch (error: unknown) {
    const authError = mapFirebaseError(error);
    return { user: null, error: authError };
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  if (!isFirebaseConfigured()) {
    return {
      user: null,
      error: { code: 'auth/not-configured', message: 'Firebase is not configured' },
    };
  }

  try {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    const credential = await signInWithPopup(auth, provider);
    const user = mapFirebaseUser(credential.user);
    
    // Create session cookie via API
    await createSessionFromCredential(credential);
    
    return { user, error: null };
  } catch (error: unknown) {
    const authError = mapFirebaseError(error);
    return { user: null, error: authError };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  if (!isFirebaseConfigured()) return;

  try {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    
    // Clear session cookie via API
    await fetch('/api/auth/signout', { method: 'POST' });
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(
  email: string
): Promise<{ success: boolean; error: AuthError | null }> {
  if (!isFirebaseConfigured()) {
    return {
      success: false,
      error: { code: 'auth/not-configured', message: 'Firebase is not configured' },
    };
  }

  try {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: unknown) {
    const authError = mapFirebaseError(error);
    return { success: false, error: authError };
  }
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser(): Promise<AuthUser | null> {
  return new Promise((resolve) => {
    if (!isFirebaseConfigured()) {
      resolve(null);
      return;
    }

    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user ? mapFirebaseUser(user) : null);
    });
  });
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
  if (!isFirebaseConfigured()) {
    callback(null);
    return () => {};
  }

  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, (user) => {
    callback(user ? mapFirebaseUser(user) : null);
  });
}

/**
 * Get the current user's ID token
 */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  if (!isFirebaseConfigured()) return null;

  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  
  if (!user) return null;
  
  try {
    return await user.getIdToken(forceRefresh);
  } catch {
    return null;
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Map Firebase User to our AuthUser type
 */
function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
}

/**
 * Map Firebase error to our AuthError type with user-friendly messages
 */
function mapFirebaseError(error: unknown): AuthError {
  const firebaseError = error as { code?: string; message?: string };
  const code = firebaseError.code || 'auth/unknown';
  
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/requires-recent-login': 'Please sign in again to complete this action.',
  };
  
  return {
    code,
    message: errorMessages[code] || firebaseError.message || 'An error occurred.',
  };
}

/**
 * Create a session cookie from a credential
 */
async function createSessionFromCredential(credential: UserCredential): Promise<void> {
  try {
    const idToken = await credential.user.getIdToken();
    
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    console.error('Failed to create session:', error);
  }
}
