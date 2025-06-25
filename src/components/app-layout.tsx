import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { Button } from './ui/button';
import { PanelLeft } from 'lucide-react';
import { useSidebar } from './ui/sidebar';

function Header() {
    const { toggleSidebar } = useSidebar();
    return (
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:hidden"
                onClick={toggleSidebar}
            >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
            </Button>
            <h1 className="flex-1 text-xl font-semibold font-headline">FocusFreight</h1>
        </header>
    );
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar>
            <MainSidebar />
        </Sidebar>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <Header />
            <SidebarInset>
                {children}
            </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
