/**
 * Data Hooks - React hooks for fetching tenant-scoped data
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/contexts/tenant-context';
import type { Load, Customer, Driver, Vehicle, LoadStatus } from '@/lib/data';

// =============================================================================
// DASHBOARD HOOK
// =============================================================================

interface DashboardStats {
  totalLoads: number;
  activeLoads: number;
  completedLoads: number;
  totalRevenue: number;
  pendingInvoices: number;
  activeDrivers: number;
  activeVehicles: number;
}

export function useDashboard() {
  const { tenantId, isLoading: tenantLoading } = useTenant();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!tenantId) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/dashboard', { credentials: 'include' });
      
      if (!response.ok) throw new Error('Failed to fetch dashboard');
      
      const data = await response.json();
      setStats(data.stats);
      setHasData(data.hasData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    if (!tenantLoading && tenantId) {
      fetchStats();
    }
  }, [tenantLoading, tenantId, fetchStats]);

  return { stats, hasData, isLoading: tenantLoading || isLoading, error, refresh: fetchStats };
}

// =============================================================================
// LOADS HOOK
// =============================================================================

interface UseLoadsOptions {
  status?: LoadStatus;
  limit?: number;
}

export function useLoads(options: UseLoadsOptions = {}) {
  const { tenantId, isLoading: tenantLoading } = useTenant();
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoads = useCallback(async () => {
    if (!tenantId) return;

    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (options.status) params.set('status', options.status);
      if (options.limit) params.set('limit', options.limit.toString());

      const url = `/api/loads${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });
      
      if (!response.ok) throw new Error('Failed to fetch loads');
      
      const data = await response.json();
      setLoads(data.loads || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, options.status, options.limit]);

  useEffect(() => {
    if (!tenantLoading && tenantId) {
      fetchLoads();
    }
  }, [tenantLoading, tenantId, fetchLoads]);

  return { loads, isLoading: tenantLoading || isLoading, error, refresh: fetchLoads };
}

// =============================================================================
// SINGLE LOAD HOOK
// =============================================================================

export function useLoad(loadId: string | null) {
  const { tenantId, isLoading: tenantLoading } = useTenant();
  const [load, setLoad] = useState<Load | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoad = useCallback(async () => {
    if (!tenantId || !loadId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/loads/${loadId}`, { credentials: 'include' });
      
      if (!response.ok) throw new Error('Failed to fetch load');
      
      const data = await response.json();
      setLoad(data.load || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, loadId]);

  useEffect(() => {
    if (!tenantLoading && tenantId && loadId) {
      fetchLoad();
    }
  }, [tenantLoading, tenantId, loadId, fetchLoad]);

  return { load, isLoading: tenantLoading || isLoading, error, refresh: fetchLoad };
}

// =============================================================================
// CUSTOMERS HOOK
// =============================================================================

export function useCustomers() {
  const { tenantId, isLoading: tenantLoading } = useTenant();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    if (!tenantId) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/customers', { credentials: 'include' });
      
      if (!response.ok) throw new Error('Failed to fetch customers');
      
      const data = await response.json();
      setCustomers(data.customers || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    if (!tenantLoading && tenantId) {
      fetchCustomers();
    }
  }, [tenantLoading, tenantId, fetchCustomers]);

  return { customers, isLoading: tenantLoading || isLoading, error, refresh: fetchCustomers };
}

// =============================================================================
// FLEET HOOK
// =============================================================================

export function useFleet() {
  const { tenantId, isLoading: tenantLoading } = useTenant();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFleet = useCallback(async () => {
    if (!tenantId) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/fleet', { credentials: 'include' });
      
      if (!response.ok) throw new Error('Failed to fetch fleet');
      
      const data = await response.json();
      setDrivers(data.drivers || []);
      setVehicles(data.vehicles || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    if (!tenantLoading && tenantId) {
      fetchFleet();
    }
  }, [tenantLoading, tenantId, fetchFleet]);

  return { drivers, vehicles, isLoading: tenantLoading || isLoading, error, refresh: fetchFleet };
}

// =============================================================================
// SEED DEMO DATA HOOK
// =============================================================================

export function useSeedDemoData() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const seedData = useCallback(async () => {
    try {
      setIsSeeding(true);
      const response = await fetch('/api/admin/seed-demo', {
        method: 'POST',
        credentials: 'include',
      });
      
      const data = await response.json();
      setResult({
        success: response.ok,
        message: data.message || data.error,
      });
      
      return response.ok;
    } catch (err) {
      setResult({
        success: false,
        message: err instanceof Error ? err.message : 'Failed to seed data',
      });
      return false;
    } finally {
      setIsSeeding(false);
    }
  }, []);

  return { seedData, isSeeding, result };
}
