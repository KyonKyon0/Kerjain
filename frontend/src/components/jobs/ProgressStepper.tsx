"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressStepperProps {
  currentStep: number;
  steps: string[];
}

export function ProgressStepper({ currentStep, steps }: ProgressStepperProps) {
  const currentIndex = currentStep - 1; // 0-based
  const progressPercent = (currentIndex / (steps.length - 1)) * 100;

  return (
    <div className="w-full pb-3 pt-1 px-1 select-none">
      <div className="relative">
        
        {/* Background Grey Track - Exactly centered through the middle axis of the circles */}
        <div className="absolute top-[18px] sm:top-5 left-6 right-6 sm:left-8 sm:right-8 h-1 bg-muted/70 rounded-full z-0" />
        
        {/* Animated Active Emerald Track - Perfectly aligned connector */}
        <motion.div 
          className="absolute top-[18px] sm:top-5 left-6 sm:left-8 h-1 bg-gradient-to-r from-primary to-emerald-400 rounded-full z-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          initial={false}
          animate={{ width: `calc(${progressPercent}% * 0.88)` }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Steps Grid (5 columns for 5 steps) - Guaranteed strictly centered & aligned */}
        <div className="relative z-10 grid grid-cols-5 gap-1 sm:gap-2">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            
            return (
              <div key={step} className="flex flex-col items-center text-center">
                
                {/* Step Circle with Fixed Height Container for Perfect Horizontal Axis */}
                <div className="h-9 sm:h-10 flex items-center justify-center">
                  <motion.div 
                    initial={false}
                    animate={{ scale: isCurrent ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 border-2",
                      isCurrent 
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/40 ring-4 ring-primary/20 border-background"
                        : isCompleted
                          ? "bg-emerald-500 text-white shadow-2xs border-background"
                          : "bg-card text-muted-foreground border-border/80"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                    ) : (
                      <span>{stepNum}</span>
                    )}
                  </motion.div>
                </div>

                {/* Step Label - Fixed Height Container for strictly uniform vertical baseline */}
                <div className="h-6 mt-1.5 flex items-start justify-center w-full">
                  <span className={cn(
                    "text-[10px] sm:text-[11px] font-bold leading-tight line-clamp-1 truncate transition-colors",
                    isCurrent 
                      ? "text-primary font-black" 
                      : isCompleted
                        ? "text-foreground font-extrabold"
                        : "text-muted-foreground font-medium"
                  )}>
                    {step}
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
