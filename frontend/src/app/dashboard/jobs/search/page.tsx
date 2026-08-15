"use client";

import { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useSearchJobs } from "@/hooks/useJobs";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Briefcase, MapPin, ArrowUpDown, Navigation, RefreshCw } from "lucide-react";
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
import { useUserLocation } from "@/hooks/useUserLocation";
import { calculateHaversineDistance } from "@/lib/distance";

export default function SearchJobPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("DEFAULT"); // DEFAULT, NEAREST, REWARD_HIGH
  const { role } = useAuthStore();
  const router = useRouter();

  const { lat: userLat, lng: userLng, loading: locLoading, requestLocation } = useUserLocation();

  useEffect(() => {
    if (role !== "partner") {
      router.replace("/dashboard");
    }
  }, [role, router]);

  const { data: jobs = [], isLoading: loading } = useSearchJobs(category === "ALL" ? "" : category);

  // Attach live calculated distance to each job
  const jobsWithDistance = useMemo(() => {
    return jobs.map((job: any) => {
      let distance = job.distance;
      if (userLat && userLng && job.lat && job.lng) {
        distance = calculateHaversineDistance(userLat, userLng, job.lat, job.lng);
      }
      return {
        ...job,
        distance,
      };
    });
  }, [jobs, userLat, userLng]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let list = jobsWithDistance.filter((job: any) => 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "NEAREST") {
      list = [...list].sort((a, b) => {
        const distA = a.distance ?? 99999999;
        const distB = b.distance ?? 99999999;
        return distA - distB;
      });
    } else if (sortBy === "REWARD_HIGH") {
      list = [...list].sort((a, b) => {
        const rewardA = Number(a.rewardAmount ?? a.reward_amount ?? 0);
        const rewardB = Number(b.rewardAmount ?? b.reward_amount ?? 0);
        return rewardB - rewardA;
      });
    }

    return list;
  }, [jobsWithDistance, searchTerm, sortBy]);

  if (role !== "partner") return null;

  return (
    <DashboardLayout>
      <PageContainer>
        {/* Header Hero */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8 bg-gradient-to-r from-primary/15 via-emerald-500/10 to-teal-500/5 rounded-3xl p-6 border border-primary/20"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary p-2.5 rounded-2xl text-primary-foreground shadow-md shadow-primary/20">
                  <Search className="w-6 h-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                  Radar Peluang Kerja
                </h2>
              </div>
              <p className="text-muted-foreground font-medium text-sm">
                Temukan pekerjaan di sekitar Anda dan lihat jarak langsung dari lokasi Anda saat ini.
              </p>
            </div>

            {/* GPS Status Badge */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-card/80 backdrop-blur-md border border-border/80 text-xs font-semibold text-foreground shadow-sm">
                <Navigation className={`w-3.5 h-3.5 ${userLat ? "text-emerald-500 animate-pulse" : "text-amber-500"}`} />
                <span>
                  {userLat ? "GPS Lokasi Aktif" : "Menentukan GPS..."}
                </span>
                <button
                  type="button"
                  onClick={requestLocation}
                  className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors ml-1"
                  title="Perbarui Lokasi GPS"
                >
                  <RefreshCw className={`w-3 h-3 ${locLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search, Category, and Sorting Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Cari pekerjaan atau lokasi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-14 bg-card border rounded-2xl shadow-sm focus-visible:ring-primary/20 text-base"
            />
          </div>

          <Select value={category} onValueChange={(val) => setCategory(val || "ALL")}>
            <SelectTrigger className="w-full md:w-[190px] h-14 rounded-2xl border bg-card shadow-sm font-semibold">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <SelectValue placeholder="Kategori" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border">
              <SelectItem value="ALL">Semua Kategori</SelectItem>
              <SelectItem value="Angkat Barang">Angkat Barang</SelectItem>
              <SelectItem value="Bersih-bersih">Bersih-bersih</SelectItem>
              <SelectItem value="Perbaikan">Perbaikan</SelectItem>
              <SelectItem value="Penjagaan">Penjagaan</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(val) => setSortBy(val || "DEFAULT")}>
            <SelectTrigger className="w-full md:w-[190px] h-14 rounded-2xl border bg-card shadow-sm font-semibold">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-emerald-500" />
                <SelectValue placeholder="Urutkan" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border">
              <SelectItem value="DEFAULT">Paling Baru</SelectItem>
              <SelectItem value="NEAREST">📍 Terdekat dari Saya</SelectItem>
              <SelectItem value="REWARD_HIGH">💰 Imbalan Tertinggi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-56 rounded-3xl" />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState 
            icon={<Briefcase className="w-12 h-12" />}
            title="Tidak Ada Pekerjaan Tersedia"
            description="Coba ubah kata kunci pencarian atau ganti filter kategori dan jarak."
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
