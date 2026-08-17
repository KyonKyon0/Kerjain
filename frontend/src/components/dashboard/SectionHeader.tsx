import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6", className)}>
      <div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground text-xs font-medium mt-0.5">{description}</p>}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
