"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useAuthStore } from "@/store/auth.store";
import { jobService } from "@/services/job.service";
import { Job } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Navigation, Wrench, CheckCircle2 } from "lucide-react";
import { JobCard } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "ALL" | "ON_THE_WAY" | "WORKING" | "WAITING_CONFIRMATION";

export default function AssignedJobsPage() {
  const { role, user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("ALL");

  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        if (role === "partner") {
          const { data } = await jobService.getPartnerJobs();
          const activeJobs = data.filter(j => 
            j.status === "ACCEPTED" || 
            j.status === "WORKING" || 
            j.status === "ON_THE_WAY" ||
            j.status === "WAITING_CONFIRMATION"
          );
          
          activeJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setJobs(activeJobs);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveJobs();
  }, [role, user]);

  const tabs = [
    { id: "ALL", label: "Semua Aktif", icon: Briefcase },
    { id: "ON_THE_WAY", label: "Menuju Lokasi", icon: Navigation },
    { id: "WORKING", label: "Sedang Dikerjakan", icon: Wrench },
    { id: "WAITING_CONFIRMATION", label: "Menunggu Klien", icon: CheckCircle2 },
  ];

  const filteredJobs = jobs.filter(job => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ON_THE_WAY") return job.status === "ACCEPTED" || job.status === "ON_THE_WAY";
    return job.status === activeTab;
  });

  return (
    <DashboardLayout>
      <PageContainer className="max-w-5xl">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 text-foreground">Pekerjaan Saya</h2>
          <p className="text-muted-foreground font-medium">Daftar pekerjaan yang sedang Anda tangani saat ini.</p>
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
                    layoutId="activeTabIndicatorPartner" 
                    className="absolute bottom-[-9px] left-0 right-0 h-[3px] bg-primary rounded-t-full"
                  />
                )}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-3xl" />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <EmptyState 
              icon={<Briefcase className="w-12 h-12 text-muted-foreground" />}
              title="Tidak Ada Pekerjaan"
              description={`Belum ada pekerjaan dengan status ${tabs.find(t => t.id === activeTab)?.label}.`}
              action={
                <Link href="/dashboard/jobs/search">
                  <Button className="rounded-2xl h-12 px-6 font-bold shadow-md shadow-primary/20 mt-4">Cari Orderan</Button>
                </Link>
              }
            />
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, i) => (
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
    </DashboardLayout>
  );
}
