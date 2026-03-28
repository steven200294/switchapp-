import { useState } from "react";
import { motion } from "motion/react";
import { Edit3, MapPin, Wallet, Clock, Shield, Mail, User, CheckCircle, XCircle, FileText, Sun, Moon, Star, Heart, Zap, LogOut } from "lucide-react";
import { MobileHeader } from "./MobileHeader";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";

interface UserData {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  profession?: string;
  bio?: string;
  avatar?: string;
  hasCompletedPropertySetup: boolean;
}

interface ProfileScreenProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onEditProfile?: () => void;
  onEditProperty?: () => void;
  onShowMatches: () => void;
  matchesCount: number;
  onLogout?: () => void;
  userData?: UserData | null;
}



export function ProfileScreen({ isDark, onThemeToggle, onEditProfile, onEditProperty, onShowMatches, matchesCount, onLogout, userData }: ProfileScreenProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Fonction pour calculer l'âge à partir de la date de naissance
  const calculateAge = (dateString?: string): number | null => {
    if (!dateString) return null;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Profil utilisateur basé sur les données réelles ou valeurs par défaut
  const userProfile = {
    name: userData?.full_name || "Utilisateur SwitchAppart",
    age: calculateAge(userData?.date_of_birth),
    profession: userData?.profession || "Profession non renseignée",
    status: "Membre Vérifié",
    avatar: userData?.avatar || "https://images.unsplash.com/photo-1745434159123-af6142c7862f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzU2MjEzNDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    memberSince: "Janvier 2024",
    exchangesCompleted: 0, // Nouveau membre
    rating: 5.0, // Note par défaut pour nouveau membre
    email: userData?.email,
    phone: userData?.phone,
    bio: userData?.bio,
    photos: [
      userData?.avatar || "https://images.unsplash.com/photo-1745434159123-af6142c7862f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzU2MjEzNDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1733685318298-89c7e43d5e6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGxpZmVzdHlsZSUyMHBob3RvfGVufDF8fHx8MTc1NjIxMzkxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1646608218813-fc29afc6282e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRyYXZlbCUyMHZhY2F0aW9uJTIwcGhvdG98ZW58MXx8fHwxNzU2MjEzOTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    guarantees: ["Garant physique", "Bulletins de salaire", "Assurance habitation"],
    preferences: {
      location: "Paris 1er-11ème",
      maxRent: "2500€",
      minSurface: "60m²",
      duration: "6-12 mois",
      roommates: "0-1 colocataire"
    },
    verifications: [
      { item: "Email validé", verified: !!userData?.email, icon: Mail },
      { item: "Identité validée", verified: !!(userData?.full_name && userData?.date_of_birth), icon: User },
      { item: "Téléphone vérifié", verified: !!userData?.phone, icon: User },
      { item: "Logement configuré", verified: !!userData?.hasCompletedPropertySetup, icon: FileText }
    ]
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
              <h1 className={cn(
                "font-poppins text-2xl lg:text-3xl font-semibold",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Mon Profil
              </h1>
              <div className="flex items-center space-x-3">
                {/* Matches Button */}
                <button
                  onClick={onShowMatches}
                  className={cn(
                    "relative p-2 lg:p-3 rounded-full transition-all duration-300",
                    isDark 
                      ? "bg-gradient-to-r from-neon-purple/30 to-neon-magenta/30 text-neon-magenta hover:from-neon-magenta/40 hover:to-neon-purple/40" 
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  )}
                >
                  <Zap className="w-5 h-5 lg:w-6 lg:h-6" />
                  {matchesCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 lg:w-6 lg:h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {matchesCount > 9 ? '9+' : matchesCount}
                    </div>
                  )}
                </button>
                
                {/* Theme Toggle */}
                <button 
                  onClick={onThemeToggle}
                  className={cn(
                    "p-2 lg:p-3 rounded-full transition-all duration-300",
                    isDark 
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {isDark ? <Sun className="w-5 h-5 lg:w-6 lg:h-6" /> : <Moon className="w-5 h-5 lg:w-6 lg:h-6" />}
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Desktop: 2 columns layout, Mobile: single column */}
      <div className="p-4 lg:p-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
          
          {/* LEFT COLUMN - PERSONAL INFO (50% on desktop) */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Personal Information Block */}
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
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h2 className={cn(
                    "text-xl lg:text-2xl font-semibold font-poppins drop-shadow-lg",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {isDark ? (
                      <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
                        Informations personnelles
                      </span>
                    ) : (
                      "Informations personnelles"
                    )}
                  </h2>
                  <button
                    onClick={onEditProfile}
                    className={cn(
                      "p-2 lg:p-3 rounded-lg border transition-all duration-300",
                      isDark 
                        ? "bg-gradient-to-r from-neon-blue/30 to-neon-cyan/30 border-neon-cyan/50 text-neon-cyan hover:text-white hover:bg-gradient-to-r hover:from-neon-cyan/50 hover:to-neon-blue/50"
                        : "glass border-blue-300 text-blue-600 hover:bg-blue-50"
                    )}
                  >
                    <Edit3 className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
                
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
                      {userProfile.age ? `${userProfile.age} ans` : "Non renseigné"}
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
                
                <div className={cn(
                  "mt-4 lg:mt-6 p-3 lg:p-4 rounded-lg border",
                  isDark 
                    ? "bg-yellow-500/20 border-yellow-500/30"
                    : "bg-yellow-50 border-yellow-200"
                )}>
                  <p className={cn(
                    "text-sm lg:text-base text-center font-poppins",
                    isDark ? "text-yellow-300" : "text-yellow-700"
                  )}>
                    Complétez toutes les vérifications pour augmenter votre visibilité de 40%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN - PHOTOS & PROPERTY (50% on desktop) */}
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
                      Mes photos
                    </span>
                  ) : (
                    "Mes photos"
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

            {/* Configuration incomplete message si nécessaire */}
            {userData && !userData.hasCompletedPropertySetup && (
              <Card className={cn(
                "backdrop-blur-xl shadow-2xl overflow-hidden relative",
                isDark 
                  ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-orange-900/30 border border-orange-500/30"
                  : "glass-strong border border-orange-200/50"
              )}>
                {isDark && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-neon-orange/20 to-orange-500/20 blur-lg opacity-50" />
                )}
                <div className="relative p-6 lg:p-8 text-center">
                  <h2 className={cn(
                    "text-xl lg:text-2xl font-semibold font-poppins mb-4 drop-shadow-lg",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {isDark ? (
                      <span className="bg-gradient-to-r from-orange-400 to-neon-orange bg-clip-text text-transparent">
                        Configurez votre logement
                      </span>
                    ) : (
                      "Configurez votre logement"
                    )}
                  </h2>
                  <p className={cn(
                    "text-sm lg:text-base mb-6",
                    isDark ? "text-gray-300" : "text-gray-600"
                  )}>
                    Ajoutez les informations de votre logement pour commencer à recevoir des propositions d'échange.
                  </p>
                  <button
                    onClick={onEditProperty}
                    className={cn(
                      "px-6 py-3 rounded-lg font-medium transition-all duration-300",
                      isDark 
                        ? "bg-gradient-to-r from-orange-500 to-neon-orange text-black hover:shadow-lg"
                        : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg"
                    )}
                  >
                    Configurer mon logement
                  </button>
                </div>
              </Card>
            )}

            {/* Bouton de déconnexion */}
            {onLogout && (
              <Card className={cn(
                "backdrop-blur-xl shadow-2xl overflow-hidden relative",
                isDark 
                  ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-red-900/30 border border-red-500/30"
                  : "glass-strong border border-red-200/50"
              )}>
                {isDark && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-500/20 blur-lg opacity-50" />
                )}
                <div className="relative p-6 lg:p-8 text-center">
                  <button
                    onClick={onLogout}
                    className={cn(
                      "w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300",
                      isDark 
                        ? "bg-gradient-to-r from-red-600/30 to-red-700/30 text-red-300 hover:from-red-600/50 hover:to-red-700/50 hover:text-white border border-red-500/30"
                        : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg"
                    )}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}