import { Job } from "@/types";
import { cn, formatWIBDate } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { DashboardCard } from "../dashboard/DashboardCard";

interface HistoryCardProps {
  job: Job;
  role: "consumer" | "partner";
}

export function HistoryCard({ job, role }: HistoryCardProps) {
  const isCompleted = job.status === "COMPLETED";
  const partnerName = role === "consumer" 
    ? (job.partnerName || (job as any).partner?.name) 
    : (job.consumerName || (job as any).consumer?.name);
    
  const createdAt = job.createdAt || (job as any).created_at;
  const actualReward = Number(job.rewardAmount ?? (job as any).reward_amount ?? 0);
  const rewardType = job.rewardType || (job as any).reward_type;
  
  const formattedDate = formatWIBDate(createdAt);
  
  return (
    <Link href={`/dashboard/history/${job.id}`} className="block group">
      <DashboardCard className="p-4 hover:border-primary/50 transition-colors">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive" />
            )}
            <span className={cn("text-xs font-bold", isCompleted ? "text-green-600" : "text-destructive")}>
              {isCompleted ? "Selesai" : "Dibatalkan"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {formattedDate}
          </span>
        </div>
        
        <h4 className="font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {job.title}
        </h4>
        
        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5 font-bold">
              {role === "consumer" ? "Mitra" : "Konsumen"}
            </p>
            <p className="text-sm font-semibold">{partnerName || "Menunggu"}</p>
          </div>
          
          {rewardType === "FIXED" && (
            <div className="text-right">
              <p className="text-sm font-extrabold text-foreground">Rp {actualReward.toLocaleString("id-ID")}</p>
            </div>
          )}
        </div>
      </DashboardCard>
    </Link>
  );
}
