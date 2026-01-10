"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Navigation,
  Truck,
  Clock,
  Phone,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Fuel,
  Thermometer,
  Gauge,
  Signal,
  Battery,
  Zap,
  MoreVertical,
  ChevronRight,
  Circle,
  Target,
  Route,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Sample live tracking data
const activeVehicles = [
  {
    id: "TRK-001",
    driver: { name: "John Davidson", phone: "(555) 123-4567", avatar: "JD" },
    loadId: "LD-2026-008",
    status: "moving",
    speed: 62,
    heading: "NE",
    location: "I-70 near Hays, KS",
    coordinates: { lat: 38.8794, lng: -99.3268 },
    origin: "Denver, CO",
    destination: "Kansas City, MO",
    progress: 65,
    eta: "2h 15m",
    lastUpdate: "1 min ago",
    fuel: 68,
    temp: 34,
    engineStatus: "normal",
    signalStrength: 4,
    battery: 92,
  },
  {
    id: "TRK-002",
    driver: { name: "Sarah Mitchell", phone: "(555) 234-5678", avatar: "SM" },
    loadId: "LD-2026-009",
    status: "moving",
    speed: 58,
    heading: "N",
    location: "I-80 near Davis, CA",
    coordinates: { lat: 38.5449, lng: -121.7405 },
    origin: "San Francisco, CA",
    destination: "Sacramento, CA",
    progress: 82,
    eta: "35 min",
    lastUpdate: "2 min ago",
    fuel: 45,
    temp: null,
    engineStatus: "normal",
    signalStrength: 5,
    battery: 88,
  },
  {
    id: "TRK-003",
    driver: { name: "Mike Rodriguez", phone: "(555) 345-6789", avatar: "MR" },
    loadId: "LD-2026-010",
    status: "stopped",
    speed: 0,
    heading: "S",
    location: "Rest Area - I-95, FL",
    coordinates: { lat: 29.2108, lng: -81.0228 },
    origin: "Miami, FL",
    destination: "Jacksonville, FL",
    progress: 45,
    eta: "3h 30m",
    lastUpdate: "15 min ago",
    fuel: 52,
    temp: 36,
    engineStatus: "idle",
    signalStrength: 3,
    battery: 95,
  },
  {
    id: "TRK-004",
    driver: { name: "Emily Chen", phone: "(555) 456-7890", avatar: "EC" },
    loadId: "LD-2026-011",
    status: "at-pickup",
    speed: 0,
    heading: "W",
    location: "ABC Warehouse, Salt Lake City, UT",
    coordinates: { lat: 40.7608, lng: -111.8910 },
    origin: "Salt Lake City, UT",
    destination: "Boise, ID",
    progress: 0,
    eta: "6h 00m",
    lastUpdate: "8 min ago",
    fuel: 85,
    temp: null,
    engineStatus: "idle",
    signalStrength: 5,
    battery: 100,
  },
  {
    id: "TRK-005",
    driver: { name: "Robert Wilson", phone: "(555) 567-8901", avatar: "RW" },
    loadId: "LD-2026-012",
    status: "delayed",
    speed: 12,
    heading: "E",
    location: "I-40 near Amarillo, TX (Traffic)",
    coordinates: { lat: 35.2220, lng: -101.8313 },
    origin: "Albuquerque, NM",
    destination: "Oklahoma City, OK",
    progress: 35,
    eta: "5h 45m",
    lastUpdate: "3 min ago",
    fuel: 38,
    temp: 35,
    engineStatus: "normal",
    signalStrength: 4,
    battery: 76,
    alert: "Heavy traffic - 45 min delay",
  },
];

// Status badge component
function VehicleStatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    moving: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
    stopped: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
    "at-pickup": { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
    "at-delivery": { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
    delayed: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
    offline: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500" },
  };

  const style = styles[status] || styles.offline;
  const labels: Record<string, string> = {
    moving: "Moving",
    stopped: "Stopped",
    "at-pickup": "At Pickup",
    "at-delivery": "At Delivery",
    delayed: "Delayed",
    offline: "Offline",
  };

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium border-0", style.bg, style.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", style.dot, status === "moving" && "animate-pulse")} />
      {labels[status] || status}
    </Badge>
  );
}

