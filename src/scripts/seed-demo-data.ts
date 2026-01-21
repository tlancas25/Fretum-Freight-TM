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
        zipCode: '60601',
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
        zipCode: '75201',
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
        zipCode: '90001',
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
      licenseExpiry: new Date('2026-06-15'),
      hireDate: new Date('2022-03-15'),
      status: 'available',
      payType: 'per-mile',
      payRate: 0.65,
      address: {
        street: '123 Trucker Lane',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201',
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
      licenseExpiry: new Date('2025-12-01'),
      hireDate: new Date('2021-08-01'),
      status: 'on-load',
      payType: 'per-mile',
      payRate: 0.68,
      address: {
        street: '456 Driver Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
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
      licenseExpiry: new Date('2026-03-20'),
      hireDate: new Date('2023-01-10'),
      status: 'available',
      payType: 'hourly',
      payRate: 28.50,
      address: {
        street: '789 Highway St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
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
      type: 'tractor',
      make: 'Freightliner',
      model: 'Cascadia',
      year: 2022,
      vin: '1FUJGLDR5CLBP1234',
      licensePlate: 'ABC-1234',
      licensePlateState: 'TX',
      status: 'active',
      fuelType: 'diesel',
      lastLocation: { lat: 32.7767, lng: -96.7970, timestamp: new Date() },
    },
    {
      tenantId: DEMO_TENANT_ID,
      unitNumber: 'TRK-002',
      type: 'tractor',
      make: 'Peterbilt',
      model: '579',
      year: 2023,
      vin: '1XPWD49X1ED123456',
      licensePlate: 'XYZ-5678',
      licensePlateState: 'CA',
      status: 'active',
      fuelType: 'diesel',
      lastLocation: { lat: 34.0522, lng: -118.2437, timestamp: new Date() },
      assignedDriverId: driverRefs[1],
    },
    {
      tenantId: DEMO_TENANT_ID,
      unitNumber: 'TRL-001',
      type: 'trailer',
      make: 'Great Dane',
      model: 'Classic Dry Van',
      year: 2021,
      vin: '1GRAA0622HB123456',
      licensePlate: 'TRL-1001',
      licensePlateState: 'TX',
      status: 'active',
    },
    {
      tenantId: DEMO_TENANT_ID,
      unitNumber: 'TRL-002',
      type: 'trailer',
      make: 'Utility',
      model: '3000R Reefer',
      year: 2022,
      vin: '1UYVS2539EU123456',
      licensePlate: 'TRL-2002',
      licensePlateState: 'CA',
      status: 'active',
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
          address: { street: '123 Industrial Blvd', city: 'Chicago', state: 'IL', zipCode: '60601', country: 'USA' },
          scheduledDate: new Date('2024-01-15'),
          scheduledTime: '08:00',
          actualArrival: new Date('2024-01-15T08:15:00'),
          actualDeparture: new Date('2024-01-15T09:30:00'),
        },
        {
          type: 'delivery',
          address: { street: '456 Commerce Way', city: 'Dallas', state: 'TX', zipCode: '75201', country: 'USA' },
          scheduledDate: new Date('2024-01-16'),
          scheduledTime: '14:00',
          actualArrival: new Date('2024-01-16T13:45:00'),
          actualDeparture: new Date('2024-01-16T15:00:00'),
        },
      ],
      rate: 2850,
      rateType: 'flat',
      miles: 920,
      weight: 42000,
      weightUnit: 'lbs',
      totalAmount: 2850,
      commodity: 'Industrial Equipment',
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
          address: { street: '789 Retail Plaza', city: 'Los Angeles', state: 'CA', zipCode: '90001', country: 'USA' },
          scheduledDate: new Date('2024-01-20'),
          scheduledTime: '06:00',
          actualArrival: new Date('2024-01-20T06:10:00'),
          actualDeparture: new Date('2024-01-20T07:30:00'),
        },
        {
          type: 'delivery',
          address: { street: '321 Warehouse Rd', city: 'Phoenix', state: 'AZ', zipCode: '85001', country: 'USA' },
          scheduledDate: new Date('2024-01-20'),
          scheduledTime: '18:00',
        },
      ],
      rate: 1650,
      rateType: 'flat',
      miles: 370,
      weight: 35000,
      weightUnit: 'lbs',
      totalAmount: 1650,
      commodity: 'Consumer Electronics',
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
          address: { street: '555 Manufacturing Dr', city: 'Detroit', state: 'MI', zipCode: '48201', country: 'USA' },
          scheduledDate: new Date('2024-01-22'),
          scheduledTime: '07:00',
        },
        {
          type: 'delivery',
          address: { street: '777 Distribution Center', city: 'Columbus', state: 'OH', zipCode: '43201', country: 'USA' },
          scheduledDate: new Date('2024-01-22'),
          scheduledTime: '15:00',
        },
      ],
      rate: 980,
      rateType: 'flat',
      miles: 185,
      weight: 28000,
      weightUnit: 'lbs',
      totalAmount: 980,
      commodity: 'Auto Parts',
    },
    {
      tenantId: DEMO_TENANT_ID,
      loadNumber: 'LD-2024-004',
      status: 'quote',
      customerId: customerRefs[0],
      customerName: 'ABC Manufacturing',
      stops: [
        {
          type: 'pickup',
          address: { street: '999 Cold Storage Ln', city: 'Atlanta', state: 'GA', zipCode: '30301', country: 'USA' },
          scheduledDate: new Date('2024-01-25'),
          scheduledTime: '05:00',
        },
        {
          type: 'delivery',
          address: { street: '111 Grocery Chain Blvd', city: 'Miami', state: 'FL', zipCode: '33101', country: 'USA' },
          scheduledDate: new Date('2024-01-26'),
          scheduledTime: '08:00',
        },
      ],
      rate: 2200,
      rateType: 'flat',
      miles: 665,
      weight: 38000,
      weightUnit: 'lbs',
      totalAmount: 2200,
      commodity: 'Frozen Foods',
      dispatchNotes: 'Temperature controlled - maintain at -10°F',
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
      customerId: customerRefs[0],
      customerName: 'ABC Manufacturing',
      customerEmail: 'orders@abcmfg.com',
      billingAddress: { street: '123 Industrial Blvd', city: 'Chicago', state: 'IL', zipCode: '60601', country: 'USA' },
      status: 'paid',
      lineItems: [
        {
          loadId: loadRefs[0],
          loadNumber: 'LD-2024-001',
          description: 'Freight - Chicago to Dallas',
          quantity: 1,
          unitPrice: 2850,
          amount: 2850,
        },
      ],
      subtotal: 2850,
      totalAmount: 2850,
      issueDate: new Date('2024-01-17'),
      dueDate: new Date('2024-02-14'),
      paidDate: new Date('2024-02-10'),
    },
    {
      tenantId: DEMO_TENANT_ID,
      invoiceNumber: 'INV-2024-002',
      customerId: customerRefs[1],
      customerName: 'XYZ Distributors',
      customerEmail: 'logistics@xyzdist.com',
      billingAddress: { street: '456 Commerce Way', city: 'Dallas', state: 'TX', zipCode: '75201', country: 'USA' },
      status: 'sent',
      lineItems: [
        {
          loadId: loadRefs[1],
          loadNumber: 'LD-2024-002',
          description: 'Freight - Los Angeles to Phoenix',
          quantity: 1,
          unitPrice: 1650,
          amount: 1650,
        },
      ],
      subtotal: 1650,
      totalAmount: 1650,
      issueDate: new Date('2024-01-21'),
      dueDate: new Date('2024-02-05'),
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
      date: new Date('2024-01-15'),
      vehicleId: vehicleRefs[0],
      vehicleNumber: 'TRK-001',
      driverId: driverRefs[0],
      driverName: 'Robert Williams',
      reimbursable: false,
      paymentMethod: 'fuel-card',
    },
    {
      tenantId: DEMO_TENANT_ID,
      category: 'fuel',
      description: 'Fuel - Pilot Travel Center',
      amount: 523.18,
      date: new Date('2024-01-20'),
      vehicleId: vehicleRefs[1],
      vehicleNumber: 'TRK-002',
      driverId: driverRefs[1],
      driverName: 'Maria Garcia',
      reimbursable: false,
      paymentMethod: 'fuel-card',
    },
    {
      tenantId: DEMO_TENANT_ID,
      category: 'maintenance',
      description: 'Oil change and filter replacement',
      amount: 285.00,
      date: new Date('2024-01-18'),
      vehicleId: vehicleRefs[0],
      vehicleNumber: 'TRK-001',
      reimbursable: false,
      paymentMethod: 'company-card',
    },
    {
      tenantId: DEMO_TENANT_ID,
      category: 'tolls',
      description: 'Illinois Tollway - I-294',
      amount: 45.60,
      date: new Date('2024-01-15'),
      vehicleId: vehicleRefs[0],
      vehicleNumber: 'TRK-001',
      loadId: loadRefs[0],
      loadNumber: 'LD-2024-001',
      reimbursable: false,
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
