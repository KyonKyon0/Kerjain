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
  const [activeTab, setActiveTab] = useState<TabType>("AKTIF");
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
    { id: "DRAFT", label: "Dibatalkan", icon: FileText }, // Assuming cancelled is draft/history here
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
      <PageContainer className="max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 text-foreground">Daftar Pekerjaan</h2>
            <p className="text-muted-foreground font-medium">Kelola status dan riwayat orderan Anda.</p>
          </div>
          <Link href="/dashboard/jobs/create" className="hidden md:block">
            <Button className="rounded-2xl shadow-lg shadow-primary/20 h-12 px-6 font-bold">
              <Plus className="w-5 h-5 mr-2" /> Buat Pekerjaan Baru
            </Button>
          </Link>
        </div>

        {/* Custom Tab Navigation */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2 border-b border-border/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap outline-none ${
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator" 
                    className="absolute bottom-[-9px] left-0 right-0 h-[3px] bg-primary rounded-t-full"
                  />
                )}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-3xl" />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <EmptyState 
              icon={<Briefcase className="w-12 h-12 text-muted-foreground" />}
              title="Tidak Ada Pekerjaan"
              description={`Belum ada pekerjaan di kategori ${tabs.find(t => t.id === activeTab)?.label}.`}
              action={
                <Link href="/dashboard/jobs/create">
                  <Button className="rounded-2xl h-12 px-6 font-bold shadow-md shadow-primary/20 mt-4">Buat Pekerjaan Baru</Button>
                </Link>
              }
            />
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job: any, i: number) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </PageContainer>
      
      {/* Mobile Sticky FAB */}
      <div className="md:hidden fixed bottom-[90px] right-4 z-40">
        <Link href="/dashboard/jobs/create">
          <motion.div 
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/40"
          >
            <Plus className="w-6 h-6" />
          </motion.div>
        </Link>
      </div>
    </DashboardLayout>
  );
}
