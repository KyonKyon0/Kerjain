"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  History,
  User,
  Briefcase,
  Wallet,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

type MenuItem = {
  name: string;
  href: string;
  icon: any;
  isHighlight?: boolean;
};

export function MobileNav() {
  const pathname = usePathname();
  const { role } = useAuthStore();

  const consumerMenu: MenuItem[] = [
    { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pekerjaan", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Buat", href: "/dashboard/jobs/create", icon: PlusCircle, isHighlight: true },
    { name: "Pesan", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Akun", href: "/dashboard/account", icon: User },
  ];

  const partnerMenu: MenuItem[] = [
    { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
    { name: "Cari Job", href: "/dashboard/jobs/search", icon: Search },
    { name: "Pesan", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Keuangan", href: "/dashboard/payments", icon: Wallet },
    { name: "Akun", href: "/dashboard/account", icon: User },
  ];

  const menu = role === "partner" ? partnerMenu : consumerMenu;

  // Specific priority matching so "/dashboard/jobs/create" activates "Buat", not "Pekerjaan"
  const activeIndex = menu.findIndex((item) => {
    if (item.href === "/dashboard") {
      return pathname === "/dashboard";
    }
    if (item.href === "/dashboard/jobs/create") {
      return pathname === "/dashboard/jobs/create";
    }
    if (item.href === "/dashboard/jobs") {
      return (
        pathname === "/dashboard/jobs" ||
        (pathname.startsWith("/dashboard/jobs") && !pathname.startsWith("/dashboard/jobs/create"))
      );
    }
    return pathname === item.href || pathname.startsWith(item.href);
  });

  return (
    <div 
      className="md:hidden fixed bottom-3 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[420px] h-[66px] z-50 select-none pointer-events-none"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Floating Liquid Glass Dock Container */}
      <nav className="relative w-full h-full bg-card/95 backdrop-blur-2xl border border-border/80 rounded-[26px] p-1.5 grid grid-cols-5 items-center shadow-[0_12px_36px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.08)_inset] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)] pointer-events-auto z-10">
        
        {menu.map((item, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div key={item.name} className="relative w-full h-full flex items-center justify-center px-0.5">
              {item.isHighlight ? (
                <Link
                  href={item.href}
                  className="relative w-full h-full flex items-center justify-center outline-none group z-10 transition-all"
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.94 }}
                    className={cn(
                      "w-full h-[52px] rounded-[18px] flex flex-col items-center justify-center transition-all duration-200 shadow-xs",
                      isActive
                        ? "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-900/30 ring-1 ring-emerald-400/40"
                        : "bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                    )}
                  >
                    <item.icon className="h-6 w-6 stroke-[2.4] transition-transform duration-200 group-hover:scale-105" />
                    <span className="text-[10px] font-black tracking-tight leading-none mt-0.5">
                      {item.name}
                    </span>
                  </motion.div>
                </Link>
              ) : (
                <Link
                  href={item.href}
                  className="relative w-full h-full rounded-2xl flex flex-col items-center justify-center outline-none group z-10 transition-all"
                >
                  {/* Active Liquid Glass Pill - perfectly framed inside the cell */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDockPill"
                      className="absolute inset-x-1 inset-y-0.5 rounded-[18px] bg-primary/15 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 backdrop-blur-md shadow-sm pointer-events-none z-0"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 28,
                      }}
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <item.icon 
                      className={cn(
                        "h-5 w-5 transition-all duration-200",
                        isActive ? "text-primary scale-110 drop-shadow-sm" : "text-muted-foreground group-hover:text-foreground"
                      )} 
                    />
                    <span className={cn(
                      "text-[10px] mt-0.5 transition-all duration-200 tracking-tight leading-none",
                      isActive ? "font-extrabold text-primary" : "font-medium text-muted-foreground group-hover:text-foreground"
                    )}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              )}
            </div>


          );
        })}
      </nav>
    </div>
  );
}
