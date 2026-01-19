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
import { Separator } from "@/components/ui/separator";
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
  Fuel,
  MapPin,
  Plus,
  Download,
  FileText,
  Calendar,
  TrendingUp,
  DollarSign,
  Truck,
  Calculator,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Upload,
} from "lucide-react";

// US States with IFTA tax rates (sample rates - actual rates vary quarterly)
const stateData = [
  { code: "AL", name: "Alabama", taxRate: 0.29, surchargeTaxRate: 0.19 },
  { code: "AZ", name: "Arizona", taxRate: 0.26, surchargeTaxRate: 0.18 },
  { code: "AR", name: "Arkansas", taxRate: 0.285, surchargeTaxRate: 0.205 },
  { code: "CA", name: "California", taxRate: 0.68, surchargeTaxRate: 0.50 },
  { code: "CO", name: "Colorado", taxRate: 0.22, surchargeTaxRate: 0.18 },
  { code: "CT", name: "Connecticut", taxRate: 0.445, surchargeTaxRate: 0.25 },
  { code: "DE", name: "Delaware", taxRate: 0.22, surchargeTaxRate: 0.22 },
  { code: "FL", name: "Florida", taxRate: 0.35, surchargeTaxRate: 0.17 },
  { code: "GA", name: "Georgia", taxRate: 0.324, surchargeTaxRate: 0.19 },
  { code: "ID", name: "Idaho", taxRate: 0.33, surchargeTaxRate: 0.25 },
  { code: "IL", name: "Illinois", taxRate: 0.467, surchargeTaxRate: 0.21 },
  { code: "IN", name: "Indiana", taxRate: 0.34, surchargeTaxRate: 0.21 },
  { code: "IA", name: "Iowa", taxRate: 0.305, surchargeTaxRate: 0.225 },
  { code: "KS", name: "Kansas", taxRate: 0.26, surchargeTaxRate: 0.24 },
  { code: "KY", name: "Kentucky", taxRate: 0.287, surchargeTaxRate: 0.20 },
  { code: "LA", name: "Louisiana", taxRate: 0.20, surchargeTaxRate: 0.20 },
  { code: "ME", name: "Maine", taxRate: 0.312, surchargeTaxRate: 0.218 },
  { code: "MD", name: "Maryland", taxRate: 0.413, surchargeTaxRate: 0.27 },
  { code: "MA", name: "Massachusetts", taxRate: 0.24, surchargeTaxRate: 0.24 },
  { code: "MI", name: "Michigan", taxRate: 0.303, surchargeTaxRate: 0.23 },
  { code: "MN", name: "Minnesota", taxRate: 0.285, surchargeTaxRate: 0.20 },
  { code: "MS", name: "Mississippi", taxRate: 0.18, surchargeTaxRate: 0.18 },
  { code: "MO", name: "Missouri", taxRate: 0.22, surchargeTaxRate: 0.17 },
  { code: "MT", name: "Montana", taxRate: 0.3275, surchargeTaxRate: 0.2775 },
  { code: "NE", name: "Nebraska", taxRate: 0.296, surchargeTaxRate: 0.196 },
  { code: "NV", name: "Nevada", taxRate: 0.23, surchargeTaxRate: 0.17 },
  { code: "NH", name: "New Hampshire", taxRate: 0.222, surchargeTaxRate: 0.165 },
  { code: "NJ", name: "New Jersey", taxRate: 0.415, surchargeTaxRate: 0.35 },
  { code: "NM", name: "New Mexico", taxRate: 0.21, surchargeTaxRate: 0.17 },
  { code: "NY", name: "New York", taxRate: 0.3275, surchargeTaxRate: 0.17 },
  { code: "NC", name: "North Carolina", taxRate: 0.385, surchargeTaxRate: 0.20 },
  { code: "ND", name: "North Dakota", taxRate: 0.23, surchargeTaxRate: 0.23 },
  { code: "OH", name: "Ohio", taxRate: 0.385, surchargeTaxRate: 0.28 },
  { code: "OK", name: "Oklahoma", taxRate: 0.19, surchargeTaxRate: 0.16 },
  { code: "OR", name: "Oregon", taxRate: 0.38, surchargeTaxRate: 0.34 },
  { code: "PA", name: "Pennsylvania", taxRate: 0.576, surchargeTaxRate: 0.35 },
  { code: "RI", name: "Rhode Island", taxRate: 0.35, surchargeTaxRate: 0.34 },
  { code: "SC", name: "South Carolina", taxRate: 0.28, surchargeTaxRate: 0.18 },
  { code: "SD", name: "South Dakota", taxRate: 0.28, surchargeTaxRate: 0.22 },
  { code: "TN", name: "Tennessee", taxRate: 0.27, surchargeTaxRate: 0.17 },
  { code: "TX", name: "Texas", taxRate: 0.20, surchargeTaxRate: 0.20 },
  { code: "UT", name: "Utah", taxRate: 0.314, surchargeTaxRate: 0.249 },
  { code: "VT", name: "Vermont", taxRate: 0.307, surchargeTaxRate: 0.267 },
  { code: "VA", name: "Virginia", taxRate: 0.296, surchargeTaxRate: 0.21 },
  { code: "WA", name: "Washington", taxRate: 0.494, surchargeTaxRate: 0.38 },
  { code: "WV", name: "West Virginia", taxRate: 0.357, surchargeTaxRate: 0.285 },
  { code: "WI", name: "Wisconsin", taxRate: 0.329, surchargeTaxRate: 0.243 },
  { code: "WY", name: "Wyoming", taxRate: 0.24, surchargeTaxRate: 0.24 },
];

