// ELD Integration Types - Fretum-Freight TMS

// ==================== Core Types ====================

export type ELDProvider = 'samsara' | 'geotab' | 'motive' | 'omnitracs' | 'bigroad';

export type HOSStatus = 
  | 'off_duty' 
  | 'sleeper_berth' 
  | 'driving' 
  | 'on_duty_not_driving' 
  | 'yard_move' 
  | 'personal_conveyance';

export type VehicleStatus = 'active' | 'idle' | 'stopped' | 'offline' | 'maintenance';

// ==================== Authentication ====================

export interface ELDCredentials {
  provider: ELDProvider;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  database?: string; // For Geotab
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  tokenType: string;
}

// ==================== Location & GPS ====================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface VehicleLocation {
  vehicleId: string;
  driverId?: string;
  coordinates: Coordinates;
  speed: number; // mph
  heading: number; // 0-360 degrees
  timestamp: Date;
  address?: string;
  odometer?: number; // miles
  engineRunning: boolean;
}

export interface LocationHistoryPoint {
  coordinates: Coordinates;
  timestamp: Date;
  speed: number;
  heading: number;
  address?: string;
}

// ==================== HOS (Hours of Service) ====================

export interface HOSClock {
  driverId: string;
  driverName: string;
  currentStatus: HOSStatus;
  statusStartTime: Date;
  driveTimeRemaining: number; // minutes
  shiftTimeRemaining: number; // minutes
  cycleTimeRemaining: number; // minutes
  breakTimeRemaining: number; // minutes
  violations: HOSViolation[];
  lastUpdated: Date;
}

export interface HOSLog {
  id: string;
  driverId: string;
  driverName: string;
  status: HOSStatus;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  location?: string;
  coordinates?: Coordinates;
  notes?: string;
  certified: boolean;
  edited: boolean;
}

export interface HOSViolation {
  id: string;
  type: 'drive_limit' | 'shift_limit' | 'cycle_limit' | 'break_required' | 'form_manner';
  severity: 'warning' | 'violation';
  description: string;
  occurredAt: Date;
  acknowledged: boolean;
}

export interface HOSDailySummary {
  driverId: string;
  date: Date;
  totalDriveTime: number; // minutes
  totalOnDutyTime: number; // minutes
  totalOffDutyTime: number; // minutes
  totalSleeperTime: number; // minutes
  distanceDriven: number; // miles
  violations: HOSViolation[];
  certified: boolean;
}

// ==================== Vehicles ====================

export interface Vehicle {
  id: string;
  externalId?: string; // Provider's ID
  name: string;
  vin?: string;
  licensePlate?: string;
  make?: string;
  model?: string;
  year?: number;
  status: VehicleStatus;
  currentDriverId?: string;
  currentLocation?: VehicleLocation;
  fuelType?: 'diesel' | 'gasoline' | 'electric' | 'hybrid' | 'cng';
  fuelLevel?: number; // percentage
  odometer?: number; // miles
  engineHours?: number;
  tags?: string[];
}

export interface VehicleStats {
  vehicleId: string;
  timestamp: Date;
  odometer: number; // miles
  engineHours: number;
  fuelLevel?: number; // percentage
  fuelUsed?: number; // gallons
  defLevel?: number; // DEF percentage
  engineRpm?: number;
  engineTemp?: number; // Fahrenheit
  oilPressure?: number; // PSI
  batteryVoltage?: number;
  tirePressures?: { position: string; pressure: number }[];
}

// ==================== Drivers ====================

export interface Driver {
  id: string;
  externalId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
  licenseState?: string;
  licenseExpiry?: Date;
  currentVehicleId?: string;
  currentStatus?: HOSStatus;
  homeTerminal?: string;
  eldExempt?: boolean;
  tags?: string[];
}

export interface DriverVehicleAssignment {
  driverId: string;
  vehicleId: string;
  startTime: Date;
  endTime?: Date;
  assignmentType: 'primary' | 'temporary' | 'co-driver';
}

// ==================== Trailers ====================

export interface Trailer {
  id: string;
  externalId?: string;
  name: string;
  type: 'dry_van' | 'reefer' | 'flatbed' | 'tanker' | 'lowboy' | 'step_deck' | 'other';
  licensePlate?: string;
  vin?: string;
  status: 'available' | 'in_use' | 'maintenance' | 'offline';
  currentVehicleId?: string;
  currentLocation?: Coordinates;
  length?: number; // feet
  capacity?: number; // lbs
  reeferTemp?: number; // For reefer trailers
  tags?: string[];
}

