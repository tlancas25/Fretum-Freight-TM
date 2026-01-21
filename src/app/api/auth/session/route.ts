/**
 * Session API - Create session cookie from ID token
 * POST /api/auth/session
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSessionCookie, verifyIdToken, setUserClaims, getUserByUid } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

// Session cookie settings
const SESSION_COOKIE_NAME = '__session';
const SESSION_EXPIRY = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

export async function POST(request: NextRequest) {
  console.log('[Session API] POST request received');
  
  try {
    const body = await request.json();
    const { idToken } = body;
    
    console.log('[Session API] ID token received:', idToken ? `${idToken.substring(0, 20)}...` : 'missing');

    if (!idToken) {
      return NextResponse.json(
        { error: 'Missing ID token' },
        { status: 400 }
      );
    }

    // Verify the ID token
    console.log('[Session API] Verifying ID token...');
    const decodedToken = await verifyIdToken(idToken);
    
    console.log('[Session API] Token verification result:', decodedToken ? 'valid' : 'invalid');
    
    if (!decodedToken) {
      console.log('[Session API] Token verification failed');
      return NextResponse.json(
        { error: 'Invalid ID token' },
        { status: 401 }
      );
    }

    console.log('[Session API] User:', decodedToken.email);

    // Check if user needs initial role assignment
    if (!decodedToken.role) {
      // Get user record to check if this is a new user
      const userRecord = await getUserByUid(decodedToken.uid);
      
      if (userRecord) {
        // Set default role for new users
        await setUserClaims(decodedToken.uid, {
          role: 'viewer', // Default role
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Create session cookie
    console.log('[Session API] Creating session cookie...');
    const sessionCookie = await createSessionCookie(idToken, SESSION_EXPIRY);
    console.log('[Session API] Session cookie created');

    // Set the cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_EXPIRY / 1000, // Convert to seconds
      path: '/',
    });

    console.log('[Session API] Cookie set successfully');

    return NextResponse.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.emailVerified,
        name: decodedToken.name,
      },
    });
  } catch (error) {
    console.error('[Session API] Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
