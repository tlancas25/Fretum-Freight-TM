"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Wallet,
  Plus,
  Download,
  FileText,
  Calendar,
  TrendingUp,
  DollarSign,
  Truck,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Printer,
  Eye,
  Calculator,
  Percent,
  Fuel,
  CreditCard,
  ChevronRight,
  ArrowUpRight,
  Banknote,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample drivers
const drivers = [
  { id: "DRV-001", name: "Mike Johnson", avatar: "/avatars/mike.jpg", phone: "(555) 123-4567", type: "company", payType: "percentage", payRate: 0.28 },
  { id: "DRV-002", name: "Sarah Williams", avatar: "/avatars/sarah.jpg", phone: "(555) 234-5678", type: "owner-op", payType: "percentage", payRate: 0.85 },
  { id: "DRV-003", name: "Carlos Rodriguez", avatar: "/avatars/carlos.jpg", phone: "(555) 345-6789", type: "company", payType: "per-mile", payRate: 0.55 },
  { id: "DRV-004", name: "James Thompson", avatar: "/avatars/james.jpg", phone: "(555) 456-7890", type: "lease", payType: "percentage", payRate: 0.70 },
];

// Sample loads for settlement calculation
const completedLoads = [
  { 
    id: "LD-98821", 
    driverId: "DRV-001",
    customer: "Amazon Logistics",
    origin: "Chicago, IL", 
    destination: "Dallas, TX",
    pickupDate: "2026-01-15",
    deliveryDate: "2026-01-17",
    miles: 920,
    rate: 2450.00,
    fuelCost: 412.50,
    fuelSurcharge: 245.00,
    detention: 0,
    layover: 0,
    accessorials: 0,
    status: "delivered"
  },
  { 
    id: "LD-98820", 
    driverId: "DRV-001",
    customer: "Walmart Distribution",
    origin: "Dallas, TX", 
    destination: "Phoenix, AZ",
    pickupDate: "2026-01-12",
    deliveryDate: "2026-01-14",
    miles: 1065,
    rate: 2875.00,
    fuelCost: 478.25,
    fuelSurcharge: 287.50,
    detention: 150.00,
    layover: 0,
    accessorials: 0,
    status: "delivered"
  },
  { 
    id: "LD-98819", 
    driverId: "DRV-002",
    customer: "Target Stores",
    origin: "Los Angeles, CA", 
    destination: "Seattle, WA",
    pickupDate: "2026-01-10",
    deliveryDate: "2026-01-12",
    miles: 1135,
    rate: 3200.00,
    fuelCost: 625.00,
    fuelSurcharge: 320.00,
    detention: 0,
    layover: 200.00,
    accessorials: 75.00,
    status: "delivered"
  },
  { 
    id: "LD-98818", 
    driverId: "DRV-003",
    customer: "Home Depot",
    origin: "Denver, CO", 
    destination: "Salt Lake City, UT",
    pickupDate: "2026-01-08",
    deliveryDate: "2026-01-09",
    miles: 525,
    rate: 1450.00,
    fuelCost: 236.25,
    fuelSurcharge: 145.00,
    detention: 75.00,
    layover: 0,
    accessorials: 0,
    status: "delivered"
  },
  { 
    id: "LD-98817", 
    driverId: "DRV-001",
    customer: "FedEx Freight",
    origin: "Memphis, TN", 
    destination: "Atlanta, GA",
    pickupDate: "2026-01-05",
    deliveryDate: "2026-01-06",
    miles: 385,
    rate: 1150.00,
    fuelCost: 173.25,
    fuelSurcharge: 115.00,
    detention: 0,
    layover: 0,
    accessorials: 50.00,
    status: "delivered"
  },
];

// Sample deductions
const standardDeductions = [
  { id: "ded-001", name: "Fuel Card Advance", type: "advance", amount: 500.00 },
  { id: "ded-002", name: "Insurance Contribution", type: "fixed", amount: 125.00 },
  { id: "ded-003", name: "ELD Subscription", type: "fixed", amount: 35.00 },
  { id: "ded-004", name: "Cargo Insurance", type: "percentage", rate: 0.02 },
  { id: "ded-005", name: "Escrow Deposit", type: "fixed", amount: 100.00 },
];

