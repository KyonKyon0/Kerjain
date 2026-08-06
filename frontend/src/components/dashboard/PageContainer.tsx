import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("flex-1 p-4 md:p-8 pt-6 max-w-7xl mx-auto w-full", className)}>
      {children}
    </div>
  );
}
