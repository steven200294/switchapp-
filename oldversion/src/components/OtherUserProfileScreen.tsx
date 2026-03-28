import { useState } from "react";
import { ArrowLeft, MapPin, Wallet, Clock, Shield, Mail, User, CheckCircle, XCircle, FileText, Sun, Moon, Star, Heart, Zap, MessageCircle, Share, Flag } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface OtherUserProfileScreenProps {
  userId: string;
  isDark: boolean;
  onBack: () => void;
  onStartConversation: (userId: string) => void;
  onThemeToggle: () => void;
  onShowMatches: () => void;
  onPropertySelect?: (propertyId: string) => void;
  matchesCount: number;
  compatibilityScore?: number; // Score de compatibilité si c'est un match
}

// Mock data pour différents utilisateurs - normalement récupéré via API
const getUserProfile = (userId: string) => {
  const profiles = {
    "user-1": {
      id: "user-1",
      name: "Marie Dubois",
      age: 32,
      profession: "Architecte",
      status: "Membre Vérifié",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIwODI0MXww&ixlib=rb-4.1.0&q=80&w=1080",
      memberSince: "Janvier 2023",
      exchangesCompleted: 8,
      rating: 4.8,
      bio: "Passionnée d'architecture et de design, j'adore découvrir de nouveaux quartiers à travers mes échanges d'appartements. Toujours à la recherche de logements avec du caractère !",
      photos: [
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIwODI0MXww&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGFyY2hpdGVjdCUyMHdvcmtpbmd8ZW58MXx8fHwxNzU2MjE0ODY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGhvbWUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTYyMTQ4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      guarantees: ["Garant physique", "Bulletins de salaire", "Assurance habitation", "Caution bancaire"],
      preferences: {
        location: "Paris 1er-7ème",
        maxRent: "2800€",
        minSurface: "70m²",
        duration: "3-12 mois",
        roommates: "0 colocataire"
      },
      verifications: [
        { item: "Email validé", verified: true, icon: Mail },
        { item: "Identité validée", verified: true, icon: User },
        { item: "Revenus vérifiés", verified: true, icon: Wallet },
        { item: "Contrat signé", verified: true, icon: FileText }
      ],
      properties: [
        {
          id: "prop-marie-1",
          title: "Penthouse Invalides",
          image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1NjIwODMwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
          rent: "2600€",
          surface: "85m²",
          rooms: "4",
          location: "Paris 7ème"
        }
      ]
    },
    "user-2": {
      id: "user-2",
      name: "Thomas Martin",
      age: 29,
      profession: "Designer Graphique",
      status: "Membre Actif",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      memberSince: "Avril 2023",
      exchangesCompleted: 3,
      rating: 4.6,
      bio: "Designer freelance, j'aime les espaces créatifs et lumineux. Toujours partant pour découvrir de nouveaux quartiers branchés et rencontrer des personnes inspirantes.",
      photos: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBkZXNpZ25lciUyMHdvcmtpbmd8ZW58MXx8fHwxNzU2MjE0OTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBzcGFjZXxlbnwxfHx8fDE3NTYyMTQ5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      guarantees: ["Garant physique", "Bulletins de salaire", "Assurance habitation"],
      preferences: {
        location: "Paris 9ème-11ème",
        maxRent: "2200€",
        minSurface: "55m²",
        duration: "6-9 mois",
        roommates: "0-1 colocataire"
      },
      verifications: [
        { item: "Email validé", verified: true, icon: Mail },
        { item: "Identité validée", verified: true, icon: User },
        { item: "Revenus vérifiés", verified: false, icon: Wallet },
        { item: "Contrat signé", verified: false, icon: FileText }
      ],
      properties: [
        {
          id: "prop-thomas-1",
          title: "Loft République",
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwZGVzaWdufGVufDF8fHx8MTc1NjIwODMxNHww&ixlib=rb-4.1.0&q=80&w=1080",
          rent: "1950€",
          surface: "65m²",
          rooms: "3",
          location: "Paris 11ème"
        }
      ]
    }
  };

  return profiles[userId as keyof typeof profiles] || profiles["user-1"];
};

export function OtherUserProfileScreen({ 
  userId, 
  isDark, 
  onBack, 
  onStartConversation, 
  onThemeToggle, 
  onShowMatches, 
  onPropertySelect,
  matchesCount,
  compatibilityScore 
}: OtherUserProfileScreenProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const userProfile = getUserProfile(userId);

  const handleStartConversation = () => {
    onStartConversation(userId);
  };

  const handlePropertyClick = (propertyId: string) => {
    if (onPropertySelect) {
      onPropertySelect(propertyId);
    }
  };

  return (
    <div className={cn(
      "min-h-screen pb-20",
      isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20" 
        : "bg-white"
    )}>
      {/* Header */}
      <div className="relative">
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-magenta/10 blur-3xl" />
        )}
        <div className={cn(
          "relative backdrop-blur-xl border-b",
          isDark 
            ? "border-white/10 bg-dark-bg/80" 
            : "border-gray-200 glass"
        )}>
          <div className="p-4 lg:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack}
                  className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    isDark 
                      ? "bg-dark-secondary text-white hover:bg-gray-700" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className={cn(
                  "font-poppins text-xl lg:text-2xl font-semibold",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  Profil
                </h1>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Compatibility Score */}
                {compatibilityScore && (
                  <div className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    isDark 
                      ? "bg-gradient-to-r from-neon-purple/30 to-neon-magenta/30 text-neon-magenta" 
                      : "bg-purple-100 text-purple-700"
                  )}>
                    {compatibilityScore}% compatibles
                  </div>
                )}
                
                {/* Action Buttons */}
                <button className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-dark-secondary text-gray-300 hover:text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}>
                  <Share className="w-5 h-5" />
                </button>
                
                <button className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-dark-secondary text-gray-300 hover:text-red-400" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}>
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-center space-y-4 lg:space-y-6">
              {/* Avatar */}
              <div className="relative inline-block">
                {isDark && (
                  <div className="absolute inset-0 rounded-full bg-neon-cyan blur-lg opacity-60 animate-pulse scale-110" />
                )}
                <div className="relative">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className={cn(
                      "w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 object-cover",
                      isDark 
                        ? "border-neon-cyan shadow-2xl shadow-cyan-500/50" 
                        : "border-blue-500 shadow-lg"
                    )}
                  />
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-8 h-8 lg:w-10 lg:h-10 rounded-full border-3 flex items-center justify-center shadow-lg",
                    isDark 
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 border-dark-bg"
                      : "bg-gradient-to-br from-green-500 to-emerald-600 border-white"
                  )}>
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Name and Status */}
              <div className="space-y-2">
                <h1 className={cn(
                  "font-poppins text-2xl lg:text-3xl font-semibold drop-shadow-2xl",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {userProfile.name}
                </h1>
                <Badge className={cn(
                  "px-4 py-1 lg:px-6 lg:py-2 text-sm lg:text-base font-medium shadow-lg border-0",
                  isDark 
                    ? "bg-gradient-to-r from-neon-magenta to-purple-600 text-white"
                    : "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                )}>
                  {userProfile.status}
                </Badge>
                <p className={cn(
                  "text-sm lg:text-base font-poppins",
                  isDark ? "text-gray-300" : "text-gray-600"
                )}>
                  Membre depuis {userProfile.memberSince} • {userProfile.exchangesCompleted} échanges
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleStartConversation}
                  className={cn(
                    "px-6 py-3 font-medium transition-all duration-300",
                    isDark 
                      ? "bg-gradient-to-r from-neon-blue to-neon-cyan text-black hover:from-neon-cyan hover:to-neon-blue" 
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  )}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Envoyer un message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
          
          {/* LEFT COLUMN - PERSONAL INFO */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Bio Section */}
            {userProfile.bio && (
              <Card className={cn(
                "backdrop-blur-xl shadow-2xl overflow-hidden relative",
                isDark 
                  ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-blue-900/30 border border-blue-500/30"
                  : "glass-strong border border-blue-200/50"
              )}>
                {isDark && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue/20 via-neon-cyan/20 to-neon-blue/20 blur-lg opacity-50" />
                )}
                <div className="relative p-6 lg:p-8">
                  <h2 className={cn(
                    "text-xl lg:text-2xl font-semibold font-poppins mb-4 drop-shadow-lg",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {isDark ? (
                      <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
                        À propos
                      </span>
                    ) : (
                      "À propos"
                    )}
                  </h2>
                  <p className={cn(
                    "text-base lg:text-lg font-poppins leading-relaxed",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}>
                    {userProfile.bio}
                  </p>
                </div>
              </Card>
            )}

            {/* Personal Information Block */}
            <Card className={cn(
              "backdrop-blur-xl shadow-2xl overflow-hidden relative",
              isDark 
                ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-purple-900/30 border border-purple-500/30"
                : "glass-strong border border-purple-200/50"
            )}>
              {isDark && (
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple/20 via-neon-magenta/20 to-neon-purple/20 blur-lg opacity-50" />
              )}
              <div className="relative p-6 lg:p-8">
                <h2 className={cn(
                  "text-xl lg:text-2xl font-semibold font-poppins mb-4 lg:mb-6 drop-shadow-lg",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {isDark ? (
                    <span className="bg-gradient-to-r from-neon-purple to-neon-magenta bg-clip-text text-transparent">
                      Informations
                    </span>
                  ) : (
                    "Informations"
                  )}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-1">
                    <span className={cn(
                      "text-sm lg:text-base font-poppins",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      Âge
                    </span>
                    <p className={cn(
                      "font-semibold font-poppins text-base lg:text-lg",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      {userProfile.age} ans
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className={cn(
                      "text-sm lg:text-base font-poppins",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      Profession
                    </span>
                    <p className={cn(
                      "font-semibold font-poppins text-base lg:text-lg",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      {userProfile.profession}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className={cn(
                      "text-sm lg:text-base font-poppins",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      Note moyenne
                    </span>
                    <p className={cn(
                      "font-semibold flex items-center space-x-1 font-poppins text-base lg:text-lg",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      <Star className="w-4 h-4 lg:w-5 lg:h-5 fill-current text-yellow-500" />
                      <span>{userProfile.rating}/5</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className={cn(
                      "text-sm lg:text-base font-poppins",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      Échanges
                    </span>
                    <p className={cn(
                      "font-semibold font-poppins text-base lg:text-lg",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      {userProfile.exchangesCompleted} réalisés
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 lg:mt-6 space-y-2">
                  <span className={cn(
                    "text-sm lg:text-base font-poppins",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}>
                    Garanties locatives
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.guarantees.map((guarantee, index) => (
                      <Badge
                        key={index}
                        className={cn(
                          "px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm backdrop-blur-md font-poppins",
                          isDark 
                            ? "bg-gradient-to-r from-green-600/30 to-emerald-600/30 text-emerald-300 border border-emerald-400/30"
                            : "glass text-green-700 border border-green-300/50"
                        )}
                      >
                        <Shield className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        {guarantee}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Verification Checklist */}
            <Card className={cn(
              "backdrop-blur-xl shadow-2xl overflow-hidden relative",
              isDark 
                ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-green-900/30 border border-green-500/30"
                : "glass-strong border border-green-200/50"
            )}>
              {isDark && (
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 blur-lg opacity-50" />
              )}
              <div className="relative p-6 lg:p-8">
                <h2 className={cn(
                  "text-xl lg:text-2xl font-semibold font-poppins mb-4 lg:mb-6 drop-shadow-lg",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {isDark ? (
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Vérifications du compte
                    </span>
                  ) : (
                    "Vérifications du compte"
                  )}
                </h2>
                
                <div className="space-y-3 lg:space-y-4">
                  {userProfile.verifications.map((verification, index) => {
                    const Icon = verification.icon;
                    return (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center justify-between p-3 lg:p-4 rounded-lg transition-all duration-300 border",
                          verification.verified
                            ? isDark 
                              ? "bg-green-500/20 border-green-500/30"
                              : "bg-green-50 border-green-200"
                            : isDark 
                              ? "bg-red-500/20 border-red-500/30"
                              : "bg-red-50 border-red-200"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={cn(
                            "w-5 h-5 lg:w-6 lg:h-6",
                            verification.verified 
                              ? isDark ? "text-green-400" : "text-green-600"
                              : isDark ? "text-red-400" : "text-red-600"
                          )} />
                          <span className={cn(
                            "font-medium font-poppins text-sm lg:text-base",
                            isDark ? "text-white" : "text-gray-900"
                          )}>
                            {verification.item}
                          </span>
                        </div>
                        {verification.verified ? (
                          <CheckCircle className={cn(
                            "w-5 h-5 lg:w-6 lg:h-6",
                            isDark ? "text-green-400" : "text-green-600"
                          )} />
                        ) : (
                          <XCircle className={cn(
                            "w-5 h-5 lg:w-6 lg:h-6",
                            isDark ? "text-red-400" : "text-red-600"
                          )} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN - PHOTOS & PROPERTY */}
          <div className="space-y-6 lg:space-y-8">

            {/* Photo Gallery */}
            <Card className={cn(
              "backdrop-blur-xl shadow-2xl overflow-hidden relative",
              isDark 
                ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-pink-900/30 border border-pink-500/30"
                : "glass-strong border border-pink-200/50"
            )}>
              {isDark && (
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-neon-magenta/20 to-pink-500/20 blur-lg opacity-50" />
              )}
              <div className="relative p-6 lg:p-8">
                <h2 className={cn(
                  "text-xl lg:text-2xl font-semibold font-poppins mb-4 lg:mb-6 drop-shadow-lg",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {isDark ? (
                    <span className="bg-gradient-to-r from-pink-400 to-neon-magenta bg-clip-text text-transparent">
                      Photos
                    </span>
                  ) : (
                    "Photos"
                  )}
                </h2>
                
                {/* Main selected photo */}
                <div className="mb-4 lg:mb-6">
                  <img
                    src={userProfile.photos[selectedPhotoIndex]}
                    alt={`Photo ${selectedPhotoIndex + 1}`}
                    className="w-full h-64 lg:h-80 object-cover rounded-lg"
                  />
                </div>
                
                {/* Photo thumbnails */}
                <div className="flex space-x-2 lg:space-x-3 overflow-x-auto">
                  {userProfile.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={cn(
                        "flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300",
                        selectedPhotoIndex === index
                          ? isDark ? "border-neon-magenta" : "border-pink-500"
                          : "border-gray-300 opacity-70 hover:opacity-100"
                      )}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* User's Properties */}
            <Card className={cn(
              "backdrop-blur-xl shadow-2xl overflow-hidden relative",
              isDark 
                ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-orange-900/30 border border-orange-500/30"
                : "glass-strong border border-orange-200/50"
            )}>
              {isDark && (
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-neon-orange/20 to-orange-500/20 blur-lg opacity-50" />
              )}
              <div className="relative p-6 lg:p-8">
                <h2 className={cn(
                  "text-xl lg:text-2xl font-semibold font-poppins mb-4 lg:mb-6 drop-shadow-lg",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {isDark ? (
                    <span className="bg-gradient-to-r from-orange-400 to-neon-orange bg-clip-text text-transparent">
                      Ses logements
                    </span>
                  ) : (
                    "Ses logements"
                  )}
                </h2>
                
                <div className="space-y-4">
                  {userProfile.properties.map((property) => (
                    <button
                      key={property.id}
                      onClick={() => handlePropertyClick(property.id)}
                      className={cn(
                        "w-full p-4 rounded-lg border transition-all duration-300 text-left",
                        isDark 
                          ? "bg-dark-secondary/50 border-orange-500/30 hover:border-orange-500/50 hover:bg-dark-secondary/70"
                          : "bg-white border-orange-200 hover:border-orange-300 hover:bg-orange-50"
                      )}
                    >
                      <div className="flex space-x-4">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className={cn(
                            "font-semibold text-base lg:text-lg font-poppins mb-2",
                            isDark ? "text-white" : "text-gray-900"
                          )}>
                            {property.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className={cn(
                              "font-medium",
                              isDark ? "text-orange-300" : "text-orange-600"
                            )}>
                              {property.rent}
                            </span>
                            <span className={cn(
                              isDark ? "text-gray-400" : "text-gray-500"
                            )}>
                              • {property.surface} • {property.rooms} pièces
                            </span>
                          </div>
                          <p className={cn(
                            "text-sm mt-1",
                            isDark ? "text-gray-400" : "text-gray-500"
                          )}>
                            {property.location}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Housing Preferences */}
            <Card className={cn(
              "backdrop-blur-xl shadow-2xl overflow-hidden relative",
              isDark 
                ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-cyan-900/30 border border-cyan-500/30"
                : "glass-strong border border-cyan-200/50"
            )}>
              {isDark && (
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 via-neon-blue/20 to-neon-cyan/20 blur-lg opacity-50" />
              )}
              <div className="relative p-6 lg:p-8">
                <h2 className={cn(
                  "text-xl lg:text-2xl font-semibold font-poppins mb-4 lg:mb-6 drop-shadow-lg",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {isDark ? (
                    <span className="bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
                      Préférences logement
                    </span>
                  ) : (
                    "Préférences logement"
                  )}
                </h2>
                
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className={cn(
                      "w-5 h-5 lg:w-6 lg:h-6",
                      isDark ? "text-neon-cyan" : "text-cyan-600"
                    )} />
                    <div>
                      <span className={cn(
                        "text-sm lg:text-base font-poppins",
                        isDark ? "text-gray-400" : "text-gray-500"
                      )}>
                        Quartier souhaité
                      </span>
                      <p className={cn(
                        "font-semibold font-poppins text-base lg:text-lg",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        {userProfile.preferences.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Wallet className={cn(
                      "w-5 h-5 lg:w-6 lg:h-6",
                      isDark ? "text-neon-blue" : "text-blue-600"
                    )} />
                    <div>
                      <span className={cn(
                        "text-sm lg:text-base font-poppins",
                        isDark ? "text-gray-400" : "text-gray-500"
                      )}>
                        Loyer maximum
                      </span>
                      <p className={cn(
                        "font-semibold font-poppins text-base lg:text-lg",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        {userProfile.preferences.maxRent}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <User className={cn(
                      "w-5 h-5 lg:w-6 lg:h-6",
                      isDark ? "text-neon-purple" : "text-purple-600"
                    )} />
                    <div>
                      <span className={cn(
                        "text-sm lg:text-base font-poppins",
                        isDark ? "text-gray-400" : "text-gray-500"
                      )}>
                        Colocation
                      </span>
                      <p className={cn(
                        "font-semibold font-poppins text-base lg:text-lg",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        {userProfile.preferences.roommates}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className={cn(
                      "w-5 h-5 lg:w-6 lg:h-6",
                      isDark ? "text-neon-orange" : "text-orange-600"
                    )} />
                    <div>
                      <span className={cn(
                        "text-sm lg:text-base font-poppins",
                        isDark ? "text-gray-400" : "text-gray-500"
                      )}>
                        Durée souhaitée
                      </span>
                      <p className={cn(
                        "font-semibold font-poppins text-base lg:text-lg",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        {userProfile.preferences.duration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}