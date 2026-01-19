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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Truck,
  Package,
  Users,
  MapPin,
  Clock,
  Fuel,
  Target,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  FileText,
  Printer,
  Mail,
  RefreshCw,
  Filter,
  Layers,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Award,
  Star,
  Route,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

// Revenue by Month
const revenueData = [
  { month: "Jul", revenue: 125000, expenses: 82000, profit: 43000 },
  { month: "Aug", revenue: 142000, expenses: 89000, profit: 53000 },
  { month: "Sep", revenue: 138000, expenses: 85000, profit: 53000 },
  { month: "Oct", revenue: 156000, expenses: 92000, profit: 64000 },
  { month: "Nov", revenue: 168000, expenses: 98000, profit: 70000 },
  { month: "Dec", revenue: 185000, expenses: 105000, profit: 80000 },
];

// Loads by Status
const loadStatusData = [
  { name: "Delivered", value: 245, color: "#10B981" },
  { name: "In Transit", value: 42, color: "#3B82F6" },
  { name: "At Pickup", value: 18, color: "#8B5CF6" },
  { name: "Pending", value: 28, color: "#F59E0B" },
  { name: "Cancelled", value: 12, color: "#EF4444" },
];

// Loads per Day (last 14 days)
const dailyLoadsData = [
  { day: "Dec 24", loads: 12, revenue: 18500 },
  { day: "Dec 25", loads: 5, revenue: 7200 },
  { day: "Dec 26", loads: 8, revenue: 12400 },
  { day: "Dec 27", loads: 14, revenue: 21800 },
  { day: "Dec 28", loads: 16, revenue: 24200 },
  { day: "Dec 29", loads: 11, revenue: 16800 },
  { day: "Dec 30", loads: 15, revenue: 23100 },
  { day: "Dec 31", loads: 9, revenue: 13500 },
  { day: "Jan 1", loads: 4, revenue: 6100 },
  { day: "Jan 2", loads: 10, revenue: 15400 },
  { day: "Jan 3", loads: 13, revenue: 19800 },
  { day: "Jan 4", loads: 15, revenue: 22600 },
  { day: "Jan 5", loads: 17, revenue: 25800 },
  { day: "Jan 6", loads: 14, revenue: 21200 },
];

// Revenue by Lane
const topLanes = [
  { origin: "Los Angeles, CA", destination: "Phoenix, AZ", loads: 45, revenue: 82500, avgRate: 1833, trend: 12 },
  { origin: "Chicago, IL", destination: "Detroit, MI", loads: 38, revenue: 68400, avgRate: 1800, trend: 8 },
  { origin: "Dallas, TX", destination: "Houston, TX", loads: 52, revenue: 62400, avgRate: 1200, trend: -3 },
  { origin: "Atlanta, GA", destination: "Nashville, TN", loads: 31, revenue: 55800, avgRate: 1800, trend: 15 },
  { origin: "Seattle, WA", destination: "Portland, OR", loads: 28, revenue: 42000, avgRate: 1500, trend: 5 },
];

// Top Drivers
const topDrivers = [
  { name: "John Davidson", loads: 42, miles: 28500, revenue: 75600, rating: 4.9, onTime: 98 },
  { name: "Sarah Mitchell", loads: 38, miles: 25200, revenue: 68400, rating: 4.8, onTime: 96 },
  { name: "Mike Rodriguez", loads: 35, miles: 23800, revenue: 63000, rating: 4.7, onTime: 94 },
  { name: "Emily Chen", loads: 33, miles: 22100, revenue: 59400, rating: 4.9, onTime: 99 },
  { name: "Robert Wilson", loads: 31, miles: 21000, revenue: 55800, rating: 4.6, onTime: 92 },
];

// Customer Stats
const topCustomers = [
  { name: "ABC Logistics", loads: 28, revenue: 84000, avgRate: 3000, growth: 25 },
  { name: "XYZ Shipping", loads: 24, revenue: 67200, avgRate: 2800, growth: 18 },
  { name: "Fast Freight LLC", loads: 22, revenue: 61600, avgRate: 2800, growth: 12 },
  { name: "Prime Carriers Inc", loads: 19, revenue: 53200, avgRate: 2800, growth: -5 },
  { name: "Global Transport", loads: 17, revenue: 47600, avgRate: 2800, growth: 8 },
];

// Equipment Utilization
const equipmentData = [
  { type: "Dry Van", total: 25, active: 22, utilization: 88 },
  { type: "Reefer", total: 12, active: 10, utilization: 83 },
  { type: "Flatbed", total: 8, active: 6, utilization: 75 },
  { type: "Box Truck", total: 5, active: 4, utilization: 80 },
];

// Expense Breakdown
const expenseData = [
  { name: "Fuel", value: 42000, color: "#EF4444" },
  { name: "Driver Pay", value: 35000, color: "#3B82F6" },
  { name: "Maintenance", value: 12000, color: "#F59E0B" },
  { name: "Insurance", value: 8000, color: "#10B981" },
  { name: "Other", value: 8000, color: "#8B5CF6" },
];

