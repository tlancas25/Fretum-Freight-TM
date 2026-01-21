/**
 * Tenant Service - Fretum-Freight TMS
 * 
 * Manages tenant (organization) creation and data isolation.
 * Each user belongs to a tenant, and all data queries are scoped by tenantId.
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import {
  getFirestoreDb,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from '@/lib/firebase/firestore';
import { Tenant, TenantSettings, TenantUser, DEMO_TENANT_ID, isDemoUser } from './types';

// =============================================================================
// TENANT OPERATIONS
// =============================================================================

/**
 * Create a new tenant for a user signing up
 */
export async function createTenant(
  ownerId: string,
  ownerEmail: string,
  companyName: string
): Promise<Tenant> {
  const db = getFirestoreDb();
  
  // Generate a URL-friendly slug
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30);
  
  // Check if slug already exists
  const existingTenant = await getTenantBySlug(slug);
  const finalSlug = existingTenant ? `${slug}-${Date.now()}` : slug;
  
  const tenantId = `tenant-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  const tenant: Tenant = {
    id: tenantId,
    name: companyName,
    slug: finalSlug,
    plan: 'trial',
    status: 'trial',
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    settings: getDefaultTenantSettings(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId,
  };
  
  // Create tenant document
  await setDoc(doc(db, 'tenants', tenantId), {
    ...tenant,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  // Create the owner as a tenant user
  await addUserToTenant(tenantId, {
    uid: ownerId,
    email: ownerEmail,
    displayName: companyName,
    role: 'admin',
    status: 'active',
  });
  
  return tenant;
}

/**
 * Get default tenant settings
 */
function getDefaultTenantSettings(): TenantSettings {
  return {
    timezone: 'America/Chicago',
    currency: 'USD',
    distanceUnit: 'miles',
    dateFormat: 'MM/DD/YYYY',
  };
}

/**
 * Get tenant by ID
 */
export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  const db = getFirestoreDb();
  const docRef = doc(db, 'tenants', tenantId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return { id: docSnap.id, ...docSnap.data() } as Tenant;
}

/**
 * Get tenant by slug
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const db = getFirestoreDb();
  const q = query(collection(db, 'tenants'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Tenant;
}

/**
 * Update tenant settings
 */
export async function updateTenantSettings(
  tenantId: string,
  settings: Partial<TenantSettings>
): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, 'tenants', tenantId);
  
  await updateDoc(docRef, {
    settings,
    updatedAt: serverTimestamp(),
  });
}

// =============================================================================
// TENANT USER OPERATIONS
// =============================================================================

/**
 * Add a user to a tenant
 */
export async function addUserToTenant(
  tenantId: string,
  userData: Omit<TenantUser, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>
): Promise<TenantUser> {
  const db = getFirestoreDb();
  const userId = userData.uid;
  
  const user: TenantUser = {
    id: userId,
    tenantId,
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Store in tenant's users subcollection
  await setDoc(doc(db, 'tenants', tenantId, 'users', userId), {
    ...user,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  // Also store a reference in the user's profile for easy tenant lookup
  await setDoc(doc(db, 'userTenants', userId), {
    tenantId,
    role: userData.role,
    updatedAt: serverTimestamp(),
  });
  
  return user;
}

/**
 * Get user's tenant ID from their UID
 */
export async function getUserTenantId(uid: string): Promise<string | null> {
  const db = getFirestoreDb();
  const docRef = doc(db, 'userTenants', uid);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return docSnap.data().tenantId;
}

/**
 * Get user's tenant (full tenant object)
 */
export async function getUserTenant(uid: string): Promise<Tenant | null> {
  const tenantId = await getUserTenantId(uid);
  if (!tenantId) {
    return null;
  }
  return getTenantById(tenantId);
}

/**
 * Get all users in a tenant
 */
export async function getTenantUsers(tenantId: string): Promise<TenantUser[]> {
  const db = getFirestoreDb();
  const q = query(collection(db, 'tenants', tenantId, 'users'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as TenantUser[];
}

// =============================================================================
// DEMO TENANT
// =============================================================================

/**
 * Get or create the demo tenant (for test accounts)
 */
export async function getOrCreateDemoTenant(): Promise<Tenant> {
  const db = getFirestoreDb();
  const docRef = doc(db, 'tenants', DEMO_TENANT_ID);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Tenant;
  }
  
  // Create demo tenant
  const demoTenant: Tenant = {
    id: DEMO_TENANT_ID,
    name: 'Demo Company',
    slug: 'demo',
    plan: 'professional',
    status: 'active',
    settings: getDefaultTenantSettings(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'demo-owner',
  };
  
  await setDoc(docRef, {
    ...demoTenant,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return demoTenant;
}

/**
 * Get tenant ID for a user (handles demo users)
 */
export async function getTenantIdForUser(uid: string, email: string): Promise<string> {
  // Demo users get the demo tenant
  if (isDemoUser(email)) {
    await getOrCreateDemoTenant();
    return DEMO_TENANT_ID;
  }
  
  // Regular users get their own tenant
  const tenantId = await getUserTenantId(uid);
  if (!tenantId) {
    throw new Error('User does not belong to any tenant');
  }
  
  return tenantId;
}
