"use client";

import { useAuthStore } from "@/store/auth.store";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import Image from "next/image";
import Link from "next/link";

export function TopNav() {
  const { user } = useAuthStore();
  
  // Basic greeting based on time
  const hour = new Date().getHours();
  let greeting = "Selamat Malam";
  if (hour >= 5 && hour < 12) greeting = "Selamat Pagi";
  else if (hour >= 12 && hour < 15) greeting = "Selamat Siang";
  else if (hour >= 15 && hour < 18) greeting = "Selamat Sore";

  return (
    <header className="h-16 border-b border-border/80 bg-background/85 backdrop-blur-xl sticky top-0 z-40 w-full flex items-center justify-between px-4 sm:px-6 md:px-8 shadow-xs transition-all">
      {/* Mobile Title & Greeting with Kerjain Logo NO Text */}
      <div className="md:hidden flex items-center gap-2.5">
        <Link href="/dashboard" className="relative w-8 h-8 rounded-xl bg-primary/10 p-1 flex items-center justify-center border border-primary/20 shrink-0">
          <Image
            src="/logo-notext.png"
            alt="Kerjain Logo"
            width={26}
            height={26}
            priority
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes("Logo_Here")) {
                target.src = "/Logo_Here/Kerjain_Logo_NO Text.png";
              }
            }}
          />
        </Link>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider leading-tight">{greeting},</span>
          <span className="font-extrabold text-foreground text-sm tracking-tight leading-tight">
            {user?.name?.split(' ')[0] || "Pengguna"}
          </span>
        </div>
      </div>

      {/* Desktop Greeting (Since Sidebar handles branding) */}
      <div className="hidden md:flex items-center">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{greeting},</span>
          <span className="font-extrabold text-foreground text-lg tracking-tight leading-none">
            {user?.name || "Pengguna"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notification Dropdown */}
        <div className="relative">
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
}