// Sample quarterly data
const quarterlyData = {
  "Q4 2025": {
    totalMiles: 28450,
    totalGallons: 4521.5,
    avgMPG: 6.29,
    totalTax: 1245.67,
    status: "filed",
    dueDate: "2026-01-31",
  },
  "Q3 2025": {
    totalMiles: 31200,
    totalGallons: 4950.8,
    avgMPG: 6.30,
    totalTax: 1367.23,
    status: "filed",
    dueDate: "2025-10-31",
  },
  "Q2 2025": {
    totalMiles: 29875,
    totalGallons: 4742.1,
    avgMPG: 6.30,
    totalTax: 1298.45,
    status: "filed",
    dueDate: "2025-07-31",
  },
};

// Sample mileage entries
const initialMileageEntries = [
  { id: 1, date: "2026-01-15", loadId: "LD-98821", state: "TX", miles: 485, startOdo: 145200, endOdo: 145685 },
  { id: 2, date: "2026-01-15", loadId: "LD-98821", state: "OK", miles: 232, startOdo: 145685, endOdo: 145917 },
  { id: 3, date: "2026-01-14", loadId: "LD-98820", state: "NM", miles: 180, startOdo: 145020, endOdo: 145200 },
  { id: 4, date: "2026-01-14", loadId: "LD-98820", state: "TX", miles: 420, startOdo: 144600, endOdo: 145020 },
  { id: 5, date: "2026-01-12", loadId: "LD-98819", state: "CA", miles: 310, startOdo: 144290, endOdo: 144600 },
  { id: 6, date: "2026-01-12", loadId: "LD-98819", state: "AZ", miles: 395, startOdo: 143895, endOdo: 144290 },
  { id: 7, date: "2026-01-10", loadId: "LD-98818", state: "NV", miles: 285, startOdo: 143610, endOdo: 143895 },
  { id: 8, date: "2026-01-10", loadId: "LD-98818", state: "CA", miles: 215, startOdo: 143395, endOdo: 143610 },
];

