/**
 * Dashboard API - Get dashboard statistics
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/firebase/admin';
import { getDashboardStats, tenantHasData, getTenantIdForUser, isDemoUser, DEMO_TENANT_ID } from '@/lib/data';

// GET /api/dashboard - Get dashboard stats for tenant
export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isDemo = isDemoUser(sessionUser.email || '');
    const tenantId = isDemo 
      ? DEMO_TENANT_ID 
      : await getTenantIdForUser(sessionUser.uid, sessionUser.email || '');

    if (!tenantId) {
      return NextResponse.json({ 
        error: 'No tenant found',
        needsSetup: true 
      }, { status: 404 });
    }

    // Check if tenant has any data
    const hasData = await tenantHasData(tenantId);

    if (!hasData) {
      // Return empty stats for new tenants
      return NextResponse.json({ 
        success: true,
        hasData: false,
        isDemo,
        stats: {
          totalLoads: 0,
          activeLoads: 0,
          completedLoads: 0,
          totalRevenue: 0,
          pendingInvoices: 0,
          activeDrivers: 0,
          activeVehicles: 0,
        }
      });
    }

    const stats = await getDashboardStats(tenantId);

    return NextResponse.json({ 
      success: true, 
      hasData: true,
      isDemo,
      stats 
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    return NextResponse.json({ error: 'Failed to get dashboard' }, { status: 500 });
  }
}
