"use client";

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
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";

type MenuItem = {
  name: string;
  href: string;
  icon: any;
  isPrimary?: boolean;
};

export function MobileNav() {
  const pathname = usePathname();
  const { role } = useAuthStore();

  const consumerMenu: MenuItem[] = [
    { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pekerjaan", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Buat", href: "/dashboard/jobs/create", icon: PlusCircle, isPrimary: true },
    { name: "Riwayat", href: "/dashboard/history", icon: History },
    { name: "Akun", href: "/dashboard/account", icon: User },
  ];

  const partnerMenu: MenuItem[] = [
    { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
    { name: "Cari Job", href: "/dashboard/jobs/search", icon: Search },
    { name: "Pekerjaan", href: "/dashboard/jobs/assigned", icon: Briefcase },
    { name: "Riwayat", href: "/dashboard/history", icon: History },
    { name: "Akun", href: "/dashboard/account", icon: User },
  ];

  const menu = role === "partner" ? partnerMenu : consumerMenu;

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-md border-t flex items-center justify-around px-1 z-30 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        {menu.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.isPrimary) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative -top-5 flex flex-col items-center justify-center group outline-none"
              >
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-background"
                >
                  <item.icon className="w-6 h-6" />
                </motion.div>
                <span className="text-[10px] font-bold text-foreground mt-1">{item.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all outline-none",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <item.icon className={cn("h-6 w-6 transition-transform", isActive ? "fill-primary/20 scale-110" : "")} />
              </div>
              <span className={cn("text-[10px] transition-all", isActive ? "font-bold" : "font-medium")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Spacer to prevent content hiding behind bottom nav */}
      <div className="h-20 md:hidden w-full shrink-0" />
    </>
  );
}
