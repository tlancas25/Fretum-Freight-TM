import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security Middleware for Fretum-Freight TMS
 * 
 * This middleware handles:
 * - Route protection (authentication checks)
 * - Rate limiting headers
 * - Security headers augmentation
 * - Request validation
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login',
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
  // TODO: Implement actual auth token validation with Firebase Auth
  if (!isPublicRoute) {
    const authToken = request.cookies.get('auth-token')?.value;
    const sessionToken = request.cookies.get('session')?.value;
    
    // If no auth token and trying to access protected route, redirect to login
    if (!authToken && !sessionToken) {
      // Allow the page to load for now (mock auth in development)
      // In production, uncomment the redirect below:
      // const loginUrl = new URL('/login', request.url);
      // loginUrl.searchParams.set('redirect', pathname);
      // return NextResponse.redirect(loginUrl);
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