// Sample past settlements
const pastSettlements = [
  { 
    id: "SET-2026-003", 
    driverId: "DRV-001",
    driverName: "Mike Johnson",
    periodStart: "2026-01-06",
    periodEnd: "2026-01-12",
    loads: 3,
    miles: 2370,
    grossPay: 1820.00,
    deductions: 660.00,
    netPay: 1160.00,
    status: "paid",
    paidDate: "2026-01-15"
  },
  { 
    id: "SET-2026-002", 
    driverId: "DRV-002",
    driverName: "Sarah Williams",
    periodStart: "2026-01-06",
    periodEnd: "2026-01-12",
    loads: 2,
    miles: 1890,
    grossPay: 4080.00,
    deductions: 520.00,
    netPay: 3560.00,
    status: "paid",
    paidDate: "2026-01-15"
  },
  { 
    id: "SET-2026-001", 
    driverId: "DRV-003",
    driverName: "Carlos Rodriguez",
    periodStart: "2026-01-06",
    periodEnd: "2026-01-12",
    loads: 4,
    miles: 2100,
    grossPay: 1155.00,
    deductions: 260.00,
    netPay: 895.00,
    status: "paid",
    paidDate: "2026-01-15"
  },
  { 
    id: "SET-2025-052", 
    driverId: "DRV-001",
    driverName: "Mike Johnson",
    periodStart: "2025-12-30",
    periodEnd: "2026-01-05",
    loads: 4,
    miles: 2850,
    grossPay: 2240.00,
    deductions: 760.00,
    netPay: 1480.00,
    status: "paid",
    paidDate: "2026-01-08"
  },
];

type SettlementStatus = "draft" | "pending" | "approved" | "paid";

