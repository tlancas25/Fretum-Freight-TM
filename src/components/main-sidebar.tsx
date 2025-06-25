"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Truck,
  KanbanSquare,
  FileText,
  Users,
  LogOut,
  UserCircle,
  TruckIcon,
  ScanLine
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
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/loads", label: "Loads", icon: Truck },
  { href: "/dispatch", label: "Dispatch", icon: KanbanSquare },
  { href: "/loads/extract", label: "Document AI", icon: ScanLine },
  { href: "/invoices", label: "Invoicing", icon: FileText },
  { href: "/fleet", label: "Fleet", icon: Users },
]

export function MainSidebar() {
  const pathname = usePathname()

  return (
      <div className="flex h-full flex-col">
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 py-2">
            <TruckIcon className="h-8 w-8 text-primary" />
            <span className="font-headline text-lg font-semibold text-primary">FocusFreight</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="flex-1 overflow-y-auto">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
            <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">Admin User</span>
                    <span className="text-xs text-muted-foreground">admin@focusfreight.com</span>
                </div>
            </div>
            <Link href="/login">
                <SidebarMenuButton tooltip="Logout">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </SidebarMenuButton>
            </Link>
        </SidebarFooter>
      </div>
  )
}