// Vehicle card component
function VehicleCard({ vehicle, isSelected, onClick }: { 
  vehicle: typeof activeVehicles[0]; 
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-brand-600 shadow-md",
        vehicle.status === "delayed" && "border-l-4 border-l-red-500"
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              vehicle.status === "moving" ? "bg-green-100" : 
              vehicle.status === "delayed" ? "bg-red-100" : "bg-slate-100"
            )}>
              <Truck className={cn(
                "w-4 h-4",
                vehicle.status === "moving" ? "text-green-600" :
                vehicle.status === "delayed" ? "text-red-600" : "text-slate-600"
              )} />
            </div>
            <div>
              <p className="font-semibold text-sm">{vehicle.id}</p>
              <p className="text-[10px] text-muted-foreground">{vehicle.loadId}</p>
            </div>
          </div>
          <VehicleStatusBadge status={vehicle.status} />
        </div>

        {/* Driver */}
        <div className="flex items-center gap-2 mb-2 p-1.5 bg-slate-50 rounded">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-[10px] bg-brand-100 text-brand-700">
              {vehicle.driver.avatar}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium flex-1">{vehicle.driver.name}</span>
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Phone className="w-3 h-3" />
          </Button>
        </div>

        {/* Alert */}
        {vehicle.alert && (
          <div className="flex items-center gap-2 mb-2 p-1.5 bg-red-50 rounded text-[10px] text-red-700">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span>{vehicle.alert}</span>
          </div>
        )}

        {/* Location */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5 text-xs">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="truncate">{vehicle.location}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 ml-4">
            Updated {vehicle.lastUpdate}
          </p>
        </div>

        {/* Route Progress */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-muted-foreground">{vehicle.origin}</span>
            <span className="font-medium text-brand-600">ETA: {vehicle.eta}</span>
          </div>
          <Progress value={vehicle.progress} className="h-1.5" />
          <div className="flex justify-end mt-0.5">
            <span className="text-[10px] text-muted-foreground">{vehicle.destination}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-1 pt-2 border-t">
          <div className="text-center">
            <Gauge className="w-3 h-3 mx-auto text-muted-foreground" />
            <p className="text-[10px] font-medium mt-0.5">{vehicle.speed} mph</p>
          </div>
          <div className="text-center">
            <Fuel className={cn(
              "w-3 h-3 mx-auto",
              vehicle.fuel < 25 ? "text-red-500" : vehicle.fuel < 50 ? "text-amber-500" : "text-green-500"
            )} />
            <p className="text-[10px] font-medium mt-0.5">{vehicle.fuel}%</p>
          </div>
          {vehicle.temp !== null && (
            <div className="text-center">
              <Thermometer className="w-3 h-3 mx-auto text-blue-500" />
              <p className="text-[10px] font-medium mt-0.5">{vehicle.temp}°F</p>
            </div>
          )}
          <div className="text-center">
            <Signal className={cn(
              "w-3 h-3 mx-auto",
              vehicle.signalStrength >= 4 ? "text-green-500" : 
              vehicle.signalStrength >= 2 ? "text-amber-500" : "text-red-500"
            )} />
            <p className="text-[10px] font-medium mt-0.5">{vehicle.signalStrength}/5</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TrackingPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(activeVehicles[0]?.id || null);

  // Filter vehicles
  const filteredVehicles = activeVehicles.filter((v) => {
    const matchesSearch =
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.loadId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedVehicleData = activeVehicles.find(v => v.id === selectedVehicle);

  // Stats
  const movingCount = activeVehicles.filter(v => v.status === "moving").length;
  const stoppedCount = activeVehicles.filter(v => v.status === "stopped" || v.status === "at-pickup" || v.status === "at-delivery").length;
  const delayedCount = activeVehicles.filter(v => v.status === "delayed").length;

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-6 h-6 text-brand-600" />
                Live Tracking
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Real-time fleet monitoring and GPS tracking
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => toast({ title: "Refreshed", description: "Vehicle locations updated" })}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="w-4 h-4 mr-2" />
                Full Screen
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <Card className="p-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded">
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">{activeVehicles.length}</p>
                  <p className="text-[10px] text-muted-foreground">Active Vehicles</p>
                </div>
              </div>
            </Card>
            <Card className="p-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded">
                  <Navigation className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">{movingCount}</p>
                  <p className="text-[10px] text-muted-foreground">Moving</p>
                </div>
              </div>
            </Card>
            <Card className="p-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 rounded">
                  <Circle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-600">{stoppedCount}</p>
                  <p className="text-[10px] text-muted-foreground">Stopped</p>
                </div>
              </div>
            </Card>
            <Card className="p-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-100 rounded">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">{delayedCount}</p>
                  <p className="text-[10px] text-muted-foreground">Delayed</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Vehicle List */}
          <div className="w-80 border-r flex flex-col bg-slate-50">
            {/* Search & Filter */}
            <div className="p-3 border-b bg-white space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  <SelectItem value="moving">Moving</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                  <SelectItem value="at-pickup">At Pickup</SelectItem>
                  <SelectItem value="at-delivery">At Delivery</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Cards */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-2">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    isSelected={selectedVehicle === vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                  />
                ))}
                {filteredVehicles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Truck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No vehicles found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative bg-slate-200">
            {/* Map Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 mx-auto">
                  <MapPin className="w-12 h-12 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">Map Integration</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                  Connect your Google Maps, Mapbox, or HERE Maps API to enable live GPS tracking visualization.
                </p>
                <Button className="mt-4 bg-brand-600 hover:bg-brand-700">
                  Configure Map Provider
                </Button>
              </div>
            </div>

            {/* Selected Vehicle Info Overlay */}
            {selectedVehicleData && (
              <Card className="absolute bottom-4 left-4 right-4 max-w-lg shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      selectedVehicleData.status === "moving" ? "bg-green-100" : 
                      selectedVehicleData.status === "delayed" ? "bg-red-100" : "bg-slate-100"
                    )}>
                      <Truck className={cn(
                        "w-6 h-6",
                        selectedVehicleData.status === "moving" ? "text-green-600" :
                        selectedVehicleData.status === "delayed" ? "text-red-600" : "text-slate-600"
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3 className="font-semibold">{selectedVehicleData.id} - {selectedVehicleData.driver.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedVehicleData.location}</p>
                        </div>
                        <VehicleStatusBadge status={selectedVehicleData.status} />
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Gauge className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedVehicleData.speed} mph</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span>ETA: {selectedVehicleData.eta}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Fuel className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedVehicleData.fuel}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
