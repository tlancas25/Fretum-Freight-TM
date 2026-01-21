/**
 * Loads API - CRUD operations for loads
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/firebase/admin';
import { loadService, getTenantIdForUser, isDemoUser, DEMO_TENANT_ID } from '@/lib/data';
import type { Load, LoadStatus } from '@/lib/data';

// GET /api/loads - Get all loads for tenant
// GET /api/loads?status=in-transit - Filter by status
export async function GET(request: NextRequest) {
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
      return NextResponse.json({ error: 'No tenant found' }, { status: 404 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as LoadStatus | null;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    let loads;
    if (status) {
      loads = await loadService.getByStatus(tenantId, status);
    } else {
      loads = await loadService.getAll(tenantId, limit);
    }

    return NextResponse.json({ success: true, loads });
  } catch (error) {
    console.error('Get loads error:', error);
    return NextResponse.json({ error: 'Failed to get loads' }, { status: 500 });
  }
}

// POST /api/loads - Create a new load
export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: 'No tenant found' }, { status: 404 });
    }

    const body = await request.json();
    
    // Create the load with tenant ID
    const loadData: Omit<Load, 'id' | 'createdAt' | 'updatedAt' | 'loadNumber'> = {
      ...body,
      tenantId,
    };

    const load = await loadService.create(tenantId, loadData);

    return NextResponse.json({ success: true, load }, { status: 201 });
  } catch (error) {
    console.error('Create load error:', error);
    return NextResponse.json({ error: 'Failed to create load' }, { status: 500 });
  }
}
