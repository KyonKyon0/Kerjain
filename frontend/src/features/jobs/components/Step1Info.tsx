"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1InfoSchema, Step1FormData } from "@/features/jobs/schemas";
import { useCreateJobStore } from "@/store/create-job.store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function Step1Info() {
  const { draft, updateDraft, nextStep } = useCreateJobStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(draft.photoUrl || null);
  const [isCompressing, setIsCompressing] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Step1FormData>({
    resolver: zodResolver(step1InfoSchema),
    defaultValues: { 
      title: draft.title || "", 
      description: draft.description || "",
      photoUrl: draft.photoUrl || null 
    }
  });

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Format file harus berupa foto atau gambar");
    }

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 900;
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
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.84);
        setPhotoPreview(compressedDataUrl);
        setValue("photoUrl", compressedDataUrl);
        updateDraft({ photoUrl: compressedDataUrl });
        setIsCompressing(false);
        toast.success("Foto berhasil dilampirkan");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setValue("photoUrl", null);
    updateDraft({ photoUrl: null });
    toast.info("Foto lampiran dihapus");
  };

  const onSubmit = (data: Step1FormData) => {
    updateDraft({ ...data, photoUrl: photoPreview });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* 1. LAMPIRAN FOTO DI PALING ATAS (CLEAN & PROFESSIONAL) */}
      <div className="space-y-1.5">
        <label className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-primary" />
          Lampiran Foto (Opsional)
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handlePhotoSelect}
        />

        {photoPreview ? (
          <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 aspect-video bg-black/40 group max-h-52 w-full">
            <img src={photoPreview} alt="Foto Tugas" className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="rounded-xl font-bold text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-3.5 h-3.5 mr-1" /> Ganti Foto
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="rounded-xl font-bold text-xs"
                onClick={handleRemovePhoto}
              >
                <X className="w-3.5 h-3.5 mr-1" /> Hapus
              </Button>
            </div>

            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold">
              ✓ Foto Terlampir
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isCompressing}
            className="w-full h-22 border-2 border-dashed border-border/80 hover:border-primary/50 rounded-2xl flex flex-col items-center justify-center bg-card/60 hover:bg-card transition-all text-primary cursor-pointer group"
          >
            {isCompressing ? (
              <div className="flex flex-col items-center gap-1.5">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-xs font-bold text-muted-foreground">Mengompres foto...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center mb-1 group-hover:scale-105 transition-transform text-primary">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="font-black text-xs text-foreground group-hover:text-primary transition-colors">
                  + Pilih Foto atau Ambil Gambar
                </span>
              </div>
            )}
          </button>
        )}
      </div>


      {/* 2. JUDUL TUGAS */}
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

      {/* 3. DETAIL & INSTRUKSI */}
      <div className="space-y-1.5">
        <label className="text-xs font-black uppercase tracking-wider text-foreground">
          Detail & Instruksi Pengerjaan <span className="text-destructive">*</span>
        </label>
        <Textarea 
          placeholder="Tuliskan rincian kebutuhan, estimasi waktu, atau perlengkapan yang perlu dibawa mitra..." 
          className="min-h-[110px] bg-card border-border/80 text-foreground font-medium resize-none rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-primary/20"
          {...register("description")} 
        />
        {errors.description && <p className="text-[11px] text-destructive font-bold">{errors.description.message}</p>}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-end pt-4 border-t border-border/70">
        <Button 
          type="submit" 
          className="rounded-2xl shadow-sm px-6 h-11 font-extrabold bg-primary text-white hover:bg-primary/90 flex items-center gap-1.5"
        >
          <span>Lanjut ke Kategori</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
