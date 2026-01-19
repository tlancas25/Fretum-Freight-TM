"use client"

import React, { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { 
  ArrowLeft, 
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
  Download,
  Upload,
  MessageSquare,
  Edit,
  Copy,
  Printer,
  Share2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Navigation,
  Thermometer,
  Gauge,
  MoreHorizontal,
  ExternalLink,
  Send,
  Map
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadRouteMap } from '@/lib/maps';

// Mock load data
const loadData = {
  id: 'LD-98821',
  status: 'in-transit',
  priority: 'normal',
  createdAt: '2026-01-08T10:30:00Z',
  
  // Pickup
  pickup: {
    customer: 'Amazon Logistics',
    facility: 'Port Authority E-2',
    address: '123 Port Street',
    city: 'Newark',
    state: 'NJ',
    zip: '07102',
    lat: 40.7357,
    lng: -74.1724,
    contact: 'John Smith',
    phone: '(973) 555-1234',
    email: 'dispatch@amazon.com',
    date: '2026-01-08',
    timeWindow: '08:00 - 10:00',
    actualTime: '09:12 AM',
    reference: 'PO-45678',
    instructions: 'Check in at guard shack. Dock assignment at window.',
  },
  
  // Delivery
  delivery: {
    customer: 'Target Distribution',
    facility: 'Queen City Terminal',
    address: '456 Distribution Way',
    city: 'Charlotte',
    state: 'NC',
    zip: '28202',
    lat: 35.2271,
    lng: -80.8431,
    contact: 'Mary Johnson',
    phone: '(704) 555-9876',
    email: 'receiving@target.com',
    date: '2026-01-09',
    timeWindow: '14:00 - 16:00',
    eta: '14:20',
    reference: 'DEL-99012',
    instructions: 'Receiving dock 7. Must have lumper receipt.',
  },

  // Current truck location (for in-transit loads)
  truckLocation: {
    lat: 35.7596,
    lng: -79.0193,
    heading: 225, // Heading southwest towards Charlotte
  },
  
  // Cargo
  cargo: {
    commodity: 'Consumer Electronics',
    equipment: 'Dry Van',
    weight: 38500,
    pieces: 1,
    pallets: 22,
    hazmat: false,
  },
  
  // Rate
  rate: {
    miles: 630,
    linehaul: 2500,
    fuelSurcharge: 200,
    detention: 0,
    accessorials: 100,
    total: 2800,
  },
  
  // Driver
  driver: {
    id: '1',
    name: "James O'Connell",
    phone: '(555) 123-7890',
    email: 'james.oconnell@focusfreight.com',
    truck: 'Volvo VNL 760',
    trailer: 'TRL-4521',
    dotNumber: '3142951',
    avatar: null,
  },
  
  // Tracking
  tracking: {
    lastUpdate: '2026-01-09T11:45:00Z',
    location: 'I-77 South, near Statesville, NC',
    speed: '62 mph',
    temp: null,
    milesRemaining: 42,
    etaMinutes: 155,
  },
  
  // Documents
  documents: [
    { id: '1', name: 'Rate Confirmation.pdf', type: 'rate_con', uploadedAt: '2026-01-08T08:00:00Z', size: '245 KB' },
    { id: '2', name: 'BOL-LD98821.pdf', type: 'bol', uploadedAt: '2026-01-08T10:15:00Z', size: '189 KB' },
    { id: '3', name: 'Pickup_Photo_1.jpg', type: 'photo', uploadedAt: '2026-01-08T09:30:00Z', size: '1.2 MB' },
  ],
  
  // Timeline
  timeline: [
    { id: '1', event: 'Load Created', time: '2026-01-08T08:00:00Z', user: 'System', status: 'completed' },
    { id: '2', event: 'Driver Assigned', time: '2026-01-08T08:30:00Z', user: 'Sarah Dispatcher', status: 'completed' },
    { id: '3', event: 'Rate Confirmation Sent', time: '2026-01-08T08:35:00Z', user: 'System', status: 'completed' },
    { id: '4', event: 'Driver En Route to Pickup', time: '2026-01-08T07:00:00Z', user: 'Driver App', status: 'completed' },
    { id: '5', event: 'Arrived at Pickup', time: '2026-01-08T08:45:00Z', user: 'Driver App', status: 'completed' },
    { id: '6', event: 'Loading Complete', time: '2026-01-08T10:12:00Z', user: 'Driver App', status: 'completed' },
    { id: '7', event: 'In Transit', time: '2026-01-08T10:15:00Z', user: 'System', status: 'completed' },
    { id: '8', event: 'Delivery', time: '2026-01-09T14:20:00Z', user: 'ETA', status: 'pending' },
  ],
  
  // Notes
  notes: [
    { id: '1', text: 'Customer confirmed appointment for delivery window.', user: 'Sarah Dispatcher', time: '2026-01-08T09:00:00Z' },
    { id: '2', text: 'Driver reports slight traffic delay on I-95, adjusted ETA by 15 minutes.', user: 'James O\'Connell', time: '2026-01-08T12:30:00Z' },
  ],
};

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "booked" | "inTransit" | "delivered" }> = {
    'booked': { label: 'Booked', variant: 'booked' },
    'dispatched': { label: 'Dispatched', variant: 'secondary' },
    'in-transit': { label: 'In Transit', variant: 'inTransit' },
    'delivered': { label: 'Delivered', variant: 'delivered' },
  };
  
  const { label, variant } = config[status] || { label: status, variant: 'default' as const };
  return <Badge variant={variant} className="text-xs">{label}</Badge>;
}

