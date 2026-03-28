import { cn } from "../ui/utils";

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function PremiumButton({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: PremiumButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-sm",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    text: "bg-transparent text-gray-600 hover:text-gray-800"
  };

  return (
    <button
      className={cn(
        "rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        sizeClasses[size],
        variantClasses[variant],
        loading && "opacity-75 cursor-wait",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <span className="flex items-center justify-center space-x-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        <span>{children}</span>
      </span>
    </button>
  );
}