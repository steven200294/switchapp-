import { cn } from "./ui/utils";
import logoWithText from 'figma:asset/02d9788b9b0c27ad9d93452286cf4d695e50cccb.png';
import logoIcon from 'figma:asset/7cf4f4c7124201afeb10b592cbe422d504a6c769.png';

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  animated?: boolean;
  isDark?: boolean;
}

export function Logo({ 
  size = "md", 
  showText = false, 
  className,
  animated = false,
  isDark = true
}: LogoProps) {
  const getSizeClasses = () => {
    if (showText) {
      // Sizes for logo with text
      switch (size) {
        case "sm":
          return "w-20 h-12";
        case "md":
          return "w-32 h-20";
        case "lg":
          return "w-40 h-24";
        case "xl":
          return "w-48 h-32";
        default:
          return "w-32 h-20";
      }
    } else {
      // Sizes for icon only
      switch (size) {
        case "sm":
          return "w-8 h-8";
        case "md":
          return "w-12 h-12";
        case "lg":
          return "w-16 h-16";
        case "xl":
          return "w-24 h-24";
        default:
          return "w-12 h-12";
      }
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "md":
        return "text-base";
      case "lg":
        return "text-lg";
      case "xl":
        return "text-xl";
      default:
        return "text-base";
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-center",
      showText ? "flex-col space-y-2" : "",
      animated && "transition-all duration-300 hover:scale-105",
      className
    )}>
      {/* Logo Image - Nouveau logo SwitchAppart avec texte intégré */}
      <div className={cn(
        getSizeClasses(),
        "relative overflow-hidden flex items-center justify-center",
        animated && "transition-all duration-300"
      )}>
        {/* Glow effect for dark mode - derrière l'image */}
        {isDark && animated && (
          <div className={cn(
            "absolute inset-0 opacity-30 blur-lg transition-opacity duration-300",
            "bg-gradient-to-br from-neon-cyan via-neon-blue to-neon-purple",
            "animate-pulse scale-110"
          )} />
        )}
        
        <img 
          src={showText ? logoWithText : logoIcon}
          alt="SwitchAppart"
          className={cn(
            "w-full h-full object-contain relative z-10",
            animated && "filter hover:brightness-110 transition-all duration-300",
            // Effet de glow subtil pour le logo avec les dégradés intégrés
            isDark && "drop-shadow-2xl",
            // Améliorer la visibilité en mode clair
            !isDark && "drop-shadow-md"
          )}
        />
      </div>

      {/* Text Logo - Supprimé car le nouveau logo avec showText=true contient déjà le texte stylisé */}
    </div>
  );
}