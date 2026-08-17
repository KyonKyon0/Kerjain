"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1InfoSchema, Step1FormData } from "@/features/jobs/schemas";
import { useCreateJobStore } from "@/store/create-job.store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function Step1Info() {
  const { draft, updateDraft, nextStep } = useCreateJobStore();
  const { register, handleSubmit, formState: { errors } } = useForm<Step1FormData>({
    resolver: zodResolver(step1InfoSchema),
    defaultValues: {
      title: draft.title || "",
      description: draft.description || "",
    },
  });

  const onSubmit = (data: Step1FormData) => {
    updateDraft({ ...data });
    nextStep();
    toast.success("Data disimpan, lanjut ke kategori");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-black uppercase tracking-wider text-foreground">
          Judul Tugas <span className="text-destructive">*</span>
        </label>
        <Input
          placeholder="Contoh: Perbaikan instalasi listrik / Angkut barang"
          className="h-12 bg-card border-border/80 text-foreground font-medium rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-primary/20"
          {...register("title")}
        />
        {errors.title && <p className="text-[11px] text-destructive font-bold">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-black uppercase tracking-wider text-foreground">
          Detail &amp; Instruksi Pengerjaan <span className="text-destructive">*</span>
        </label>
        <Textarea
          placeholder="Tuliskan rincian kebutuhan, estimasi waktu, atau perlengkapan yang perlu dibawa mitra..."
          className="min-h-[110px] bg-card border-border/80 text-foreground font-medium resize-none rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-primary/20"
          {...register("description")}
        />
        {errors.description && <p className="text-[11px] text-destructive font-bold">{errors.description.message}</p>}
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4 border-t border-border/70 w-full overflow-hidden">
        <Button type="submit" className="rounded-2xl shadow-sm px-4 sm:px-6 h-11 font-extrabold bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-1.5 text-xs sm:text-sm shrink-0 min-w-0">
          <span className="truncate">Lanjut ke Kategori</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </Button>
      </div>
    </form>
  );
}
