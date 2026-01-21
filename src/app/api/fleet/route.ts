/**
 * Fleet API - CRUD operations for drivers and vehicles
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/firebase/admin';
import { driverService, vehicleService, getTenantIdForUser, isDemoUser, DEMO_TENANT_ID } from '@/lib/data';
import type { Driver, Vehicle } from '@/lib/data';

// GET /api/fleet - Get all drivers and vehicles for tenant
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'drivers', 'vehicles', or null for both

    if (type === 'drivers') {
      const drivers = await driverService.getAll(tenantId);
      return NextResponse.json({ success: true, drivers });
    }

    if (type === 'vehicles') {
      const vehicles = await vehicleService.getAll(tenantId);
      return NextResponse.json({ success: true, vehicles });
    }

    // Return both
    const [drivers, vehicles] = await Promise.all([
      driverService.getAll(tenantId),
      vehicleService.getAll(tenantId),
    ]);

    return NextResponse.json({ success: true, drivers, vehicles });
  } catch (error) {
    console.error('Get fleet error:', error);
    return NextResponse.json({ error: 'Failed to get fleet' }, { status: 500 });
  }
}

// POST /api/fleet - Create a driver or vehicle
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
    const { type, ...data } = body;

    if (type === 'driver') {
      const driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'> = {
        ...data,
        tenantId,
      };
      const driver = await driverService.create(tenantId, driverData);
      return NextResponse.json({ success: true, driver }, { status: 201 });
    }

    if (type === 'vehicle') {
      const vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'> = {
        ...data,
        tenantId,
      };
      const vehicle = await vehicleService.create(tenantId, vehicleData);
      return NextResponse.json({ success: true, vehicle }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid type. Must be "driver" or "vehicle"' }, { status: 400 });
  } catch (error) {
    console.error('Create fleet item error:', error);
    return NextResponse.json({ error: 'Failed to create fleet item' }, { status: 500 });
  }
}
