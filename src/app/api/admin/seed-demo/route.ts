/**
 * Seed Demo Data API - Create sample data for demo tenant
 * POST /api/admin/seed-demo
 * 
 * This endpoint seeds the demo tenant with sample data.
 * Only works for demo users or in development.
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/firebase/admin';
import { getFirestoreDb, collection, addDoc, doc, getDoc, setDoc } from '@/lib/firebase/firestore';
import { isDemoUser, DEMO_TENANT_ID, tenantHasData } from '@/lib/data';

export async function POST() {
  try {
    const sessionUser = await getSessionUser();
    
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow demo users or development
    const isDemo = isDemoUser(sessionUser.email || '');
    const isDev = process.env.NODE_ENV === 'development';
    
    if (!isDemo && !isDev) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    // Check if demo data already exists
    const hasData = await tenantHasData(DEMO_TENANT_ID);
    if (hasData) {
      return NextResponse.json({ 
        success: true, 
        message: 'Demo data already exists',
        skipped: true 
      });
    }

    const db = getFirestoreDb();
    const now = new Date().toISOString();

    // Create or update demo tenant
    const tenantRef = doc(db, 'tenants', DEMO_TENANT_ID);
    const tenantDoc = await getDoc(tenantRef);
    
    if (!tenantDoc.exists()) {
      await setDoc(tenantRef, {
        id: DEMO_TENANT_ID,
        name: 'Demo Transportation Co',
        slug: 'demo',
        ownerId: 'demo-owner',
        ownerEmail: 'test@test.com',
        settings: {
          companyName: 'Demo Transportation Co',
          timezone: 'America/New_York',
          currency: 'USD',
          distanceUnit: 'miles',
          fuelUnit: 'gallons',
        },
        createdAt: now,
        updatedAt: now,
      });
    }

    // Seed customers
    const customers = [
      {
        tenantId: DEMO_TENANT_ID,
        name: 'ABC Manufacturing',
        email: 'orders@abcmfg.com',
        phone: '555-0101',
        address: { street: '123 Industrial Blvd', city: 'Chicago', state: 'IL', zip: '60601', country: 'USA' },
        contactName: 'John Smith',
        paymentTerms: 30,
        creditLimit: 50000,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        tenantId: DEMO_TENANT_ID,
        name: 'XYZ Distributors',
        email: 'logistics@xyzdist.com',
        phone: '555-0102',
        address: { street: '456 Commerce Way', city: 'Dallas', state: 'TX', zip: '75201', country: 'USA' },
        contactName: 'Jane Doe',
        paymentTerms: 15,
        creditLimit: 75000,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        tenantId: DEMO_TENANT_ID,
        name: 'Global Retail Inc',
        email: 'shipping@globalretail.com',
        phone: '555-0103',
        address: { street: '789 Retail Plaza', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'USA' },
        contactName: 'Mike Johnson',
        paymentTerms: 30,
        creditLimit: 100000,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    const customerIds: string[] = [];
    for (const customer of customers) {
      const docRef = await addDoc(collection(db, 'customers'), customer);
      customerIds.push(docRef.id);
    }

    // Seed drivers
    const drivers = [
      {
        tenantId: DEMO_TENANT_ID,
        firstName: 'Robert',
        lastName: 'Williams',
        email: 'rwilliams@demo.com',
        phone: '555-1001',
        licenseNumber: 'CDL-12345',
        licenseState: 'TX',
        licenseExpiry: '2026-06-15',
        status: 'available',
        payType: 'per-mile',
        payRate: 0.65,
        homeBase: { city: 'Dallas', state: 'TX', country: 'USA' },
        createdAt: now,
        updatedAt: now,
      },
      {
        tenantId: DEMO_TENANT_ID,
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'mgarcia@demo.com',
        phone: '555-1002',
        licenseNumber: 'CDL-67890',
        licenseState: 'CA',
        licenseExpiry: '2025-12-01',
        status: 'on-trip',
        payType: 'per-mile',
        payRate: 0.68,
        homeBase: { city: 'Los Angeles', state: 'CA', country: 'USA' },
        createdAt: now,
        updatedAt: now,
      },
      {
        tenantId: DEMO_TENANT_ID,
        firstName: 'James',
        lastName: 'Brown',
        email: 'jbrown@demo.com',
        phone: '555-1003',
        licenseNumber: 'CDL-11223',
        licenseState: 'IL',
        licenseExpiry: '2026-03-20',
        status: 'available',
        payType: 'hourly',
        payRate: 28.50,
        homeBase: { city: 'Chicago', state: 'IL', country: 'USA' },
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    const driverIds: string[] = [];
    for (const driver of drivers) {
      const docRef = await addDoc(collection(db, 'drivers'), driver);
      driverIds.push(docRef.id);
    }

    // Seed vehicles
    const vehicles = [
      {
        tenantId: DEMO_TENANT_ID,
        unitNumber: 'TRK-001',
        type: 'semi',
        make: 'Freightliner',
        model: 'Cascadia',
        year: 2022,
        vin: '1FUJGLDR5CLBP1234',
        licensePlate: 'ABC-1234',
        status: 'available',
        currentLocation: { lat: 32.7767, lng: -96.7970 },
        fuelType: 'diesel',
        mpg: 7.5,
        createdAt: now,
        updatedAt: now,
      },
      {
        tenantId: DEMO_TENANT_ID,
        unitNumber: 'TRK-002',
        type: 'semi',
        make: 'Peterbilt',
        model: '579',
        year: 2023,
        vin: '1XPWD49X1ED123456',
        licensePlate: 'XYZ-5678',
        status: 'in-transit',
        currentLocation: { lat: 34.0522, lng: -118.2437 },
        fuelType: 'diesel',
        mpg: 7.8,
        assignedDriverId: driverIds[1],
        createdAt: now,
        updatedAt: now,
      },
      {
        tenantId: DEMO_TENANT_ID,
        unitNumber: 'TRL-001',
        type: 'dry-van',
        make: 'Great Dane',
        model: 'Classic',
        year: 2021,
        vin: '1GRAA0622HB123456',
        licensePlate: 'TRL-1001',
        status: 'available',
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    const vehicleIds: string[] = [];
    for (const vehicle of vehicles) {
      const docRef = await addDoc(collection(db, 'vehicles'), vehicle);
      vehicleIds.push(docRef.id);
    }

    // Seed loads
    const loads = [
      {
        tenantId: DEMO_TENANT_ID,
        loadNumber: 'LD-2024-001',
        status: 'delivered',
        customerId: customerIds[0],
        customerName: 'ABC Manufacturing',
        driverId: driverIds[0],
        driverName: 'Robert Williams',
        vehicleId: vehicleIds[0],
        vehicleNumber: 'TRK-001',
        stops: [
          {
            type: 'pickup',
            address: { street: '123 Industrial Blvd', city: 'Chicago', state: 'IL', zip: '60601' },
            scheduledDate: '2024-01-15',
            scheduledTime: '08:00',
            actualDate: '2024-01-15',
            actualTime: '08:15',
            status: 'completed',
          },
          {
            type: 'delivery',
            address: { street: '456 Commerce Way', city: 'Dallas', state: 'TX', zip: '75201' },
            scheduledDate: '2024-01-16',
            scheduledTime: '14:00',
            actualDate: '2024-01-16',
            actualTime: '13:45',
            status: 'completed',
          },
        ],
        rate: 2850,
        rateType: 'flat',
        distance: 920,
        weight: 42000,
        commodity: 'Industrial Equipment',
        equipment: 'dry-van',
        createdAt: now,
        updatedAt: now,
      },
      {
        tenantId: DEMO_TENANT_ID,
        loadNumber: 'LD-2024-002',
        status: 'in-transit',
        customerId: customerIds[1],
        customerName: 'XYZ Distributors',
        driverId: driverIds[1],
        driverName: 'Maria Garcia',
        vehicleId: vehicleIds[1],
        vehicleNumber: 'TRK-002',
        stops: [
          {
            type: 'pickup',
            address: { street: '789 Retail Plaza', city: 'Los Angeles', state: 'CA', zip: '90001' },
            scheduledDate: '2024-01-20',
            scheduledTime: '06:00',
            actualDate: '2024-01-20',
            actualTime: '06:10',
            status: 'completed',
          },
          {
            type: 'delivery',
            address: { street: '321 Warehouse Rd', city: 'Phoenix', state: 'AZ', zip: '85001' },
            scheduledDate: '2024-01-20',
            scheduledTime: '18:00',
            status: 'pending',
          },
        ],
        rate: 1650,
        rateType: 'flat',
        distance: 370,
        weight: 35000,
        commodity: 'Consumer Electronics',
        equipment: 'dry-van',
        createdAt: now,
        updatedAt: now,
      },
      {
        tenantId: DEMO_TENANT_ID,
        loadNumber: 'LD-2024-003',
        status: 'booked',
        customerId: customerIds[2],
        customerName: 'Global Retail Inc',
        stops: [
          {
            type: 'pickup',
            address: { street: '555 Manufacturing Dr', city: 'Detroit', state: 'MI', zip: '48201' },
            scheduledDate: '2024-01-22',
            scheduledTime: '07:00',
            status: 'pending',
          },
          {
            type: 'delivery',
            address: { street: '777 Distribution Center', city: 'Columbus', state: 'OH', zip: '43201' },
            scheduledDate: '2024-01-22',
            scheduledTime: '15:00',
            status: 'pending',
          },
        ],
        rate: 980,
        rateType: 'flat',
        distance: 185,
        weight: 28000,
        commodity: 'Auto Parts',
        equipment: 'dry-van',
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    const loadIds: string[] = [];
    for (const load of loads) {
      const docRef = await addDoc(collection(db, 'loads'), load);
      loadIds.push(docRef.id);
    }

    // Seed invoices
    const invoices = [
      {
        tenantId: DEMO_TENANT_ID,
        invoiceNumber: 'INV-2024-001',
        loadId: loadIds[0],
        loadNumber: 'LD-2024-001',
        customerId: customerIds[0],
        customerName: 'ABC Manufacturing',
        status: 'paid',
        amount: 2850,
        tax: 0,
        total: 2850,
        dueDate: '2024-02-14',
        paidDate: '2024-02-10',
        paidAmount: 2850,
        createdAt: now,
        updatedAt: now,
      },
      {
        tenantId: DEMO_TENANT_ID,
        invoiceNumber: 'INV-2024-002',
        loadId: loadIds[1],
        loadNumber: 'LD-2024-002',
        customerId: customerIds[1],
        customerName: 'XYZ Distributors',
        status: 'sent',
        amount: 1650,
        tax: 0,
        total: 1650,
        dueDate: '2024-02-05',
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    for (const invoice of invoices) {
      await addDoc(collection(db, 'invoices'), invoice);
    }

    // Seed expenses
    const expenses = [
      {
        tenantId: DEMO_TENANT_ID,
        category: 'fuel',
        description: 'Fuel - Flying J #4521',
        amount: 485.32,
        date: '2024-01-15',
        vehicleId: vehicleIds[0],
        vehicleNumber: 'TRK-001',
        driverId: driverIds[0],
        driverName: 'Robert Williams',
        status: 'approved',
        paymentMethod: 'fuel-card',
        createdAt: now,
        updatedAt: now,
      },
      {
        tenantId: DEMO_TENANT_ID,
        category: 'fuel',
        description: 'Fuel - Pilot Travel Center',
        amount: 523.18,
        date: '2024-01-20',
        vehicleId: vehicleIds[1],
        vehicleNumber: 'TRK-002',
        driverId: driverIds[1],
        driverName: 'Maria Garcia',
        status: 'approved',
        paymentMethod: 'fuel-card',
        createdAt: now,
        updatedAt: now,
      },
      {
        tenantId: DEMO_TENANT_ID,
        category: 'maintenance',
        description: 'Oil change and filter replacement',
        amount: 285.00,
        date: '2024-01-18',
        vehicleId: vehicleIds[0],
        vehicleNumber: 'TRK-001',
        status: 'approved',
        paymentMethod: 'company-card',
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    for (const expense of expenses) {
      await addDoc(collection(db, 'expenses'), expense);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Demo data seeded successfully',
      counts: {
        customers: customers.length,
        drivers: drivers.length,
        vehicles: vehicles.length,
        loads: loads.length,
        invoices: invoices.length,
        expenses: expenses.length,
      }
    });
  } catch (error) {
    console.error('Seed demo error:', error);
    return NextResponse.json({ error: 'Failed to seed demo data' }, { status: 500 });
  }
}
