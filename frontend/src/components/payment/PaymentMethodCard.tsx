import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface PaymentMethodCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  selected?: boolean;
  onSelect: () => void;
}

export function PaymentMethodCard({ name, icon, selected, onSelect }: PaymentMethodCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all hover:bg-muted/50",
        selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="p-2 bg-background rounded-xl border shrink-0">
          {icon}
        </div>
        <span className="font-semibold text-sm">{name}</span>
      </div>
      
      {selected && (
        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 animate-in zoom-in" />
      )}
    </div>
  );
}
