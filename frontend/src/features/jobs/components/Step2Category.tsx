"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2CategorySchema, Step2FormData } from "@/features/jobs/schemas";
import { useCreateJobStore } from "@/store/create-job.store";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/jobs/CategoryCard";
import { Home, Wrench, Package, Heart, MoreHorizontal } from "lucide-react";

const CATEGORIES = [
  { id: "Angkat Barang", icon: <Package className="w-6 h-6" /> },
  { id: "Bersih-bersih", icon: <Home className="w-6 h-6" /> },
  { id: "Perbaikan", icon: <Wrench className="w-6 h-6" /> },
  { id: "Penjagaan", icon: <Heart className="w-6 h-6" /> },
  { id: "Lainnya", icon: <MoreHorizontal className="w-6 h-6" /> },
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
      {errors.category && <p className="text-sm text-destructive font-medium text-center">{errors.category.message}</p>}

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={prevStep} className="rounded-xl">Kembali</Button>
        <Button type="submit" className="rounded-xl shadow-md px-8 hover:-translate-y-0.5 transition-transform" disabled={!selectedCategory}>Selanjutnya</Button>
      </div>
    </form>
  );
}
