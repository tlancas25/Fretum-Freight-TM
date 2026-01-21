/**
 * API Route Handler Utilities for Fretum-Freight TMS
 * 
 * Provides secure wrappers for API route handlers with:
 * - Authentication validation
 * - Request validation
 * - Error handling
 * - Audit logging
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSecurityHeaders, checkRateLimit, maskEmail } from './index';

// =============================================================================
// TYPES
// =============================================================================

export type UserRole = 'admin' | 'dispatcher' | 'driver' | 'accountant' | 'viewer';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  tenantId?: string;
}

export interface APIContext {
  user: AuthenticatedUser | null;
  requestId: string;
  timestamp: Date;
}

type APIHandler<T = unknown> = (
  request: NextRequest,
  context: APIContext
) => Promise<NextResponse<T>>;

// =============================================================================
// AUTHENTICATION
// =============================================================================

/**
 * Validate authentication token and return user info
 * TODO: Implement actual Firebase Auth validation
 */
async function validateAuthToken(request: NextRequest): Promise<AuthenticatedUser | null> {
  const authHeader = request.headers.get('authorization');
  const sessionCookie = request.cookies.get('session')?.value;
  
  if (!authHeader?.startsWith('Bearer ') && !sessionCookie) {
    return null;
  }
  
  const token = authHeader?.replace('Bearer ', '') || sessionCookie;
  
  if (!token) {
    return null;
  }
  
  // TODO: Validate token with Firebase Admin SDK
  // const decodedToken = await admin.auth().verifyIdToken(token);
  // return {
  //   id: decodedToken.uid,
  //   email: decodedToken.email || '',
  //   role: decodedToken.role || 'viewer',
  //   tenantId: decodedToken.tenantId,
  // };
  
  // Placeholder for development - REMOVE IN PRODUCTION
  return null;
}

// =============================================================================
// AUTHORIZATION
// =============================================================================

const roleHierarchy: Record<UserRole, number> = {
  admin: 100,
  dispatcher: 50,
  accountant: 40,
  driver: 20,
  viewer: 10,
};

/**
 * Check if user has required role
 */
export function hasRole(user: AuthenticatedUser, requiredRole: UserRole): boolean {
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

/**
 * Check if user can access resource (tenant check)
 */
export function canAccessTenant(user: AuthenticatedUser, tenantId: string): boolean {
  // Admins can access all tenants
  if (user.role === 'admin') return true;
  // Others can only access their own tenant
  return user.tenantId === tenantId;
}

// =============================================================================
// API HANDLER WRAPPERS
// =============================================================================

interface HandlerOptions {
  requireAuth?: boolean;
  requiredRole?: UserRole;
  rateLimit?: { limit: number; windowMs: number };
  schema?: z.ZodSchema;
}

/**
 * Wrap an API handler with security features
 */
export function secureHandler<T>(
  handler: APIHandler<T>,
  options: HandlerOptions = {}
): (request: NextRequest) => Promise<NextResponse> {
  const {
    requireAuth = true,
    requiredRole,
    rateLimit = { limit: 100, windowMs: 60000 },
    schema,
  } = options;

  return async (request: NextRequest): Promise<NextResponse> => {
    const requestId = crypto.randomUUID();
    const timestamp = new Date();
    const securityHeaders = getSecurityHeaders();

    try {
      // Rate limiting
      const clientIP = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
      const rateLimitKey = `${clientIP}:${request.nextUrl.pathname}`;
      const rateLimitResult = checkRateLimit(rateLimitKey, rateLimit.limit, rateLimit.windowMs);

      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          { error: 'Too many requests', retryAfter: Math.ceil(rateLimitResult.resetIn / 1000) },
          { 
            status: 429, 
            headers: {
              ...securityHeaders,
              'X-Request-ID': requestId,
              'Retry-After': String(Math.ceil(rateLimitResult.resetIn / 1000)),
            },
          }
        );
      }

      // Authentication
      let user: AuthenticatedUser | null = null;
      if (requireAuth) {
        user = await validateAuthToken(request);
        if (!user) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { 
              status: 401, 
              headers: { ...securityHeaders, 'X-Request-ID': requestId },
            }
          );
        }

        // Role check
        if (requiredRole && !hasRole(user, requiredRole)) {
          logSecurityEvent('authorization_failed', { 
            userId: user.id, 
            requiredRole,
            userRole: user.role,
            path: request.nextUrl.pathname,
          });
          return NextResponse.json(
            { error: 'Forbidden' },
            { 
              status: 403, 
              headers: { ...securityHeaders, 'X-Request-ID': requestId },
            }
          );
        }
      }

      // Request body validation
      if (schema && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        try {
          const body = await request.json();
          schema.parse(body);
        } catch (error) {
          if (error instanceof z.ZodError) {
            return NextResponse.json(
              { error: 'Validation failed', details: error.errors.map(e => e.message) },
              { 
                status: 400, 
                headers: { ...securityHeaders, 'X-Request-ID': requestId },
              }
            );
          }
          throw error;
        }
      }

      // Execute handler
      const context: APIContext = { user, requestId, timestamp };
      const response = await handler(request, context);

      // Add security headers to response
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));

      return response;

    } catch (error) {
      // Log error securely
      logSecurityEvent('api_error', {
        requestId,
        path: request.nextUrl.pathname,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Return generic error (don't leak details)
      return NextResponse.json(
        { error: 'Internal server error', requestId },
        { 
          status: 500, 
          headers: { ...securityHeaders, 'X-Request-ID': requestId },
        }
      );
    }
  };
}

// =============================================================================
// AUDIT LOGGING
// =============================================================================

interface AuditLogEntry {
  timestamp: string;
  event: string;
  userId?: string;
  userEmail?: string;
  resourceType?: string;
  resourceId?: string;
  action?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log security-relevant events
 * TODO: Integrate with Cloud Logging for production
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown> = {}
): void {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...details,
  };

  // Mask sensitive data
  if (entry.userEmail) {
    entry.userEmail = maskEmail(entry.userEmail);
  }

  // In production, send to Cloud Logging
  // For now, log to console with structured format
  console.log(JSON.stringify({
    severity: 'INFO',
    component: 'security',
    ...entry,
  }));
}

/**
 * Log data access for audit trail
 */
export function logDataAccess(
  userId: string,
  resourceType: string,
  resourceId: string,
  action: 'read' | 'create' | 'update' | 'delete'
): void {
  logSecurityEvent('data_access', {
    userId,
    resourceType,
    resourceId,
    action,
  });
}

// =============================================================================
// ERROR RESPONSES
// =============================================================================

/**
 * Create standardized error response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  requestId?: string
): NextResponse {
  return NextResponse.json(
    { 
      error: message, 
      ...(requestId && { requestId }),
    },
    { 
      status,
      headers: {
        ...getSecurityHeaders(),
        ...(requestId && { 'X-Request-ID': requestId }),
      },
    }
  );
}

/**
 * Create standardized success response
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  requestId?: string
): NextResponse<T> {
  return NextResponse.json(data, {
    status,
    headers: {
      ...getSecurityHeaders(),
      ...(requestId && { 'X-Request-ID': requestId }),
    },
  });
}
