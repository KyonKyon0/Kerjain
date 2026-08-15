"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useConsumerJobs } from "@/hooks/useJobs";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { 
  PlusCircle, 
  History, 
  CreditCard, 
  ChevronRight, 
  Search, 
  Zap, 
  MapPin, 
  UserCheck, 
  Star, 
  ShieldCheck, 
  Home,
  Wallet,
  Briefcase,
  CheckCircle,
  ArrowUpRight,
  Sparkles,
  ShoppingBag,
  Wrench,
  Paintbrush
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { JobCard } from "@/components/jobs/JobCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";

export function ConsumerDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { data: jobs = [], isLoading: loadingJobs } = useConsumerJobs();

  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    completed_jobs: 0,
    active_jobs: 0,
    total_jobs: 0,
    total_spending: 0,
  });

  useEffect(() => {
    const fetchConsumerStats = async () => {
      try {
        const res = await axiosInstance.get("/users/profile");
        if (res.data?.data?.stats) {
          setStats(res.data.data.stats);
        }
      } catch (err) {
        console.error("Error fetching consumer stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchConsumerStats();
  }, []);

  const activeJobsList = jobs.filter((j: any) => 
    ['PUBLISHED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION', 'IN_PROGRESS'].includes(j.status)
  );

  const completedJobsList = jobs.filter((j: any) => j.status === 'COMPLETED');
  
  // Use real stats from Supabase fallbacking to array calculations
  const activeJobsCount = stats.active_jobs > 0 ? stats.active_jobs : activeJobsList.length;
  const completedJobsCount = stats.completed_jobs > 0 ? stats.completed_jobs : completedJobsList.length;
  const totalJobsCount = stats.total_jobs > 0 ? stats.total_jobs : jobs.length;
  const spending = stats.total_spending > 0 
    ? stats.total_spending 
    : completedJobsList.reduce((acc: number, j: any) => acc + Number(j.rewardAmount ?? j.reward_amount ?? 0), 0);

  const consumerStatCards = [
    {
      title: "Pekerjaan Aktif",
      value: `${activeJobsCount}`,
      suffix: "Job",
      subtitle: activeJobsCount > 0 ? "Sedang berjalan" : "Tidak ada pesanan",
      icon: Briefcase,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/25 hover:border-emerald-500/50",
      href: "/dashboard/jobs/assigned",
    },
    {
      title: "Total Pengeluaran",
      value: `Rp ${spending.toLocaleString("id-ID")}`,
      subtitle: "Pekerjaan selesai",
      icon: Wallet,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      borderColor: "border-blue-500/25 hover:border-blue-500/50",
      href: "/dashboard/payments",
    },
    {
      title: "Job Selesai",
      value: `${completedJobsCount}`,
      suffix: "Job",
      subtitle: "Berhasil tuntas",
      icon: CheckCircle,
      iconColor: "text-teal-500",
      iconBg: "bg-teal-500/10",
      borderColor: "border-teal-500/25 hover:border-teal-500/50",
      href: "/dashboard/history",
    },
    {
      title: "Total Pesanan",
      value: `${totalJobsCount}`,
      suffix: "Total",
      subtitle: "Riwayat permintaan",
      icon: ShoppingBag,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
      borderColor: "border-purple-500/25 hover:border-purple-500/50",
      href: "/dashboard/history",
    },
  ];

  const quickActions = [
    { 
      name: "Buat Pekerjaan", 
      href: "/dashboard/jobs/create", 
      icon: PlusCircle, 
      color: "text-emerald-500", 
      bg: "bg-emerald-500/10", 
    },
    { 
      name: "Pantau Job", 
      href: "/dashboard/jobs/assigned", 
      icon: Briefcase, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10", 
    },
    { 
      name: "Riwayat Order", 
      href: "/dashboard/history", 
      icon: History, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10", 
    },
    { 
      name: "Bantuan CS", 
      href: "/help", 
      icon: Zap, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10", 
    },
  ];

  return (
    <PageContainer>
      {/* 1. Header Card Nama & Status Konsumen */}
      <div className="mb-6 bg-card/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-border/80 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Konsumen Aktif • Siap Memesan
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
          Halo, {user?.name?.split(' ')[0] || "Konsumen"}! 👋
        </h1>
        <p className="text-muted-foreground font-medium text-xs sm:text-sm mt-0.5">
          Butuh bantuan apa hari ini? Unggah pekerjaan Anda dan mitra terdekat siap membantu.
        </p>
      </div>

      {/* 2. 4 Metric / Stat Cards (Pekerjaan Aktif, Pengeluaran, Job Selesai, Total Pesanan) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {consumerStatCards.map((card, i) => (
          <Link key={i} href={card.href} className="block group">
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`p-4 rounded-2xl md:rounded-3xl bg-card/95 border ${card.borderColor} shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <card.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] md:text-xs font-semibold text-muted-foreground line-clamp-1">{card.title}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </div>

              <div>
                {loadingStats ? (
                  <Skeleton className="h-7 w-20 rounded-lg mb-1" />
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg md:text-xl font-black text-foreground tracking-tight line-clamp-1">
                      {card.value}
                    </span>
                    {card.suffix && (
                      <span className="text-xs font-bold text-muted-foreground">{card.suffix}</span>
                    )}
                  </div>
                )}
                <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground/80 line-clamp-1">
                  {card.subtitle}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* 3. 4 Tombol Cepat dalam 1 Card Tunggal Ditaruh di Bawah Card Statistik */}
      <div className="bg-card/90 backdrop-blur-md border border-border/80 rounded-3xl p-4 sm:p-5 mb-8 shadow-sm">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {quickActions.map((item, i) => (
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Job Tracker */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Pekerjaan yang Sedang Berjalan ({activeJobsList.length})
              </h3>
              {activeJobsList.length > 2 && (
                <Link href="/dashboard/jobs/assigned" className="text-xs font-bold text-primary hover:underline">
                  Lihat Semua
                </Link>
              )}
            </div>

            {activeJobsList.length === 0 ? (
              <div className="bg-card/70 border border-dashed rounded-3xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Tidak Ada Pekerjaan Aktif</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Saat ini Anda belum memiliki pekerjaan yang sedang berjalan. Buat pekerjaan baru untuk menemukan mitra.
                </p>
                <Button 
                  onClick={() => router.push("/dashboard/jobs/create")}
                  className="rounded-xl font-bold text-xs h-10 px-4 bg-primary hover:bg-emerald-600"
                >
                  + Buat Pekerjaan Sekarang
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeJobsList.slice(0, 2).map((job: any) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </section>

          {/* Popular Categories */}
          <section>
            <h3 className="font-extrabold text-lg mb-4 text-foreground">Layanan Populer</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Perbaikan Rumah", category: "Perbaikan", icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10" },
                { name: "Kebersihan", category: "Bersih-bersih", icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { name: "Angkat Barang", category: "Angkat Barang", icon: ShoppingBag, color: "text-purple-500", bg: "bg-purple-500/10" },
              ].map((cat, i) => (
                <Link key={i} href={`/dashboard/jobs/create`}>
                  <motion.div 
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-card border rounded-2xl p-3 sm:p-4 text-center hover:border-primary/50 hover:shadow-md transition-all shadow-sm cursor-pointer group h-full flex flex-col items-center justify-center min-h-[96px]"
                  >
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight text-center block break-words">
                      {cat.name}
                    </span>
                  </motion.div>
                </Link>

              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Safety & Escrow Banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <div className="p-2 rounded-xl bg-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm">Garansi Aman Kerjain</h4>
            </div>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed">
              Dana pembayaran Anda disimpan aman dalam rekening bersama (escrow) dan hanya diteruskan ke mitra setelah Anda mengonfirmasi pekerjaan selesai.
            </p>
          </div>

          {/* Quick Help Card */}
          <div className="bg-card border rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm">Pusat Layanan Cepat</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Membutuhkan panduan posting atau ingin berkonsultasi mengenai pesanan Anda?
            </p>
            <Button 
              variant="outline" 
              onClick={() => router.push("/help")}
              className="w-full rounded-2xl h-11 text-xs font-bold"
            >
              Hubungi Bantuan CS 24/7
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
