import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: "blue" | "purple" | "magenta" | "cyan" | "orange";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function NeonButton({ 
  children, 
  variant = "blue", 
  size = "md",
  className,
  onClick,
  disabled,
  type = "button"
}: NeonButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "blue":
        return "glass-neon-blue text-neon-blue hover:text-white hover:glow-blue";
      case "purple":
        return "glass-neon-purple text-neon-purple hover:text-white hover:glow-purple";
      case "magenta":
        return "glass-neon-magenta text-neon-magenta hover:text-white hover:glow-magenta";
      case "cyan":
        return "glass-neon-cyan text-neon-cyan hover:text-white hover:glow-cyan";
      case "orange":
        return "glass-neon-orange text-neon-orange hover:text-white hover:glow-orange";
      default:
        return "glass-neon-blue text-neon-blue hover:text-white hover:glow-blue";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "md":
        return "px-6 py-3 text-base";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative overflow-hidden transition-all duration-300 font-poppins font-semibold",
        "rounded-xl backdrop-blur-md",
        "hover:scale-105 hover:backdrop-blur-xl active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "shadow-lg hover:shadow-2xl",
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
    >
      <span className="relative z-10 drop-shadow-sm">{children}</span>
      
      {/* Glass shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      
      {/* Inner glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl" />
    </Button>
  );
}