import { DashboardCard } from "./DashboardCard";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatisticCard({ title, value, icon, description, trend, trendValue }: StatisticCardProps) {
  return (
    <DashboardCard className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-sm font-medium">{title}</span>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {(description || trendValue) && (
        <div className="text-xs flex items-center gap-1 mt-1">
          {trendValue && (
            <span className={cn(
              "font-medium",
              trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"
            )}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : ""}{trendValue}
            </span>
          )}
          <span className="text-muted-foreground">{description}</span>
        </div>
      )}
    </DashboardCard>
  );
}
