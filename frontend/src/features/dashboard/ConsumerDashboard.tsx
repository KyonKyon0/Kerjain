"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useConsumerJobs } from "@/hooks/useJobs";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { 
  PlusCircle, 
  History, 
  ChevronRight, 
  Zap, 
  Wallet, 
  Briefcase, 
  CheckCircle, 
  ArrowUpRight, 
  ShoppingBag,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { JobCard } from "@/components/jobs/JobCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { axiosInstance } from "@/lib/axios";

const CONSUMER_QUICK_ACTIONS = [
  { 
    name: "Buat Pekerjaan", 
    href: "/dashboard/jobs/create", 
    icon: PlusCircle, 
    color: "text-emerald-400", 
    bg: "bg-emerald-500/15", 
  },
  { 
    name: "Pantau Job", 
    href: "/dashboard/jobs/assigned", 
    icon: Briefcase, 
    color: "text-blue-400", 
    bg: "bg-blue-500/15", 
  },
  { 
    name: "Riwayat Order", 
    href: "/dashboard/history", 
    icon: History, 
    color: "text-purple-400", 
    bg: "bg-purple-500/15", 
  },
  { 
    name: "Pusat Bantuan", 
    href: "/help", 
    icon: HelpCircle, 
    color: "text-amber-400", 
    bg: "bg-amber-500/15", 
  },
];

export function ConsumerDashboard() {
  const { user } = useAuthStore();
  const { data: jobs = [], isLoading: loadingJobs } = useConsumerJobs();

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
      }
    };

    fetchConsumerStats();
  }, []);

  const { activeJobsList, completedJobsList, consumerStatCards } = React.useMemo(() => {
    const active = jobs.filter((j: any) => 
      ['PUBLISHED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION', 'IN_PROGRESS'].includes(j.status)
    );

    const completed = jobs.filter((j: any) => j.status === 'COMPLETED');
    
    // All jobs that are paid/active or completed
    const allPaid = jobs.filter((j: any) => 
      ['PUBLISHED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION', 'IN_PROGRESS', 'COMPLETED'].includes(j.status)
    );
    const localSpendingSum = allPaid.reduce((acc: number, j: any) => acc + Number(j.rewardAmount ?? j.reward_amount ?? 0), 0);

    // Synchronized metrics
    const activeJobsCount = stats.active_jobs > 0 ? stats.active_jobs : active.length;
    const completedJobsCount = stats.completed_jobs > 0 ? stats.completed_jobs : completed.length;
    const totalJobsCount = stats.total_jobs > 0 ? stats.total_jobs : jobs.length;
    const spending = stats.total_spending > 0 ? stats.total_spending : localSpendingSum;

    const cards = [
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
        subtitle: "Biaya pekerjaan Anda",
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

    return { activeJobsList: active, completedJobsList: completed, consumerStatCards: cards };
  }, [jobs, stats]);

  const quickActions = CONSUMER_QUICK_ACTIONS;

  return (
    <PageContainer className="overflow-x-clip">
      {/* 1. Header Card Nama & Status Konsumen */}
      <div className="mb-4 sm:mb-6 bg-card/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/80 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-emerald-400">
            Konsumen Aktif
          </span>
        </div>
        <h1 className="text-lg sm:text-2xl font-black tracking-tight text-foreground">
          Halo, {user?.name?.split(' ')[0] || "Konsumen"}! 👋
        </h1>
        <p className="text-muted-foreground font-medium text-xs mt-0.5">
          Butuh bantuan apa hari ini? Unggah pekerjaan Anda dan mitra terdekat siap membantu.
        </p>
      </div>

      {/* 2. 4 Metric / Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-4 sm:mb-6">
        {consumerStatCards.map((card, i) => (
          <Link key={i} href={card.href} className="block group">
            <motion.div
              whileHover={{ y: -2, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className={`h-full p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border bg-card/90 backdrop-blur-md shadow-xs transition-all ${card.borderColor}`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className={`p-2 rounded-xl sm:rounded-2xl ${card.iconBg} ${card.iconColor}`}>
                  <card.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-muted-foreground mb-0.5 sm:mb-1">{card.title}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-2xl font-black tracking-tight text-foreground">{card.value}</span>
                {card.suffix && (
                  <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">{card.suffix}</span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground/80 font-medium mt-0.5">{card.subtitle}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* 3. UNIFIED SINGLE CARD FOR QUICK ACTIONS (BUAT, PANTAU, RIWAYAT, BANTUAN) */}
      <div className="mb-6 bg-card border border-border/80 p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xs">
        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="block group">
              <div className="flex flex-col items-center text-center p-2 sm:p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${action.bg} ${action.color} flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform shadow-2xs`}>
                  <action.icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <span className="font-bold text-[10px] sm:text-xs text-foreground line-clamp-1">{action.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Active Jobs Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-primary" /> Pekerjaan Berlangsung
            </h2>
            <p className="text-[11px] sm:text-xs text-muted-foreground font-medium">Pantau progres pekerjaan Anda secara langsung</p>
          </div>
          {activeJobsList.length > 0 && (
            <Link href="/dashboard/jobs/assigned">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-primary">
                Lihat Semua <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </Link>
          )}
        </div>

        {loadingJobs ? (
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
        ) : activeJobsList.length === 0 ? (
          <div className="p-6 sm:p-8 text-center bg-card/60 border border-border/80 rounded-2xl sm:rounded-3xl space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Briefcase className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-foreground">Tidak Ada Pekerjaan yang Sedang Berjalan</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto font-medium">
              Semua pekerjaan Anda telah selesai atau belum ada pesanan baru yang dibuat.
            </p>
            <Link href="/dashboard/jobs/create" className="inline-block pt-1">
              <Button className="rounded-xl h-10 px-4 text-xs font-black bg-primary text-white hover:bg-primary/90 shadow-sm">
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Buat Pekerjaan Sekarang
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {activeJobsList.slice(0, 4).map((job: any) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
