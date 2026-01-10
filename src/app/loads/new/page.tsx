"use client"

import React, { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Truck, 
  MapPin, 
  DollarSign, 
  FileText, 
  User,
  Calendar,
  Clock,
  Package,
  Building2,
  Phone,
  Mail,
  Weight,
  Thermometer,
  AlertTriangle,
  Save,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Step configuration
const steps = [
  { id: 1, title: 'Pickup', icon: MapPin, description: 'Origin details' },
  { id: 2, title: 'Delivery', icon: MapPin, description: 'Destination details' },
  { id: 3, title: 'Cargo', icon: Package, description: 'Shipment info' },
  { id: 4, title: 'Rate', icon: DollarSign, description: 'Pricing details' },
  { id: 5, title: 'Assignment', icon: User, description: 'Driver & equipment' },
  { id: 6, title: 'Review', icon: FileText, description: 'Confirm details' },
];

// Equipment types
const equipmentTypes = [
  'Dry Van',
  'Reefer',
  'Flatbed',
  'Step Deck',
  'Lowboy',
  'Tanker',
  'Hopper',
  'Intermodal',
  'Box Truck',
  'Conestoga',
];

// Accessorial charges
const accessorials = [
  { id: 'detention', label: 'Detention', rate: 75 },
  { id: 'layover', label: 'Layover', rate: 350 },
  { id: 'lumper', label: 'Lumper', rate: 0 },
  { id: 'tarp', label: 'Tarp Required', rate: 100 },
  { id: 'team', label: 'Team Drivers', rate: 0 },
  { id: 'hazmat', label: 'Hazmat', rate: 250 },
  { id: 'twic', label: 'TWIC Required', rate: 0 },
  { id: 'tanker_endorse', label: 'Tanker Endorsement', rate: 0 },
];

// Mock drivers
const drivers = [
  { id: '1', name: 'Marcus Reed', truck: 'Volvo VNL 860', available: true },
  { id: '2', name: 'Sarah Chen', truck: 'Kenworth T680', available: true },
  { id: '3', name: 'James O\'Connell', truck: 'Freightliner Cascadia', available: false },
  { id: '4', name: 'Emily Watson', truck: 'Peterbilt 579', available: true },
  { id: '5', name: 'David Miller', truck: 'Mack Anthem', available: true },
];

// Mock customers
const customers = [
  { id: '1', name: 'Amazon Logistics', contact: 'John Smith', email: 'dispatch@amazon.com' },
  { id: '2', name: 'Walmart Distribution', contact: 'Mary Johnson', email: 'freight@walmart.com' },
  { id: '3', name: 'Target Stores', contact: 'Bob Wilson', email: 'logistics@target.com' },
  { id: '4', name: 'FedEx Freight', contact: 'Lisa Park', email: 'carrier@fedex.com' },
  { id: '5', name: 'XPO Logistics', contact: 'Mike Chen', email: 'dispatch@xpo.com' },
];

export default function NewLoadPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAccessorials, setSelectedAccessorials] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    // Pickup
    pickupCustomer: '',
    pickupFacility: '',
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupZip: '',
    pickupContact: '',
    pickupPhone: '',
    pickupDate: '',
    pickupTimeStart: '',
    pickupTimeEnd: '',
    pickupInstructions: '',
    pickupRefNumber: '',
    
    // Delivery
    deliveryCustomer: '',
    deliveryFacility: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
    deliveryContact: '',
    deliveryPhone: '',
    deliveryDate: '',
    deliveryTimeStart: '',
    deliveryTimeEnd: '',
    deliveryInstructions: '',
    deliveryRefNumber: '',
    
    // Cargo
    commodity: '',
    weight: '',
    pieces: '',
    pallets: '',
    equipmentType: '',
    tempMin: '',
    tempMax: '',
    hazmat: false,
    hazmatClass: '',
    specialInstructions: '',
    
    // Rate
    linehaul: '',
    fuelSurcharge: '',
    accessorialTotal: 0,
    totalRate: '',
    rpmRate: '',
    miles: '',
    
    // Assignment
    driverId: '',
    priority: 'normal',
  });

  const updateFormData = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAccessorial = (id: string) => {
    setSelectedAccessorials(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your load has been saved as a draft.",
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Load Created",
      description: "Load has been created and is ready for dispatch.",
    });
  };

  const selectedDriver = drivers.find(d => d.id === formData.driverId);
  const selectedPickupCustomer = customers.find(c => c.id === formData.pickupCustomer);
  const selectedDeliveryCustomer = customers.find(c => c.id === formData.deliveryCustomer);

  // Calculate totals
  const accessorialTotal = selectedAccessorials.reduce((sum, id) => {
    const acc = accessorials.find(a => a.id === id);
    return sum + (acc?.rate || 0);
  }, 0);

  const totalRate = (parseFloat(formData.linehaul) || 0) + 
                    (parseFloat(formData.fuelSurcharge) || 0) + 
                    accessorialTotal;

  const rpm = formData.miles ? (totalRate / parseFloat(formData.miles)).toFixed(2) : '0.00';

  return (
    <AppLayout>
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/loads">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-headline text-lg font-bold">Create New Load</h1>
              <p className="text-xs text-muted-foreground">Enter shipment details to create a new load</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </header>

        {/* Step Progress */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={cn(
                      "flex items-center gap-3 transition-all",
                      currentStep >= step.id ? "opacity-100" : "opacity-50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      currentStep > step.id 
                        ? "bg-brand-green-500 text-white" 
                        : currentStep === step.id 
                          ? "bg-brand-blue-500 text-white"
                          : "bg-slate-200 text-slate-500"
                    )}>
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className={cn(
                        "text-sm font-medium",
                        currentStep >= step.id ? "text-slate-900" : "text-slate-500"
                      )}>
                        {step.title}
                      </p>
                      <p className="text-xs text-slate-500">{step.description}</p>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-4",
                      currentStep > step.id ? "bg-brand-green-500" : "bg-slate-200"
                    )} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Step 1: Pickup */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-brand-blue-500" />
                    Pickup Information
                  </CardTitle>
                  <CardDescription>Enter the origin details for this shipment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Customer Selection */}
                  <div className="space-y-2">
                    <Label>Shipper / Customer</Label>
                    <Select value={formData.pickupCustomer} onValueChange={(v) => updateFormData('pickupCustomer', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Facility Name</Label>
                      <Input 
                        placeholder="Distribution Center A" 
                        value={formData.pickupFacility}
                        onChange={(e) => updateFormData('pickupFacility', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reference Number</Label>
                      <Input 
                        placeholder="PO-12345" 
                        value={formData.pickupRefNumber}
                        onChange={(e) => updateFormData('pickupRefNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Street Address</Label>
                    <Input 
                      placeholder="123 Industrial Blvd" 
                      value={formData.pickupAddress}
                      onChange={(e) => updateFormData('pickupAddress', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input 
                        placeholder="Chicago" 
                        value={formData.pickupCity}
                        onChange={(e) => updateFormData('pickupCity', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input 
                        placeholder="IL" 
                        maxLength={2}
                        value={formData.pickupState}
                        onChange={(e) => updateFormData('pickupState', e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ZIP Code</Label>
                      <Input 
                        placeholder="60601" 
                        value={formData.pickupZip}
                        onChange={(e) => updateFormData('pickupZip', e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contact Name</Label>
                      <Input 
                        placeholder="John Smith" 
                        value={formData.pickupContact}
                        onChange={(e) => updateFormData('pickupContact', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input 
                        placeholder="(555) 123-4567" 
                        value={formData.pickupPhone}
                        onChange={(e) => updateFormData('pickupPhone', e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Pickup Date</Label>
                      <Input 
                        type="date" 
                        value={formData.pickupDate}
                        onChange={(e) => updateFormData('pickupDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Window Start</Label>
                      <Input 
                        type="time" 
                        value={formData.pickupTimeStart}
                        onChange={(e) => updateFormData('pickupTimeStart', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Window End</Label>
                      <Input 
                        type="time" 
                        value={formData.pickupTimeEnd}
                        onChange={(e) => updateFormData('pickupTimeEnd', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Pickup Instructions</Label>
                    <Textarea 
                      placeholder="Special instructions for pickup..." 
                      value={formData.pickupInstructions}
                      onChange={(e) => updateFormData('pickupInstructions', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Delivery */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-brand-green-500" />
                    Delivery Information
                  </CardTitle>
                  <CardDescription>Enter the destination details for this shipment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Consignee / Receiver</Label>
                    <Select value={formData.deliveryCustomer} onValueChange={(v) => updateFormData('deliveryCustomer', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Facility Name</Label>
                      <Input 
                        placeholder="Receiving Dock B" 
                        value={formData.deliveryFacility}
                        onChange={(e) => updateFormData('deliveryFacility', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reference Number</Label>
                      <Input 
                        placeholder="DEL-67890" 
                        value={formData.deliveryRefNumber}
                        onChange={(e) => updateFormData('deliveryRefNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Street Address</Label>
                    <Input 
                      placeholder="456 Commerce Way" 
                      value={formData.deliveryAddress}
                      onChange={(e) => updateFormData('deliveryAddress', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input 
                        placeholder="Denver" 
                        value={formData.deliveryCity}
                        onChange={(e) => updateFormData('deliveryCity', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input 
                        placeholder="CO" 
                        maxLength={2}
                        value={formData.deliveryState}
                        onChange={(e) => updateFormData('deliveryState', e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ZIP Code</Label>
                      <Input 
                        placeholder="80201" 
                        value={formData.deliveryZip}
                        onChange={(e) => updateFormData('deliveryZip', e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contact Name</Label>
                      <Input 
                        placeholder="Jane Doe" 
                        value={formData.deliveryContact}
                        onChange={(e) => updateFormData('deliveryContact', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input 
                        placeholder="(555) 987-6543" 
                        value={formData.deliveryPhone}
                        onChange={(e) => updateFormData('deliveryPhone', e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Delivery Date</Label>
                      <Input 
                        type="date" 
                        value={formData.deliveryDate}
                        onChange={(e) => updateFormData('deliveryDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Window Start</Label>
                      <Input 
                        type="time" 
                        value={formData.deliveryTimeStart}
                        onChange={(e) => updateFormData('deliveryTimeStart', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Window End</Label>
                      <Input 
                        type="time" 
                        value={formData.deliveryTimeEnd}
                        onChange={(e) => updateFormData('deliveryTimeEnd', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Instructions</Label>
                    <Textarea 
                      placeholder="Special instructions for delivery..." 
                      value={formData.deliveryInstructions}
                      onChange={(e) => updateFormData('deliveryInstructions', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Cargo */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-brand-blue-500" />
                    Cargo Information
                  </CardTitle>
                  <CardDescription>Describe the freight being transported</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Commodity</Label>
                      <Input 
                        placeholder="General Freight, Electronics, etc." 
                        value={formData.commodity}
                        onChange={(e) => updateFormData('commodity', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Equipment Type</Label>
                      <Select value={formData.equipmentType} onValueChange={(v) => updateFormData('equipmentType', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Weight className="h-4 w-4" />
                        Weight (lbs)
                      </Label>
                      <Input 
                        type="number" 
                        placeholder="42,000" 
                        value={formData.weight}
                        onChange={(e) => updateFormData('weight', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pieces</Label>
                      <Input 
                        type="number" 
                        placeholder="1" 
                        value={formData.pieces}
                        onChange={(e) => updateFormData('pieces', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pallets</Label>
                      <Input 
                        type="number" 
                        placeholder="24" 
                        value={formData.pallets}
                        onChange={(e) => updateFormData('pallets', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Temperature Requirements (for Reefer) */}
                  {formData.equipmentType === 'Reefer' && (
                    <>
                      <Separator />
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 flex items-center gap-2 mb-4">
                          <Thermometer className="h-4 w-4" />
                          Temperature Requirements
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Min Temp (°F)</Label>
                            <Input 
                              type="number" 
                              placeholder="34" 
                              value={formData.tempMin}
                              onChange={(e) => updateFormData('tempMin', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Max Temp (°F)</Label>
                            <Input 
                              type="number" 
                              placeholder="38" 
                              value={formData.tempMax}
                              onChange={(e) => updateFormData('tempMax', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Hazmat */}
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="hazmat"
                      checked={formData.hazmat}
                      onCheckedChange={(checked) => updateFormData('hazmat', !!checked)}
                    />
                    <Label htmlFor="hazmat" className="flex items-center gap-2 cursor-pointer">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      This shipment contains hazardous materials
                    </Label>
                  </div>

                  {formData.hazmat && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="space-y-2">
                        <Label>Hazmat Class</Label>
                        <Select value={formData.hazmatClass} onValueChange={(v) => updateFormData('hazmatClass', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hazmat class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Class 1 - Explosives</SelectItem>
                            <SelectItem value="2">Class 2 - Gases</SelectItem>
                            <SelectItem value="3">Class 3 - Flammable Liquids</SelectItem>
                            <SelectItem value="4">Class 4 - Flammable Solids</SelectItem>
                            <SelectItem value="5">Class 5 - Oxidizers</SelectItem>
                            <SelectItem value="6">Class 6 - Toxic</SelectItem>
                            <SelectItem value="7">Class 7 - Radioactive</SelectItem>
                            <SelectItem value="8">Class 8 - Corrosive</SelectItem>
                            <SelectItem value="9">Class 9 - Misc Dangerous</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Special Instructions</Label>
                    <Textarea 
                      placeholder="Any special handling requirements..." 
                      value={formData.specialInstructions}
                      onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Rate */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-brand-green-500" />
                    Rate & Charges
                  </CardTitle>
                  <CardDescription>Configure pricing for this load</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Miles</Label>
                        <Input 
                          type="number" 
                          placeholder="1,004" 
                          value={formData.miles}
                          onChange={(e) => updateFormData('miles', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Linehaul Rate ($)</Label>
                        <Input 
                          type="number" 
                          placeholder="4,200.00" 
                          value={formData.linehaul}
                          onChange={(e) => updateFormData('linehaul', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fuel Surcharge ($)</Label>
                        <Input 
                          type="number" 
                          placeholder="300.00" 
                          value={formData.fuelSurcharge}
                          onChange={(e) => updateFormData('fuelSurcharge', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-900 mb-4">Rate Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Linehaul</span>
                          <span>${(parseFloat(formData.linehaul) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Fuel Surcharge</span>
                          <span>${(parseFloat(formData.fuelSurcharge) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Accessorials</span>
                          <span>${accessorialTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold text-base">
                          <span>Total Rate</span>
                          <span className="text-brand-green-600">${totalRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                          <span>Rate per Mile</span>
                          <span>${rpm}/mi</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="mb-3 block">Accessorial Charges</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {accessorials.map((acc) => (
                        <div
                          key={acc.id}
                          onClick={() => toggleAccessorial(acc.id)}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer transition-all",
                            selectedAccessorials.includes(acc.id)
                              ? "border-brand-blue-500 bg-brand-blue-50"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              checked={selectedAccessorials.includes(acc.id)}
                              onCheckedChange={() => toggleAccessorial(acc.id)}
                            />
                            <span className="text-sm font-medium">{acc.label}</span>
                          </div>
                          {acc.rate > 0 && (
                            <p className="text-xs text-slate-500 mt-1 ml-6">+${acc.rate}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Assignment */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-brand-blue-500" />
                    Driver & Equipment Assignment
                  </CardTitle>
                  <CardDescription>Assign a driver and set priority</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Priority Level</Label>
                    <Select value={formData.priority} onValueChange={(v) => updateFormData('priority', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div>
                    <Label className="mb-3 block">Available Drivers</Label>
                    <div className="grid gap-3">
                      {drivers.map((driver) => (
                        <div
                          key={driver.id}
                          onClick={() => driver.available && updateFormData('driverId', driver.id)}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-4",
                            !driver.available && "opacity-50 cursor-not-allowed",
                            formData.driverId === driver.id
                              ? "border-brand-blue-500 bg-brand-blue-50"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            driver.available ? "bg-brand-green-100" : "bg-slate-100"
                          )}>
                            <User className={cn(
                              "h-5 w-5",
                              driver.available ? "text-brand-green-600" : "text-slate-400"
                            )} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-sm text-slate-500">{driver.truck}</p>
                          </div>
                          <Badge variant={driver.available ? "available" : "secondary"}>
                            {driver.available ? "Available" : "On Load"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    💡 Tip: You can also leave the driver unassigned and dispatch later from the board.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Review */}
            {currentStep === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-brand-blue-500" />
                    Review & Submit
                  </CardTitle>
                  <CardDescription>Review all details before creating the load</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Pickup Summary */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-900 flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-brand-blue-500" />
                        Pickup
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">{selectedPickupCustomer?.name || 'Not specified'}</p>
                        <p className="text-slate-600">{formData.pickupFacility || 'No facility'}</p>
                        <p className="text-slate-500">
                          {formData.pickupCity && formData.pickupState 
                            ? `${formData.pickupCity}, ${formData.pickupState} ${formData.pickupZip}`
                            : 'No address'}
                        </p>
                        <p className="text-slate-500">
                          {formData.pickupDate || 'No date'} • {formData.pickupTimeStart || '—'} - {formData.pickupTimeEnd || '—'}
                        </p>
                      </div>
                    </div>

                    {/* Delivery Summary */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-900 flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-brand-green-500" />
                        Delivery
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">{selectedDeliveryCustomer?.name || 'Not specified'}</p>
                        <p className="text-slate-600">{formData.deliveryFacility || 'No facility'}</p>
                        <p className="text-slate-500">
                          {formData.deliveryCity && formData.deliveryState 
                            ? `${formData.deliveryCity}, ${formData.deliveryState} ${formData.deliveryZip}`
                            : 'No address'}
                        </p>
                        <p className="text-slate-500">
                          {formData.deliveryDate || 'No date'} • {formData.deliveryTimeStart || '—'} - {formData.deliveryTimeEnd || '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cargo & Rate Summary */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-900 flex items-center gap-2 mb-3">
                        <Package className="h-4 w-4" />
                        Cargo
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-slate-500">Commodity:</span> {formData.commodity || 'Not specified'}</p>
                        <p><span className="text-slate-500">Equipment:</span> {formData.equipmentType || 'Not specified'}</p>
                        <p><span className="text-slate-500">Weight:</span> {formData.weight ? `${formData.weight} lbs` : 'Not specified'}</p>
                        <p><span className="text-slate-500">Pallets:</span> {formData.pallets || 'N/A'}</p>
                        {formData.hazmat && <Badge variant="destructive" className="mt-2">HAZMAT</Badge>}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-900 flex items-center gap-2 mb-3">
                        <DollarSign className="h-4 w-4" />
                        Rate
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-slate-500">Miles:</span> {formData.miles || '—'}</p>
                        <p><span className="text-slate-500">Linehaul:</span> ${formData.linehaul || '0.00'}</p>
                        <p><span className="text-slate-500">Fuel:</span> ${formData.fuelSurcharge || '0.00'}</p>
                        <p><span className="text-slate-500">Accessorials:</span> ${accessorialTotal.toFixed(2)}</p>
                        <p className="font-bold text-brand-green-600 text-base mt-2">
                          Total: ${totalRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Driver Assignment */}
                  {selectedDriver && (
                    <div className="p-4 bg-brand-blue-50 rounded-lg border border-brand-blue-200">
                      <h4 className="font-medium text-slate-900 flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        Assigned Driver
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-brand-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedDriver.name}</p>
                          <p className="text-sm text-slate-500">{selectedDriver.truck}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Priority Badge */}
                  {formData.priority === 'high' && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">This load is marked as HIGH PRIORITY</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 6 ? (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-brand-green-500 hover:bg-brand-green-600">
                  <Send className="h-4 w-4 mr-2" />
                  Create Load
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
