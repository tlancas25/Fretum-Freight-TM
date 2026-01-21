/**
 * @module Feature Access Control
 * 
 * This module provides tier-based feature access control for the FocusFreight TMS.
 * It defines which features are available at each subscription tier and provides
 * utilities for checking feature access.
 */

// Subscription tier types - matches Tenant.plan in types.ts
export type SubscriptionTier = 'trial' | 'starter' | 'professional' | 'enterprise';

// Feature categories for organization
export type FeatureCategory = 
  | 'core'           // Basic TMS functionality
  | 'dispatch'       // Dispatch and load management
  | 'fleet'          // Fleet management
  | 'accounting'     // Financial features
  | 'integrations'   // Third-party integrations
  | 'reporting'      // Reporting and analytics
  | 'compliance'     // Compliance and regulations
  | 'advanced';      // Advanced features

// All available features in the system
export type Feature =
  // Core Features
  | 'dashboard'
  | 'loads_view'
  | 'loads_create'
  | 'loads_edit'
  | 'customers_view'
  | 'customers_manage'
  
  // Dispatch Features
  | 'dispatch_board'
  | 'dispatch_assign'
  | 'dispatch_tracking'
  | 'live_tracking'
  
  // Fleet Features
  | 'fleet_view'
  | 'fleet_manage'
  | 'fleet_maintenance'
  | 'fleet_documents'
  
  // Accounting Features
  | 'invoices_view'
  | 'invoices_create'
  | 'invoices_send'
  | 'expenses_view'
  | 'expenses_manage'
  | 'settlements_view'
  | 'settlements_create'
  
  // Integration Features
  | 'eld_integrations'
  | 'eld_samsara'
  | 'eld_motive'
  | 'eld_geotab'
  | 'quickbooks_integration'
  | 'factoring_integration'
  | 'load_board_integration'
  | 'api_access'
  
  // Reporting Features
  | 'reports_basic'
  | 'reports_advanced'
  | 'reports_export'
  | 'reports_scheduled'
  | 'ifta_reporting'
  | 'fuel_tax_reports'
  
  // Compliance Features
  | 'bol_generation'
  | 'document_management'
  | 'hos_compliance'
  | 'safety_compliance'
  
  // Advanced Features
  | 'ai_load_extraction'
  | 'route_optimization'
  | 'predictive_analytics'
  | 'multi_location'
  | 'custom_branding'
  | 'priority_support'
  | 'unlimited_users'
  | 'unlimited_loads';

// Feature metadata for UI display
export interface FeatureInfo {
  id: Feature;
  name: string;
  description: string;
  category: FeatureCategory;
}

