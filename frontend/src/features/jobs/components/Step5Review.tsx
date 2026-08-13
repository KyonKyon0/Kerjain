"use client";

import { useCreateJobStore } from "@/store/create-job.store";
import { useCreateJob } from "@/hooks/useJobs";
import { CreateJobData } from "@/features/jobs/schemas";
import { Button } from "@/components/ui/button";

import { Loader2, MapPin, Tag, Wallet } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export function Step5Review() {
  const { draft, prevStep, resetDraft } = useCreateJobStore();
  const createJob = useCreateJob();


  const handlePublish = async () => {
    try {
      await createJob.mutateAsync(draft as CreateJobData);
      resetDraft();
      // useCreateJob hook will handle the redirect and toast
    } catch {
      // Error handled by the hook
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">Ringkasan Pekerjaan</h3>
        <p className="text-muted-foreground text-sm mt-1">Periksa kembali detail pekerjaan Anda sebelum diterbitkan.</p>
      </div>

      <DashboardCard className="bg-muted/10 border-2">
        <h4 className="font-bold text-lg mb-2 text-primary">{draft.title}</h4>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-6">{draft.description}</p>
        
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0"><Tag className="w-4 h-4" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Kategori</p>
              <p className="font-medium text-sm">{draft.category}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0"><MapPin className="w-4 h-4" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Lokasi</p>
              <p className="font-medium text-sm">{draft.address}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg shrink-0"><Wallet className="w-4 h-4" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Imbalan</p>
              <p className="font-medium text-sm">
                Rp {draft.rewardAmount?.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0"><Wallet className="w-4 h-4" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Metode Pembayaran</p>
              <p className="font-medium text-sm">
                {draft.paymentMethod === "QRIS" ? "QRIS (Otomatis)" : draft.paymentMethod === "CASH" ? "Tunai (Cash)" : "Lainnya"}
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>

      <div className="flex justify-between pt-4 border-t mt-8">
        <Button type="button" variant="outline" onClick={prevStep} className="rounded-xl" disabled={createJob.isPending}>Kembali</Button>
        <Button onClick={handlePublish} className="rounded-xl shadow-md px-8 hover:-translate-y-0.5 transition-transform" disabled={createJob.isPending}>
          {createJob.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</> : "Terbitkan Sekarang"}
        </Button>
      </div>
    </div>
  );
}
