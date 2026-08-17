"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  History,
  User,
  Briefcase,
  Zap,
  Wallet,
  MessageSquare
} from "lucide-react";

import Image from "next/image";

const CONSUMER_SIDEBAR_MENU = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pekerjaan", href: "/dashboard/jobs", icon: Briefcase },
  { name: "Buat Pekerjaan", href: "/dashboard/jobs/create", icon: PlusCircle },
  { name: "Pesan", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Riwayat", href: "/dashboard/history", icon: History },
  { name: "Akun", href: "/dashboard/account", icon: User },
];

const PARTNER_SIDEBAR_MENU = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { name: "Cari Job", href: "/dashboard/jobs/search", icon: Search },
  { name: "Pekerjaan Saya", href: "/dashboard/jobs/assigned", icon: Briefcase },
  { name: "Pesan", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Riwayat", href: "/dashboard/history", icon: History },
  { name: "Keuangan", href: "/dashboard/payments", icon: Wallet },
  { name: "Akun", href: "/dashboard/account", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useAuthStore();

  const menu = role === "partner" ? PARTNER_SIDEBAR_MENU : CONSUMER_SIDEBAR_MENU;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r fixed inset-y-0 z-20">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2.5 outline-none group">
          <div className="relative w-9 h-9 rounded-2xl bg-primary/10 p-1.5 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
            <Image
              src="/logo-notext.png"
              alt="Kerjain Logo"
              width={30}
              height={30}
              priority
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes("Logo_Here")) {
                  target.src = "/Logo_Here/Kerjain_Logo_NO Text.png";
                }
              }}
            />
          </div>
          <span className="font-extrabold text-foreground text-2xl tracking-tight">
            Kerjain
          </span>
        </Link>
      </div>


      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 mt-2 px-2">
          Menu Utama
        </div>
        {menu.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard/chat" && pathname.startsWith("/dashboard/chat"));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3.5 text-[15px] font-semibold rounded-2xl transition-all group outline-none",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("mr-4 h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border">
        <div className="bg-primary/5 rounded-2xl p-5 text-center border border-primary/10">
          <p className="text-sm font-bold text-primary">Butuh Bantuan?</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4 font-medium">Hubungi CS kami 24/7</p>
          <Link href="/help" className="block w-full">
            <button className="w-full py-2.5 bg-background text-primary text-sm font-bold rounded-xl shadow-sm border hover:bg-muted transition-colors outline-none cursor-pointer">
              Pusat Bantuan
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}

