import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security Middleware for Fretum-Freight TMS
 * 
 * This middleware handles:
 * - Route protection (authentication checks via Firebase session cookies)
 * - Rate limiting headers
 * - Security headers augmentation
 * - Request validation
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

// Session cookie name (must match what we set in API route)
const SESSION_COOKIE_NAME = '__session';

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/api/auth',
  '/api/health',
  '/manifest.json',
  '/sw.js',
  '/_next',
  '/favicon.ico',
  '/logo-icon.png',
  '/logo-full.png',
];

// API routes that require authentication
const PROTECTED_API_ROUTES = [
  '/api/loads',
  '/api/customers',
  '/api/invoices',
  '/api/fleet',
  '/api/dispatch',
  '/api/reports',
  '/api/settings',
];

// Check if Firebase is configured (for development mode bypass)
const isFirebaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Create response with security headers
  const response = NextResponse.next();
  
  // Add request ID for tracing
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);
  
  // Add timestamp header for debugging
  response.headers.set('X-Response-Time', new Date().toISOString());
  
  // Check if this is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname.startsWith(route) || pathname === '/'
  );
  
  // For protected routes, check for authentication
  if (!isPublicRoute) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    
    // Check if user has a session cookie
    if (!sessionCookie) {
      // If Firebase is not configured (development), allow access
      if (!isFirebaseConfigured()) {
        // Development mode - allow access without auth
        response.headers.set('X-Auth-Mode', 'development');
      } else {
        // Production mode - redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      // User has a session cookie - will be validated by API routes
      response.headers.set('X-Auth-Mode', 'authenticated');
    }
  }
  
  // Check for protected API routes
  const isProtectedAPI = PROTECTED_API_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedAPI) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    
    if (!sessionCookie && isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'X-Request-ID': requestId } }
      );
    }
  }
  
  // Rate limiting headers (actual limiting should be done at GCP level)
  response.headers.set('X-RateLimit-Limit', '1000');
  response.headers.set('X-RateLimit-Remaining', '999');
  
  // Prevent caching of sensitive pages
  if (pathname.includes('/settings') || pathname.includes('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
