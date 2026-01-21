/**
 * Tenant API - Get current user's tenant information
 * GET /api/tenant
 * 
 * Returns the tenant information for the authenticated user.
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/firebase/admin';
import { getTenantIdForUser, getTenantById, isDemoUser, DEMO_TENANT_ID } from '@/lib/data';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if demo user
    const isDemo = isDemoUser(sessionUser.email || '');
    
    // Get tenant ID for user
    const tenantId = isDemo 
      ? DEMO_TENANT_ID 
      : await getTenantIdForUser(sessionUser.uid, sessionUser.email || '');

    if (!tenantId) {
      return NextResponse.json({
        success: true,
        tenant: null,
        isDemo,
        needsSetup: true,
      });
    }

    const tenant = await getTenantById(tenantId);

    return NextResponse.json({
      success: true,
      tenant: tenant ? {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        settings: tenant.settings,
      } : null,
      tenantId,
      isDemo,
      needsSetup: !tenant,
    });
  } catch (error) {
    console.error('Get tenant error:', error);
    return NextResponse.json(
      { error: 'Failed to get tenant' },
      { status: 500 }
    );
  }
}
