"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Truck,
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Star,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Fuel,
  Gauge,
  Wrench,
  FileText,
  Shield,
  Activity,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Navigation,
  Timer,
  Award,
  Zap,
  Package,
  DollarSign,
  ThermometerSun,
  Box,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Driver data
const drivers = [
  {
    id: "DRV-001",
    name: "John Davidson",
    avatar: "JD",
    phone: "(555) 123-4567",
    email: "john.d@fretumfreight.com",
    status: "driving",
    currentLoad: "LD-2026-001",
    location: "I-10 near Phoenix, AZ",
    hosRemaining: 6.5,
    totalLoads: 245,
    onTimeRate: 98,
    rating: 4.9,
    licenseExpiry: "2027-03-15",
    medicalExpiry: "2026-08-20",
    hireDate: "2022-05-10",
    truckAssigned: "TRK-001",
    weeklyMiles: 2340,
    monthlyRevenue: 28500,
  },
  {
    id: "DRV-002",
    name: "Sarah Mitchell",
    avatar: "SM",
    phone: "(555) 234-5678",
    email: "sarah.m@fretumfreight.com",
    status: "available",
    currentLoad: null,
    location: "Los Angeles, CA (Yard)",
    hosRemaining: 11,
    totalLoads: 198,
    onTimeRate: 96,
    rating: 4.8,
    licenseExpiry: "2026-11-20",
    medicalExpiry: "2026-06-15",
    hireDate: "2023-01-15",
    truckAssigned: "TRK-002",
    weeklyMiles: 1850,
    monthlyRevenue: 24200,
  },
  {
    id: "DRV-003",
    name: "Mike Rodriguez",
    avatar: "MR",
    phone: "(555) 345-6789",
    email: "mike.r@fretumfreight.com",
    status: "off-duty",
    currentLoad: null,
    location: "Houston, TX",
    hosRemaining: 14,
    totalLoads: 312,
    onTimeRate: 97,
    rating: 4.7,
    licenseExpiry: "2027-01-10",
    medicalExpiry: "2026-04-30",
    hireDate: "2021-08-22",
    truckAssigned: "TRK-003",
    weeklyMiles: 2100,
    monthlyRevenue: 26800,
  },
  {
    id: "DRV-004",
    name: "Emily Chen",
    avatar: "EC",
    phone: "(555) 456-7890",
    email: "emily.c@fretumfreight.com",
    status: "driving",
    currentLoad: "LD-2026-005",
    location: "I-95 near Miami, FL",
    hosRemaining: 4.2,
    totalLoads: 156,
    onTimeRate: 99,
    rating: 4.9,
    licenseExpiry: "2026-09-05",
    medicalExpiry: "2026-12-10",
    hireDate: "2023-06-01",
    truckAssigned: "TRK-004",
    weeklyMiles: 2450,
    monthlyRevenue: 29100,
  },
  {
    id: "DRV-005",
    name: "Robert Wilson",
    avatar: "RW",
    phone: "(555) 567-8901",
    email: "robert.w@fretumfreight.com",
    status: "sleeper",
    currentLoad: "LD-2026-008",
    location: "Rest Area, I-40 NM",
    hosRemaining: 0,
    totalLoads: 278,
    onTimeRate: 94,
    rating: 4.6,
    licenseExpiry: "2027-05-20",
    medicalExpiry: "2026-07-25",
    hireDate: "2022-02-14",
    truckAssigned: "TRK-005",
    weeklyMiles: 1920,
    monthlyRevenue: 23400,
  },
];