function TimelineItem({ event, isLast, status }: { event: typeof loadData.timeline[0]; isLast: boolean; status: string }) {
  const isPending = status === 'pending';
  
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          isPending 
            ? "bg-slate-100 border-2 border-dashed border-slate-300" 
            : "bg-brand-green-100"
        )}>
          {isPending ? (
            <Circle className="h-4 w-4 text-slate-400" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-brand-green-600" />
          )}
        </div>
        {!isLast && <div className={cn("w-0.5 flex-1 my-1", isPending ? "bg-slate-200" : "bg-brand-green-200")} />}
      </div>
      <div className="pb-6">
        <p className={cn("font-medium text-sm", isPending && "text-slate-400")}>{event.event}</p>
        <p className="text-xs text-slate-500">
          {new Date(event.time).toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit' 
          })} • {event.user}
        </p>
      </div>
    </div>
  );
}

export default function LoadDetailsPage() {
  const [newNote, setNewNote] = useState('');
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Would add note to state/API
      setNewNote('');
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/loads">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-headline text-xl font-bold">Load #{loadData.id}</h1>
                  <StatusBadge status={loadData.status} />
                  {loadData.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs">HIGH PRIORITY</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {loadData.pickup.city}, {loadData.pickup.state} → {loadData.delivery.city}, {loadData.delivery.state}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Load
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Tracking Card */}
              {loadData.status === 'in-transit' && (
                <Card className="border-brand-blue-200 bg-gradient-to-br from-brand-blue-50 to-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Navigation className="h-5 w-5 text-brand-blue-500" />
                      Live Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{loadData.tracking.location}</p>
                        <p className="text-xs text-slate-500">
                          Last updated {new Date(loadData.tracking.lastUpdate).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-brand-blue-600">{loadData.tracking.milesRemaining}</p>
                          <p className="text-xs text-slate-500">miles left</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-brand-green-600">{loadData.delivery.eta}</p>
                          <p className="text-xs text-slate-500">ETA</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <Gauge className="h-4 w-4 text-slate-400" />
                            <p className="text-lg font-semibold">{loadData.tracking.speed}</p>
                          </div>
                          <p className="text-xs text-slate-500">current speed</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in Maps
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Driver
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Route Map */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Map className="h-5 w-5 text-slate-500" />
                    Route Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <LoadRouteMap
                    // apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    pickup={{
                      lat: loadData.pickup.lat,
                      lng: loadData.pickup.lng,
                      address: loadData.pickup.address,
                      city: loadData.pickup.city,
                      state: loadData.pickup.state,
                    }}
                    delivery={{
                      lat: loadData.delivery.lat,
                      lng: loadData.delivery.lng,
                      address: loadData.delivery.address,
                      city: loadData.delivery.city,
                      state: loadData.delivery.state,
                    }}
                    currentLocation={loadData.status === 'in-transit' ? loadData.truckLocation : undefined}
                    height="350px"
                    className="rounded-b-lg"
                  />
                </CardContent>
              </Card>

              {/* Route Details */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Pickup */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-6 h-6 rounded-full bg-brand-blue-100 flex items-center justify-center">
                        <MapPin className="h-3.5 w-3.5 text-brand-blue-600" />
                      </div>
                      Pickup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold">{loadData.pickup.customer}</p>
                      <p className="text-sm text-slate-600">{loadData.pickup.facility}</p>
                      <p className="text-sm text-slate-500">
                        {loadData.pickup.address}<br />
                        {loadData.pickup.city}, {loadData.pickup.state} {loadData.pickup.zip}
                      </p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Date</p>
                        <p className="font-medium">{loadData.pickup.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Window</p>
                        <p className="font-medium">{loadData.pickup.timeWindow}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Actual Time</p>
                        <p className="font-medium text-brand-green-600">{loadData.pickup.actualTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Reference</p>
                        <p className="font-medium">{loadData.pickup.reference}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">Contact</p>
                        <p className="text-sm font-medium">{loadData.pickup.contact}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-6 h-6 rounded-full bg-brand-green-100 flex items-center justify-center">
                        <MapPin className="h-3.5 w-3.5 text-brand-green-600" />
                      </div>
                      Delivery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold">{loadData.delivery.customer}</p>
                      <p className="text-sm text-slate-600">{loadData.delivery.facility}</p>
                      <p className="text-sm text-slate-500">
                        {loadData.delivery.address}<br />
                        {loadData.delivery.city}, {loadData.delivery.state} {loadData.delivery.zip}
                      </p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Date</p>
                        <p className="font-medium">{loadData.delivery.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Window</p>
                        <p className="font-medium">{loadData.delivery.timeWindow}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">ETA</p>
                        <p className="font-medium text-brand-blue-600">{loadData.delivery.eta}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Reference</p>
                        <p className="font-medium">{loadData.delivery.reference}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">Contact</p>
                        <p className="text-sm font-medium">{loadData.delivery.contact}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs: Cargo, Rate, Documents */}
              <Tabs defaultValue="cargo" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="cargo">Cargo Details</TabsTrigger>
                  <TabsTrigger value="rate">Rate & Charges</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="cargo" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Commodity</p>
                          <p className="font-medium mt-1">{loadData.cargo.commodity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Equipment</p>
                          <p className="font-medium mt-1">{loadData.cargo.equipment}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Weight</p>
                          <p className="font-medium mt-1">{loadData.cargo.weight.toLocaleString()} lbs</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Pallets</p>
                          <p className="font-medium mt-1">{loadData.cargo.pallets}</p>
                        </div>
                      </div>
                      {loadData.cargo.hazmat && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">HAZMAT Load - Special handling required</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="rate" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="max-w-md space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Miles</span>
                          <span className="font-medium">{loadData.rate.miles}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Linehaul</span>
                          <span className="font-medium">{formatCurrency(loadData.rate.linehaul)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Fuel Surcharge</span>
                          <span className="font-medium">{formatCurrency(loadData.rate.fuelSurcharge)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Accessorials</span>
                          <span className="font-medium">{formatCurrency(loadData.rate.accessorials)}</span>
                        </div>
                        {loadData.rate.detention > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Detention</span>
                            <span className="font-medium">{formatCurrency(loadData.rate.detention)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between text-base font-bold">
                          <span>Total Rate</span>
                          <span className="text-brand-green-600">{formatCurrency(loadData.rate.total)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Rate per Mile</span>
                          <span>${(loadData.rate.total / loadData.rate.miles).toFixed(2)}/mi</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="documents" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-slate-500">{loadData.documents.length} documents</p>
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {loadData.documents.map((doc) => (
                          <div 
                            key={doc.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-slate-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-slate-500">{doc.size} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notes" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {loadData.notes.map((note) => (
                          <div key={note.id} className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-sm">{note.text}</p>
                            <p className="text-xs text-slate-500 mt-2">
                              {note.user} • {new Date(note.time).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Textarea 
                          placeholder="Add a note..." 
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={handleAddNote}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Driver Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Assigned Driver</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={loadData.driver.avatar || undefined} />
                      <AvatarFallback className="bg-brand-blue-100 text-brand-blue-600 font-medium">
                        {loadData.driver.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{loadData.driver.name}</p>
                      <p className="text-sm text-slate-500">{loadData.driver.truck}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span>{loadData.driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="h-4 w-4" />
                      <span>{loadData.driver.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Truck className="h-4 w-4" />
                      <span>Trailer: {loadData.driver.trailer}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Load Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[400px] overflow-y-auto pr-2">
                    {loadData.timeline.map((event, index) => (
                      <TimelineItem 
                        key={event.id} 
                        event={event} 
                        isLast={index === loadData.timeline.length - 1}
                        status={event.status}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate BOL
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Load
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
