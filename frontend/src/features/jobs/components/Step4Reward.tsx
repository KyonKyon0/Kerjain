"use client";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4RewardSchema, Step4FormData } from "@/features/jobs/schemas";
import { useCreateJobStore } from "@/store/create-job.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export function Step4Reward() {
  const { draft, updateDraft, nextStep, prevStep } = useCreateJobStore();
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<Step4FormData>({
    resolver: zodResolver(step4RewardSchema),
    defaultValues: { 
      rewardType: draft.rewardType || "FIXED", 
      rewardAmount: draft.rewardAmount,
      paymentMethod: draft.paymentMethod || "QRIS"
    }
  });

  const rewardType = useWatch({ control, name: "rewardType" });

  const onSubmit = (data: Step4FormData) => {
    updateDraft(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
        <label className="text-sm font-semibold">Nominal Imbalan (Rp)</label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 font-bold text-muted-foreground">Rp</span>
          <Controller
            control={control}
            name="rewardAmount"
            render={({ field: { onChange, value, ...field } }) => {
              // Convert number to string with dots for display
              const displayValue = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
              
              return (
                <Input 
                  type="text"
                  inputMode="numeric"
                  placeholder="50.000" 
                  className="pl-12 h-12 bg-muted/30 focus:bg-background text-lg font-semibold"
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
        {errors.rewardAmount && <p className="text-xs text-destructive">{errors.rewardAmount.message}</p>}
      </div>

      <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200 delay-100">
        <label className="text-sm font-semibold">Metode Pembayaran Tagihan</label>
        <p className="text-xs text-muted-foreground mb-2">Pilih metode yang akan digunakan saat pekerja selesai nanti.</p>
        
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field: { onChange, value } }) => (
            <div className="grid gap-3">
              {/* QRIS */}
              <label className={cn(
                "relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                value === "QRIS" ? "border-primary bg-primary/5" : "hover:border-primary/50"
              )}>
                <input type="radio" className="sr-only" checked={value === "QRIS"} onChange={() => onChange("QRIS")} />
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", value === "QRIS" ? "border-primary" : "border-muted-foreground/30")}>
                  {value === "QRIS" && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">QRIS (Otomatis)</h4>
                  <p className="text-xs text-muted-foreground">Bayar cepat dengan Dana, Gopay, OVO, dll</p>
                </div>
              </label>
              
              {/* CASH */}
              <label className={cn(
                "relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                value === "CASH" ? "border-primary bg-primary/5" : "hover:border-primary/50"
              )}>
                <input type="radio" className="sr-only" checked={value === "CASH"} onChange={() => onChange("CASH")} />
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", value === "CASH" ? "border-primary" : "border-muted-foreground/30")}>
                  {value === "CASH" && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Tunai (Cash)</h4>
                  <p className="text-xs text-muted-foreground">Bayar langsung di tempat saat pekerjaan selesai</p>
                </div>
              </label>
              
              {/* BANK (DISABLED) */}
              <label className="relative flex items-center gap-3 p-4 rounded-xl border-2 border-muted bg-muted/30 cursor-not-allowed opacity-60 grayscale">
                <input type="radio" className="sr-only" disabled />
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Transfer Bank Manual</h4>
                  <p className="text-xs text-muted-foreground">Sedang dalam perbaikan (Maintenance)</p>
                </div>
              </label>
            </div>
          )}
        />
      </div>

      <div className="flex justify-between pt-4 border-t mt-8">
        <Button type="button" variant="outline" onClick={prevStep} className="rounded-xl">Kembali</Button>
        <Button type="submit" className="rounded-xl shadow-md px-8 hover:-translate-y-0.5 transition-transform">Selanjutnya</Button>
      </div>
    </form>
  );
}
