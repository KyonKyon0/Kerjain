"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const thumbRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [maxDragDistance, setMaxDragDistance] = useState(0);

  // State refs to eliminate closure stale values & avoid re-render during drag
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const maxDragRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const thumbSize = 44; // 44px thumb size
  const padding = 6; // container padding

  // Measure container width accurately with ResizeObserver
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const calculatedMaxDrag = Math.max(0, containerWidth - thumbSize - padding * 2);
      maxDragRef.current = calculatedMaxDrag;
      setMaxDragDistance(calculatedMaxDrag);
    }
  }, [thumbSize, padding]);

  useEffect(() => {
    updateDimensions();

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [updateDimensions]);

  // Apply positions directly to DOM nodes without React state updates for 120fps fluid response
  const applyPosition = useCallback((pos: number, animate: boolean = false) => {
    const thumb = thumbRef.current;
    const fill = fillRef.current;
    const text = textRef.current;
    const maxD = maxDragRef.current;

    const transitionStyle = animate
      ? "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease"
      : "none";

    if (thumb) {
      thumb.style.transition = transitionStyle;
      thumb.style.transform = `translate3d(${pos}px, 0, 0)`;
    }

    if (fill) {
      fill.style.transition = transitionStyle;
      fill.style.width = `${pos + thumbSize + padding}px`;
    }

    if (text && maxD > 0) {
      const progress = Math.min(1, Math.max(0, pos / (maxD * 0.65)));
      text.style.transition = transitionStyle;
      text.style.opacity = `${1 - progress * 0.85}`;
    }
  }, [thumbSize, padding]);

  // Handle Pointer Down (Finger touches screen)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || isLoading || isConfirmed) return;

    isDraggingRef.current = true;
    startXRef.current = e.clientX - currentXRef.current;

    // Capture pointer events so sliding continues even if finger slips slightly outside thumb
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    // Remove any transition for zero-latency 1:1 finger tracking
    applyPosition(currentXRef.current, false);
  };

  // Handle Pointer Move (Finger moves on screen - 100% instant, no delay)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || disabled || isLoading || isConfirmed) return;

    const rawX = e.clientX - startXRef.current;
    const boundedX = Math.max(0, Math.min(rawX, maxDragRef.current));
    currentXRef.current = boundedX;

    // Throttle directly to screen refresh rate with zero lag
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      applyPosition(boundedX, false);
    });
  };

  // Handle Pointer Up / Release (Finger lifted)
  const handlePointerUp = async (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    const maxD = maxDragRef.current;
    const threshold = maxD * 0.70; // 70% threshold to confirm

    if (currentXRef.current >= threshold && maxD > 0) {
      // Snap to end
      currentXRef.current = maxD;
      applyPosition(maxD, true);
      setIsConfirmed(true);

      // Trigger lightweight mobile haptic feedback if available
      if (typeof window !== "undefined" && window.navigator && "vibrate" in window.navigator) {
        try {
          window.navigator.vibrate?.([20, 40]);
        } catch (_) {}
      }

      try {
        await onConfirm();
      } catch (err) {
        // Reset back on failure
        setIsConfirmed(false);
        currentXRef.current = 0;
        applyPosition(0, true);
      }
    } else {
      // Snap back to start with smooth spring curve
      currentXRef.current = 0;
      applyPosition(0, true);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
    currentXRef.current = 0;
    applyPosition(0, true);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return {
          fill: "bg-blue-600/30",
          thumb: "bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-md shadow-blue-500/30",
          border: "border-blue-500/30",
          text: "text-blue-500 dark:text-blue-400",
        };
      case "amber":
        return {
          fill: "bg-amber-500/30",
          thumb: "bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-md shadow-amber-500/30",
          border: "border-amber-500/30",
          text: "text-amber-500 dark:text-amber-400",
        };
      case "emerald":
      case "primary":
      default:
        return {
          fill: "bg-emerald-500/30",
          thumb: "bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-500/30",
          border: "border-primary/30",
          text: "text-primary",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      ref={containerRef}
      style={{ touchAction: "none" }}
      className={cn(
        "relative h-14 rounded-2xl bg-card border overflow-hidden select-none shadow-sm flex items-center p-1.5",
        styles.border,
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Background Progressive Fill following finger */}
      <div
        ref={fillRef}
        style={{
          width: `${thumbSize + padding}px`,
          willChange: "width",
          transform: "translate3d(0,0,0)",
        }}
        className={cn(
          "absolute left-0 top-0 bottom-0 rounded-2xl pointer-events-none",
          styles.fill
        )}
      />

      {/* Center Action Label */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none pl-12 pr-4 z-10"
        style={{ willChange: "opacity" }}
      >
        <span className="text-xs sm:text-sm font-black tracking-tight text-foreground/90 flex items-center gap-1.5 uppercase">
          <span>{isConfirmed ? successLabel : label}</span>
          {!isConfirmed && (
            <span className={cn("font-black text-sm animate-pulse", styles.text)}>
              »»
            </span>
          )}
        </span>
      </div>

      {/* 1:1 Real-time Touch Responsive Thumb */}
      <div
        ref={thumbRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{
          width: `${thumbSize}px`,
          height: `${thumbSize}px`,
          willChange: "transform",
          transform: "translate3d(0,0,0)",
          touchAction: "none",
        }}
        className={cn(
          "relative z-20 rounded-xl flex items-center justify-center font-bold shadow-md cursor-grab active:cursor-grabbing select-none shrink-0",
          styles.thumb
        )}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isConfirmed ? (
          <Check className="w-5 h-5 stroke-[3]" />
        ) : (
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        )}
      </div>
    </div>
  );
}
