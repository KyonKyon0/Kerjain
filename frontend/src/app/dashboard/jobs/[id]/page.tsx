"use client";

import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { 
  useJobDetail, 
  useAcceptJob, 
  useConfirmJob, 
  useCancelJob, 
  useJobTimeline, 
  useAddProgress, 
  useUpdateJobStatus 
} from "@/hooks/useJobs";
import { JobTimeline } from "@/components/jobs/JobTimeline";
import { MapViewer } from "@/components/maps";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { AcceptDialog } from "@/components/jobs/AcceptDialog";
import { CompletionDialog } from "@/components/jobs/CompletionDialog";
import { CompletionCelebrationModal } from "@/components/jobs/CompletionCelebrationModal";
import { JobProgressGallery } from "@/components/jobs/JobProgressGallery";
import { SlideToConfirm } from "@/components/ui/SlideToConfirm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Wallet, 
  Clock, 
  MessageSquare, 
  Phone, 
  Camera, 
  Navigation, 
  Wrench, 
  ShieldCheck, 
  Zap, 
  Search, 
  Star, 
  MapPin,
  X,
  QrCode,
  Loader2,
  Route,
  Compass,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { formatWIBDateTime, cn } from "@/lib/utils";
import { useUserLocation } from "@/hooks/useUserLocation";
import { calculateHaversineDistance, formatDistanceString, estimateTravelTime } from "@/lib/distance";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  if (id === "[object Object]" || id === "%5Bobject%20Object%5D" || decodeURIComponent(id) === "[object Object]") {
    if (typeof window !== "undefined") window.location.href = "/dashboard";
    return null;
  }
  
  const router = useRouter();
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);
  const { role } = useAuthStore();

  const { data: job, isLoading: loading } = useJobDetail(id as string);
  const { data: timelineData } = useJobTimeline(id as string);
  const acceptJob = useAcceptJob();
  const addProgress = useAddProgress();
  const updateStatus = useUpdateJobStatus();
  const confirmJob = useConfirmJob();
  const cancelJob = useCancelJob();

  const { lat: userLat, lng: userLng } = useUserLocation();

  const [note, setNote] = useState("");

  const handleAccept = async () => {
    await acceptJob.mutateAsync(id as string);
    setIsAcceptOpen(false);
  };

  const handleUpdateProgress = async (newStatus: string) => {
    const defaultNote = 
      newStatus === "ON_THE_WAY" ? "Mitra sedang menuju lokasi" :
      newStatus === "ARRIVED" ? "Mitra telah tiba di lokasi pekerjaan" :
      newStatus === "WORKING" ? "Mitra mulai mengerjakan tugas" :
      newStatus === "WAITING_CONFIRMATION" ? "Mitra telah menyelesaikan tugas dan meminta konfirmasi" :
      `Update progres: ${newStatus}`;

    try {
      await addProgress.mutateAsync({
        id: id as string,
        data: {
          status: newStatus,
          note: note.trim() !== "" ? note.trim() : defaultNote
        }
      });
      setNote("");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui status");
    }
  };

  const handleComplete = async () => {
    await confirmJob.mutateAsync(id as string);
    setIsCompletionOpen(false);
    setIsCelebrationOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageContainer className="max-w-3xl space-y-4 pt-2">
          <Skeleton className="h-6 w-24 rounded-lg" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </PageContainer>
      </DashboardLayout>
    );
  }

  if (!job) return null;

  const jobPhoto = job.photoUrl || (job as any).photo_url;

  // Distance calculation
  const distanceInMeters = (job.lat && job.lng && userLat && userLng)
    ? calculateHaversineDistance(userLat, userLng, job.lat, job.lng)
    : null;

  const distanceText = formatDistanceString(distanceInMeters);
  const travelTimeText = estimateTravelTime(distanceInMeters);

  const googleMapsRouteUrl = (job.lat && job.lng)
    ? (userLat && userLng
        ? `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${job.lat},${job.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${job.lat},${job.lng}`)
    : "#";

  const targetPartner = job.partnerName || (job as any).partner?.name;
  const targetPhone = role === "consumer" ? (job.partnerPhone || (job as any).partner?.phone) : (job.consumerPhone || (job as any).consumer?.phone);
  const isCancellable = (job.status === "PUBLISHED" || job.status === "WAITING_PAYMENT") && role === "consumer";

  return (
    <DashboardLayout>
      <PageContainer className="max-w-3xl space-y-3.5 pt-1 pb-20 overflow-x-clip px-3 sm:px-4 md:px-6">
        
        {/* Navigation Back */}
        <Button 
          variant="ghost" 
          size="sm"
          className="p-0 h-8 hover:bg-transparent -ml-1 text-muted-foreground hover:text-foreground text-xs font-bold flex items-center gap-1.5" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali
        </Button>

        {/* 1. COMPACT JOB TITLE HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-card border border-border/80 p-3.5 sm:p-5 rounded-2xl shadow-xs space-y-2 w-full max-w-full overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <StatusBadge status={job.status} />
              <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground bg-muted/60 px-2 sm:px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" />
                {formatWIBDateTime(job.createdAt || (job as any).created_at)}
              </span>
            </div>
            
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20">
              {job.category || "Umum"}
            </span>
          </div>

          <h1 className="text-base sm:text-xl font-black tracking-tight text-foreground break-words">{job.title}</h1>
        </motion.div>

        {/* 2. DEDICATED PHOTO ATTACHMENT CARD - PLACED DIRECTLY ABOVE STATUS CARD */}
        {jobPhoto && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-card border border-border/80 p-3 sm:p-4 rounded-2xl shadow-xs space-y-2.5 w-full max-w-full overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-primary text-[11px] font-black uppercase tracking-wider">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Foto Lampiran Tugas</span>
              </div>
              <span className="text-[9px] text-muted-foreground font-bold bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
                Lampiran Konsumen
              </span>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-video max-h-60 sm:max-h-72 w-full bg-black/40 border border-border/70">
              <img 
                src={jobPhoto} 
                alt="Foto Lampiran Tugas" 
                className="w-full h-full object-cover" 
              />
            </div>
          </motion.div>
        )}

        {/* 3. MASTER UNIFIED STATUS, TIMELINE, MONEY, PARTNER & LOCATION CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.05 }}
          className="bg-card border border-border/80 p-3.5 sm:p-5 rounded-2xl shadow-xs space-y-3.5 w-full max-w-full overflow-hidden box-border"
        >
          {/* SECTION A: PARTNER / RADAR STATUS STRIP */}
          {job.status === "WAITING_PAYMENT" ? (
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 w-full max-w-full overflow-hidden">
              <div className="flex items-center gap-2.5 min-w-0">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                <div className="min-w-0">
                  <p className="font-black text-xs text-foreground truncate">Menunggu Pembayaran QRIS</p>
                  <p className="text-[10px] text-muted-foreground font-medium line-clamp-1">Selesaikan pembayaran agar tugas aktif di radar</p>
                </div>
              </div>
              {role === "consumer" && (
                <Button 
                  size="sm" 
                  onClick={() => router.push(`/dashboard/payment/${id}`)}
                  className="rounded-xl h-8 px-3 text-xs font-black bg-primary text-white hover:bg-primary/90 shrink-0 ml-2"
                >
                  <QrCode className="w-3.5 h-3.5 mr-1" /> Bayar
                </Button>
              )}
            </div>
          ) : job.status === "PUBLISHED" ? (
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-primary/10 border border-primary/20 w-full max-w-full overflow-hidden">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="relative flex items-center justify-center shrink-0">
                  <span className="animate-ping absolute inline-flex h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-primary opacity-40"></span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-black text-xs text-foreground truncate">Mencari Mitra di Sekitar</p>
                  <p className="text-[10px] text-muted-foreground font-medium line-clamp-1">Menyiarkan ke radar mitra aktif terdekat</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-card/60 border border-border/80 w-full max-w-full overflow-hidden">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border border-primary/30 shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${role === "consumer" ? (targetPartner || "Mitra") : (job.consumerName || (job as any).consumer?.name || "Konsumen")}`} />
                  <AvatarFallback>{(role === "consumer" ? targetPartner : (job.consumerName || (job as any).consumer?.name))?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-[9px] text-muted-foreground uppercase font-black tracking-wider truncate">
                    {role === "consumer" ? "Mitra yang Mengerjakan" : "Pemilik Tugas"}
                  </p>
                  <p className="font-black text-xs text-foreground flex items-center gap-1 truncate">
                    <span className="truncate">{role === "consumer" ? (targetPartner || "Mitra") : (job.consumerName || (job as any).consumer?.name || "Pemilik")}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <Button 
                  size="sm" 
                  onClick={() => router.push(`/dashboard/chat/${id}`)}
                  className="flex-1 sm:flex-none rounded-xl h-8 px-3.5 text-xs font-black bg-primary text-white hover:bg-primary/90"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1" /> Chat
                </Button>
                {targetPhone && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.location.href = `tel:${targetPhone.replace(/[^0-9+]/g, "")}`}
                    className="rounded-xl h-8 px-2.5 text-xs font-bold border-border/80"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* SECTION B: TIMELINE */}
          <div className="pt-2 border-t border-border/70 w-full max-w-full overflow-hidden">
            <h3 className="font-black text-[11px] sm:text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" />
              Status & Timeline
            </h3>
            <JobTimeline status={job.status} />
          </div>

          {/* SECTION C: DETAIL UANG & BIAYA TRANSAKSI (INTEGRATED IN MASTER CARD) */}
          <div className="pt-2.5 border-t border-border/70 w-full max-w-full overflow-hidden">
            <div className="p-2.5 sm:p-3 rounded-xl bg-card/60 border border-border/80 flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider truncate">Upah / Total Tagihan</p>
                  <p className="font-mono font-black text-xs sm:text-sm text-emerald-400 truncate">
                    Rp {((job.rewardAmount ?? (job as any).reward_amount) || 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] sm:text-[10px] font-black uppercase border border-emerald-500/20 shrink-0">
                <ShieldCheck className="w-3 h-3" />
                <span>Dana Diamankan</span>
              </div>
            </div>
          </div>

          {/* SECTION D: LOCATION & NAVIGATION */}
          <div className="pt-2.5 border-t border-border/70 space-y-2 w-full max-w-full overflow-hidden">
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Lokasi Pekerjaan</p>
                  <p className="font-bold text-[11px] sm:text-xs text-foreground mt-0.5 leading-snug break-words">{job.address}</p>
                </div>
              </div>

              {job.lat && job.lng && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowFullMap(!showFullMap)}
                  className="rounded-xl h-7 px-2 text-[10px] sm:text-xs font-bold border-border/80 shrink-0"
                >
                  {showFullMap ? "Tutup Peta" : "Lihat Peta"}
                </Button>
              )}
            </div>

            {/* Distance Estimate for Partner */}
            {distanceInMeters !== null && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] sm:text-[11px]">
                  <Compass className="w-3 h-3" />
                  <span>Jarak: ± {distanceText} dari Anda</span>
                </div>
                {travelTimeText && (
                  <span className="text-[10px] font-black text-emerald-400">
                    {travelTimeText}
                  </span>
                )}
              </div>
            )}

            {/* Collapsible Map View */}
            <AnimatePresence>
              {showFullMap && job.lat && job.lng && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden pt-1"
                >
                  <div className="rounded-xl overflow-hidden border border-border/70 h-40">
                    <MapViewer
                      lat={job.lat}
                      lon={job.lng}
                      address={job.address}
                      height="h-40"
                    />
                  </div>
                  <a 
                    href={googleMapsRouteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-primary text-white font-black text-xs rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <Route className="w-3.5 h-3.5" /> Buka Rute di Google Maps
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION E: DESCRIPTION */}
          <div className="pt-2.5 border-t border-border/70 space-y-1 w-full max-w-full overflow-hidden">
            <h4 className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3 h-3 text-primary" /> Rincian Tugas
            </h4>
            <p className="text-[11px] sm:text-xs text-foreground leading-relaxed whitespace-pre-wrap font-medium break-words">
              {job.description}
            </p>
          </div>
        </motion.div>

        {/* 4. RECENT PROGRESS GALLERY / LOGS */}
        <JobProgressGallery logs={timelineData?.data || []} />

        {/* 5. ACTION PANELS BASED ON ROLE AND STATUS */}
        
        {/* Partner: Take Job */}
        {role === "partner" && job.status === "PUBLISHED" && (
          <div className="p-3.5 sm:p-4 bg-card border border-border/80 rounded-2xl shadow-xs space-y-3 w-full max-w-full overflow-hidden">
            <h3 className="font-black text-xs uppercase tracking-wider text-foreground">
              Konfirmasi Pengambilan Tugas
            </h3>
            <SlideToConfirm 
              onConfirm={handleAccept} 
              label="Geser Terima Job" 
              successLabel="Pekerjaan Diterima!"
              isLoading={acceptJob.isPending}
              variant="primary"
            />
          </div>
        )}

        {/* Partner: Active Progress Update */}
        {role === "partner" && ["ACCEPTED", "ON_THE_WAY", "ARRIVED", "WORKING", "IN_PROGRESS"].includes(job.status) && (
          <div className="p-3.5 sm:p-4 bg-card border border-border/80 rounded-2xl shadow-xs space-y-3 w-full max-w-full overflow-hidden">
            <h3 className="font-black text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-primary" /> Update Status & Progres
            </h3>
            
            <textarea 
              className="w-full text-xs p-3 rounded-xl border border-border/80 bg-card outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium text-foreground"
              placeholder="Catatan progres kerja (opsional)..."
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            
            <div className="pt-1">
              {job.status === "ACCEPTED" && (
                <Button 
                  className="w-full rounded-xl h-11 text-xs font-black shadow-sm bg-primary text-white hover:bg-primary/90" 
                  onClick={() => handleUpdateProgress("ON_THE_WAY")} 
                  disabled={addProgress.isPending}
                >
                  {addProgress.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Navigation className="w-3.5 h-3.5 mr-1.5" />}
                  Menuju Lokasi
                </Button>
              )}
              {job.status === "ON_THE_WAY" && (
                <Button 
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 h-11 text-xs font-black shadow-sm text-white" 
                  onClick={() => handleUpdateProgress("ARRIVED")} 
                  disabled={addProgress.isPending}
                >
                  {addProgress.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <MapPin className="w-3.5 h-3.5 mr-1.5" />}
                  Telah Tiba di Lokasi
                </Button>
              )}
              {job.status === "ARRIVED" && (
                <Button 
                  className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 h-11 text-xs font-black shadow-sm text-white" 
                  onClick={() => handleUpdateProgress("WORKING")} 
                  disabled={addProgress.isPending}
                >
                  {addProgress.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Wrench className="w-3.5 h-3.5 mr-1.5" />}
                  Mulai Bekerja
                </Button>
              )}
              {["WORKING", "IN_PROGRESS"].includes(job.status) && (
                <div className="space-y-2">
                  {note.trim() !== "" ? (
                    <Button 
                      className="w-full rounded-xl h-10 text-xs font-bold bg-muted hover:bg-muted/80 text-foreground border border-border/80" 
                      onClick={() => handleUpdateProgress("WORKING")} 
                      disabled={addProgress.isPending}
                    >
                      {addProgress.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <FileText className="w-3.5 h-3.5 mr-1.5 text-primary" />}
                      Kirim Catatan Progres
                    </Button>
                  ) : null}
                  <SlideToConfirm
                    onConfirm={() => handleUpdateProgress("WAITING_CONFIRMATION")}
                    label="Geser Selesaikan Tugas"
                    successLabel="Tugas Selesai!"
                    isLoading={addProgress.isPending}
                    variant="primary"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Consumer: Waiting Confirmation */}
        {role === "consumer" && job.status === "WAITING_CONFIRMATION" && (
          <div className="p-3.5 sm:p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl shadow-xs space-y-3 w-full max-w-full overflow-hidden">
            <h3 className="font-black text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Konfirmasi Penyelesaian Tugas
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Mitra telah menyelesaikan pekerjaan. Periksa hasil kerja dan geser untuk menyelesaikan pembayaran.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <SlideToConfirm
                onConfirm={handleComplete}
                label="Geser Konfirmasi Selesai"
                successLabel="Pekerjaan Berhasil Selesai!"
                isLoading={confirmJob.isPending}
                variant="primary"
              />
              <Button 
                variant="outline" 
                size="sm"
                className="w-full rounded-xl h-9 text-xs font-bold text-destructive hover:bg-destructive/10 border-destructive/30" 
                onClick={() => updateStatus.mutate({ id: id as string, status: "WORKING" })} 
                disabled={updateStatus.isPending}
              >
                Minta Penyesuaian / Revisi
              </Button>
            </div>
          </div>
        )}

        {/* Consumer: Completed Review */}
        {role === "consumer" && job.status === "COMPLETED" && (
          <div className="p-3.5 sm:p-4 bg-card border border-border/80 rounded-2xl shadow-xs text-center space-y-2.5 w-full max-w-full overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <h3 className="font-black text-xs uppercase tracking-wider text-foreground">Tugas Telah Tuntas</h3>
            <Button 
              className="w-full rounded-xl h-11 font-black bg-primary text-white hover:bg-primary/90 text-xs" 
              onClick={() => router.push(`/dashboard/review/${id}`)}
            >
              Beri Ulasan Mitra
            </Button>
          </div>
        )}

        {/* 6. STANDALONE CANCEL JOB BUTTON AT THE BOTTOM */}
        {isCancellable && (
          <div className="pt-4 border-t border-border/70 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => {
                cancelJob.mutate(id as string);
                router.push("/dashboard");
              }}
              disabled={cancelJob.isPending}
              className="w-full sm:w-auto rounded-xl h-11 px-6 font-bold text-xs text-destructive hover:bg-destructive/10 border-destructive/30 flex items-center justify-center gap-1.5"
            >
              {cancelJob.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <X className="w-3.5 h-3.5" />}
              Batalkan Pekerjaan Ini
            </Button>
          </div>
        )}

        {/* Dialogs */}
        <AcceptDialog 
          isOpen={isAcceptOpen} 
          onOpenChange={setIsAcceptOpen} 
          onConfirm={handleAccept} 
          isLoading={acceptJob.isPending} 
        />

        <CompletionDialog
          isOpen={isCompletionOpen}
          onOpenChange={setIsCompletionOpen}
          onConfirm={handleComplete}
          isLoading={confirmJob.isPending}
        />

        <CompletionCelebrationModal
          isOpen={isCelebrationOpen}
          onClose={() => {
            setIsCelebrationOpen(false);
            router.push(`/dashboard/review/${id}`);
          }}
          onContinue={() => {
            setIsCelebrationOpen(false);
            router.push(`/dashboard/review/${id}`);
          }}
          continueLabel="Lanjut Beri Ulasan Mitra"
        />

      </PageContainer>
    </DashboardLayout>
  );
}
