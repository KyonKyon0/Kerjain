"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3LocationSchema, Step3FormData } from "@/features/jobs/schemas";
import { useCreateJobStore } from "@/store/create-job.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Edit2 } from "lucide-react";
import { LocationPicker, LocationData, MapViewer, InteractiveMap } from "@/components/maps";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

export function Step3Location() {
  const { draft, updateDraft, nextStep, prevStep } = useCreateJobStore();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Step3FormData>({
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <label className="text-sm font-semibold">Pilih Lokasi Pekerjaan</label>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          
          <div 
            className="w-full relative group cursor-pointer" 
            onClick={() => setIsDialogOpen(true)}
          >
            {hasSelectedLocation ? (
              <div className="rounded-2xl overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-colors h-48 w-full">
                <MapViewer 
                  lat={latValue!} 
                  lon={lngValue!} 
                  address={addressValue} 
                  height="h-48"
                />
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10 pointer-events-none">
                   <Button type="button" variant="secondary" className="shadow-lg rounded-xl pointer-events-auto">
                    <Edit2 className="w-4 h-4 mr-2" /> Ubah Lokasi
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-muted/30 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden group hover:bg-muted/50 transition-colors">
                <MapPin className="w-8 h-8 mb-2 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all text-primary" />
                <p className="text-sm font-medium">Klik untuk memilih lokasi</p>
                <p className="text-xs opacity-70 mt-1">Gunakan GPS atau cari alamat</p>
              </div>
            )}
          </div>
          
          <DialogContent className="sm:max-w-4xl w-[95vw] max-h-[90vh] flex flex-col p-4 sm:p-6 overflow-hidden bg-background">
            <DialogHeader className="shrink-0">
              <DialogTitle>Tentukan Titik Lokasi</DialogTitle>
              <DialogDescription>
                Pilih lokasi dengan mengklik pada peta, menggunakan GPS browser, atau mengetik alamat.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto py-2">
              <LocationPicker
                initialLocation={
                  hasSelectedLocation 
                    ? { address: addressValue, lat: latValue!, lon: lngValue! }
                    : undefined
                }
                onLocationSelect={(loc) => setTempLocation(loc)}
                placeholder="Cari jalan, gedung, atau kota..."
                showMapPreview={false} // Disable static preview inside modal since we have interactive map
              />
              
              <div className="flex-1 min-h-[350px] relative">
                <InteractiveMap 
                  initialLat={tempLocation?.lat || latValue || -6.2088} 
                  initialLon={tempLocation?.lon || lngValue || 106.8456}
                  onLocationSelected={(loc) => setTempLocation(loc)}
                  className="w-full h-full min-h-[350px]"
                />
              </div>
            </div>

            <DialogFooter className="shrink-0 pt-4">
              <Button type="button" variant="outline" className="rounded-xl w-full sm:w-auto" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="button" onClick={handleSaveLocation} className="rounded-xl shadow-md w-full sm:w-auto" disabled={!tempLocation}>
                Simpan Lokasi Terpilih
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {errors.address && <p className="text-xs text-destructive mt-1">{errors.address.message}</p>}
        {errors.lat && <p className="text-xs text-destructive mt-1">Koordinat peta wajib dipilih.</p>}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={prevStep} className="rounded-xl">Kembali</Button>
        <Button type="submit" className="rounded-xl shadow-md px-8 hover:-translate-y-0.5 transition-transform">Selanjutnya</Button>
      </div>
    </form>
  );
}

