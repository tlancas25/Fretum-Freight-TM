/**
 * Data Types - Fretum-Freight TMS
 * 
 * Core data types for all entities in the system.
 * All entities include tenantId for multi-tenancy isolation.
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { Timestamp } from 'firebase/firestore';

// =============================================================================
// BASE TYPES
// =============================================================================

export interface BaseEntity {
  id: string;
  tenantId: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy?: string;
  updatedBy?: string;
}

// =============================================================================
// TENANT / ORGANIZATION
// =============================================================================

export interface Tenant {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier
  plan: 'trial' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  trialEndsAt?: Timestamp | Date;
  settings: TenantSettings;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  ownerId: string; // User who created the tenant
}

export interface TenantSettings {
  timezone: string;
  currency: string;
  distanceUnit: 'miles' | 'kilometers';
  dateFormat: string;
  logoUrl?: string;
  primaryColor?: string;
  companyAddress?: Address;
  companyPhone?: string;
  companyEmail?: string;
  dotNumber?: string;
  mcNumber?: string;
}

// =============================================================================
// USER
// =============================================================================

export interface TenantUser extends BaseEntity {
  uid: string; // Firebase Auth UID
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'dispatcher' | 'driver' | 'accountant' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
  phone?: string;
  lastLoginAt?: Timestamp | Date;
}

// =============================================================================
// ADDRESS
// =============================================================================

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

// =============================================================================
// CUSTOMER
// =============================================================================

export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  contactName?: string;
  address: Address;
  billingAddress?: Address;
  status: 'active' | 'inactive';
  creditLimit?: number;
  paymentTerms: number; // days
  notes?: string;
  tags?: string[];
  // Stats (computed)
  totalLoads?: number;
  totalRevenue?: number;
}

// =============================================================================
// DRIVER
// =============================================================================

export interface Driver extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: Timestamp | Date;
  status: 'available' | 'on-load' | 'off-duty' | 'inactive';
  assignedVehicleId?: string;
  address?: Address;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  hireDate: Timestamp | Date;
  terminationDate?: Timestamp | Date;
  payType: 'per-mile' | 'percentage' | 'hourly' | 'salary';
  payRate: number;
  // Documents
  medicalCardExpiry?: Timestamp | Date;
  drugTestDate?: Timestamp | Date;
  // Stats
  totalMiles?: number;
  totalLoads?: number;
}

// =============================================================================
// VEHICLE
// =============================================================================

export interface Vehicle extends BaseEntity {
  unitNumber: string;
  type: 'tractor' | 'trailer' | 'straight-truck' | 'sprinter';
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  licensePlateState: string;
  status: 'active' | 'maintenance' | 'out-of-service' | 'inactive';
  assignedDriverId?: string;
  // Specs
  fuelType?: 'diesel' | 'gasoline' | 'electric' | 'hybrid';
  tankCapacity?: number;
  currentOdometer?: number;
  // Registration
  registrationExpiry?: Timestamp | Date;
  insuranceExpiry?: Timestamp | Date;
  inspectionExpiry?: Timestamp | Date;
  // ELD Integration
  eldProvider?: 'samsara' | 'motive' | 'geotab' | 'none';
  eldDeviceId?: string;
  // Location (from ELD)
  lastLocation?: {
    lat: number;
    lng: number;
    heading?: number;
    speed?: number;
    timestamp: Timestamp | Date;
  };
}

// =============================================================================
// LOAD
// =============================================================================

export type LoadStatus = 
  | 'quote'
  | 'booked'
  | 'dispatched'
  | 'in-transit'
  | 'delivered'
  | 'invoiced'
  | 'paid'
  | 'cancelled';

export interface LoadStop {
  type: 'pickup' | 'delivery' | 'stop';
  address: Address;
  scheduledDate: Timestamp | Date;
  scheduledTime?: string;
  actualArrival?: Timestamp | Date;
  actualDeparture?: Timestamp | Date;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
  referenceNumber?: string;
}

export interface Load extends BaseEntity {
  loadNumber: string; // Auto-generated: LD-2026-001
  status: LoadStatus;
  customerId: string;
  customerName: string; // Denormalized for display
  
  // Stops
  stops: LoadStop[];
  
  // Assignment
  driverId?: string;
  driverName?: string;
  vehicleId?: string;
  vehicleNumber?: string;
  trailerId?: string;
  trailerNumber?: string;
  
  // Cargo
  commodity: string;
  weight?: number;
  weightUnit: 'lbs' | 'kg';
  pieces?: number;
  pallets?: number;
  temperature?: {
    min: number;
    max: number;
    unit: 'F' | 'C';
  };
  hazmat?: boolean;
  hazmatClass?: string;
  
  // Financials
  rate: number;
  rateType: 'flat' | 'per-mile';
  miles?: number;
  fuelSurcharge?: number;
  accessorials?: Array<{
    description: string;
    amount: number;
  }>;
  totalAmount: number;
  
  // Documents
  bolNumber?: string;
  poNumber?: string;
  proNumber?: string;
  documents?: Array<{
    type: 'bol' | 'pod' | 'invoice' | 'rate-confirmation' | 'other';
    name: string;
    url: string;
    uploadedAt: Timestamp | Date;
  }>;
  
  // Tracking
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: Timestamp | Date;
  };
  eta?: Timestamp | Date;
  
  // Notes
  dispatchNotes?: string;
  internalNotes?: string;
  
  // Billing
  invoiceId?: string;
  invoicedAt?: Timestamp | Date;
  paidAt?: Timestamp | Date;
}

// =============================================================================
// INVOICE
// =============================================================================

export interface Invoice extends BaseEntity {
  invoiceNumber: string; // Auto-generated: INV-2026-001
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'void';
  customerId: string;
  customerName: string;
  customerEmail: string;
  billingAddress: Address;
  
  // Line Items
  lineItems: Array<{
    loadId?: string;
    loadNumber?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  
  // Totals
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  
  // Dates
  issueDate: Timestamp | Date;
  dueDate: Timestamp | Date;
  paidDate?: Timestamp | Date;
  
  // Payment
  paymentMethod?: string;
  paymentReference?: string;
  
  // PDF
  pdfUrl?: string;
  sentAt?: Timestamp | Date;
  viewedAt?: Timestamp | Date;
  
  notes?: string;
}

// =============================================================================
// SETTLEMENT (Driver Pay)
// =============================================================================

export interface Settlement extends BaseEntity {
  settlementNumber: string; // Auto-generated: STL-2026-001
  driverId: string;
  driverName: string;
  status: 'draft' | 'approved' | 'paid';
  
  // Period
  periodStart: Timestamp | Date;
  periodEnd: Timestamp | Date;
  
  // Earnings
  loads: Array<{
    loadId: string;
    loadNumber: string;
    pickupDate: Timestamp | Date;
    origin: string;
    destination: string;
    miles: number;
    amount: number;
  }>;
  
  // Deductions
  deductions: Array<{
    description: string;
    amount: number;
  }>;
  
  // Reimbursements
  reimbursements: Array<{
    description: string;
    amount: number;
  }>;
  
  // Totals
  grossEarnings: number;
  totalDeductions: number;
  totalReimbursements: number;
  netPay: number;
  
  // Payment
  paidAt?: Timestamp | Date;
  paymentMethod?: string;
  paymentReference?: string;
  
  notes?: string;
}

// =============================================================================
// EXPENSE
// =============================================================================

export interface Expense extends BaseEntity {
  category: 'fuel' | 'maintenance' | 'tolls' | 'permits' | 'insurance' | 'equipment' | 'office' | 'other';
  description: string;
  amount: number;
  date: Timestamp | Date;
  vendorName?: string;
  vehicleId?: string;
  vehicleNumber?: string;
  driverId?: string;
  driverName?: string;
  loadId?: string;
  loadNumber?: string;
  receiptUrl?: string;
  paymentMethod?: string;
  reimbursable: boolean;
  reimbursed?: boolean;
  notes?: string;
}

// =============================================================================
// IFTA (Fuel Tax)
// =============================================================================

export interface IftaRecord extends BaseEntity {
  vehicleId: string;
  vehicleNumber: string;
  quarter: string; // e.g., "2026-Q1"
  jurisdiction: string; // State/Province code
  milesDriven: number;
  fuelPurchased: number;
  fuelUsed: number;
  taxOwed: number;
  taxPaid: number;
}

// =============================================================================
// DEMO DATA FLAG
// =============================================================================

export const DEMO_TENANT_ID = 'demo-tenant';
export const DEMO_USER_EMAILS = ['test@test.com', 'demo@fretumfreight.com'];

export function isDemoUser(email: string): boolean {
  return DEMO_USER_EMAILS.includes(email.toLowerCase());
}
