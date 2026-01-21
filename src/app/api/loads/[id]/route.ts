/**
 * Single Load API - Get/Update/Delete a specific load
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/firebase/admin';
import { loadService, getTenantIdForUser, isDemoUser, DEMO_TENANT_ID } from '@/lib/data';

type Params = { params: Promise<{ id: string }> };

// GET /api/loads/[id] - Get a specific load
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const sessionUser = await getSessionUser();
    
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const isDemo = isDemoUser(sessionUser.email || '');
    const tenantId = isDemo 
      ? DEMO_TENANT_ID 
      : await getTenantIdForUser(sessionUser.uid, sessionUser.email || '');

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant found' }, { status: 404 });
    }

    const load = await loadService.getById(tenantId, id);

    if (!load) {
      return NextResponse.json({ error: 'Load not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, load });
  } catch (error) {
    console.error('Get load error:', error);
    return NextResponse.json({ error: 'Failed to get load' }, { status: 500 });
  }
}

// PATCH /api/loads/[id] - Update a load
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const sessionUser = await getSessionUser();
    
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const isDemo = isDemoUser(sessionUser.email || '');
    const tenantId = isDemo 
      ? DEMO_TENANT_ID 
      : await getTenantIdForUser(sessionUser.uid, sessionUser.email || '');

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant found' }, { status: 404 });
    }

    const body = await request.json();
    
    await loadService.update(tenantId, id, body);
    const updatedLoad = await loadService.getById(tenantId, id);

    return NextResponse.json({ success: true, load: updatedLoad });
  } catch (error) {
    console.error('Update load error:', error);
    return NextResponse.json({ error: 'Failed to update load' }, { status: 500 });
  }
}

// DELETE /api/loads/[id] - Delete a load
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const sessionUser = await getSessionUser();
    
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const isDemo = isDemoUser(sessionUser.email || '');
    const tenantId = isDemo 
      ? DEMO_TENANT_ID 
      : await getTenantIdForUser(sessionUser.uid, sessionUser.email || '');

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant found' }, { status: 404 });
    }

    await loadService.delete(tenantId, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete load error:', error);
    return NextResponse.json({ error: 'Failed to delete load' }, { status: 500 });
  }
}
