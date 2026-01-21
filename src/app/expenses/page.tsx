"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
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
  Receipt,
  Plus,
  Download,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Fuel,
  Wrench,
  Shield,
  Truck,
  Phone,
  Home,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Upload,
  Camera,
  Tag,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Expense categories
const expenseCategories = [
  { id: "fuel", name: "Fuel", icon: Fuel, color: "bg-amber-100 text-amber-600" },
  { id: "maintenance", name: "Maintenance & Repairs", icon: Wrench, color: "bg-blue-100 text-blue-600" },
  { id: "insurance", name: "Insurance", icon: Shield, color: "bg-purple-100 text-purple-600" },
  { id: "truck_payment", name: "Truck Payment", icon: Truck, color: "bg-slate-100 text-slate-600" },
  { id: "tolls", name: "Tolls", icon: CreditCard, color: "bg-green-100 text-green-600" },
  { id: "permits", name: "Permits & Licenses", icon: FileText, color: "bg-cyan-100 text-cyan-600" },
  { id: "phone", name: "Phone & Communication", icon: Phone, color: "bg-pink-100 text-pink-600" },
  { id: "lodging", name: "Lodging", icon: Home, color: "bg-orange-100 text-orange-600" },
  { id: "meals", name: "Meals (Per Diem)", icon: Receipt, color: "bg-red-100 text-red-600" },
  { id: "other", name: "Other", icon: Tag, color: "bg-gray-100 text-gray-600" },
];

// Sample expenses
const initialExpenses = [
  { id: 1, date: "2026-01-18", category: "fuel", description: "Diesel - Pilot Travel Center", amount: 432.98, vendor: "Pilot", location: "Amarillo, TX", taxDeductible: true, loadId: "LD-98821" },
  { id: 2, date: "2026-01-17", category: "tolls", description: "Oklahoma Turnpike", amount: 28.50, vendor: "OK Turnpike", location: "Oklahoma", taxDeductible: true, loadId: "LD-98821" },
  { id: 3, date: "2026-01-16", category: "fuel", description: "Diesel - Love's Travel Stop", amount: 416.06, vendor: "Love's", location: "Albuquerque, NM", taxDeductible: true, loadId: "LD-98820" },
  { id: 4, date: "2026-01-15", category: "maintenance", description: "Oil change and filter", amount: 285.00, vendor: "SpeedCo", location: "Flagstaff, AZ", taxDeductible: true, loadId: null },
  { id: 5, date: "2026-01-14", category: "fuel", description: "Diesel - Flying J", amount: 488.70, vendor: "Flying J", location: "Flagstaff, AZ", taxDeductible: true, loadId: "LD-98819" },
  { id: 6, date: "2026-01-13", category: "lodging", description: "Truck stop shower", amount: 15.00, vendor: "Pilot", location: "Kingman, AZ", taxDeductible: true, loadId: null },
  { id: 7, date: "2026-01-12", category: "meals", description: "Per diem", amount: 69.00, vendor: "Various", location: "On the road", taxDeductible: true, loadId: null },
  { id: 8, date: "2026-01-10", category: "fuel", description: "Diesel - TA Travel Center", amount: 540.35, vendor: "TA", location: "Barstow, CA", taxDeductible: true, loadId: "LD-98818" },
  { id: 9, date: "2026-01-10", category: "tolls", description: "California weigh station bypass", amount: 12.99, vendor: "Drivewyze", location: "California", taxDeductible: true, loadId: "LD-98818" },
  { id: 10, date: "2026-01-08", category: "maintenance", description: "Tire rotation and inspection", amount: 175.00, vendor: "TA Truck Service", location: "Las Vegas, NV", taxDeductible: true, loadId: null },
  { id: 11, date: "2026-01-05", category: "insurance", description: "Monthly truck insurance", amount: 1850.00, vendor: "Progressive Commercial", location: "N/A", taxDeductible: true, loadId: null },
  { id: 12, date: "2026-01-01", category: "truck_payment", description: "Monthly truck payment", amount: 2450.00, vendor: "Daimler Truck Financial", location: "N/A", taxDeductible: false, loadId: null },
  { id: 13, date: "2026-01-01", category: "phone", description: "Verizon wireless", amount: 125.00, vendor: "Verizon", location: "N/A", taxDeductible: true, loadId: null },
  { id: 14, date: "2026-01-01", category: "permits", description: "2290 Heavy Vehicle Use Tax (monthly)", amount: 100.00, vendor: "IRS", location: "N/A", taxDeductible: true, loadId: null },
];

