/**
 * Customers API - CRUD operations for customers
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/firebase/admin';
import { customerService, getTenantIdForUser, isDemoUser, DEMO_TENANT_ID } from '@/lib/data';
import type { Customer } from '@/lib/data';

// GET /api/customers - Get all customers for tenant
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
      return NextResponse.json({ error: 'No tenant found' }, { status: 404 });
    }

    const customers = await customerService.getAll(tenantId);

    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json({ error: 'Failed to get customers' }, { status: 500 });
  }
}

// POST /api/customers - Create a new customer
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
    
    const customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> = {
      ...body,
      tenantId,
    };

    const customer = await customerService.create(tenantId, customerData);

    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch (error) {
    console.error('Create customer error:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
