// Motive (formerly KeepTruckin) ELD Provider Implementation - FocusFreight TMS
// Note: Motive API requires partnership. This is a placeholder implementation.

import { BaseELDProvider } from '../provider-interface';
import {
  AuthToken,
  Driver,
  DriverVehicleAssignment,
  DVIR,
  ELDCredentials,
  ELDEvent,
  ELDProvider,
  ELDProviderConfig,
  FaultCode,
  Geofence,
  GeofenceEvent,
  HOSClock,
  HOSDailySummary,
  HOSLog,
  IFTASummary,
  LocationHistoryPoint,
  MaintenanceAlert,
  PaginatedResponse,
  Trailer,
  Vehicle,
  VehicleLocation,
  VehicleStats,
} from '../types';

const MOTIVE_API_BASE = 'https://api.gomotive.com/v1';

/**
 * Motive (formerly KeepTruckin) ELD Provider
 * 
 * Very popular with owner-operators and small fleets.
 * API access requires partnership agreement.
 */
export class MotiveProvider extends BaseELDProvider {
  readonly provider: ELDProvider = 'motive';
  
  readonly config: ELDProviderConfig = {
    provider: 'motive',
    displayName: 'Motive (KeepTruckin)',
    description: 'Popular ELD for owner-operators and small fleets',
    logoUrl: '/integrations/motive-logo.svg',
    authType: 'api_key',
    features: [
      'gps_tracking',
      'hos_logs',
      'hos_clocks',
      'vehicle_stats',
      'fault_codes',
      'dvir',
      'ifta',
      'driver_management',
      'vehicle_management',
    ],
    docsUrl: 'https://developers.gomotive.com',
    sandboxAvailable: false,
  };

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Motive');
    }

    const response = await fetch(`${MOTIVE_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'X-Api-Key': this.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Motive API error: ${response.status} - ${error.message || response.statusText}`
      );
    }

    return response.json();
  }

  // ==================== Authentication ====================

  async authenticate(credentials: ELDCredentials): Promise<AuthToken> {
    if (!credentials.apiKey) {
      throw new Error('Motive API key is required');
    }

    this.accessToken = credentials.apiKey;
    
    const isValid = await this.testConnection();
    if (!isValid) {
      this.accessToken = null;
      throw new Error('Invalid Motive API key');
    }

    const token: AuthToken = {
      accessToken: credentials.apiKey,
      tokenType: 'ApiKey',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };

    this.setCredentials(credentials, token);
    return token;
  }

  async refreshToken(): Promise<AuthToken> {
    if (!this.accessToken) {
      throw new Error('No token to refresh');
    }
    return {
      accessToken: this.accessToken,
      tokenType: 'ApiKey',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request('/users?per_page=1');
      return true;
    } catch {
      return false;
    }
  }

  async revokeAccess(): Promise<void> {
    this.accessToken = null;
    this.credentials = null;
  }

  // ==================== Location ====================

  async getVehicleLocations(): Promise<VehicleLocation[]> {
    interface MotiveLocationResponse {
      vehicles: Array<{
        id: number;
        number: string;
        current_location: {
          lat: number;
          lon: number;
          speed: number;
          bearing: number;
          located_at: string;
          description: string;
        };
        current_driver?: { id: number };
      }>;
    }

    const response = await this.request<MotiveLocationResponse>(
      '/vehicles?per_page=100'
    );

    return response.vehicles
      .filter((v) => v.current_location)
      .map((v) => ({
        vehicleId: v.id.toString(),
        driverId: v.current_driver?.id.toString(),
        coordinates: {
          latitude: v.current_location.lat,
          longitude: v.current_location.lon,
        },
        speed: v.current_location.speed,
        heading: v.current_location.bearing,
        timestamp: new Date(v.current_location.located_at),
        address: v.current_location.description,
        engineRunning: v.current_location.speed > 0,
      }));
  }

  async getVehicleLocation(vehicleId: string): Promise<VehicleLocation | null> {
    const locations = await this.getVehicleLocations();
    return locations.find((l) => l.vehicleId === vehicleId) || null;
  }

  async getLocationHistory(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<LocationHistoryPoint[]> {
    interface MotiveLocationHistoryResponse {
      vehicle_locations: Array<{
        lat: number;
        lon: number;
        speed: number;
        bearing: number;
        located_at: string;
      }>;
    }

    const response = await this.request<MotiveLocationHistoryResponse>(
      `/vehicles/${vehicleId}/locations?start_date=${this.formatDate(startTime)}&end_date=${this.formatDate(endTime)}`
    );

    return response.vehicle_locations.map((loc) => ({
      coordinates: {
        latitude: loc.lat,
        longitude: loc.lon,
      },
      timestamp: new Date(loc.located_at),
      speed: loc.speed,
      heading: loc.bearing,
    }));
  }

  // ==================== HOS ====================

  async getHOSClocks(): Promise<HOSClock[]> {
    interface MotiveHOSResponse {
      hos: Array<{
        driver: { id: number; first_name: string; last_name: string };
        current_duty_status: string;
        current_duty_status_started_at: string;
        drive_remaining: number;
        shift_remaining: number;
        cycle_remaining: number;
        break_remaining: number;
        violations: Array<{ type: string; started_at: string }>;
      }>;
    }

    const response = await this.request<MotiveHOSResponse>('/hos');

    return response.hos.map((h) => ({
      driverId: h.driver.id.toString(),
      driverName: `${h.driver.first_name} ${h.driver.last_name}`,
      currentStatus: this.mapMotiveHOSStatus(h.current_duty_status),
      statusStartTime: new Date(h.current_duty_status_started_at),
      driveTimeRemaining: h.drive_remaining,
      shiftTimeRemaining: h.shift_remaining,
      cycleTimeRemaining: h.cycle_remaining,
      breakTimeRemaining: h.break_remaining,
      violations: h.violations.map((v, idx) => ({
        id: `${h.driver.id}-${idx}`,
        type: 'drive_limit' as const,
        severity: 'violation' as const,
        description: v.type,
        occurredAt: new Date(v.started_at),
        acknowledged: false,
      })),
      lastUpdated: new Date(),
    }));
  }

  async getHOSClock(driverId: string): Promise<HOSClock | null> {
    const clocks = await this.getHOSClocks();
    return clocks.find((c) => c.driverId === driverId) || null;
  }

  async getHOSLogs(startTime: Date, endTime: Date): Promise<HOSLog[]> {
    interface MotiveLogsResponse {
      logs: Array<{
        id: number;
        driver: { id: number; first_name: string; last_name: string };
        status: string;
        start_time: string;
        end_time?: string;
        duration: number;
        location: string;
        notes?: string;
      }>;
    }

    const response = await this.request<MotiveLogsResponse>(
      `/hos_logs?start_date=${this.formatDate(startTime)}&end_date=${this.formatDate(endTime)}`
    );

    return response.logs.map((log) => ({
      id: log.id.toString(),
      driverId: log.driver.id.toString(),
      driverName: `${log.driver.first_name} ${log.driver.last_name}`,
      status: this.mapMotiveHOSStatus(log.status),
      startTime: new Date(log.start_time),
      endTime: log.end_time ? new Date(log.end_time) : undefined,
      duration: Math.round(log.duration / 60),
      location: log.location,
      notes: log.notes,
      certified: true,
      edited: false,
    }));
  }

  async getDriverHOSLogs(
    driverId: string,
    startTime: Date,
    endTime: Date
  ): Promise<HOSLog[]> {
    const logs = await this.getHOSLogs(startTime, endTime);
    return logs.filter((l) => l.driverId === driverId);
  }

  async getHOSDailySummary(
    driverId: string,
    date: Date
  ): Promise<HOSDailySummary | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await this.getDriverHOSLogs(driverId, startOfDay, endOfDay);
    if (logs.length === 0) return null;

    return {
      driverId,
      date,
      totalDriveTime: logs
        .filter((l) => l.status === 'driving')
        .reduce((sum, l) => sum + l.duration, 0),
      totalOnDutyTime: logs
        .filter((l) => l.status === 'on_duty_not_driving')
        .reduce((sum, l) => sum + l.duration, 0),
      totalOffDutyTime: logs
        .filter((l) => l.status === 'off_duty')
        .reduce((sum, l) => sum + l.duration, 0),
      totalSleeperTime: logs
        .filter((l) => l.status === 'sleeper_berth')
        .reduce((sum, l) => sum + l.duration, 0),
      distanceDriven: 0,
      violations: [],
      certified: true,
    };
  }

  // ==================== Vehicles ====================

  async getVehicles(): Promise<PaginatedResponse<Vehicle>> {
    interface MotiveVehiclesResponse {
      vehicles: Array<{
        id: number;
        number: string;
        vin?: string;
        license_plate_number?: string;
        make?: string;
        model?: string;
        year?: number;
      }>;
      pagination: { per_page: number; page_no: number; total: number };
    }

    const response = await this.request<MotiveVehiclesResponse>('/vehicles');

    return {
      data: response.vehicles.map((v) => ({
        id: v.id.toString(),
        name: v.number,
        vin: v.vin,
        licensePlate: v.license_plate_number,
        make: v.make,
        model: v.model,
        year: v.year,
        status: 'active' as const,
      })),
      pagination: {
        hasMore: response.pagination.page_no * response.pagination.per_page < response.pagination.total,
        pageSize: response.pagination.per_page,
        totalCount: response.pagination.total,
      },
    };
  }

  async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    try {
      interface MotiveVehicleResponse {
        vehicle: {
          id: number;
          number: string;
          vin?: string;
          license_plate_number?: string;
          make?: string;
          model?: string;
          year?: number;
        };
      }

      const response = await this.request<MotiveVehicleResponse>(
        `/vehicles/${vehicleId}`
      );

      return {
        id: response.vehicle.id.toString(),
        name: response.vehicle.number,
        vin: response.vehicle.vin,
        licensePlate: response.vehicle.license_plate_number,
        make: response.vehicle.make,
        model: response.vehicle.model,
        year: response.vehicle.year,
        status: 'active',
      };
    } catch {
      return null;
    }
  }

  async getVehicleStats(vehicleId: string): Promise<VehicleStats | null> {
    // Motive provides vehicle stats through their fleet dashboard API
    return {
      vehicleId,
      timestamp: new Date(),
      odometer: 0,
      engineHours: 0,
    };
  }

  async getVehicleStatsHistory(
    vehicleId: string,
    _startTime: Date,
    _endTime: Date
  ): Promise<VehicleStats[]> {
    return [{
      vehicleId,
      timestamp: new Date(),
      odometer: 0,
      engineHours: 0,
    }];
  }

  // ==================== Drivers ====================

  async getDrivers(): Promise<PaginatedResponse<Driver>> {
    interface MotiveDriversResponse {
      users: Array<{
        id: number;
        first_name: string;
        last_name: string;
        email?: string;
        phone?: string;
        driver_license_number?: string;
        driver_license_state?: string;
        role: string;
      }>;
      pagination: { per_page: number; page_no: number; total: number };
    }

    const response = await this.request<MotiveDriversResponse>('/users?role=driver');

    return {
      data: response.users.map((u) => ({
        id: u.id.toString(),
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        phone: u.phone,
        licenseNumber: u.driver_license_number,
        licenseState: u.driver_license_state,
      })),
      pagination: {
        hasMore: response.pagination.page_no * response.pagination.per_page < response.pagination.total,
        pageSize: response.pagination.per_page,
        totalCount: response.pagination.total,
      },
    };
  }

  async getDriver(driverId: string): Promise<Driver | null> {
    try {
      interface MotiveDriverResponse {
        user: {
          id: number;
          first_name: string;
          last_name: string;
          email?: string;
          phone?: string;
          driver_license_number?: string;
          driver_license_state?: string;
        };
      }

      const response = await this.request<MotiveDriverResponse>(
        `/users/${driverId}`
      );

      return {
        id: response.user.id.toString(),
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        email: response.user.email,
        phone: response.user.phone,
        licenseNumber: response.user.driver_license_number,
        licenseState: response.user.driver_license_state,
      };
    } catch {
      return null;
    }
  }

  async getDriverVehicleAssignments(): Promise<DriverVehicleAssignment[]> {
    // Motive tracks this through current driver on vehicle
    return [];
  }

  // ==================== Trailers ====================

  async getTrailers(): Promise<PaginatedResponse<Trailer>> {
    interface MotiveTrailersResponse {
      assets: Array<{
        id: number;
        name: string;
        asset_type: string;
      }>;
    }

    const response = await this.request<MotiveTrailersResponse>('/assets?asset_type=trailer');

    return {
      data: response.assets.map((t) => ({
        id: t.id.toString(),
        name: t.name,
        type: 'dry_van' as const,
        status: 'available' as const,
      })),
      pagination: {
        hasMore: false,
        pageSize: response.assets.length,
      },
    };
  }

  async getTrailer(trailerId: string): Promise<Trailer | null> {
    const trailers = await this.getTrailers();
    return trailers.data.find((t) => t.id === trailerId) || null;
  }

  // ==================== Diagnostics ====================

  async getFaultCodes(vehicleId: string): Promise<FaultCode[]> {
    interface MotiveFaultsResponse {
      fault_codes: Array<{
        id: number;
        vehicle_id: number;
        code: string;
        description: string;
        first_observed_at: string;
        last_observed_at: string;
      }>;
    }

    const response = await this.request<MotiveFaultsResponse>(
      `/vehicles/${vehicleId}/fault_codes`
    );

    return response.fault_codes.map((f) => ({
      id: f.id.toString(),
      vehicleId: f.vehicle_id.toString(),
      code: f.code,
      description: f.description,
      severity: 'warning' as const,
      occurredAt: new Date(f.first_observed_at),
      source: 'engine' as const,
    }));
  }

  async getAllFaultCodes(): Promise<FaultCode[]> {
    return [];
  }

  async getMaintenanceAlerts(): Promise<MaintenanceAlert[]> {
    return [];
  }

  // ==================== DVIR ====================

  async getDVIRs(startTime: Date, endTime: Date): Promise<DVIR[]> {
    interface MotiveDVIRsResponse {
      dvirs: Array<{
        id: number;
        vehicle: { id: number };
        driver: { id: number };
        inspection_type: string;
        submitted_at: string;
        location: string;
        defects: Array<{ category: string; description: string; repaired: boolean }>;
        safe_to_operate: boolean;
      }>;
    }

    const response = await this.request<MotiveDVIRsResponse>(
      `/dvirs?start_date=${this.formatDate(startTime)}&end_date=${this.formatDate(endTime)}`
    );

    return response.dvirs.map((d) => ({
      id: d.id.toString(),
      vehicleId: d.vehicle.id.toString(),
      driverId: d.driver.id.toString(),
      inspectionType: d.inspection_type === 'pre_trip' ? 'pre_trip' : 'post_trip',
      inspectionTime: new Date(d.submitted_at),
      location: d.location,
      defectsFound: d.defects.map((def, idx) => ({
        id: `${d.id}-${idx}`,
        category: def.category,
        description: def.description,
        severity: 'minor' as const,
        repaired: def.repaired,
      })),
      safeToOperate: d.safe_to_operate,
      driverSignature: true,
    }));
  }

  async getVehicleDVIRs(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<DVIR[]> {
    const dvirs = await this.getDVIRs(startTime, endTime);
    return dvirs.filter((d) => d.vehicleId === vehicleId);
  }

  // ==================== IFTA ====================

  async getIFTASummary(year: number, quarter: 1 | 2 | 3 | 4): Promise<IFTASummary> {
    interface MotiveIFTAResponse {
      ifta_reports: Array<{
        jurisdiction: string;
        miles: number;
        gallons: number;
      }>;
    }

    const response = await this.request<MotiveIFTAResponse>(
      `/ifta_reports?year=${year}&quarter=${quarter}`
    );

    const byJurisdiction = response.ifta_reports.map((r) => ({
      jurisdiction: r.jurisdiction,
      miles: r.miles,
      fuel: r.gallons,
      taxRate: 0,
      taxOwed: 0,
      taxPaid: 0,
      netTax: 0,
    }));

    return {
      quarter: `${year}-Q${quarter}`,
      totalMiles: byJurisdiction.reduce((sum, j) => sum + j.miles, 0),
      totalFuel: byJurisdiction.reduce((sum, j) => sum + j.fuel, 0),
      byJurisdiction,
    };
  }

  // ==================== Geofencing ====================

  async getGeofences(): Promise<Geofence[]> {
    return [];
  }

  async getGeofenceEvents(): Promise<GeofenceEvent[]> {
    return [];
  }

  // ==================== Webhooks ====================

  async subscribeToEvents(
    eventTypes: string[],
    webhookUrl: string
  ): Promise<{ subscriptionId: string }> {
    console.log('Motive webhook subscription:', eventTypes, webhookUrl);
    return { subscriptionId: `motive-${Date.now()}` };
  }

  async unsubscribeFromEvents(): Promise<void> {}

  parseWebhookPayload(payload: unknown): ELDEvent[] {
    const data = payload as {
      event_type: string;
      event_time: string;
      data: Record<string, unknown>;
    };

    return [
      {
        id: `motive-${Date.now()}`,
        type: 'location_update',
        provider: 'motive',
        timestamp: new Date(data.event_time),
        data: data.data,
      },
    ];
  }

  // ==================== Helper Methods ====================

  private mapMotiveHOSStatus(status: string): HOSClock['currentStatus'] {
    const statusMap: Record<string, HOSClock['currentStatus']> = {
      off_duty: 'off_duty',
      sleeper: 'sleeper_berth',
      driving: 'driving',
      on_duty: 'on_duty_not_driving',
      yard_move: 'yard_move',
      personal_conveyance: 'personal_conveyance',
    };
    return statusMap[status.toLowerCase()] || 'off_duty';
  }
}
