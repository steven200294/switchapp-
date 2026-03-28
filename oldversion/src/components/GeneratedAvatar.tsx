import { motion } from "motion/react";

interface GeneratedAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-2xl',
  xl: 'w-24 h-24 text-4xl'
};

export function GeneratedAvatar({ 
  name, 
  size = 'md', 
  className = '',
  animated = false 
}: GeneratedAvatarProps) {
  // Obtenir la première lettre du nom
  const initial = name?.charAt(0)?.toUpperCase() || '?';
  
  // Générer une couleur néon basée sur la première lettre
  const colors = [
    { gradient: 'from-neon-blue to-neon-cyan', glow: 'shadow-[0_0_20px_rgba(0,191,255,0.6)]', text: 'text-white' },
    { gradient: 'from-neon-purple to-neon-magenta', glow: 'shadow-[0_0_20px_rgba(138,43,226,0.6)]', text: 'text-white' },
    { gradient: 'from-neon-magenta to-neon-purple', glow: 'shadow-[0_0_20px_rgba(255,0,255,0.6)]', text: 'text-white' },
    { gradient: 'from-neon-cyan to-neon-blue', glow: 'shadow-[0_0_20px_rgba(0,255,255,0.6)]', text: 'text-white' },
    { gradient: 'from-neon-orange to-neon-magenta', glow: 'shadow-[0_0_20px_rgba(255,165,0,0.6)]', text: 'text-white' },
  ];
  
  const colorIndex = initial.charCodeAt(0) % colors.length;
  const selectedColor = colors[colorIndex];
  
  const avatarContent = (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-br ${selectedColor.gradient}
        ${selectedColor.glow}
        flex items-center justify-center
        ${selectedColor.text}
        border border-white/20
        backdrop-blur-sm
        ${className}
      `}
    >
      <span className="font-orbitron font-bold drop-shadow-lg">
        {initial}
      </span>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        whileHover={{ 
          scale: 1.1, 
          rotate: 360,
          transition: { duration: 0.3 }
        }}
      >
        {avatarContent}
      </motion.div>
    );
  }

  return avatarContent;
}
