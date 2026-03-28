import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "../ui/utils";

interface PremiumAlertProps {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function PremiumAlert({ 
  type = "info", 
  title, 
  children, 
  className 
}: PremiumAlertProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-orange-50 border-orange-200 text-orange-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };

  const iconStyles = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-orange-500",
    info: "text-blue-500"
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      "rounded-2xl border p-4",
      styles[type],
      className
    )}>
      <div className="flex items-start space-x-3">
        <Icon className={cn("w-5 h-5 mt-0.5", iconStyles[type])} />
        <div className="flex-1">
          {title && (
            <h4 className="font-medium mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}