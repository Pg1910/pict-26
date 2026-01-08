import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BarChart3, 
  Search, 
  ShieldAlert, 
  LogOut,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Investigation", href: "/investigation", icon: Search },
];

export function Sidebar() {
  const [location] = useLocation();

  const NavContent = () => (
    <div className="flex flex-col h-full" role="navigation" aria-label="Primary">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">FinGuard AI</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer group transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator */}
                <span
                  className={cn(
                    "absolute left-0 top-0 h-full w-0.5 rounded-r transition-all duration-300",
                    isActive ? "bg-primary/70" : "bg-transparent group-hover:bg-white/10"
                  )}
                  aria-hidden="true"
                />
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "group-hover:text-foreground")} />
                <span className={cn("font-medium transition-colors", isActive && "text-foreground")}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <Link href="/">
          <div className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive cursor-pointer transition-colors rounded-lg hover:bg-white/5">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background border-border transition-colors focus-visible:ring-2 focus-visible:ring-primary/30" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-card border-r border-border data-[state=open]:duration-300">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 bg-card border-r border-border/50 shadow-2xl z-40 transition-[width,transform,opacity] duration-300">
        <NavContent />
      </aside>
    </>
  );
}
