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
  variant?: "primary" | "emerald" | "amber";
}

export function SlideToConfirm({
  onConfirm,
  label = "Geser untuk Konfirmasi",
  successLabel = "Berhasil Dikonfirmasi!",
  isLoading = false,
  disabled = false,
  className,
  variant = "emerald"
}: SlideToConfirmProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const x = useMotionValue(0);

  const thumbSize = 52; // 52px diameter thumb
  const maxDrag = Math.max(0, containerWidth - thumbSize - 8);

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
  const fillWidth = useTransform(x, (value) => value + thumbSize + 4);
  const textOpacity = useTransform(x, [0, maxDrag * 0.6], [1, 0.1]);

  const handleDragEnd = async () => {
    if (disabled || isLoading || isConfirmed) return;

    const currentX = x.get();
    const threshold = maxDrag * 0.75; // 75% slide threshold to trigger

    if (currentX >= threshold) {
      // Snap to end
      animate(x, maxDrag, { type: "spring", stiffness: 400, damping: 30 });
      setIsConfirmed(true);
      try {
        await onConfirm();
      } catch (err) {
        // Reset on error
        setIsConfirmed(false);
        animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
      }
    } else {
      // Reset back to start smoothly
      animate(x, 0, { type: "spring", stiffness: 400, damping: 28 });
    }
  };

  const getGradientTheme = () => {
    switch (variant) {
      case "amber":
        return {
          fill: "bg-gradient-to-r from-amber-500/80 via-amber-500 to-orange-500",
          thumb: "bg-amber-500 text-white shadow-amber-500/40",
          border: "border-amber-500/30",
        };
      case "primary":
        return {
          fill: "bg-gradient-to-r from-primary/80 via-primary to-emerald-500",
          thumb: "bg-primary text-primary-foreground shadow-primary/40",
          border: "border-primary/30",
        };
      default:
        return {
          fill: "bg-gradient-to-r from-emerald-500/80 via-emerald-600 to-teal-500",
          thumb: "bg-emerald-600 text-white shadow-emerald-500/40",
          border: "border-emerald-500/30",
        };
    }
  };

  const theme = getGradientTheme();

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-16 rounded-2xl bg-card border overflow-hidden select-none touch-none shadow-sm flex items-center p-1",
        theme.border,
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Background Dynamic Fill Color following Slider */}
      <motion.div
        style={{ width: fillWidth }}
        className={cn(
          "absolute left-0 top-0 bottom-0 rounded-2xl transition-all shadow-inner",
          theme.fill
        )}
      />

      {/* Shimmering Center Label */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none pl-12 pr-4 z-10"
      >
        <span className="text-xs sm:text-sm font-black tracking-wide text-foreground/80 flex items-center gap-1.5 uppercase">
          <span>{isConfirmed ? successLabel : label}</span>
          {!isConfirmed && (
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-primary font-black"
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
        dragElastic={0.08}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "relative z-20 w-[52px] h-[52px] rounded-xl flex items-center justify-center font-bold shadow-lg cursor-grab active:cursor-grabbing transition-colors duration-200",
          theme.thumb
        )}
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isConfirmed ? (
          <Check className="w-6 h-6 stroke-[3]" />
        ) : (
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        )}
      </motion.div>
    </div>
  );
}