// Feature catalog with display information
export const FEATURE_CATALOG: Record<Feature, FeatureInfo> = {
  // Core Features
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Main dashboard with key metrics and overview',
    category: 'core',
  },
  loads_view: {
    id: 'loads_view',
    name: 'View Loads',
    description: 'View and search all loads',
    category: 'core',
  },
  loads_create: {
    id: 'loads_create',
    name: 'Create Loads',
    description: 'Create new load entries',
    category: 'core',
  },
  loads_edit: {
    id: 'loads_edit',
    name: 'Edit Loads',
    description: 'Edit and update load information',
    category: 'core',
  },
  customers_view: {
    id: 'customers_view',
    name: 'View Customers',
    description: 'View customer list and details',
    category: 'core',
  },
  customers_manage: {
    id: 'customers_manage',
    name: 'Manage Customers',
    description: 'Add, edit, and manage customer records',
    category: 'core',
  },

  // Dispatch Features
  dispatch_board: {
    id: 'dispatch_board',
    name: 'Dispatch Board',
    description: 'Visual dispatch board for load management',
    category: 'dispatch',
  },
  dispatch_assign: {
    id: 'dispatch_assign',
    name: 'Assign Drivers',
    description: 'Assign drivers and equipment to loads',
    category: 'dispatch',
  },
  dispatch_tracking: {
    id: 'dispatch_tracking',
    name: 'Dispatch Tracking',
    description: 'Track load progress and status updates',
    category: 'dispatch',
  },
  live_tracking: {
    id: 'live_tracking',
    name: 'Live GPS Tracking',
    description: 'Real-time GPS tracking of fleet vehicles',
    category: 'dispatch',
  },

  // Fleet Features
  fleet_view: {
    id: 'fleet_view',
    name: 'View Fleet',
    description: 'View trucks, trailers, and equipment',
    category: 'fleet',
  },
  fleet_manage: {
    id: 'fleet_manage',
    name: 'Manage Fleet',
    description: 'Add and manage fleet vehicles',
    category: 'fleet',
  },
  fleet_maintenance: {
    id: 'fleet_maintenance',
    name: 'Maintenance Tracking',
    description: 'Track vehicle maintenance and service schedules',
    category: 'fleet',
  },
  fleet_documents: {
    id: 'fleet_documents',
    name: 'Fleet Documents',
    description: 'Manage registrations, insurance, and permits',
    category: 'fleet',
  },

  // Accounting Features
  invoices_view: {
    id: 'invoices_view',
    name: 'View Invoices',
    description: 'View all invoices and payment status',
    category: 'accounting',
  },
  invoices_create: {
    id: 'invoices_create',
    name: 'Create Invoices',
    description: 'Generate invoices from loads',
    category: 'accounting',
  },
  invoices_send: {
    id: 'invoices_send',
    name: 'Send Invoices',
    description: 'Email invoices directly to customers',
    category: 'accounting',
  },
  expenses_view: {
    id: 'expenses_view',
    name: 'View Expenses',
    description: 'View expense records',
    category: 'accounting',
  },
  expenses_manage: {
    id: 'expenses_manage',
    name: 'Manage Expenses',
    description: 'Track and categorize expenses',
    category: 'accounting',
  },
  settlements_view: {
    id: 'settlements_view',
    name: 'View Settlements',
    description: 'View driver settlement statements',
    category: 'accounting',
  },
  settlements_create: {
    id: 'settlements_create',
    name: 'Create Settlements',
    description: 'Generate driver pay settlements',
    category: 'accounting',
  },

  // Integration Features
  eld_integrations: {
    id: 'eld_integrations',
    name: 'ELD Integrations',
    description: 'Connect with ELD providers for HOS data',
    category: 'integrations',
  },
  eld_samsara: {
    id: 'eld_samsara',
    name: 'Samsara Integration',
    description: 'Connect with Samsara ELD',
    category: 'integrations',
  },
  eld_motive: {
    id: 'eld_motive',
    name: 'Motive Integration',
    description: 'Connect with Motive (KeepTruckin) ELD',
    category: 'integrations',
  },
  eld_geotab: {
    id: 'eld_geotab',
    name: 'Geotab Integration',
    description: 'Connect with Geotab ELD',
    category: 'integrations',
  },
  quickbooks_integration: {
    id: 'quickbooks_integration',
    name: 'QuickBooks Integration',
    description: 'Sync invoices and expenses with QuickBooks',
    category: 'integrations',
  },
  factoring_integration: {
    id: 'factoring_integration',
    name: 'Factoring Integration',
    description: 'Connect with factoring companies',
    category: 'integrations',
  },
  load_board_integration: {
    id: 'load_board_integration',
    name: 'Load Board Integration',
    description: 'Import loads from DAT, Truckstop, etc.',
    category: 'integrations',
  },
  api_access: {
    id: 'api_access',
    name: 'API Access',
    description: 'RESTful API for custom integrations',
    category: 'integrations',
  },

  // Reporting Features
  reports_basic: {
    id: 'reports_basic',
    name: 'Basic Reports',
    description: 'Standard business reports',
    category: 'reporting',
  },
  reports_advanced: {
    id: 'reports_advanced',
    name: 'Advanced Reports',
    description: 'Detailed analytics and custom reports',
    category: 'reporting',
  },
  reports_export: {
    id: 'reports_export',
    name: 'Export Reports',
    description: 'Export reports to PDF, Excel, CSV',
    category: 'reporting',
  },
  reports_scheduled: {
    id: 'reports_scheduled',
    name: 'Scheduled Reports',
    description: 'Automatic report generation and delivery',
    category: 'reporting',
  },
  ifta_reporting: {
    id: 'ifta_reporting',
    name: 'IFTA Reporting',
    description: 'Generate IFTA fuel tax reports by jurisdiction',
    category: 'compliance',
  },
  fuel_tax_reports: {
    id: 'fuel_tax_reports',
    name: 'Fuel Tax Reports',
    description: 'Detailed fuel purchase and tax reports',
    category: 'compliance',
  },

  // Compliance Features
  bol_generation: {
    id: 'bol_generation',
    name: 'BOL Generation',
    description: 'Generate Bills of Lading',
    category: 'compliance',
  },
  document_management: {
    id: 'document_management',
    name: 'Document Management',
    description: 'Store and manage all transportation documents',
    category: 'compliance',
  },
  hos_compliance: {
    id: 'hos_compliance',
    name: 'HOS Compliance',
    description: 'Hours of Service compliance monitoring',
    category: 'compliance',
  },
  safety_compliance: {
    id: 'safety_compliance',
    name: 'Safety Compliance',
    description: 'FMCSA safety and compliance tracking',
    category: 'compliance',
  },

  // Advanced Features
  ai_load_extraction: {
    id: 'ai_load_extraction',
    name: 'AI Load Extraction',
    description: 'Extract load details from documents using AI',
    category: 'advanced',
  },
  route_optimization: {
    id: 'route_optimization',
    name: 'Route Optimization',
    description: 'AI-powered route planning and optimization',
    category: 'advanced',
  },
  predictive_analytics: {
    id: 'predictive_analytics',
    name: 'Predictive Analytics',
    description: 'Forecast demand, costs, and performance',
    category: 'advanced',
  },
  multi_location: {
    id: 'multi_location',
    name: 'Multi-Location',
    description: 'Manage multiple offices and terminals',
    category: 'advanced',
  },
  custom_branding: {
    id: 'custom_branding',
    name: 'Custom Branding',
    description: 'White-label with your company branding',
    category: 'advanced',
  },
  priority_support: {
    id: 'priority_support',
    name: 'Priority Support',
    description: '24/7 priority customer support',
    category: 'advanced',
  },
  unlimited_users: {
    id: 'unlimited_users',
    name: 'Unlimited Users',
    description: 'No limit on team members',
    category: 'advanced',
  },
  unlimited_loads: {
    id: 'unlimited_loads',
    name: 'Unlimited Loads',
    description: 'No limit on load entries',
    category: 'advanced',
  },
};

