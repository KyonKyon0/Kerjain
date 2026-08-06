import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

export function StarRating({ rating, onRatingChange, size = "md", readOnly = false }: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10"
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onRatingChange?.(star)}
          className={cn(
            "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-0.5",
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-110",
            star <= rating ? "text-amber-400" : "text-muted"
          )}
        >
          <Star className={cn(sizeClasses[size], star <= rating ? "fill-amber-400" : "fill-transparent")} />
        </button>
      ))}
    </div>
  );
}