// Vehicle/Truck data
const trucks = [
  {
    id: "TRK-001",
    make: "Volvo",
    model: "VNL 860",
    year: 2023,
    vin: "4V4NC9EH5PN123456",
    status: "in-service",
    driver: "John Davidson",
    currentMiles: 145320,
    fuelLevel: 78,
    nextService: "2026-02-15",
    lastService: "2025-11-20",
    registrationExpiry: "2026-12-31",
    inspectionExpiry: "2026-06-30",
    insuranceExpiry: "2026-12-31",
    mpg: 7.2,
    location: "I-10 near Phoenix, AZ",
    trailerAttached: "TRL-001",
  },
  {
    id: "TRK-002",
    make: "Freightliner",
    model: "Cascadia",
    year: 2022,
    vin: "1FUJGLD5XLSN78901",
    status: "in-service",
    driver: "Sarah Mitchell",
    currentMiles: 189450,
    fuelLevel: 45,
    nextService: "2026-01-25",
    lastService: "2025-10-15",
    registrationExpiry: "2026-08-15",
    inspectionExpiry: "2026-04-20",
    insuranceExpiry: "2026-08-15",
    mpg: 6.8,
    location: "Los Angeles, CA (Yard)",
    trailerAttached: null,
  },
  {
    id: "TRK-003",
    make: "Peterbilt",
    model: "579",
    year: 2023,
    vin: "1XPWD40X3PD234567",
    status: "maintenance",
    driver: "Mike Rodriguez",
    currentMiles: 98760,
    fuelLevel: 92,
    nextService: "In Progress",
    lastService: "2025-12-01",
    registrationExpiry: "2027-03-10",
    inspectionExpiry: "2026-09-15",
    insuranceExpiry: "2027-03-10",
    mpg: 7.0,
    location: "Service Center, Houston TX",
    trailerAttached: null,
  },
  {
    id: "TRK-004",
    make: "Kenworth",
    model: "T680",
    year: 2024,
    vin: "1XKYD49X5PJ345678",
    status: "in-service",
    driver: "Emily Chen",
    currentMiles: 42150,
    fuelLevel: 62,
    nextService: "2026-04-01",
    lastService: "2026-01-05",
    registrationExpiry: "2027-06-20",
    inspectionExpiry: "2026-12-01",
    insuranceExpiry: "2027-06-20",
    mpg: 7.5,
    location: "I-95 near Miami, FL",
    trailerAttached: "TRL-004",
  },
  {
    id: "TRK-005",
    make: "Mack",
    model: "Anthem",
    year: 2022,
    vin: "1M1AN07Y5PM456789",
    status: "in-service",
    driver: "Robert Wilson",
    currentMiles: 167890,
    fuelLevel: 35,
    nextService: "2026-02-28",
    lastService: "2025-11-10",
    registrationExpiry: "2026-10-05",
    inspectionExpiry: "2026-05-15",
    insuranceExpiry: "2026-10-05",
    mpg: 6.5,
    location: "Rest Area, I-40 NM",
    trailerAttached: "TRL-005",
  },
];

// Trailer data
const trailers = [
  { id: "TRL-001", type: "Dry Van", length: "53ft", year: 2022, status: "in-use", attachedTo: "TRK-001" },
  { id: "TRL-002", type: "Reefer", length: "53ft", year: 2023, status: "available", attachedTo: null },
  { id: "TRL-003", type: "Flatbed", length: "48ft", year: 2021, status: "maintenance", attachedTo: null },
  { id: "TRL-004", type: "Dry Van", length: "53ft", year: 2023, status: "in-use", attachedTo: "TRK-004" },
  { id: "TRL-005", type: "Reefer", length: "53ft", year: 2022, status: "in-use", attachedTo: "TRK-005" },
];

// Status badge components
function DriverStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    driving: "bg-green-100 text-green-700",
    available: "bg-blue-100 text-blue-700",
    "off-duty": "bg-slate-100 text-slate-700",
    sleeper: "bg-purple-100 text-purple-700",
  };
  const labels: Record<string, string> = {
    driving: "Driving",
    available: "Available",
    "off-duty": "Off Duty",
    sleeper: "Sleeper",
  };
  return <Badge className={cn(styles[status], "hover:opacity-90")}>{labels[status]}</Badge>;
}

function TruckStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "in-service": "bg-green-100 text-green-700",
    maintenance: "bg-amber-100 text-amber-700",
    "out-of-service": "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    "in-service": "In Service",
    maintenance: "Maintenance",
    "out-of-service": "Out of Service",
  };
  return <Badge className={cn(styles[status], "hover:opacity-90")}>{labels[status]}</Badge>;
}

