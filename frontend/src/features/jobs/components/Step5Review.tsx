"use client";

import { useCreateJobStore } from "@/store/create-job.store";
import { useCreateJob } from "@/hooks/useJobs";
import { CreateJobData } from "@/features/jobs/schemas";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Tag, Wallet, Camera, ArrowLeft, Send, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Step5Review() {
  const { draft, prevStep, resetDraft } = useCreateJobStore();
  const createJob = useCreateJob();

  const handlePublish = async () => {
    try {
      await createJob.mutateAsync(draft as CreateJobData);
      resetDraft();
    } catch {
      // Error handled by the hook
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-black uppercase tracking-wider text-foreground">
          Ringkasan & Konfirmasi Publikasi
        </label>
        <p className="text-muted-foreground text-xs font-medium mt-0.5">
          Periksa kembali rincian tugas Anda sebelum disiarkan ke radar mitra terdekat
        </p>
      </div>

      <Card className="bg-card border border-border/80 rounded-3xl p-4 sm:p-6 shadow-2xs space-y-4 overflow-hidden w-full max-w-full">
        {draft.photoUrl && (
          <div className="relative rounded-2xl overflow-hidden aspect-video border border-border/80 bg-black/40 max-h-52 w-full">
            <img src={draft.photoUrl} alt="Foto Tugas" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-xl text-white text-[10px] font-bold flex items-center gap-1">
              <Camera className="w-3 h-3" /> Foto Lampiran Terpasang
            </div>
          </div>
        )}

        <div className="space-y-1">
          <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20">
            {draft.category || "Tugas Umum"}
          </span>
          <h3 className="font-black text-base sm:text-xl text-foreground mt-1.5 tracking-tight break-words">{draft.title}</h3>
          <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed mt-1 font-medium break-words">{draft.description}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/70">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-card/60 border border-border/60 min-w-0 overflow-hidden">
            <div className="p-1.5 bg-red-500/10 text-red-500 rounded-xl shrink-0 mt-0.5"><MapPin className="w-4 h-4" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Lokasi Tugas</p>
              <p className="font-bold text-xs text-foreground truncate mt-0.5">{draft.address}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-card/60 border border-border/60 min-w-0 overflow-hidden">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0 mt-0.5"><Wallet className="w-4 h-4" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Nominal Imbalan</p>
              <p className="font-black text-xs text-emerald-400 mt-0.5 truncate">
                Rp {draft.rewardAmount?.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-card/60 border border-border/60 flex items-center justify-between gap-2 overflow-hidden">
          <span className="text-[11px] font-bold text-muted-foreground shrink-0">Metode Pembayaran</span>
          <span className="text-xs font-black text-foreground truncate text-right">
            {draft.paymentMethod === "QRIS" ? "QRIS Rekber Otomatis" : "Tunai di Tempat (Cash)"}
          </span>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-border/70 w-full overflow-hidden">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep} 
          className="rounded-2xl h-11 px-3.5 sm:px-5 font-bold border-border/80 flex items-center gap-1.5 shrink-0 text-xs sm:text-sm" 
          disabled={createJob.isPending}
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Kembali</span>
        </Button>
        <Button 
          onClick={handlePublish} 
          className="rounded-2xl shadow-sm px-4 sm:px-6 h-11 font-black bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-1.5 text-xs sm:text-sm shrink-0 min-w-0 max-w-[calc(100%-100px)] sm:max-w-none" 
          disabled={createJob.isPending}
        >
          {createJob.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin shrink-0" />
              <span className="truncate">Menyiarkan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="truncate">Publikasikan Sekarang</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
