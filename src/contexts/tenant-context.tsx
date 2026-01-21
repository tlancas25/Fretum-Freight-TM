/**
 * Tenant Context - Multi-tenant Data Context
 * 
 * Provides tenant-scoped data access throughout the application.
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';

interface TenantSettings {
  companyName?: string;
  timezone?: string;
  currency?: string;
  distanceUnit?: 'miles' | 'kilometers';
  fuelUnit?: 'gallons' | 'liters';
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  settings?: TenantSettings;
}

interface TenantContextType {
  tenant: Tenant | null;
  tenantId: string | null;
  isDemo: boolean;
  isLoading: boolean;
  needsSetup: boolean;
  error: string | null;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  tenantId: null,
  isDemo: false,
  isLoading: true,
  needsSetup: false,
  error: null,
  refreshTenant: async () => {},
});

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

interface TenantProviderProps {
  children: React.ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTenant = useCallback(async () => {
    if (!isAuthenticated) {
      setTenant(null);
      setTenantId(null);
      setIsDemo(false);
      setNeedsSetup(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/tenant', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tenant');
      }

      const data = await response.json();

      if (data.success) {
        setTenant(data.tenant);
        setTenantId(data.tenantId);
        setIsDemo(data.isDemo || false);
        setNeedsSetup(data.needsSetup || false);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Failed to fetch tenant:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tenant');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      fetchTenant();
    }
  }, [authLoading, isAuthenticated, fetchTenant]);

  const refreshTenant = useCallback(async () => {
    await fetchTenant();
  }, [fetchTenant]);

  return (
    <TenantContext.Provider
      value={{
        tenant,
        tenantId,
        isDemo,
        isLoading: authLoading || isLoading,
        needsSetup,
        error,
        refreshTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}
