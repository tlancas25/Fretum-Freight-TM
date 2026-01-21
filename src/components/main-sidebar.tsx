"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  Home,
  Truck,
  KanbanSquare,
  FileText,
  Users,
  LogOut,
  ScanLine,
  Settings,
  Plug,
  BarChart3,
  Building2,
  HelpCircle,
  Bell,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Wallet,
  MapPin,
  Shield,
  Headphones,
  BookOpen,
  MessageSquare,
  Mail,
  Fuel,
  Receipt,
  Calculator
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { cn } from "@/lib/utils"

// Menu item type with optional badge
interface MenuItem {
  href: string
  label: string
  icon: React.ElementType
  badge?: number | string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "inTransit" | "delivered"
}

const mainMenuItems: MenuItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/loads", label: "Loads", icon: Truck, badge: 24 },
  { href: "/dispatch", label: "Dispatch Board", icon: KanbanSquare, badge: 8, badgeVariant: "inTransit" },
  { href: "/customers", label: "Customers", icon: Building2 },
]

const operationsMenuItems: MenuItem[] = [
  { href: "/loads/extract", label: "Document AI", icon: ScanLine },
  { href: "/bol", label: "BOL Generator", icon: FileText },
  { href: "/invoices", label: "Invoicing", icon: FileText, badge: 5 },
  { href: "/settlements", label: "Driver Settlements", icon: Wallet },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/ifta", label: "IFTA Reporting", icon: Fuel },
  { href: "/fleet", label: "Fleet Management", icon: Users },
  { href: "/tracking", label: "Live Tracking", icon: MapPin },
  { href: "/reports", label: "Analytics", icon: BarChart3 },
]

const systemMenuItems: MenuItem[] = [
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function MainSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { state } = useSidebar()
  const { signOut } = useAuth()
  const isCollapsed = state === "collapsed"

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const renderMenuItem = (item: MenuItem) => {
    const isActive = pathname === item.href || 
      (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))
    
    const menuButton = (
      <SidebarMenuButton
        isActive={isActive}
        tooltip={isCollapsed ? item.label : undefined}
        className={cn(
          "w-full justify-start gap-3 transition-all duration-200 group relative",
          isActive 
            ? "bg-sidebar-accent text-sidebar-primary font-medium" 
            : "hover:bg-sidebar-accent/50"
        )}
      >
        <item.icon className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-sidebar-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"
        )} />
        <span className={cn(
          "flex-1 truncate",
          isCollapsed && "sr-only"
        )}>
          {item.label}
        </span>
        {item.badge && !isCollapsed && (
          <Badge 
            variant={item.badgeVariant || "secondary"} 
            className="ml-auto h-5 min-w-[20px] px-1.5 text-[10px] font-medium shrink-0"
          >
            {item.badge}
          </Badge>
        )}
      </SidebarMenuButton>
    )
    
    return (
      <SidebarMenuItem key={item.href}>
        <Link href={item.href} className="w-full">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                {menuButton}
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-2">
                {item.label}
                {item.badge && (
                  <Badge variant={item.badgeVariant || "secondary"} className="text-[10px]">
                    {item.badge}
                  </Badge>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            menuButton
          )}
        </Link>
      </SidebarMenuItem>
    )
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <TooltipProvider delayDuration={0}>
        {/* Logo Header */}
        <SidebarHeader className={cn(
          "flex h-16 items-center border-b border-sidebar-border",
          isCollapsed ? "px-2 justify-center" : "px-4"
        )}>
          <Link href="/" className="flex items-center gap-3 font-semibold group">
            <div className={cn(
              "flex items-center justify-center transition-transform group-hover:scale-105",
              isCollapsed ? "h-8 w-8" : "h-10 w-10"
            )}>
              <img 
                src="/logo-icon.PNG" 
                alt="Fretum-Freight" 
                className="h-full w-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-headline font-bold text-sidebar-foreground tracking-tight">
                  Fretum-Freight
                </span>
                <span className="text-[10px] uppercase tracking-widest text-sidebar-muted font-medium">
                  Enterprise TMS
                </span>
              </div>
            )}
          </Link>
        </SidebarHeader>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="px-3 py-3 border-b border-sidebar-border">
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/loads/new" className="flex-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full h-9 gap-2 text-xs font-medium bg-sidebar-accent text-sidebar-foreground border-sidebar-border hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:border-sidebar-primary"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      New Load
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Create new load</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/quotes/new" className="flex-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full h-9 gap-2 text-xs font-medium bg-sidebar-accent text-sidebar-foreground border-sidebar-border hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:border-sidebar-primary"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Quick Quote
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Create quick quote</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Collapsed Quick Actions */}
        {isCollapsed && (
          <div className="py-2 border-b border-sidebar-border flex flex-col items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/loads/new">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>New Load</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
        
        {/* Main Navigation */}
        <SidebarContent className="flex-1 overflow-y-auto sidebar-scroll">
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
                Main
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className={cn(isCollapsed ? "px-1" : "px-2")}>
                {mainMenuItems.map(renderMenuItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
                Operations
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className={cn(isCollapsed ? "px-1" : "px-2")}>
                {operationsMenuItems.map(renderMenuItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
                System
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className={cn(isCollapsed ? "px-1" : "px-2")}>
                {systemMenuItems.map(renderMenuItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        {/* Footer with User Profile */}
        <SidebarFooter className="border-t border-sidebar-border p-2">
          {/* Help Icons - Expanded */}
          {!isCollapsed && (
            <div className="flex items-center gap-1 mb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/help">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top"><p>Help Center</p></TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/docs">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground">
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top"><p>Documentation</p></TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground relative ml-auto">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>Notifications</p></TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors group",
                isCollapsed && "justify-center"
              )}>
                <Avatar className={cn(
                  "border-2 border-sidebar-border",
                  isCollapsed ? "h-8 w-8" : "h-9 w-9"
                )}>
                  <AvatarImage src="/avatars/user.png" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-brand-blue-500 to-brand-green-500 text-white text-sm font-medium">
                    JD
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-sidebar-foreground truncate">John Dispatcher</p>
                      <p className="text-xs text-sidebar-muted truncate">Admin</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-sidebar-muted group-hover:text-sidebar-foreground transition-colors" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isCollapsed ? "center" : "end"} side={isCollapsed ? "right" : "top"} className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">John Dispatcher</p>
                  <p className="text-xs text-muted-foreground">john@fretumfreight.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings?tab=notifications')} className="cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                Notification Preferences
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings?tab=profile')} className="cursor-pointer">
                <Mail className="mr-2 h-4 w-4" />
                Email Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </TooltipProvider>
    </Sidebar>
  )
}
