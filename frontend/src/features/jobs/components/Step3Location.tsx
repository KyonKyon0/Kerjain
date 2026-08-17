"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3LocationSchema, Step3FormData } from "@/features/jobs/schemas";
import { useCreateJobStore } from "@/store/create-job.store";
import { Button } from "@/components/ui/button";
import { MapPin, Edit2, ArrowLeft, ArrowRight } from "lucide-react";
import { LocationPicker, LocationData, MapViewer, InteractiveMap } from "@/components/maps";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export function Step3Location() {
  const { draft, updateDraft, nextStep, prevStep } = useCreateJobStore();
  const { handleSubmit, setValue, watch, formState: { errors } } = useForm<Step3FormData>({
    resolver: zodResolver(step3LocationSchema),
    defaultValues: { address: draft.address || "", lat: draft.lat, lng: draft.lng }
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState<LocationData | null>(null);

  const addressValue = watch("address");
  const latValue = watch("lat");
  const lngValue = watch("lng");

  const hasSelectedLocation = addressValue && latValue && lngValue;

  const handleSaveLocation = () => {
    if (tempLocation) {
      setValue("address", tempLocation.address, { shouldValidate: true });
      setValue("lat", tempLocation.lat, { shouldValidate: true });
      setValue("lng", tempLocation.lon, { shouldValidate: true });
    }
    setIsDialogOpen(false);
  };

  const onSubmit = (data: Step3FormData) => {
    updateDraft(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-foreground">
            Titik Lokasi Pengerjaan <span className="text-destructive">*</span>
          </label>
          <span className="text-[11px] text-muted-foreground font-medium">GPS / Peta Interaktif</span>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div 
            className="w-full relative group cursor-pointer" 
            onClick={() => setIsDialogOpen(true)}
          >
            {hasSelectedLocation ? (
              <div className="rounded-2xl overflow-hidden border border-emerald-500/40 hover:border-emerald-500/80 transition-colors h-48 w-full relative">
                <MapViewer 
                  lat={latValue!} 
                  lon={lngValue!} 
                  address={addressValue} 
                  height="h-48"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs z-10 pointer-events-none">
                  <Button type="button" variant="secondary" className="shadow-md rounded-xl font-bold text-xs pointer-events-auto">
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Ubah Titik Lokasi
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-44 bg-card/60 rounded-2xl border-2 border-dashed border-border/80 flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden group hover:border-primary/50 hover:bg-card transition-all">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-xs font-extrabold text-foreground">Pilih Titik Lokasi Tugas</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Gunakan GPS atau cari alamat langsung di peta</p>
              </div>
            )}
          </div>
          
          <DialogContent className="sm:max-w-4xl w-[95vw] max-h-[90vh] flex flex-col p-4 sm:p-6 overflow-hidden bg-card border border-border/80">
            <DialogHeader className="shrink-0">
              <DialogTitle className="text-base font-black">Tentukan Titik Lokasi Tugas</DialogTitle>
              <DialogDescription className="text-xs font-medium text-muted-foreground">
                Geser pin pada peta atau ketik alamat spesifik Anda
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto py-2">
              <LocationPicker
                initialLocation={
                  hasSelectedLocation 
                    ? { address: addressValue, lat: latValue!, lon: lngValue! }
                    : undefined
                }
                onLocationSelect={(loc) => setTempLocation(loc)}
                placeholder="Ketik jalan, patokan, perumahan, atau gedung..."
                showMapPreview={false}
              />
              
              <div className="flex-1 min-h-[320px] relative rounded-2xl overflow-hidden border border-border/80">
                <InteractiveMap 
                  initialLat={tempLocation?.lat || latValue || -6.2088} 
                  initialLon={tempLocation?.lon || lngValue || 106.8456}
                  onLocationSelected={(loc) => setTempLocation(loc)}
                  className="w-full h-full min-h-[320px]"
                />
              </div>
            </div>

            <DialogFooter className="shrink-0 pt-3 flex flex-row gap-2 justify-end">
              <Button type="button" variant="outline" className="rounded-xl text-xs font-bold" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="button" onClick={handleSaveLocation} className="rounded-xl shadow-xs text-xs font-extrabold bg-primary text-white" disabled={!tempLocation}>
                Simpan Lokasi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {errors.address && <p className="text-[11px] text-destructive font-bold mt-1">{errors.address.message}</p>}
        {errors.lat && <p className="text-[11px] text-destructive font-bold mt-1">Titik koordinat peta wajib dipilih.</p>}
      </div>

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
          disabled={!hasSelectedLocation}
        >
          <span>Lanjut ke Imbalan</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