// Driver Card Component
function DriverCard({ driver }: { driver: typeof drivers[0] }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-brand-100 text-brand-700 font-medium">
              {driver.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">{driver.name}</h3>
                <p className="text-xs text-muted-foreground font-mono">{driver.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <DriverStatusBadge status={driver.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Driver
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Driver
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <FileText className="w-4 h-4 mr-2" />
                      View Documents
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Location & Load */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{driver.location}</span>
              </div>
              {driver.currentLoad && (
                <div className="flex items-center gap-2 text-xs">
                  <Package className="w-3 h-3 text-brand-600" />
                  <span className="font-mono text-brand-600">{driver.currentLoad}</span>
                </div>
              )}
            </div>

            {/* HOS Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">HOS Remaining</span>
                <span className={cn(
                  "font-medium",
                  driver.hosRemaining < 2 ? "text-red-600" : driver.hosRemaining < 4 ? "text-amber-600" : "text-green-600"
                )}>
                  {driver.hosRemaining}h
                </span>
              </div>
              <Progress 
                value={(driver.hosRemaining / 14) * 100} 
                className="h-1.5"
              />
            </div>

            {/* Stats */}
            <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t">
              <div className="text-center">
                <p className="text-sm font-bold text-brand-600">{driver.totalLoads}</p>
                <p className="text-[10px] text-muted-foreground">Loads</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-green-600">{driver.onTimeRate}%</p>
                <p className="text-[10px] text-muted-foreground">On-Time</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <p className="text-sm font-bold">{driver.rating}</p>
                </div>
                <p className="text-[10px] text-muted-foreground">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Truck Card Component
function TruckCard({ truck }: { truck: typeof trucks[0] }) {
  const fuelColor = truck.fuelLevel > 50 ? "text-green-600" : truck.fuelLevel > 25 ? "text-amber-600" : "text-red-600";
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Truck className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{truck.make} {truck.model}</h3>
              <p className="text-xs text-muted-foreground font-mono">{truck.id} • {truck.year}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TruckStatusBadge status={truck.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Wrench className="w-4 h-4 mr-2" />
                  Schedule Service
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MapPin className="w-4 h-4 mr-2" />
                  Track Location
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  View Documents
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Location & Driver */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{truck.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Users className="w-3 h-3" />
            <span>{truck.driver}</span>
          </div>
        </div>

        {/* Fuel & Mileage */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="p-2 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-1.5 mb-1">
              <Fuel className={cn("w-3 h-3", fuelColor)} />
              <span className="text-xs text-muted-foreground">Fuel</span>
            </div>
            <p className={cn("text-sm font-bold", fuelColor)}>{truck.fuelLevel}%</p>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-1.5 mb-1">
              <Gauge className="w-3 h-3 text-slate-500" />
              <span className="text-xs text-muted-foreground">Mileage</span>
            </div>
            <p className="text-sm font-bold">{truck.currentMiles.toLocaleString()}</p>
          </div>
        </div>

        {/* Service & Trailer */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              Next Service
            </span>
            <span className="font-medium">{truck.nextService}</span>
          </div>
          {truck.trailerAttached && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Box className="w-3 h-3" />
                Trailer
              </span>
              <span className="font-mono text-brand-600">{truck.trailerAttached}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Avg MPG
            </span>
            <span className="font-medium">{truck.mpg}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FleetPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [driverFilter, setDriverFilter] = useState("all");
  const [truckFilter, setTruckFilter] = useState("all");
  const [addDriverOpen, setAddDriverOpen] = useState(false);
  const [addTruckOpen, setAddTruckOpen] = useState(false);

  // Filter drivers
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = driverFilter === "all" || driver.status === driverFilter;
    return matchesSearch && matchesFilter;
  });

  // Filter trucks
  const filteredTrucks = trucks.filter((truck) => {
    const matchesSearch = truck.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = truckFilter === "all" || truck.status === truckFilter;
    return matchesSearch && matchesFilter;
  });

  // Stats
  const activeDrivers = drivers.filter(d => d.status === "driving" || d.status === "available").length;
  const activeTrucks = trucks.filter(t => t.status === "in-service").length;
  const totalMilesThisWeek = drivers.reduce((sum, d) => sum + d.weeklyMiles, 0);
  const avgFuelLevel = Math.round(trucks.reduce((sum, t) => sum + t.fuelLevel, 0) / trucks.length);

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-brand-600" />
                Fleet Management
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your drivers, trucks, and trailers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync ELD
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{activeDrivers}/{drivers.length}</p>
                  <p className="text-xs text-muted-foreground">Active Drivers</p>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{activeTrucks}/{trucks.length}</p>
                  <p className="text-xs text-muted-foreground">Trucks In Service</p>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Navigation className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{totalMilesThisWeek.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Miles This Week</p>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Fuel className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">{avgFuelLevel}%</p>
                  <p className="text-xs text-muted-foreground">Avg Fuel Level</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="drivers" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="drivers" className="gap-2">
                  <Users className="w-4 h-4" />
                  Drivers ({drivers.length})
                </TabsTrigger>
                <TabsTrigger value="trucks" className="gap-2">
                  <Truck className="w-4 h-4" />
                  Trucks ({trucks.length})
                </TabsTrigger>
                <TabsTrigger value="trailers" className="gap-2">
                  <Box className="w-4 h-4" />
                  Trailers ({trailers.length})
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-[200px]"
                  />
                </div>
              </div>
            </div>

            {/* Drivers Tab */}
            <TabsContent value="drivers" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <Select value={driverFilter} onValueChange={setDriverFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Drivers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Drivers</SelectItem>
                    <SelectItem value="driving">Driving</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="off-duty">Off Duty</SelectItem>
                    <SelectItem value="sleeper">Sleeper</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setAddDriverOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Driver
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDrivers.map((driver) => (
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </div>
            </TabsContent>

            {/* Trucks Tab */}
            <TabsContent value="trucks" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <Select value={truckFilter} onValueChange={setTruckFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Trucks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trucks</SelectItem>
                    <SelectItem value="in-service">In Service</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="out-of-service">Out of Service</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setAddTruckOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Truck
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTrucks.map((truck) => (
                  <TruckCard key={truck.id} truck={truck} />
                ))}
              </div>
            </TabsContent>

            {/* Trailers Tab */}
            <TabsContent value="trailers" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Trailers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trailers</SelectItem>
                    <SelectItem value="in-use">In Use</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trailer
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {trailers.map((trailer) => (
                  <Card key={trailer.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <Box className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{trailer.type}</h3>
                            <p className="text-xs text-muted-foreground font-mono">{trailer.id}</p>
                          </div>
                        </div>
                        <Badge className={cn(
                          trailer.status === "in-use" ? "bg-green-100 text-green-700" :
                          trailer.status === "available" ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          {trailer.status === "in-use" ? "In Use" : 
                           trailer.status === "available" ? "Available" : "Maintenance"}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Length</span>
                          <span className="font-medium">{trailer.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Year</span>
                          <span className="font-medium">{trailer.year}</span>
                        </div>
                        {trailer.attachedTo && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Attached To</span>
                            <span className="font-mono text-brand-600">{trailer.attachedTo}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Driver Dialog */}
      <Dialog open={addDriverOpen} onOpenChange={setAddDriverOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>Enter the driver's information below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="driver@email.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">License Expiry</Label>
                <Input id="licenseExpiry" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalExpiry">Medical Card Expiry</Label>
                <Input id="medicalExpiry" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignTruck">Assign Truck</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a truck" />
                </SelectTrigger>
                <SelectContent>
                  {trucks.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.id} - {t.make} {t.model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDriverOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => {
              setAddDriverOpen(false);
              toast({ title: "Driver Added", description: "New driver has been added successfully." });
            }}>
              Add Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Truck Dialog */}
      <Dialog open={addTruckOpen} onOpenChange={setAddTruckOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Truck</DialogTitle>
            <DialogDescription>Enter the truck's information below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input id="make" placeholder="Volvo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="VNL 860" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" placeholder="2024" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" placeholder="Enter 17-character VIN" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="regExpiry">Registration Expiry</Label>
                <Input id="regExpiry" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inspExpiry">Inspection Expiry</Label>
                <Input id="inspExpiry" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignDriver">Assign Driver</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTruckOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => {
              setAddTruckOpen(false);
              toast({ title: "Truck Added", description: "New truck has been added successfully." });
            }}>
              Add Truck
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
