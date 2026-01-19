// Geotab ELD Provider Implementation - FocusFreight TMS
// Documentation: https://developers.geotab.com

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

const GEOTAB_API_BASE = 'https://my.geotab.com/apiv1';

/**
 * Geotab ELD Provider
 * 
 * Geotab uses JSON-RPC 2.0 protocol over HTTPS
 * Session-based authentication with 14-day expiry
 */
export class GeotabProvider extends BaseELDProvider {
  readonly provider: ELDProvider = 'geotab';
  
  readonly config: ELDProviderConfig = {
    provider: 'geotab',
    displayName: 'Geotab',
    description: 'Enterprise telematics with extensive API',
    logoUrl: '/integrations/geotab-logo.svg',
    authType: 'session',
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
    docsUrl: 'https://developers.geotab.com',
    sandboxAvailable: true,
  };

  private sessionId: string | null = null;
  private database: string | null = null;

  private async rpcCall<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    if (!this.sessionId || !this.database) {
      throw new Error('Not authenticated with Geotab');
    }

    const response = await fetch(GEOTAB_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method,
        params: {
          ...params,
          credentials: {
            database: this.database,
            sessionId: this.sessionId,
          },
        },
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(`Geotab API error: ${result.error.message}`);
    }

    return result.result;
  }

  // ==================== Authentication ====================

  async authenticate(credentials: ELDCredentials): Promise<AuthToken> {
    if (!credentials.apiKey || !credentials.clientId || !credentials.database) {
      throw new Error('Geotab requires username (apiKey), password (clientId), and database');
    }

    const response = await fetch(GEOTAB_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'Authenticate',
        params: {
          userName: credentials.apiKey,
          password: credentials.clientId,
          database: credentials.database,
        },
      }),
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(`Geotab authentication failed: ${result.error.message}`);
    }

    this.sessionId = result.result.credentials.sessionId;
    this.database = result.result.credentials.database;

    const token: AuthToken = {
      accessToken: this.sessionId,
      tokenType: 'Session',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    };

    this.setCredentials(credentials, token);
    return token;
  }

  async refreshToken(): Promise<AuthToken> {
    if (!this.credentials) {
      throw new Error('No credentials to refresh');
    }
    return this.authenticate(this.credentials);
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.rpcCall('Get', { typeName: 'User', search: { id: 'b1' }, resultsLimit: 1 });
      return true;
    } catch {
      return false;
    }
  }

  async revokeAccess(): Promise<void> {
    this.sessionId = null;
    this.database = null;
    this.credentials = null;
  }

  // ==================== Location ====================

  async getVehicleLocations(): Promise<VehicleLocation[]> {
    interface GeotabDeviceStatus {
      device: { id: string; name: string };
      driver?: { id: string };
      latitude: number;
      longitude: number;
      speed: number;
      bearing: number;
      dateTime: string;
      isDeviceCommunicating: boolean;
    }

    const statuses = await this.rpcCall<GeotabDeviceStatus[]>('Get', {
      typeName: 'DeviceStatusInfo',
    });

    return statuses.map((s) => ({
      vehicleId: s.device.id,
      driverId: s.driver?.id,
      coordinates: {
        latitude: s.latitude,
        longitude: s.longitude,
      },
      speed: this.kmhToMph(s.speed),
      heading: s.bearing,
      timestamp: new Date(s.dateTime),
      engineRunning: s.isDeviceCommunicating,
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
    interface GeotabLogRecord {
      latitude: number;
      longitude: number;
      speed: number;
      dateTime: string;
    }

    const logs = await this.rpcCall<GeotabLogRecord[]>('Get', {
      typeName: 'LogRecord',
      search: {
        deviceSearch: { id: vehicleId },
        fromDate: startTime.toISOString(),
        toDate: endTime.toISOString(),
      },
    });

    return logs.map((log) => ({
      coordinates: {
        latitude: log.latitude,
        longitude: log.longitude,
      },
      timestamp: new Date(log.dateTime),
      speed: this.kmhToMph(log.speed),
      heading: 0,
    }));
  }

  // ==================== HOS ====================

  async getHOSClocks(): Promise<HOSClock[]> {
    interface GeotabDutyStatus {
      driver: { id: string; firstName: string; lastName: string };
      status: string;
      dateTime: string;
      drivingDuration: string;
      dutyDuration: string;
      cycleDuty: string;
      workdayDrivingDuration: string;
    }

    const statuses = await this.rpcCall<GeotabDutyStatus[]>('Get', {
      typeName: 'DutyStatusAvailability',
    });

    return statuses.map((s) => ({
      driverId: s.driver.id,
      driverName: `${s.driver.firstName} ${s.driver.lastName}`,
      currentStatus: this.mapGeotabHOSStatus(s.status),
      statusStartTime: new Date(s.dateTime),
      driveTimeRemaining: this.parseDuration(s.drivingDuration),
      shiftTimeRemaining: this.parseDuration(s.dutyDuration),
      cycleTimeRemaining: this.parseDuration(s.cycleDuty),
      breakTimeRemaining: 0,
      violations: [],
      lastUpdated: new Date(),
    }));
  }

  async getHOSClock(driverId: string): Promise<HOSClock | null> {
    const clocks = await this.getHOSClocks();
    return clocks.find((c) => c.driverId === driverId) || null;
  }

  async getHOSLogs(startTime: Date, endTime: Date): Promise<HOSLog[]> {
    interface GeotabDutyStatusLog {
      id: string;
      driver: { id: string; firstName: string; lastName: string };
      status: string;
      dateTime: string;
      location?: { x: number; y: number };
      annotations?: Array<{ comment: string }>;
    }

    const logs = await this.rpcCall<GeotabDutyStatusLog[]>('Get', {
      typeName: 'DutyStatusLog',
      search: {
        fromDate: startTime.toISOString(),
        toDate: endTime.toISOString(),
      },
    });

    return logs.map((log) => ({
      id: log.id,
      driverId: log.driver.id,
      driverName: `${log.driver.firstName} ${log.driver.lastName}`,
      status: this.mapGeotabHOSStatus(log.status),
      startTime: new Date(log.dateTime),
      duration: 0,
      coordinates: log.location
        ? { latitude: log.location.y, longitude: log.location.x }
        : undefined,
      notes: log.annotations?.[0]?.comment,
      certified: true,
      edited: false,
    }));
  }

  async getDriverHOSLogs(
    driverId: string,
    startTime: Date,
    endTime: Date
  ): Promise<HOSLog[]> {
    interface GeotabDutyStatusLog {
      id: string;
      driver: { id: string; firstName: string; lastName: string };
      status: string;
      dateTime: string;
      location?: { x: number; y: number };
    }

    const logs = await this.rpcCall<GeotabDutyStatusLog[]>('Get', {
      typeName: 'DutyStatusLog',
      search: {
        userSearch: { id: driverId },
        fromDate: startTime.toISOString(),
        toDate: endTime.toISOString(),
      },
    });

    return logs.map((log) => ({
      id: log.id,
      driverId: log.driver.id,
      driverName: `${log.driver.firstName} ${log.driver.lastName}`,
      status: this.mapGeotabHOSStatus(log.status),
      startTime: new Date(log.dateTime),
      duration: 0,
      certified: true,
      edited: false,
    }));
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
      totalDriveTime: 0,
      totalOnDutyTime: 0,
      totalOffDutyTime: 0,
      totalSleeperTime: 0,
      distanceDriven: 0,
      violations: [],
      certified: true,
    };
  }

  // ==================== Vehicles ====================

  async getVehicles(): Promise<PaginatedResponse<Vehicle>> {
    interface GeotabDevice {
      id: string;
      name: string;
      vehicleIdentificationNumber?: string;
      licensePlate?: string;
      comment?: string;
      groups?: Array<{ name: string }>;
    }

    const devices = await this.rpcCall<GeotabDevice[]>('Get', {
      typeName: 'Device',
    });

    return {
      data: devices.map((d) => ({
        id: d.id,
        name: d.name,
        vin: d.vehicleIdentificationNumber,
        licensePlate: d.licensePlate,
        status: 'active' as const,
        tags: d.groups?.map((g) => g.name),
      })),
      pagination: {
        hasMore: false,
        pageSize: devices.length,
      },
    };
  }

  async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    interface GeotabDevice {
      id: string;
      name: string;
      vehicleIdentificationNumber?: string;
      licensePlate?: string;
    }

    const devices = await this.rpcCall<GeotabDevice[]>('Get', {
      typeName: 'Device',
      search: { id: vehicleId },
    });

    if (devices.length === 0) return null;

    const d = devices[0];
    return {
      id: d.id,
      name: d.name,
      vin: d.vehicleIdentificationNumber,
      licensePlate: d.licensePlate,
      status: 'active',
    };
  }

  async getVehicleStats(vehicleId: string): Promise<VehicleStats | null> {
    interface GeotabStatusData {
      device: { id: string };
      diagnostic: { name: string };
      data: number;
      dateTime: string;
    }

    const stats = await this.rpcCall<GeotabStatusData[]>('Get', {
      typeName: 'StatusData',
      search: {
        deviceSearch: { id: vehicleId },
        diagnosticSearch: { id: 'DiagnosticOdometerAdjustmentId' },
      },
      resultsLimit: 1,
    });

    if (stats.length === 0) return null;

    return {
      vehicleId,
      timestamp: new Date(stats[0].dateTime),
      odometer: this.kmToMiles(stats[0].data / 1000),
      engineHours: 0,
    };
  }

  async getVehicleStatsHistory(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<VehicleStats[]> {
    interface GeotabStatusData {
      data: number;
      dateTime: string;
    }

    const stats = await this.rpcCall<GeotabStatusData[]>('Get', {
      typeName: 'StatusData',
      search: {
        deviceSearch: { id: vehicleId },
        fromDate: startTime.toISOString(),
        toDate: endTime.toISOString(),
      },
    });

    return stats.map((s) => ({
      vehicleId,
      timestamp: new Date(s.dateTime),
      odometer: this.kmToMiles(s.data / 1000),
      engineHours: 0,
    }));
  }

  // ==================== Drivers ====================

  async getDrivers(): Promise<PaginatedResponse<Driver>> {
    interface GeotabUser {
      id: string;
      firstName: string;
      lastName: string;
      name: string;
      phoneNumber?: string;
      licenseNumber?: string;
      licenseProvince?: string;
      isDriver: boolean;
    }

    const users = await this.rpcCall<GeotabUser[]>('Get', {
      typeName: 'User',
      search: { isDriver: true },
    });

    return {
      data: users
        .filter((u) => u.isDriver)
        .map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.name,
          phone: u.phoneNumber,
          licenseNumber: u.licenseNumber,
          licenseState: u.licenseProvince,
        })),
      pagination: {
        hasMore: false,
        pageSize: users.length,
      },
    };
  }

  async getDriver(driverId: string): Promise<Driver | null> {
    interface GeotabUser {
      id: string;
      firstName: string;
      lastName: string;
      name: string;
      phoneNumber?: string;
      licenseNumber?: string;
    }

    const users = await this.rpcCall<GeotabUser[]>('Get', {
      typeName: 'User',
      search: { id: driverId },
    });

    if (users.length === 0) return null;

    const u = users[0];
    return {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.name,
      phone: u.phoneNumber,
      licenseNumber: u.licenseNumber,
    };
  }

  async getDriverVehicleAssignments(): Promise<DriverVehicleAssignment[]> {
    interface GeotabDriverChange {
      driver: { id: string };
      device: { id: string };
      dateTime: string;
      type: string;
    }

    const changes = await this.rpcCall<GeotabDriverChange[]>('Get', {
      typeName: 'DriverChange',
      search: {
        fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    return changes.map((c) => ({
      driverId: c.driver.id,
      vehicleId: c.device.id,
      startTime: new Date(c.dateTime),
      assignmentType: 'primary' as const,
    }));
  }

  // ==================== Trailers ====================

  async getTrailers(): Promise<PaginatedResponse<Trailer>> {
    interface GeotabTrailer {
      id: string;
      name: string;
      comment?: string;
    }

    const trailers = await this.rpcCall<GeotabTrailer[]>('Get', {
      typeName: 'Trailer',
    });

    return {
      data: trailers.map((t) => ({
        id: t.id,
        name: t.name,
        type: 'dry_van' as const,
        status: 'available' as const,
      })),
      pagination: {
        hasMore: false,
        pageSize: trailers.length,
      },
    };
  }

  async getTrailer(trailerId: string): Promise<Trailer | null> {
    const trailers = await this.getTrailers();
    return trailers.data.find((t) => t.id === trailerId) || null;
  }

  // ==================== Diagnostics ====================

  async getFaultCodes(vehicleId: string): Promise<FaultCode[]> {
    interface GeotabFaultData {
      id: string;
      device: { id: string };
      diagnostic: { name: string; code?: number };
      dateTime: string;
      dismissDateTime?: string;
    }

    const faults = await this.rpcCall<GeotabFaultData[]>('Get', {
      typeName: 'FaultData',
      search: {
        deviceSearch: { id: vehicleId },
        fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    return faults.map((f) => ({
      id: f.id,
      vehicleId: f.device.id,
      code: f.diagnostic.code?.toString() || 'Unknown',
      description: f.diagnostic.name,
      severity: 'warning' as const,
      occurredAt: new Date(f.dateTime),
      clearedAt: f.dismissDateTime ? new Date(f.dismissDateTime) : undefined,
      source: 'engine' as const,
    }));
  }

  async getAllFaultCodes(): Promise<FaultCode[]> {
    interface GeotabFaultData {
      id: string;
      device: { id: string };
      diagnostic: { name: string; code?: number };
      dateTime: string;
      dismissDateTime?: string;
    }

    const faults = await this.rpcCall<GeotabFaultData[]>('Get', {
      typeName: 'FaultData',
      search: {
        fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    return faults.map((f) => ({
      id: f.id,
      vehicleId: f.device.id,
      code: f.diagnostic.code?.toString() || 'Unknown',
      description: f.diagnostic.name,
      severity: 'warning' as const,
      occurredAt: new Date(f.dateTime),
      clearedAt: f.dismissDateTime ? new Date(f.dismissDateTime) : undefined,
      source: 'engine' as const,
    }));
  }

  async getMaintenanceAlerts(): Promise<MaintenanceAlert[]> {
    // Geotab has maintenance reminders but requires specific setup
    return [];
  }

  // ==================== DVIR ====================

  async getDVIRs(startTime: Date, endTime: Date): Promise<DVIR[]> {
    interface GeotabDVIR {
      id: string;
      device: { id: string };
      driver: { id: string };
      dateTime: string;
      defectList?: Array<{ defect: { name: string }; severity: string }>;
      isSafeToOperate: boolean;
      logType: string;
    }

    const dvirs = await this.rpcCall<GeotabDVIR[]>('Get', {
      typeName: 'DVIRLog',
      search: {
        fromDate: startTime.toISOString(),
        toDate: endTime.toISOString(),
      },
    });

    return dvirs.map((d) => ({
      id: d.id,
      vehicleId: d.device.id,
      driverId: d.driver.id,
      inspectionType: d.logType === 'PreTrip' ? 'pre_trip' : 'post_trip',
      inspectionTime: new Date(d.dateTime),
      defectsFound: (d.defectList || []).map((def, idx) => ({
        id: `${d.id}-${idx}`,
        category: 'General',
        description: def.defect.name,
        severity: def.severity === 'Critical' ? 'critical' : 'minor',
        repaired: false,
      })),
      safeToOperate: d.isSafeToOperate,
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
    const startMonth = (quarter - 1) * 3;
    const startDate = new Date(year, startMonth, 1);
    const endDate = new Date(year, startMonth + 3, 0);

    interface GeotabFuelTaxDetail {
      jurisdiction: string;
      totalDistance: number;
      totalFuel: number;
    }

    const details = await this.rpcCall<GeotabFuelTaxDetail[]>('Get', {
      typeName: 'FuelTaxDetail',
      search: {
        fromDate: startDate.toISOString(),
        toDate: endDate.toISOString(),
      },
    });

    const byJurisdiction = details.map((d) => ({
      jurisdiction: d.jurisdiction,
      miles: this.kmToMiles(d.totalDistance),
      fuel: this.litersToGallons(d.totalFuel),
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
    interface GeotabZone {
      id: string;
      name: string;
      centroid: { x: number; y: number };
      points: Array<{ x: number; y: number }>;
    }

    const zones = await this.rpcCall<GeotabZone[]>('Get', {
      typeName: 'Zone',
    });

    return zones.map((z) => ({
      id: z.id,
      name: z.name,
      type: 'polygon' as const,
      coordinates: {
        latitude: z.centroid.y,
        longitude: z.centroid.x,
      },
      polygon: z.points.map((p) => ({
        latitude: p.y,
        longitude: p.x,
      })),
    }));
  }

  async getGeofenceEvents(
    startTime: Date,
    endTime: Date,
    geofenceId?: string
  ): Promise<GeofenceEvent[]> {
    interface GeotabException {
      id: string;
      device: { id: string };
      driver?: { id: string };
      rule: { id: string; name: string };
      activeFrom: string;
      activeTo?: string;
    }

    const search: Record<string, unknown> = {
      fromDate: startTime.toISOString(),
      toDate: endTime.toISOString(),
    };

    if (geofenceId) {
      search.ruleSearch = { id: geofenceId };
    }

    const exceptions = await this.rpcCall<GeotabException[]>('Get', {
      typeName: 'ExceptionEvent',
      search,
    });

    const events: GeofenceEvent[] = [];
    for (const e of exceptions) {
      events.push({
        id: `${e.id}-enter`,
        geofenceId: e.rule.id,
        geofenceName: e.rule.name,
        vehicleId: e.device.id,
        driverId: e.driver?.id,
        eventType: 'enter',
        timestamp: new Date(e.activeFrom),
        coordinates: { latitude: 0, longitude: 0 },
      });

      if (e.activeTo) {
        events.push({
          id: `${e.id}-exit`,
          geofenceId: e.rule.id,
          geofenceName: e.rule.name,
          vehicleId: e.device.id,
          driverId: e.driver?.id,
          eventType: 'exit',
          timestamp: new Date(e.activeTo),
          coordinates: { latitude: 0, longitude: 0 },
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
    // Geotab uses Data Feed API for real-time data
    // Webhooks require Geotab Add-In setup
    console.log('Geotab webhook subscription:', eventTypes, webhookUrl);
    return { subscriptionId: `geotab-${Date.now()}` };
  }

  async unsubscribeFromEvents(): Promise<void> {
    // Implementation depends on subscription method used
  }

  parseWebhookPayload(payload: unknown): ELDEvent[] {
    const data = payload as {
      typeName: string;
      dateTime: string;
      data: Record<string, unknown>;
    };

    return [
      {
        id: `geotab-${Date.now()}`,
        type: 'location_update',
        provider: 'geotab',
        timestamp: new Date(data.dateTime),
        data: data.data,
      },
    ];
  }

  // ==================== Helper Methods ====================

  private mapGeotabHOSStatus(status: string): HOSStatus {
    const statusMap: Record<string, HOSStatus> = {
      D: 'driving',
      ON: 'on_duty_not_driving',
      OFF: 'off_duty',
      SB: 'sleeper_berth',
      PC: 'personal_conveyance',
      YM: 'yard_move',
    };
    return statusMap[status] || 'off_duty';
  }

  private parseDuration(duration: string): number {
    // Parse ISO 8601 duration like PT8H30M
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    return hours * 60 + minutes;
  }

  private kmhToMph(kmh: number): number {
    return Math.round(kmh * 0.621371);
  }

  private kmToMiles(km: number): number {
    return Math.round(km * 0.621371);
  }

  private litersToGallons(liters: number): number {
    return Math.round(liters * 0.264172 * 100) / 100;
  }
}
