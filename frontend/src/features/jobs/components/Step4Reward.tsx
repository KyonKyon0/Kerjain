"use client";
import { useForm, useWatch } from "react-hook-form";
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
    defaultValues: { rewardType: draft.rewardType || "FIXED", rewardAmount: draft.rewardAmount }
  });

  const rewardType = useWatch({ control, name: "rewardType" });

  const onSubmit = (data: Step4FormData) => {
    updateDraft(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setValue("rewardType", "FIXED", { shouldValidate: true })}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all h-full",
            rewardType === "FIXED" ? "border-primary bg-primary/5 text-primary shadow-md scale-105" : "border-border/50 bg-background hover:bg-muted/30 text-muted-foreground"
          )}
        >
          <Wallet className={cn("w-8 h-8 mb-3", rewardType === "FIXED" ? "text-primary" : "text-muted-foreground")} />
          <span className="font-bold">Nominal Pasti</span>
          <span className="text-xs opacity-70 mt-1">Tentukan budget spesifik</span>
        </button>
        
        <button
          type="button"
          onClick={() => {
            setValue("rewardType", "FLEXIBLE", { shouldValidate: true });
            setValue("rewardAmount", null);
          }}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all h-full",
            rewardType === "FLEXIBLE" ? "border-primary bg-primary/5 text-primary shadow-md scale-105" : "border-border/50 bg-background hover:bg-muted/30 text-muted-foreground"
          )}
        >
          <Heart className={cn("w-8 h-8 mb-3", rewardType === "FLEXIBLE" ? "text-primary" : "text-muted-foreground")} />
          <span className="font-bold">Seikhlasnya</span>
          <span className="text-xs opacity-70 mt-1">Sesuai kesepakatan akhir</span>
        </button>
      </div>

      {rewardType === "FIXED" && (
        <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <label className="text-sm font-semibold">Nominal Imbalan (Rp)</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 font-bold text-muted-foreground">Rp</span>
            <Input 
              type="number"
              placeholder="50000" 
              className="pl-12 h-12 bg-muted/30 focus:bg-background text-lg font-semibold"
              {...register("rewardAmount", { valueAsNumber: true })} 
            />
          </div>
          {errors.rewardAmount && <p className="text-xs text-destructive">{errors.rewardAmount.message}</p>}
        </div>
      )}

      <div className="flex justify-between pt-4 border-t mt-8">
        <Button type="button" variant="outline" onClick={prevStep} className="rounded-xl">Kembali</Button>
        <Button type="submit" className="rounded-xl shadow-md px-8 hover:-translate-y-0.5 transition-transform">Selanjutnya</Button>
      </div>
    </form>
  );
}
