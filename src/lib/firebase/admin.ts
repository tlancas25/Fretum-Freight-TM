/**
 * Firebase Admin Configuration - Fretum-Freight TMS
 * 
 * Server-side Firebase Admin SDK for token validation and user management.
 * This should only be imported in server-side code (API routes, middleware).
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App;
let adminAuth: Auth;

/**
 * Initialize Firebase Admin SDK
 * 
 * Uses one of the following authentication methods (in order of priority):
 * 1. Base64-encoded service account from FIREBASE_SERVICE_ACCOUNT_BASE64 env var
 * 2. Service account JSON from FIREBASE_SERVICE_ACCOUNT_KEY env var
 * 3. Google Application Default Credentials (for GCP environments)
 */
export function getFirebaseAdmin(): App {
  if (!adminApp) {
    const existingApps = getApps();
    
    if (existingApps.length > 0) {
      adminApp = existingApps[0];
    } else {
      try {
        // Try base64-encoded service account first
        const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        
        if (serviceAccountBase64) {
          // Decode base64 and parse the service account JSON
          const decoded = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
          const serviceAccount = JSON.parse(decoded);
          adminApp = initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          });
        } else if (serviceAccountKey) {
          // Parse the service account JSON directly
          const serviceAccount = JSON.parse(serviceAccountKey);
          adminApp = initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          });
        } else {
          // Fall back to Application Default Credentials (works on GCP)
          adminApp = initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          });
        }
      } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
        throw new Error('Firebase Admin initialization failed');
      }
    }
  }
  return adminApp;
}

/**
 * Get Firebase Admin Auth instance
 */
export function getFirebaseAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getFirebaseAdmin());
  }
  return adminAuth;
}

/**
 * Verify a Firebase ID token
 * Returns the decoded token if valid, null if invalid
 */
export async function verifyIdToken(idToken: string): Promise<{
  uid: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  picture?: string;
  role?: string;
} | null> {
  try {
    const auth = getFirebaseAdminAuth();
    const decodedToken = await auth.verifyIdToken(idToken, true);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
      role: decodedToken.role as string | undefined,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Create a session cookie from an ID token
 */
export async function createSessionCookie(
  idToken: string,
  expiresIn: number = 60 * 60 * 24 * 5 * 1000 // 5 days
): Promise<string> {
  const auth = getFirebaseAdminAuth();
  return auth.createSessionCookie(idToken, { expiresIn });
}

/**
 * Verify a session cookie
 */
export async function verifySessionCookie(sessionCookie: string): Promise<{
  uid: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  role?: string;
} | null> {
  try {
    const auth = getFirebaseAdminAuth();
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      emailVerified: decodedClaims.email_verified,
      name: decodedClaims.name,
      role: decodedClaims.role as string | undefined,
    };
  } catch (error) {
    console.error('Session cookie verification failed:', error);
    return null;
  }
}

/**
 * Revoke all refresh tokens for a user (force sign out everywhere)
 */
export async function revokeUserTokens(uid: string): Promise<void> {
  const auth = getFirebaseAdminAuth();
  await auth.revokeRefreshTokens(uid);
}

/**
 * Set custom claims on a user (e.g., role, tenantId)
 */
export async function setUserClaims(
  uid: string,
  claims: Record<string, unknown>
): Promise<void> {
  const auth = getFirebaseAdminAuth();
  await auth.setCustomUserClaims(uid, claims);
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  try {
    const auth = getFirebaseAdminAuth();
    return await auth.getUserByEmail(email);
  } catch {
    return null;
  }
}

/**
 * Get user by UID
 */
export async function getUserByUid(uid: string) {
  try {
    const auth = getFirebaseAdminAuth();
    return await auth.getUser(uid);
  } catch {
    return null;
  }
}
