"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Star } from "lucide-react";

interface CompletionCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  onContinue?: () => void;
  continueLabel?: string;
}

export function CompletionCelebrationModal({
  isOpen,
  onClose,
  title = "Pekerjaan Selesai!",
  subtitle = "Tugas telah berhasil diselesaikan dengan baik. Terima kasih atas kerja samanya!",
  onContinue,
  continueLabel = "Lanjut ke Pembayaran / Ulasan"
}: CompletionCelebrationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl max-w-sm p-6 text-center border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Background celebration glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center py-4">
          {/* Animated Liquid Circle with Checkmark SVG */}
          <div className="relative mb-6">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/30 border-4 border-background transform-gpu"
            >
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
                />
              </svg>
            </motion.div>

            {/* Pulsing ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.35, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-emerald-500 pointer-events-none"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Sukses Diselesaikan
            </div>
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              {subtitle}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="w-full space-y-2"
          >
            <Button
              onClick={() => {
                if (onContinue) {
                  onContinue();
                } else {
                  onClose();
                }
              }}
              className="w-full h-12 rounded-2xl font-bold bg-primary hover:bg-emerald-600 shadow-md shadow-primary/20 text-sm flex items-center justify-center gap-2"
            >
              <span>{continueLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
