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
  KanbanSquare,
  Plus,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Phone,
  Clock,
  Truck,
  Package,
  Navigation,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Users,
  Calendar,
  RefreshCw,
  Maximize2,
  GripVertical,
  ArrowRight,
  Timer,
  Fuel,
  Route,
  PhoneCall,
  MessageSquare,
  Eye,
  Edit,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Target,
  TrendingUp,
  Activity,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Dispatch board data
const dispatchItems = [
  // Unassigned
  {
    id: "LD-2026-015",
    status: "unassigned",
    customer: "ABC Logistics",
    origin: { city: "Los Angeles", state: "CA", time: "08:00 AM" },
    destination: { city: "Phoenix", state: "AZ", time: "02:00 PM" },
    distance: 370,
    rate: 1850,
    equipment: "Dry Van",
    weight: "42,000 lbs",
    priority: "high",
    pickup: "2026-01-10",
  },
  {
    id: "LD-2026-016",
    status: "unassigned",
    customer: "XYZ Shipping",
    origin: { city: "Seattle", state: "WA", time: "10:00 AM" },
    destination: { city: "Portland", state: "OR", time: "02:30 PM" },
    distance: 175,
    rate: 875,
    equipment: "Reefer",
    weight: "38,500 lbs",
    priority: "normal",
    pickup: "2026-01-10",
  },
  {
    id: "LD-2026-017",
    status: "unassigned",
    customer: "Fast Freight",
    origin: { city: "Dallas", state: "TX", time: "06:00 AM" },
    destination: { city: "Houston", state: "TX", time: "10:00 AM" },
    distance: 240,
    rate: 960,
    equipment: "Flatbed",
    weight: "35,000 lbs",
    priority: "urgent",
    pickup: "2026-01-09",
  },
  // Assigned
  {
    id: "LD-2026-012",
    status: "assigned",
    customer: "Prime Carriers",
    origin: { city: "Chicago", state: "IL", time: "07:00 AM" },
    destination: { city: "Detroit", state: "MI", time: "12:00 PM" },
    distance: 280,
    rate: 1400,
    equipment: "Dry Van",
    weight: "44,000 lbs",
    priority: "normal",
    pickup: "2026-01-10",
    driver: { name: "John Davidson", id: "DRV-001", phone: "(555) 123-4567", avatar: "JD" },
    truck: "TRK-001",
  },
  {
    id: "LD-2026-013",
    status: "assigned",
    customer: "Global Transport",
    origin: { city: "Atlanta", state: "GA", time: "09:00 AM" },
    destination: { city: "Nashville", state: "TN", time: "02:00 PM" },
    distance: 250,
    rate: 1125,
    equipment: "Reefer",
    weight: "40,000 lbs",
    priority: "high",
    pickup: "2026-01-10",
    driver: { name: "Sarah Mitchell", id: "DRV-002", phone: "(555) 234-5678", avatar: "SM" },
    truck: "TRK-002",
  },
  // En Route
  {
    id: "LD-2026-008",
    status: "en-route",
    customer: "Midwest Movers",
    origin: { city: "Denver", state: "CO", time: "05:00 AM" },
    destination: { city: "Kansas City", state: "MO", time: "01:00 PM" },
    distance: 600,
    rate: 2400,
    equipment: "Dry Van",
    weight: "43,000 lbs",
    priority: "normal",
    pickup: "2026-01-09",
    driver: { name: "Mike Rodriguez", id: "DRV-003", phone: "(555) 345-6789", avatar: "MR" },
    truck: "TRK-003",
    progress: 65,
    eta: "2h 15m",
    currentLocation: "I-70 near Hays, KS",
    lastUpdate: "5 min ago",
  },
  {
    id: "LD-2026-009",
    status: "en-route",
    customer: "Coast to Coast",
    origin: { city: "San Francisco", state: "CA", time: "04:00 AM" },
    destination: { city: "Sacramento", state: "CA", time: "07:00 AM" },
    distance: 90,
    rate: 450,
    equipment: "Box Truck",
    weight: "15,000 lbs",
    priority: "urgent",
    pickup: "2026-01-09",
    driver: { name: "Emily Chen", id: "DRV-004", phone: "(555) 456-7890", avatar: "EC" },
    truck: "TRK-004",
    progress: 82,
    eta: "35 min",
    currentLocation: "I-80 near Davis, CA",
    lastUpdate: "2 min ago",
  },
  {
    id: "LD-2026-010",
    status: "en-route",
    customer: "Southern Freight",
    origin: { city: "Miami", state: "FL", time: "06:00 AM" },
    destination: { city: "Jacksonville", state: "FL", time: "12:00 PM" },
    distance: 345,
    rate: 1380,
    equipment: "Reefer",
    weight: "36,000 lbs",
    priority: "high",
    pickup: "2026-01-09",
    driver: { name: "Robert Wilson", id: "DRV-005", phone: "(555) 567-8901", avatar: "RW" },
    truck: "TRK-005",
    progress: 45,
    eta: "3h 30m",
    currentLocation: "I-95 near Daytona Beach, FL",
    lastUpdate: "8 min ago",
  },
  // At Pickup
  {
    id: "LD-2026-011",
    status: "at-pickup",
    customer: "Mountain Logistics",
    origin: { city: "Salt Lake City", state: "UT", time: "08:00 AM" },
    destination: { city: "Boise", state: "ID", time: "02:00 PM" },
    distance: 340,
    rate: 1360,
    equipment: "Dry Van",
    weight: "41,000 lbs",
    priority: "normal",
    pickup: "2026-01-09",
    driver: { name: "David Kim", id: "DRV-006", phone: "(555) 678-9012", avatar: "DK" },
    truck: "TRK-006",
    arrivalTime: "7:45 AM",
    waitTime: "45 min",
  },
  // Completed
  {
    id: "LD-2026-005",
    status: "completed",
    customer: "Express Lines",
    origin: { city: "New York", state: "NY", time: "05:00 AM" },
    destination: { city: "Philadelphia", state: "PA", time: "08:00 AM" },
    distance: 95,
    rate: 475,
    equipment: "Dry Van",
    weight: "28,000 lbs",
    priority: "normal",
    pickup: "2026-01-09",
    driver: { name: "Lisa Park", id: "DRV-007", phone: "(555) 789-0123", avatar: "LP" },
    truck: "TRK-007",
    deliveredAt: "7:52 AM",
    podReceived: true,
  },
  {
    id: "LD-2026-006",
    status: "completed",
    customer: "Metro Freight",
    origin: { city: "Boston", state: "MA", time: "06:00 AM" },
    destination: { city: "Hartford", state: "CT", time: "09:00 AM" },
    distance: 100,
    rate: 500,
    equipment: "Box Truck",
    weight: "18,000 lbs",
    priority: "normal",
    pickup: "2026-01-09",
    driver: { name: "Tom Brown", id: "DRV-008", phone: "(555) 890-1234", avatar: "TB" },
    truck: "TRK-008",
    deliveredAt: "8:45 AM",
    podReceived: true,
  },
];

