import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface DistanceBadgeProps {
  distance: number;
  className?: string;
}

export function DistanceBadge({ distance, className }: DistanceBadgeProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium border border-red-100", className)}>
      <MapPin className="w-3 h-3" />
      {distance} km
    </div>
  );
}
