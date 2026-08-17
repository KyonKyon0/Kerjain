"use client";

import { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useSearchJobs } from "@/hooks/useJobs";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Briefcase, ArrowUpDown, Navigation, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SmoothDropdown, DropdownOption } from "@/components/ui/SmoothDropdown";
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

const CATEGORY_OPTIONS: DropdownOption[] = [
  { value: "ALL", label: "Semua Kategori" },
  { value: "Angkat Barang", label: "Angkat Barang" },
  { value: "Bersih-bersih", label: "Bersih-bersih" },
  { value: "Perbaikan", label: "Perbaikan Rumah" },
  { value: "Penjagaan", label: "Penjagaan & Khusus" },
];

const SORT_OPTIONS: DropdownOption[] = [
  { value: "DEFAULT", label: "Paling Baru" },
  { value: "NEAREST", label: "📍 Terdekat" },
  { value: "REWARD_HIGH", label: "💰 Imbalan" },
];

  if (role !== "partner") return null;

  return (
    <DashboardLayout>
      <PageContainer className="max-w-6xl space-y-4 sm:space-y-5 pb-24 overflow-x-hidden w-full max-w-full">
        
        {/* Top Left GPS Status Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-card border border-border/80 text-xs font-bold text-foreground shadow-2xs">
            <Navigation className={`w-3.5 h-3.5 ${userLat ? "text-emerald-500 animate-pulse" : "text-amber-500"}`} />
            <span>{userLat ? "GPS Lokasi Aktif" : "Menentukan GPS..."}</span>
            <button
              type="button"
              onClick={requestLocation}
              className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors ml-0.5 cursor-pointer"
              title="Perbarui Lokasi GPS"
            >
              <RefreshCw className={`w-3 h-3 ${locLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Search Bar & Side-by-Side Filters (Kategori Lebar + Urutkan Bersebelahan) */}
        <div className="space-y-2.5 sm:space-y-3 relative z-30 w-full max-w-full min-w-0">
          
          {/* 1. Search Box Full Width */}
          <div className="relative w-full min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari pekerjaan, keahlian, atau lokasi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-13 bg-card border border-border/80 rounded-2xl shadow-2xs focus-visible:ring-primary/20 text-xs sm:text-sm font-semibold w-full min-w-0"
            />
          </div>

          {/* 2. Side-by-Side Dropdowns: Semua Kategori (Wider 62%) + Urutkan (38%) */}
          <div className="flex items-center gap-2 sm:gap-3 w-full max-w-full min-w-0">
            
            {/* Wide Category Dropdown (Area lebih besar) */}
            <div className="flex-[1.6] sm:flex-[1.8] min-w-0">
              <SmoothDropdown
                value={category}
                onChange={(val) => setCategory(val)}
                options={CATEGORY_OPTIONS}
                placeholder="Semua Kategori"
                icon={<Filter className="w-4 h-4 text-primary shrink-0" />}
              />
            </div>

            {/* Sort Dropdown (Paling Baru / Tertinggi / Terdekat) */}
            <div className="flex-1 min-w-0">
              <SmoothDropdown
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                options={SORT_OPTIONS}
                placeholder="Urutan"
                icon={<ArrowUpDown className="w-4 h-4 text-emerald-500 shrink-0" />}
              />
            </div>
          </div>
        </div>


        {/* 2-Column Grid Job List (1 Baris 2 Kolom Sempurna, Symmetrical, Zero Scroll Overflow) */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 items-stretch w-full max-w-full">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-44 rounded-2xl sm:rounded-3xl" />)}
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
            className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 items-stretch relative z-10 w-full max-w-full overflow-hidden"
          >
            {filteredJobs.map((job: any, index: number) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="h-full flex min-w-0"
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
