import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: JobStatus | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  WAITING_PAYMENT: { label: "Menunggu Pembayaran", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30" },
  PUBLISHED: { label: "Mencari Mitra", className: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30" },
  ACCEPTED: { label: "Diterima Mitra", className: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30" },
  ON_THE_WAY: { label: "Menuju Lokasi", className: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30" },
  ARRIVED: { label: "Telah Tiba", className: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30" },
  WORKING: { label: "Sedang Dikerjakan", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30" },
  IN_PROGRESS: { label: "Sedang Dikerjakan", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30" },
  WAITING_CONFIRMATION: { label: "Menunggu Konfirmasi", className: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30" },
  COMPLETED: { label: "Selesai", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
  CANCELLED: { label: "Dibatalkan", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-muted text-muted-foreground border-border"
  };

  return (
    <Badge variant="outline" className={cn("font-extrabold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded-full border shadow-xs transition-colors", config.className, className)}>
      {config.label}
    </Badge>
  );
}