// Available drivers for assignment
const availableDrivers = [
  { id: "DRV-009", name: "Chris Anderson", avatar: "CA", truck: "TRK-009", location: "Los Angeles, CA", hos: 11 },
  { id: "DRV-010", name: "Amy Martinez", avatar: "AM", truck: "TRK-010", location: "Phoenix, AZ", hos: 10 },
  { id: "DRV-011", name: "Kevin Lee", avatar: "KL", truck: "TRK-011", location: "Dallas, TX", hos: 8 },
];

// Priority badge
function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    urgent: "bg-red-100 text-red-700 border-red-200",
    high: "bg-amber-100 text-amber-700 border-amber-200",
    normal: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 font-medium", styles[priority])}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}

// Dispatch card component
function DispatchCard({ item, onAssign }: { item: typeof dispatchItems[0]; onAssign?: () => void }) {
  const isEnRoute = item.status === "en-route";
  const isCompleted = item.status === "completed";
  const hasDriver = "driver" in item && item.driver;

  return (
    <Card className={cn(
      "mb-2 hover:shadow-md transition-all cursor-grab active:cursor-grabbing",
      item.priority === "urgent" && "border-l-4 border-l-red-500",
      item.priority === "high" && "border-l-4 border-l-amber-500"
    )}>
      <CardContent className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-brand-600">{item.id}</span>
            <PriorityBadge priority={item.priority} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Load
              </DropdownMenuItem>
              {!hasDriver && (
                <DropdownMenuItem onClick={onAssign}>
                  <Users className="w-4 h-4 mr-2" />
                  Assign Driver
                </DropdownMenuItem>
              )}
              {hasDriver && (
                <>
                  <DropdownMenuItem>
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Call Driver
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Driver
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <MapPin className="w-4 h-4 mr-2" />
                Track Location
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Customer */}
        <p className="text-xs font-medium text-slate-700 mb-2">{item.customer}</p>

        {/* Route */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-1 text-[11px]">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-medium">{item.origin.city}, {item.origin.state}</span>
            </div>
            <p className="text-[10px] text-muted-foreground ml-3">{item.origin.time}</p>
          </div>
          <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-1 text-[11px]">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-medium">{item.destination.city}, {item.destination.state}</span>
            </div>
            <p className="text-[10px] text-muted-foreground ml-3">{item.destination.time}</p>
          </div>
        </div>

        {/* Progress (for en-route) */}
        {isEnRoute && "progress" in item && (
          <div className="mb-2">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-muted-foreground">{item.currentLocation}</span>
              <span className="font-medium text-brand-600">ETA: {item.eta}</span>
            </div>
            <Progress value={item.progress} className="h-1.5" />
          </div>
        )}

        {/* Wait time (at pickup) */}
        {item.status === "at-pickup" && "waitTime" in item && (
          <div className="flex items-center gap-2 mb-2 p-1.5 bg-amber-50 rounded text-[10px]">
            <Timer className="w-3 h-3 text-amber-600" />
            <span className="text-amber-700">Waiting: {item.waitTime}</span>
          </div>
        )}

        {/* Completed info */}
        {isCompleted && "deliveredAt" in item && (
          <div className="flex items-center gap-2 mb-2 p-1.5 bg-green-50 rounded text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <span className="text-green-700">Delivered at {item.deliveredAt}</span>
            {"podReceived" in item && item.podReceived && (
              <Badge variant="outline" className="ml-auto text-[9px] px-1 py-0 bg-green-100 text-green-700 border-green-200">
                POD ✓
              </Badge>
            )}
          </div>
        )}

        {/* Driver info */}
        {hasDriver && (
          <div className="flex items-center gap-2 mb-2 p-1.5 bg-slate-50 rounded">
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-[8px] bg-brand-100 text-brand-700">
                {item.driver.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium truncate">{item.driver.name}</p>
              <p className="text-[9px] text-muted-foreground">{item.truck}</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Phone className="w-2.5 h-2.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.driver.phone}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Footer - Details */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Route className="w-3 h-3" />
              {item.distance} mi
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {item.equipment}
            </span>
          </div>
          <span className="font-semibold text-green-600">${item.rate.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Column component
function DispatchColumn({ 
  title, 
  items, 
  icon: Icon, 
  color,
  onAssign 
}: { 
  title: string; 
  items: typeof dispatchItems; 
  icon: React.ElementType;
  color: string;
  onAssign: (itemId: string) => void;
}) {
  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] flex-1 bg-slate-50 rounded-lg">
      {/* Column Header */}
      <div className={cn("p-3 rounded-t-lg", color)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className="font-semibold text-sm">{title}</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-inherit text-xs px-1.5">
            {items.length}
          </Badge>
        </div>
      </div>

      {/* Column Content */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-0">
          {items.map((item) => (
            <DispatchCard 
              key={item.id} 
              item={item} 
              onAssign={() => onAssign(item.id)}
            />
          ))}
          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No loads in this status
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function DispatchPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");

  // Group items by status
  const unassigned = dispatchItems.filter(i => i.status === "unassigned");
  const assigned = dispatchItems.filter(i => i.status === "assigned");
  const enRoute = dispatchItems.filter(i => i.status === "en-route");
  const atPickup = dispatchItems.filter(i => i.status === "at-pickup");
  const completed = dispatchItems.filter(i => i.status === "completed");

  // Stats
  const totalLoads = dispatchItems.length;
  const activeLoads = enRoute.length + atPickup.length;
  const completedToday = completed.length;
  const totalRevenue = dispatchItems.reduce((sum, i) => sum + i.rate, 0);

  const handleAssign = (loadId: string) => {
    setSelectedLoadId(loadId);
    setAssignDialogOpen(true);
  };

  const handleAssignConfirm = () => {
    if (selectedDriverId && selectedLoadId) {
      setAssignDialogOpen(false);
      toast({
        title: "Driver Assigned",
        description: `Load ${selectedLoadId} has been assigned successfully.`,
      });
      setSelectedDriverId("");
      setSelectedLoadId(null);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <KanbanSquare className="w-6 h-6 text-brand-600" />
                Dispatch Board
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Real-time load management and driver assignment
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="w-4 h-4 mr-2" />
                Full Screen
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Load
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-3">
            <Card className="p-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">{totalLoads}</p>
                  <p className="text-[10px] text-muted-foreground">Total Loads</p>
                </div>
              </div>
            </Card>
            <Card className="p-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 rounded">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-600">{unassigned.length}</p>
                  <p className="text-[10px] text-muted-foreground">Unassigned</p>
                </div>
              </div>
            </Card>
            <Card className="p-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded">
                  <Navigation className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">{activeLoads}</p>
                  <p className="text-[10px] text-muted-foreground">Active</p>
                </div>
              </div>
            </Card>
            <Card className="p-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">{completedToday}</p>
                  <p className="text-[10px] text-muted-foreground">Completed</p>
                </div>
              </div>
            </Card>
            <Card className="p-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 rounded">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-600">${(totalRevenue / 1000).toFixed(1)}k</p>
                  <p className="text-[10px] text-muted-foreground">Revenue</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search loads, customers, drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                <SelectItem value="dry-van">Dry Van</SelectItem>
                <SelectItem value="reefer">Reefer</SelectItem>
                <SelectItem value="flatbed">Flatbed</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="today">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-auto p-4">
          <div className="flex gap-3 h-full min-h-0">
            <DispatchColumn
              title="Unassigned"
              items={unassigned}
              icon={AlertCircle}
              color="bg-amber-500 text-white"
              onAssign={handleAssign}
            />
            <DispatchColumn
              title="Assigned"
              items={assigned}
              icon={Users}
              color="bg-blue-500 text-white"
              onAssign={handleAssign}
            />
            <DispatchColumn
              title="At Pickup"
              items={atPickup}
              icon={MapPin}
              color="bg-purple-500 text-white"
              onAssign={handleAssign}
            />
            <DispatchColumn
              title="En Route"
              items={enRoute}
              icon={Navigation}
              color="bg-cyan-500 text-white"
              onAssign={handleAssign}
            />
            <DispatchColumn
              title="Completed"
              items={completed}
              icon={CheckCircle2}
              color="bg-green-500 text-white"
              onAssign={handleAssign}
            />
          </div>
        </div>
      </div>

      {/* Assign Driver Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Driver</DialogTitle>
            <DialogDescription>
              Select an available driver to assign to load {selectedLoadId}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label>Available Drivers</Label>
            {availableDrivers.map((driver) => (
              <div
                key={driver.id}
                onClick={() => setSelectedDriverId(driver.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedDriverId === driver.id
                    ? "border-brand-600 bg-brand-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-brand-100 text-brand-700">
                    {driver.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{driver.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {driver.truck} • {driver.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{driver.hos}h HOS</p>
                  <p className="text-[10px] text-muted-foreground">Available</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white" 
              onClick={handleAssignConfirm}
              disabled={!selectedDriverId}
            >
              Assign Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
