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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Download,
  Send,
  Printer,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building2,
  FileText,
  Mail,
  ChevronRight,
  BarChart3,
  CircleDollarSign,
  Wallet,
  PiggyBank,
  Copy,
  ExternalLink,
  RefreshCw,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Sample invoice data
const invoices = [
  {
    id: "INV-2026-001",
    loadId: "LD-2026-001",
    customer: { name: "ABC Logistics", email: "billing@abclogistics.com" },
    amount: 2450.00,
    status: "paid",
    dueDate: "2026-01-05",
    paidDate: "2026-01-03",
    issuedDate: "2026-01-01",
    origin: "Los Angeles, CA",
    destination: "Phoenix, AZ",
    paymentMethod: "ACH Transfer",
  },
  {
    id: "INV-2026-002",
    loadId: "LD-2026-002",
    customer: { name: "XYZ Shipping", email: "accounts@xyzshipping.com" },
    amount: 1875.00,
    status: "paid",
    dueDate: "2026-01-08",
    paidDate: "2026-01-07",
    issuedDate: "2026-01-02",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    paymentMethod: "Check",
  },
  {
    id: "INV-2026-003",
    loadId: "LD-2026-003",
    customer: { name: "Fast Freight LLC", email: "payments@fastfreight.com" },
    amount: 3200.00,
    status: "pending",
    dueDate: "2026-01-15",
    issuedDate: "2026-01-05",
    origin: "Dallas, TX",
    destination: "Houston, TX",
  },
  {
    id: "INV-2026-004",
    loadId: "LD-2026-004",
    customer: { name: "Prime Carriers Inc", email: "ar@primecarriers.com" },
    amount: 4100.00,
    status: "pending",
    dueDate: "2026-01-18",
    issuedDate: "2026-01-06",
    origin: "Chicago, IL",
    destination: "Detroit, MI",
  },
  {
    id: "INV-2026-005",
    loadId: "LD-2026-005",
    customer: { name: "Global Transport", email: "finance@globaltransport.com" },
    amount: 5500.00,
    status: "overdue",
    dueDate: "2026-01-02",
    issuedDate: "2025-12-20",
    origin: "Miami, FL",
    destination: "Atlanta, GA",
    daysOverdue: 7,
  },
  {
    id: "INV-2026-006",
    loadId: "LD-2026-006",
    customer: { name: "Midwest Movers", email: "billing@midwestmovers.com" },
    amount: 2800.00,
    status: "overdue",
    dueDate: "2026-01-01",
    issuedDate: "2025-12-18",
    origin: "Denver, CO",
    destination: "Kansas City, MO",
    daysOverdue: 8,
  },
  {
    id: "INV-2026-007",
    loadId: "LD-2026-007",
    customer: { name: "Coast to Coast Shipping", email: "pay@coasttocoast.com" },
    amount: 1950.00,
    status: "draft",
    dueDate: "2026-01-25",
    issuedDate: "2026-01-09",
    origin: "San Francisco, CA",
    destination: "Sacramento, CA",
  },
  {
    id: "INV-2026-008",
    loadId: "LD-2026-008",
    customer: { name: "Southern Freight Co", email: "ap@southernfreight.com" },
    amount: 3750.00,
    status: "sent",
    dueDate: "2026-01-20",
    issuedDate: "2026-01-08",
    origin: "Nashville, TN",
    destination: "Memphis, TN",
  },
  {
    id: "INV-2026-009",
    loadId: "LD-2026-009",
    customer: { name: "Mountain Logistics", email: "billing@mountainlogistics.com" },
    amount: 2100.00,
    status: "sent",
    dueDate: "2026-01-22",
    issuedDate: "2026-01-08",
    origin: "Salt Lake City, UT",
    destination: "Boise, ID",
  },
  {
    id: "INV-2026-010",
    loadId: "LD-2026-010",
    customer: { name: "Express Lines", email: "invoices@expresslines.com" },
    amount: 4250.00,
    status: "partial",
    dueDate: "2026-01-12",
    issuedDate: "2026-01-03",
    origin: "New York, NY",
    destination: "Philadelphia, PA",
    paidAmount: 2125.00,
  },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    paid: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
    pending: { bg: "bg-amber-100", text: "text-amber-700", icon: Clock },
    overdue: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle },
    draft: { bg: "bg-slate-100", text: "text-slate-700", icon: FileText },
    sent: { bg: "bg-blue-100", text: "text-blue-700", icon: Send },
    partial: { bg: "bg-purple-100", text: "text-purple-700", icon: CircleDollarSign },
  };

  const style = styles[status] || styles.pending;
  const Icon = style.icon;

  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", style.bg, style.text, "border-0")}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

