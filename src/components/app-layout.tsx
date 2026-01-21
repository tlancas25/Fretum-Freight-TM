"use client"

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { CircleUser, Search, ChevronLeft, ChevronRight, LogOut, Settings, HelpCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

function Header() {
    const { toggleSidebar, state } = useSidebar();
    const { signOut } = useAuth();
    const router = useRouter();
    const isCollapsed = state === "collapsed";

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };
    
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-white/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-20 shadow-sm">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={toggleSidebar}
                        >
                            {isCollapsed ? (
                                <ChevronRight className="h-5 w-5" />
                            ) : (
                                <ChevronLeft className="h-5 w-5" />
                            )}
                            <span className="sr-only">Toggle Sidebar</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{isCollapsed ? "Expand sidebar" : "Collapse sidebar"} (Ctrl+B)</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className="w-full flex-1">
                <form>
                    <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search the platform..."
                        className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                    />
                    </div>
                </form>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open('mailto:support@fretumfreight.com', '_blank')} className="cursor-pointer">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <MainSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pb-20 md:pb-0">
          {children}
        </main>
      </SidebarInset>
      <MobileBottomNav />
    </SidebarProvider>
  );
}
