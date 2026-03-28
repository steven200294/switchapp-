import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "./ui/utils";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export function ThemeToggle({ isDark, onToggle, className }: ThemeToggleProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative p-2 rounded-full transition-all duration-300 backdrop-blur-xl",
        "glass-subtle hover:glass-strong hover:scale-110 active:scale-95",
        isDark 
          ? "text-neon-cyan hover:text-white hover:glass-neon-cyan hover:glow-cyan"
          : "text-neon-blue hover:text-white hover:glass-neon-blue hover:glow-blue",
        className
      )}
    >
      {/* Background glow effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.5 : 0
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "absolute inset-0 rounded-full blur-lg",
          isDark ? "bg-neon-cyan" : "bg-neon-blue"
        )}
      />
      
      {/* Icon container */}
      <div className="relative z-10 w-5 h-5 flex items-center justify-center">
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="drop-shadow-lg"
        >
          {isDark ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </motion.div>
      </div>

      {/* Orbital animation for dark mode */}
      {isDark && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="relative w-full h-full">
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 left-1/2 w-1 h-1 bg-neon-cyan rounded-full glow-cyan -translate-x-1/2" 
            />
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-1 left-1/2 w-1 h-1 bg-neon-magenta rounded-full glow-magenta -translate-x-1/2" 
            />
          </div>
        </motion.div>
      )}

      {/* Sun rays for light mode */}
      {!isDark && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="relative w-full h-full">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
              <motion.div
                key={angle}
                initial={{ opacity: 0.4, scale: 0.5 }}
                animate={{ 
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: index * 0.1 
                }}
                className="absolute w-0.5 h-2 bg-neon-blue glow-blue"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '50% 50%',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-14px)`
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Inner shimmer */}
      <motion.div
        animate={{ 
          background: [
            "transparent",
            isDark ? "rgba(0, 255, 255, 0.1)" : "rgba(0, 191, 255, 0.1)",
            "transparent"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-full"
      />
    </button>
  );
}