// Line items for invoice creation
const defaultLineItems = [
  { description: "Freight Charges", quantity: 1, rate: 0 },
  { description: "Fuel Surcharge", quantity: 1, rate: 0 },
];

export default function InvoicesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);
  const [lineItems, setLineItems] = useState(defaultLineItems);

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.loadId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalOutstanding = invoices
    .filter((i) => ["pending", "sent", "overdue", "partial"].includes(i.status))
    .reduce((sum, i) => {
      if (i.status === "partial" && "paidAmount" in i && i.paidAmount !== undefined) {
        return sum + (i.amount - i.paidAmount);
      }
      return sum + i.amount;
    }, 0);

  const totalOverdue = invoices
    .filter((i) => i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);

  const paidThisMonth = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const pendingCount = invoices.filter((i) => ["pending", "sent"].includes(i.status)).length;

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map((i) => i.id));
    }
  };

  const handleViewInvoice = (invoice: typeof invoices[0]) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handleSendReminder = (invoiceId: string) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent for ${invoiceId}`,
    });
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, rate: 0 }]);
  };

  const handleCreateInvoice = () => {
    setCreateDialogOpen(false);
    toast({
      title: "Invoice Created",
      description: "New invoice has been created successfully.",
    });
  };

  return (
    <AppLayout>
      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 md:w-6 md:h-6 text-brand-600" />
              Invoicing
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm mt-1">
              Manage invoices, track payments, and handle billing
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              <Download className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Create Invoice</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2.5 bg-blue-100 rounded-lg">
                  <Wallet className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-bold text-slate-900">
                    ${totalOutstanding.toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">Outstanding</p>
                </div>
              </div>
              <div className="mt-2 md:mt-3 flex items-center gap-1 text-[10px] md:text-xs text-amber-600">
                <Clock className="w-3 h-3" />
                <span>{pendingCount} invoices pending</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2.5 bg-red-100 rounded-lg">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-bold text-slate-900">
                    ${totalOverdue.toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
              <div className="mt-2 md:mt-3 flex items-center gap-1 text-[10px] md:text-xs text-red-600">
                <TrendingDown className="w-3 h-3" />
                <span>{invoices.filter((i) => i.status === "overdue").length} past due</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2.5 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-bold text-slate-900">
                    ${paidThisMonth.toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">Paid This Month</p>
                </div>
              </div>
              <div className="mt-2 md:mt-3 flex items-center gap-1 text-[10px] md:text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2.5 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-bold text-slate-900">
                    ${invoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Invoiced</p>
                </div>
              </div>
              <div className="mt-2 md:mt-3 flex items-center gap-1 text-[10px] md:text-xs text-purple-600">
                <FileText className="w-3 h-3" />
                <span>{invoices.length} invoices created</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <TabsList className="h-auto flex-wrap">
              <TabsTrigger value="all" onClick={() => setStatusFilter("all")} className="text-xs md:text-sm">
                All
              </TabsTrigger>
              <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")} className="text-xs md:text-sm">
                Pending
              </TabsTrigger>
              <TabsTrigger value="sent" onClick={() => setStatusFilter("sent")} className="text-xs md:text-sm">
                Sent
              </TabsTrigger>
              <TabsTrigger value="paid" onClick={() => setStatusFilter("paid")}>
                Paid
              </TabsTrigger>
              <TabsTrigger value="overdue" onClick={() => setStatusFilter("overdue")}>
                Overdue
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select defaultValue="date">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedInvoices.includes(invoice.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedInvoices([...selectedInvoices, invoice.id]);
                            } else {
                              setSelectedInvoices(selectedInvoices.filter((id) => id !== invoice.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm font-semibold text-brand-600">{invoice.id}</p>
                          <p className="text-xs text-muted-foreground">Load: {invoice.loadId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{invoice.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{invoice.customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p>{invoice.origin}</p>
                          <p className="text-muted-foreground">→ {invoice.destination}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm">${invoice.amount.toLocaleString()}</p>
                          {invoice.status === "partial" && "paidAmount" in invoice && (
                            <p className="text-xs text-green-600">
                              ${invoice.paidAmount?.toLocaleString()} paid
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                        {invoice.status === "overdue" && "daysOverdue" in invoice && (
                          <p className="text-[10px] text-red-600 mt-0.5">
                            {invoice.daysOverdue} days overdue
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                          {invoice.status === "paid" && "paidDate" in invoice && (
                            <p className="text-xs text-green-600">
                              Paid {new Date(invoice.paidDate!).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="w-4 h-4 mr-2" />
                              Print
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {invoice.status !== "paid" && (
                              <>
                                <DropdownMenuItem>
                                  <Send className="w-4 h-4 mr-2" />
                                  Send to Customer
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendReminder(invoice.id)}>
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Send Reminder
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Record Payment
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredInvoices.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No invoices found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedInvoices.length > 0 && (
            <Card className="bg-brand-50 border-brand-200">
              <CardContent className="py-3 px-4 flex items-center justify-between">
                <p className="text-sm font-medium text-brand-700">
                  {selectedInvoices.length} invoice{selectedInvoices.length > 1 ? "s" : ""} selected
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Send All
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </Tabs>
      </div>

      {/* Create Invoice Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Create an invoice for a completed load
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Load Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Load</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a load" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LD-2026-015">LD-2026-015 - ABC Logistics</SelectItem>
                    <SelectItem value="LD-2026-016">LD-2026-016 - XYZ Shipping</SelectItem>
                    <SelectItem value="LD-2026-017">LD-2026-017 - Fast Freight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Input type="date" defaultValue="2026-01-09" />
              </div>
            </div>

            {/* Customer Info */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Bill To</CardTitle>
              </CardHeader>
              <CardContent className="py-3 px-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <Input placeholder="Company name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="billing@company.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Billing Address</Label>
                  <Textarea placeholder="Street address, City, State, ZIP" rows={2} />
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Line Items</CardTitle>
                <Button variant="outline" size="sm" onClick={addLineItem}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Line
                </Button>
              </CardHeader>
              <CardContent className="py-3 px-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Qty</TableHead>
                      <TableHead className="w-[120px]">Rate</TableHead>
                      <TableHead className="w-[120px] text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...lineItems];
                              newItems[index].description = e.target.value;
                              setLineItems(newItems);
                            }}
                            placeholder="Description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...lineItems];
                              newItems[index].quantity = parseInt(e.target.value) || 1;
                              setLineItems(newItems);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => {
                              const newItems = [...lineItems];
                              newItems[index].rate = parseFloat(e.target.value) || 0;
                              setLineItems(newItems);
                            }}
                            placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${(item.quantity * item.rate).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 space-y-2 text-right">
                  <div className="flex justify-end items-center gap-4">
                    <span className="text-sm text-muted-foreground">Subtotal:</span>
                    <span className="font-medium w-24">
                      ${lineItems.reduce((sum, i) => sum + i.quantity * i.rate, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-end items-center gap-4">
                    <span className="text-sm text-muted-foreground">Tax (0%):</span>
                    <span className="font-medium w-24">$0.00</span>
                  </div>
                  <div className="flex justify-end items-center gap-4 pt-2 border-t">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg text-brand-600 w-24">
                      ${lineItems.reduce((sum, i) => sum + i.quantity * i.rate, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Select defaultValue="net30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                    <SelectItem value="net15">Net 15</SelectItem>
                    <SelectItem value="net30">Net 30</SelectItem>
                    <SelectItem value="net45">Net 45</SelectItem>
                    <SelectItem value="net60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes / Terms</Label>
              <Textarea
                placeholder="Payment instructions, terms & conditions..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleCreateInvoice}>
              <Send className="w-4 h-4 mr-2" />
              Create & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Invoice {selectedInvoice?.id}</span>
              {selectedInvoice && <StatusBadge status={selectedInvoice.status} />}
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4 py-4">
              {/* Invoice Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedInvoice.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.customer.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Amount Due</p>
                  <p className="text-2xl font-bold text-brand-600">
                    ${selectedInvoice.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Load Reference</p>
                    <p className="font-mono text-sm">{selectedInvoice.loadId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Issue Date</p>
                    <p className="text-sm">{new Date(selectedInvoice.issuedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Origin</p>
                    <p className="text-sm">{selectedInvoice.origin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="text-sm">{selectedInvoice.destination}</p>
                  </div>
                  {selectedInvoice.status === "paid" && "paymentMethod" in selectedInvoice && (
                    <div>
                      <p className="text-xs text-muted-foreground">Payment Method</p>
                      <p className="text-sm">{selectedInvoice.paymentMethod}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                {selectedInvoice.status !== "paid" && (
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
