import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationCardProps {
  address: string;
  latitude: number | null;
  longitude: number | null;
  className?: string;
}

export function LocationCard({ address, latitude, longitude, className }: LocationCardProps) {
  return (
    <div className={cn("border rounded-xl p-4 bg-muted/10", className)}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-medium text-sm mb-1">Lokasi Pekerjaan</h4>
          <p className="text-sm text-muted-foreground">{address}</p>
          {(latitude && longitude) && (
            <p className="text-[10px] font-mono text-muted-foreground mt-2 bg-muted inline-block px-1.5 py-0.5 rounded">
              {latitude}, {longitude}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
