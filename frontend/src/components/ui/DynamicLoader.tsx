"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DynamicLoaderProps {
  text?: string;
  subtext?: string;
  delayMs?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "card" | "inline" | "overlay" | "section";
}

export function DynamicLoader({
  text = "Memuat data...",
  subtext,
  delayMs = 120,
  className,
  size = "md",
  variant = "section",
}: DynamicLoaderProps) {
  const [shouldShow, setShouldShow] = useState(delayMs === 0);

  useEffect(() => {
    if (delayMs === 0) return;
    const timer = setTimeout(() => {
      setShouldShow(true);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!shouldShow) return null;

  const sizeConfig = {
    sm: { logo: 36, container: "p-4 min-h-[110px]", text: "text-xs", sub: "text-[10px]" },
    md: { logo: 56, container: "p-8 min-h-[200px]", text: "text-sm", sub: "text-xs" },
    lg: { logo: 76, container: "p-10 min-h-[280px]", text: "text-base", sub: "text-sm" },
  }[size];

  const content = (
    <motion.div 
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center select-none"
    >
      {/* Liquid Glass Orb Container */}
      <div className="relative flex items-center justify-center mb-4">
        {/* Deep Ambient Breathing Aura */}
        <motion.div
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.25, 0.6, 0.25],
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 -m-4 bg-gradient-to-tr from-emerald-500/30 via-teal-400/25 to-cyan-500/30 rounded-full blur-2xl pointer-events-none"
        />

        {/* Liquid Glass Ring with Rotating Shimmer */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-3.5 rounded-full border border-emerald-500/20 bg-gradient-to-tr from-white/10 via-emerald-500/5 to-transparent pointer-events-none backdrop-blur-sm"
        />

        {/* Counter-Rotating Subtle Dotted Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-2 rounded-full border border-dashed border-teal-500/30 pointer-events-none"
        />

        {/* Floating Logo with Organic Sine Bobbing */}
        <motion.div
          animate={{
            y: [-5, 5, -5],
            rotate: [-1.5, 1.5, -1.5],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10 p-2.5 rounded-2xl bg-background/40 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg shadow-emerald-500/10"
        >
          <Image
            src="/logo-notext.png"
            alt="Loading Kerjain"
            width={sizeConfig.logo}
            height={sizeConfig.logo}
            priority
            className="object-contain drop-shadow-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes("Logo_Here")) {
                target.src = "/Logo_Here/Kerjain_Logo_NO Text.png";
              }
            }}
          />
        </motion.div>
      </div>

      {/* Loading Label with Silky Shimmer */}
      <div className="space-y-1 z-10 max-w-xs">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className={cn("font-bold text-foreground tracking-tight flex items-center justify-center gap-0.5", sizeConfig.text)}
        >
          <span>{text}</span>
          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, times: [0, 0.33, 1] }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, times: [0.2, 0.55, 1] }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, times: [0.4, 0.77, 1] }}
          >
            .
          </motion.span>
        </motion.p>

        {subtext && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={cn("text-muted-foreground font-medium", sizeConfig.sub)}
          >
            {subtext}
          </motion.p>
        )}
      </div>
    </motion.div>
  );

  if (variant === "overlay") {
    return (
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "absolute inset-0 z-30 bg-background/80 flex items-center justify-center rounded-inherit transition-all",
          className
        )}
      >
        {content}
      </motion.div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "bg-card/50 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl flex items-center justify-center shadow-lg shadow-black/5",
          sizeConfig.container,
          className
        )}
      >
        {content}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center justify-center py-2", className)}>
        {content}
      </div>
    );
  }

  // variant === "section" (default)
  return (
    <div
      className={cn(
        "w-full flex items-center justify-center",
        sizeConfig.container,
        className
      )}
    >
      {content}
    </div>
  );
}
