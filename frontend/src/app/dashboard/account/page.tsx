"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { 
  User, 
  CreditCard, 
  Wallet, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Star,
  CheckCircle2,
  Briefcase,
  Search,
  Zap,
  TrendingUp,
  X,
  Sparkles,
  MapPin
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "@/lib/axios";
import Image from "next/image";
import { cn } from "@/lib/utils";

const APP_VERSION = "v2.2026.08.16.00.22";

export default function AccountPage() {
  const { user, role, logout, setUser } = useAuthStore();
  const router = useRouter();

  const [stats, setStats] = useState({
    completed_jobs: 0,
    active_jobs: 0,
    rating: 5.0,
    total_reviews: 0,
    total_earnings: 0,
    completion_rate: 100
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  useEffect(() => {
    // Check if user already dismissed this specific version update
    if (typeof window !== "undefined") {
      const dismissedVer = localStorage.getItem("kerjain_dismissed_update_version");
      if (dismissedVer !== APP_VERSION) {
        setShowUpdateBanner(true);
      }
    }

    const fetchProfileStats = async () => {
      try {
        const res = await axiosInstance.get("/users/profile");
        if (res.data?.data) {
          const profileData = res.data.data;
          if (profileData.stats) {
            setStats(profileData.stats);
          }
          setUser({ ...user, ...profileData });
        }
      } catch (err) {
        console.error("Error fetching account profile stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchProfileStats();
  }, []);

  const handleDismissUpdate = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kerjain_dismissed_update_version", APP_VERSION);
    }
    setShowUpdateBanner(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    logout();
    toast.success("Berhasil keluar");
    router.push("/login");
  };

  const partnerQuickCards = [
    { name: "Cari Job", href: "/dashboard/jobs/search", icon: Search, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Job Aktif", href: "/dashboard/jobs/assigned", icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Keuangan", href: "/dashboard/payments", icon: Wallet, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Bantuan CS", href: "/help", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const menuGroups = [
    {
      title: "Akun Saya",
      items: [
        { name: "Profil & Foto", href: "/profile", icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
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
      <PageContainer className="max-w-2xl px-4 pb-24 overflow-x-hidden w-full max-w-full">
        
        {/* Profile Header Card */}
        <div className="bg-card/90 backdrop-blur-md border rounded-3xl p-6 mb-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500/20 via-primary/15 to-teal-500/10 rounded-t-3xl" />
          
          <div className="relative pt-6 flex flex-col items-center text-center">
            {/* Avatar with Kerjain Logo Badge */}
            <div className="relative mb-3">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage 
                  src={user?.avatar_url || user?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || "User"}`} 
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-extrabold bg-primary text-primary-foreground">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-background border border-border/80 p-0.5 shadow-md flex items-center justify-center">
                <Image
                  src="/logo-notext.png"
                  alt="Kerjain"
                  width={20}
                  height={20}
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("Logo_Here")) {
                      target.src = "/Logo_Here/Kerjain_Logo_NO Text.png";
                    }
                  }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">{user?.name || "Pengguna"}</h2>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {role === "consumer" ? "Konsumen" : "Mitra"}
              </span>
              {(user as any)?.gender && (
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1",
                  (user as any)?.gender === "FEMALE" ? "bg-pink-500/10 text-pink-600 dark:text-pink-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                )}>
                  {(user as any)?.gender === "FEMALE" ? "👩 Wanita" : "👨 Pria"}
                </span>
              )}
              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-black tracking-wide flex items-center gap-1.5 shadow-2xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                <span>★ {Number(stats.rating || 5.0).toFixed(2)}</span>
                {stats.total_reviews > 0 && (
                  <span className="text-[10px] opacity-80 font-bold">({stats.total_reviews})</span>
                )}
              </span>
            </div>

            {/* Actual Real Stats for Partner from Supabase */}
            {role === "partner" && (
              <div className="grid grid-cols-2 gap-4 mt-6 w-full border-t border-border/70 pt-5">
                <Link href="/dashboard/history" className="text-center p-3 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-colors group">
                  <p className="text-xs text-muted-foreground font-semibold mb-1 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Rating Aktual
                  </p>
                  {loadingStats ? (
                    <div className="space-y-1.5 py-1">
                      <Skeleton className="h-6 w-16 mx-auto rounded-lg" />
                      <Skeleton className="h-3 w-20 mx-auto rounded-md" />
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                      <p className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                        {stats.rating > 0 ? stats.rating.toFixed(1) : "5.0"} <span className="text-amber-500 text-sm">★</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{stats.total_reviews} ulasan diterima</p>
                    </motion.div>
                  )}
                </Link>

                <Link href="/dashboard/history" className="text-center p-3 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-colors group">
                  <p className="text-xs text-muted-foreground font-semibold mb-1 flex items-center justify-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Job Selesai
                  </p>
                  {loadingStats ? (
                    <div className="space-y-1.5 py-1">
                      <Skeleton className="h-6 w-16 mx-auto rounded-lg" />
                      <Skeleton className="h-3 w-20 mx-auto rounded-md" />
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                      <p className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                        {stats.completed_jobs} <span className="text-sm font-medium text-muted-foreground">Order</span>
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.completion_rate}% tingkat sukses</p>
                    </motion.div>
                  )}
                </Link>
              </div>
            )}

          </div>
        </div>

        {/* Release Notes / App Update Notification Bar (Above Quick Menu, Dismissable with X) */}
        <AnimatePresence>
          {showUpdateBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
              transition={{ duration: 0.25 }}
              className="mb-5 w-full bg-gradient-to-br from-emerald-500/15 via-primary/10 to-teal-500/5 border border-primary/30 rounded-3xl p-4 sm:p-5 shadow-sm relative overflow-hidden"
            >
              {/* Background Ambient Glow */}
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2.5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xs font-bold text-xs shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-foreground">Pembaruan Aplikasi Terbaru</span>
                      <span className="bg-primary/20 text-primary px-2 py-0.2 rounded-md text-[10px] font-extrabold border border-primary/30">
                        {APP_VERSION}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                      Fitur & penyempurnaan baru telah aktif di akun Anda:
                    </p>
                  </div>
                </div>

                {/* Close Button X */}
                <button
                  type="button"
                  onClick={handleDismissUpdate}
                  className="w-7 h-7 rounded-xl bg-card/80 hover:bg-muted border border-border/80 text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs"
                  title="Tutup pemberitahuan"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User-friendly Release Notes List */}
              <div className="space-y-1.5 pt-1 text-xs text-foreground/90 relative z-10">
                <div className="flex items-start gap-2 bg-card/60 rounded-xl p-2 border border-border/40">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong className="text-foreground">Grafik Keuangan Baru:</strong> Pantau penghasilan QRIS dan Tunai secara real-time dengan grafik naik-turun yang responsif.
                  </p>
                </div>

                <div className="flex items-start gap-2 bg-card/60 rounded-xl p-2 border border-border/40">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong className="text-foreground">Badge Rating Lengkap:</strong> Penilaian bintang aktual Anda kini tampil detail dengan 2 desimal (misal: ★ 5,00).
                  </p>
                </div>

                <div className="flex items-start gap-2 bg-card/60 rounded-xl p-2 border border-border/40">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong className="text-foreground">Jarak & Durasi Pintar:</strong> Estimasi jarak ke lokasi pekerjaan lebih presisi serta waktu posting kini langsung terlihat jelas.
                  </p>
                </div>

                <div className="flex items-start gap-2 bg-card/60 rounded-xl p-2 border border-border/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong className="text-foreground">Tampilan Lebih Padat:</strong> Kartu tugas berjalan kini lebih ringkas, hemat ruang, dan nyaman dilihat.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Partner Quick Action in 1 Unified Single Card */}
        {role === "partner" && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Menu Cepat Mitra
            </h3>
            <div className="bg-card/90 backdrop-blur-md border border-border/80 rounded-3xl p-4 sm:p-5 shadow-sm">
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {partnerQuickCards.map((item, i) => (
                  <Link key={i} href={item.href} className="block group text-center">
                    <motion.div
                      whileHover={{ y: -3, scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl hover:bg-muted/40 transition-colors"
                    >
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-foreground line-clamp-1">
                        {item.name}
                      </span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menus */}
        <div className="space-y-6">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                {group.title}
              </h3>
              <div className="bg-card/90 backdrop-blur-md border rounded-3xl overflow-hidden shadow-sm divide-y divide-border/60">
                {group.items.map((item, itemIdx) => (
                  <Link 
                    key={itemIdx} 
                    href={item.href}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <div className="pt-2 pb-6">
            <Button 
              variant="outline" 
              className="w-full rounded-2xl h-14 text-base font-bold text-destructive border-destructive/30 bg-destructive/5 hover:bg-destructive/10 hover:text-destructive shadow-sm cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Keluar dari Akun
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4 font-medium">
              Kerjain App {APP_VERSION}
            </p>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
