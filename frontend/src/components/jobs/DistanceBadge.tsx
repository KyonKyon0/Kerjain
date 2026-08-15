import { Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceString } from "@/lib/distance";

interface DistanceBadgeProps {
  distance?: number | null;
  className?: string;
}

export function DistanceBadge({ distance, className }: DistanceBadgeProps) {
  if (distance === undefined || distance === null || isNaN(distance) || distance <= 0) {
    return null;
  }

  // If distance is passed in meters from calculateHaversineDistance
  const formatted = formatDistanceString(distance);
  if (!formatted) return null;

  return (
    <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] sm:text-[11px] font-extrabold border border-emerald-500/20 shadow-2xs shrink-0", className)}>
      <Navigation className="w-3 h-3 shrink-0" />
      <span>± {formatted}</span>
    </div>
  );
}
