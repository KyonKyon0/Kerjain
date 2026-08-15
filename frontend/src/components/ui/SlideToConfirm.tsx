"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ChevronRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideToConfirmProps {
  onConfirm: () => void | Promise<void>;
  label?: string;
  successLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "emerald" | "blue" | "amber";
}

export function SlideToConfirm({
  onConfirm,
  label = "Geser untuk Konfirmasi",
  successLabel = "Berhasil Dikonfirmasi!",
  isLoading = false,
  disabled = false,
  className,
  variant = "primary"
}: SlideToConfirmProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const x = useMotionValue(0);

  const thumbSize = 46; // 46px diameter thumb to fit snug in h-14 (56px) with 5px padding
  const maxDrag = Math.max(0, containerWidth - thumbSize - 10);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Background fill width tracks slider thumb smoothly
  const fillWidth = useTransform(x, (value) => value + thumbSize + 6);
  const textOpacity = useTransform(x, [0, Math.max(1, maxDrag * 0.6)], [1, 0.1]);

  const handleDragEnd = async () => {
    if (disabled || isLoading || isConfirmed) return;

    const currentX = x.get();
    const threshold = maxDrag * 0.72; // 72% slide threshold to trigger

    if (currentX >= threshold) {
      // Snap to end smoothly
      animate(x, maxDrag, { type: "spring", stiffness: 450, damping: 30 });
      setIsConfirmed(true);
      try {
        await onConfirm();
      } catch (err) {
        // Reset on error
        setIsConfirmed(false);
        animate(x, 0, { type: "spring", stiffness: 450, damping: 30 });
      }
    } else {
      // Reset back to start smoothly
      animate(x, 0, { type: "spring", stiffness: 450, damping: 28 });
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return {
          fill: "bg-gradient-to-r from-blue-600/30 via-blue-500/40 to-sky-400/50",
          thumb: "bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 text-white shadow-md shadow-blue-500/40",
          border: "border-blue-500/30 hover:border-blue-500/50",
          text: "text-blue-600 dark:text-blue-400",
        };
      case "amber":
        return {
          fill: "bg-gradient-to-r from-amber-500/30 via-amber-400/40 to-orange-400/50",
          thumb: "bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-400 text-white shadow-md shadow-amber-500/40",
          border: "border-amber-500/30 hover:border-amber-500/50",
          text: "text-amber-600 dark:text-amber-400",
        };
      case "emerald":
      case "primary":
      default:
        return {
          fill: "bg-gradient-to-r from-primary/30 via-emerald-500/40 to-teal-400/50",
          thumb: "bg-gradient-to-tr from-primary via-emerald-500 to-teal-400 text-white shadow-md shadow-primary/40",
          border: "border-primary/30 hover:border-primary/50",
          text: "text-primary",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-14 rounded-2xl bg-card/90 backdrop-blur-md border border-border/80 overflow-hidden select-none touch-none shadow-sm flex items-center p-1.5 transition-colors",
        styles.border,
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Background Dynamic Fill Color following Slider */}
      <motion.div
        style={{ width: fillWidth }}
        className={cn(
          "absolute left-0 top-0 bottom-0 rounded-2xl transition-all shadow-inner",
          styles.fill
        )}
      />

      {/* Shimmering Center Label */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none pl-12 pr-4 z-10"
      >
        <span className="text-xs sm:text-sm font-black tracking-tight text-foreground/90 flex items-center gap-1.5 uppercase">
          <span>{isConfirmed ? successLabel : label}</span>
          {!isConfirmed && (
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={cn("font-black text-sm", styles.text)}
            >
              »»
            </motion.span>
          )}
        </span>
      </motion.div>

      {/* Draggable Slider Thumb */}
      <motion.div
        drag={!isConfirmed && !isLoading && !disabled ? "x" : false}
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "relative z-20 w-[44px] h-[44px] rounded-xl flex items-center justify-center font-bold shadow-md cursor-grab active:cursor-grabbing transition-transform duration-150",
          styles.thumb
        )}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isConfirmed ? (
          <Check className="w-5 h-5 stroke-[3] drop-shadow-sm" />
        ) : (
          <ChevronRight className="w-5 h-5 stroke-[3] drop-shadow-sm" />
        )}
      </motion.div>
    </div>
  );
}
