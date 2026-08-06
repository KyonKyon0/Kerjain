"use client";

import { useAuthStore } from "@/store/auth.store";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, CreditCard, HelpCircle, ChevronRight, Bell, Shield, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { motion } from "framer-motion";

export default function AccountPage() {
  const { user, role, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    logout();
    toast.success("Berhasil keluar");
    router.push("/login");
  };

  const menuGroups = [
    {
      title: "Akun Saya",
      items: [
        { name: "Profil", href: "/profile", icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
        { name: "Metode Pembayaran", href: "/dashboard/payments", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { name: "Saldo & Transaksi", href: "/dashboard/payments", icon: Wallet, color: "text-amber-500", bg: "bg-amber-500/10" },
      ]
    },
    {
      title: "Umum",
      items: [
        { name: "Pengaturan Aplikasi", href: "/settings", icon: Settings, color: "text-gray-500", bg: "bg-gray-500/10" },
        { name: "Notifikasi", href: "/notifications", icon: Bell, color: "text-purple-500", bg: "bg-purple-500/10" },
        { name: "Privasi & Keamanan", href: "/settings", icon: Shield, color: "text-green-500", bg: "bg-green-500/10" },
        { name: "Pusat Bantuan", href: "/help", icon: HelpCircle, color: "text-red-500", bg: "bg-red-500/10" },
      ]
    }
  ];

  return (
    <DashboardLayout>
      <PageContainer className="max-w-2xl px-0 md:px-4">
        {/* Profile Header */}
        <div className="bg-card md:border md:rounded-3xl p-6 mb-2 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-primary/5 rounded-t-3xl md:rounded-t-3xl"></div>
          
          <div className="relative pt-8 flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 border-4 border-background shadow-md mb-4">
              <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || "User"}`} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-extrabold text-foreground">{user?.name || "Pengguna"}</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {role === "consumer" ? "Konsumen" : "Mitra"}
              </span>
              <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Aktif
              </span>
            </div>
            
            {/* Quick Stats for Partner */}
            {role === "partner" && (
              <div className="flex justify-center gap-6 mt-6 w-full border-t border-border pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Rating</p>
                  <p className="text-xl font-bold text-foreground">4.9 <span className="text-amber-500">★</span></p>
                </div>
                <div className="w-px h-10 bg-border"></div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Selesai</p>
                  <p className="text-xl font-bold text-foreground">12 <span className="text-sm font-medium text-muted-foreground">Job</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu Groups */}
        <div className="px-4 md:px-0 space-y-6 mt-6">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-2">
                {group.title}
              </h3>
              <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
                {group.items.map((item, itemIdx) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors ${itemIdx !== group.items.length - 1 ? 'border-b border-border/50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.bg} ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-[15px]">{item.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <div className="pt-4 pb-12">
            <Button 
              variant="outline" 
              className="w-full rounded-2xl h-14 text-base font-bold text-destructive border-destructive/30 bg-destructive/5 hover:bg-destructive/10 hover:text-destructive shadow-sm"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Keluar
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Kerjain App v1.0.0
            </p>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
