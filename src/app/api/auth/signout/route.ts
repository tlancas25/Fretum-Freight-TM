/**
 * Sign Out API - Clear session cookie
 * POST /api/auth/signout
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie, revokeUserTokens } from '@/lib/firebase/admin';

const SESSION_COOKIE_NAME = '__session';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    // If there's a session, revoke the user's tokens
    if (sessionCookie) {
      try {
        const decodedClaims = await verifySessionCookie(sessionCookie);
        if (decodedClaims) {
          await revokeUserTokens(decodedClaims.uid);
        }
      } catch {
        // Session might be invalid, just clear the cookie
      }
    }

    // Clear the session cookie
    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sign out error:', error);
    // Still clear the cookie even if there's an error
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    
    return NextResponse.json({ success: true });
  }
}
