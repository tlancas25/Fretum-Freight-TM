"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Download,
  Printer,
  Send,
  Save,
  Eye,
  History,
  Copy,
  Truck,
  Package,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Hash,
  Scale,
  Box,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2,
  FileSignature,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Settings,
  Plus,
  Trash2,
  GripVertical,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Sample loads for selection
const sampleLoads = [
  { id: "LD-2026-001", customer: "ABC Logistics", origin: "Los Angeles, CA", destination: "Phoenix, AZ", commodity: "Electronics" },
  { id: "LD-2026-002", customer: "XYZ Shipping", origin: "Seattle, WA", destination: "Portland, OR", commodity: "Auto Parts" },
  { id: "LD-2026-003", customer: "Global Transport", origin: "Houston, TX", destination: "Dallas, TX", commodity: "Industrial Equipment" },
  { id: "LD-2026-004", customer: "Fast Freight Inc", origin: "Chicago, IL", destination: "Detroit, MI", commodity: "Consumer Goods" },
  { id: "LD-2026-005", customer: "Prime Carriers", origin: "Miami, FL", destination: "Atlanta, GA", commodity: "Food Products" },
];

// BOL templates
const templates = [
  { id: "standard", name: "Standard BOL", description: "Classic bill of lading format" },
  { id: "short", name: "Short Form BOL", description: "Simplified single-page format" },
  { id: "hazmat", name: "Hazmat BOL", description: "Includes hazardous materials sections" },
  { id: "straight", name: "Straight BOL", description: "Non-negotiable straight consignment" },
  { id: "order", name: "Order BOL", description: "Negotiable order bill of lading" },
];

// Recent BOLs
const recentBOLs = [
  { id: "BOL-2026-0847", load: "LD-2026-001", customer: "ABC Logistics", createdAt: "2026-01-09", status: "sent" },
  { id: "BOL-2026-0846", load: "LD-2026-002", customer: "XYZ Shipping", createdAt: "2026-01-08", status: "signed" },
  { id: "BOL-2026-0845", load: "LD-2026-003", customer: "Global Transport", createdAt: "2026-01-08", status: "draft" },
  { id: "BOL-2026-0844", load: "LD-2026-004", customer: "Fast Freight Inc", createdAt: "2026-01-07", status: "signed" },
  { id: "BOL-2026-0843", load: "LD-2026-005", customer: "Prime Carriers", createdAt: "2026-01-06", status: "sent" },
];

