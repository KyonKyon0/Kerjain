"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useMyJobs } from "@/hooks/useJobs";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Plus, FileText, CheckCircle2, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "AKTIF" | "MENUNGGU" | "SELESAI" | "DRAFT";

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("MENUNGGU");
  const { role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (role !== "consumer") {
      router.replace("/dashboard");
    }
  }, [role, router]);

  const { data: jobs = [], isLoading: loading } = useMyJobs();

  if (role !== "consumer") return null;

  const tabs = [
    { id: "AKTIF", label: "Aktif", icon: Zap },
    { id: "MENUNGGU", label: "Menunggu Mitra", icon: Clock },
    { id: "SELESAI", label: "Selesai", icon: CheckCircle2 },
    { id: "DRAFT", label: "Dibatalkan", icon: FileText },
  ];

  const filteredJobs = jobs.filter((job: any) => {
    if (activeTab === "AKTIF") return ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION', 'IN_PROGRESS'].includes(job.status);
    if (activeTab === "MENUNGGU") return ['PUBLISHED', 'WAITING_PAYMENT'].includes(job.status);
    if (activeTab === "SELESAI") return job.status === "COMPLETED";
    if (activeTab === "DRAFT") return job.status === "CANCELLED";
    return true;
  });

  return (
    <DashboardLayout>
      <PageContainer className="max-w-5xl overflow-x-clip px-3.5 sm:px-6 w-full max-w-full">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 sm:mb-6 w-full max-w-full overflow-hidden">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-0.5 text-foreground">Daftar Pekerjaan</h2>
            <p className="text-muted-foreground font-medium text-xs">Kelola status dan riwayat orderan Anda.</p>
          </div>

          <Link href="/dashboard/jobs/create" className="hidden md:block">
            <Button className="rounded-2xl shadow-lg shadow-primary/20 h-11 px-5 font-bold text-xs bg-primary text-white hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-1.5" /> Buat Pekerjaan Baru
            </Button>
          </Link>
        </div>

        {/* Custom Tab Navigation */}
        <div className="flex overflow-x-auto hide-scrollbar gap-1.5 sm:gap-2 mb-4 sm:mb-6 pb-2 border-b border-border/50 w-full max-w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap outline-none shrink-0 ${
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator" 
                    className="absolute bottom-[-9px] left-0 right-0 h-[3px] bg-primary rounded-t-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Jobs Content List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-full">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-44 rounded-2xl" />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
            <EmptyState 
              icon={<Briefcase className="w-10 h-10 text-muted-foreground" />}
              title="Tidak Ada Pekerjaan"
              description={`Belum ada pekerjaan di kategori ${tabs.find(t => t.id === activeTab)?.label}.`}
              action={
                <Link href="/dashboard/jobs/create">
                  <Button className="rounded-xl h-10 px-5 font-bold text-xs shadow-md shadow-primary/20 mt-3 bg-primary text-white">
                    Buat Pekerjaan Baru
                  </Button>
                </Link>
              }
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-full min-w-0">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job: any, i: number) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="w-full max-w-full min-w-0 overflow-hidden"
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </PageContainer>
      
      {/* Mobile Sticky FAB */}
      <div className="md:hidden fixed bottom-[86px] right-4 z-40">
        <Link href="/dashboard/jobs/create">
          <motion.div 
            whileTap={{ scale: 0.9 }}
            className="w-13 h-13 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </motion.div>
        </Link>
      </div>
    </DashboardLayout>
  );
}
