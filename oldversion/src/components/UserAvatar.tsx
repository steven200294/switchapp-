import { GeneratedAvatar } from './GeneratedAvatar';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export function UserAvatar({ 
  name, 
  avatarUrl, 
  size = 'md', 
  className = '',
  animated = false 
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Si l'utilisateur a une photo de profil, l'afficher
  if (avatarUrl) {
    return (
      <ImageWithFallback
        src={avatarUrl}
        alt={`Avatar de ${name}`}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-neon-blue shadow-[0_0_20px_rgba(0,191,255,0.6)] ${className}`}
      />
    );
  }

  // Sinon, afficher l'avatar généré avec la première lettre
  return (
    <GeneratedAvatar 
      name={name} 
      size={size} 
      className={className}
      animated={animated}
    />
  );
}
