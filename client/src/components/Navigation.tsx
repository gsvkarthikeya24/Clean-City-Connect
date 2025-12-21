import { Link, useLocation } from "wouter";
import { Home, PlusCircle, Map as MapIcon, MessageSquareText, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/report", icon: PlusCircle, label: "Report" },
    { href: "/map", icon: MapIcon, label: "Map" },
    { href: "/assistant", icon: MessageSquareText, label: "Assistant" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border flex items-center justify-around z-50 pb-safe">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
              location === item.href 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Desktop Sidebar / Header */}
      <header className="hidden md:flex fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border h-16 items-center px-6 justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-bold text-xl font-display">
             C
           </div>
           <span className="font-display font-bold text-xl tracking-tight text-foreground">
             CleanCity<span className="text-primary">Connect</span>
           </span>
        </div>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50",
                location === item.href ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          {user && (
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              Logout
            </Button>
          )}
        </nav>
      </header>

      {/* Spacer for desktop header */}
      <div className="hidden md:block h-16" />
    </>
  );
}
