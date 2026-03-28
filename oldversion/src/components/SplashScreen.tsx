import { useEffect } from "react";
import { cn } from "./ui/utils";
import switchAppartLogo from "figma:asset/02d9788b9b0c27ad9d93452286cf4d695e50cccb.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center relative overflow-hidden">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-magenta/5" />
      
      {/* Animated Background Circles */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-neon-blue/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-neon-purple/10 blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-neon-cyan/10 blur-2xl animate-pulse delay-500" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 text-center px-8">
        {/* Logo Container */}
        <div className="relative">
          {/* Glow Effect background */}
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple rounded-3xl blur-3xl opacity-20 animate-pulse scale-125" />
          
          {/* Main Logo */}
          <div className="relative z-10 p-8">
            <img 
              src={switchAppartLogo}
              alt="SwitchAppart" 
              className="w-64 h-auto transition-all duration-1000 animate-pulse"
            />
          </div>
          
          {/* Animated Ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-neon-cyan/20 animate-pulse" style={{ animationDuration: '2s' }} />
        </div>

        {/* Brand Description */}
        <div className="space-y-3 mt-6">
          {/* Main tagline */}
          <p className="text-gray-300 font-poppins text-xl font-light tracking-wide">
            Échangez vos appartements
          </p>
          
          {/* Description */}
          <p className="text-gray-400 font-poppins text-sm max-w-sm mx-auto leading-relaxed">
            Trouvez votre nouveau logement idéal en échangeant votre bail avec d'autres propriétaires partout en France.
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex space-x-2 mt-8">
          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce delay-150" />
          <div className="w-2 h-2 bg-neon-magenta rounded-full animate-bounce delay-300" />
        </div>
      </div>

      {/* Corner Elements */}
      <div className="absolute top-8 right-8 w-16 h-16 border border-neon-cyan/20 rounded-lg rotate-45" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border border-neon-purple/20 rounded-full" />
    </div>
  );
}