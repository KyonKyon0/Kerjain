"use client";

import { Job } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { MapPin, Clock, Wallet, ChevronRight, ImageIcon, Tag, Navigation } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatWIBTime } from "@/lib/utils";
import { formatDistanceString } from "@/lib/distance";

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
  const formattedDistance = showDistance && job.distance ? formatDistanceString(job.distance) : null;
  const isPublished = job.status === "PUBLISHED";
  const hasActiveProgress = !isPublished && job.status !== "CANCELLED" && job.status !== "WAITING_PAYMENT";

  return (
    <motion.div 
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-primary/40 transition-all group cursor-pointer w-full max-w-full min-w-0 flex flex-col justify-between box-border"
    >
      <CardWrapper {...wrapperProps as any} className="flex flex-col w-full max-w-full min-w-0 text-left overflow-hidden">
        
        {/* Optional Photo Banner */}
        {photo && (
          <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-muted/40 border-b border-border/50 shrink-0">
            <img 
              src={photo} 
              alt={job.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-primary" /> Foto Tugas
            </div>
          </div>
        )}

        {/* Card Body - Tight, Dense & Sequential (No wasted space) */}
        <div className="p-3 sm:p-3.5 flex flex-col min-w-0 w-full space-y-2 overflow-hidden box-border">
          
          {/* 1. Top Header Row: Category / Status + WIB Time */}
          <div className="flex items-center justify-between gap-1.5 w-full min-w-0 overflow-hidden">
            {isPublished ? (
              // Only show Category tag on the left
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20 text-[10px] font-extrabold uppercase tracking-wider truncate max-w-[120px] sm:max-w-[140px] flex items-center gap-1 shrink-0">
                <Tag className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{job.category || "Umum"}</span>
              </span>
            ) : (
              // Active job status badge
              <div className="flex items-center gap-1 min-w-0 truncate">
                <StatusBadge status={job.status} />
                {job.category && (
                  <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-[9px] font-bold truncate max-w-[70px]">
                    {job.category}
                  </span>
                )}
              </div>
            )}

            {/* Time WIB fixed on top right */}
            <div className="flex items-center text-[10px] font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/50 shrink-0 ml-auto">
              <Clock className="w-2.5 h-2.5 mr-1 text-primary shrink-0" />
              <span>{timeStr}</span>
            </div>
          </div>
          
          {/* 2. Job Title & Direct Address Beneath It (Super Tight) */}
          <div className="space-y-1 w-full min-w-0 overflow-hidden">
            <h4 className="font-extrabold text-xs sm:text-sm leading-snug group-hover:text-primary transition-colors text-foreground line-clamp-2 break-words w-full">
              {job.title}
            </h4>

            {/* Address Row directly beneath title */}
            <div className="flex items-center justify-between gap-1.5 bg-muted/30 px-2 py-1 rounded-lg border border-border/50 text-[11px] font-medium text-foreground w-full min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 min-w-0 flex-1 truncate">
                <MapPin className="w-3 h-3 shrink-0 text-primary" />
                <span className="truncate">{job.address || "Lokasi sekitar"}</span>
              </div>
              {formattedDistance && (
                <span className="shrink-0 font-extrabold text-[9px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded flex items-center gap-0.5 border border-emerald-500/20 ml-1">
                  <Navigation className="w-2 h-2" />
                  <span>± {formattedDistance}</span>
                </span>
              )}
            </div>
          </div>

          {/* 3. Compact Nested Progress Card (Card di dalam Card) */}
          {hasActiveProgress && (
            <div className="bg-primary/5 border border-primary/15 rounded-xl p-2 space-y-1 w-full min-w-0 shadow-2xs overflow-hidden">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-extrabold text-primary">
                <span className="flex items-center gap-1 truncate min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                  <span className="truncate">Progress Pekerjaan</span>
                </span>
                <span className="bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-md shrink-0 shadow-2xs ml-1">
                  {getProgressPercentage(job.status)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-primary/15 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" 
                  style={{ width: `${getProgressPercentage(job.status)}%` }} 
                />
              </div>
            </div>
          )}

          {/* 4. Reward & Action Row */}
          <div className="flex items-center justify-between pt-1.5 border-t border-border/60 gap-1.5 w-full min-w-0 overflow-hidden">
            <div className="min-w-0 flex-1 truncate">
              <p className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Imbalan</p>
              <p className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 truncate">
                <Wallet className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {actualReward ? `Rp ${Number(actualReward).toLocaleString("id-ID")}` : "Rp 0"}
                </span>
              </p>
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-[11px] sm:text-xs shadow-2xs group-hover:bg-emerald-600 transition-colors shrink-0">
              <span>Detail</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

        </div>
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
    case "WAITING_PAYMENT": return 0;
    case "COMPLETED": return 100;
    default: return 0;
  }
}
