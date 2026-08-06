"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useSearchJobs } from "@/hooks/useJobs";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchJobPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("ALL");
  const { role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (role !== "partner") {
      router.replace("/dashboard");
    }
  }, [role, router]);

  const { data: jobs = [], isLoading: loading } = useSearchJobs(category === "ALL" ? "" : category);

  if (role !== "partner") return null;

  const filteredJobs = jobs.filter((job: any) => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <PageContainer>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-primary/10 rounded-3xl p-6 border border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-primary">Cari Pekerjaan</h2>
          </div>
          <p className="text-muted-foreground font-medium ml-11">Temukan peluang di sekitar Anda dan mulai hasilkan uang.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Cari judul atau deskripsi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-14 bg-card border-2 rounded-2xl shadow-sm focus-visible:ring-primary/20 text-base"
            />
          </div>
          <Select value={category} onValueChange={(val) => setCategory(val || "ALL")}>
            <SelectTrigger className="w-full md:w-[200px] h-14 rounded-2xl border-2 bg-card shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <SelectValue placeholder="Kategori" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-2">
              <SelectItem value="ALL">Semua Kategori</SelectItem>
              <SelectItem value="Angkat Barang">Angkat Barang</SelectItem>
              <SelectItem value="Bersih-bersih">Bersih-bersih</SelectItem>
              <SelectItem value="Perbaikan">Perbaikan</SelectItem>
              <SelectItem value="Penjagaan">Penjagaan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState 
            icon={<Briefcase className="w-12 h-12" />}
            title="Tidak Ada Pekerjaan Tersedia"
            description="Coba ubah kata kunci pencarian atau ganti kategori."
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredJobs.map((job: any, index: number) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard 
                  job={job} 
                  showDistance 
                  onClick={() => router.push(`/dashboard/jobs/${job.id}`)} 
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}

