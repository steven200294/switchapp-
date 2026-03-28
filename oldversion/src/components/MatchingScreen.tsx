import { useState, useRef, useEffect } from "react";
import { Heart, X, Star, MapPin, Users, Building, Zap, RotateCcw, Info, Sun, Moon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface MatchingScreenProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onPropertySelect: (propertyId: string) => void;
  onNewMatch: (matchData: {
    userId: string;
    userName: string;
    userAvatar: string;
    propertyId: string;
    propertyTitle: string;
    compatibility: number;
  }) => void;
  onShowMatches: () => void;
  matchesCount: number;
}

const tinderProperties = [
  {
    id: "tinder-1",
    title: "Penthouse moderne avec terrasse",
    location: "Paris 16ème, Trocadéro",
    price: "2800€",
    surface: "85m²",
    compatibilityScore: 95,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBwYXJpc3xlbnwxfHx8fDE3NTYyMDgyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    roommates: 0,
    maxRoommates: 1,
    tags: ["Luxe", "Vue Tour Eiffel", "Terrasse", "Ascenseur"],
    owner: {
      name: "Marie Dubois",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIwODI0MXww&ixlib=rb-4.1.0&q=80&w=1080",
      age: 32
    }
  },
  {
    id: "tinder-2",
    title: "Loft artistique rénové",
    location: "Paris 11ème, République",
    price: "1900€",
    surface: "75m²", 
    compatibilityScore: 88,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMGxvZnQlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1579926716139-2c80ed956d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjMyfDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    roommates: 1,
    maxRoommates: 2,
    tags: ["Créatif", "Lumineux", "Proche métro", "Caractère"],
    owner: {
      name: "Thomas Martin",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      age: 28
    }
  },
  {
    id: "tinder-3",
    title: "Appartement familial calme",
    location: "Paris 14ème, Montparnasse",
    price: "2200€",
    surface: "95m²",
    compatibilityScore: 82,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTc1NjIwODI0OXww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    roommates: 2,
    maxRoommates: 3,
    tags: ["Familial", "Calme", "Écoles proches", "Parking"],
    owner: {
      name: "Sophie Laurent",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhY2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      age: 35
    }
  },
  {
    id: "tinder-4",
    title: "Studio moderne centre-ville",
    location: "Paris 1er, Châtelet",
    price: "1400€",
    surface: "35m²",
    compatibilityScore: 79,
    images: [
      "https://images.unsplash.com/photo-1612419299101-6c294dc2901d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwcm9vbSUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NTYyMDgyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    roommates: 0,
    maxRoommates: 1,
    tags: ["Centre-ville", "Métro proche", "Moderne", "Compact"],
    owner: {
      name: "Lucas Moreau",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      age: 26
    }
  }
];

// Photo de profil utilisateur (Sophie)
const userProfile = {
  name: "Sophie Martinez",
  avatar: "https://images.unsplash.com/photo-1745434159123-af6142c7862f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzU2MjEzNDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
};

export function MatchingScreen({ isDark, onThemeToggle, onPropertySelect, onNewMatch, onShowMatches, matchesCount }: MatchingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);
  const [rejections, setRejections] = useState<string[]>([]);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const currentProperty = tinderProperties[currentIndex];
  const hasMoreCards = currentIndex < tinderProperties.length - 1;

  // Handle mouse/touch events
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    const { x } = dragOffset;
    
    if (Math.abs(x) > threshold) {
      if (x > 0) {
        // Swipe right - Match
        handleMatch();
      } else {
        // Swipe left - Reject
        handleReject();
      }
    } else {
      // Snap back
      setDragOffset({ x: 0, y: 0 });
    }
    
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const handleMatch = () => {
    if (!currentProperty) return;
    
    setMatches(prev => [...prev, currentProperty.id]);
    setShowMatch(true);
    
    // Create automatic conversation
    onNewMatch({
      userId: currentProperty.owner.name.toLowerCase().replace(' ', ''),
      userName: currentProperty.owner.name,
      userAvatar: currentProperty.owner.avatar,
      propertyId: currentProperty.id,
      propertyTitle: currentProperty.title,
      compatibility: currentProperty.compatibilityScore
    });
    
    setTimeout(() => {
      setShowMatch(false);
      nextCard();
    }, 2000);
  };

  const handleReject = () => {
    if (!currentProperty) return;
    
    setRejections(prev => [...prev, currentProperty.id]);
    nextCard();
  };

  const nextCard = () => {
    setCurrentIndex(prev => prev + 1);
    setCurrentImageIndex(0);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setCurrentImageIndex(0);
      setDragOffset({ x: 0, y: 0 });
      
      // Remove from matches/rejections
      const lastProperty = tinderProperties[currentIndex - 1];
      setMatches(prev => prev.filter(id => id !== lastProperty.id));
      setRejections(prev => prev.filter(id => id !== lastProperty.id));
    }
  };

  const nextImage = () => {
    if (currentProperty && currentImageIndex < currentProperty.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  // Add global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!currentProperty) {
    return (
      <div className={cn(
        "min-h-screen pb-20",
        isDark 
          ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20" 
          : "bg-white"
      )}>
        {/* Header - Sans logo */}
        <div className={cn(
          "sticky top-0 z-50 backdrop-blur-xl border-b",
          isDark 
            ? "bg-dark-bg/80 border-white/10" 
            : "bg-white/80 border-gray-200"
        )}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={cn(
                  "text-2xl font-semibold font-poppins",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {isDark ? (
                    <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-magenta bg-clip-text text-transparent">
                      Matchs
                    </span>
                  ) : (
                    "Matchs"
                  )}
                </h1>
                <p className={cn(
                  "text-sm mt-1 font-poppins",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  Tous les logements vus
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Matches Button */}
                <button
                  onClick={onShowMatches}
                  className={cn(
                    "relative p-2 rounded-full transition-all duration-300",
                    isDark 
                      ? "bg-gradient-to-r from-neon-purple/30 to-neon-magenta/30 text-neon-magenta hover:from-neon-magenta/40 hover:to-neon-purple/40" 
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  )}
                >
                  <Heart className="w-5 h-5" />
                  {matchesCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {matchesCount > 9 ? '9+' : matchesCount}
                    </div>
                  )}
                </button>
                
                <button 
                  onClick={onThemeToggle}
                  className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    isDark 
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 px-4">
          <Heart className={cn(
            "w-24 h-24 mb-6",
            isDark ? "text-neon-purple" : "text-purple-500"
          )} />
          <h2 className={cn(
            "text-2xl font-semibold font-poppins mb-4 text-center",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Aucun nouveau logement !
          </h2>
          <p className={cn(
            "text-center mb-8 max-w-md font-poppins",
            isDark ? "text-gray-300" : "text-gray-600"
          )}>
            Vous avez vu tous les logements disponibles. Revenez plus tard pour découvrir de nouvelles opportunités d'échange.
          </p>
          <div className="space-y-4">
            <Button
              onClick={handleUndo}
              disabled={currentIndex === 0}
              className={cn(
                "font-poppins disabled:opacity-50",
                isDark 
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600"
                  : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-400 hover:to-gray-500"
              )}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Annuler la dernière action
            </Button>
            <div className={cn(
              "text-center text-sm font-poppins",
              isDark ? "text-gray-400" : "text-gray-500"
            )}>
              {matches.length} matchs • {rejections.length} rejetés
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen pb-20 select-none",
      isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20" 
        : "bg-white"
    )}>
      {/* Header - Sans logo */}
      <div className={cn(
        "sticky top-0 z-50 backdrop-blur-xl border-b",
        isDark 
          ? "bg-dark-bg/80 border-white/10" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={cn(
                "text-2xl font-semibold font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                {isDark ? (
                  <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-magenta bg-clip-text text-transparent">
                    Matchs
                  </span>
                ) : (
                  "Matchs"
                )}
              </h1>
              <p className={cn(
                "text-sm mt-1 font-poppins",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                {currentIndex + 1}/{tinderProperties.length} • {matches.length} matchs
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Matches Button */}
              <button
                onClick={onShowMatches}
                className={cn(
                  "relative p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-gradient-to-r from-neon-purple/30 to-neon-magenta/30 text-neon-magenta hover:from-neon-magenta/40 hover:to-neon-purple/40" 
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                )}
              >
                <Heart className="w-5 h-5" />
                {matchesCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {matchesCount > 9 ? '9+' : matchesCount}
                  </div>
                )}
              </button>
              
              <button 
                onClick={onThemeToggle}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Stack Container */}
      <div className="flex justify-center items-start pt-8 px-4 relative">
        <div className="relative w-full max-w-sm h-[600px]">
          {/* Background Cards */}
          {hasMoreCards && (
            <div className="absolute inset-0 w-full h-full">
              <div className={cn(
                "absolute inset-0 rounded-3xl border backdrop-blur-sm transform scale-95 translate-y-2",
                isDark 
                  ? "bg-gradient-to-br from-dark-secondary/60 to-purple-900/20 border-purple-500/20" 
                  : "glass-subtle border-gray-200"
              )} />
              <div className={cn(
                "absolute inset-0 rounded-3xl border backdrop-blur-sm transform scale-90 translate-y-4",
                isDark 
                  ? "bg-gradient-to-br from-dark-secondary/40 to-purple-900/10 border-purple-500/10" 
                  : "glass-subtle border-gray-100"
              )} />
            </div>
          )}

          {/* Main Card */}
          <div
            ref={cardRef}
            className={cn(
              "absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing",
              "rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300",
              isDark 
                ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-purple-900/30 border border-purple-500/30"
                : "glass-strong border border-gray-200/50",
              isDragging ? "transition-none" : "transition-all duration-300"
            )}
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
              opacity: isDragging ? 0.9 : 1
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Swipe Indicators */}
            {isDragging && (
              <>
                <div className={cn(
                  "absolute top-20 left-8 z-20 transform -rotate-12 transition-opacity duration-200",
                  dragOffset.x > 50 ? "opacity-100" : "opacity-0"
                )}>
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg border-4 border-green-400">
                    MATCH
                  </div>
                </div>
                <div className={cn(
                  "absolute top-20 right-8 z-20 transform rotate-12 transition-opacity duration-200",
                  dragOffset.x < -50 ? "opacity-100" : "opacity-0"
                )}>
                  <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg border-4 border-red-400">
                    NOPE
                  </div>
                </div>
              </>
            )}

            {/* Image Section */}
            <div className="relative h-3/5 overflow-hidden">
              <img
                src={currentProperty.images[currentImageIndex]}
                alt={currentProperty.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
              
              {/* Image Navigation */}
              {currentProperty.images.length > 1 && (
                <>
                  <div className="absolute top-4 left-4 right-4 flex justify-center space-x-1">
                    {currentProperty.images.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "h-1 rounded-full transition-all duration-300",
                          index === currentImageIndex 
                            ? "bg-white flex-1" 
                            : "bg-white/40 w-6"
                        )}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={prevImage}
                    className="absolute left-0 top-0 w-1/2 h-full z-10"
                  />
                  <button
                    onClick={nextImage}
                    className="absolute right-0 top-0 w-1/2 h-full z-10"
                  />
                </>
              )}

              {/* Compatibility Score */}
              <div className="absolute top-4 right-4">
                <div className="relative">
                  {isDark && (
                    <div className="absolute inset-0 rounded-full bg-neon-orange blur-md opacity-60 animate-pulse" />
                  )}
                  <div className={cn(
                    "relative w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-2xl",
                    isDark 
                      ? "bg-gradient-to-br from-neon-orange to-orange-600 border-neon-orange"
                      : "glass-strong border-orange-400 bg-gradient-to-br from-orange-400 to-orange-500"
                  )}>
                    <span className={cn(
                      "font-bold text-sm font-poppins drop-shadow-lg",
                      isDark ? "text-white" : "text-white"
                    )}>
                      {currentProperty.compatibilityScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                <img
                  src={currentProperty.owner.avatar}
                  alt={currentProperty.owner.name}
                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  draggable={false}
                />
                <div>
                  <div className="text-white font-semibold drop-shadow-lg font-poppins">
                    {currentProperty.owner.name}, {currentProperty.owner.age}
                  </div>
                  <div className="text-white/80 text-sm drop-shadow-md font-poppins">
                    Propriétaire
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-6 space-y-4">
              <div>
                <h2 className={cn(
                  "text-xl font-semibold font-poppins drop-shadow-lg mb-2",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {currentProperty.title}
                </h2>
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className={cn(
                    "w-4 h-4",
                    isDark ? "text-neon-cyan" : "text-blue-600"
                  )} />
                  <span className={cn(
                    "font-poppins",
                    isDark ? "text-gray-300" : "text-gray-600"
                  )}>
                    {currentProperty.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className={cn(
                    "text-2xl font-bold font-poppins",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {currentProperty.price}
                  </span>
                  <span className={cn(
                    "ml-1 font-poppins",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}>
                    /mois
                  </span>
                </div>
                <div className={cn(
                  "flex items-center space-x-4 text-sm font-poppins",
                  isDark ? "text-gray-300" : "text-gray-600"
                )}>
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{currentProperty.surface}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{currentProperty.roommates}/{currentProperty.maxRoommates}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentProperty.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    className={cn(
                      "px-2 py-1 text-xs backdrop-blur-md font-poppins",
                      isDark 
                        ? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white border border-purple-400/30"
                        : "glass text-gray-700 border border-gray-300/50"
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-24 left-0 right-0 z-10">
        <div className="flex justify-center items-center space-x-6 px-4">
          <button
            onClick={handleUndo}
            disabled={currentIndex === 0}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed",
              isDark 
                ? "bg-gray-600 text-white hover:bg-gray-500"
                : "glass text-gray-600 hover:bg-gray-100"
            )}
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleReject}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-red-400"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={() => onPropertySelect(currentProperty.id)}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
              isDark 
                ? "bg-blue-500 text-white hover:bg-blue-400"
                : "glass text-blue-600 hover:bg-blue-50"
            )}
          >
            <Info className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleMatch}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-green-400"
          >
            <Heart className="w-8 h-8" />
          </button>
          
          <button
            onClick={() => {/* Add super like functionality */}}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
          >
            <Star className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Match Popup - Avec vraie photo utilisateur */}
      {showMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center space-y-6 p-8 animate-bounce">
            <div className="relative">
              {isDark && (
                <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta to-neon-cyan blur-3xl opacity-60 animate-pulse" />
              )}
              <h2 className={cn(
                "relative text-6xl font-bold font-poppins drop-shadow-2xl",
                isDark ? "text-white" : "text-white"
              )}>
                {isDark ? (
                  <span className="bg-gradient-to-r from-neon-magenta via-neon-cyan to-neon-magenta bg-clip-text text-transparent">
                    C'EST UN MATCH !
                  </span>
                ) : (
                  "C'EST UN MATCH !"
                )}
              </h2>
            </div>
            <div className="flex justify-center space-x-8">
              <img
                src={currentProperty.owner.avatar}
                alt="Owner"
                className={cn(
                  "w-24 h-24 rounded-full border-4 object-cover",
                  isDark ? "border-neon-cyan" : "border-blue-500"
                )}
              />
              {/* Photo utilisateur Sophie */}
              <img
                src={userProfile.avatar}
                alt="Sophie"
                className={cn(
                  "w-24 h-24 rounded-full border-4 object-cover",
                  isDark ? "border-neon-magenta" : "border-purple-500"
                )}
              />
            </div>
            <p className={cn(
              "text-white text-lg font-poppins",
              isDark ? "drop-shadow-2xl" : ""
            )}>
              Vous pouvez maintenant vous écrire !
            </p>
          </div>
        </div>
      )}
    </div>
  );
}