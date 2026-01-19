"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DEFAULT_MAP_CONFIG, TRUCK_MARKERS, loadGoogleMapsScript } from './config';

export interface VehicleMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  status: 'driving' | 'idle' | 'stopped' | 'offline';
  driver?: string;
  lastUpdate?: Date;
  loadId?: string;
}

export interface RouteOverlay {
  id: string;
  path: Array<{ lat: number; lng: number }>;
  color?: string;
  strokeWeight?: number;
}

export interface LocationMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'pickup' | 'delivery' | 'waypoint';
  label?: string;
  address?: string;
}

interface FleetMapProps {
  apiKey?: string;
  vehicles?: VehicleMarker[];
  routes?: RouteOverlay[];
  locations?: LocationMarker[];
  selectedVehicle?: string | null;
  onVehicleClick?: (vehicleId: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
  showTraffic?: boolean;
  className?: string;
  height?: string;
}

export function FleetMap({
  apiKey,
  vehicles = [],
  routes = [],
  locations = [],
  selectedVehicle,
  onVehicleClick,
  onMapClick,
  showTraffic = true,
  className = '',
  height = '500px',
}: FleetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const polylinesRef = useRef<Map<string, google.maps.Polyline>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!apiKey) {
      // Use placeholder map if no API key
      setIsLoaded(true);
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (mapRef.current && !mapInstanceRef.current) {
          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center: DEFAULT_MAP_CONFIG.defaultCenter,
            zoom: DEFAULT_MAP_CONFIG.defaultZoom,
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_RIGHT,
            },
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          });

          infoWindowRef.current = new google.maps.InfoWindow();

          if (onMapClick) {
            mapInstanceRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
              if (e.latLng) {
                onMapClick(e.latLng.lat(), e.latLng.lng());
              }
            });
          }

          setIsLoaded(true);
        }
      })
      .catch((err) => {
        setError(err.message);
      });

    return () => {
      // Cleanup markers and polylines
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current.clear();
      polylinesRef.current.forEach((polyline) => polyline.setMap(null));
      polylinesRef.current.clear();
    };
  }, [apiKey, onMapClick]);

  // Update traffic layer
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !apiKey) return;

    if (showTraffic && !trafficLayerRef.current) {
      trafficLayerRef.current = new google.maps.TrafficLayer();
      trafficLayerRef.current.setMap(mapInstanceRef.current);
    } else if (!showTraffic && trafficLayerRef.current) {
      trafficLayerRef.current.setMap(null);
      trafficLayerRef.current = null;
    }
  }, [showTraffic, isLoaded, apiKey]);

  // Update vehicle markers
  const updateVehicleMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !isLoaded || !apiKey) return;

    const currentIds = new Set(vehicles.map((v) => v.id));

    // Remove old markers
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id) && !id.startsWith('loc-')) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    });

    // Add/update vehicle markers
    vehicles.forEach((vehicle) => {
      let marker = markersRef.current.get(vehicle.id);
      const iconConfig = TRUCK_MARKERS[vehicle.status] || TRUCK_MARKERS.offline;

      if (marker) {
        marker.setPosition({ lat: vehicle.lat, lng: vehicle.lng });
        marker.setIcon({
          ...iconConfig,
          rotation: vehicle.heading || 0,
          anchor: new google.maps.Point(12, 12),
        } as google.maps.Symbol);
      } else {
        marker = new google.maps.Marker({
          position: { lat: vehicle.lat, lng: vehicle.lng },
          map: mapInstanceRef.current,
          icon: {
            ...iconConfig,
            rotation: vehicle.heading || 0,
            anchor: new google.maps.Point(12, 12),
          } as google.maps.Symbol,
          title: vehicle.name,
          zIndex: vehicle.id === selectedVehicle ? 1000 : 100,
        });

        marker.addListener('click', () => {
          if (infoWindowRef.current && mapInstanceRef.current) {
            const content = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-weight: 600;">${vehicle.name}</h3>
                <p style="margin: 4px 0; color: #666;">
                  <strong>Status:</strong> ${vehicle.status.replace('_', ' ')}
                </p>
                ${vehicle.driver ? `<p style="margin: 4px 0; color: #666;"><strong>Driver:</strong> ${vehicle.driver}</p>` : ''}
                ${vehicle.speed !== undefined ? `<p style="margin: 4px 0; color: #666;"><strong>Speed:</strong> ${vehicle.speed} mph</p>` : ''}
                ${vehicle.loadId ? `<p style="margin: 4px 0; color: #666;"><strong>Load:</strong> ${vehicle.loadId}</p>` : ''}
                ${vehicle.lastUpdate ? `<p style="margin: 4px 0; color: #999; font-size: 12px;">Updated: ${new Date(vehicle.lastUpdate).toLocaleTimeString()}</p>` : ''}
              </div>
            `;
            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(mapInstanceRef.current, marker);
          }
          onVehicleClick?.(vehicle.id);
        });

        markersRef.current.set(vehicle.id, marker);
      }
    });
  }, [vehicles, selectedVehicle, onVehicleClick, isLoaded, apiKey]);

  // Update location markers
  const updateLocationMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !isLoaded || !apiKey) return;

    locations.forEach((location) => {
      const markerId = `loc-${location.id}`;
      let marker = markersRef.current.get(markerId);

      const iconUrl = location.type === 'pickup'
        ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        : location.type === 'delivery'
        ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
        : 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';

      if (marker) {
        marker.setPosition({ lat: location.lat, lng: location.lng });
      } else {
        marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: mapInstanceRef.current,
          icon: iconUrl,
          title: location.label || location.address,
          label: location.label ? {
            text: location.label,
            color: '#ffffff',
            fontWeight: 'bold',
          } : undefined,
        });

        if (location.address) {
          marker.addListener('click', () => {
            if (infoWindowRef.current && mapInstanceRef.current) {
              infoWindowRef.current.setContent(`
                <div style="padding: 8px;">
                  <strong>${location.type === 'pickup' ? 'Pickup' : 'Delivery'}</strong>
                  <p style="margin: 4px 0;">${location.address}</p>
                </div>
              `);
              infoWindowRef.current.open(mapInstanceRef.current, marker);
            }
          });
        }

        markersRef.current.set(markerId, marker);
      }
    });
  }, [locations, isLoaded, apiKey]);

  // Update route polylines
  const updateRoutes = useCallback(() => {
    if (!mapInstanceRef.current || !isLoaded || !apiKey) return;

    const currentIds = new Set(routes.map((r) => r.id));

    // Remove old polylines
    polylinesRef.current.forEach((polyline, id) => {
      if (!currentIds.has(id)) {
        polyline.setMap(null);
        polylinesRef.current.delete(id);
      }
    });

    // Add/update polylines
    routes.forEach((route) => {
      let polyline = polylinesRef.current.get(route.id);

      if (polyline) {
        polyline.setPath(route.path);
      } else {
        polyline = new google.maps.Polyline({
          path: route.path,
          map: mapInstanceRef.current,
          strokeColor: route.color || '#3b82f6',
          strokeWeight: route.strokeWeight || 4,
          strokeOpacity: 0.8,
        });
        polylinesRef.current.set(route.id, polyline);
      }
    });
  }, [routes, isLoaded, apiKey]);

  // Update markers and routes when data changes
  useEffect(() => {
    updateVehicleMarkers();
  }, [updateVehicleMarkers]);

  useEffect(() => {
    updateLocationMarkers();
  }, [updateLocationMarkers]);

  useEffect(() => {
    updateRoutes();
  }, [updateRoutes]);

  // Center on selected vehicle
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedVehicle || !isLoaded || !apiKey) return;

    const vehicle = vehicles.find((v) => v.id === selectedVehicle);
    if (vehicle) {
      mapInstanceRef.current.panTo({ lat: vehicle.lat, lng: vehicle.lng });
      mapInstanceRef.current.setZoom(14);
    }
  }, [selectedVehicle, vehicles, isLoaded, apiKey]);

  // Fit bounds to show all vehicles
  const fitBounds = useCallback(() => {
    if (!mapInstanceRef.current || vehicles.length === 0 || !apiKey) return;

    const bounds = new google.maps.LatLngBounds();
    vehicles.forEach((v) => bounds.extend({ lat: v.lat, lng: v.lng }));
    locations.forEach((l) => bounds.extend({ lat: l.lat, lng: l.lng }));
    mapInstanceRef.current.fitBounds(bounds, 50);
  }, [vehicles, locations, apiKey]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
        style={{ height }}
      >
        <p className="text-destructive">Error loading map: {error}</p>
      </div>
    );
  }

  // Show placeholder if no API key
  if (!apiKey) {
    return (
      <div 
        className={`relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg overflow-hidden ${className}`}
        style={{ height }}
      >
        {/* Placeholder map visualization */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Grid lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="currentColor" strokeWidth="0.5" />
                <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="currentColor" strokeWidth="0.5" />
              </React.Fragment>
            ))}
          </svg>
        </div>

        {/* Vehicle markers (mock positions) */}
        <div className="absolute inset-0">
          {vehicles.map((vehicle, idx) => {
            // Distribute vehicles across the placeholder map
            const x = 20 + (idx % 4) * 20;
            const y = 20 + Math.floor(idx / 4) * 25;
            const statusColor = vehicle.status === 'driving' ? 'bg-green-500' 
              : vehicle.status === 'idle' ? 'bg-yellow-500'
              : vehicle.status === 'stopped' ? 'bg-red-500'
              : 'bg-gray-500';
            
            return (
              <div
                key={vehicle.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 ${
                  selectedVehicle === vehicle.id ? 'z-10 scale-125' : ''
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => onVehicleClick?.(vehicle.id)}
              >
                <div className={`w-4 h-4 ${statusColor} rounded-full border-2 border-white shadow-lg`} />
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-medium bg-background/80 px-1 rounded">
                    {vehicle.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* API key notice */}
        <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-sm">
          <p className="font-medium">Google Maps API Key Required</p>
          <p className="text-muted-foreground text-xs mt-1">
            Add your Google Maps API key in Settings → Integrations to enable live fleet tracking.
          </p>
        </div>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
          <p className="text-xs font-medium mb-2">Vehicle Status</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Driving</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span>Idle</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Stopped</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-gray-500 rounded-full" />
              <span>Offline</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Fit bounds button */}
      {isLoaded && vehicles.length > 0 && (
        <button
          onClick={fitBounds}
          className="absolute bottom-4 left-4 bg-background shadow-lg rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          Show All Vehicles
        </button>
      )}

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}

export default FleetMap;
