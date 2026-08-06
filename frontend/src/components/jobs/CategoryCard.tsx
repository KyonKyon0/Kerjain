import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CategoryCardProps {
  title: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function CategoryCard({ title, icon, selected, onClick }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all hover:shadow-md h-full w-full",
        selected 
          ? "border-primary bg-primary/5 text-primary shadow-sm scale-105" 
          : "border-border/50 bg-background text-muted-foreground hover:border-primary/30 hover:bg-muted/30"
      )}
    >
      <div className={cn(
        "p-3 rounded-full mb-3 transition-colors",
        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {icon}
      </div>
      <span className="font-semibold text-sm text-center">{title}</span>
    </button>
  );
}