// Status badge
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "signed":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Signed
        </Badge>
      );
    case "sent":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <Send className="w-3 h-3 mr-1" />
          Sent
        </Badge>
      );
    case "draft":
      return (
        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
          <FileText className="w-3 h-3 mr-1" />
          Draft
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function BOLGeneratorPage() {
  const { toast } = useToast();
  const [selectedLoad, setSelectedLoad] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const [previewOpen, setPreviewOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    bolNumber: "BOL-2026-0848",
    shipperName: "",
    shipperAddress: "",
    shipperCity: "",
    shipperState: "",
    shipperZip: "",
    shipperPhone: "",
    consigneeName: "",
    consigneeAddress: "",
    consigneeCity: "",
    consigneeState: "",
    consigneeZip: "",
    consigneePhone: "",
    carrierName: "FocusFreight TMS",
    carrierMC: "MC-123456",
    driverName: "",
    truckNumber: "",
    trailerNumber: "",
    sealNumber: "",
    pickupDate: "",
    deliveryDate: "",
    specialInstructions: "",
  });

  // Cargo items
  const [cargoItems, setCargoItems] = useState([
    { id: 1, description: "", quantity: "", weight: "", class: "", nmfc: "", hazmat: false },
  ]);

  const handleLoadSelect = (loadId: string) => {
    setSelectedLoad(loadId);
    const load = sampleLoads.find((l) => l.id === loadId);
    if (load) {
      // Auto-fill some fields based on load
      setFormData((prev) => ({
        ...prev,
        shipperCity: load.origin.split(", ")[0],
        shipperState: load.origin.split(", ")[1],
        consigneeCity: load.destination.split(", ")[0],
        consigneeState: load.destination.split(", ")[1],
      }));
      setCargoItems([
        { id: 1, description: load.commodity, quantity: "1", weight: "", class: "", nmfc: "", hazmat: false },
      ]);
      toast({
        title: "Load Selected",
        description: `Auto-filled information from ${loadId}`,
      });
    }
  };

  const addCargoItem = () => {
    setCargoItems([
      ...cargoItems,
      { id: cargoItems.length + 1, description: "", quantity: "", weight: "", class: "", nmfc: "", hazmat: false },
    ]);
  };

  const removeCargoItem = (id: number) => {
    if (cargoItems.length > 1) {
      setCargoItems(cargoItems.filter((item) => item.id !== id));
    }
  };

  const handleGenerateBOL = () => {
    setPreviewOpen(true);
    toast({
      title: "BOL Generated",
      description: "Your Bill of Lading has been generated successfully.",
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Downloading PDF",
      description: "Your BOL is being downloaded as PDF...",
    });
  };

  const handleSendBOL = () => {
    toast({
      title: "BOL Sent",
      description: "Bill of Lading has been sent to all parties.",
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-brand-600" />
                BOL Generator
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Create professional Bills of Lading with auto-fill capabilities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Templates
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">847</p>
                  <p className="text-xs text-muted-foreground">Total BOLs</p>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">523</p>
                  <p className="text-xs text-muted-foreground">Signed</p>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">156</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Main Form - 2 columns */}
            <div className="col-span-2 space-y-4">
              {/* Load Selection & Template */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-600" />
                    Quick Start
                  </CardTitle>
                  <CardDescription>Select a load to auto-fill BOL information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Select Load</Label>
                      <Select value={selectedLoad} onValueChange={handleLoadSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a load to auto-fill..." />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleLoads.map((load) => (
                            <SelectItem key={load.id} value={load.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{load.id}</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground text-sm">{load.customer}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>BOL Template</Label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{template.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">BOL Number:</span>
                    <span className="font-mono font-medium">{formData.bolNumber}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Shipper & Consignee */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-green-600" />
                      Shipper (From)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Company Name</Label>
                      <Input
                        placeholder="Shipper company name"
                        value={formData.shipperName}
                        onChange={(e) => setFormData({ ...formData, shipperName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Address</Label>
                      <Input
                        placeholder="Street address"
                        value={formData.shipperAddress}
                        onChange={(e) => setFormData({ ...formData, shipperAddress: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs">City</Label>
                        <Input
                          placeholder="City"
                          value={formData.shipperCity}
                          onChange={(e) => setFormData({ ...formData, shipperCity: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">State</Label>
                        <Input
                          placeholder="ST"
                          value={formData.shipperState}
                          onChange={(e) => setFormData({ ...formData, shipperState: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">ZIP</Label>
                        <Input
                          placeholder="ZIP"
                          value={formData.shipperZip}
                          onChange={(e) => setFormData({ ...formData, shipperZip: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Phone</Label>
                      <Input
                        placeholder="(555) 123-4567"
                        value={formData.shipperPhone}
                        onChange={(e) => setFormData({ ...formData, shipperPhone: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      Consignee (To)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Company Name</Label>
                      <Input
                        placeholder="Consignee company name"
                        value={formData.consigneeName}
                        onChange={(e) => setFormData({ ...formData, consigneeName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Address</Label>
                      <Input
                        placeholder="Street address"
                        value={formData.consigneeAddress}
                        onChange={(e) => setFormData({ ...formData, consigneeAddress: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs">City</Label>
                        <Input
                          placeholder="City"
                          value={formData.consigneeCity}
                          onChange={(e) => setFormData({ ...formData, consigneeCity: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">State</Label>
                        <Input
                          placeholder="ST"
                          value={formData.consigneeState}
                          onChange={(e) => setFormData({ ...formData, consigneeState: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">ZIP</Label>
                        <Input
                          placeholder="ZIP"
                          value={formData.consigneeZip}
                          onChange={(e) => setFormData({ ...formData, consigneeZip: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Phone</Label>
                      <Input
                        placeholder="(555) 123-4567"
                        value={formData.consigneePhone}
                        onChange={(e) => setFormData({ ...formData, consigneePhone: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Carrier & Driver */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-600" />
                    Carrier & Equipment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Carrier Name</Label>
                      <Input value={formData.carrierName} disabled className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">MC Number</Label>
                      <Input value={formData.carrierMC} disabled className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Driver Name</Label>
                      <Input
                        placeholder="Driver name"
                        value={formData.driverName}
                        onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Seal Number</Label>
                      <Input
                        placeholder="Seal #"
                        value={formData.sealNumber}
                        onChange={(e) => setFormData({ ...formData, sealNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Truck Number</Label>
                      <Input
                        placeholder="Truck #"
                        value={formData.truckNumber}
                        onChange={(e) => setFormData({ ...formData, truckNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Trailer Number</Label>
                      <Input
                        placeholder="Trailer #"
                        value={formData.trailerNumber}
                        onChange={(e) => setFormData({ ...formData, trailerNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Pickup Date</Label>
                      <Input
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Delivery Date</Label>
                      <Input
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cargo Items */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Package className="w-4 h-4 text-purple-600" />
                        Cargo Description
                      </CardTitle>
                      <CardDescription>Add all items being shipped</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={addCargoItem}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-2">
                      <div className="col-span-4">Description</div>
                      <div className="col-span-1">Qty</div>
                      <div className="col-span-2">Weight (lbs)</div>
                      <div className="col-span-1">Class</div>
                      <div className="col-span-2">NMFC</div>
                      <div className="col-span-1">Hazmat</div>
                      <div className="col-span-1"></div>
                    </div>

                    {/* Items */}
                    {cargoItems.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4">
                          <Input
                            placeholder="Commodity description"
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...cargoItems];
                              updated[index].description = e.target.value;
                              setCargoItems(updated);
                            }}
                          />
                        </div>
                        <div className="col-span-1">
                          <Input
                            placeholder="0"
                            value={item.quantity}
                            onChange={(e) => {
                              const updated = [...cargoItems];
                              updated[index].quantity = e.target.value;
                              setCargoItems(updated);
                            }}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder="0"
                            value={item.weight}
                            onChange={(e) => {
                              const updated = [...cargoItems];
                              updated[index].weight = e.target.value;
                              setCargoItems(updated);
                            }}
                          />
                        </div>
                        <div className="col-span-1">
                          <Input
                            placeholder="55"
                            value={item.class}
                            onChange={(e) => {
                              const updated = [...cargoItems];
                              updated[index].class = e.target.value;
                              setCargoItems(updated);
                            }}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder="NMFC#"
                            value={item.nmfc}
                            onChange={(e) => {
                              const updated = [...cargoItems];
                              updated[index].nmfc = e.target.value;
                              setCargoItems(updated);
                            }}
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <Checkbox
                            checked={item.hazmat}
                            onCheckedChange={(checked) => {
                              const updated = [...cargoItems];
                              updated[index].hazmat = checked as boolean;
                              setCargoItems(updated);
                            }}
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-600"
                            onClick={() => removeCargoItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Special Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter any special handling instructions, delivery notes, or additional comments..."
                    rows={3}
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button variant="outline" onClick={() => setPreviewOpen(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleGenerateBOL}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate BOL
                </Button>
              </div>
            </div>

            {/* Sidebar - Recent BOLs */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-600" />
                    Recent BOLs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recentBOLs.map((bol) => (
                    <div
                      key={bol.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">{bol.id}</span>
                          <StatusBadge status={bol.status} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {bol.customer} • {bol.load}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Send className="w-4 h-4 mr-2" />
                            Resend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Blank BOL Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate Last BOL
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Printer className="w-4 h-4 mr-2" />
                    Bulk Print Queue
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileSignature className="w-4 h-4 mr-2" />
                    E-Signature Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Templates */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Available Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                        selectedTemplate === template.id
                          ? "border-brand-600 bg-brand-50"
                          : "border-transparent hover:bg-slate-50"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className={`w-4 h-4 ${selectedTemplate === template.id ? "text-brand-600" : "text-slate-400"}`} />
                        <span className="text-sm font-medium">{template.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 ml-6">{template.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>BOL Preview - {formData.bolNumber}</DialogTitle>
            <DialogDescription>Review your Bill of Lading before generating</DialogDescription>
          </DialogHeader>

          <div className="border rounded-lg p-6 bg-white space-y-6">
            {/* BOL Header */}
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold">STRAIGHT BILL OF LADING</h2>
              <p className="text-lg font-mono mt-2">{formData.bolNumber}</p>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-green-700">SHIPPER (FROM)</h3>
                <div className="text-sm">
                  <p className="font-medium">{formData.shipperName || "—"}</p>
                  <p>{formData.shipperAddress || "—"}</p>
                  <p>
                    {formData.shipperCity || "—"}, {formData.shipperState || "—"} {formData.shipperZip || "—"}
                  </p>
                  <p>{formData.shipperPhone || "—"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-red-700">CONSIGNEE (TO)</h3>
                <div className="text-sm">
                  <p className="font-medium">{formData.consigneeName || "—"}</p>
                  <p>{formData.consigneeAddress || "—"}</p>
                  <p>
                    {formData.consigneeCity || "—"}, {formData.consigneeState || "—"} {formData.consigneeZip || "—"}
                  </p>
                  <p>{formData.consigneePhone || "—"}</p>
                </div>
              </div>
            </div>

            {/* Carrier Info */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">CARRIER INFORMATION</h3>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Carrier</p>
                  <p className="font-medium">{formData.carrierName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">MC#</p>
                  <p className="font-medium">{formData.carrierMC}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Driver</p>
                  <p className="font-medium">{formData.driverName || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Seal#</p>
                  <p className="font-medium">{formData.sealNumber || "—"}</p>
                </div>
              </div>
            </div>

            {/* Cargo */}
            <div>
              <h3 className="font-semibold mb-2">CARGO DESCRIPTION</h3>
              <table className="w-full text-sm border">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-center">Qty</th>
                    <th className="border p-2 text-center">Weight</th>
                    <th className="border p-2 text-center">Class</th>
                    <th className="border p-2 text-center">Hazmat</th>
                  </tr>
                </thead>
                <tbody>
                  {cargoItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border p-2">{item.description || "—"}</td>
                      <td className="border p-2 text-center">{item.quantity || "—"}</td>
                      <td className="border p-2 text-center">{item.weight || "—"}</td>
                      <td className="border p-2 text-center">{item.class || "—"}</td>
                      <td className="border p-2 text-center">{item.hazmat ? "YES" : "NO"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground mb-8">Shipper Signature</p>
                <div className="border-t border-black pt-2">
                  <p className="text-xs text-muted-foreground">Date: ______________</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-8">Driver Signature</p>
                <div className="border-t border-black pt-2">
                  <p className="text-xs text-muted-foreground">Date: ______________</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Edit
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSendBOL}>
              <Send className="w-4 h-4 mr-2" />
              Send BOL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
