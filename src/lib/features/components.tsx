'use client';

import { ReactNode } from 'react';
import { Feature, SubscriptionTier, TIER_INFO, FEATURE_CATALOG } from './index';
import { useFeatureAccess } from './hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FeatureGateProps {
  /** The feature(s) required - if array, ALL must be available */
  feature: Feature | Feature[];
  /** Content to render if feature is available */
  children: ReactNode;
  /** Optional fallback to render if feature is not available */
  fallback?: ReactNode;
  /** If true, renders nothing when feature is not available (no upgrade prompt) */
  hideWhenLocked?: boolean;
}

/**
 * Component to conditionally render content based on feature access
 * 
 * @example
 * <FeatureGate feature="eld_integrations">
 *   <ELDSettings />
 * </FeatureGate>
 */
export function FeatureGate({ 
  feature, 
  children, 
  fallback,
  hideWhenLocked = false,
}: FeatureGateProps) {
  const { can, canAll, tier, getRequiredTier, getFeatureInfo } = useFeatureAccess();
  
  const features = Array.isArray(feature) ? feature : [feature];
  const hasAccess = features.length === 1 ? can(features[0]) : canAll(features);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  if (hideWhenLocked) {
    return null;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Default upgrade prompt
  const primaryFeature = features[0];
  const requiredTier = getRequiredTier(primaryFeature);
  const featureInfo = getFeatureInfo(primaryFeature);
  
  return (
    <UpgradePrompt 
      feature={primaryFeature}
      requiredTier={requiredTier}
      featureName={featureInfo.name}
      featureDescription={featureInfo.description}
    />
  );
}

interface UpgradePromptProps {
  feature: Feature;
  requiredTier: SubscriptionTier;
  featureName: string;
  featureDescription: string;
  compact?: boolean;
}

/**
 * Upgrade prompt component shown when a feature is locked
 */
export function UpgradePrompt({ 
  feature, 
  requiredTier, 
  featureName, 
  featureDescription,
  compact = false,
}: UpgradePromptProps) {
  const tierInfo = TIER_INFO[requiredTier];
  
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-sm">
        <Lock className="w-4 h-4 text-amber-600" />
        <span className="text-amber-800">
          <strong>{featureName}</strong> requires {tierInfo.name} plan
        </span>
        <Link href="/settings?tab=billing">
          <Button size="sm" variant="outline" className="ml-auto h-7 text-xs">
            Upgrade
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Lock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              {featureName}
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
                {tierInfo.name}
              </Badge>
            </CardTitle>
            <CardDescription>{featureDescription}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Upgrade to <strong>{tierInfo.name}</strong> ({tierInfo.price}/month) to unlock this feature.
          </p>
          <Link href="/settings?tab=billing">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2">
              <Sparkles className="w-4 h-4" />
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

interface FeatureBadgeProps {
  feature: Feature;
  showTier?: boolean;
}

/**
 * Badge showing if a feature is available or requires upgrade
 */
export function FeatureBadge({ feature, showTier = true }: FeatureBadgeProps) {
  const { can, getRequiredTier, getFeatureInfo } = useFeatureAccess();
  const isAvailable = can(feature);
  const requiredTier = getRequiredTier(feature);
  const featureInfo = getFeatureInfo(feature);
  
  if (isAvailable) {
    return (
      <Badge className="bg-green-100 text-green-700 gap-1">
        ✓ {featureInfo.name}
      </Badge>
    );
  }
  
  return (
    <Badge variant="secondary" className="bg-slate-100 text-slate-500 gap-1">
      <Lock className="w-3 h-3" />
      {featureInfo.name}
      {showTier && <span className="text-xs">({TIER_INFO[requiredTier].name})</span>}
    </Badge>
  );
}

interface FeatureListProps {
  features: Feature[];
  columns?: 1 | 2 | 3;
}

/**
 * Display a list of features with their availability status
 */
export function FeatureList({ features, columns = 2 }: FeatureListProps) {
  const { can, getFeatureInfo, getRequiredTier } = useFeatureAccess();
  
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  };
  
  return (
    <div className={`grid ${gridCols[columns]} gap-2`}>
      {features.map((feature) => {
        const isAvailable = can(feature);
        const info = getFeatureInfo(feature);
        const requiredTier = getRequiredTier(feature);
        
        return (
          <div 
            key={feature}
            className={`flex items-center gap-2 p-2 rounded-lg ${
              isAvailable ? 'bg-green-50' : 'bg-slate-50'
            }`}
          >
            {isAvailable ? (
              <span className="text-green-600">✓</span>
            ) : (
              <Lock className="w-3 h-3 text-slate-400" />
            )}
            <span className={`text-sm ${isAvailable ? 'text-slate-700' : 'text-slate-500'}`}>
              {info.name}
            </span>
            {!isAvailable && (
              <Badge variant="outline" className="ml-auto text-xs py-0">
                {TIER_INFO[requiredTier].name}
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
