import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Job } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Tag } from "lucide-react";

interface JobCardProps {
  job: Job;
  onAction?: (job: Job) => void;
  actionLabel?: string;
}

export function JobCard({ job, onAction, actionLabel }: JobCardProps) {
  const formattedReward =
    job.rewardType === "FIXED" && job.rewardAmount
      ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(job.rewardAmount)
      : "Seikhlasnya";

  const scheduledDate = new Date(job.createdAt).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-border/60">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <StatusBadge status={job.status} />
          <div className="font-semibold text-primary">{formattedReward}</div>
        </div>
        
        <h3 className="font-bold text-lg mb-1">{job.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{job.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" />
            <span className="truncate">{job.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span className="truncate">{scheduledDate}</span>
          </div>
          {job.distance !== undefined && (
            <div className="flex items-center gap-1.5 col-span-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>± {job.distance} meter dari Anda</span>
            </div>
          )}
        </div>
      </CardContent>
      {onAction && actionLabel && (
        <CardFooter className="bg-muted/30 p-3 px-5 border-t">
          <Button variant="default" className="w-full" onClick={() => onAction(job)}>
            {actionLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
