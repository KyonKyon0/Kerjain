"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1InfoSchema, Step1FormData } from "@/features/jobs/schemas";
import { useCreateJobStore } from "@/store/create-job.store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, ImageIcon, Sparkles, Loader2 } from "lucide-react";
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
        toast.success("Foto pekerjaan berhasil dilampirkan");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setValue("photoUrl", null);
    updateDraft({ photoUrl: null });
    toast.info("Foto pekerjaan dihapus");
  };

  const onSubmit = (data: Step1FormData) => {
    updateDraft({ ...data, photoUrl: photoPreview });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground">Judul Pekerjaan</label>
        <Input 
          placeholder="Contoh: Bantu angkat galon air / Perbaiki kran bocor" 
          className="h-12 bg-muted/30 focus:bg-background transition-colors rounded-2xl text-sm"
          {...register("title")} 
        />
        {errors.title && <p className="text-xs text-destructive font-medium">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground">Deskripsi Lengkap</label>
        <Textarea 
          placeholder="Jelaskan detail pekerjaan, kondisi barang, apa saja yang perlu disiapkan..." 
          className="min-h-[120px] bg-muted/30 focus:bg-background transition-colors resize-none rounded-2xl text-sm"
          {...register("description")} 
        />
        {errors.description && <p className="text-xs text-destructive font-medium">{errors.description.message}</p>}
      </div>

      {/* Foto Pekerjaan / Barang */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-primary" />
            Foto Pekerjaan / Lokasi (Opsional)
          </label>
          <span className="text-xs text-muted-foreground font-medium">Bantu mitra paham tugas</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handlePhotoSelect}
        />

        {photoPreview ? (
          <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 aspect-video bg-black/40 group">
            <img src={photoPreview} alt="Foto Pekerjaan" className="w-full h-full object-cover" />
            
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

            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
              ✓ Foto Siap Terpasang
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isCompressing}
            className="w-full h-28 border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors text-primary cursor-pointer group"
          >
            {isCompressing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs font-bold">Memproses foto...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-primary/15 rounded-2xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <span className="font-extrabold text-xs">+ Unggah Foto Pekerjaan / Barang</span>
                <span className="text-[11px] text-muted-foreground mt-0.5">Kamera langsung atau pilih dari galeri</span>
              </div>
            )}
          </button>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" className="rounded-2xl shadow-md px-8 h-12 font-extrabold hover:-translate-y-0.5 transition-transform bg-primary hover:bg-emerald-600">
          Selanjutnya
        </Button>
      </div>
    </form>
  );
}
