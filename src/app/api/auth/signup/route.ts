/**
 * Signup API - Create user account and tenant
 * POST /api/auth/signup
 * 
 * Creates a new tenant for the user after Firebase signup.
 * Idempotent - safe to call multiple times for the same user.
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase/admin';
import { 
  createTenant, 
  addUserToTenant, 
  getOrCreateDemoTenant, 
  isDemoUser, 
  getUserTenantId,
  getTenantById,
  DEMO_TENANT_ID 
} from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, companyName } = body;

    if (!idToken) {
      return NextResponse.json(
        { error: 'Missing ID token' },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await verifyIdToken(idToken);
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid ID token' },
        { status: 401 }
      );
    }

    const { uid, email, name } = decodedToken;

    // Check if this is a demo user
    if (isDemoUser(email || '')) {
      // Demo users get the demo tenant
      await getOrCreateDemoTenant();
      
      // Add user to demo tenant if not already added
      try {
        await addUserToTenant(DEMO_TENANT_ID, {
          uid,
          email: email || '',
          displayName: name || email || 'Demo User',
          role: 'admin',
          status: 'active',
        });
      } catch {
        // User might already exist in demo tenant, that's okay
      }

      return NextResponse.json({
        success: true,
        tenantId: DEMO_TENANT_ID,
        isDemo: true,
      });
    }

    // Check if user already has a tenant (idempotent)
    const existingTenantId = await getUserTenantId(uid);
    if (existingTenantId) {
      const existingTenant = await getTenantById(existingTenantId);
      return NextResponse.json({
        success: true,
        tenantId: existingTenantId,
        tenantSlug: existingTenant?.slug,
        isDemo: false,
        existing: true,
      });
    }

    // Regular users get their own tenant
    const finalCompanyName = companyName || name || 'My Company';
    
    const tenant = await createTenant(uid, email || '', finalCompanyName);

    return NextResponse.json({
      success: true,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      isDemo: false,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to complete signup' },
      { status: 500 }
    );
  }
}
