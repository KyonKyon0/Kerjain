import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "PUBLISHED" | "ACCEPTED" | "ON_THE_WAY" | "WORKING" | "WAITING_CONFIRMATION" | "COMPLETED" | "CANCELLED";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case "PUBLISHED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "ACCEPTED":
      case "ON_THE_WAY":
      case "WORKING":
      case "WAITING_CONFIRMATION":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "PUBLISHED": return "Mencari Mitra";
      case "ACCEPTED": return "Diterima Mitra";
      case "ON_THE_WAY": return "Menuju Lokasi";
      case "WORKING": return "Sedang Dikerjakan";
      case "WAITING_CONFIRMATION": return "Menunggu Konfirmasi";
      case "COMPLETED": return "Selesai";
      case "CANCELLED": return "Dibatalkan";
      default: return status;
    }
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", getStyle(), className)}>
      {getLabel()}
    </span>
  );
}