/**
 * Tier-based feature access configuration
 * Each tier includes all features from previous tiers plus additional ones
 */
export const TIER_FEATURES: Record<SubscriptionTier, Feature[]> = {
  // Trial - Limited access to try the platform (14 days)
  trial: [
    // Core (limited)
    'dashboard',
    'loads_view',
    'loads_create',
    'loads_edit',
    'customers_view',
    'customers_manage',
    // Dispatch (basic)
    'dispatch_board',
    'dispatch_assign',
    // Fleet (view only)
    'fleet_view',
    // Invoices (basic)
    'invoices_view',
    'invoices_create',
    // Reports (basic)
    'reports_basic',
    // BOL
    'bol_generation',
  ],

  // Starter - Small fleets (1-5 trucks) - $99/month
  // Includes IFTA Reporting and ELD Integrations as requested
  starter: [
    // All trial features
    'dashboard',
    'loads_view',
    'loads_create',
    'loads_edit',
    'customers_view',
    'customers_manage',
    'dispatch_board',
    'dispatch_assign',
    'fleet_view',
    'invoices_view',
    'invoices_create',
    'reports_basic',
    'bol_generation',
    
    // Additional Starter features
    'dispatch_tracking',
    'fleet_manage',
    'fleet_documents',
    'invoices_send',
    'expenses_view',
    'expenses_manage',
    'settlements_view',
    'document_management',
    'reports_export',
    
    // ELD Integrations - INCLUDED IN STARTER
    'eld_integrations',
    'eld_samsara',
    'eld_motive',
    'eld_geotab',
    
    // IFTA Reporting - INCLUDED IN STARTER
    'ifta_reporting',
    'fuel_tax_reports',
  ],

  // Professional - Growing fleets (5-25 trucks) - $249/month
  professional: [
    // All starter features
    'dashboard',
    'loads_view',
    'loads_create',
    'loads_edit',
    'customers_view',
    'customers_manage',
    'dispatch_board',
    'dispatch_assign',
    'dispatch_tracking',
    'fleet_view',
    'fleet_manage',
    'fleet_documents',
    'invoices_view',
    'invoices_create',
    'invoices_send',
    'expenses_view',
    'expenses_manage',
    'settlements_view',
    'document_management',
    'reports_basic',
    'reports_export',
    'bol_generation',
    'eld_integrations',
    'eld_samsara',
    'eld_motive',
    'eld_geotab',
    'ifta_reporting',
    'fuel_tax_reports',
    
    // Additional Professional features
    'live_tracking',
    'fleet_maintenance',
    'settlements_create',
    'quickbooks_integration',
    'factoring_integration',
    'load_board_integration',
    'reports_advanced',
    'hos_compliance',
    'safety_compliance',
    'ai_load_extraction',
  ],

  // Enterprise - Large fleets (25+ trucks) - Custom pricing
  enterprise: [
    // All features
    'dashboard',
    'loads_view',
    'loads_create',
    'loads_edit',
    'customers_view',
    'customers_manage',
    'dispatch_board',
    'dispatch_assign',
    'dispatch_tracking',
    'live_tracking',
    'fleet_view',
    'fleet_manage',
    'fleet_maintenance',
    'fleet_documents',
    'invoices_view',
    'invoices_create',
    'invoices_send',
    'expenses_view',
    'expenses_manage',
    'settlements_view',
    'settlements_create',
    'eld_integrations',
    'eld_samsara',
    'eld_motive',
    'eld_geotab',
    'quickbooks_integration',
    'factoring_integration',
    'load_board_integration',
    'api_access',
    'reports_basic',
    'reports_advanced',
    'reports_export',
    'reports_scheduled',
    'ifta_reporting',
    'fuel_tax_reports',
    'bol_generation',
    'document_management',
    'hos_compliance',
    'safety_compliance',
    'ai_load_extraction',
    'route_optimization',
    'predictive_analytics',
    'multi_location',
    'custom_branding',
    'priority_support',
    'unlimited_users',
    'unlimited_loads',
  ],
};

