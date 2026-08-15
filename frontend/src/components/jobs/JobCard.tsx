"use client";

import { Job } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { MapPin, Clock, Wallet, ChevronRight, ImageIcon } from "lucide-react";
import Link from "next/link";
import { DistanceBadge } from "./DistanceBadge";
import { motion } from "framer-motion";
import { formatWIBTime } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  showDistance?: boolean;
}

export function JobCard({ job, onClick, showDistance }: JobCardProps) {
  const timeStr = formatWIBTime(job.createdAt || (job as any).created_at);
  const CardWrapper = onClick ? 'div' : Link;
  const wrapperProps = onClick ? { onClick } : { href: `/dashboard/jobs/${job.id}` };
  const actualReward = job.rewardAmount ?? (job as any).reward_amount;
  const photo = job.photoUrl || (job as any).photo_url;

  return (
    <motion.div 
      whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card/90 backdrop-blur-md border border-border/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-colors group cursor-pointer block relative"
    >
      <CardWrapper {...wrapperProps as any} className="block w-full">
        {photo && (
          <div className="relative h-36 w-full overflow-hidden bg-muted/40 border-b border-border/50">
            <img 
              src={photo} 
              alt={job.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> Foto Pekerjaan
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6">
          <div className="flex justify-between items-start mb-3 gap-2">
            <StatusBadge status={job.status} />
            <div className="flex items-center text-xs font-semibold text-muted-foreground bg-muted/60 backdrop-blur-sm px-2.5 py-1 rounded-xl">
              <Clock className="w-3.5 h-3.5 mr-1 text-primary/70" />
              {timeStr}
            </div>
          </div>
          
          <h4 className="font-extrabold text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2 break-words text-foreground">
            {job.title}
          </h4>
          
          <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
            {showDistance && job.distance !== undefined && (
              <DistanceBadge distance={job.distance} className="w-fit mb-1" />
            )}
            <div className="flex items-start gap-2 bg-muted/40 backdrop-blur-sm p-3 rounded-2xl border border-border/40">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <span className="text-xs font-medium text-foreground line-clamp-2 break-words leading-relaxed">{job.address}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-2xl font-extrabold text-sm">
                <Wallet className="w-4 h-4 shrink-0" />
                <span>
                  {actualReward ? `Rp ${actualReward.toLocaleString("id-ID")}` : "Rp 0"}
                </span>
              </div>
              {!onClick && (
                <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {job.status !== "PUBLISHED" && job.status !== "CANCELLED" && (
          <div className="px-5 py-3.5 bg-primary/5 border-t border-primary/10">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-primary">Progress Pekerjaan</span>
              <span className="text-xs font-bold text-primary">{getProgressPercentage(job.status)}%</span>
            </div>
            <div className="h-2 w-full bg-primary/15 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out rounded-full shadow-sm" 
                style={{ width: `${getProgressPercentage(job.status)}%` }} 
              />
            </div>
          </div>
        )}
      </CardWrapper>
    </motion.div>
  );
}

function getProgressPercentage(status: string) {
  switch (status) {
    case "ACCEPTED": return 20;
    case "ON_THE_WAY": return 40;
    case "ARRIVED": return 55;
    case "WORKING":
    case "IN_PROGRESS": return 70;
    case "WAITING_CONFIRMATION": return 85;
    case "WAITING_PAYMENT": return 95;
    case "COMPLETED": return 100;
    default: return 0;
  }
}
