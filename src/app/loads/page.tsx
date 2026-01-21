"use client"

import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  PlusCircle, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  Truck as TruckIcon,
  AlertCircle,
  CheckCircle2,
  ScanLine,
  Search,
  X,
  Calendar,
  DollarSign,
  MapPin,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Download,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Types
type LoadStatus = 'booked' | 'dispatched' | 'in-transit' | 'delivered';
type Priority = 'normal' | 'high';

interface Load {
  id: string;
  origin: {
    city: string;
    facility: string;
  };
  destination: {
    city: string;
    facility: string;
  };
  driver: string;
  equipment: string;
  status: LoadStatus;
  priority: Priority;
  rate: number;
  miles: number;
  eta?: string;
  isDelayed?: boolean;
  delayTime?: string;
  deliveredAt?: string;
  signedBy?: string;
  dotNumber?: string;
  speed?: string;
  temp?: string;
  statusBadge?: string;
}

// Sample data
const initialLoads: Load[] = [
  // Booked
  {
    id: 'LD-99012',
    origin: { city: 'Chicago, IL', facility: 'Central Hub - Dock 4A' },
    destination: { city: 'Denver, CO', facility: 'Mile High Logistics' },
    driver: 'Marcus Reed',
    equipment: 'Volvo VNL 860',
    status: 'booked',
    priority: 'normal',
    rate: 4500,
    miles: 1004
  },
  {
    id: 'LD-99044',
    origin: { city: 'Gary, IN', facility: 'Steel Works North' },
    destination: { city: 'Columbus, OH', facility: 'Midwest Distribution' },
    driver: 'Alex Volkov',
    equipment: 'Freightliner Cascadia',
    status: 'booked',
    priority: 'normal',
    rate: 1800,
    miles: 294
  },
  {
    id: 'LD-99055',
    origin: { city: 'Memphis, TN', facility: 'FedEx Ground Hub' },
    destination: { city: 'Louisville, KY', facility: 'UPS Worldport' },
    driver: 'Tom Wilson',
    equipment: 'Peterbilt 579',
    status: 'booked',
    priority: 'high',
    rate: 1200,
    miles: 302
  },
  // Dispatched
  {
    id: 'LD-98950',
    origin: { city: 'Atlanta, GA', facility: 'Piedmont Logistics' },
    destination: { city: 'Dallas, TX', facility: 'Lonestar Cold Storage' },
    driver: 'Sarah Chen',
    equipment: 'Kenworth T680',
    status: 'dispatched',
    priority: 'high',
    rate: 3200,
    miles: 781,
    dotNumber: '3142951',
    statusBadge: 'Awaiting Check-in'
  },
  {
    id: 'LD-98965',
    origin: { city: 'Houston, TX', facility: 'Port of Houston' },
    destination: { city: 'San Antonio, TX', facility: 'Alamo Freight' },
    driver: 'Miguel Santos',
    equipment: 'Mack Anthem',
    status: 'dispatched',
    priority: 'normal',
    rate: 850,
    miles: 199,
    statusBadge: 'Driver En Route'
  },
  // In Transit
  {
    id: 'LD-98821',
    origin: { city: 'Newark, NJ', facility: 'Port Authority E-2' },
    destination: { city: 'Charlotte, NC', facility: 'Queen City Terminal' },
    driver: "James O'Connell",
    equipment: 'Volvo VNL 760',
    status: 'in-transit',
    priority: 'normal',
    rate: 2800,
    miles: 630,
    eta: '14:20',
    speed: '62 mph',
    temp: '34°F',
    statusBadge: 'On Schedule'
  },
  {
    id: 'LD-98772',
    origin: { city: 'Laredo, TX', facility: 'Border Processing' },
    destination: { city: 'Nashville, TN', facility: 'Music City Logistics' },
    driver: 'David Miller',
    equipment: 'Kenworth T680',
    status: 'in-transit',
    priority: 'high',
    rate: 4100,
    miles: 1089,
    isDelayed: true,
    delayTime: '+45m'
  },
  {
    id: 'LD-98790',
    origin: { city: 'Seattle, WA', facility: 'Amazon SWA1' },
    destination: { city: 'Portland, OR', facility: 'Columbia Logistics' },
    driver: 'Emily Watson',
    equipment: 'Freightliner Cascadia',
    status: 'in-transit',
    priority: 'normal',
    rate: 750,
    miles: 175,
    eta: '16:45',
    statusBadge: 'On Schedule'
  },
  {
    id: 'LD-98801',
    origin: { city: 'Phoenix, AZ', facility: 'Desert Terminal' },
    destination: { city: 'Las Vegas, NV', facility: 'Vegas Distribution' },
    driver: 'Robert Johnson',
    equipment: 'Peterbilt 389',
    status: 'in-transit',
    priority: 'normal',
    rate: 950,
    miles: 297,
    eta: '15:30',
    statusBadge: 'On Schedule'
  },
  {
    id: 'LD-98815',
    origin: { city: 'Miami, FL', facility: 'Port Miami' },
    destination: { city: 'Orlando, FL', facility: 'Central FL Hub' },
    driver: 'Carlos Rivera',
    equipment: 'Volvo VNL 860',
    status: 'in-transit',
    priority: 'high',
    rate: 680,
    miles: 235,
    eta: '13:15',
    statusBadge: 'On Schedule'
  },
  // Delivered
  {
    id: 'LD-98511',
    origin: { city: 'Phoenix, AZ', facility: 'Desert Distribution' },
    destination: { city: 'Los Angeles, CA', facility: 'LAX Air Cargo' },
    driver: 'Mike Thompson',
    equipment: 'Freightliner Cascadia',
    status: 'delivered',
    priority: 'normal',
    rate: 1400,
    miles: 372,
    deliveredAt: '09:12 AM Today',
    signedBy: 'E. Rodriguez',
    statusBadge: 'POD Uploaded'
  },
  {
    id: 'LD-98498',
    origin: { city: 'Boston, MA', facility: 'New England Freight' },
    destination: { city: 'New York, NY', facility: 'JFK Cargo' },
    driver: 'Lisa Park',
    equipment: 'Volvo VNL 760',
    status: 'delivered',
    priority: 'normal',
    rate: 890,
    miles: 215,
    deliveredAt: '07:45 AM Today',
    signedBy: 'M. Johnson',
    statusBadge: 'POD Uploaded'
  },
];

