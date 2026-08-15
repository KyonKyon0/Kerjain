"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface DashboardCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  disableHover?: boolean;
}

export function DashboardCard({ children, className, disableHover = false, ...props }: DashboardCardProps) {
  if (disableHover) {
    return (
      <div className={cn("bg-card/85 backdrop-blur-md text-card-foreground rounded-3xl border border-border/70 shadow-sm p-6", className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "bg-card/85 backdrop-blur-md text-card-foreground rounded-3xl border border-border/70 shadow-sm p-6 hover:shadow-lg hover:shadow-black/5 hover:border-primary/30 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