export default function ReportsPage() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("last30");

  // Calculate summary stats
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalProfit = revenueData.reduce((sum, d) => sum + d.profit, 0);
  const totalLoads = loadStatusData.reduce((sum, d) => sum + d.value, 0);
  const avgRevenuePerLoad = Math.round(totalRevenue / totalLoads);

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report...`,
    });
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-brand-600" />
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Comprehensive insights into your business performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[160px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="last7">Last 7 Days</SelectItem>
                <SelectItem value="last30">Last 30 Days</SelectItem>
                <SelectItem value="last90">Last 90 Days</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  <Layers className="w-4 h-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-brand-50 to-white border-brand-100">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-brand-700 mt-1">
                    ${(totalRevenue / 1000).toFixed(0)}k
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>18.5% vs last period</span>
                  </div>
                </div>
                <div className="p-2.5 bg-brand-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-brand-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">
                    ${(totalProfit / 1000).toFixed(0)}k
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>24.2% margin</span>
                  </div>
                </div>
                <div className="p-2.5 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Loads</p>
                  <p className="text-2xl font-bold text-purple-700 mt-1">{totalLoads}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>12% vs last period</span>
                  </div>
                </div>
                <div className="p-2.5 bg-purple-100 rounded-lg">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Revenue/Load</p>
                  <p className="text-2xl font-bold text-amber-700 mt-1">
                    ${avgRevenuePerLoad.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>5.8% increase</span>
                  </div>
                </div>
                <div className="p-2.5 bg-amber-100 rounded-lg">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Revenue & Profit Trend</CardTitle>
                  <CardDescription>Monthly financial performance</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Download Chart</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0" }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#0066CC" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Profit" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Load Status Pie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Load Status Distribution</CardTitle>
              <CardDescription>Current load breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={loadStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {loadStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [value, "Loads"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {loadStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                    <span className="text-xs font-medium ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="lanes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="lanes">Top Lanes</TabsTrigger>
            <TabsTrigger value="drivers">Driver Performance</TabsTrigger>
            <TabsTrigger value="customers">Customer Analysis</TabsTrigger>
            <TabsTrigger value="equipment">Equipment Utilization</TabsTrigger>
            <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
          </TabsList>

          {/* Top Lanes Tab */}
          <TabsContent value="lanes" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Performing Lanes</CardTitle>
                <CardDescription>Revenue by origin-destination pairs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topLanes.map((lane, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <MapPin className="w-3 h-3 text-green-600" />
                          {lane.origin}
                          <ChevronRight className="w-3 h-3 text-muted-foreground" />
                          <MapPin className="w-3 h-3 text-red-600" />
                          {lane.destination}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {lane.loads} loads • Avg. ${lane.avgRate}/load
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${lane.revenue.toLocaleString()}</p>
                        <div className={cn(
                          "flex items-center justify-end gap-1 text-xs",
                          lane.trend > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {lane.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                          {Math.abs(lane.trend)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Driver Performance Tab */}
          <TabsContent value="drivers" className="space-y-4">
            <div className="grid grid-cols-5 gap-4">
              {topDrivers.map((driver, index) => (
                <Card key={index} className={cn(index === 0 && "border-amber-300 bg-amber-50/50")}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      {index === 0 && (
                        <Award className="w-5 h-5 text-amber-500" />
                      )}
                      <div className="flex items-center gap-1 ml-auto">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium">{driver.rating}</span>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">{driver.name}</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {driver.loads} loads • {(driver.miles / 1000).toFixed(1)}k miles
                    </p>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">On-time Rate</span>
                          <span className="font-medium">{driver.onTime}%</span>
                        </div>
                        <Progress value={driver.onTime} className="h-1.5" />
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-lg font-bold text-brand-600">
                          ${driver.revenue.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Total Revenue</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Customer Analysis Tab */}
          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Customers by Revenue</CardTitle>
                <CardDescription>Your most valuable customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCustomers.map((customer, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg bg-slate-50"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-100">
                        <Users className="w-5 h-5 text-brand-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.loads} loads • Avg. ${customer.avgRate}/load
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">${customer.revenue.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">Revenue</p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                        customer.growth > 0 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      )}>
                        {customer.growth > 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownLeft className="w-3 h-3" />
                        )}
                        {Math.abs(customer.growth)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Utilization Tab */}
          <TabsContent value="equipment" className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {equipmentData.map((equipment) => (
                <Card key={equipment.type}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-brand-100 rounded-lg">
                        <Truck className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{equipment.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {equipment.active} of {equipment.total} active
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Utilization</span>
                        <span className="font-medium">{equipment.utilization}%</span>
                      </div>
                      <Progress 
                        value={equipment.utilization} 
                        className={cn(
                          "h-2",
                          equipment.utilization >= 80 ? "[&>div]:bg-green-500" :
                          equipment.utilization >= 60 ? "[&>div]:bg-amber-500" :
                          "[&>div]:bg-red-500"
                        )} 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Expense Breakdown Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Expense Distribution</CardTitle>
                  <CardDescription>Where your money goes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                        contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Expense Details</CardTitle>
                  <CardDescription>Monthly breakdown by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expenseData.map((expense) => {
                      const total = expenseData.reduce((sum, e) => sum + e.value, 0);
                      const percentage = (expense.value / total) * 100;
                      return (
                        <div key={expense.name} className="flex items-center gap-4">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: expense.color }} 
                          />
                          <span className="text-sm font-medium w-24">{expense.name}</span>
                          <div className="flex-1">
                            <Progress 
                              value={percentage} 
                              className="h-2"
                              style={{ 
                                ['--progress-color' as string]: expense.color,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold w-20 text-right">
                            ${expense.value.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="font-semibold">Total Expenses</span>
                    <span className="text-lg font-bold text-red-600">
                      ${expenseData.reduce((sum, e) => sum + e.value, 0).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Daily Activity Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Daily Activity</CardTitle>
                <CardDescription>Loads and revenue over the last 14 days</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-500" />
                  <span className="text-muted-foreground">Loads</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Revenue</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dailyLoadsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "revenue" ? `$${value.toLocaleString()}` : value,
                    name === "revenue" ? "Revenue" : "Loads"
                  ]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0" }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="loads"
                  stroke="#0066CC"
                  fill="#0066CC"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
