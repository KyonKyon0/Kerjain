"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3LocationSchema, Step3FormData } from "@/features/jobs/schemas";
import { useCreateJobStore } from "@/store/create-job.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation } from "lucide-react";

export function Step3Location() {
  const { draft, updateDraft, nextStep, prevStep } = useCreateJobStore();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Step3FormData>({
    resolver: zodResolver(step3LocationSchema),
    defaultValues: { address: draft.address || "", lat: draft.lat, lng: draft.lng }
  });

  const useCurrentLocation = () => {
    setValue("address", "Jl. Sudirman No. 45, Jakarta Pusat", { shouldValidate: true });
    setValue("lat", -6.2088);
    setValue("lng", 106.8456);
  };

  const onSubmit = (data: Step3FormData) => {
    updateDraft(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      <div className="w-full h-48 bg-muted/30 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden group">
        <MapPin className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm font-medium">Peta interaktif belum tersedia</p>
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
          <Button type="button" onClick={useCurrentLocation} className="shadow-lg rounded-xl">
            <Navigation className="w-4 h-4 mr-2" /> Gunakan Lokasi Saat Ini
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Alamat Lengkap</label>
        <Input 
          placeholder="Masukkan alamat detail..." 
          className="h-12 bg-muted/30 focus:bg-background"
          {...register("address")} 
        />
        {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={prevStep} className="rounded-xl">Kembali</Button>
        <Button type="submit" className="rounded-xl shadow-md px-8 hover:-translate-y-0.5 transition-transform">Selanjutnya</Button>
      </div>
    </form>
  );
}
