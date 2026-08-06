import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  PUBLISHED: { label: "Tersedia", className: "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300" },
  ACCEPTED: { label: "Diambil", className: "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300" },
  ON_THE_WAY: { label: "Menuju Lokasi", className: "bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300" },

  WORKING: { label: "Dikerjakan", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300" },
  WAITING_CONFIRMATION: { label: "Menunggu Konfirmasi", className: "bg-teal-100 text-teal-800 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300" },
  COMPLETED: { label: "Selesai", className: "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300" },
  CANCELLED: { label: "Dibatalkan", className: "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("font-medium border-transparent", config.className, className)}>
      {config.label}
    </Badge>
  );
}
