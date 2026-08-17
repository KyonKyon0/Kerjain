"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2CategorySchema, Step2FormData } from "@/features/jobs/schemas";
import { useCreateJobStore } from "@/store/create-job.store";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/jobs/CategoryCard";
import { Home, Wrench, Package, Heart, MoreHorizontal, ArrowLeft, ArrowRight } from "lucide-react";

const CATEGORIES = [
  { id: "Angkat Barang", icon: <Package className="w-5 h-5" /> },
  { id: "Bersih-bersih", icon: <Home className="w-5 h-5" /> },
  { id: "Perbaikan", icon: <Wrench className="w-5 h-5" /> },
  { id: "Penjagaan", icon: <Heart className="w-5 h-5" /> },
  { id: "Lainnya", icon: <MoreHorizontal className="w-5 h-5" /> },
];

export function Step2Category() {
  const { draft, updateDraft, nextStep, prevStep } = useCreateJobStore();
  const { handleSubmit, setValue, control, formState: { errors } } = useForm<Step2FormData>({
    resolver: zodResolver(step2CategorySchema),
    defaultValues: { category: draft.category || "" }
  });

  const selectedCategory = useWatch({ control, name: "category" });

  const onSubmit = (data: Step2FormData) => {
    updateDraft(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-xs font-black uppercase tracking-wider text-foreground">
          Pilih Kategori Tugas <span className="text-destructive">*</span>
        </label>
        <p className="text-muted-foreground text-xs font-medium mt-0.5">
          Pilih kategori yang paling menggambarkan pekerjaan yang dibutuhkan
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => (
          <CategoryCard 
            key={cat.id}
            title={cat.id}
            icon={cat.icon}
            selected={selectedCategory === cat.id}
            onClick={() => setValue("category", cat.id, { shouldValidate: true })}
          />
        ))}
      </div>
      {errors.category && <p className="text-xs text-destructive font-bold text-center">{errors.category.message}</p>}

      <div className="flex items-center justify-between pt-4 border-t border-border/70">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep} 
          className="rounded-2xl h-11 px-5 font-bold border-border/80 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </Button>
        <Button 
          type="submit" 
          className="rounded-2xl shadow-sm px-6 h-11 font-extrabold bg-primary text-white hover:bg-primary/90 flex items-center gap-1.5" 
          disabled={!selectedCategory}
        >
          <span>Lanjut ke Lokasi</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
