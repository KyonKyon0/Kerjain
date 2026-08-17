"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4RewardSchema, Step4FormData } from "@/features/jobs/schemas";
import { useCreateJobStore } from "@/store/create-job.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, QrCode, Banknote, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_AMOUNTS = [25000, 50000, 75000, 100000, 150000];

export function Step4Reward() {
  const { draft, updateDraft, nextStep, prevStep } = useCreateJobStore();
  const { handleSubmit, setValue, control, formState: { errors } } = useForm<Step4FormData>({
    resolver: zodResolver(step4RewardSchema),
    defaultValues: { 
      rewardType: draft.rewardType || "FIXED", 
      rewardAmount: draft.rewardAmount,
      paymentMethod: draft.paymentMethod || "QRIS"
    }
  });

  const onSubmit = (data: Step4FormData) => {
    updateDraft(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* 1. NOMINAL IMBALAN */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-foreground">
            Nominal Imbalan Mitra <span className="text-destructive">*</span>
          </label>
          <span className="text-[11px] text-muted-foreground font-medium">Sesuai kesepakatan tugas</span>
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-sm text-primary">Rp</span>
          <Controller
            control={control}
            name="rewardAmount"
            render={({ field: { onChange, value, ...field } }) => {
              const displayValue = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
              
              return (
                <Input 
                  type="text"
                  inputMode="numeric"
                  placeholder="50.000" 
                  className="pl-12 h-13 bg-card border-border/80 text-foreground text-base sm:text-lg font-black rounded-2xl focus:ring-2 focus:ring-primary/20"
                  {...field}
                  value={displayValue}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    if (rawValue === "") {
                      onChange(null);
                    } else {
                      onChange(parseInt(rawValue, 10));
                    }
                  }}
                />
              );
            }}
          />
        </div>

        {/* Quick Amount Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setValue("rewardAmount", amt, { shouldValidate: true })}
              className="px-2.5 py-1 rounded-xl bg-card border border-border/80 text-[11px] font-bold text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
            >
              Rp {(amt / 1000).toLocaleString("id-ID")}rb
            </button>
          ))}
        </div>

        {errors.rewardAmount && <p className="text-[11px] text-destructive font-bold">{errors.rewardAmount.message}</p>}
      </div>

      {/* 2. METODE PEMBAYARAN */}
      <div className="space-y-2 pt-2">
        <label className="text-xs font-black uppercase tracking-wider text-foreground">
          Metode Pembayaran <span className="text-destructive">*</span>
        </label>
        
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field: { onChange, value } }) => (
            <div className="grid gap-2.5">
              
              {/* QRIS OPTION */}
              <label className={cn(
                "relative flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer",
                value === "QRIS" 
                  ? "border-emerald-500/50 bg-emerald-500/10 shadow-xs" 
                  : "border-border/80 bg-card hover:border-border"
              )}>
                <input type="radio" className="sr-only" checked={value === "QRIS"} onChange={() => onChange("QRIS")} />
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-xs text-foreground">QRIS Rekber Otomatis</h4>
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">
                      Paling Aman
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                    Dana ditahan sistem Rekber dan hanya cair setelah Anda puas dengan hasil kerja
                  </p>
                </div>
              </label>
              
              {/* CASH OPTION */}
              <label className={cn(
                "relative flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer",
                value === "CASH" 
                  ? "border-emerald-500/50 bg-emerald-500/10 shadow-xs" 
                  : "border-border/80 bg-card hover:border-border"
              )}>
                <input type="radio" className="sr-only" checked={value === "CASH"} onChange={() => onChange("CASH")} />
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-xs text-foreground">Tunai di Tempat (Cash)</h4>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                    Bayar langsung secara tunai ke tangan mitra setelah pekerjaan selesai
                  </p>
                </div>
              </label>

            </div>
          )}
        />
      </div>

      <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-border/70 w-full overflow-hidden">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep} 
          className="rounded-2xl h-11 px-3.5 sm:px-5 font-bold border-border/80 flex items-center gap-1.5 shrink-0 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Kembali</span>
        </Button>
        <Button 
          type="submit" 
          className="rounded-2xl shadow-sm px-4 sm:px-6 h-11 font-extrabold bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-1.5 text-xs sm:text-sm shrink-0 min-w-0"
        >
          <span className="truncate">Lanjut ke Ringkasan</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </Button>
      </div>
    </form>
  );
}
