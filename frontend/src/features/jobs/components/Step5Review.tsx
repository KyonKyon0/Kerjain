"use client";

import { useCreateJobStore } from "@/store/create-job.store";
import { useCreateJob } from "@/hooks/useJobs";
import { CreateJobData } from "@/features/jobs/schemas";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Tag, Wallet, Camera } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <h3 className="text-xl font-extrabold text-foreground">Ringkasan Pekerjaan</h3>
        <p className="text-muted-foreground text-sm mt-1">Periksa kembali detail pekerjaan Anda sebelum diterbitkan ke mitra.</p>
      </div>

      <DashboardCard className="bg-muted/10 border-2 rounded-3xl p-6 space-y-4">
        {draft.photoUrl && (
          <div className="relative rounded-2xl overflow-hidden aspect-video border border-border/80 bg-black/40 mb-4">
            <img src={draft.photoUrl} alt="Foto Pekerjaan" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-xl text-white text-[11px] font-bold flex items-center gap-1">
              <Camera className="w-3 h-3" /> Foto Terlampir
            </div>
          </div>
        )}

        <h4 className="font-extrabold text-xl text-primary">{draft.title}</h4>
        <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{draft.description}</p>
        
        <div className="space-y-3.5 pt-4 border-t border-border/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0"><Tag className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Kategori</p>
              <p className="font-bold text-sm text-foreground">{draft.category}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 text-red-600 rounded-xl shrink-0"><MapPin className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Lokasi</p>
              <p className="font-bold text-sm text-foreground">{draft.address}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl shrink-0"><Wallet className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Imbalan / Upah</p>
              <p className="font-bold text-sm text-foreground">
                Rp {draft.rewardAmount?.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl shrink-0"><Wallet className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Metode Pembayaran</p>
              <p className="font-bold text-sm text-foreground">
                {draft.paymentMethod === "QRIS" ? "QRIS (Otomatis & Aman)" : draft.paymentMethod === "CASH" ? "Tunai (Cash Langsung)" : "Lainnya"}
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>

      <div className="flex justify-between pt-4 border-t mt-8 gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep} 
          className="rounded-2xl h-12 px-6 font-bold" 
          disabled={createJob.isPending}
        >
          Kembali
        </Button>
        <Button 
          onClick={handlePublish} 
          className="rounded-2xl shadow-md px-8 h-12 font-extrabold hover:-translate-y-0.5 transition-transform bg-primary hover:bg-emerald-600" 
          disabled={createJob.isPending}
        >
          {createJob.isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menerbitkan...</>
          ) : (
            "Terbitkan Sekarang"
          )}
        </Button>
      </div>
    </div>
  );
}
