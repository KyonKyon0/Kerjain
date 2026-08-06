"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { useJobDetail, useAcceptJob, useConfirmJob, useCancelJob, useJobTimeline, useAddProgress, useUpdateJobStatus } from "@/hooks/useJobs";
import { useCreatePayment } from "@/hooks/usePayment";
import { JobProgress } from "@/types";
import { JobTimeline } from "@/components/jobs/JobTimeline";
import { LocationCard } from "@/components/jobs/LocationCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { AcceptDialog } from "@/components/jobs/AcceptDialog";
import { CompletionDialog } from "@/components/jobs/CompletionDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

import { ArrowLeft, Tag, Wallet, Clock, UserCircle2, CheckCircle2, MessageSquare, Phone, Camera, AlertCircle, Upload, Navigation, Wrench, ShieldCheck, Zap, Search, Briefcase, Star } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
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

  const handleAccept = async () => {
    await acceptJob.mutateAsync(id as string);
    setIsAcceptOpen(false);
  };

  const handleUpdateProgress = async (newStatus: string) => {
    await addProgress.mutateAsync({
      id: id as string,
      data: {
        status: newStatus,
        note: note || `Pekerjaan dilanjutkan ke tahap ${newStatus}`
      }
    });
    setNote("");
  };

  const handleComplete = async () => {
    if (job?.rewardAmount && job.rewardType === "FIXED") {
      await createPayment.mutateAsync({ jobId: id as string, amount: job.rewardAmount });
    } else {
      await createPayment.mutateAsync({ jobId: id as string, amount: 0 });
    }
    await confirmJob.mutateAsync(id as string);
    setIsCompletionOpen(false);
    router.push(`/dashboard/payment/${id}`);
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

  const logs: JobProgress[] = (timelineData as unknown as JobProgress[]) || [];

  return (
    <DashboardLayout>
      <PageContainer className="max-w-5xl">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground rounded-xl" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>

        {/* Header section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={job.status} />
              <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(job.createdAt).toLocaleString("id-ID")}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">{job.title}</h1>
          </div>
          {job.status === "PUBLISHED" && role === "consumer" && (
            <Button variant="destructive" className="rounded-xl shadow-sm" onClick={() => cancelJob.mutate(id as string)}>
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
                    <h4 className="font-bold text-sm text-foreground mb-4">Riwayat Progres Terbaru</h4>
                    <div className="space-y-4">
                      {logs.map((log) => (
                        <div key={log.id} className="flex gap-4 items-start">
                          <div className="w-3 h-3 mt-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                          <div className="flex-1 bg-muted/20 border border-border/50 rounded-2xl p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-bold text-primary">{log.statusSnapshot}</span>
                              <span className="text-xs font-medium text-muted-foreground">{new Date(log.createdAt).toLocaleString("id-ID")}</span>
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

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <DashboardCard className="shadow-sm">
                <h3 className="font-bold text-lg mb-4">Detail Pekerjaan</h3>
                <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">{job.description}</p>
                
                <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-4">
                  <div className="bg-muted/30 border rounded-2xl p-4 flex-1 min-w-[140px]">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">Kategori</p>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 text-primary rounded-xl"><Tag className="w-5 h-5" /></div>
                      <span className="font-bold text-sm">{job.category}</span>
                    </div>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex-1 min-w-[140px]">
                    <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-bold uppercase tracking-wider mb-2">Imbalan</p>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl"><Wallet className="w-5 h-5" /></div>
                      <span className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
                        {job.rewardType === "FIXED" ? `Rp ${job.rewardAmount?.toLocaleString("id-ID")}` : "Seikhlasnya"}
                      </span>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
              <LocationCard address={job.address} latitude={job.lat ?? null} longitude={job.lng ?? null} />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <DashboardCard className="bg-gradient-to-br from-primary to-emerald-500 text-white border-none shadow-lg">
                <h3 className="font-bold mb-4 opacity-90">Informasi {role === "consumer" ? "Mitra" : "Klien"}</h3>
                {job.status === "PUBLISHED" ? (
                  <div className="text-center py-8">
                    <div className="relative inline-flex mb-6">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <Search className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute top-0 right-0 w-5 h-5 bg-amber-400 rounded-full border-4 border-primary animate-ping" />
                    </div>
                    <p className="text-sm font-bold opacity-90">
                      {role === "consumer" ? "Mencarikan mitra terdekat..." : "Jadilah yang pertama mengambil pekerjaan ini!"}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                      <Avatar className="w-14 h-14 border-2 border-white/50">
                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${role === "consumer" ? job.partnerName : job.consumerName}`} />
                        <AvatarFallback>{(role === "consumer" ? job.partnerName : job.consumerName)?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-1">
                          {role === "consumer" ? "Mitra yang menangani" : "Pemilik Pekerjaan"}
                        </p>
                        <p className="font-bold text-lg">{role === "consumer" ? job.partnerName : job.consumerName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90 rounded-xl font-bold h-12">
                        <MessageSquare className="w-5 h-5 mr-2" /> Chat
                      </Button>
                      <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl font-bold h-12">
                        <Phone className="w-5 h-5 mr-2" /> Telepon
                      </Button>
                    </div>
                  </div>
                )}
              </DashboardCard>
            </motion.div>

            {/* ACTION PANEL PARTNER */}
            {role === "partner" && job.status === "PUBLISHED" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <DashboardCard className="border-primary/20 shadow-md">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-primary">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Ambil Pekerjaan?</h3>
                  <p className="text-sm text-muted-foreground mb-6">Pastikan Anda bisa menyelesaikannya dengan baik.</p>
                  <Button className="w-full rounded-2xl shadow-lg shadow-primary/20 h-14 text-lg font-bold" onClick={() => setIsAcceptOpen(true)}>
                    Terima Pekerjaan
                  </Button>
                </DashboardCard>
              </motion.div>
            )}

            {role === "partner" && ["ACCEPTED", "ON_THE_WAY", "WORKING"].includes(job.status) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <DashboardCard className="shadow-md">
                  <h3 className="font-bold text-lg mb-4 flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-primary" /> Update Progres
                  </h3>
                  
                  <textarea 
                    className="w-full text-sm p-4 rounded-2xl border bg-muted/30 mb-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Catatan progres (contoh: Saya sedang menuju lokasi)"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  
                  {job.status === "WORKING" && (
                    <div className="mb-6 h-28 border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mb-2 text-primary">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm text-primary">Upload Foto Hasil</span>
                    </div>
                  )}
                  
                  <div className="grid gap-3">
                    {job.status === "ACCEPTED" && (
                      <Button className="w-full rounded-2xl h-14 text-base font-bold shadow-md shadow-primary/20" onClick={() => handleUpdateProgress("ON_THE_WAY")} disabled={addProgress.isPending}>
                        <Navigation className="w-5 h-5 mr-2" /> Menuju Lokasi
                      </Button>
                    )}
                    {job.status === "ON_THE_WAY" && (
                      <Button className="w-full rounded-2xl bg-amber-500 hover:bg-amber-600 h-14 text-base font-bold shadow-md shadow-amber-500/20" onClick={() => handleUpdateProgress("WORKING")} disabled={addProgress.isPending}>
                        <Wrench className="w-5 h-5 mr-2" /> Mulai Dikerjakan
                      </Button>
                    )}
                    {job.status === "WORKING" && (
                      <Button className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 h-14 text-base font-bold shadow-md shadow-emerald-600/20" onClick={() => handleUpdateProgress("WAITING_CONFIRMATION")} disabled={addProgress.isPending}>
                        <CheckCircle2 className="w-5 h-5 mr-2" /> Selesaikan Pekerjaan
                      </Button>
                    )}
                  </div>
                </DashboardCard>
              </motion.div>
            )}

            {/* ACTION PANEL CONSUMER */}
            {role === "consumer" && job.status === "WAITING_CONFIRMATION" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <DashboardCard className="border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md">
                  <div className="bg-emerald-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-emerald-900 dark:text-emerald-400">
                    Konfirmasi Penyelesaian
                  </h3>
                  <p className="text-sm text-emerald-800/80 dark:text-emerald-400/80 mb-6 font-medium">Mitra menyatakan pekerjaan telah selesai. Silakan periksa hasil kerja mitra.</p>
                  <div className="flex flex-col gap-3">
                    <Button className="w-full rounded-2xl shadow-lg shadow-emerald-600/20 bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-base font-bold" onClick={() => setIsCompletionOpen(true)}>
                      Konfirmasi & Bayar
                    </Button>
                    <Button variant="outline" className="w-full rounded-2xl h-14 text-base font-bold" onClick={() => updateStatus.mutate({ id: id as string, status: "WORKING" })} disabled={updateStatus.isPending}>
                      Minta Revisi
                    </Button>
                  </div>
                </DashboardCard>
              </motion.div>
            )}
            
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
          isLoading={createPayment.isPending}
        />
      </PageContainer>
    </DashboardLayout>
  );
}
