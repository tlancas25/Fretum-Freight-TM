/**
 * Current User API - Get authenticated user info
 * GET /api/auth/me
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie, getUserByUid } from '@/lib/firebase/admin';

const SESSION_COOKIE_NAME = '__session';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the session cookie
    const decodedClaims = await verifySessionCookie(sessionCookie);
    
    if (!decodedClaims) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get fresh user data from Firebase
    const userRecord = await getUserByUid(decodedClaims.uid);
    
    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get custom claims for role
    const customClaims = userRecord.customClaims || {};

    return NextResponse.json({
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        role: customClaims.role || 'viewer',
        tenantId: customClaims.tenantId,
        createdAt: userRecord.metadata.creationTime,
        lastSignIn: userRecord.metadata.lastSignInTime,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
