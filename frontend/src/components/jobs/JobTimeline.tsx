import { CheckCircle2, Clock, Check, XCircle, Navigation, Wrench, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobTimelineProps {
  status: "PUBLISHED" | "ACCEPTED" | "ON_THE_WAY" | "WORKING" | "WAITING_CONFIRMATION" | "COMPLETED" | "CANCELLED";
}

export function JobTimeline({ status }: JobTimelineProps) {
  const steps = [
    { key: "PUBLISHED", label: "Dipublikasi", icon: Clock },
    { key: "ACCEPTED", label: "Diterima", icon: CheckCircle2 },
    { key: "ON_THE_WAY", label: "Menuju\nLokasi", icon: Navigation },
    { key: "WORKING", label: "Dikerjakan", icon: Wrench },
    { key: "WAITING_CONFIRMATION", label: "Menunggu", icon: ShieldCheck },
    { key: "COMPLETED", label: "Selesai", icon: Check },
  ];

  let currentIndex = 0;
  if (status === "ACCEPTED") currentIndex = 1;
  if (status === "ON_THE_WAY") currentIndex = 2;
  if (status === "WORKING") currentIndex = 3;
  if (status === "WAITING_CONFIRMATION") currentIndex = 4;
  if (status === "COMPLETED") currentIndex = 5;
  
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <XCircle className="w-6 h-6 shrink-0" />
        <div>
          <p className="font-bold text-sm">Pekerjaan Dibatalkan</p>
          <p className="text-xs mt-0.5">Pekerjaan ini tidak dilanjutkan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between relative px-2">
      <div className="absolute left-[10%] right-[10%] top-4 h-1 bg-muted -z-10 rounded-full" />
      <div 
        className="absolute left-[5%] top-4 h-1 bg-primary -z-10 rounded-full transition-all duration-700 ease-in-out" 
        style={{ width: `${(currentIndex / 5) * 90}%` }}
      />
      
      {steps.map((step, idx) => {
        const isPast = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        const Icon = step.icon;
        
        return (
          <div key={step.key} className="flex flex-col items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
              isPast ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" : "bg-muted text-muted-foreground border-2 border-background",
              isCurrent && "ring-4 ring-primary/20 scale-110"
            )}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={cn(
              "text-[10px] sm:text-xs font-semibold mt-2 text-center max-w-[60px] whitespace-pre-line leading-tight",
              isPast ? "text-primary" : "text-muted-foreground"
            )}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
