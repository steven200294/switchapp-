import { cn } from "../ui/utils";

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export function PremiumCard({ 
  children, 
  className, 
  hover = false,
  padding = "md" 
}: PremiumCardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8"
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border-0 shadow-sm transition-all duration-200",
        hover && "hover:shadow-md",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}