/**
 * Tier display information for UI
 */
export interface TierInfo {
  id: SubscriptionTier;
  name: string;
  description: string;
  price: string;
  priceNote?: string;
  maxUsers: number | 'unlimited';
  maxLoads: number | 'unlimited';
  maxTrucks: string;
  highlighted?: boolean;
}

export const TIER_INFO: Record<SubscriptionTier, TierInfo> = {
  trial: {
    id: 'trial',
    name: 'Free Trial',
    description: 'Try all features for 14 days',
    price: '$0',
    priceNote: '14-day trial',
    maxUsers: 2,
    maxLoads: 50,
    maxTrucks: '1-3',
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small fleets just getting started',
    price: '$99',
    priceNote: 'per month',
    maxUsers: 5,
    maxLoads: 200,
    maxTrucks: '1-5',
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'For growing fleets that need more power',
    price: '$249',
    priceNote: 'per month',
    maxUsers: 15,
    maxLoads: 1000,
    maxTrucks: '5-25',
    highlighted: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full-featured solution for large operations',
    price: 'Custom',
    priceNote: 'Contact sales',
    maxUsers: 'unlimited',
    maxLoads: 'unlimited',
    maxTrucks: '25+',
  },
};

/**
 * Check if a feature is available for a given tier
 */
export function hasFeature(tier: SubscriptionTier, feature: Feature): boolean {
  return TIER_FEATURES[tier]?.includes(feature) ?? false;
}

/**
 * Check if multiple features are all available for a tier
 */
export function hasAllFeatures(tier: SubscriptionTier, features: Feature[]): boolean {
  return features.every((feature) => hasFeature(tier, feature));
}

/**
 * Check if at least one of the features is available for a tier
 */
export function hasAnyFeature(tier: SubscriptionTier, features: Feature[]): boolean {
  return features.some((feature) => hasFeature(tier, feature));
}

/**
 * Get all features available for a tier
 */
export function getTierFeatures(tier: SubscriptionTier): Feature[] {
  return TIER_FEATURES[tier] ?? [];
}

/**
 * Get features that are NOT available for a tier (for upgrade prompts)
 */
export function getMissingFeatures(tier: SubscriptionTier): Feature[] {
  const allFeatures = Object.keys(FEATURE_CATALOG) as Feature[];
  const tierFeatures = getTierFeatures(tier);
  return allFeatures.filter((feature) => !tierFeatures.includes(feature));
}

/**
 * Get the minimum tier required for a feature
 */
export function getMinimumTierForFeature(feature: Feature): SubscriptionTier {
  const tierOrder: SubscriptionTier[] = ['trial', 'starter', 'professional', 'enterprise'];
  
  for (const tier of tierOrder) {
    if (hasFeature(tier, feature)) {
      return tier;
    }
  }
  
  return 'enterprise'; // Default to enterprise if not found
}

/**
 * Compare tiers - returns true if tier1 >= tier2
 */
export function isTierAtLeast(currentTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  const tierOrder: SubscriptionTier[] = ['trial', 'starter', 'professional', 'enterprise'];
  return tierOrder.indexOf(currentTier) >= tierOrder.indexOf(requiredTier);
}

/**
 * Get features by category
 */
export function getFeaturesByCategory(category: FeatureCategory): FeatureInfo[] {
  return Object.values(FEATURE_CATALOG).filter((f) => f.category === category);
}

/**
 * Get features available in a tier by category
 */
export function getTierFeaturesByCategory(tier: SubscriptionTier, category: FeatureCategory): FeatureInfo[] {
  const tierFeatures = getTierFeatures(tier);
  return getFeaturesByCategory(category).filter((f) => tierFeatures.includes(f.id));
}
