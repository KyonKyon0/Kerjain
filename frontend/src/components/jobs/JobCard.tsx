import { Job } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { MapPin, Clock, Wallet, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DistanceBadge } from "./DistanceBadge";

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  showDistance?: boolean;
}

export function JobCard({ job, onClick, showDistance }: JobCardProps) {
  const isFixed = job.rewardType === "FIXED";
  
  // formatting date roughly
  const dateObj = new Date(job.createdAt);
  const timeStr = `${dateObj.getHours()}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

  const CardWrapper = onClick ? 'div' : Link;
  const wrapperProps = onClick ? { onClick } : { href: `/dashboard/jobs/${job.id}` };

  return (
    <div className="bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 group cursor-pointer block relative">
      <CardWrapper {...wrapperProps as any} className="block w-full">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3 gap-2">
            <StatusBadge status={job.status} />
            <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
              <Clock className="w-3 h-3 mr-1" />
              {timeStr}
            </div>
          </div>
          
          <h4 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {job.title}
          </h4>
          
          <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
            {showDistance && job.distance !== undefined && (
              <DistanceBadge distance={job.distance} className="w-fit mb-1" />
            )}
            <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl">
              <MapPin className="w-4 h-4 shrink-0 text-primary" />
              <span className="truncate text-xs font-medium text-foreground">{job.address}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
                <Wallet className="w-4 h-4 shrink-0" />
                <span className="font-bold">
                  {isFixed && job.rewardAmount ? `Rp ${job.rewardAmount.toLocaleString("id-ID")}` : "Seikhlasnya"}
                </span>
              </div>
              {!onClick && (
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {job.status !== "PUBLISHED" && job.status !== "CANCELLED" && (
          <div className="px-5 py-4 bg-primary/5 border-t border-primary/10">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-primary">Progress Pekerjaan</span>
              <span className="text-xs font-bold text-primary">{getProgressPercentage(job.status)}%</span>
            </div>
            <div className="h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" 
                style={{ width: `${getProgressPercentage(job.status)}%` }} 
              />
            </div>
          </div>
        )}
      </CardWrapper>
    </div>
  );
}

function getProgressPercentage(status: string) {
  switch (status) {
    case "ACCEPTED": return 20;
    case "ON_THE_WAY": return 40;
    case "WORKING": return 60;
    case "WAITING_CONFIRMATION": return 80;
    case "COMPLETED": return 100;
    default: return 0;
  }
}
