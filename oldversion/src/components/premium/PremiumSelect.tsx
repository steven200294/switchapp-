import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../ui/utils";

interface Option {
  value: string;
  label: string;
}

interface PremiumSelectProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  help?: string;
  className?: string;
}

export function PremiumSelect({
  label,
  placeholder = "Sélectionner...",
  options,
  value,
  onChange,
  error,
  help,
  className
}: PremiumSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full bg-white border rounded-2xl px-4 py-3 text-left transition-all duration-200",
            "focus:outline-none focus:ring-1",
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
              : "border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-primary"
          )}
        >
          <span className={cn(
            selectedOption ? "text-gray-900" : "text-gray-500"
          )}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className={cn(
            "absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )} />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors",
                  "first:rounded-t-2xl last:rounded-b-2xl",
                  value === option.value && "bg-primary/10 text-primary"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {help && !error && (
        <p className="mt-2 text-sm text-gray-500">{help}</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}