const columns: { id: LoadStatus; title: string }[] = [
  { id: 'booked', title: 'Booked' },
  { id: 'dispatched', title: 'Dispatched' },
  { id: 'in-transit', title: 'In Transit' },
  { id: 'delivered', title: 'Delivered (24h)' },
];

// Shipment Card Component
function ShipmentCard({ load }: { load: Load }) {
  const isDelivered = load.status === 'delivered';
  
  return (
    <Link href={`/loads/${load.id}`}>
      <div 
        className={cn(
          "bg-white border border-slate-200 rounded-sm p-2.5 mb-2 cursor-pointer transition-all duration-150 relative group",
          "hover:border-primary hover:shadow-md hover:-translate-y-0.5",
          isDelivered && "opacity-80"
        )}
      >
      {/* ETA Timer */}
      {load.eta && !load.isDelayed && (
        <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold text-slate-500 flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          ETA {load.eta}
        </span>
      )}
      {load.isDelayed && (
        <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold text-red-500 flex items-center gap-1">
          <AlertCircle className="h-2.5 w-2.5" />
          Delayed {load.delayTime}
        </span>
      )}

      {/* Card Header */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded-sm">
          #{load.id}
        </span>
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          load.priority === 'high' ? "bg-red-500" : "bg-slate-300"
        )} />
      </div>

      {/* Route Info */}
      <div className="flex flex-col gap-0.5 mb-2 pl-2.5 relative">
        <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-slate-200" />
        <div>
          <div className="text-[12px] font-semibold text-slate-900 leading-tight">{load.origin.city}</div>
          <div className="text-[10px] text-slate-500 truncate">{load.origin.facility}</div>
        </div>
        <div className="mt-1.5">
          <div className="text-[12px] font-semibold text-slate-900 leading-tight">{load.destination.city}</div>
          <div className="text-[10px] text-slate-500 truncate">{load.destination.facility}</div>
        </div>
      </div>

      {/* Asset Details */}
      <div className="border-t border-slate-100 pt-2 grid grid-cols-2 gap-1.5">
        {isDelivered ? (
          <>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase text-slate-500 font-semibold tracking-wide">Delivered At</span>
              <span className="text-[10px] font-medium text-slate-700 truncate">{load.deliveredAt}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase text-slate-500 font-semibold tracking-wide">Signed By</span>
              <span className="text-[10px] font-medium text-slate-700 truncate">{load.signedBy}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase text-slate-500 font-semibold tracking-wide">Driver</span>
              <span className="text-[10px] font-medium text-slate-700 truncate">{load.driver}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase text-slate-500 font-semibold tracking-wide">
                {load.dotNumber ? 'DOT #' : load.speed ? 'Speed / Temp' : 'Equipment'}
              </span>
              <span className="text-[10px] font-medium text-slate-700 truncate">
                {load.dotNumber || (load.speed ? `${load.speed} / ${load.temp}` : load.equipment)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Status Badge */}
      {load.statusBadge && (
        <div className={cn(
          "mt-2 text-[9px] font-bold inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm uppercase",
          load.statusBadge === 'On Schedule' && "bg-emerald-50 text-emerald-700",
          load.statusBadge === 'Awaiting Check-in' && "bg-amber-50 text-amber-600",
          load.statusBadge === 'Driver En Route' && "bg-blue-50 text-blue-600",
          load.statusBadge === 'POD Uploaded' && "bg-slate-200 text-slate-700"
        )}>
          {load.statusBadge === 'On Schedule' && <CheckCircle2 className="h-2.5 w-2.5" />}
          {load.statusBadge}
        </div>
      )}

      {/* Hover Actions */}
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/loads/${load.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Track Shipment</DropdownMenuItem>
            <DropdownMenuItem>Contact Driver</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Generate BOL</DropdownMenuItem>
            <DropdownMenuItem>Create Invoice</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    </Link>
  );
}

// Kanban Column Component
function KanbanColumn({ 
  title, 
  loads, 
  status,
  onDrop 
}: { 
  title: string; 
  loads: Load[];
  status: LoadStatus;
  onDrop: (loadId: string) => void;
}) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const loadId = e.dataTransfer.getData('loadId');
    onDrop(loadId);
  };

  return (
    <section 
      className="bg-slate-100 flex-1 min-w-[260px] sm:min-w-[280px] max-w-[320px] max-h-full flex flex-col rounded-sm border border-slate-200"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="p-2.5 px-3 flex justify-between items-center border-b border-slate-200">
        <h2 className="text-xs font-bold uppercase text-slate-700 tracking-wide flex items-center gap-2">
          {title}
        </h2>
        <span className="bg-slate-200 px-2 py-0.5 rounded-full text-[11px] font-semibold text-slate-600">
          {loads.length}
        </span>
      </div>
      <div className="px-2 pb-2 pt-2 overflow-y-auto flex-1 scrollbar-hide">
        {loads.map((load) => (
          <div
            key={load.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('loadId', load.id);
            }}
          >
            <ShipmentCard load={load} />
          </div>
        ))}
        {loads.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No loads in this status
          </div>
        )}
      </div>
    </section>
  );
}

