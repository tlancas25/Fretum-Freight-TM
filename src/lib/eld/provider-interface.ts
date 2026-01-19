// ELD Provider Abstract Interface - FocusFreight TMS

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
} from './types';

/**
 * Abstract interface for ELD Provider integrations.
 * All ELD providers (Samsara, Geotab, Motive, etc.) must implement this interface.
 */
export interface IELDProvider {
  readonly provider: ELDProvider;
  readonly config: ELDProviderConfig;

  // ==================== Authentication ====================

  /**
   * Authenticate with the ELD provider
   */
  authenticate(credentials: ELDCredentials): Promise<AuthToken>;

  /**
   * Refresh an expired access token
   */
  refreshToken(refreshToken: string): Promise<AuthToken>;

  /**
   * Test if the current credentials are valid
   */
  testConnection(): Promise<boolean>;

  /**
   * Revoke access tokens (logout)
   */
  revokeAccess(): Promise<void>;

  // ==================== Real-time Location ====================

  /**
   * Get current locations for all vehicles
   */
  getVehicleLocations(): Promise<VehicleLocation[]>;

  /**
   * Get current location for a specific vehicle
   */
  getVehicleLocation(vehicleId: string): Promise<VehicleLocation | null>;

  /**
   * Get location history for a vehicle
   */
  getLocationHistory(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<LocationHistoryPoint[]>;

  // ==================== HOS (Hours of Service) ====================

  /**
   * Get current HOS clocks for all drivers
   */
  getHOSClocks(): Promise<HOSClock[]>;

  /**
   * Get current HOS clock for a specific driver
   */
  getHOSClock(driverId: string): Promise<HOSClock | null>;

  /**
   * Get HOS logs for a date range
   */
  getHOSLogs(startTime: Date, endTime: Date): Promise<HOSLog[]>;

  /**
   * Get HOS logs for a specific driver
   */
  getDriverHOSLogs(
    driverId: string,
    startTime: Date,
    endTime: Date
  ): Promise<HOSLog[]>;

  /**
   * Get HOS daily summary for a driver
   */
  getHOSDailySummary(
    driverId: string,
    date: Date
  ): Promise<HOSDailySummary | null>;

  // ==================== Vehicles ====================

  /**
   * Get all vehicles
   */
  getVehicles(): Promise<PaginatedResponse<Vehicle>>;

  /**
   * Get a specific vehicle by ID
   */
  getVehicle(vehicleId: string): Promise<Vehicle | null>;

  /**
   * Get vehicle statistics (fuel, odometer, engine data)
   */
  getVehicleStats(vehicleId: string): Promise<VehicleStats | null>;

  /**
   * Get vehicle stats history
   */
  getVehicleStatsHistory(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<VehicleStats[]>;

  // ==================== Drivers ====================

  /**
   * Get all drivers
   */
  getDrivers(): Promise<PaginatedResponse<Driver>>;

  /**
   * Get a specific driver by ID
   */
  getDriver(driverId: string): Promise<Driver | null>;

  /**
   * Get current driver-vehicle assignments
   */
  getDriverVehicleAssignments(): Promise<DriverVehicleAssignment[]>;

  // ==================== Trailers ====================

  /**
   * Get all trailers
   */
  getTrailers(): Promise<PaginatedResponse<Trailer>>;

  /**
   * Get a specific trailer by ID
   */
  getTrailer(trailerId: string): Promise<Trailer | null>;

  // ==================== Diagnostics ====================

  /**
   * Get active fault codes for a vehicle
   */
  getFaultCodes(vehicleId: string): Promise<FaultCode[]>;

  /**
   * Get all active fault codes across the fleet
   */
  getAllFaultCodes(): Promise<FaultCode[]>;

  /**
   * Get maintenance alerts
   */
  getMaintenanceAlerts(vehicleId?: string): Promise<MaintenanceAlert[]>;

  // ==================== DVIR ====================

  /**
   * Get DVIRs for a date range
   */
  getDVIRs(startTime: Date, endTime: Date): Promise<DVIR[]>;

  /**
   * Get DVIRs for a specific vehicle
   */
  getVehicleDVIRs(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<DVIR[]>;

  // ==================== IFTA ====================

  /**
   * Get IFTA summary for a quarter
   */
  getIFTASummary(year: number, quarter: 1 | 2 | 3 | 4): Promise<IFTASummary>;

  // ==================== Geofencing ====================

  /**
   * Get all geofences
   */
  getGeofences(): Promise<Geofence[]>;

  /**
   * Get geofence events for a date range
   */
  getGeofenceEvents(
    startTime: Date,
    endTime: Date,
    geofenceId?: string
  ): Promise<GeofenceEvent[]>;

  // ==================== Webhooks / Events ====================

  /**
   * Subscribe to real-time events
   */
  subscribeToEvents(
    eventTypes: string[],
    webhookUrl: string
  ): Promise<{ subscriptionId: string }>;

  /**
   * Unsubscribe from events
   */
  unsubscribeFromEvents(subscriptionId: string): Promise<void>;

  /**
   * Parse incoming webhook payload
   */
  parseWebhookPayload(payload: unknown): ELDEvent[];
}

/**
 * Base class with common functionality for ELD providers
 */
export abstract class BaseELDProvider implements IELDProvider {
  abstract readonly provider: ELDProvider;
  abstract readonly config: ELDProviderConfig;

  protected credentials: ELDCredentials | null = null;
  protected accessToken: string | null = null;
  protected tokenExpiresAt: Date | null = null;

  // Abstract methods that must be implemented by each provider
  abstract authenticate(credentials: ELDCredentials): Promise<AuthToken>;
  abstract refreshToken(refreshToken: string): Promise<AuthToken>;
  abstract testConnection(): Promise<boolean>;
  abstract revokeAccess(): Promise<void>;
  abstract getVehicleLocations(): Promise<VehicleLocation[]>;
  abstract getVehicleLocation(vehicleId: string): Promise<VehicleLocation | null>;
  abstract getLocationHistory(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<LocationHistoryPoint[]>;
  abstract getHOSClocks(): Promise<HOSClock[]>;
  abstract getHOSClock(driverId: string): Promise<HOSClock | null>;
  abstract getHOSLogs(startTime: Date, endTime: Date): Promise<HOSLog[]>;
  abstract getDriverHOSLogs(
    driverId: string,
    startTime: Date,
    endTime: Date
  ): Promise<HOSLog[]>;
  abstract getHOSDailySummary(
    driverId: string,
    date: Date
  ): Promise<HOSDailySummary | null>;
  abstract getVehicles(): Promise<PaginatedResponse<Vehicle>>;
  abstract getVehicle(vehicleId: string): Promise<Vehicle | null>;
  abstract getVehicleStats(vehicleId: string): Promise<VehicleStats | null>;
  abstract getVehicleStatsHistory(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<VehicleStats[]>;
  abstract getDrivers(): Promise<PaginatedResponse<Driver>>;
  abstract getDriver(driverId: string): Promise<Driver | null>;
  abstract getDriverVehicleAssignments(): Promise<DriverVehicleAssignment[]>;
  abstract getTrailers(): Promise<PaginatedResponse<Trailer>>;
  abstract getTrailer(trailerId: string): Promise<Trailer | null>;
  abstract getFaultCodes(vehicleId: string): Promise<FaultCode[]>;
  abstract getAllFaultCodes(): Promise<FaultCode[]>;
  abstract getMaintenanceAlerts(vehicleId?: string): Promise<MaintenanceAlert[]>;
  abstract getDVIRs(startTime: Date, endTime: Date): Promise<DVIR[]>;
  abstract getVehicleDVIRs(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<DVIR[]>;
  abstract getIFTASummary(
    year: number,
    quarter: 1 | 2 | 3 | 4
  ): Promise<IFTASummary>;
  abstract getGeofences(): Promise<Geofence[]>;
  abstract getGeofenceEvents(
    startTime: Date,
    endTime: Date,
    geofenceId?: string
  ): Promise<GeofenceEvent[]>;
  abstract subscribeToEvents(
    eventTypes: string[],
    webhookUrl: string
  ): Promise<{ subscriptionId: string }>;
  abstract unsubscribeFromEvents(subscriptionId: string): Promise<void>;
  abstract parseWebhookPayload(payload: unknown): ELDEvent[];

  /**
   * Check if the current token is expired
   */
  protected isTokenExpired(): boolean {
    if (!this.tokenExpiresAt) return true;
    // Consider token expired 5 minutes before actual expiry
    const bufferMs = 5 * 60 * 1000;
    return new Date().getTime() > this.tokenExpiresAt.getTime() - bufferMs;
  }

  /**
   * Set credentials and token
   */
  protected setCredentials(credentials: ELDCredentials, token?: AuthToken): void {
    this.credentials = credentials;
    if (token) {
      this.accessToken = token.accessToken;
      this.tokenExpiresAt = token.expiresAt;
    }
  }

  /**
   * Format date for API requests
   */
  protected formatDate(date: Date): string {
    return date.toISOString();
  }

  /**
   * Calculate minutes between two dates
   */
  protected minutesBetween(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }
}
