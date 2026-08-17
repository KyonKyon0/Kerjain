"use client";

import React from "react";
import { CheckCircle2, Clock, Check, XCircle, Navigation, Wrench, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface JobTimelineProps {
  status: "WAITING_PAYMENT" | "PUBLISHED" | "ACCEPTED" | "ON_THE_WAY" | "WORKING" | "WAITING_CONFIRMATION" | "COMPLETED" | "CANCELLED" | string;
}

export function JobTimeline({ status }: JobTimelineProps) {
  const steps = [
    { key: "PUBLISHED", label: "Publikasi", icon: Clock },
    { key: "ACCEPTED", label: "Diterima", icon: CheckCircle2 },
    { key: "ON_THE_WAY", label: "Menuju", icon: Navigation },
    { key: "WORKING", label: "Dikerjakan", icon: Wrench },
    { key: "WAITING_CONFIRMATION", label: "Pengecekan", icon: ShieldCheck },
    { key: "COMPLETED", label: "Selesai", icon: Check },
  ];

  if (status === "WAITING_PAYMENT") {
    return (
      <div className="flex items-center gap-2.5 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs w-full max-w-full overflow-hidden">
        <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
        <div className="min-w-0">
          <p className="font-bold text-foreground text-xs">Menunggu Pembayaran QRIS</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">Selesaikan pembayaran QRIS agar tugas aktif di radar mitra.</p>
        </div>
      </div>
    );
  }

  let currentIndex = 0;
  if (status === "ACCEPTED") currentIndex = 1;
  if (status === "ON_THE_WAY" || status === "ARRIVED") currentIndex = 2;
  if (status === "WORKING" || status === "IN_PROGRESS") currentIndex = 3;
  if (status === "WAITING_CONFIRMATION") currentIndex = 4;
  if (status === "COMPLETED") currentIndex = 5;
  
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2.5 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs w-full max-w-full overflow-hidden">
        <XCircle className="w-4 h-4 shrink-0" />
        <div>
          <p className="font-bold text-xs">Pekerjaan Dibatalkan</p>
          <p className="text-[10px] opacity-90">Pekerjaan ini telah dibatalkan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden py-1">
      {/* Timeline Step Container */}
      <div className="relative w-full max-w-full">
        
        {/* Background Grey Track connecting center of col 1 to col 6 (8.33% to 91.67%) */}
        <div className="absolute top-[14px] sm:top-[16px] left-[8.33%] right-[8.33%] h-1 bg-muted rounded-full z-0" />
        
        {/* Animated Active Emerald Track */}
        <motion.div 
          className="absolute top-[14px] sm:top-[16px] left-[8.33%] h-1 bg-gradient-to-r from-primary to-emerald-400 rounded-full z-0"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / 5) * 83.34}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Steps Grid - strictly responsive and never overflows */}
        <div className="relative z-10 grid grid-cols-6 w-full gap-0.5 sm:gap-1">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = step.icon;
            
            return (
              <div key={step.key} className="flex flex-col items-center text-center min-w-0 w-full overflow-hidden">
                
                {/* Step Circle with responsive dimensions */}
                <div className="h-7 sm:h-8 flex items-center justify-center">
                  <motion.div 
                    initial={false}
                    animate={{ scale: isCurrent ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                      isCurrent 
                        ? "bg-primary text-white shadow-md shadow-primary/40 ring-2 sm:ring-3 ring-primary/20 border-2 border-background"
                        : isCompleted
                          ? "bg-emerald-500 text-white shadow-xs border-2 border-background"
                          : "bg-card text-muted-foreground border-2 border-border/80"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                    ) : (
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </motion.div>
                </div>

                {/* Step Label with proper truncation */}
                <div className="h-5 mt-1 flex items-start justify-center w-full px-0.5">
                  <span className={cn(
                    "text-[8px] sm:text-[10px] md:text-xs font-bold leading-tight truncate max-w-full transition-colors",
                    isCurrent 
                      ? "text-primary font-black" 
                      : isCompleted
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground/70 font-medium"
                  )}>
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
