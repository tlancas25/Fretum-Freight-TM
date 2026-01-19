"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  KanbanSquare,
  MapPin,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/loads", label: "Loads", icon: Package },
  { href: "/dispatch", label: "Dispatch", icon: KanbanSquare },
  { href: "/tracking", label: "Track", icon: MapPin },
];

interface MobileBottomNavProps {
  moreContent?: React.ReactNode;
}

export function MobileBottomNav({ moreContent }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // Don't show on login page
  if (pathname === "/login" || pathname === "/") {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full min-w-[64px] transition-colors",
                "active:bg-slate-100 touch-manipulation",
                isActive
                  ? "text-brand-600"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 mb-1 transition-transform",
                  isActive && "scale-110"
                )}
              />
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More button with sheet */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full min-w-[64px] transition-colors",
                "active:bg-slate-100 touch-manipulation",
                "text-slate-500 hover:text-slate-700"
              )}
            >
              <Menu className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
            <div className="pt-4">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-6" />
              {moreContent || (
                <div className="grid grid-cols-3 gap-4 p-4">
                  <MobileNavItem href="/customers" icon="👥" label="Customers" onClick={() => setMoreOpen(false)} />
                  <MobileNavItem href="/invoices" icon="📄" label="Invoices" onClick={() => setMoreOpen(false)} />
                  <MobileNavItem href="/fleet" icon="🚛" label="Fleet" onClick={() => setMoreOpen(false)} />
                  <MobileNavItem href="/bol" icon="📋" label="BOL" onClick={() => setMoreOpen(false)} />
                  <MobileNavItem href="/loads/extract" icon="🤖" label="Doc AI" onClick={() => setMoreOpen(false)} />
                  <MobileNavItem href="/reports" icon="📊" label="Reports" onClick={() => setMoreOpen(false)} />
                  <MobileNavItem href="/settlements" icon="💰" label="Settlements" onClick={() => setMoreOpen(false)} />
                  <MobileNavItem href="/expenses" icon="💳" label="Expenses" onClick={() => setMoreOpen(false)} />
                  <MobileNavItem href="/ifta" icon="⛽" label="IFTA" onClick={() => setMoreOpen(false)} />
                  <MobileNavItem href="/integrations" icon="🔌" label="Integrations" onClick={() => setMoreOpen(false)} />
                  <MobileNavItem href="/settings" icon="⚙️" label="Settings" onClick={() => setMoreOpen(false)} />
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

function MobileNavItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation"
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-xs font-medium text-slate-700">{label}</span>
    </Link>
  );
}