export default function LoadsPage() {
  const [loads, setLoads] = useState<Load[]>(initialLoads);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    priority: 'all',
    driver: 'all',
    minRate: '',
    maxRate: '',
    originState: '',
    destState: '',
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Calculate active filters count
  React.useEffect(() => {
    let count = 0;
    if (filters.priority !== 'all') count++;
    if (filters.driver !== 'all') count++;
    if (filters.minRate) count++;
    if (filters.maxRate) count++;
    if (filters.originState) count++;
    if (filters.destState) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Filter loads based on search and filters
  const filteredLoads = useMemo(() => {
    return loads.filter(load => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          load.id.toLowerCase().includes(query) ||
          load.origin.city.toLowerCase().includes(query) ||
          load.destination.city.toLowerCase().includes(query) ||
          load.driver.toLowerCase().includes(query) ||
          load.origin.facility.toLowerCase().includes(query) ||
          load.destination.facility.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && load.priority !== filters.priority) {
        return false;
      }

      // Driver filter
      if (filters.driver !== 'all' && load.driver !== filters.driver) {
        return false;
      }

      // Rate filters
      if (filters.minRate && load.rate < parseFloat(filters.minRate)) {
        return false;
      }
      if (filters.maxRate && load.rate > parseFloat(filters.maxRate)) {
        return false;
      }

      // Origin state filter
      if (filters.originState) {
        const stateMatch = load.origin.city.toLowerCase().includes(filters.originState.toLowerCase());
        if (!stateMatch) return false;
      }

      // Destination state filter
      if (filters.destState) {
        const stateMatch = load.destination.city.toLowerCase().includes(filters.destState.toLowerCase());
        if (!stateMatch) return false;
      }

      return true;
    });
  }, [loads, searchQuery, filters]);

  // Get unique drivers for filter
  const uniqueDrivers = useMemo(() => {
    return [...new Set(loads.map(l => l.driver))];
  }, [loads]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      priority: 'all',
      driver: 'all',
      minRate: '',
      maxRate: '',
      originState: '',
      destState: '',
    });
    setSearchQuery('');
  };

  // Calculate stats from filtered loads
  const activeLoads = filteredLoads.filter(l => l.status !== 'delivered').length;
  const onTimeLoads = filteredLoads.filter(l => l.status === 'in-transit' && !l.isDelayed).length;
  const inTransitLoads = filteredLoads.filter(l => l.status === 'in-transit').length;
  const onTimePercentage = inTransitLoads > 0 ? ((onTimeLoads / inTransitLoads) * 100).toFixed(1) : '100.0';
  const totalRevenue = filteredLoads.reduce((sum, l) => sum + l.rate, 0);

  const handleDrop = (status: LoadStatus) => (loadId: string) => {
    setLoads(prev => prev.map(load => 
      load.id === loadId ? { ...load, status } : load
    ));
  };

  const getLoadsByStatus = (status: LoadStatus) => filteredLoads.filter(l => l.status === status);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Load ID', 'Status', 'Origin City', 'Origin Facility', 'Destination City', 'Destination Facility', 'Driver', 'Equipment', 'Rate', 'Miles', 'Priority'];
    const rows = filteredLoads.map(load => [
      load.id,
      load.status,
      load.origin.city,
      load.origin.facility,
      load.destination.city,
      load.destination.facility,
      load.driver,
      load.equipment,
      load.rate,
      load.miles,
      load.priority
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `loads_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: `${filteredLoads.length} loads exported to CSV`,
    });
  };

  // Export to PDF (generates printable view)
  const exportToPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Fretum-Freight - Loads Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0066CC; font-size: 24px; }
            .stats { display: flex; gap: 40px; margin-bottom: 20px; }
            .stat { }
            .stat-value { font-size: 24px; font-weight: bold; }
            .stat-label { font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .status { padding: 2px 8px; border-radius: 4px; font-size: 11px; }
            .booked { background: #dbeafe; color: #1e40af; }
            .dispatched { background: #fef3c7; color: #92400e; }
            .in-transit { background: #d1fae5; color: #065f46; }
            .delivered { background: #f3f4f6; color: #374151; }
            .high { color: #dc2626; font-weight: bold; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <h1>Fretum-Freight TMS - Loads Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <div class="stats">
            <div class="stat"><div class="stat-value">${activeLoads}</div><div class="stat-label">Active Loads</div></div>
            <div class="stat"><div class="stat-value">${onTimePercentage}%</div><div class="stat-label">On-Time</div></div>
            <div class="stat"><div class="stat-value">$${totalRevenue.toLocaleString()}</div><div class="stat-label">Total Revenue</div></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Load ID</th>
                <th>Status</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Driver</th>
                <th>Rate</th>
                <th>Miles</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              ${filteredLoads.map(load => `
                <tr>
                  <td>${load.id}</td>
                  <td><span class="status ${load.status}">${load.status.toUpperCase()}</span></td>
                  <td>${load.origin.city}<br/><small>${load.origin.facility}</small></td>
                  <td>${load.destination.city}<br/><small>${load.destination.facility}</small></td>
                  <td>${load.driver}</td>
                  <td>$${load.rate.toLocaleString()}</td>
                  <td>${load.miles}</td>
                  <td class="${load.priority}">${load.priority.toUpperCase()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
    
    toast({
      title: "PDF Ready",
      description: "Print dialog opened for PDF export",
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Stats Header */}
        <header className="min-h-14 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center px-4 md:px-6 py-2 sm:py-0 justify-between flex-shrink-0 gap-2 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <TruckIcon className="h-5 w-5 text-primary" />
              <span className="font-bold text-sm uppercase tracking-tight">
                Active<span className="text-primary">Loads</span>
              </span>
            </div>
          </div>

          <div className="flex gap-4 md:gap-6 text-center sm:text-left">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wide">Active Loads</span>
              <span className="text-sm font-bold">{activeLoads}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wide">On-Time %</span>
              <span className="text-sm font-bold text-emerald-600">{onTimePercentage}%</span>
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wide">Total Revenue</span>
              <span className="text-sm font-bold">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export to PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/loads/extract" className="hidden sm:block">
              <Button variant="outline" size="sm" className="gap-2">
                <ScanLine className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Extract</span>
              </Button>
            </Link>
            <Link href="/loads/new">
              <Button size="sm" className="gap-2">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Load</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Search & Filters Bar */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-2 md:py-3 flex items-center gap-2 md:gap-3 flex-wrap sm:flex-nowrap">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search loads by ID, city, driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <Select value={filters.priority} onValueChange={(v) => setFilters(prev => ({ ...prev, priority: v }))}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.driver} onValueChange={(v) => setFilters(prev => ({ ...prev, driver: v }))}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Driver" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivers</SelectItem>
              {uniqueDrivers.map(driver => (
                <SelectItem key={driver} value={driver}>{driver}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Advanced Filters Popover */}
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                More Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Advanced Filters</h4>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-slate-500">Rate Range</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                          placeholder="Min"
                          value={filters.minRate}
                          onChange={(e) => setFilters(prev => ({ ...prev, minRate: e.target.value }))}
                          className="pl-7 h-8"
                          type="number"
                        />
                      </div>
                      <span className="text-slate-400">—</span>
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                          placeholder="Max"
                          value={filters.maxRate}
                          onChange={(e) => setFilters(prev => ({ ...prev, maxRate: e.target.value }))}
                          className="pl-7 h-8"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-500">Origin Location</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        placeholder="City or State (e.g. Chicago, IL)"
                        value={filters.originState}
                        onChange={(e) => setFilters(prev => ({ ...prev, originState: e.target.value }))}
                        className="pl-7 h-8"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-500">Destination Location</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        placeholder="City or State (e.g. Denver, CO)"
                        value={filters.destState}
                        onChange={(e) => setFilters(prev => ({ ...prev, destState: e.target.value }))}
                        className="pl-7 h-8"
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="sm" onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Active filter badges */}
          {(searchQuery || activeFiltersCount > 0) && (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-slate-500">
                {filteredLoads.length} of {loads.length} loads
              </span>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs text-slate-500">
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Kanban Board */}
        <main className="flex flex-1 p-3 gap-3 overflow-x-auto items-stretch bg-slate-50">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              status={column.id}
              loads={getLoadsByStatus(column.id)}
              onDrop={handleDrop(column.id)}
            />
          ))}
        </main>
      </div>
    </AppLayout>
  );
}
