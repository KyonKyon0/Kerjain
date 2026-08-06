"use client";

import { useAuthStore } from "@/store/auth.store";
import { usePartnerJobs, useSearchJobs } from "@/hooks/useJobs";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { Search, History, Briefcase, MapPin, Wallet, Star, TrendingUp, CheckCircle, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { JobCard } from "@/components/jobs/JobCard";

export function PartnerDashboard() {
  const { user } = useAuthStore();
  const { data: myJobs = [] } = usePartnerJobs();
  const { data: availableJobs = [] } = useSearchJobs();

  const activeJobsList = myJobs.filter((j: any) => ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION'].includes(j.status));
  
  const earnings = myJobs
    .filter((j: any) => j.status === 'COMPLETED')
    .reduce((acc: any, job: any) => acc + (job.rewardAmount || 0), 0);

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
            Halo, {user?.name?.split(' ')[0] || "Mitra"}! 🛵
          </h1>
          <p className="text-muted-foreground font-medium">Online & Siap Terima Order</p>
        </div>
        <div className="relative">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full border-2 border-emerald-500"></div>
        </div>
      </div>

      {/* Performance & Earnings Tracker (Grab Driver style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-primary text-primary-foreground rounded-3xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute right-[-10%] top-[-10%] opacity-20 transform group-hover:scale-110 transition-transform">
            <Wallet className="w-24 h-24" />
          </div>
          <h3 className="font-semibold text-sm opacity-90 mb-1">Pendapatan Hari Ini</h3>
          <p className="text-2xl md:text-3xl font-bold">Rp {earnings.toLocaleString("id-ID")}</p>
          <div className="mt-4 text-xs flex items-center gap-1 font-medium bg-white/20 w-fit px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> +12% dari kemarin
          </div>
        </div>

        <div className="bg-card border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-sm">Rating Bintang</span>
          </div>
          <p className="text-3xl font-bold text-foreground">0.0</p>
          <p className="text-xs text-muted-foreground mt-2">Belum ada ulasan</p>
        </div>

        <div className="bg-card border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-sm">Tingkat Penyelesaian</span>
          </div>
          <p className="text-3xl font-bold text-foreground">0%</p>
          <p className="text-xs text-muted-foreground mt-2">Belum ada data</p>
        </div>

        <div className="bg-card border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-sm">Job Selesai</span>
          </div>
          <p className="text-3xl font-bold text-foreground">5</p>
          <p className="text-xs text-muted-foreground mt-2">Hari ini</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg">
        {[
          { name: "Cari Job", href: "/dashboard/jobs/search", icon: Search, color: "bg-primary text-white" },
          { name: "Aktif", href: "/dashboard/jobs/assigned", icon: Briefcase, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" },
          { name: "Riwayat", href: "/dashboard/history", icon: History, color: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" },
        ].map((action, i) => (
          <Link key={i} href={action.href} className="flex flex-col items-center gap-2 group">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 ${action.color}`}>
              <action.icon className="w-7 h-7" />
            </div>
            <span className="text-[11px] md:text-sm font-semibold text-center text-foreground">{action.name}</span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Job Tracker */}
          {activeJobsList.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Pekerjaan Berjalan
                </h3>
              </div>
              <div className="space-y-4">
                {activeJobsList.slice(0, 2).map((job: any) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          )}

          {/* Job Request Queue */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Peluang di Sekitar Anda</h3>
              <Link href="/dashboard/jobs/search" className="text-sm font-semibold text-primary hover:underline flex items-center">
                Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {availableJobs.slice(0, 3).map((job: any) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={job.id} 
                  className="bg-card border rounded-2xl p-5 hover:border-primary/50 transition-colors shadow-sm cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-base md:text-lg group-hover:text-primary transition-colors">{job.title}</h4>
                    <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">Rp {job.rewardAmount?.toLocaleString('id-ID') || 0}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs font-medium text-muted-foreground gap-3">
                      <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><MapPin className="w-3 h-3 text-primary"/> Lokasi tersedia</span>
                      <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><History className="w-3 h-3 text-primary"/> Baru saja</span>
                    </div>
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button size="sm" className="rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        Ambil
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
              
              {availableJobs.length === 0 && (
                <div className="text-center py-10 bg-muted/30 rounded-3xl border border-dashed">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-8 h-8 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-muted-foreground font-medium">Belum ada orderan masuk di area Anda.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
