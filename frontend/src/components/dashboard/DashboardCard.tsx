import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

export function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <div className={cn("bg-card text-card-foreground rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow", className)}>
      {children}
    </div>
  );
}
