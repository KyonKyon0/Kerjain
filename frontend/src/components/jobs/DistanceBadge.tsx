import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceString } from "@/lib/distance";

interface DistanceBadgeProps {
  distance?: number | null;
  className?: string;
}

export function DistanceBadge({ distance, className }: DistanceBadgeProps) {
  if (distance === undefined || distance === null || isNaN(distance)) {
    return null;
  }

  // If distance is less than 100, it's in km (e.g. 1.5), convert to meters if needed, or if already in meters
  const distanceInMeters = distance < 100 && !Number.isInteger(distance) ? distance * 1000 : (distance > 100 ? distance : distance * 1000);
  const formatted = formatDistanceString(distanceInMeters);

  return (
    <div className={cn("inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/20 shadow-sm", className)}>
      <MapPin className="w-3.5 h-3.5 shrink-0" />
      <span>± {formatted} dari Anda</span>
    </div>
  );
}