// ==================== Diagnostics & Faults ====================

export interface FaultCode {
  id: string;
  vehicleId: string;
  code: string;
  spn?: number; // Suspect Parameter Number
  fmi?: number; // Failure Mode Indicator
  description: string;
  severity: 'critical' | 'warning' | 'info';
  occurredAt: Date;
  clearedAt?: Date;
  source: 'engine' | 'transmission' | 'abs' | 'reefer' | 'other';
}

export interface MaintenanceAlert {
  id: string;
  vehicleId: string;
  type: 'oil_change' | 'tire_rotation' | 'brake_inspection' | 'dot_inspection' | 'custom';
  description: string;
  dueDate?: Date;
  dueMiles?: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'scheduled' | 'completed' | 'overdue';
}

// ==================== DVIR (Driver Vehicle Inspection Reports) ====================

export interface DVIR {
  id: string;
  vehicleId: string;
  trailerId?: string;
  driverId: string;
  inspectionType: 'pre_trip' | 'post_trip';
  inspectionTime: Date;
  location?: string;
  coordinates?: Coordinates;
  odometer?: number;
  defectsFound: DVIRDefect[];
  safeToOperate: boolean;
  driverSignature: boolean;
  mechanicSignature?: boolean;
  mechanicSignedAt?: Date;
  notes?: string;
}

export interface DVIRDefect {
  id: string;
  category: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  repaired: boolean;
  repairedAt?: Date;
  repairedBy?: string;
  notes?: string;
}

// ==================== IFTA Data ====================

export interface IFTARecord {
  vehicleId: string;
  jurisdiction: string; // State/Province code
  startDate: Date;
  endDate: Date;
  milesDriven: number;
  fuelPurchased: number; // gallons
  taxPaid: number; // dollars
}

export interface IFTASummary {
  quarter: string; // e.g., "2026-Q1"
  totalMiles: number;
  totalFuel: number;
  byJurisdiction: {
    jurisdiction: string;
    miles: number;
    fuel: number;
    taxRate: number;
    taxOwed: number;
    taxPaid: number;
    netTax: number;
  }[];
}

// ==================== Events & Webhooks ====================

export interface ELDEvent {
  id: string;
  type: ELDEventType;
  provider: ELDProvider;
  timestamp: Date;
  data: Record<string, unknown>;
}

export type ELDEventType =
  | 'hos_status_change'
  | 'location_update'
  | 'geofence_enter'
  | 'geofence_exit'
  | 'fault_detected'
  | 'fault_cleared'
  | 'dvir_submitted'
  | 'vehicle_start'
  | 'vehicle_stop'
  | 'speeding'
  | 'hard_brake'
  | 'harsh_acceleration'
  | 'idle_start'
  | 'idle_end';

// ==================== Geofencing ====================

export interface Geofence {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  coordinates: Coordinates; // Center for circle
  radius?: number; // meters, for circle type
  polygon?: Coordinates[]; // For polygon type
  tags?: string[];
}

export interface GeofenceEvent {
  id: string;
  geofenceId: string;
  geofenceName: string;
  vehicleId: string;
  driverId?: string;
  eventType: 'enter' | 'exit';
  timestamp: Date;
  coordinates: Coordinates;
}

// ==================== API Response Types ====================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    hasMore: boolean;
    cursor?: string;
    totalCount?: number;
    pageSize: number;
  };
}

export interface ELDApiError {
  code: string;
  message: string;
  provider: ELDProvider;
  statusCode?: number;
  retryable: boolean;
}

// ==================== Configuration ====================

export interface ELDProviderConfig {
  provider: ELDProvider;
  displayName: string;
  description: string;
  logoUrl: string;
  authType: 'api_key' | 'oauth2' | 'session';
  features: ELDFeature[];
  docsUrl: string;
  sandboxAvailable: boolean;
}

export type ELDFeature =
  | 'gps_tracking'
  | 'hos_logs'
  | 'hos_clocks'
  | 'vehicle_stats'
  | 'fault_codes'
  | 'dvir'
  | 'ifta'
  | 'geofencing'
  | 'webhooks'
  | 'driver_management'
  | 'vehicle_management'
  | 'trailer_tracking';
