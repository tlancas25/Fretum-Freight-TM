/**
 * Firebase Module Exports - Fretum-Freight TMS
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

// Client-side exports
export { getFirebaseApp, getFirebaseAuth, isFirebaseConfigured } from './config';

export {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
  signOutClientOnly,
  resetPassword,
  getCurrentUser,
  onAuthStateChange,
  getIdToken,
  type AuthUser,
  type SignUpData,
  type AuthError,
} from './auth';
