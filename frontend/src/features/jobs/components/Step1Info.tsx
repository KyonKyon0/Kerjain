"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1InfoSchema, Step1FormData } from "@/features/jobs/schemas";
import { useCreateJobStore } from "@/store/create-job.store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function Step1Info() {
  const { draft, updateDraft, nextStep } = useCreateJobStore();
  const { register, handleSubmit, formState: { errors } } = useForm<Step1FormData>({
    resolver: zodResolver(step1InfoSchema),
    defaultValues: { title: draft.title, description: draft.description }
  });

  const onSubmit = (data: Step1FormData) => {
    updateDraft(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <label className="text-sm font-semibold">Judul Pekerjaan</label>
        <Input 
          placeholder="Contoh: Bantu angkat galon air" 
          className="h-12 bg-muted/30 focus:bg-background transition-colors"
          {...register("title")} 
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Deskripsi Lengkap</label>
        <Textarea 
          placeholder="Jelaskan detail pekerjaan yang Anda butuhkan..." 
          className="min-h-[120px] bg-muted/30 focus:bg-background transition-colors resize-none"
          {...register("description")} 
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" className="rounded-xl shadow-md px-8 hover:-translate-y-0.5 transition-transform">Selanjutnya</Button>
      </div>
    </form>
  );
}
