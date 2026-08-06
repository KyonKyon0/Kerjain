"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { HistoryCard } from "@/components/history/HistoryCard";
import { useAuthStore } from "@/store/auth.store";
import { jobService } from "@/services/job.service";
import { Job } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Search } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/shared/SearchBar";

export default function HistoryPage() {
  const { role, user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        let fetched: Job[] = [];
        if (role === "consumer") {
          const { data } = await jobService.getConsumerJobs();
          fetched = data;
        } else {
          const { data } = await jobService.getPartnerJobs();
          fetched = data;
        }
        
        // Only COMPLETED or CANCELLED
        const historyJobs = fetched.filter(j => j.status === "COMPLETED" || j.status === "CANCELLED");
        // Sort descending
        historyJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setJobs(historyJobs);
      } catch {
        // error handling
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [role, user]);

  const filteredJobs = jobs.filter(job => {
    if (filter === "completed" && job.status !== "COMPLETED") return false;
    if (filter === "cancelled" && job.status !== "CANCELLED") return false;
    if (search && !job.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <PageContainer className="max-w-5xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <SectionHeader 
            title="Riwayat Pekerjaan" 
            description="Catatan semua pekerjaan Anda yang telah selesai atau dibatalkan."
          />
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 my-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Cari pekerjaan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <Select value={filter} onValueChange={(val) => setFilter(val || "all")}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-xl h-10">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState 
            icon={<History className="w-12 h-12" />}
            title="Tidak Ada Riwayat"
            description="Belum ada transaksi pekerjaan yang sesuai dengan filter Anda."
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <HistoryCard job={job} role={role!} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}

