import { cn } from "@/lib/utils";
import { JobStatus } from "@/types";

interface StatusBadgeProps {
  status: JobStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case "WAITING_PAYMENT":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
      case "PUBLISHED":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30";
      case "ACCEPTED":
        return "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30";
      case "ON_THE_WAY":
        return "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30";
      case "ARRIVED":
        return "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30";
      case "IN_PROGRESS":
      case "WORKING":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
      case "WAITING_CONFIRMATION":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30";
      case "COMPLETED":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
      case "CANCELLED":
        return "bg-destructive/15 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "WAITING_PAYMENT": return "Menunggu Pembayaran";
      case "PUBLISHED": return "Mencari Mitra";
      case "ACCEPTED": return "Diterima Mitra";
      case "ON_THE_WAY": return "Menuju Lokasi";
      case "ARRIVED": return "Telah Tiba";
      case "IN_PROGRESS":
      case "WORKING": return "Sedang Dikerjakan";
      case "WAITING_CONFIRMATION": return "Menunggu Konfirmasi";
      case "COMPLETED": return "Selesai";
      case "CANCELLED": return "Dibatalkan";
      default: return status;
    }
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-xs transition-colors", getStyle(), className)}>
      {getLabel()}
    </span>
  );
}
