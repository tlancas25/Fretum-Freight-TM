"use client"

import React, { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Building2,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Truck,
  DollarSign,
  Star,
  StarOff,
  Edit,
  Trash2,
  Eye,
  FileText,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Types
type CustomerStatus = 'active' | 'inactive' | 'pending';
type CustomerType = 'shipper' | 'consignee' | 'broker' | 'both';

interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  status: CustomerStatus;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  primaryContact: string;
  totalLoads: number;
  totalRevenue: number;
  avgRate: number;
  paymentTerms: string;
  creditLimit: number;
  rating: number;
  isFavorite: boolean;
  lastLoadDate: string;
  notes: string;
}

// Sample data
const customers: Customer[] = [
  {
    id: 'CUS-001',
    name: 'Amazon Logistics',
    type: 'shipper',
    status: 'active',
    email: 'dispatch@amazon.com',
    phone: '(206) 555-1234',
    address: { street: '410 Terry Ave N', city: 'Seattle', state: 'WA', zip: '98109' },
    primaryContact: 'John Smith',
    totalLoads: 156,
    totalRevenue: 425000,
    avgRate: 2724,
    paymentTerms: 'Net 30',
    creditLimit: 100000,
    rating: 5,
    isFavorite: true,
    lastLoadDate: '2026-01-08',
    notes: 'Premium customer. Priority handling required.',
  },
  {
    id: 'CUS-002',
    name: 'Walmart Distribution',
    type: 'both',
    status: 'active',
    email: 'freight@walmart.com',
    phone: '(479) 555-2345',
    address: { street: '702 SW 8th St', city: 'Bentonville', state: 'AR', zip: '72716' },
    primaryContact: 'Mary Johnson',
    totalLoads: 234,
    totalRevenue: 612000,
    avgRate: 2615,
    paymentTerms: 'Net 45',
    creditLimit: 150000,
    rating: 4,
    isFavorite: true,
    lastLoadDate: '2026-01-09',
    notes: 'Strict appointment windows. Must confirm 24h in advance.',
  },
  {
    id: 'CUS-003',
    name: 'Target Corporation',
    type: 'consignee',
    status: 'active',
    email: 'logistics@target.com',
    phone: '(612) 555-3456',
    address: { street: '1000 Nicollet Mall', city: 'Minneapolis', state: 'MN', zip: '55403' },
    primaryContact: 'Bob Wilson',
    totalLoads: 89,
    totalRevenue: 198000,
    avgRate: 2225,
    paymentTerms: 'Net 30',
    creditLimit: 75000,
    rating: 4,
    isFavorite: false,
    lastLoadDate: '2026-01-05',
    notes: '',
  },
  {
    id: 'CUS-004',
    name: 'FedEx Freight',
    type: 'broker',
    status: 'active',
    email: 'carrier@fedex.com',
    phone: '(800) 555-4567',
    address: { street: '942 S Shady Grove Rd', city: 'Memphis', state: 'TN', zip: '38120' },
    primaryContact: 'Lisa Park',
    totalLoads: 67,
    totalRevenue: 156000,
    avgRate: 2328,
    paymentTerms: 'Quick Pay',
    creditLimit: 50000,
    rating: 5,
    isFavorite: false,
    lastLoadDate: '2026-01-07',
    notes: 'Quick pay available for 2% fee.',
  },
  {
    id: 'CUS-005',
    name: 'XPO Logistics',
    type: 'broker',
    status: 'active',
    email: 'dispatch@xpo.com',
    phone: '(855) 555-5678',
    address: { street: '5 American Lane', city: 'Greenwich', state: 'CT', zip: '06831' },
    primaryContact: 'Mike Chen',
    totalLoads: 45,
    totalRevenue: 112000,
    avgRate: 2489,
    paymentTerms: 'Net 30',
    creditLimit: 40000,
    rating: 3,
    isFavorite: false,
    lastLoadDate: '2026-01-03',
    notes: 'Verify rate confirmation before dispatch.',
  },
  {
    id: 'CUS-006',
    name: 'Costco Wholesale',
    type: 'shipper',
    status: 'pending',
    email: 'freight@costco.com',
    phone: '(425) 555-6789',
    address: { street: '999 Lake Dr', city: 'Issaquah', state: 'WA', zip: '98027' },
    primaryContact: 'Sarah Davis',
    totalLoads: 0,
    totalRevenue: 0,
    avgRate: 0,
    paymentTerms: 'Net 30',
    creditLimit: 25000,
    rating: 0,
    isFavorite: false,
    lastLoadDate: '',
    notes: 'New customer - pending credit approval.',
  },
  {
    id: 'CUS-007',
    name: 'Home Depot',
    type: 'both',
    status: 'inactive',
    email: 'logistics@homedepot.com',
    phone: '(770) 555-7890',
    address: { street: '2455 Paces Ferry Rd', city: 'Atlanta', state: 'GA', zip: '30339' },
    primaryContact: 'James Brown',
    totalLoads: 23,
    totalRevenue: 54000,
    avgRate: 2348,
    paymentTerms: 'Net 45',
    creditLimit: 30000,
    rating: 3,
    isFavorite: false,
    lastLoadDate: '2025-11-15',
    notes: 'Account inactive - no loads in 60+ days.',
  },
];

// Stats calculation
const stats = {
  totalCustomers: customers.length,
  activeCustomers: customers.filter(c => c.status === 'active').length,
  totalRevenue: customers.reduce((sum, c) => sum + c.totalRevenue, 0),
  avgRating: customers.filter(c => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) / customers.filter(c => c.rating > 0).length,
};

