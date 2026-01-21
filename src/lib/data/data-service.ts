/**
 * Data Service - Fretum-Freight TMS
 * 
 * CRUD operations for all entities with tenant isolation.
 * All queries are automatically scoped by tenantId.
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import {
  getFirestoreDb,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  QueryConstraint,
} from '@/lib/firebase/firestore';
import {
  Load,
  Customer,
  Driver,
  Vehicle,
  Invoice,
  Settlement,
  Expense,
  BaseEntity,
  DEMO_TENANT_ID,
} from './types';

// =============================================================================
// GENERIC CRUD OPERATIONS
// =============================================================================

type CollectionName = 'loads' | 'customers' | 'drivers' | 'vehicles' | 'invoices' | 'settlements' | 'expenses';

/**
 * Get all documents in a collection for a tenant
 */
async function getAll<T extends BaseEntity>(
  collectionName: CollectionName,
  tenantId: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const db = getFirestoreDb();
  const q = query(
    collection(db, collectionName),
    where('tenantId', '==', tenantId),
    ...constraints
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

/**
 * Get a single document by ID
 */
async function getById<T extends BaseEntity>(
  collectionName: CollectionName,
  tenantId: string,
  docId: string
): Promise<T | null> {
  const db = getFirestoreDb();
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  const data = docSnap.data();
  
  // Verify tenant ownership
  if (data.tenantId !== tenantId) {
    return null;
  }
  
  return { id: docSnap.id, ...data } as T;
}

/**
 * Create a new document
 */
async function create<T extends BaseEntity>(
  collectionName: CollectionName,
  tenantId: string,
  data: Omit<T, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>,
  customId?: string
): Promise<T> {
  const db = getFirestoreDb();
  const docId = customId || `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const docRef = doc(db, collectionName, docId);
  
  const document = {
    ...data,
    id: docId,
    tenantId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  await setDoc(docRef, document);
  
  return {
    ...document,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as T;
}

/**
 * Update a document
 */
async function update<T extends BaseEntity>(
  collectionName: CollectionName,
  tenantId: string,
  docId: string,
  data: Partial<T>
): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, collectionName, docId);
  
  // Verify ownership first
  const existing = await getDoc(docRef);
  if (!existing.exists() || existing.data().tenantId !== tenantId) {
    throw new Error('Document not found or access denied');
  }
  
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a document
 */
async function remove(
  collectionName: CollectionName,
  tenantId: string,
  docId: string
): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, collectionName, docId);
  
  // Verify ownership first
  const existing = await getDoc(docRef);
  if (!existing.exists() || existing.data().tenantId !== tenantId) {
    throw new Error('Document not found or access denied');
  }
  
  await deleteDoc(docRef);
}

// =============================================================================
// LOAD OPERATIONS
// =============================================================================

export const loadService = {
  async getAll(tenantId: string, maxResults?: number): Promise<Load[]> {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
    if (maxResults) {
      constraints.push(limit(maxResults));
    }
    return getAll<Load>('loads', tenantId, constraints);
  },
  
  async getById(tenantId: string, loadId: string): Promise<Load | null> {
    return getById<Load>('loads', tenantId, loadId);
  },
  
  async getByStatus(tenantId: string, status: Load['status']): Promise<Load[]> {
    return getAll<Load>('loads', tenantId, [
      where('status', '==', status),
      orderBy('createdAt', 'desc'),
    ]);
  },
  
  async getActiveLoads(tenantId: string): Promise<Load[]> {
    const db = getFirestoreDb();
    const q = query(
      collection(db, 'loads'),
      where('tenantId', '==', tenantId),
      where('status', 'in', ['booked', 'dispatched', 'in-transit']),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Load[];
  },
  
  async create(tenantId: string, data: Omit<Load, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'loadNumber'>): Promise<Load> {
    // Generate load number
    const loadNumber = await generateLoadNumber(tenantId);
    return create<Load>('loads', tenantId, { ...data, loadNumber });
  },
  
  async update(tenantId: string, loadId: string, data: Partial<Load>): Promise<void> {
    return update<Load>('loads', tenantId, loadId, data);
  },
  
  async delete(tenantId: string, loadId: string): Promise<void> {
    return remove('loads', tenantId, loadId);
  },
  
  async getCount(tenantId: string): Promise<number> {
    const loads = await getAll<Load>('loads', tenantId);
    return loads.length;
  },
};

// =============================================================================
// CUSTOMER OPERATIONS
// =============================================================================

export const customerService = {
  async getAll(tenantId: string): Promise<Customer[]> {
    return getAll<Customer>('customers', tenantId, [orderBy('name', 'asc')]);
  },
  
  async getById(tenantId: string, customerId: string): Promise<Customer | null> {
    return getById<Customer>('customers', tenantId, customerId);
  },
  
  async getActive(tenantId: string): Promise<Customer[]> {
    return getAll<Customer>('customers', tenantId, [
      where('status', '==', 'active'),
      orderBy('name', 'asc'),
    ]);
  },
  
  async create(tenantId: string, data: Omit<Customer, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    return create<Customer>('customers', tenantId, data);
  },
  
  async update(tenantId: string, customerId: string, data: Partial<Customer>): Promise<void> {
    return update<Customer>('customers', tenantId, customerId, data);
  },
  
  async delete(tenantId: string, customerId: string): Promise<void> {
    return remove('customers', tenantId, customerId);
  },
  
  async getCount(tenantId: string): Promise<number> {
    const customers = await getAll<Customer>('customers', tenantId);
    return customers.length;
  },
};

// =============================================================================
// DRIVER OPERATIONS
// =============================================================================

export const driverService = {
  async getAll(tenantId: string): Promise<Driver[]> {
    return getAll<Driver>('drivers', tenantId, [orderBy('lastName', 'asc')]);
  },
  
  async getById(tenantId: string, driverId: string): Promise<Driver | null> {
    return getById<Driver>('drivers', tenantId, driverId);
  },
  
  async getAvailable(tenantId: string): Promise<Driver[]> {
    return getAll<Driver>('drivers', tenantId, [
      where('status', '==', 'available'),
      orderBy('lastName', 'asc'),
    ]);
  },
  
  async create(tenantId: string, data: Omit<Driver, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Driver> {
    return create<Driver>('drivers', tenantId, data);
  },
  
  async update(tenantId: string, driverId: string, data: Partial<Driver>): Promise<void> {
    return update<Driver>('drivers', tenantId, driverId, data);
  },
  
  async delete(tenantId: string, driverId: string): Promise<void> {
    return remove('drivers', tenantId, driverId);
  },
  
  async getCount(tenantId: string): Promise<number> {
    const drivers = await getAll<Driver>('drivers', tenantId);
    return drivers.length;
  },
};

// =============================================================================
// VEHICLE OPERATIONS
// =============================================================================

export const vehicleService = {
  async getAll(tenantId: string): Promise<Vehicle[]> {
    return getAll<Vehicle>('vehicles', tenantId, [orderBy('unitNumber', 'asc')]);
  },
  
  async getById(tenantId: string, vehicleId: string): Promise<Vehicle | null> {
    return getById<Vehicle>('vehicles', tenantId, vehicleId);
  },
  
  async getActive(tenantId: string): Promise<Vehicle[]> {
    return getAll<Vehicle>('vehicles', tenantId, [
      where('status', '==', 'active'),
      orderBy('unitNumber', 'asc'),
    ]);
  },
  
  async getByType(tenantId: string, type: Vehicle['type']): Promise<Vehicle[]> {
    return getAll<Vehicle>('vehicles', tenantId, [
      where('type', '==', type),
      orderBy('unitNumber', 'asc'),
    ]);
  },
  
  async create(tenantId: string, data: Omit<Vehicle, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    return create<Vehicle>('vehicles', tenantId, data);
  },
  
  async update(tenantId: string, vehicleId: string, data: Partial<Vehicle>): Promise<void> {
    return update<Vehicle>('vehicles', tenantId, vehicleId, data);
  },
  
  async delete(tenantId: string, vehicleId: string): Promise<void> {
    return remove('vehicles', tenantId, vehicleId);
  },
  
  async getCount(tenantId: string): Promise<number> {
    const vehicles = await getAll<Vehicle>('vehicles', tenantId);
    return vehicles.length;
  },
};

// =============================================================================
// INVOICE OPERATIONS
// =============================================================================

export const invoiceService = {
  async getAll(tenantId: string): Promise<Invoice[]> {
    return getAll<Invoice>('invoices', tenantId, [orderBy('createdAt', 'desc')]);
  },
  
  async getById(tenantId: string, invoiceId: string): Promise<Invoice | null> {
    return getById<Invoice>('invoices', tenantId, invoiceId);
  },
  
  async getByStatus(tenantId: string, status: Invoice['status']): Promise<Invoice[]> {
    return getAll<Invoice>('invoices', tenantId, [
      where('status', '==', status),
      orderBy('createdAt', 'desc'),
    ]);
  },
  
  async getByCustomer(tenantId: string, customerId: string): Promise<Invoice[]> {
    return getAll<Invoice>('invoices', tenantId, [
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc'),
    ]);
  },
  
  async create(tenantId: string, data: Omit<Invoice, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'invoiceNumber'>): Promise<Invoice> {
    const invoiceNumber = await generateInvoiceNumber(tenantId);
    return create<Invoice>('invoices', tenantId, { ...data, invoiceNumber });
  },
  
  async update(tenantId: string, invoiceId: string, data: Partial<Invoice>): Promise<void> {
    return update<Invoice>('invoices', tenantId, invoiceId, data);
  },
  
  async delete(tenantId: string, invoiceId: string): Promise<void> {
    return remove('invoices', tenantId, invoiceId);
  },
};

// =============================================================================
// EXPENSE OPERATIONS
// =============================================================================

export const expenseService = {
  async getAll(tenantId: string): Promise<Expense[]> {
    return getAll<Expense>('expenses', tenantId, [orderBy('date', 'desc')]);
  },
  
  async getById(tenantId: string, expenseId: string): Promise<Expense | null> {
    return getById<Expense>('expenses', tenantId, expenseId);
  },
  
  async getByCategory(tenantId: string, category: Expense['category']): Promise<Expense[]> {
    return getAll<Expense>('expenses', tenantId, [
      where('category', '==', category),
      orderBy('date', 'desc'),
    ]);
  },
  
  async create(tenantId: string, data: Omit<Expense, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    return create<Expense>('expenses', tenantId, data);
  },
  
  async update(tenantId: string, expenseId: string, data: Partial<Expense>): Promise<void> {
    return update<Expense>('expenses', tenantId, expenseId, data);
  },
  
  async delete(tenantId: string, expenseId: string): Promise<void> {
    return remove('expenses', tenantId, expenseId);
  },
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Generate a unique load number
 */
async function generateLoadNumber(tenantId: string): Promise<string> {
  const year = new Date().getFullYear();
  const db = getFirestoreDb();
  
  // Get the count for this tenant
  const q = query(
    collection(db, 'loads'),
    where('tenantId', '==', tenantId)
  );
  const snapshot = await getDocs(q);
  const count = snapshot.size + 1;
  
  return `LD-${year}-${count.toString().padStart(4, '0')}`;
}

/**
 * Generate a unique invoice number
 */
async function generateInvoiceNumber(tenantId: string): Promise<string> {
  const year = new Date().getFullYear();
  const db = getFirestoreDb();
  
  const q = query(
    collection(db, 'invoices'),
    where('tenantId', '==', tenantId)
  );
  const snapshot = await getDocs(q);
  const count = snapshot.size + 1;
  
  return `INV-${year}-${count.toString().padStart(4, '0')}`;
}

// =============================================================================
// DASHBOARD STATS
// =============================================================================

export async function getDashboardStats(tenantId: string): Promise<{
  totalLoads: number;
  activeLoads: number;
  totalCustomers: number;
  totalDrivers: number;
  totalVehicles: number;
  pendingInvoices: number;
  revenue: number;
}> {
  const [loads, customers, drivers, vehicles, invoices] = await Promise.all([
    loadService.getAll(tenantId),
    customerService.getAll(tenantId),
    driverService.getAll(tenantId),
    vehicleService.getAll(tenantId),
    invoiceService.getAll(tenantId),
  ]);
  
  const activeLoads = loads.filter(l => 
    ['booked', 'dispatched', 'in-transit'].includes(l.status)
  ).length;
  
  const pendingInvoices = invoices.filter(i => 
    ['sent', 'overdue'].includes(i.status)
  ).length;
  
  const revenue = loads
    .filter(l => l.status === 'paid')
    .reduce((sum, l) => sum + l.totalAmount, 0);
  
  return {
    totalLoads: loads.length,
    activeLoads,
    totalCustomers: customers.length,
    totalDrivers: drivers.length,
    totalVehicles: vehicles.length,
    pendingInvoices,
    revenue,
  };
}

// =============================================================================
// CHECK IF TENANT HAS DATA
// =============================================================================

export async function tenantHasData(tenantId: string): Promise<boolean> {
  const stats = await getDashboardStats(tenantId);
  return stats.totalLoads > 0 || stats.totalCustomers > 0 || stats.totalDrivers > 0;
}
