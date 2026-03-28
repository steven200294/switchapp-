import { Check } from "lucide-react";
import { cn } from "../ui/utils";

interface PremiumCheckboxProps {
  id?: string;
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  required?: boolean;
}

export function PremiumCheckbox({
  id,
  label,
  description,
  checked,
  onChange,
  className,
  required = false
}: PremiumCheckboxProps) {
  return (
    <div className={cn("flex items-start space-x-3", className)}>
      <div className="flex items-center h-5">
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={cn(
            "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            checked 
              ? "bg-primary border-primary text-white" 
              : "border-gray-300 hover:border-gray-400 bg-white"
          )}
        >
          {checked && <Check className="w-3 h-3" />}
        </button>
      </div>
      {(label || description) && (
        <div className="text-sm">
          {label && (
            <label className={cn(
              "font-medium text-gray-700 cursor-pointer",
              required && "after:content-['*'] after:ml-1 after:text-red-500"
            )}>
              {label}
            </label>
          )}
          {description && (
            <p className="text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}