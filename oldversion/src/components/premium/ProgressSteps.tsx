import { Check } from "lucide-react";
import { cn } from "../ui/utils";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressSteps({ currentStep, totalSteps, className }: ProgressStepsProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;
        
        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                isCompleted && "bg-primary text-white",
                isCurrent && "bg-primary text-white ring-4 ring-primary/20",
                !isCompleted && !isCurrent && "bg-gray-200 text-gray-500"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                step
              )}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "w-12 h-0.5 mx-2 transition-colors duration-200",
                  isCompleted ? "bg-primary" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
      <div className="ml-4">
        <span className="text-sm text-gray-600">
          Étape {currentStep}/{totalSteps}
        </span>
      </div>
    </div>
  );
}