// Sample fuel purchases
const initialFuelPurchases = [
  { id: 1, date: "2026-01-15", state: "TX", city: "Amarillo", gallons: 125.5, pricePerGallon: 3.45, total: 432.98, vendor: "Pilot Travel Center" },
  { id: 2, date: "2026-01-14", state: "NM", city: "Albuquerque", gallons: 118.2, pricePerGallon: 3.52, total: 416.06, vendor: "Love's Travel Stop" },
  { id: 3, date: "2026-01-12", state: "AZ", city: "Flagstaff", gallons: 132.8, pricePerGallon: 3.68, total: 488.70, vendor: "Flying J" },
  { id: 4, date: "2026-01-10", state: "CA", city: "Barstow", gallons: 110.5, pricePerGallon: 4.89, total: 540.35, vendor: "TA Travel Center" },
  { id: 5, date: "2026-01-08", state: "NV", city: "Las Vegas", gallons: 145.2, pricePerGallon: 3.72, total: 540.14, vendor: "Petro Stopping Center" },
];

export default function IFTAPage() {
  const { toast } = useToast();
  const [selectedQuarter, setSelectedQuarter] = useState("Q1 2026");
  const [mileageEntries, setMileageEntries] = useState(initialMileageEntries);
  const [fuelPurchases, setFuelPurchases] = useState(initialFuelPurchases);
  const [addMileageOpen, setAddMileageOpen] = useState(false);
  const [addFuelOpen, setAddFuelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "mileage" | "fuel">("summary");

  // Calculate current quarter stats
  const currentQuarterMiles = mileageEntries.reduce((sum, e) => sum + e.miles, 0);
  const currentQuarterGallons = fuelPurchases.reduce((sum, e) => sum + e.gallons, 0);
  const currentQuarterFuelCost = fuelPurchases.reduce((sum, e) => sum + e.total, 0);
  const currentMPG = currentQuarterGallons > 0 ? currentQuarterMiles / currentQuarterGallons : 0;

  // Calculate miles by state for current entries
  const milesByState = mileageEntries.reduce((acc, entry) => {
    acc[entry.state] = (acc[entry.state] || 0) + entry.miles;
    return acc;
  }, {} as Record<string, number>);

  // Calculate fuel by state
  const fuelByState = fuelPurchases.reduce((acc, entry) => {
    acc[entry.state] = (acc[entry.state] || 0) + entry.gallons;
    return acc;
  }, {} as Record<string, number>);

  // Calculate tax liability by state
  const calculateTaxLiability = () => {
    const stateTaxes: { state: string; miles: number; gallons: number; taxOwed: number; taxPaid: number; netTax: number }[] = [];
    
    const allStates = new Set([...Object.keys(milesByState), ...Object.keys(fuelByState)]);
    
    allStates.forEach(stateCode => {
      const stateInfo = stateData.find(s => s.code === stateCode);
      if (!stateInfo) return;
      
      const miles = milesByState[stateCode] || 0;
      const gallons = fuelByState[stateCode] || 0;
      
      // Tax owed = miles in state / fleet MPG * state tax rate
      const gallonsUsed = currentMPG > 0 ? miles / currentMPG : 0;
      const taxOwed = gallonsUsed * stateInfo.taxRate;
      
      // Tax paid = gallons purchased in state * state tax rate
      const taxPaid = gallons * stateInfo.taxRate;
      
      const netTax = taxOwed - taxPaid;
      
      stateTaxes.push({
        state: stateCode,
        miles,
        gallons,
        taxOwed,
        taxPaid,
        netTax,
      });
    });
    
    return stateTaxes.sort((a, b) => Math.abs(b.netTax) - Math.abs(a.netTax));
  };

  const taxLiability = calculateTaxLiability();
  const totalTaxOwed = taxLiability.reduce((sum, s) => sum + s.taxOwed, 0);
  const totalTaxPaid = taxLiability.reduce((sum, s) => sum + s.taxPaid, 0);
  const netTaxDue = totalTaxOwed - totalTaxPaid;

  const handleAddMileage = () => {
    setAddMileageOpen(false);
    toast({
      title: "Mileage Entry Added",
      description: "Your mileage has been recorded for IFTA reporting.",
    });
  };

  const handleAddFuel = () => {
    setAddFuelOpen(false);
    toast({
      title: "Fuel Purchase Added",
      description: "Your fuel purchase has been recorded for IFTA reporting.",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "IFTA Report Generated",
      description: "Your Q1 2026 IFTA report has been downloaded.",
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Fuel className="w-6 h-6 text-brand-blue-600" />
                IFTA Fuel Tax Reporting
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Track mileage and fuel purchases for quarterly IFTA filings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1 2026">Q1 2026</SelectItem>
                  <SelectItem value="Q4 2025">Q4 2025</SelectItem>
                  <SelectItem value="Q3 2025">Q3 2025</SelectItem>
                  <SelectItem value="Q2 2025">Q2 2025</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                File IFTA
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentQuarterMiles.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Miles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Fuel className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentQuarterGallons.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Gallons Purchased</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentMPG.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Avg MPG</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${currentQuarterFuelCost.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Fuel Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={netTaxDue > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${netTaxDue > 0 ? "bg-red-100" : "bg-green-100"}`}>
                    <Calculator className={`w-5 h-5 ${netTaxDue > 0 ? "text-red-600" : "text-green-600"}`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${netTaxDue > 0 ? "text-red-600" : "text-green-600"}`}>
                      {netTaxDue > 0 ? "-" : "+"}${Math.abs(netTaxDue).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {netTaxDue > 0 ? "Tax Due" : "Credit"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <Button 
              variant={activeTab === "summary" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab("summary")}
              className={activeTab === "summary" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Tax Summary
            </Button>
            <Button 
              variant={activeTab === "mileage" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab("mileage")}
              className={activeTab === "mileage" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Mileage Log
            </Button>
            <Button 
              variant={activeTab === "fuel" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab("fuel")}
              className={activeTab === "fuel" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Fuel Purchases
            </Button>
          </div>

          {/* Tax Summary Tab */}
          {activeTab === "summary" && (
            <div className="grid grid-cols-3 gap-6">
              {/* State Tax Breakdown */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Tax Liability by State
                  </CardTitle>
                  <CardDescription>
                    Calculated based on miles traveled and fuel purchased per state
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>State</TableHead>
                        <TableHead className="text-right">Miles</TableHead>
                        <TableHead className="text-right">Gallons Purchased</TableHead>
                        <TableHead className="text-right">Tax Owed</TableHead>
                        <TableHead className="text-right">Tax Paid</TableHead>
                        <TableHead className="text-right">Net Tax</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taxLiability.map((row) => (
                        <TableRow key={row.state}>
                          <TableCell className="font-medium">
                            {stateData.find(s => s.code === row.state)?.name || row.state}
                          </TableCell>
                          <TableCell className="text-right">{row.miles.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{row.gallons.toFixed(1)}</TableCell>
                          <TableCell className="text-right">${row.taxOwed.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${row.taxPaid.toFixed(2)}</TableCell>
                          <TableCell className={`text-right font-medium ${row.netTax > 0 ? "text-red-600" : "text-green-600"}`}>
                            {row.netTax > 0 ? "-" : "+"}${Math.abs(row.netTax).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Owed: ${totalTaxOwed.toFixed(2)} | Paid: ${totalTaxPaid.toFixed(2)}
                      </p>
                      <p className={`text-lg font-bold ${netTaxDue > 0 ? "text-red-600" : "text-green-600"}`}>
                        Net: {netTaxDue > 0 ? "-" : "+"}${Math.abs(netTaxDue).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info & Past Quarters */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Filing Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div>
                        <p className="font-medium text-amber-800">Q1 2026</p>
                        <p className="text-xs text-amber-600">Due April 30, 2026</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700">102 days</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">Q4 2025</p>
                        <p className="text-xs text-muted-foreground">Due Jan 31, 2026</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Filed
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">Q3 2025</p>
                        <p className="text-xs text-muted-foreground">Due Oct 31, 2025</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Filed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Fleet MPG History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Q1 2026 (Current)</span>
                      <span className="font-medium">{currentMPG.toFixed(2)} MPG</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Q4 2025</span>
                      <span className="font-medium">6.29 MPG</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Q3 2025</span>
                      <span className="font-medium">6.30 MPG</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Q2 2025</span>
                      <span className="font-medium">6.30 MPG</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Trailing 12 Mo Avg</span>
                      <span className="font-bold text-blue-600">6.28 MPG</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Mileage Log Tab */}
          {activeTab === "mileage" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Mileage Log
                    </CardTitle>
                    <CardDescription>
                      Track miles driven by state for accurate IFTA calculations
                    </CardDescription>
                  </div>
                  <Dialog open={addMileageOpen} onOpenChange={setAddMileageOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Mileage
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Mileage Entry</DialogTitle>
                        <DialogDescription>
                          Record miles driven by state for IFTA reporting
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input type="date" defaultValue="2026-01-19" />
                          </div>
                          <div className="space-y-2">
                            <Label>Load ID (Optional)</Label>
                            <Input placeholder="LD-XXXXX" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>State</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {stateData.map((state) => (
                                <SelectItem key={state.code} value={state.code}>
                                  {state.name} ({state.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Start Odometer</Label>
                            <Input type="number" placeholder="145000" />
                          </div>
                          <div className="space-y-2">
                            <Label>End Odometer</Label>
                            <Input type="number" placeholder="145500" />
                          </div>
                          <div className="space-y-2">
                            <Label>Total Miles</Label>
                            <Input type="number" placeholder="500" disabled />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddMileageOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddMileage} className="bg-blue-600 hover:bg-blue-700">Add Entry</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Load ID</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead className="text-right">Start Odo</TableHead>
                      <TableHead className="text-right">End Odo</TableHead>
                      <TableHead className="text-right">Miles</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mileageEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.loadId}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{entry.state}</TableCell>
                        <TableCell className="text-right">{entry.startOdo.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{entry.endOdo.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">{entry.miles}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Fuel Purchases Tab */}
          {activeTab === "fuel" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Fuel className="w-4 h-4" />
                      Fuel Purchases
                    </CardTitle>
                    <CardDescription>
                      Track fuel purchases by state for tax credit calculations
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Receipts
                    </Button>
                    <Dialog open={addFuelOpen} onOpenChange={setAddFuelOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Fuel Purchase
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Fuel Purchase</DialogTitle>
                          <DialogDescription>
                            Record fuel purchases for IFTA tax credits
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Date</Label>
                              <Input type="date" defaultValue="2026-01-19" />
                            </div>
                            <div className="space-y-2">
                              <Label>State</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  {stateData.map((state) => (
                                    <SelectItem key={state.code} value={state.code}>
                                      {state.name} ({state.code})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>City</Label>
                              <Input placeholder="City name" />
                            </div>
                            <div className="space-y-2">
                              <Label>Vendor</Label>
                              <Input placeholder="Truck stop name" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Gallons</Label>
                              <Input type="number" step="0.1" placeholder="125.5" />
                            </div>
                            <div className="space-y-2">
                              <Label>Price/Gallon</Label>
                              <Input type="number" step="0.01" placeholder="3.45" />
                            </div>
                            <div className="space-y-2">
                              <Label>Total</Label>
                              <Input type="number" step="0.01" placeholder="432.98" disabled />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setAddFuelOpen(false)}>Cancel</Button>
                          <Button onClick={handleAddFuel} className="bg-blue-600 hover:bg-blue-700">Add Purchase</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead className="text-right">Gallons</TableHead>
                      <TableHead className="text-right">Price/Gal</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fuelPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{purchase.state}</Badge>
                            <span className="text-sm">{purchase.city}</span>
                          </div>
                        </TableCell>
                        <TableCell>{purchase.vendor}</TableCell>
                        <TableCell className="text-right">{purchase.gallons.toFixed(1)}</TableCell>
                        <TableCell className="text-right">${purchase.pricePerGallon.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${purchase.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
