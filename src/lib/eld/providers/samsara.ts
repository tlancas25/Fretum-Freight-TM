// Samsara ELD Provider Implementation - FocusFreight TMS
// Documentation: https://developers.samsara.com

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
  HOSStatus,
  IFTASummary,
  LocationHistoryPoint,
  MaintenanceAlert,
  PaginatedResponse,
  Trailer,
  Vehicle,
  VehicleLocation,
  VehicleStats,
} from '../types';

const SAMSARA_API_BASE = 'https://api.samsara.com';

/**
 * Samsara ELD Provider
 * 
 * Samsara offers a comprehensive fleet management API with:
 * - Real-time GPS tracking
 * - HOS/ELD compliance
 * - Vehicle diagnostics
 * - DVIR reports
 * - IFTA data
 * - Webhooks for real-time events
 */
export class SamsaraProvider extends BaseELDProvider {
  readonly provider: ELDProvider = 'samsara';
  
  readonly config: ELDProviderConfig = {
    provider: 'samsara',
    displayName: 'Samsara',
    description: 'Enterprise fleet management with comprehensive API',
    logoUrl: '/integrations/samsara-logo.svg',
    authType: 'api_key',
    features: [
      'gps_tracking',
      'hos_logs',
      'hos_clocks',
      'vehicle_stats',
      'fault_codes',
      'dvir',
      'ifta',
      'geofencing',
      'webhooks',
      'driver_management',
      'vehicle_management',
      'trailer_tracking',
    ],
    docsUrl: 'https://developers.samsara.com',
    sandboxAvailable: true,
  };

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Samsara');
    }

    const response = await fetch(`${SAMSARA_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Samsara API error: ${response.status} - ${error.message || response.statusText}`
      );
    }

    return response.json();
  }

  // ==================== Authentication ====================

  async authenticate(credentials: ELDCredentials): Promise<AuthToken> {
    // Samsara uses API tokens, not OAuth for direct integrations
    if (!credentials.apiKey) {
      throw new Error('Samsara API key is required');
    }

    this.accessToken = credentials.apiKey;
    
    // Test the connection
    const isValid = await this.testConnection();
    if (!isValid) {
      this.accessToken = null;
      throw new Error('Invalid Samsara API key');
    }

    const token: AuthToken = {
      accessToken: credentials.apiKey,
      tokenType: 'Bearer',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // API keys don't expire
    };

    this.setCredentials(credentials, token);
    return token;
  }

  async refreshToken(): Promise<AuthToken> {
    // Samsara API keys don't expire, so this is a no-op
    if (!this.accessToken) {
      throw new Error('No token to refresh');
    }
    return {
      accessToken: this.accessToken,
      tokenType: 'Bearer',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request('/fleet/vehicles?limit=1');
      return true;
    } catch {
      return false;
    }
  }

  async revokeAccess(): Promise<void> {
    // API keys must be revoked from Samsara dashboard
    this.accessToken = null;
    this.credentials = null;
  }

  // ==================== Location ====================

  async getVehicleLocations(): Promise<VehicleLocation[]> {
    interface SamsaraLocationResponse {
      data: Array<{
        id: string;
        name: string;
        location: {
          latitude: number;
          longitude: number;
          heading: number;
          speed: number;
          time: string;
          reverseGeo?: { formattedLocation: string };
        };
        staticAssignedDriver?: { id: string };
        gps?: { odometerMeters?: number };
        engineState?: { value: string };
      }>;
    }

    const response = await this.request<SamsaraLocationResponse>(
      '/fleet/vehicles/locations'
    );

    return response.data.map((v) => ({
      vehicleId: v.id,
      driverId: v.staticAssignedDriver?.id,
      coordinates: {
        latitude: v.location.latitude,
        longitude: v.location.longitude,
      },
      heading: v.location.heading || 0,
      speed: this.metersPerSecondToMph(v.location.speed || 0),
      timestamp: new Date(v.location.time),
      address: v.location.reverseGeo?.formattedLocation,
      odometer: v.gps?.odometerMeters ? this.metersToMiles(v.gps.odometerMeters) : undefined,
      engineRunning: v.engineState?.value === 'On',
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
    interface SamsaraHistoryResponse {
      data: Array<{
        time: string;
        latitude: number;
        longitude: number;
        heading: number;
        speed: number;
        reverseGeo?: { formattedLocation: string };
      }>;
    }

    const response = await this.request<SamsaraHistoryResponse>(
      `/fleet/vehicles/${vehicleId}/locations/history?startTime=${this.formatDate(startTime)}&endTime=${this.formatDate(endTime)}`
    );

    return response.data.map((point) => ({
      coordinates: {
        latitude: point.latitude,
        longitude: point.longitude,
      },
      timestamp: new Date(point.time),
      speed: this.metersPerSecondToMph(point.speed || 0),
      heading: point.heading || 0,
      address: point.reverseGeo?.formattedLocation,
    }));
  }

  // ==================== HOS ====================

  async getHOSClocks(): Promise<HOSClock[]> {
    interface SamsaraHOSResponse {
      data: Array<{
        driver: { id: string; name: string };
        currentDutyStatus: { hosStatusType: string; time: string };
        clocks: {
          drive: { driveRemainingDurationMs: number };
          shift: { shiftRemainingDurationMs: number };
          cycle: { cycleRemainingDurationMs: number };
          break: { breakRemainingDurationMs: number };
        };
        violations: Array<{
          id: string;
          violationType: string;
          time: string;
        }>;
      }>;
    }

    const response = await this.request<SamsaraHOSResponse>('/fleet/hos/clocks');

    return response.data.map((d) => ({
      driverId: d.driver.id,
      driverName: d.driver.name,
      currentStatus: this.mapHOSStatus(d.currentDutyStatus.hosStatusType),
      statusStartTime: new Date(d.currentDutyStatus.time),
      driveTimeRemaining: Math.round(d.clocks.drive.driveRemainingDurationMs / 60000),
      shiftTimeRemaining: Math.round(d.clocks.shift.shiftRemainingDurationMs / 60000),
      cycleTimeRemaining: Math.round(d.clocks.cycle.cycleRemainingDurationMs / 60000),
      breakTimeRemaining: Math.round(d.clocks.break.breakRemainingDurationMs / 60000),
      violations: d.violations.map((v) => ({
        id: v.id,
        type: 'drive_limit' as const,
        severity: 'violation' as const,
        description: v.violationType,
        occurredAt: new Date(v.time),
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
    interface SamsaraLogsResponse {
      data: Array<{
        id: string;
        driver: { id: string; name: string };
        hosStatusType: string;
        logStartTime: string;
        logEndTime?: string;
        durationMs: number;
        location?: { name: string; latitude: number; longitude: number };
        remark?: string;
        codrivers?: boolean;
      }>;
    }

    const response = await this.request<SamsaraLogsResponse>(
      `/fleet/hos/logs?startTime=${this.formatDate(startTime)}&endTime=${this.formatDate(endTime)}`
    );

    return response.data.map((log) => ({
      id: log.id,
      driverId: log.driver.id,
      driverName: log.driver.name,
      status: this.mapHOSStatus(log.hosStatusType),
      startTime: new Date(log.logStartTime),
      endTime: log.logEndTime ? new Date(log.logEndTime) : undefined,
      duration: Math.round(log.durationMs / 60000),
      location: log.location?.name,
      coordinates: log.location
        ? { latitude: log.location.latitude, longitude: log.location.longitude }
        : undefined,
      notes: log.remark,
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

    const summary: HOSDailySummary = {
      driverId,
      date,
      totalDriveTime: 0,
      totalOnDutyTime: 0,
      totalOffDutyTime: 0,
      totalSleeperTime: 0,
      distanceDriven: 0,
      violations: [],
      certified: true,
    };

    for (const log of logs) {
      switch (log.status) {
        case 'driving':
          summary.totalDriveTime += log.duration;
          break;
        case 'on_duty_not_driving':
          summary.totalOnDutyTime += log.duration;
          break;
        case 'off_duty':
          summary.totalOffDutyTime += log.duration;
          break;
        case 'sleeper_berth':
          summary.totalSleeperTime += log.duration;
          break;
      }
    }

    return summary;
  }

  // ==================== Vehicles ====================

  async getVehicles(): Promise<PaginatedResponse<Vehicle>> {
    interface SamsaraVehiclesResponse {
      data: Array<{
        id: string;
        name: string;
        vin?: string;
        licensePlate?: string;
        make?: string;
        model?: string;
        year?: number;
        staticAssignedDriver?: { id: string };
        tags?: Array<{ name: string }>;
      }>;
      pagination: {
        hasNextPage: boolean;
        endCursor?: string;
      };
    }

    const response = await this.request<SamsaraVehiclesResponse>('/fleet/vehicles');

    return {
      data: response.data.map((v) => ({
        id: v.id,
        name: v.name,
        vin: v.vin,
        licensePlate: v.licensePlate,
        make: v.make,
        model: v.model,
        year: v.year,
        status: 'active' as const,
        currentDriverId: v.staticAssignedDriver?.id,
        tags: v.tags?.map((t) => t.name),
      })),
      pagination: {
        hasMore: response.pagination.hasNextPage,
        cursor: response.pagination.endCursor,
        pageSize: response.data.length,
      },
    };
  }

  async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    try {
      interface SamsaraVehicleResponse {
        data: {
          id: string;
          name: string;
          vin?: string;
          licensePlate?: string;
          make?: string;
          model?: string;
          year?: number;
          staticAssignedDriver?: { id: string };
          tags?: Array<{ name: string }>;
        };
      }

      const response = await this.request<SamsaraVehicleResponse>(
        `/fleet/vehicles/${vehicleId}`
      );

      return {
        id: response.data.id,
        name: response.data.name,
        vin: response.data.vin,
        licensePlate: response.data.licensePlate,
        make: response.data.make,
        model: response.data.model,
        year: response.data.year,
        status: 'active',
        currentDriverId: response.data.staticAssignedDriver?.id,
        tags: response.data.tags?.map((t) => t.name),
      };
    } catch {
      return null;
    }
  }

  async getVehicleStats(vehicleId: string): Promise<VehicleStats | null> {
    try {
      interface SamsaraStatsResponse {
        data: Array<{
          id: string;
          gps?: { odometerMeters: number };
          engineState?: { value: string };
          fuelPercent?: { value: number };
          engineSeconds?: { value: number };
        }>;
      }

      const response = await this.request<SamsaraStatsResponse>(
        `/fleet/vehicles/stats?vehicleIds=${vehicleId}&types=gps,engineStates,fuelPercents`
      );

      const vehicle = response.data[0];
      if (!vehicle) return null;

      return {
        vehicleId: vehicle.id,
        timestamp: new Date(),
        odometer: vehicle.gps?.odometerMeters
          ? this.metersToMiles(vehicle.gps.odometerMeters)
          : 0,
        engineHours: vehicle.engineSeconds?.value
          ? vehicle.engineSeconds.value / 3600
          : 0,
        fuelLevel: vehicle.fuelPercent?.value,
      };
    } catch {
      return null;
    }
  }

  async getVehicleStatsHistory(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<VehicleStats[]> {
    // Samsara provides stats history through their stats/history endpoint
    interface SamsaraStatsHistoryResponse {
      data: Array<{
        time: string;
        value: number;
      }>;
    }

    const response = await this.request<SamsaraStatsHistoryResponse>(
      `/fleet/vehicles/${vehicleId}/stats/history?startTime=${this.formatDate(startTime)}&endTime=${this.formatDate(endTime)}&types=engineStates`
    );

    return response.data.map((point) => ({
      vehicleId,
      timestamp: new Date(point.time),
      odometer: 0,
      engineHours: 0,
    }));
  }

  // ==================== Drivers ====================

  async getDrivers(): Promise<PaginatedResponse<Driver>> {
    interface SamsaraDriversResponse {
      data: Array<{
        id: string;
        name: string;
        username?: string;
        phone?: string;
        licenseNumber?: string;
        licenseState?: string;
        eldExempt?: boolean;
        tags?: Array<{ name: string }>;
      }>;
      pagination: {
        hasNextPage: boolean;
        endCursor?: string;
      };
    }

    const response = await this.request<SamsaraDriversResponse>('/fleet/drivers');

    return {
      data: response.data.map((d) => {
        const nameParts = d.name.split(' ');
        return {
          id: d.id,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: d.username,
          phone: d.phone,
          licenseNumber: d.licenseNumber,
          licenseState: d.licenseState,
          eldExempt: d.eldExempt,
          tags: d.tags?.map((t) => t.name),
        };
      }),
      pagination: {
        hasMore: response.pagination.hasNextPage,
        cursor: response.pagination.endCursor,
        pageSize: response.data.length,
      },
    };
  }

  async getDriver(driverId: string): Promise<Driver | null> {
    try {
      interface SamsaraDriverResponse {
        data: {
          id: string;
          name: string;
          username?: string;
          phone?: string;
          licenseNumber?: string;
          licenseState?: string;
          eldExempt?: boolean;
        };
      }

      const response = await this.request<SamsaraDriverResponse>(
        `/fleet/drivers/${driverId}`
      );

      const nameParts = response.data.name.split(' ');
      return {
        id: response.data.id,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: response.data.username,
        phone: response.data.phone,
        licenseNumber: response.data.licenseNumber,
        licenseState: response.data.licenseState,
        eldExempt: response.data.eldExempt,
      };
    } catch {
      return null;
    }
  }

  async getDriverVehicleAssignments(): Promise<DriverVehicleAssignment[]> {
    interface SamsaraAssignmentsResponse {
      data: Array<{
        driver: { id: string };
        vehicle: { id: string };
        startTime: string;
        endTime?: string;
      }>;
    }

    const response = await this.request<SamsaraAssignmentsResponse>(
      '/fleet/driver-vehicle-assignments'
    );

    return response.data.map((a) => ({
      driverId: a.driver.id,
      vehicleId: a.vehicle.id,
      startTime: new Date(a.startTime),
      endTime: a.endTime ? new Date(a.endTime) : undefined,
      assignmentType: 'primary' as const,
    }));
  }

  // ==================== Trailers ====================

  async getTrailers(): Promise<PaginatedResponse<Trailer>> {
    interface SamsaraTrailersResponse {
      data: Array<{
        id: string;
        name: string;
        licensePlate?: string;
        tags?: Array<{ name: string }>;
      }>;
      pagination: {
        hasNextPage: boolean;
        endCursor?: string;
      };
    }

    const response = await this.request<SamsaraTrailersResponse>('/fleet/trailers');

    return {
      data: response.data.map((t) => ({
        id: t.id,
        name: t.name,
        type: 'dry_van' as const,
        licensePlate: t.licensePlate,
        status: 'available' as const,
        tags: t.tags?.map((tag) => tag.name),
      })),
      pagination: {
        hasMore: response.pagination.hasNextPage,
        cursor: response.pagination.endCursor,
        pageSize: response.data.length,
      },
    };
  }

  async getTrailer(trailerId: string): Promise<Trailer | null> {
    try {
      const trailers = await this.getTrailers();
      return trailers.data.find((t) => t.id === trailerId) || null;
    } catch {
      return null;
    }
  }

  // ==================== Diagnostics ====================

  async getFaultCodes(vehicleId: string): Promise<FaultCode[]> {
    interface SamsaraFaultsResponse {
      data: Array<{
        id: string;
        vehicle: { id: string };
        j1939: {
          spn: number;
          fmi: number;
          txId: number;
        };
        time: string;
        isCleared: boolean;
      }>;
    }

    const response = await this.request<SamsaraFaultsResponse>(
      `/fleet/vehicles/${vehicleId}/safety/vehicle-harsh-event-settings`
    );

    return response.data.map((f) => ({
      id: f.id,
      vehicleId: f.vehicle.id,
      code: `SPN${f.j1939.spn}-FMI${f.j1939.fmi}`,
      spn: f.j1939.spn,
      fmi: f.j1939.fmi,
      description: `Fault code SPN ${f.j1939.spn} FMI ${f.j1939.fmi}`,
      severity: 'warning' as const,
      occurredAt: new Date(f.time),
      clearedAt: f.isCleared ? new Date() : undefined,
      source: 'engine' as const,
    }));
  }

  async getAllFaultCodes(): Promise<FaultCode[]> {
    // Would need to iterate through all vehicles
    return [];
  }

  async getMaintenanceAlerts(): Promise<MaintenanceAlert[]> {
    // Samsara has maintenance APIs but implementation depends on setup
    return [];
  }

  // ==================== DVIR ====================

  async getDVIRs(startTime: Date, endTime: Date): Promise<DVIR[]> {
    interface SamsaraDVIRsResponse {
      data: Array<{
        id: string;
        vehicle: { id: string };
        trailer?: { id: string };
        driver: { id: string };
        inspectionType: string;
        time: string;
        location?: { latitude: number; longitude: number; name: string };
        defects: Array<{
          id: string;
          defectType: string;
          comment: string;
          isResolved: boolean;
        }>;
        vehicleSafeToOperate: boolean;
        driverSignature: { signedAt: string };
        mechanicSignature?: { signedAt: string };
      }>;
    }

    const response = await this.request<SamsaraDVIRsResponse>(
      `/fleet/maintenance/dvirs?startTime=${this.formatDate(startTime)}&endTime=${this.formatDate(endTime)}`
    );

    return response.data.map((d) => ({
      id: d.id,
      vehicleId: d.vehicle.id,
      trailerId: d.trailer?.id,
      driverId: d.driver.id,
      inspectionType: d.inspectionType === 'pre' ? 'pre_trip' : 'post_trip',
      inspectionTime: new Date(d.time),
      location: d.location?.name,
      coordinates: d.location
        ? { latitude: d.location.latitude, longitude: d.location.longitude }
        : undefined,
      defectsFound: d.defects.map((def) => ({
        id: def.id,
        category: def.defectType,
        description: def.comment,
        severity: 'minor' as const,
        repaired: def.isResolved,
      })),
      safeToOperate: d.vehicleSafeToOperate,
      driverSignature: !!d.driverSignature,
      mechanicSignature: !!d.mechanicSignature,
      mechanicSignedAt: d.mechanicSignature
        ? new Date(d.mechanicSignature.signedAt)
        : undefined,
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
    // Calculate quarter date range
    const startMonth = (quarter - 1) * 3;
    const startDate = new Date(year, startMonth, 1);
    const endDate = new Date(year, startMonth + 3, 0);

    interface SamsaraIFTAResponse {
      data: Array<{
        jurisdiction: string;
        totalDistanceMeters: number;
        fuelConsumedMl: number;
        taxPaidCents: number;
      }>;
    }

    const response = await this.request<SamsaraIFTAResponse>(
      `/fleet/reports/ifta?startDate=${this.formatDate(startDate)}&endDate=${this.formatDate(endDate)}`
    );

    const byJurisdiction = response.data.map((j) => ({
      jurisdiction: j.jurisdiction,
      miles: this.metersToMiles(j.totalDistanceMeters),
      fuel: this.millilitersToGallons(j.fuelConsumedMl),
      taxRate: 0, // Would need to look up state tax rates
      taxOwed: 0,
      taxPaid: j.taxPaidCents / 100,
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
    interface SamsaraGeofencesResponse {
      data: Array<{
        id: string;
        name: string;
        geofence: {
          circle?: { latitude: number; longitude: number; radiusMeters: number };
          polygon?: { vertices: Array<{ latitude: number; longitude: number }> };
        };
        tags?: Array<{ name: string }>;
      }>;
    }

    const response = await this.request<SamsaraGeofencesResponse>('/fleet/addresses');

    return response.data.map((g) => ({
      id: g.id,
      name: g.name,
      type: g.geofence.circle ? 'circle' : 'polygon',
      coordinates: g.geofence.circle
        ? {
            latitude: g.geofence.circle.latitude,
            longitude: g.geofence.circle.longitude,
          }
        : g.geofence.polygon?.vertices[0] || { latitude: 0, longitude: 0 },
      radius: g.geofence.circle?.radiusMeters,
      polygon: g.geofence.polygon?.vertices,
      tags: g.tags?.map((t) => t.name),
    }));
  }

  async getGeofenceEvents(
    startTime: Date,
    endTime: Date,
    geofenceId?: string
  ): Promise<GeofenceEvent[]> {
    interface SamsaraGeofenceEventsResponse {
      data: Array<{
        id: string;
        address: { id: string; name: string };
        vehicle: { id: string };
        driver?: { id: string };
        entryTime?: string;
        exitTime?: string;
        location: { latitude: number; longitude: number };
      }>;
    }

    let endpoint = `/fleet/vehicles/locations/geofence-events?startTime=${this.formatDate(startTime)}&endTime=${this.formatDate(endTime)}`;
    if (geofenceId) {
      endpoint += `&addressIds=${geofenceId}`;
    }

    const response = await this.request<SamsaraGeofenceEventsResponse>(endpoint);

    const events: GeofenceEvent[] = [];
    for (const e of response.data) {
      if (e.entryTime) {
        events.push({
          id: `${e.id}-enter`,
          geofenceId: e.address.id,
          geofenceName: e.address.name,
          vehicleId: e.vehicle.id,
          driverId: e.driver?.id,
          eventType: 'enter',
          timestamp: new Date(e.entryTime),
          coordinates: { latitude: e.location.latitude, longitude: e.location.longitude },
        });
      }
      if (e.exitTime) {
        events.push({
          id: `${e.id}-exit`,
          geofenceId: e.address.id,
          geofenceName: e.address.name,
          vehicleId: e.vehicle.id,
          driverId: e.driver?.id,
          eventType: 'exit',
          timestamp: new Date(e.exitTime),
          coordinates: { latitude: e.location.latitude, longitude: e.location.longitude },
        });
      }
    }

    return events;
  }

  // ==================== Webhooks ====================

  async subscribeToEvents(
    eventTypes: string[],
    webhookUrl: string
  ): Promise<{ subscriptionId: string }> {
    interface SamsaraWebhookResponse {
      data: { id: string };
    }

    const response = await this.request<SamsaraWebhookResponse>('/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        name: 'FocusFreight TMS Integration',
        url: webhookUrl,
        eventTypes: eventTypes,
      }),
    });

    return { subscriptionId: response.data.id };
  }

  async unsubscribeFromEvents(subscriptionId: string): Promise<void> {
    await this.request(`/webhooks/${subscriptionId}`, { method: 'DELETE' });
  }

  parseWebhookPayload(payload: unknown): ELDEvent[] {
    const data = payload as {
      eventType: string;
      eventTime: string;
      data: Record<string, unknown>;
    };

    return [
      {
        id: `samsara-${Date.now()}`,
        type: this.mapEventType(data.eventType),
        provider: 'samsara',
        timestamp: new Date(data.eventTime),
        data: data.data,
      },
    ];
  }

  // ==================== Helper Methods ====================

  private mapHOSStatus(samsaraStatus: string): HOSStatus {
    const statusMap: Record<string, HOSStatus> = {
      offDuty: 'off_duty',
      sleeperBerth: 'sleeper_berth',
      driving: 'driving',
      onDuty: 'on_duty_not_driving',
      yardMove: 'yard_move',
      personalConveyance: 'personal_conveyance',
    };
    return statusMap[samsaraStatus] || 'off_duty';
  }

  private mapEventType(samsaraEventType: string): ELDEvent['type'] {
    const eventMap: Record<string, ELDEvent['type']> = {
      'HosViolation': 'hos_status_change',
      'LocationSample': 'location_update',
      'GeofenceEntry': 'geofence_enter',
      'GeofenceExit': 'geofence_exit',
      'FaultCode': 'fault_detected',
      'FaultCodeCleared': 'fault_cleared',
      'DvirSubmitted': 'dvir_submitted',
    };
    return eventMap[samsaraEventType] || 'location_update';
  }

  private metersPerSecondToMph(mps: number): number {
    return Math.round(mps * 2.237);
  }

  private metersToMiles(meters: number): number {
    return Math.round(meters / 1609.344);
  }

  private millilitersToGallons(ml: number): number {
    return Math.round((ml / 3785.41) * 100) / 100;
  }
}