export default function SettlementsPage() {
  const { toast } = useToast();
  const [selectedDriver, setSelectedDriver] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [createSettlementOpen, setCreateSettlementOpen] = useState(false);
  const [viewSettlementOpen, setViewSettlementOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<typeof pastSettlements[0] | null>(null);
  const [activeTab, setActiveTab] = useState("pending");

  // Calculate current period settlements
  const currentPeriodStart = "2026-01-13";
  const currentPeriodEnd = "2026-01-19";

  // Get loads for current period by driver
  const getDriverLoads = (driverId: string) => {
    return completedLoads.filter(load => load.driverId === driverId);
  };

  // Calculate driver settlement
  const calculateSettlement = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    const loads = getDriverLoads(driverId);
    
    if (!driver || loads.length === 0) return null;

    const totalMiles = loads.reduce((sum, l) => sum + l.miles, 0);
    const totalRevenue = loads.reduce((sum, l) => sum + l.rate + l.fuelSurcharge + l.detention + l.layover + l.accessorials, 0);
    const totalFuel = loads.reduce((sum, l) => sum + l.fuelCost, 0);

    let grossPay = 0;
    if (driver.payType === "percentage") {
      grossPay = totalRevenue * driver.payRate;
    } else if (driver.payType === "per-mile") {
      grossPay = totalMiles * driver.payRate;
    }

    // Calculate deductions
    let totalDeductions = 0;
    const deductionDetails: { name: string; amount: number }[] = [];

    // For owner-operators, deduct fuel
    if (driver.type === "owner-op") {
      deductionDetails.push({ name: "Fuel Advance", amount: totalFuel });
      totalDeductions += totalFuel;
    }

    // Standard deductions
    standardDeductions.forEach(ded => {
      if (ded.type === "fixed" && ded.amount !== undefined) {
        deductionDetails.push({ name: ded.name, amount: ded.amount });
        totalDeductions += ded.amount;
      } else if (ded.type === "percentage" && ded.rate !== undefined) {
        const amount = totalRevenue * ded.rate;
        deductionDetails.push({ name: ded.name, amount });
        totalDeductions += amount;
      } else if (ded.type === "advance" && driver.type !== "owner-op" && ded.amount !== undefined) {
        deductionDetails.push({ name: ded.name, amount: ded.amount });
        totalDeductions += ded.amount;
      }
    });

    const netPay = grossPay - totalDeductions;

    return {
      driver,
      loads,
      totalMiles,
      totalRevenue,
      grossPay,
      deductions: deductionDetails,
      totalDeductions,
      netPay,
    };
  };

  // Get all pending settlements
  const pendingSettlements = drivers.map(d => calculateSettlement(d.id)).filter(s => s !== null && s.loads.length > 0);

  // Calculate totals
  const totalPendingAmount = pendingSettlements.reduce((sum, s) => sum + (s?.netPay || 0), 0);
  const totalPaidThisMonth = pastSettlements.filter(s => s.status === "paid").reduce((sum, s) => sum + s.netPay, 0);

  const handleCreateSettlement = () => {
    setCreateSettlementOpen(false);
    toast({
      title: "Settlement Created",
      description: "Driver settlement has been generated and is ready for review.",
    });
  };

  const handleApproveSettlement = (settlementId: string) => {
    toast({
      title: "Settlement Approved",
      description: `Settlement ${settlementId} has been approved for payment.`,
    });
  };

  const handlePaySettlement = (settlementId: string) => {
    toast({
      title: "Payment Processed",
      description: `Settlement ${settlementId} has been marked as paid.`,
    });
  };

  const getStatusBadge = (status: SettlementStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-slate-100">Draft</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
      case "approved":
        return <Badge className="bg-blue-100 text-blue-700">Approved</Badge>;
      case "paid":
        return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-brand-blue-600" />
                Driver Settlements
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Calculate and process driver pay for completed loads
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pay Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Period (Jan 13-19)</SelectItem>
                  <SelectItem value="previous">Previous (Jan 6-12)</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Dialog open={createSettlementOpen} onOpenChange={setCreateSettlementOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Settlement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Settlement</DialogTitle>
                    <DialogDescription>
                      Generate a settlement for a driver based on completed loads
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Driver</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map(driver => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Period Start</Label>
                        <Input type="date" defaultValue={currentPeriodStart} />
                      </div>
                      <div className="space-y-2">
                        <Label>Period End</Label>
                        <Input type="date" defaultValue={currentPeriodEnd} />
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Settlement Preview</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Loads in period:</span>
                          <span className="font-medium">3</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total miles:</span>
                          <span className="font-medium">2,370</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gross pay:</span>
                          <span className="font-medium">$1,820.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deductions:</span>
                          <span className="font-medium text-red-600">-$660.00</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between">
                          <span className="font-medium">Net pay:</span>
                          <span className="font-bold text-green-600">$1,160.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateSettlementOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateSettlement} className="bg-blue-600 hover:bg-blue-700">
                      Create Settlement
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${totalPendingAmount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Pending Settlements</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${totalPaidThisMonth.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Paid This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{drivers.length}</p>
                    <p className="text-xs text-muted-foreground">Active Drivers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Truck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedLoads.length}</p>
                    <p className="text-xs text-muted-foreground">Loads This Period</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending Settlements</TabsTrigger>
              <TabsTrigger value="history">Settlement History</TabsTrigger>
              <TabsTrigger value="drivers">Driver Pay Rates</TabsTrigger>
            </TabsList>

            {/* Pending Settlements Tab */}
            <TabsContent value="pending" className="space-y-4">
              {pendingSettlements.map((settlement) => {
                if (!settlement) return null;
                return (
                  <Card key={settlement.driver.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        {/* Driver Info */}
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={settlement.driver.avatar} />
                            <AvatarFallback>{settlement.driver.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{settlement.driver.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {settlement.driver.type === "company" ? "Company Driver" : 
                                 settlement.driver.type === "owner-op" ? "Owner Operator" : "Lease Driver"}
                              </Badge>
                              <span>•</span>
                              <span>
                                {settlement.driver.payType === "percentage" 
                                  ? `${(settlement.driver.payRate * 100).toFixed(0)}% of revenue`
                                  : `$${settlement.driver.payRate.toFixed(2)}/mile`}
                              </span>
                            </div>
                            <p className="text-sm mt-1">
                              Period: {currentPeriodStart} to {currentPeriodEnd}
                            </p>
                          </div>
                        </div>

                        {/* Net Pay */}
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Net Pay</p>
                          <p className="text-3xl font-bold text-green-600">
                            ${settlement.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                          <Badge className="bg-amber-100 text-amber-700 mt-1">Pending Approval</Badge>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="grid grid-cols-4 gap-6">
                        {/* Loads Summary */}
                        <div>
                          <p className="text-sm font-medium mb-2">Loads Completed</p>
                          <div className="space-y-1">
                            {settlement.loads.map(load => (
                              <div key={load.id} className="flex items-center justify-between text-sm">
                                <Badge variant="outline" className="text-xs">{load.id}</Badge>
                                <span>${(load.rate + load.fuelSurcharge + load.detention + load.layover + load.accessorials).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Revenue Breakdown */}
                        <div>
                          <p className="text-sm font-medium mb-2">Revenue</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Line Haul</span>
                              <span>${settlement.loads.reduce((s, l) => s + l.rate, 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Fuel Surcharge</span>
                              <span>${settlement.loads.reduce((s, l) => s + l.fuelSurcharge, 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Accessorials</span>
                              <span>${settlement.loads.reduce((s, l) => s + l.detention + l.layover + l.accessorials, 0).toLocaleString()}</span>
                            </div>
                            <Separator className="my-1" />
                            <div className="flex justify-between font-medium">
                              <span>Total Revenue</span>
                              <span>${settlement.totalRevenue.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Pay Calculation */}
                        <div>
                          <p className="text-sm font-medium mb-2">Pay Calculation</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {settlement.driver.payType === "percentage" 
                                  ? `${(settlement.driver.payRate * 100).toFixed(0)}% of ${settlement.totalRevenue.toLocaleString()}`
                                  : `${settlement.totalMiles.toLocaleString()} mi × $${settlement.driver.payRate.toFixed(2)}`}
                              </span>
                              <span className="font-medium">${settlement.grossPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Deductions */}
                        <div>
                          <p className="text-sm font-medium mb-2">Deductions</p>
                          <div className="space-y-1 text-sm">
                            {settlement.deductions.slice(0, 3).map((ded, i) => (
                              <div key={i} className="flex justify-between">
                                <span className="text-muted-foreground">{ded.name}</span>
                                <span className="text-red-600">-${ded.amount.toFixed(2)}</span>
                              </div>
                            ))}
                            {settlement.deductions.length > 3 && (
                              <div className="flex justify-between text-muted-foreground">
                                <span>+{settlement.deductions.length - 3} more</span>
                              </div>
                            )}
                            <Separator className="my-1" />
                            <div className="flex justify-between font-medium">
                              <span>Total Deductions</span>
                              <span className="text-red-600">-${settlement.totalDeductions.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Adjust
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveSettlement(settlement.driver.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve & Pay
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {pendingSettlements.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">No Pending Settlements</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      There are no completed loads to settle for this period.
                    </p>
                    <Button variant="outline" onClick={() => setCreateSettlementOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Manual Settlement
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Settlement History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Settlement History</CardTitle>
                      <CardDescription>View and manage past settlements</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Drivers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Drivers</SelectItem>
                          {drivers.map(driver => (
                            <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Settlement ID</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-center">Loads</TableHead>
                        <TableHead className="text-right">Miles</TableHead>
                        <TableHead className="text-right">Gross Pay</TableHead>
                        <TableHead className="text-right">Deductions</TableHead>
                        <TableHead className="text-right">Net Pay</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastSettlements
                        .filter(s => selectedDriver === "all" || s.driverId === selectedDriver)
                        .map((settlement) => (
                        <TableRow key={settlement.id}>
                          <TableCell className="font-medium">{settlement.id}</TableCell>
                          <TableCell>{settlement.driverName}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(settlement.periodStart).toLocaleDateString()} - {new Date(settlement.periodEnd).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-center">{settlement.loads}</TableCell>
                          <TableCell className="text-right">{settlement.miles.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${settlement.grossPay.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-red-600">-${settlement.deductions.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">${settlement.netPay.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(settlement.status as SettlementStatus)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setSelectedSettlement(settlement);
                                  setViewSettlementOpen(true);
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Printer className="h-4 w-4 mr-2" />
                                  Print
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Send className="h-4 w-4 mr-2" />
                                  Email to Driver
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Driver Pay Rates Tab */}
            <TabsContent value="drivers">
              <div className="grid grid-cols-2 gap-4">
                {drivers.map(driver => (
                  <Card key={driver.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={driver.avatar} />
                            <AvatarFallback>{driver.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{driver.name}</h3>
                            <p className="text-sm text-muted-foreground">{driver.phone}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <Separator className="my-3" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Driver Type</p>
                          <p className="font-medium capitalize">{driver.type.replace("-", " ")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pay Structure</p>
                          <p className="font-medium">
                            {driver.payType === "percentage" 
                              ? `${(driver.payRate * 100).toFixed(0)}% of Revenue`
                              : `$${driver.payRate.toFixed(2)} per Mile`}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">YTD Earnings</span>
                          <span className="font-bold text-green-600">
                            ${(Math.random() * 15000 + 5000).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* View Settlement Dialog */}
      <Dialog open={viewSettlementOpen} onOpenChange={setViewSettlementOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Settlement Details</DialogTitle>
            <DialogDescription>
              {selectedSettlement?.id} • {selectedSettlement?.driverName}
            </DialogDescription>
          </DialogHeader>
          {selectedSettlement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Period</p>
                  <p className="font-medium">
                    {new Date(selectedSettlement.periodStart).toLocaleDateString()} - {new Date(selectedSettlement.periodEnd).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedSettlement.status as SettlementStatus)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{selectedSettlement.loads}</p>
                  <p className="text-xs text-muted-foreground">Loads</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{selectedSettlement.miles.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Miles</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">${selectedSettlement.netPay.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Net Pay</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span>Gross Pay</span>
                  <span className="font-medium">${selectedSettlement.grossPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b text-red-600">
                  <span>Deductions</span>
                  <span className="font-medium">-${selectedSettlement.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 text-lg">
                  <span className="font-medium">Net Pay</span>
                  <span className="font-bold text-green-600">${selectedSettlement.netPay.toLocaleString()}</span>
                </div>
              </div>

              {selectedSettlement.status === "paid" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">
                      Paid on {new Date(selectedSettlement.paidDate!).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewSettlementOpen(false)}>Close</Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
