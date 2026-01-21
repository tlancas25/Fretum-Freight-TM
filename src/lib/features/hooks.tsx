'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { 
  Feature, 
  SubscriptionTier, 
  hasFeature, 
  hasAllFeatures, 
  hasAnyFeature,
  getMissingFeatures,
  getMinimumTierForFeature,
  getTierFeatures,
  TIER_INFO,
  FEATURE_CATALOG,
  TierInfo,
  FeatureInfo,
} from './index';

/**
 * Feature access context type
 */
interface FeatureAccessContextType {
  // Current tenant's subscription tier
  tier: SubscriptionTier;
  // Tier display info
  tierInfo: TierInfo;
  // Check if a feature is available
  can: (feature: Feature) => boolean;
  // Check if all features are available
  canAll: (features: Feature[]) => boolean;
  // Check if any feature is available
  canAny: (features: Feature[]) => boolean;
  // Get list of features not available in current tier
  missingFeatures: Feature[];
  // Get available features for current tier
  availableFeatures: Feature[];
  // Get minimum tier required for a feature
  getRequiredTier: (feature: Feature) => SubscriptionTier;
  // Get feature display info
  getFeatureInfo: (feature: Feature) => FeatureInfo;
  // For demo/testing: change current tier
  setTier: (tier: SubscriptionTier) => void;
  // Loading state
  isLoading: boolean;
}

const FeatureAccessContext = createContext<FeatureAccessContextType | undefined>(undefined);

interface FeatureAccessProviderProps {
  children: ReactNode;
  // Initial tier from tenant data (can be fetched from Firestore)
  initialTier?: SubscriptionTier;
}

/**
 * Provider component for feature access
 * Wrap your app with this to enable feature checking throughout
 */
export function FeatureAccessProvider({ 
  children, 
  initialTier = 'trial' 
}: FeatureAccessProviderProps) {
  const [tier, setTierState] = useState<SubscriptionTier>(initialTier);
  const [isLoading, setIsLoading] = useState(true);

  // Load tier from localStorage for demo purposes
  // In production, this would come from Firestore tenant data
  useEffect(() => {
    const savedTier = localStorage.getItem('focusfreight_subscription_tier');
    if (savedTier && ['trial', 'starter', 'professional', 'enterprise'].includes(savedTier)) {
      setTierState(savedTier as SubscriptionTier);
    }
    setIsLoading(false);
  }, []);

  // Save tier changes to localStorage (for demo)
  const setTier = (newTier: SubscriptionTier) => {
    setTierState(newTier);
    localStorage.setItem('focusfreight_subscription_tier', newTier);
  };

  const value: FeatureAccessContextType = {
    tier,
    tierInfo: TIER_INFO[tier],
    can: (feature: Feature) => hasFeature(tier, feature),
    canAll: (features: Feature[]) => hasAllFeatures(tier, features),
    canAny: (features: Feature[]) => hasAnyFeature(tier, features),
    missingFeatures: getMissingFeatures(tier),
    availableFeatures: getTierFeatures(tier),
    getRequiredTier: (feature: Feature) => getMinimumTierForFeature(feature),
    getFeatureInfo: (feature: Feature) => FEATURE_CATALOG[feature],
    setTier,
    isLoading,
  };

  return (
    <FeatureAccessContext.Provider value={value}>
      {children}
    </FeatureAccessContext.Provider>
  );
}

/**
 * Hook to access feature access context
 */
export function useFeatureAccess(): FeatureAccessContextType {
  const context = useContext(FeatureAccessContext);
  
  if (context === undefined) {
    throw new Error('useFeatureAccess must be used within a FeatureAccessProvider');
  }
  
  return context;
}

/**
 * Hook to check a single feature
 * Returns { allowed, tier, featureInfo }
 */
export function useFeature(feature: Feature) {
  const { tier, can, getRequiredTier, getFeatureInfo } = useFeatureAccess();
  
  return {
    allowed: can(feature),
    currentTier: tier,
    requiredTier: getRequiredTier(feature),
    featureInfo: getFeatureInfo(feature),
  };
}

/**
 * Hook to check multiple features
 */
export function useFeatures(features: Feature[]) {
  const { can, canAll, canAny } = useFeatureAccess();
  
  return {
    all: canAll(features),
    any: canAny(features),
    individual: features.map((f) => ({ feature: f, allowed: can(f) })),
  };
}
