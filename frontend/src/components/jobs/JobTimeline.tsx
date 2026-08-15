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
    { key: "PUBLISHED", label: "Dipublikasi", icon: Clock },
    { key: "ACCEPTED", label: "Diterima", icon: CheckCircle2 },
    { key: "ON_THE_WAY", label: "Perjalanan", icon: Navigation },
    { key: "WORKING", label: "Dikerjakan", icon: Wrench },
    { key: "WAITING_CONFIRMATION", label: "Pengecekan", icon: ShieldCheck },
    { key: "COMPLETED", label: "Selesai", icon: Check },
  ];

  if (status === "WAITING_PAYMENT") {
    return (
      <div className="flex items-center gap-3.5 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-900 dark:text-amber-300 shadow-sm">
        <Clock className="w-6 h-6 shrink-0 text-amber-600 dark:text-amber-400 animate-pulse" />
        <div>
          <p className="font-extrabold text-sm">Menunggu Pembayaran QRIS</p>
          <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
            Pekerjaan belum dipublikasikan. Selesaikan pembayaran QRIS agar pekerjaan otomatis aktif dan dapat diambil oleh mitra di sekitar.
          </p>
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
      <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive">
        <XCircle className="w-6 h-6 shrink-0" />
        <div>
          <p className="font-bold text-sm">Pekerjaan Dibatalkan</p>
          <p className="text-xs mt-0.5 opacity-90">Pekerjaan ini telah dibatalkan dan tidak dilanjutkan.</p>
        </div>
      </div>
    );
  }


  const progressPercent = (currentIndex / (steps.length - 1)) * 100;

  return (
    <div className="w-full py-4 px-1">
      {/* Timeline Step Container with perfectly aligned connector line */}
      <div className="relative">
        
        {/* Background Grey Track */}
        <div className="absolute top-5 left-4 right-4 h-1 bg-muted rounded-full z-0" />
        
        {/* Animated Active Emerald Track */}
        <motion.div 
          className="absolute top-5 left-4 h-1 bg-gradient-to-r from-primary to-emerald-400 rounded-full z-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `calc(${progressPercent}% * 0.92)` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Steps Grid - Guaranteed strictly aligned */}
        <div className="relative z-10 grid grid-cols-6 gap-1 sm:gap-2">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPastOrCurrent = idx <= currentIndex;
            const Icon = step.icon;
            
            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                
                {/* Step Circle with Fixed Dimensions */}
                <div className="h-10 flex items-center justify-center">
                  <motion.div 
                    initial={false}
                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isCurrent 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40 ring-4 ring-primary/20 border-2 border-background"
                        : isCompleted
                          ? "bg-emerald-500 text-white shadow-sm border-2 border-background"
                          : "bg-card text-muted-foreground border-2 border-border/80"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                    ) : (
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    )}
                  </motion.div>
                </div>

                {/* Step Label - Fixed Height to guarantee vertical alignment */}
                <div className="h-7 mt-2 flex items-start justify-center w-full">
                  <span className={cn(
                    "text-[10px] sm:text-xs font-bold leading-tight line-clamp-1 truncate transition-colors",
                    isCurrent 
                      ? "text-primary font-extrabold" 
                      : isCompleted
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground font-medium"
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
