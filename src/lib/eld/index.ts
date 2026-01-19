// ELD Service - Unified interface for all ELD providers
// FocusFreight TMS

import { IELDProvider } from './provider-interface';
import { SamsaraProvider } from './providers/samsara';
import { GeotabProvider } from './providers/geotab';
import { MotiveProvider } from './providers/motive';
import {
  AuthToken,
  Driver,
  DriverVehicleAssignment,
  DVIR,
  ELDCredentials,
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

// Provider configurations for UI display
export const ELD_PROVIDERS: ELDProviderConfig[] = [
  {
    provider: 'samsara',
    displayName: 'Samsara',
    description: 'Enterprise fleet management with comprehensive API. Best for mid-to-large fleets.',
    logoUrl: '/integrations/samsara-logo.svg',
    authType: 'api_key',
    features: [
      'gps_tracking', 'hos_logs', 'hos_clocks', 'vehicle_stats', 'fault_codes',
      'dvir', 'ifta', 'geofencing', 'webhooks', 'driver_management', 
      'vehicle_management', 'trailer_tracking'
    ],
    docsUrl: 'https://developers.samsara.com',
    sandboxAvailable: true,
  },
  {
    provider: 'geotab',
    displayName: 'Geotab',
    description: 'Enterprise telematics with extensive customization. Best for large fleets.',
    logoUrl: '/integrations/geotab-logo.svg',
    authType: 'session',
    features: [
      'gps_tracking', 'hos_logs', 'hos_clocks', 'vehicle_stats', 'fault_codes',
      'dvir', 'ifta', 'geofencing', 'webhooks', 'driver_management',
      'vehicle_management', 'trailer_tracking'
    ],
    docsUrl: 'https://developers.geotab.com',
    sandboxAvailable: true,
  },
  {
    provider: 'motive',
    displayName: 'Motive (KeepTruckin)',
    description: 'Popular ELD for owner-operators and small fleets. Great mobile app.',
    logoUrl: '/integrations/motive-logo.svg',
    authType: 'api_key',
    features: [
      'gps_tracking', 'hos_logs', 'hos_clocks', 'vehicle_stats', 'fault_codes',
      'dvir', 'ifta', 'driver_management', 'vehicle_management'
    ],
    docsUrl: 'https://developers.gomotive.com',
    sandboxAvailable: false,
  },
  {
    provider: 'omnitracs',
    displayName: 'Omnitracs',
    description: 'Enterprise fleet solutions for large carriers.',
    logoUrl: '/integrations/omnitracs-logo.svg',
    authType: 'oauth2',
    features: [
      'gps_tracking', 'hos_logs', 'hos_clocks', 'vehicle_stats', 'fault_codes',
      'dvir', 'ifta', 'driver_management', 'vehicle_management'
    ],
    docsUrl: 'https://developer.omnitracs.com',
    sandboxAvailable: false,
  },
  {
    provider: 'bigroad',
    displayName: 'BigRoad',
    description: 'Budget-friendly ELD for small fleets and owner-operators.',
    logoUrl: '/integrations/bigroad-logo.svg',
    authType: 'api_key',
    features: [
      'hos_logs', 'hos_clocks', 'dvir', 'driver_management'
    ],
    docsUrl: 'https://www.bigroad.com',
    sandboxAvailable: false,
  },
];

/**
 * ELD Service - Unified interface for all ELD providers
 * 
 * Usage:
 * ```typescript
 * const eldService = new ELDService();
 * 
 * // Connect to a provider
 * await eldService.connect('samsara', { apiKey: 'your-api-key' });
 * 
 * // Get vehicle locations
 * const locations = await eldService.getVehicleLocations();
 * 
 * // Get HOS clocks
 * const hosClocks = await eldService.getHOSClocks();
 * ```
 */
export class ELDService {
  private providers: Map<ELDProvider, IELDProvider> = new Map();
  private activeProvider: ELDProvider | null = null;

  constructor() {
    // Initialize available providers
    this.providers.set('samsara', new SamsaraProvider());
    this.providers.set('geotab', new GeotabProvider());
    this.providers.set('motive', new MotiveProvider());
  }

  /**
   * Get list of available ELD providers
   */
  getAvailableProviders(): ELDProviderConfig[] {
    return ELD_PROVIDERS;
  }

  /**
   * Get the currently active provider
   */
  getActiveProvider(): ELDProvider | null {
    return this.activeProvider;
  }

  /**
   * Get provider configuration
   */
  getProviderConfig(provider: ELDProvider): ELDProviderConfig | undefined {
    return ELD_PROVIDERS.find((p) => p.provider === provider);
  }

  /**
   * Connect to an ELD provider
   */
  async connect(provider: ELDProvider, credentials: ELDCredentials): Promise<AuthToken> {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const token = await providerInstance.authenticate({
      ...credentials,
      provider,
    });

    this.activeProvider = provider;
    return token;
  }

  /**
   * Disconnect from current provider
   */
  async disconnect(): Promise<void> {
    if (this.activeProvider) {
      const provider = this.providers.get(this.activeProvider);
      if (provider) {
        await provider.revokeAccess();
      }
      this.activeProvider = null;
    }
  }

  /**
   * Test connection to a provider
   */
  async testConnection(provider?: ELDProvider): Promise<boolean> {
    const targetProvider = provider || this.activeProvider;
    if (!targetProvider) {
      throw new Error('No provider specified or connected');
    }

    const providerInstance = this.providers.get(targetProvider);
    if (!providerInstance) {
      throw new Error(`Provider ${targetProvider} is not supported`);
    }

    return providerInstance.testConnection();
  }

  // ==================== Wrapper methods for active provider ====================

  private getActiveProviderInstance(): IELDProvider {
    if (!this.activeProvider) {
      throw new Error('No ELD provider connected. Call connect() first.');
    }
    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      throw new Error(`Provider ${this.activeProvider} not found`);
    }
    return provider;
  }

  // Location
  async getVehicleLocations(): Promise<VehicleLocation[]> {
    return this.getActiveProviderInstance().getVehicleLocations();
  }

  async getVehicleLocation(vehicleId: string): Promise<VehicleLocation | null> {
    return this.getActiveProviderInstance().getVehicleLocation(vehicleId);
  }

  async getLocationHistory(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<LocationHistoryPoint[]> {
    return this.getActiveProviderInstance().getLocationHistory(vehicleId, startTime, endTime);
  }

  // HOS
  async getHOSClocks(): Promise<HOSClock[]> {
    return this.getActiveProviderInstance().getHOSClocks();
  }

  async getHOSClock(driverId: string): Promise<HOSClock | null> {
    return this.getActiveProviderInstance().getHOSClock(driverId);
  }

  async getHOSLogs(startTime: Date, endTime: Date): Promise<HOSLog[]> {
    return this.getActiveProviderInstance().getHOSLogs(startTime, endTime);
  }

  async getDriverHOSLogs(
    driverId: string,
    startTime: Date,
    endTime: Date
  ): Promise<HOSLog[]> {
    return this.getActiveProviderInstance().getDriverHOSLogs(driverId, startTime, endTime);
  }

  async getHOSDailySummary(
    driverId: string,
    date: Date
  ): Promise<HOSDailySummary | null> {
    return this.getActiveProviderInstance().getHOSDailySummary(driverId, date);
  }

  // Vehicles
  async getVehicles(): Promise<PaginatedResponse<Vehicle>> {
    return this.getActiveProviderInstance().getVehicles();
  }

  async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    return this.getActiveProviderInstance().getVehicle(vehicleId);
  }

  async getVehicleStats(vehicleId: string): Promise<VehicleStats | null> {
    return this.getActiveProviderInstance().getVehicleStats(vehicleId);
  }

  async getVehicleStatsHistory(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<VehicleStats[]> {
    return this.getActiveProviderInstance().getVehicleStatsHistory(vehicleId, startTime, endTime);
  }

  // Drivers
  async getDrivers(): Promise<PaginatedResponse<Driver>> {
    return this.getActiveProviderInstance().getDrivers();
  }

  async getDriver(driverId: string): Promise<Driver | null> {
    return this.getActiveProviderInstance().getDriver(driverId);
  }

  async getDriverVehicleAssignments(): Promise<DriverVehicleAssignment[]> {
    return this.getActiveProviderInstance().getDriverVehicleAssignments();
  }

  // Trailers
  async getTrailers(): Promise<PaginatedResponse<Trailer>> {
    return this.getActiveProviderInstance().getTrailers();
  }

  async getTrailer(trailerId: string): Promise<Trailer | null> {
    return this.getActiveProviderInstance().getTrailer(trailerId);
  }

  // Diagnostics
  async getFaultCodes(vehicleId: string): Promise<FaultCode[]> {
    return this.getActiveProviderInstance().getFaultCodes(vehicleId);
  }

  async getAllFaultCodes(): Promise<FaultCode[]> {
    return this.getActiveProviderInstance().getAllFaultCodes();
  }

  async getMaintenanceAlerts(vehicleId?: string): Promise<MaintenanceAlert[]> {
    return this.getActiveProviderInstance().getMaintenanceAlerts(vehicleId);
  }

  // DVIR
  async getDVIRs(startTime: Date, endTime: Date): Promise<DVIR[]> {
    return this.getActiveProviderInstance().getDVIRs(startTime, endTime);
  }

  async getVehicleDVIRs(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<DVIR[]> {
    return this.getActiveProviderInstance().getVehicleDVIRs(vehicleId, startTime, endTime);
  }

  // IFTA
  async getIFTASummary(year: number, quarter: 1 | 2 | 3 | 4): Promise<IFTASummary> {
    return this.getActiveProviderInstance().getIFTASummary(year, quarter);
  }

  // Geofencing
  async getGeofences(): Promise<Geofence[]> {
    return this.getActiveProviderInstance().getGeofences();
  }

  async getGeofenceEvents(
    startTime: Date,
    endTime: Date,
    geofenceId?: string
  ): Promise<GeofenceEvent[]> {
    return this.getActiveProviderInstance().getGeofenceEvents(startTime, endTime, geofenceId);
  }

  // Webhooks
  async subscribeToEvents(
    eventTypes: string[],
    webhookUrl: string
  ): Promise<{ subscriptionId: string }> {
    return this.getActiveProviderInstance().subscribeToEvents(eventTypes, webhookUrl);
  }

  async unsubscribeFromEvents(subscriptionId: string): Promise<void> {
    return this.getActiveProviderInstance().unsubscribeFromEvents(subscriptionId);
  }
}

// Export singleton instance
export const eldService = new ELDService();

// Export all types
export * from './types';
export * from './provider-interface';
