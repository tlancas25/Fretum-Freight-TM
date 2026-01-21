/**
 * Data Module Exports - Fretum-Freight TMS
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

// Types
export * from './types';

// Services
export {
  loadService,
  customerService,
  driverService,
  vehicleService,
  invoiceService,
  expenseService,
  getDashboardStats,
  tenantHasData,
} from './data-service';

// Tenant operations
export {
  createTenant,
  getTenantById,
  getTenantBySlug,
  updateTenantSettings,
  addUserToTenant,
  getUserTenantId,
  getUserTenant,
  getTenantUsers,
  getOrCreateDemoTenant,
  getTenantIdForUser,
} from './tenant-service';
