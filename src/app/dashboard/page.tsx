"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, Truck, PackageCheck, Package, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Clock, MapPin, AlertCircle, Users, FileText, CalendarDays, Fuel, ChevronRight, MoreHorizontal, Phone, Navigation, Star, Target, Activity, Zap } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Area, AreaChart, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import Link from "next/link"

const monthlyRevenue = [
  { month: "January", revenue: 18600 },
  { month: "February", revenue: 30500 },
  { month: "March", revenue: 23700 },
  { month: "April", revenue: 27300 },
  { month: "May", revenue: 20900 },
  { month: "June", revenue: 21400 },
];

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const weeklyActivity = [
  { day: "Mon", activity: 20 },
  { day: "Tue", activity: 25 },
  { day: "Wed", activity: 18 },
  { day: "Thu", activity: 30 },
  { day: "Fri", activity: 28 },
  { day: "Sat", activity: 15 },
  { day: "Sun", activity: 12 },
];

const activityChartConfig = {
  activity: {
    label: "Load Activity",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Performance data
const performanceData = [
  { metric: "On-Time Delivery", value: 94, target: 95 },
  { metric: "Customer Satisfaction", value: 88, target: 90 },
  { metric: "Load Utilization", value: 78, target: 85 },
  { metric: "Driver Efficiency", value: 92, target: 90 },
];

// Load status data for pie chart
const loadStatusData = [
  { name: "In Transit", value: 42, color: "#3B82F6" },
  { name: "Delivered", value: 28, color: "#10B981" },
  { name: "Pending", value: 18, color: "#F59E0B" },
  { name: "Booked", value: 12, color: "#8B5CF6" },
];

// Active loads list
const activeLoads = [
  { id: "LD-2026-001", origin: "Los Angeles, CA", destination: "Phoenix, AZ", driver: "John D.", eta: "2h 30m", status: "in-transit", progress: 65 },
  { id: "LD-2026-002", origin: "Seattle, WA", destination: "Portland, OR", driver: "Sarah M.", eta: "45m", status: "in-transit", progress: 85 },
  { id: "LD-2026-003", origin: "Houston, TX", destination: "Dallas, TX", driver: "Mike R.", eta: "1h 15m", status: "in-transit", progress: 45 },
  { id: "LD-2026-004", origin: "Chicago, IL", destination: "Detroit, MI", driver: "Emily S.", eta: "3h 00m", status: "in-transit", progress: 30 },
];

// Top drivers
const topDrivers = [
  { name: "John Davidson", loads: 45, rating: 4.9, revenue: "$28,500", avatar: "JD" },
  { name: "Sarah Mitchell", loads: 42, rating: 4.8, revenue: "$26,200", avatar: "SM" },
  { name: "Mike Rodriguez", loads: 38, rating: 4.7, revenue: "$24,100", avatar: "MR" },
];

// Recent alerts
const recentAlerts = [
  { type: "warning", message: "Load LD-2026-015 delayed by 2 hours", time: "5 min ago" },
  { type: "success", message: "Load LD-2026-012 delivered successfully", time: "15 min ago" },
  { type: "info", message: "New load request from ABC Logistics", time: "30 min ago" },
  { type: "warning", message: "Driver John D. approaching HOS limit", time: "1 hour ago" },
];

// Stat card component for consistent styling
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
}

function StatCard({ title, value, change, changeType, icon: Icon, iconBgColor, iconColor }: StatCardProps) {
  return (
    <Card className="stat-card border-slate-200/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2.5 rounded-xl shadow-sm", iconBgColor)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {changeType === "positive" ? (
            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
          ) : changeType === "negative" ? (
            <ArrowDownRight className="h-3 w-3 text-red-500" />
          ) : null}
          <p className={cn(
            "text-xs font-medium",
            changeType === "positive" && "text-emerald-600",
            changeType === "negative" && "text-red-600",
            changeType === "neutral" && "text-muted-foreground"
          )}>
            {change}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 overflow-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome back! Here's what's happening with your fleet.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarDays className="w-4 h-4 mr-2" />
              Today
            </Button>
            <Link href="/loads/new">
              <Button size="sm" className="bg-brand-600 hover:bg-brand-700">
                <Package className="w-4 h-4 mr-2" />
                New Load
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Revenue"
            value="$142,580"
            change="+20.1% from last month"
            changeType="positive"
            icon={DollarSign}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
          />
          <StatCard 
            title="Active Loads"
            value="42"
            change="+8 since yesterday"
            changeType="positive"
            icon={Package}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard 
            title="Available Trucks"
            value="18"
            change="-2 assigned today"
            changeType="neutral"
            icon={Truck}
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
          />
          <StatCard 
            title="Delivered This Week"
            value="127"
            change="+15% from last week"
            changeType="positive"
            icon={PackageCheck}
            iconBgColor="bg-accent/10"
            iconColor="text-accent"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-4">
            {/* Revenue Chart */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-headline">Revenue Overview</CardTitle>
                    <CardDescription className="text-xs">
                      Monthly revenue for the last 6 months
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Revenue</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer config={revenueChartConfig} className="h-[220px] w-full">
                  <BarChart data={monthlyRevenue} accessibilityLayer>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                      fontSize={11}
                    />
                     <YAxis
                      tickFormatter={(value) => `$${Number(value) / 1000}k`}
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      />
                    <ChartTooltip
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Two Column Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Load Status Breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-headline">Load Status</CardTitle>
                  <CardDescription className="text-xs">Current load distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-[120px] h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={loadStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={55}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {loadStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2">
                      {loadStatusData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-muted-foreground">{item.name}</span>
                          </div>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-headline">Performance</CardTitle>
                  <CardDescription className="text-xs">Key metrics vs targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {performanceData.map((item) => (
                    <div key={item.metric} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{item.metric}</span>
                        <span className={cn(
                          "font-medium",
                          item.value >= item.target ? "text-green-600" : "text-amber-600"
                        )}>
                          {item.value}%
                        </span>
                      </div>
                      <Progress 
                        value={item.value} 
                        className="h-1.5" 
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Active Loads Table */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-headline">Active Loads</CardTitle>
                    <CardDescription className="text-xs">Real-time load tracking</CardDescription>
                  </div>
                  <Link href="/loads">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeLoads.map((load) => (
                    <div key={load.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Truck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-medium">{load.id}</span>
                          <Badge variant="inTransit" className="text-[10px] px-1.5 py-0">In Transit</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {load.origin} → {load.destination}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">{load.driver}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          ETA: {load.eta}
                        </p>
                      </div>
                      <div className="w-16">
                        <Progress value={load.progress} className="h-1.5" />
                        <p className="text-[10px] text-muted-foreground text-center mt-0.5">{load.progress}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-brand-600 to-brand-700 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Today's Performance</p>
                    <p className="text-2xl font-bold">$12,450</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <p className="text-lg font-bold">8</p>
                    <p className="text-xs opacity-80">Loads Delivered</p>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <p className="text-lg font-bold">2,340</p>
                    <p className="text-xs opacity-80">Miles Covered</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-headline flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Alerts
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px]">4 New</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentAlerts.map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1.5",
                      alert.type === "warning" && "bg-amber-500",
                      alert.type === "success" && "bg-green-500",
                      alert.type === "info" && "bg-blue-500"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs">{alert.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Drivers */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-headline">Top Drivers</CardTitle>
                  <Link href="/fleet">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {topDrivers.map((driver, idx) => (
                  <div key={driver.name} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-brand-100 text-brand-700 text-xs">
                          {driver.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {idx === 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                          <Star className="w-2.5 h-2.5 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{driver.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{driver.loads} loads</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          {driver.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-green-600">{driver.revenue}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-headline">Weekly Activity</CardTitle>
                <CardDescription className="text-xs">
                  Load activity over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={activityChartConfig} className="h-[140px] w-full">
                  <AreaChart
                    data={weeklyActivity}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={10}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Area
                      dataKey="activity"
                      type="monotone"
                      stroke="var(--color-activity)"
                      strokeWidth={2}
                      fill="url(#activityGradient)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
