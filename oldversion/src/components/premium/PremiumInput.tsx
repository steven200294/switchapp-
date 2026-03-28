import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../ui/utils";

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  help?: string;
  error?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export function PremiumInput({
  label,
  help,
  error,
  icon,
  showPasswordToggle = false,
  className,
  type,
  ...props
}: PremiumInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = showPasswordToggle 
    ? (showPassword ? "text" : "password")
    : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full bg-white border rounded-2xl px-4 py-3 text-gray-900 placeholder:text-gray-500 transition-all duration-200",
            "focus:outline-none focus:ring-1",
            icon && "pl-11",
            (showPasswordToggle || props.type === "password") && "pr-12",
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
              : isFocused 
                ? "border-primary ring-1 ring-primary" 
                : "border-gray-200 hover:border-gray-300",
            className
          )}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
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