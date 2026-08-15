"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ZapEnergyToggleProps {
  isOnline: boolean;
  onToggle: (newState: boolean) => void;
  className?: string;
}

// Particle offsets for energy convergence effect
const CONVERGING_ORBS = [
  { x: -140, y: -80, delay: 0.02, size: 8, color: "bg-emerald-400" },
  { x: 150, y: -100, delay: 0.05, size: 10, color: "bg-teal-300" },
  { x: -160, y: 60, delay: 0.08, size: 10, color: "bg-emerald-300" },
  { x: 150, y: 80, delay: 0.03, size: 9, color: "bg-teal-400" },
  { x: -80, y: -120, delay: 0.07, size: 8, color: "bg-emerald-400" },
  { x: 80, y: -130, delay: 0.1, size: 10, color: "bg-emerald-200" },
  { x: -90, y: 110, delay: 0.04, size: 9, color: "bg-teal-300" },
  { x: 100, y: 120, delay: 0.09, size: 8, color: "bg-emerald-400" },
];

export function ZapEnergyToggle({ isOnline, onToggle, className }: ZapEnergyToggleProps) {
  const [animatingState, setAnimatingState] = useState<"turning_on" | "turning_off" | null>(null);

  const handleToggle = () => {
    const nextState = !isOnline;
    
    if (nextState) {
      // Turning ON - Energy Gathering Animation
      setAnimatingState("turning_on");
      setTimeout(() => {
        onToggle(true);
        toast.success("⚡ Radar Petir Aktif! Anda siap menerima orderan terdekat.");
        setTimeout(() => setAnimatingState(null), 500);
      }, 450);
    } else {
      // Turning OFF - Energy Burst Dissipate Animation
      setAnimatingState("turning_off");
      onToggle(false);
      toast.info("💤 Radar Petir Nonaktif. Anda sedang dalam mode istirahat.");
      setTimeout(() => setAnimatingState(null), 500);
    }
  };

  return (
    <div className={cn("relative flex flex-col items-center justify-center select-none", className)}>
      
      {/* Energy Orbs Gathering Inward (Screen -> Circular Button) */}
      <AnimatePresence>
        {animatingState === "turning_on" && (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
            {CONVERGING_ORBS.map((orb, i) => (
              <motion.div
                key={i}
                initial={{
                  x: orb.x,
                  y: orb.y,
                  scale: 1.4,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  scale: [1, 1.4, 0.2],
                  opacity: [0, 1, 0.8, 0],
                }}
                transition={{
                  duration: 0.45,
                  delay: orb.delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                  "absolute rounded-full blur-[0.5px] shadow-[0_0_10px_rgba(52,211,153,0.7)]",
                  orb.color
                )}
                style={{ width: orb.size, height: orb.size }}
              />
            ))}

            {/* Subtle glow aura */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.8, 2], opacity: [0, 0.7, 0] }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
              className="absolute w-24 h-24 rounded-full bg-emerald-400/30 blur-lg"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Energy Blast Dissipating Outward (Button -> Screen) */}
      <AnimatePresence>
        {animatingState === "turning_off" && (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
            {/* Shockwave expanding circular ring */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0.8, borderColor: "#10b981" }}
              animate={{ scale: 2.8, opacity: 0, borderColor: "#94a3b8" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute w-14 h-14 rounded-full border-2"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Clean Solid Circular Petir Button */}
      <motion.button
        type="button"
        onClick={handleToggle}
        whileHover={{ scale: 1.06, y: -1.5 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 outline-none cursor-pointer border shadow-md",
          isOnline
            ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.45)] hover:shadow-[0_0_24px_rgba(16,185,129,0.6)]"
            : "bg-muted/80 hover:bg-muted text-muted-foreground border-border/80 hover:text-foreground shadow-sm"
        )}
        title={isOnline ? "Klik untuk mematikan radar (OFF)" : "Klik untuk mengaktifkan radar (ON)"}
      >
        <Zap 
          className={cn(
            "w-6 h-6 transition-colors duration-200",
            isOnline ? "fill-white text-white" : "text-muted-foreground/60"
          )} 
        />
      </motion.button>

      {/* Status Text (ON / OFF) Below the Circle Button */}
      <div 
        className="flex items-center gap-1 mt-1.5 cursor-pointer select-none"
        onClick={handleToggle}
      >
        <span className={cn(
          "text-[11px] font-black uppercase tracking-wider transition-colors",
          isOnline ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
        )}>
          {isOnline ? "ON" : "OFF"}
        </span>
        <span 
          className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors",
            isOnline ? "bg-emerald-500" : "bg-muted-foreground/40"
          )} 
        />
      </div>
    </div>
  );
}
