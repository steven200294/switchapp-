import { ArrowLeft, Search, Menu, Bell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { cn } from "./ui/utils";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
  showNotifications?: boolean;
  showThemeToggle?: boolean;
  showLogo?: boolean;
  isDark?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  onMenu?: () => void;
  onNotifications?: () => void;
  onThemeToggle?: () => void;
  className?: string;
  transparent?: boolean;
}

export function MobileHeader({
  title,
  showBack = false,
  showSearch = false,
  showMenu = false,
  showNotifications = false,
  showThemeToggle = true,
  showLogo = false,
  isDark = true,
  onBack,
  onSearch,
  onMenu,
  onNotifications,
  onThemeToggle,
  className,
  transparent = false
}: MobileHeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-50 flex items-center justify-between px-4 py-3",
      "backdrop-blur-xl border-b shadow-lg",
      transparent 
        ? isDark ? "glass-subtle" : "glass-subtle-light"
        : isDark 
          ? "glass border-white/20"
          : "glass-light border-black/20",
      className
    )}>
      {/* Left side */}
      <div className="flex items-center space-x-3">
        {showBack && (
          <button
            onClick={onBack}
            className={cn(
              "p-2 rounded-full transition-all duration-300",
              isDark ? "glass-subtle hover:glass-strong" : "glass-subtle-light hover:glass-strong-light",
              "hover:scale-110",
              isDark 
                ? "text-white hover:text-neon-blue" 
                : "text-gray-900 hover:text-neon-blue"
            )}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        {showMenu && (
          <button
            onClick={onMenu}
            className={cn(
              "p-2 rounded-full transition-all duration-300",
              isDark ? "glass-subtle hover:glass-strong" : "glass-subtle-light hover:glass-strong-light",
              "hover:scale-110",
              isDark 
                ? "text-white hover:text-neon-purple" 
                : "text-gray-900 hover:text-neon-purple"
            )}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Center - Title or Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        {showLogo ? (
          <div className={cn(
            "px-3 py-1 rounded-full backdrop-blur-xl",
            isDark ? "glass-subtle" : "glass-subtle-light"
          )}>
            <Logo 
              size="sm" 
              showText={false} 
              isDark={isDark}
              className="transition-all duration-300 hover:scale-110" 
            />
          </div>
        ) : title ? (
          <div className={cn(
            "px-4 py-2 rounded-full backdrop-blur-xl",
            isDark ? "glass-subtle" : "glass-subtle-light"
          )}>
            <h1 className={cn(
              "font-poppins text-lg drop-shadow-md",
              isDark 
                ? "text-white text-glow-blue" 
                : "text-gray-900"
            )}>
              {title}
            </h1>
          </div>
        ) : null}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2">
        {showThemeToggle && onThemeToggle && (
          <ThemeToggle 
            isDark={isDark}
            onToggle={onThemeToggle}
          />
        )}
        
        {showSearch && (
          <button
            onClick={onSearch}
            className={cn(
              "p-2 rounded-full transition-all duration-300",
              isDark ? "glass-subtle hover:glass-strong" : "glass-subtle-light hover:glass-strong-light",
              "hover:scale-110",
              isDark 
                ? "text-white hover:text-neon-cyan" 
                : "text-gray-900 hover:text-neon-cyan"
            )}
          >
            <Search className="w-5 h-5" />
          </button>
        )}
        
        {showNotifications && (
          <button
            onClick={onNotifications}
            className={cn(
              "relative p-2 rounded-full transition-all duration-300",
              isDark ? "glass-subtle hover:glass-strong" : "glass-subtle-light hover:glass-strong-light",
              "hover:scale-110",
              isDark 
                ? "text-white hover:text-neon-orange" 
                : "text-gray-900 hover:text-neon-orange"
            )}
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-magenta rounded-full glow-magenta animate-pulse" />
          </button>
        )}
      </div>
    </header>
  );
}