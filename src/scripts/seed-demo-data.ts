/**
 * Demo Data Seeding Script
 * 
 * Run this to populate the demo tenant with sample data.
 * Execute via: npx ts-node --esm src/scripts/seed-demo-data.ts
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import type { Load, Customer, Driver, Vehicle, Invoice, Expense } from '../lib/data/types';

const DEMO_TENANT_ID = 'demo-tenant';

// Initialize Firebase Admin
function initAdmin() {
  if (getApps().length > 0) return;
  
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    initializeApp({
      credential: cert(serviceAccount),
      projectId,
    });
  } else {
    initializeApp({ projectId });
  }
}

async function seedDemoData() {
  initAdmin();
  const db = getFirestore();
  
  console.log('🌱 Seeding demo data for tenant:', DEMO_TENANT_ID);
  
  // Create demo tenant if it doesn't exist
  const tenantRef = db.collection('tenants').doc(DEMO_TENANT_ID);
  const tenantDoc = await tenantRef.get();
  
  if (!tenantDoc.exists) {
    await tenantRef.set({
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ Created demo tenant');
  }
  
  // Seed Customers
  const customers: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      tenantId: DEMO_TENANT_ID,
      name: 'ABC Manufacturing',
      email: 'orders@abcmfg.com',
      phone: '555-0101',
      address: {
        street: '123 Industrial Blvd',
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
        country: 'USA',
      },
      contactName: 'John Smith',
      paymentTerms: 30,
      creditLimit: 50000,
      status: 'active',
    },
    {
      tenantId: DEMO_TENANT_ID,
      name: 'XYZ Distributors',
      email: 'logistics@xyzdist.com',
      phone: '555-0102',
      address: {
        street: '456 Commerce Way',
        city: 'Dallas',
        state: 'TX',
        zip: '75201',
        country: 'USA',
      },
      contactName: 'Jane Doe',
      paymentTerms: 15,
      creditLimit: 75000,
      status: 'active',
    },
    {
      tenantId: DEMO_TENANT_ID,
      name: 'Global Retail Inc',
      email: 'shipping@globalretail.com',
      phone: '555-0103',
      address: {
        street: '789 Retail Plaza',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'USA',
      },
      contactName: 'Mike Johnson',
      paymentTerms: 30,
      creditLimit: 100000,
      status: 'active',
    },
  ];
  
  const customerRefs: string[] = [];
  for (const customer of customers) {
    const docRef = await db.collection('customers').add({
      ...customer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    customerRefs.push(docRef.id);
    console.log(`✅ Created customer: ${customer.name}`);
  }
  
  // Seed Drivers
  const drivers: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>[] = [
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
      homeBase: {
        city: 'Dallas',
        state: 'TX',
        country: 'USA',
      },
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
      homeBase: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
      },
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
      homeBase: {
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
      },
    },
  ];
  
  const driverRefs: string[] = [];
  for (const driver of drivers) {
    const docRef = await db.collection('drivers').add({
      ...driver,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    driverRefs.push(docRef.id);
    console.log(`✅ Created driver: ${driver.firstName} ${driver.lastName}`);
  }
  
  // Seed Vehicles
  const vehicles: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>[] = [
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
      assignedDriverId: driverRefs[1],
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
    },
    {
      tenantId: DEMO_TENANT_ID,
      unitNumber: 'TRL-002',
      type: 'reefer',
      make: 'Utility',
      model: '3000R',
      year: 2022,
      vin: '1UYVS2539EU123456',
      licensePlate: 'TRL-2002',
      status: 'in-transit',
    },
  ];
  
  const vehicleRefs: string[] = [];
  for (const vehicle of vehicles) {
    const docRef = await db.collection('vehicles').add({
      ...vehicle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    vehicleRefs.push(docRef.id);
    console.log(`✅ Created vehicle: ${vehicle.unitNumber}`);
  }
  
  // Seed Loads
  const loads: Omit<Load, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      tenantId: DEMO_TENANT_ID,
      loadNumber: 'LD-2024-001',
      status: 'delivered',
      customerId: customerRefs[0],
      customerName: 'ABC Manufacturing',
      driverId: driverRefs[0],
      driverName: 'Robert Williams',
      vehicleId: vehicleRefs[0],
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
    },
    {
      tenantId: DEMO_TENANT_ID,
      loadNumber: 'LD-2024-002',
      status: 'in-transit',
      customerId: customerRefs[1],
      customerName: 'XYZ Distributors',
      driverId: driverRefs[1],
      driverName: 'Maria Garcia',
      vehicleId: vehicleRefs[1],
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
    },
    {
      tenantId: DEMO_TENANT_ID,
      loadNumber: 'LD-2024-003',
      status: 'booked',
      customerId: customerRefs[2],
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
    },
    {
      tenantId: DEMO_TENANT_ID,
      loadNumber: 'LD-2024-004',
      status: 'pending',
      customerId: customerRefs[0],
      customerName: 'ABC Manufacturing',
      stops: [
        {
          type: 'pickup',
          address: { street: '999 Cold Storage Ln', city: 'Atlanta', state: 'GA', zip: '30301' },
          scheduledDate: '2024-01-25',
          scheduledTime: '05:00',
          status: 'pending',
        },
        {
          type: 'delivery',
          address: { street: '111 Grocery Chain Blvd', city: 'Miami', state: 'FL', zip: '33101' },
          scheduledDate: '2024-01-26',
          scheduledTime: '08:00',
          status: 'pending',
        },
      ],
      rate: 2200,
      rateType: 'flat',
      distance: 665,
      weight: 38000,
      commodity: 'Frozen Foods',
      equipment: 'reefer',
      notes: 'Temperature controlled - maintain at -10°F',
    },
  ];
  
  const loadRefs: string[] = [];
  for (const load of loads) {
    const docRef = await db.collection('loads').add({
      ...load,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    loadRefs.push(docRef.id);
    console.log(`✅ Created load: ${load.loadNumber}`);
  }
  
  // Seed Invoices
  const invoices: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      tenantId: DEMO_TENANT_ID,
      invoiceNumber: 'INV-2024-001',
      loadId: loadRefs[0],
      loadNumber: 'LD-2024-001',
      customerId: customerRefs[0],
      customerName: 'ABC Manufacturing',
      status: 'paid',
      amount: 2850,
      tax: 0,
      total: 2850,
      dueDate: '2024-02-14',
      paidDate: '2024-02-10',
      paidAmount: 2850,
    },
    {
      tenantId: DEMO_TENANT_ID,
      invoiceNumber: 'INV-2024-002',
      loadId: loadRefs[1],
      loadNumber: 'LD-2024-002',
      customerId: customerRefs[1],
      customerName: 'XYZ Distributors',
      status: 'sent',
      amount: 1650,
      tax: 0,
      total: 1650,
      dueDate: '2024-02-05',
    },
  ];
  
  for (const invoice of invoices) {
    await db.collection('invoices').add({
      ...invoice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`✅ Created invoice: ${invoice.invoiceNumber}`);
  }
  
  // Seed Expenses
  const expenses: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      tenantId: DEMO_TENANT_ID,
      category: 'fuel',
      description: 'Fuel - Flying J #4521',
      amount: 485.32,
      date: '2024-01-15',
      vehicleId: vehicleRefs[0],
      vehicleNumber: 'TRK-001',
      driverId: driverRefs[0],
      driverName: 'Robert Williams',
      status: 'approved',
      paymentMethod: 'fuel-card',
    },
    {
      tenantId: DEMO_TENANT_ID,
      category: 'fuel',
      description: 'Fuel - Pilot Travel Center',
      amount: 523.18,
      date: '2024-01-20',
      vehicleId: vehicleRefs[1],
      vehicleNumber: 'TRK-002',
      driverId: driverRefs[1],
      driverName: 'Maria Garcia',
      status: 'approved',
      paymentMethod: 'fuel-card',
    },
    {
      tenantId: DEMO_TENANT_ID,
      category: 'maintenance',
      description: 'Oil change and filter replacement',
      amount: 285.00,
      date: '2024-01-18',
      vehicleId: vehicleRefs[0],
      vehicleNumber: 'TRK-001',
      status: 'approved',
      paymentMethod: 'company-card',
    },
    {
      tenantId: DEMO_TENANT_ID,
      category: 'tolls',
      description: 'Illinois Tollway - I-294',
      amount: 45.60,
      date: '2024-01-15',
      vehicleId: vehicleRefs[0],
      vehicleNumber: 'TRK-001',
      loadId: loadRefs[0],
      loadNumber: 'LD-2024-001',
      status: 'approved',
      paymentMethod: 'transponder',
    },
  ];
  
  for (const expense of expenses) {
    await db.collection('expenses').add({
      ...expense,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`✅ Created expense: ${expense.description}`);
  }
  
  console.log('\n🎉 Demo data seeding complete!');
  console.log(`   - ${customers.length} customers`);
  console.log(`   - ${drivers.length} drivers`);
  console.log(`   - ${vehicles.length} vehicles`);
  console.log(`   - ${loads.length} loads`);
  console.log(`   - ${invoices.length} invoices`);
  console.log(`   - ${expenses.length} expenses`);
}

seedDemoData().catch(console.error);
