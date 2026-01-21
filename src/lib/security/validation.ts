/**
 * Request Validation Utilities for Fretum-Freight TMS
 * 
 * Provides validation schemas and utilities for API requests
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { z } from 'zod';

// =============================================================================
// COMMON VALIDATION SCHEMAS
// =============================================================================

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(255, 'Email too long')
  .transform(val => val.toLowerCase().trim());

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain special character');

/**
 * Phone number validation schema
 */
export const phoneSchema = z
  .string()
  .regex(/^[\d\s\-\(\)\+]+$/, 'Invalid phone number format')
  .min(10, 'Phone number too short')
  .max(20, 'Phone number too long');

/**
 * UUID validation schema
 */
export const uuidSchema = z
  .string()
  .uuid('Invalid ID format');

/**
 * MC Number validation schema
 */
export const mcNumberSchema = z
  .string()
  .regex(/^MC-?\d{5,7}$/i, 'Invalid MC number format');

/**
 * DOT Number validation schema
 */
export const dotNumberSchema = z
  .string()
  .regex(/^\d{5,8}$/, 'Invalid DOT number format');

// =============================================================================
// LOAD VALIDATION SCHEMAS
// =============================================================================

export const addressSchema = z.object({
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().length(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().default('US'),
});

export const createLoadSchema = z.object({
  customerId: uuidSchema,
  origin: addressSchema,
  destination: addressSchema,
  pickupDate: z.string().datetime(),
  deliveryDate: z.string().datetime(),
  rate: z.number().positive().max(1000000),
  weight: z.number().positive().max(80000).optional(),
  commodity: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
});

export const updateLoadSchema = createLoadSchema.partial();

// =============================================================================
// CUSTOMER VALIDATION SCHEMAS
// =============================================================================

export const createCustomerSchema = z.object({
  name: z.string().min(1).max(200),
  email: emailSchema,
  phone: phoneSchema.optional(),
  address: addressSchema.optional(),
  mcNumber: mcNumberSchema.optional(),
  dotNumber: dotNumberSchema.optional(),
  notes: z.string().max(2000).optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

// =============================================================================
// USER VALIDATION SCHEMAS
// =============================================================================

export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: z.enum(['admin', 'dispatcher', 'driver', 'accountant', 'viewer']),
  phone: phoneSchema.optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

// =============================================================================
// FLEET VALIDATION SCHEMAS
// =============================================================================

export const vehicleSchema = z.object({
  unitNumber: z.string().min(1).max(20),
  vin: z.string().length(17).optional(),
  make: z.string().max(50).optional(),
  model: z.string().max(50).optional(),
  year: z.number().min(1990).max(new Date().getFullYear() + 2).optional(),
  type: z.enum(['tractor', 'trailer', 'straight_truck', 'van', 'flatbed']),
  status: z.enum(['active', 'maintenance', 'inactive']).default('active'),
  licensePlate: z.string().max(20).optional(),
  licenseState: z.string().length(2).optional(),
});

// =============================================================================
// VALIDATION HELPER
// =============================================================================

/**
 * Validate request body against schema
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

/**
 * Sanitize object by removing undefined and null values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)
  ) as Partial<T>;
}
