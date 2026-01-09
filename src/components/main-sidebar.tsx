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
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

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
    <div className="hidden border-r bg-sidebar md:block h-full">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <SidebarHeader className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <TruckIcon className="h-6 w-6 text-primary" />
            <span className="text-primary-foreground">FocusFreight</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="flex-1">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
            <Card>
                <CardHeader className="p-2 pt-0 md:p-4">
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                        Unlock all features and get unlimited access to our support team.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                    <Button size="sm" className="w-full">Upgrade</Button>
                </CardContent>
            </Card>
        </SidebarFooter>
      </div>
    </div>
  )
}
