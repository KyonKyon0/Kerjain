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
import { useCreatePayment } from "@/hooks/usePayment";
import { JobTimeline } from "@/components/jobs/JobTimeline";
import { LocationCard } from "@/components/jobs/LocationCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { AcceptDialog } from "@/components/jobs/AcceptDialog";
import { CompletionDialog } from "@/components/jobs/CompletionDialog";
import { CompletionCelebrationModal } from "@/components/jobs/CompletionCelebrationModal";
import { JobProgressGallery } from "@/components/jobs/JobProgressGallery";
import { SlideToConfirm } from "@/components/ui/SlideToConfirm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Tag, 
  Wallet, 
  Clock, 
  UserCircle2, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  Camera, 
  AlertCircle, 
  Upload, 
  Navigation, 
  Wrench, 
  ShieldCheck, 
  Zap, 
  Search, 
  Briefcase, 
  Star, 
  MapPin,
  X,
  ImageIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { formatWIBDateTime } from "@/lib/utils";

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
  const { role } = useAuthStore();

  const { data: job, isLoading: loading } = useJobDetail(id as string);
  const { data: timelineData } = useJobTimeline(id as string);
  const acceptJob = useAcceptJob();
  const addProgress = useAddProgress();
  const updateStatus = useUpdateJobStatus();
  const confirmJob = useConfirmJob();
  const cancelJob = useCancelJob();
  const createPayment = useCreatePayment();

  const [note, setNote] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress photo on client-side to max 800x800 base64 JPEG
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Silakan pilih file gambar yang valid");
      return;
    }

    setIsCompressingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
          setPhotoPreview(compressedDataUrl);
          toast.success("Foto progres siap dilampirkan");
        }
        setIsCompressingPhoto(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAccept = async () => {
    await acceptJob.mutateAsync(id as string);
    setIsAcceptOpen(false);
  };

  const handleUpdateProgress = async (newStatus: string) => {
    await addProgress.mutateAsync({
      id: id as string,
      data: {
        status: newStatus,
        note: note || `Pekerjaan dilanjutkan ke tahap ${newStatus}`,
        photoUrl: photoPreview || undefined
      }
    });
    setNote("");
    setPhotoPreview(null);
  };


  const handleComplete = async () => {
    await confirmJob.mutateAsync(id as string);
    setIsCompletionOpen(false);
    setIsCelebrationOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageContainer className="max-w-4xl space-y-6">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-40 w-full rounded-3xl" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-[400px] md:col-span-2 rounded-3xl" />
            <Skeleton className="h-[400px] rounded-3xl" />
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  if (!job) return null;

  const logs = (timelineData?.data || []).filter((l: any) => l.statusSnapshot !== 'CANCELLED');
  const recentLogs = [...logs].reverse().slice(0, 3);

  return (
    <DashboardLayout>
      <PageContainer className="max-w-4xl space-y-6">
        <Button variant="ghost" className="mb-2 p-0 hover:bg-transparent -ml-2 text-muted-foreground hover:text-foreground" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/90 backdrop-blur-md p-6 rounded-3xl border border-border/80 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={job.status} />
              <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-xl flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-primary/70" />
                {formatWIBDateTime(job.createdAt || (job as any).created_at)}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{job.title}</h1>
          </div>
          {job.status === "PUBLISHED" && role === "consumer" && (
            <Button variant="destructive" className="rounded-2xl shadow-sm" onClick={() => cancelJob.mutate(id as string)}>
              Batalkan Pekerjaan
            </Button>
          )}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <DashboardCard className="shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Status & Timeline
                </h3>
                <JobTimeline status={job.status} />
                
                {/* Riwayat Progres */}
                {logs.length > 0 && (
                  <div className="mt-8 border-t border-border pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-sm text-foreground">Riwayat Progres Terbaru</h4>
                      {logs.length > 3 && (
                        <Dialog>
                          <DialogTrigger render={<Button variant="ghost" size="sm" className="text-xs h-7 text-primary hover:text-primary" />}>
                            Lihat Semua ({logs.length})
                          </DialogTrigger>
                          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Semua Riwayat Progres</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              {logs.map((log: any) => (
                                <div key={log.id} className="flex gap-4 items-start">
                                  <div className="w-3 h-3 mt-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                  <div className="flex-1 bg-muted/20 border border-border/50 rounded-2xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-sm font-bold text-primary">{log.statusSnapshot || log.status_snapshot}</span>
                                      <span className="text-xs font-medium text-muted-foreground">{formatWIBDateTime(log.createdAt || log.created_at)}</span>
                                    </div>
                                    {log.note && <p className="text-sm text-foreground/80">{log.note}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    <div className="space-y-4">
                      {recentLogs.map((log: any) => (
                        <div key={log.id} className="flex gap-4 items-start">
                          <div className="w-3 h-3 mt-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                          <div className="flex-1 bg-muted/20 border border-border/50 rounded-2xl p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-bold text-primary">{log.statusSnapshot || log.status_snapshot}</span>
                              <span className="text-xs font-medium text-muted-foreground">{formatWIBDateTime(log.createdAt || log.created_at)}</span>
                            </div>
                            {log.note && <p className="text-sm text-foreground/80">{log.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </DashboardCard>
            </motion.div>

            {/* Live Progress Photos Gallery - Visible to Both Consumer and Partner */}
            <JobProgressGallery logs={timelineData?.data || []} />

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <DashboardCard className="shadow-sm">
                <h3 className="font-bold text-lg mb-4">Deskripsi Pekerjaan</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base mb-6">
                  {job.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 border-t border-border pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Kategori</p>
                      <p className="font-bold text-sm text-foreground">{job.category || "Umum"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Imbalan / Upah</p>
                      <p className="font-bold text-sm text-foreground">
                        Rp {((job.rewardAmount ?? (job as any).reward_amount) || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </motion.div>

            {/* Location Card with live GPS distance and Google Maps Directions */}
            <LocationCard 
              address={job.address}
              latitude={job.lat ?? null}
              longitude={job.lng ?? null}
            />
          </div>

          <div className="space-y-6">
            {/* PROFILE CARD (CONSUMER OR PARTNER) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <DashboardCard className="bg-primary text-primary-foreground relative overflow-hidden text-center p-6 shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                
                {job.status === "PUBLISHED" ? (
                  <div>
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 border border-white/30">
                      <UserCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Mencari Mitra</h3>
                    <p className="text-xs text-white/80">Pekerjaan ini menunggu mitra yang bersedia mengambilnya.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                      <Avatar className="w-14 h-14 border-2 border-white/50">
                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${role === "consumer" ? (job.partnerName || job.partner?.name) : (job.consumerName || job.consumer?.name)}`} />
                        <AvatarFallback>{(role === "consumer" ? (job.partnerName || job.partner?.name) : (job.consumerName || job.consumer?.name))?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-1">
                          {role === "consumer" ? "Mitra yang menangani" : "Pemilik Pekerjaan"}
                        </p>
                        <p className="font-bold text-lg">{role === "consumer" ? (job.partnerName || job.partner?.name || "Menunggu...") : (job.consumerName || job.consumer?.name || "Pemilik")}</p>
                      </div>
                    </div>
                    {(() => {
                      const targetPhone = role === "consumer" ? (job.partnerPhone || job.partner?.phone) : (job.consumerPhone || job.consumer?.phone);
                      return (
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="secondary" 
                            className="w-full bg-white text-primary hover:bg-white/90 rounded-xl font-bold h-12"
                            onClick={() => router.push(`/dashboard/chat/${id}`)}
                          >
                            <MessageSquare className="w-5 h-5 mr-2" /> Chat
                          </Button>
                          <Button 
                            variant="secondary" 
                            className="w-full bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl font-bold h-12"
                            onClick={() => {
                              if (targetPhone && targetPhone.trim() !== "") {
                                const cleanPhone = targetPhone.replace(/[^0-9+]/g, "");
                                window.location.href = `tel:${cleanPhone}`;
                              } else {
                                toast.error("Nomor telepon lawan bicara belum didaftarkan");
                              }
                            }}
                          >
                            <Phone className="w-5 h-5 mr-2" /> Telepon
                          </Button>
                        </div>
                      );
                    })()}

                  </div>
                )}
              </DashboardCard>
            </motion.div>

            {/* ACTION PANEL PARTNER (PUBLISHED -> SlideToConfirm Terima Pekerjaan) */}
            {role === "partner" && job.status === "PUBLISHED" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <DashboardCard className="border-primary/20 shadow-md">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-primary">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Ambil Pekerjaan?</h3>
                  <p className="text-xs text-muted-foreground mb-5">Geser tombol di bawah untuk menyetujui dan mengambil pekerjaan ini.</p>
                  
                  <SlideToConfirm 
                    onConfirm={handleAccept} 
                    label="Geser Terima Job" 
                    successLabel="Pekerjaan Diterima!"
                    isLoading={acceptJob.isPending}
                    variant="primary"
                  />
                </DashboardCard>
              </motion.div>
            )}

            {/* ACTION PANEL PARTNER (ACTIVE PROGRESS UPDATE) */}
            {role === "partner" && ["ACCEPTED", "ON_THE_WAY", "ARRIVED", "WORKING", "IN_PROGRESS"].includes(job.status) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <DashboardCard className="shadow-md space-y-4">
                  <h3 className="font-bold text-lg flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-primary" /> Update Progres & Foto
                  </h3>
                  
                  <textarea 
                    className="w-full text-sm p-4 rounded-2xl border bg-muted/30 outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Catatan progres (contoh: Menuju lokasi / sedang memperbaiki / selesai)"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />

                  {/* Hidden File Input for Camera/Gallery */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                  
                  {/* Photo Upload / Preview Box */}
                  {photoPreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 aspect-video bg-black/40">
                      <img src={photoPreview} alt="Pratinjau Foto" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-destructive transition-colors shadow-md"
                        title="Hapus Foto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
                        Foto Siap Terlampir
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isCompressingPhoto}
                      className="w-full h-24 border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors text-primary cursor-pointer group"
                    >
                      <div className="w-8 h-8 bg-primary/15 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs">
                        {isCompressingPhoto ? "Memproses Foto..." : "+ Lampirkan Foto Bukti / Progres"}
                      </span>
                    </button>
                  )}
                  
                  <div className="grid gap-3 pt-2">
                    {job.status === "ACCEPTED" && (
                      <Button 
                        className="w-full rounded-2xl h-14 text-base font-bold shadow-md shadow-primary/20" 
                        onClick={() => handleUpdateProgress("ON_THE_WAY")} 
                        disabled={addProgress.isPending}
                      >
                        <Navigation className="w-5 h-5 mr-2" /> Menuju Lokasi
                      </Button>
                    )}
                    {job.status === "ON_THE_WAY" && (
                      <Button 
                        className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 h-14 text-base font-bold shadow-md shadow-blue-600/20 text-white" 
                        onClick={() => handleUpdateProgress("ARRIVED")} 
                        disabled={addProgress.isPending}
                      >
                        <MapPin className="w-5 h-5 mr-2" /> Telah Tiba di Lokasi
                      </Button>
                    )}
                    {job.status === "ARRIVED" && (
                      <Button 
                        className="w-full rounded-2xl bg-amber-500 hover:bg-amber-600 h-14 text-base font-bold shadow-md shadow-amber-500/20 text-white" 
                        onClick={() => handleUpdateProgress("WORKING")} 
                        disabled={addProgress.isPending}
                      >
                        <Wrench className="w-5 h-5 mr-2" /> Mulai Bekerja
                      </Button>
                    )}
                    {["WORKING", "IN_PROGRESS"].includes(job.status) && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground px-1">
                          Tandai pekerjaan telah tuntas:
                        </p>
                        <SlideToConfirm
                          onConfirm={() => handleUpdateProgress("WAITING_CONFIRMATION")}
                          label="Geser Selesaikan Tugas"
                          successLabel="Progres Berhasil Dikirim!"
                          isLoading={addProgress.isPending}
                          variant="emerald"
                        />
                      </div>
                    )}
                  </div>
                </DashboardCard>
              </motion.div>
            )}

            {/* ACTION PANEL CONSUMER (WAITING CONFIRMATION -> SlideToConfirm Selesai) */}
            {role === "consumer" && job.status === "WAITING_CONFIRMATION" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <DashboardCard className="border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md">
                  <div className="bg-emerald-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-emerald-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-emerald-900 dark:text-emerald-400">
                    Konfirmasi Penyelesaian
                  </h3>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80 mb-5 font-medium">
                    Mitra menyatakan pekerjaan telah selesai. Periksa hasil kerja dan geser tombol di bawah untuk menyelesaikan pekerjaan.
                  </p>
                  <div className="flex flex-col gap-3">
                    <SlideToConfirm
                      onConfirm={handleComplete}
                      label="Geser Konfirmasi Selesai"
                      successLabel="Pekerjaan Berhasil Selesai!"
                      isLoading={confirmJob.isPending}
                      variant="emerald"
                    />
                    <Button 
                      variant="outline" 
                      className="w-full rounded-2xl h-11 text-xs font-bold" 
                      onClick={() => updateStatus.mutate({ id: id as string, status: "WORKING" })} 
                      disabled={updateStatus.isPending}
                    >
                      Minta Revisi
                    </Button>
                  </div>
                </DashboardCard>
              </motion.div>
            )}

            {/* COMPLETED REVIEW PANEL */}
            {role === "consumer" && job.status === "COMPLETED" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <DashboardCard className="shadow-sm border-primary/20">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-primary">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-primary">Pekerjaan Selesai</h3>
                  <p className="text-sm text-muted-foreground mb-6 font-medium">Terima kasih telah menggunakan Kerjain. Berikan review untuk mitra.</p>
                  <Button className="w-full rounded-2xl h-14 text-base font-bold shadow-md shadow-primary/20" onClick={() => router.push(`/dashboard/review/${id}`)}>
                    Beri Ulasan Mitra
                  </Button>
                </DashboardCard>
              </motion.div>
            )}
          </div>
        </div>

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
