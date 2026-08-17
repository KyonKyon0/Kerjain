"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { usePartnerJobs, useSearchJobs } from "@/hooks/useJobs";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { 
  Search, 
  History, 
  Briefcase, 
  MapPin, 
  Wallet, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  ChevronRight, 
  Zap,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { motion } from "framer-motion";
import { JobCard } from "@/components/jobs/JobCard";
import { axiosInstance } from "@/lib/axios";
import { ZapEnergyToggle } from "@/components/dashboard/partner/ZapEnergyToggle";
import { useUserLocation } from "@/hooks/useUserLocation";
import { calculateHaversineDistance, formatDistanceString } from "@/lib/distance";
import { formatRelativeDuration } from "@/lib/utils";

const PARTNER_QUICK_ACTIONS = [
  { 
    name: "Cari Job", 
    href: "/dashboard/jobs/search", 
    icon: Search, 
    color: "text-blue-500", 
    bg: "bg-blue-500/10", 
  },
  { 
    name: "Job Aktif", 
    href: "/dashboard/jobs/assigned", 
    icon: Briefcase, 
    color: "text-emerald-500", 
    bg: "bg-emerald-500/10", 
  },
  { 
    name: "Keuangan", 
    href: "/dashboard/payments", 
    icon: Wallet, 
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

export function PartnerDashboard() {
  const { user } = useAuthStore();
  const { data: myJobs = [] } = usePartnerJobs();
  const { data: availableJobs = [] } = useSearchJobs();
  const { lat: userLat, lng: userLng } = useUserLocation();

  const [isOnline, setIsOnline] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const [stats, setStats] = useState({
    completed_jobs: 0,
    active_jobs: 0,
    rating: 0.0,
    total_reviews: 0,
    total_earnings: 0,
    completion_rate: 100
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/users/profile");
        if (res.data?.data?.stats) {
          setStats(res.data.data.stats);
        }
      } catch (err) {
        console.error("Error fetching partner stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const { activeJobsList, performanceCards } = React.useMemo(() => {
    const active = myJobs.filter((j: any) => 
      ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION', 'IN_PROGRESS'].includes(j.status)
    );

    const completed = myJobs.filter((j: any) => j.status === 'COMPLETED');
    const completedJobsCount = stats.completed_jobs > 0 ? stats.completed_jobs : completed.length;
    const completionRate = stats.completion_rate;
    const earnings = stats.total_earnings > 0 
      ? stats.total_earnings 
      : completed.reduce((acc: any, job: any) => acc + Number(job.rewardAmount ?? job.reward_amount ?? 0), 0);

    const cards = [
      {
        title: "Total Pendapatan",
        value: `Rp ${earnings.toLocaleString("id-ID")}`,
        subtitle: "Siap dicairkan",
        icon: Wallet,
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-500/10",
        borderColor: "border-emerald-500/25 hover:border-emerald-500/50",
        href: "/dashboard/payments",
      },
      {
        title: "Rating Bintang",
        value: stats.total_reviews > 0 ? stats.rating.toFixed(1) : "0.0",
        suffix: "★",
        subtitle: stats.total_reviews > 0 ? `${stats.total_reviews} ulasan diterima` : "Mitra Baru (0 Ulasan)",
        icon: Star,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-500/10",
        borderColor: "border-amber-500/25 hover:border-amber-500/50",
        href: "/dashboard/history",
      },
      {
        title: "Tingkat Sukses",
        value: `${completionRate}%`,
        subtitle: `${completedJobsCount} orderan`,
        icon: CheckCircle,
        iconColor: "text-teal-500",
        iconBg: "bg-teal-500/10",
        borderColor: "border-teal-500/25 hover:border-teal-500/50",
        href: "/dashboard/history",
      },
      {
        title: "Job Selesai",
        value: `${completedJobsCount}`,
        suffix: "Job",
        subtitle: "Pekerjaan sukses",
        icon: Briefcase,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-500/10",
        borderColor: "border-blue-500/25 hover:border-blue-500/50",
        href: "/dashboard/history",
      },
    ];

    return { activeJobsList: active, performanceCards: cards };
  }, [myJobs, stats]);

  const quickActionCards = PARTNER_QUICK_ACTIONS;


  return (
    <PageContainer>
      {/* Header Compact with Zap Energy Toggle */}
      <div className="mb-6 flex flex-row items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-5 rounded-3xl border border-border/80 shadow-sm relative overflow-hidden">
        <div className="overflow-hidden pr-2">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/50"}`} />
            <span className={`text-[11px] font-black uppercase tracking-wider ${isOnline ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
              {isOnline ? "Mitra Aktif" : "Mode Istirahat"}
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black tracking-tight text-foreground truncate">
            Halo, {user?.name?.split(' ')[0] || "Mitra"}! {isOnline ? "🛵" : "💤"}
          </h1>
          <p className="text-muted-foreground font-medium text-xs truncate sm:whitespace-normal">
            {isOnline 
              ? "Siap menerima dan mengerjakan orderan baru." 
              : "Tekan tombol petir untuk mengaktifkan radar."}
          </p>
        </div>


        <div className="shrink-0">
          <ZapEnergyToggle isOnline={isOnline} onToggle={setIsOnline} />
        </div>
      </div>



      {/* Compact Proportional Performance Tracker (Grid 2x2 on mobile, 4 columns on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {performanceCards.map((card, i) => (
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
                  <h3 className="font-bold text-xs text-muted-foreground truncate">
                    {card.title}
                  </h3>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div className="mt-1">
                {loadingStats ? (
                  <div className="space-y-1 py-0.5">
                    <Skeleton className="h-7 w-24 rounded-lg" />
                    <Skeleton className="h-3 w-16 rounded-md" />
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
                        {card.value}
                      </p>
                      {card.suffix && (
                        <span className="text-xs font-bold text-amber-500">
                          {card.suffix}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {card.subtitle}
                    </p>
                  </motion.div>
                )}
              </div>

            </motion.div>
          </Link>
        ))}
      </div>

      {/* 4 Quick Actions in 1 Unified Single Card */}
      <div className="bg-card/90 backdrop-blur-md border border-border/80 rounded-3xl p-4 sm:p-5 mb-8 shadow-sm">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {quickActionCards.map((action, i) => (
            <Link key={i} href={action.href} className="block group text-center">
              <motion.div
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl hover:bg-muted/40 transition-colors"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-foreground line-clamp-1">
                  {action.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>


      <div className="grid lg:grid-cols-3 gap-6 w-full max-w-full min-w-0">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8 w-full max-w-full min-w-0">
          {/* Active Job Tracker */}
          {activeJobsList.length > 0 && (
            <section className="w-full max-w-full min-w-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base md:text-lg flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Pekerjaan Berjalan ({activeJobsList.length})
                </h3>
                <Link href="/dashboard/jobs/assigned" className="text-xs font-bold text-primary hover:underline flex items-center">
                  Kelola Semua <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
              <div className="space-y-4 w-full max-w-full min-w-0">
                {activeJobsList.slice(0, 2).map((job: any) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          )}

          {/* Job Request Queue */}
          <section className="w-full max-w-full min-w-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base md:text-lg text-foreground">Peluang di Sekitar Anda</h3>
              <Link href="/dashboard/jobs/search" className="text-xs font-bold text-primary hover:underline flex items-center">
                Buka Radar Peta <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-full min-w-0">
              {availableJobs.slice(0, 4).map((job: any) => (
                <JobCard key={job.id} job={job} showDistance={true} />
              ))}

              {availableJobs.length === 0 && (
                <div className="col-span-full text-center py-8 bg-card rounded-2xl border border-dashed border-border/80">
                  <div className="w-12 h-12 bg-muted/60 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Search className="w-6 h-6 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-muted-foreground font-medium text-xs">Belum ada orderan baru di area Anda saat ini.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