// Monthly summary data
const monthlySummary = [
  { month: "Jan 2026", revenue: 18450, expenses: 7488, profit: 10962, miles: 8250, costPerMile: 0.91 },
  { month: "Dec 2025", revenue: 22100, expenses: 8234, profit: 13866, miles: 9800, costPerMile: 0.84 },
  { month: "Nov 2025", revenue: 19875, expenses: 7650, profit: 12225, miles: 8950, costPerMile: 0.85 },
  { month: "Oct 2025", revenue: 21200, expenses: 7890, profit: 13310, miles: 9200, costPerMile: 0.86 },
];

export default function ExpensesPage() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("month");

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const fuelExpenses = expenses.filter(e => e.category === "fuel").reduce((sum, e) => sum + e.amount, 0);
  const maintenanceExpenses = expenses.filter(e => e.category === "maintenance").reduce((sum, e) => sum + e.amount, 0);
  const fixedExpenses = expenses.filter(e => ["insurance", "truck_payment", "permits", "phone"].includes(e.category)).reduce((sum, e) => sum + e.amount, 0);
  const taxDeductible = expenses.filter(e => e.taxDeductible).reduce((sum, e) => sum + e.amount, 0);

  // Calculate category breakdown
  const categoryBreakdown = expenseCategories.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0),
    count: expenses.filter(e => e.category === cat.id).length,
  })).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total);

  // Filter expenses
  const filteredExpenses = expenses.filter(e => {
    if (selectedCategory !== "all" && e.category !== selectedCategory) return false;
    if (searchQuery && !e.description.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !e.vendor.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getCategoryInfo = (categoryId: string) => {
    return expenseCategories.find(c => c.id === categoryId) || expenseCategories[expenseCategories.length - 1];
  };

  const handleAddExpense = () => {
    setAddExpenseOpen(false);
    toast({
      title: "Expense Added",
      description: "Your expense has been recorded successfully.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your expense report is being generated.",
    });
  };

  // Sample revenue for profit calculation
  const currentMonthRevenue = 18450;
  const currentProfit = currentMonthRevenue - totalExpenses;
  const profitMargin = (currentProfit / currentMonthRevenue) * 100;

  return (
    <AppLayout>
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 md:w-6 md:h-6 text-brand-blue-600 flex-shrink-0" />
                <span className="truncate">Expense Tracker</span>
              </h1>
              <p className="text-muted-foreground text-xs md:text-sm mt-0.5 md:mt-1 hidden sm:block">
                Track and categorize all business expenses for tax deductions
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[120px] md:w-[140px] text-sm">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport} size="sm" className="md:size-default">
                <Download className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Export</span>
              </Button>
              <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                    <Plus className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Add Expense</span>
                    <span className="md:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                    <DialogDescription>
                      Record a business expense for tracking and tax purposes
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" defaultValue="2026-01-19" />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="number" step="0.01" placeholder="0.00" className="pl-9" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <div className="flex items-center gap-2">
                                <cat.icon className="h-4 w-4" />
                                {cat.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input placeholder="What was this expense for?" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Vendor</Label>
                        <Input placeholder="Business name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input placeholder="City, State" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Link to Load (Optional)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select load" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LD-98821">LD-98821 - Chicago to Dallas</SelectItem>
                          <SelectItem value="LD-98820">LD-98820 - Phoenix to LA</SelectItem>
                          <SelectItem value="LD-98819">LD-98819 - Seattle to Denver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="taxDeductible" defaultChecked />
                      <label htmlFor="taxDeductible" className="text-sm font-medium leading-none">
                        Tax Deductible
                      </label>
                    </div>
                    <div className="space-y-2">
                      <Label>Receipt (Optional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-slate-50 cursor-pointer">
                        <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or take a photo
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddExpenseOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddExpense} className="bg-blue-600 hover:bg-blue-700">Add Expense</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 overflow-x-auto">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Expenses</p>
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
                    <p className="text-2xl font-bold">${fuelExpenses.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Fuel Costs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Wrench className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${maintenanceExpenses.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Maintenance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${fixedExpenses.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Fixed Costs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={profitMargin > 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${profitMargin > 0 ? "bg-green-100" : "bg-red-100"}`}>
                    {profitMargin > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${profitMargin > 0 ? "text-green-600" : "text-red-600"}`}>
                      ${Math.abs(currentProfit).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Net Profit ({profitMargin.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Expense List */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Receipt className="w-4 h-4" />
                        Recent Expenses
                      </CardTitle>
                      <CardDescription>
                        {filteredExpenses.length} expenses totaling ${filteredExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search expenses..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 w-[200px]"
                        />
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {expenseCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
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
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Load</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.map((expense) => {
                        const category = getCategoryInfo(expense.category);
                        const CategoryIcon = category.icon;
                        return (
                          <TableRow key={expense.id}>
                            <TableCell className="text-sm">
                              {new Date(expense.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium", category.color)}>
                                <CategoryIcon className="h-3 w-3" />
                                {category.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{expense.description}</p>
                                <p className="text-xs text-muted-foreground">{expense.location}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{expense.vendor}</TableCell>
                            <TableCell>
                              {expense.loadId ? (
                                <Badge variant="outline" className="text-xs">{expense.loadId}</Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {expense.taxDeductible && (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                )}
                                <span className="font-medium">${expense.amount.toFixed(2)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Receipt
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 order-1 lg:order-2">
              {/* Category Breakdown */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    Spending by Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoryBreakdown.map((cat) => {
                    const percentage = (cat.total / totalExpenses) * 100;
                    const CategoryIcon = cat.icon;
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={cn("p-1 rounded", cat.color)}>
                              <CategoryIcon className="h-3 w-3" />
                            </div>
                            <span>{cat.name}</span>
                          </div>
                          <span className="font-medium">${cat.total.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", cat.color.replace("text-", "bg-").replace("-100", "-500"))}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Tax Deduction Summary */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Tax Deductions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      ${taxDeductible.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Total deductible expenses
                    </p>
                    <Separator className="my-3 bg-green-200" />
                    <p className="text-xs text-green-600">
                      Est. tax savings @ 25%: <span className="font-bold">${(taxDeductible * 0.25).toLocaleString()}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Per Mile Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Cost Per Mile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Expenses</span>
                    <span className="font-medium">${totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Est. Miles (MTD)</span>
                    <span className="font-medium">8,250</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cost/Mile</span>
                    <span className="text-lg font-bold text-blue-600">$0.91</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Industry avg: $1.38/mile
                  </p>
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Monthly Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {monthlySummary.slice(0, 4).map((month, i) => (
                    <div key={month.month} className="flex items-center justify-between text-sm">
                      <span className={i === 0 ? "font-medium" : "text-muted-foreground"}>
                        {month.month}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${month.expenses.toLocaleString()}</span>
                        {i > 0 && (
                          <Badge 
                            variant="outline" 
                            className={month.expenses < monthlySummary[i-1].expenses ? "text-green-600" : "text-red-600"}
                          >
                            {month.expenses < monthlySummary[i-1].expenses ? (
                              <ArrowDownRight className="h-3 w-3" />
                            ) : (
                              <ArrowUpRight className="h-3 w-3" />
                            )}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
