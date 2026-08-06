"use client";

import { useAuthStore } from "@/store/auth.store";
import { useConsumerJobs } from "@/hooks/useJobs";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { PlusCircle, History, CreditCard, ChevronRight, Search, Zap, MapPin, UserCheck, Star, ShieldCheck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/JobCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ConsumerDashboard() {
  const { user } = useAuthStore();
  const { data: jobs = [] } = useConsumerJobs();

  const activeJobsList = jobs.filter((j: any) => ['PUBLISHED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION'].includes(j.status));
  const activeJobsCount = activeJobsList.length;

  return (
    <PageContainer>
      {/* Greeting Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
            Halo, {user?.name?.split(' ')[0] || "Konsumen"}! 👋
          </h1>
          <p className="text-muted-foreground">Apa yang bisa kami bantu hari ini?</p>
        </div>
      </div>



      {/* Quick Actions (Grab Style) */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { name: "Buat", href: "/dashboard/jobs/create", icon: PlusCircle, color: "bg-blue-500" },
          { name: "Riwayat", href: "/dashboard/history", icon: History, color: "bg-emerald-500" },
          { name: "Promo", href: "#", icon: Zap, color: "bg-amber-500" },
          { name: "Saldo", href: "/dashboard/payments", icon: CreditCard, color: "bg-purple-500" },
        ].map((action, i) => (
          <Link key={i} href={action.href} className="flex flex-col items-center gap-2 group">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 ${action.color}`}>
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
                  Pekerjaan Aktif
                </h3>
              </div>
              <div className="space-y-4">
                {activeJobsList.slice(0, 2).map((job: any) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          )}

          {/* Popular Categories */}
          <section>
            <h3 className="font-bold text-lg mb-4">Layanan Populer</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Perbaikan", icon: Home },
                { name: "Kebersihan", icon: Zap },
                { name: "Lainnya", icon: Search },
              ].map((cat, i) => (
                <div key={i} className="bg-card border rounded-2xl p-4 text-center hover:border-primary/50 cursor-pointer transition-colors shadow-sm">
                  <cat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="text-xs font-semibold">{cat.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <div className="space-y-8">
          {/* Nearby Helpers */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Mitra Terdekat</h3>
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="bg-card border rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-muted-foreground opacity-50" />
              </div>
              <div>
                <p className="font-semibold text-sm">Belum Ada Mitra Terdekat</p>
                <p className="text-xs text-muted-foreground mt-1">Aktifkan lokasi untuk menemukan mitra terbaik di sekitar Anda.</p>
              </div>
            </div>
          </section>

          {/* Security Banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-emerald-800 dark:text-emerald-400">Garansi Layanan 100%</h4>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">Pembayaran ditahan hingga pekerjaan selesai dan disetujui.</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
