import { Home, Search, MessageCircle, User, Heart, Zap } from "lucide-react";
import { cn } from "./ui/utils";

interface BottomNavigationProps {
  activeTab: "home" | "search" | "matches" | "messages" | "profile";
  onTabChange: (tab: "home" | "search" | "matches" | "messages" | "profile") => void;
  isDark: boolean;
}

const navigationItems = [
  { id: "home" as const, label: "Accueil", icon: Home },
  { id: "search" as const, label: "Explorer", icon: Search },
  { id: "matches" as const, label: "Matchs", icon: Zap },
  { id: "messages" as const, label: "Messages", icon: MessageCircle },
  { id: "profile" as const, label: "Profil", icon: User },
];

export function BottomNavigation({ activeTab, onTabChange, isDark }: BottomNavigationProps) {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t transition-all duration-300",
      isDark 
        ? "bg-dark-bg/90 border-white/10" 
        : "bg-white/90 border-gray-200"
    )}>
      <div className="flex items-center justify-around py-2 px-4 safe-area-bottom">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 min-w-0 flex-1 max-w-20",
                "hover:scale-105 active:scale-95",
                isActive
                  ? isDark
                    ? "bg-gradient-to-br from-neon-purple/20 to-neon-magenta/20 border border-neon-purple/30"
                    : "bg-primary-red/10 border border-primary-red/20"
                  : "hover:bg-gray-100/50 dark:hover:bg-white/5"
              )}
            >
              <div className={cn(
                "relative p-1 rounded-lg transition-all duration-300",
                isActive && isDark && "animate-pulse"
              )}>
                {isActive && isDark && (
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-magenta rounded-lg blur-sm opacity-60" />
                )}
                <Icon
                  className={cn(
                    "w-6 h-6 relative z-10 transition-all duration-300",
                    isActive
                      ? isDark
                        ? "text-white drop-shadow-lg"
                        : "text-primary-red"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-600"
                  )}
                />
              </div>
              
              {/* Show labels only on desktop (lg and up) */}
              <span
                className={cn(
                  "text-xs mt-1 transition-all duration-300 truncate w-full text-center font-poppins",
                  "hidden lg:block", // Hide on mobile, show on desktop
                  isActive
                    ? isDark
                      ? "text-white font-medium drop-shadow-md"
                      : "text-primary-red font-semibold"
                    : isDark
                      ? "text-gray-400"
                      : "text-gray-600"
                )}
              >
                {item.label}
              </span>
              
              {/* Active indicator for dark theme */}
              {isActive && isDark && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-neon-cyan rounded-full animate-pulse shadow-lg shadow-cyan-500/50" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}