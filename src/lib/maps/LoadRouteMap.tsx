"use client";

import React, { useEffect, useRef, useState } from 'react';
import { DEFAULT_MAP_CONFIG, loadGoogleMapsScript, GOOGLE_MAPS_API_KEY } from './config';
import { MapPin, Truck, Navigation, AlertCircle, Map } from 'lucide-react';

export interface LoadRouteMapProps {
  apiKey?: string;
  pickup: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  delivery: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  currentLocation?: {
    lat: number;
    lng: number;
    heading?: number;
  };
  routePath?: Array<{ lat: number; lng: number }>;
  showTraffic?: boolean;
  className?: string;
  height?: string;
}

export function LoadRouteMap({
  apiKey = GOOGLE_MAPS_API_KEY,
  pickup,
  delivery,
  currentLocation,
  routePath,
  showTraffic = true,
  className = '',
  height = '400px',
}: LoadRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  const truckMarkerRef = useRef<google.maps.Marker | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize map and render route
  useEffect(() => {
    if (!apiKey) {
      setIsLoaded(true);
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (mapRef.current && !mapInstanceRef.current) {
          // Calculate bounds to fit all points
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(new google.maps.LatLng(pickup.lat, pickup.lng));
          bounds.extend(new google.maps.LatLng(delivery.lat, delivery.lng));
          if (currentLocation) {
            bounds.extend(new google.maps.LatLng(currentLocation.lat, currentLocation.lng));
          }

          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center: bounds.getCenter(),
            zoom: 8,
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

          // Fit to bounds with padding
          mapInstanceRef.current.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });

          // Initialize directions renderer
          directionsRendererRef.current = new google.maps.DirectionsRenderer({
            map: mapInstanceRef.current,
            suppressMarkers: true, // We'll add custom markers
            polylineOptions: {
              strokeColor: '#3B82F6',
              strokeWeight: 4,
              strokeOpacity: 0.8,
            },
          });

          // Add pickup marker (blue)
          const pickupMarker = new google.maps.Marker({
            position: { lat: pickup.lat, lng: pickup.lng },
            map: mapInstanceRef.current,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#3B82F6',
              fillOpacity: 1,
              strokeColor: '#1E40AF',
              strokeWeight: 3,
            },
            title: `Pickup: ${pickup.city}, ${pickup.state}`,
            zIndex: 100,
          });

          // Add pickup label
          const pickupLabel = new google.maps.Marker({
            position: { lat: pickup.lat, lng: pickup.lng },
            map: mapInstanceRef.current,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 0,
            },
            label: {
              text: 'P',
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: '11px',
            },
            zIndex: 101,
          });

          markersRef.current.push(pickupMarker, pickupLabel);

          // Add delivery marker (green)
          const deliveryMarker = new google.maps.Marker({
            position: { lat: delivery.lat, lng: delivery.lng },
            map: mapInstanceRef.current,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#22C55E',
              fillOpacity: 1,
              strokeColor: '#15803D',
              strokeWeight: 3,
            },
            title: `Delivery: ${delivery.city}, ${delivery.state}`,
            zIndex: 100,
          });

          // Add delivery label
          const deliveryLabel = new google.maps.Marker({
            position: { lat: delivery.lat, lng: delivery.lng },
            map: mapInstanceRef.current,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 0,
            },
            label: {
              text: 'D',
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: '11px',
            },
            zIndex: 101,
          });

          markersRef.current.push(deliveryMarker, deliveryLabel);

          // Request directions
          const directionsService = new google.maps.DirectionsService();
          directionsService.route(
            {
              origin: { lat: pickup.lat, lng: pickup.lng },
              destination: { lat: delivery.lat, lng: delivery.lng },
              travelMode: google.maps.TravelMode.DRIVING,
              avoidFerries: true,
            },
            (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
              if (status === google.maps.DirectionsStatus.OK && directionsRendererRef.current && result) {
                directionsRendererRef.current.setDirections(result);
              }
            }
          );

          // Add traffic layer
          if (showTraffic) {
            trafficLayerRef.current = new google.maps.TrafficLayer();
            trafficLayerRef.current.setMap(mapInstanceRef.current);
          }

          setIsLoaded(true);
        }
      })
      .catch((err) => {
        setError(err.message);
        setIsLoaded(true);
      });

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      if (truckMarkerRef.current) {
        truckMarkerRef.current.setMap(null);
      }
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
    };
  }, [apiKey, pickup, delivery, showTraffic]);

  // Update truck marker for current location
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !apiKey || !currentLocation) return;

    if (truckMarkerRef.current) {
      truckMarkerRef.current.setPosition({ lat: currentLocation.lat, lng: currentLocation.lng });
    } else {
      // Create truck marker with SVG icon
      truckMarkerRef.current = new google.maps.Marker({
        position: { lat: currentLocation.lat, lng: currentLocation.lng },
        map: mapInstanceRef.current,
        icon: {
          path: 'M 0,-15 L 8,-5 L 8,10 L -8,10 L -8,-5 Z', // Truck shape pointing up
          fillColor: '#F97316',
          fillOpacity: 1,
          strokeColor: '#C2410C',
          strokeWeight: 2,
          scale: 1.5,
          rotation: currentLocation.heading || 0,
          anchor: new google.maps.Point(0, 0),
        },
        title: 'Current Location',
        zIndex: 200,
      });
    }
  }, [currentLocation, isLoaded, apiKey]);

  // Placeholder when no API key
  if (!apiKey) {
    return (
      <div 
        className={`relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden ${className}`}
        style={{ height }}
      >
        {/* Stylized placeholder map */}
        <div className="absolute inset-0">
          {/* Route line placeholder */}
          <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
            {/* Background grid */}
            <defs>
              <pattern id="route-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#route-grid)" />
            
            {/* Simulated route path */}
            <path 
              d="M 80 220 Q 120 180 160 160 T 240 120 T 320 80" 
              fill="none" 
              stroke="#3B82F6" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeDasharray="0"
              opacity="0.6"
            />
            
            {/* Pickup marker */}
            <circle cx="80" cy="220" r="12" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
            <text x="80" y="224" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">P</text>
            
            {/* Truck position */}
            {currentLocation && (
              <g transform="translate(200, 100)">
                <circle r="10" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
                <path d="M 0,-5 L 3,-2 L 3,4 L -3,4 L -3,-2 Z" fill="white" />
              </g>
            )}
            
            {/* Delivery marker */}
            <circle cx="320" cy="80" r="12" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            <text x="320" y="84" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">D</text>
          </svg>
        </div>

        {/* Location labels */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">P</span>
            </div>
            <div className="text-xs">
              <p className="font-medium text-slate-900">{pickup.city}, {pickup.state}</p>
              <p className="text-slate-500 truncate max-w-[150px]">{pickup.address}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">D</span>
            </div>
            <div className="text-xs">
              <p className="font-medium text-slate-900">{delivery.city}, {delivery.state}</p>
              <p className="text-slate-500 truncate max-w-[150px]">{delivery.address}</p>
            </div>
          </div>
        </div>

        {/* API key notice */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Add Google Maps API key in <span className="font-medium">Settings → Integrations</span> for full map features
            </p>
          </div>
        </div>

        {/* Map icon watermark */}
        <div className="absolute bottom-4 right-4 opacity-10">
          <Map className="h-24 w-24 text-slate-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`relative bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center p-6">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <p className="text-sm text-slate-600">Failed to load map</p>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg overflow-hidden"
      />
      
      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-slate-600">Pickup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-600">Delivery</span>
          </div>
          {currentLocation && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-slate-600">Truck</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
