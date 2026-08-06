import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressStepperProps {
  currentStep: number;
  steps: string[];
}

export function ProgressStepper({ currentStep, steps }: ProgressStepperProps) {
  return (
    <div className="flex items-center justify-between w-full relative mb-8">
      {/* Background Line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full z-0"></div>
      
      {/* Active Progress Line */}
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500 ease-in-out" 
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      ></div>

      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        
        return (
          <div key={step} className="relative z-10 flex flex-col items-center group">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300",
                isCompleted ? "bg-primary border-primary text-primary-foreground" :
                isActive ? "bg-background border-primary text-primary shadow-sm shadow-primary/20 scale-110" :
                "bg-background border-muted text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
            </div>
            <span 
              className={cn(
                "absolute top-10 text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-300",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
