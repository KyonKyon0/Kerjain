"use client";

import { useAuthStore } from "@/store/auth.store";
import { Zap, Bell, Search as SearchIcon } from "lucide-react";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

export function TopNav() {
  const { user } = useAuthStore();
  
  // Basic greeting based on time (optional nice touch)
  const hour = new Date().getHours();
  let greeting = "Selamat Malam";
  if (hour >= 5 && hour < 12) greeting = "Selamat Pagi";
  else if (hour >= 12 && hour < 15) greeting = "Selamat Siang";
  else if (hour >= 15 && hour < 18) greeting = "Selamat Sore";

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur-md sticky top-0 z-10 w-full flex items-center justify-between px-4 sm:px-6 md:px-8">
      {/* Mobile Title & Greeting */}
      <div className="md:hidden flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-xl shadow-sm">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{greeting},</span>
          <span className="font-extrabold text-foreground text-sm tracking-tight leading-none">
            {user?.name?.split(' ')[0] || "Guest"}
          </span>
        </div>
      </div>
      
      {/* Desktop Greeting (Since Sidebar handles branding) */}
      <div className="hidden md:flex items-center">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{greeting},</span>
          <span className="font-extrabold text-foreground text-lg tracking-tight leading-none">
            {user?.name || "Guest"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Search Icon Mobile (Desktop uses full search bar if needed, but for Grab style, an icon is enough) */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-muted/50 text-foreground hover:bg-muted transition-colors outline-none">
          <SearchIcon className="w-5 h-5" />
        </button>
        
        {/* Notification */}
        <div className="relative">
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
}