function StatusBadge({ status }: { status: CustomerStatus }) {
  const config = {
    active: { label: 'Active', className: 'bg-brand-green-100 text-brand-green-700' },
    inactive: { label: 'Inactive', className: 'bg-slate-100 text-slate-600' },
    pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
  };
  
  const { label, className } = config[status];
  return <Badge className={cn("font-medium", className)}>{label}</Badge>;
}

function TypeBadge({ type }: { type: CustomerType }) {
  const config = {
    shipper: { label: 'Shipper', className: 'bg-blue-100 text-blue-700' },
    consignee: { label: 'Consignee', className: 'bg-purple-100 text-purple-700' },
    broker: { label: 'Broker', className: 'bg-orange-100 text-orange-700' },
    both: { label: 'Ship/Consign', className: 'bg-teal-100 text-teal-700' },
  };
  
  const { label, className } = config[type];
  return <Badge variant="outline" className={cn("font-medium", className)}>{label}</Badge>;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={cn(
            "h-3.5 w-3.5",
            star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
          )} 
        />
      ))}
    </div>
  );
}

function CustomerCard({ customer }: { customer: Customer }) {
  const { toast } = useToast();
  
  const toggleFavorite = () => {
    toast({
      title: customer.isFavorite ? "Removed from favorites" : "Added to favorites",
      description: customer.name,
    });
  };

  return (
    <Card className="hover:border-slate-300 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-brand-blue-100 text-brand-blue-600 font-semibold text-sm">
                {customer.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{customer.name}</h3>
                {customer.isFavorite && (
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                )}
              </div>
              <p className="text-sm text-slate-500">{customer.primaryContact}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={customer.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleFavorite}>
                  {customer.isFavorite ? (
                    <>
                      <StarOff className="h-4 w-4 mr-2" />
                      Remove Favorite
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Add to Favorites
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  View Loads
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
          <TypeBadge type={customer.type} />
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {customer.address.city}, {customer.address.state}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500">Total Loads</p>
            <p className="text-lg font-bold">{customer.totalLoads}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Revenue</p>
            <p className="text-lg font-bold text-brand-green-600">
              ${(customer.totalRevenue / 1000).toFixed(0)}k
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Rating</p>
            <RatingStars rating={customer.rating} />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Phone className="h-3.5 w-3.5 mr-1.5" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            Email
          </Button>
          <Button size="sm" className="flex-1">
            <Truck className="h-3.5 w-3.5 mr-1.5" />
            New Load
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const { toast } = useToast();

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.primaryContact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-headline text-2xl font-bold">Customers</h1>
              <p className="text-sm text-muted-foreground">
                Manage your shippers, consignees, and brokers
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Enter customer details below. You can add more information later.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company Name *</Label>
                      <Input placeholder="Acme Corporation" />
                    </div>
                    <div className="space-y-2">
                      <Label>Customer Type *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shipper">Shipper</SelectItem>
                          <SelectItem value="consignee">Consignee</SelectItem>
                          <SelectItem value="broker">Broker</SelectItem>
                          <SelectItem value="both">Shipper & Consignee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Contact</Label>
                      <Input placeholder="John Smith" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input type="email" placeholder="contact@company.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="(555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Terms</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net15">Net 15</SelectItem>
                          <SelectItem value="net30">Net 30</SelectItem>
                          <SelectItem value="net45">Net 45</SelectItem>
                          <SelectItem value="quickpay">Quick Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input placeholder="Street address" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input placeholder="Chicago" />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input placeholder="IL" maxLength={2} />
                    </div>
                    <div className="space-y-2">
                      <Label>ZIP</Label>
                      <Input placeholder="60601" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea placeholder="Any special instructions or notes..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={() => toast({ title: "Customer Created", description: "New customer has been added." })}>
                    Create Customer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Stats */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="grid grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-blue-100 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-brand-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                <p className="text-xs text-slate-500">Total Customers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-brand-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeCustomers}</p>
                <p className="text-xs text-slate-500">Active Customers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(stats.totalRevenue / 1000).toFixed(0)}k</p>
                <p className="text-xs text-slate-500">Total Revenue</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
                <p className="text-xs text-slate-500">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-slate-200 px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="shipper">Shipper</SelectItem>
                <SelectItem value="consignee">Consignee</SelectItem>
                <SelectItem value="broker">Broker</SelectItem>
                <SelectItem value="both">Ship/Consign</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-slate-500">
                {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
              </span>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'table')}>
                <TabsList className="h-9">
                  <TabsTrigger value="grid" className="px-3">Grid</TabsTrigger>
                  <TabsTrigger value="table" className="px-3">Table</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCustomers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Loads</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-brand-blue-100 text-brand-blue-600 text-xs font-medium">
                              {customer.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium flex items-center gap-1">
                              {customer.name}
                              {customer.isFavorite && (
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              )}
                            </p>
                            <p className="text-xs text-slate-500">
                              {customer.address.city}, {customer.address.state}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><TypeBadge type={customer.type} /></TableCell>
                      <TableCell><StatusBadge status={customer.status} /></TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{customer.primaryContact}</p>
                          <p className="text-xs text-slate-500">{customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{customer.totalLoads}</TableCell>
                      <TableCell className="text-right font-medium text-brand-green-600">
                        ${customer.totalRevenue.toLocaleString()}
                      </TableCell>
                      <TableCell><RatingStars rating={customer.rating} /></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Loads</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-medium text-slate-900 mb-1">No customers found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
