import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { MapViewer } from "@/components/maps";

interface LocationCardProps {
  address: string;
  latitude: number | null;
  longitude: number | null;
  className?: string;
}

export function LocationCard({ address, latitude, longitude, className }: LocationCardProps) {
  return (
    <div className={cn("border border-border rounded-2xl p-4 bg-card shadow-sm space-y-3", className)}>
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="overflow-hidden flex-1">
          <h4 className="font-bold text-sm mb-0.5">Lokasi Pekerjaan</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{address}</p>
        </div>
      </div>

      {latitude && longitude ? (
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-90 transition-opacity"
        >
          <MapViewer
            lat={latitude}
            lon={longitude}
            address={address}
            height="h-44"
          />
          <div className="w-full flex items-center justify-center gap-2 mt-2 text-xs font-bold text-primary">
            <Navigation className="w-3 h-3" />
            Buka di Google Maps
          </div>
        </a>
      ) : (
        <div className="w-full h-28 bg-muted/30 border border-dashed border-border rounded-xl flex items-center justify-center text-xs text-muted-foreground">
          Koordinat peta tidak tersedia
        </div>
      )}
    </div>
  );
}

