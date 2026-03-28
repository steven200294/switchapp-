import { useState } from "react";
import { 
  ArrowLeft, Heart, Share2, MapPin, Calendar, Users, Wifi, Car, 
  Bath, Bed, ChefHat, Tv, Zap, MessageCircle, Phone, Star,
  ChevronLeft, ChevronRight, Building, Shield, CheckCircle, Sun, Moon, Ticket, RefreshCw
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { cn } from "./ui/utils";

interface PropertyDetailScreenProps {
  propertyId: string;
  isDark: boolean;
  onBack: () => void;
  onContact: () => void;
  liked: boolean;
  onToggleLike: () => void;
  onThemeToggle: () => void;
  onViewUserProfile?: (userId: string) => void;
  switchPassBalance?: number;
  onUseSwitchPass?: () => void;
  onDirectExchange?: () => void;
}

// Mock data basé sur les critères utilisateur
const propertyData = {
  "prop-marie-1": {
    title: "Penthouse moderne avec vue panoramique",
    location: "Paris 7ème, Invalides",
    fullAddress: "45 Avenue de la Bourdonnais, 75007 Paris",
    price: 2600,
    surface: 85,
    rooms: 4,
    bedrooms: 2,
    bathrooms: 2,
    availableFrom: "Disponible maintenant",
    availableUntil: "Juin 2025",
    compatibilityScore: 94,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1NjIwODMwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwZGVzaWdufGVufDF8fHx8MTc1NjIwODMxNHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc1NjIwODMxOHww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    amenities: [
      { icon: Wifi, label: "WiFi haut débit", verified: true },
      { icon: Car, label: "Parking privé", verified: true },
      { icon: ChefHat, label: "Cuisine équipée", verified: true },
      { icon: Tv, label: "Smart TV", verified: true },
      { icon: Bath, label: "Baignoire", verified: true },
      { icon: Building, label: "Ascenseur", verified: true }
    ],
    owner: {
      id: "user-1",
      name: "Marie Dubois",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIwODI0MXww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      reviewsCount: 127,
      responseTime: "< 1h",
      exchangesCount: 8,
      verified: true
    },
    description: "Magnifique penthouse avec vue imprenable sur la Tour Eiffel. Entièrement rénové en 2023, cet appartement lumineux offre tout le confort moderne dans un quartier prestigieux. Idéal pour un échange de logement dans le cœur de Paris.",
    matchReasons: [
      "Même quartier souhaité dans vos préférences",
      "Budget parfaitement compatible (2600€)",
      "Disponibilité immédiate comme recherché",
      "Profil vérifié et bien noté",
      "Conditions d'échange compatibles"
    ],
    neighborhood: {
      walkScore: 95,
      transitScore: 88,
      bikeScore: 78,
      highlights: ["Musée d'Orsay à 10min", "Tour Eiffel à 5min", "Métro École Militaire"]
    }
  },
  "prop-thomas-1": {
    title: "Loft artistique République",
    location: "Paris 11ème, République",
    fullAddress: "22 Rue de la Fontaine au Roi, 75011 Paris",
    price: 1950,
    surface: 65,
    rooms: 3,
    bedrooms: 1,
    bathrooms: 1,
    availableFrom: "Mars 2024",
    availableUntil: "Décembre 2024",
    compatibilityScore: 87,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMGxvZnQlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTc1NjIwODI0OXww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBkZXNpZ25lciUyMHdvcmtpbmd8ZW58MXx8fHwxNzU2MjE0OTA3fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    amenities: [
      { icon: Wifi, label: "WiFi haut débit", verified: true },
      { icon: ChefHat, label: "Cuisine ouverte", verified: true },
      { icon: Tv, label: "Smart TV", verified: true },
      { icon: Building, label: "Ascenseur", verified: false }
    ],
    owner: {
      id: "user-2",
      name: "Thomas Martin",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.6,
      reviewsCount: 45,
      responseTime: "< 2h",
      exchangesCount: 3,
      verified: true
    },
    description: "Loft d'artiste dans le quartier branché de République. Espace lumineux avec de hauts plafonds et un style industriel moderne. Parfait pour les créatifs et les amateurs d'art contemporain.",
    matchReasons: [
      "Quartier dynamique et branché",
      "Budget adapté à vos critères",
      "Style unique et inspirant",
      "Bien desservi par les transports",
      "Propriétaire jeune et flexible"
    ],
    neighborhood: {
      walkScore: 90,
      transitScore: 95,
      bikeScore: 85,
      highlights: ["Place de la République à 2min", "Canal Saint-Martin à 10min", "Nombreux bars et restaurants"]
    }
  },
  "featured-1": {
    title: "Penthouse moderne avec vue panoramique",
    location: "Paris 7ème, Invalides",
    fullAddress: "45 Avenue de la Bourdonnais, 75007 Paris",
    price: 2500,
    surface: 85,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    availableFrom: "Disponible maintenant",
    availableUntil: "Juin 2025",
    compatibilityScore: 95,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBwYXJpc3xlbnwxfHx8fDE3NTYyMDgyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMGxvZnQlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1579926716139-2c80ed956d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1612419299101-6c294dc2901d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwcm9vbSUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NTYyMDgyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTc1NjIwODI0OXww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    amenities: [
      { icon: Wifi, label: "WiFi haut débit", verified: true },
      { icon: Car, label: "Parking privé", verified: true },
      { icon: ChefHat, label: "Cuisine équipée", verified: true },
      { icon: Tv, label: "Smart TV", verified: true },
      { icon: Bath, label: "Baignoire", verified: false },
      { icon: Building, label: "Ascenseur", verified: true }
    ],
    owner: {
      id: "user-1",
      name: "Marie Dubois",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIwODI0MXww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      reviewsCount: 127,
      responseTime: "< 1h",
      exchangesCount: 23,
      verified: true
    },
    description: "Magnifique penthouse avec vue imprenable sur la Tour Eiffel. Entièrement rénové en 2023, cet appartement lumineux offre tout le confort moderne dans un quartier prestigieux. Idéal pour un échange de logement dans le cœur de Paris.",
    matchReasons: [
      "Même quartier souhaité dans vos préférences",
      "Budget parfaitement compatible (2500€)",
      "Disponibilité immédiate comme recherché",
      "Profil vérifié et bien noté",
      "Conditions d'échange compatibles"
    ],
    neighborhood: {
      walkScore: 95,
      transitScore: 88,
      bikeScore: 78,
      highlights: ["Musée d'Orsay à 10min", "Tour Eiffel à 5min", "Métro École Militaire"]
    }
  }
};

export function PropertyDetailScreen({ propertyId, isDark, onBack, onContact, liked, onToggleLike, onThemeToggle, onViewUserProfile, switchPassBalance = 0, onUseSwitchPass, onDirectExchange }: PropertyDetailScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const property = propertyData[propertyId as keyof typeof propertyData] || propertyData["featured-1"];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleContact = () => {
    onContact();
  };

  return (
    <div className={cn(
      "min-h-screen",
      isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20" 
        : "bg-white"
    )}>
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-50 backdrop-blur-xl border-b",
        isDark 
          ? "bg-dark-bg/80 border-white/10" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className={cn(
              "p-2 rounded-full transition-all duration-300",
              isDark
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleLike}
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                isDark
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              <Heart className={cn(
                "w-5 h-5 transition-colors",
                liked ? "text-red-500 fill-red-500" : isDark ? "text-gray-300" : "text-gray-600"
              )} />
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
            <button className={cn(
              "p-2 rounded-full transition-all duration-300",
              isDark
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}>
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[currentImageIndex]}
          alt={`${property.title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
          {currentImageIndex + 1} / {property.images.length}
        </div>
        
        {/* Compatibility Score - Style néon si dark */}
        <div className="absolute top-4 left-4">
          {isDark ? (
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-neon-orange blur-md opacity-60 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-neon-orange to-orange-600 border-2 border-neon-orange flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <span className="text-white font-bold text-lg font-poppins drop-shadow-lg">
                    {property.compatibilityScore}
                  </span>
                  <span className="text-orange-200 text-xs block font-medium">%</span>
                </div>
              </div>
            </div>
          ) : (
            <Badge className="bg-green-500 text-white px-3 py-2 text-lg font-semibold">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {property.compatibilityScore}% Match
            </Badge>
          )}
        </div>
      </div>

      {/* Image Thumbnails */}
      <div className="p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {property.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300",
                currentImageIndex === index
                  ? isDark ? "border-neon-cyan" : "border-blue-500"
                  : "border-gray-300 opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Property Info */}
        <Card className={cn(
          "p-6",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-purple-900/30 border border-purple-500/30 backdrop-blur-xl"
            : "bg-white border border-gray-200"
        )}>
          <div className="space-y-4">
            <div>
              <h1 className={cn(
                "text-2xl font-bold font-poppins",
                isDark ? "text-white drop-shadow-lg" : "text-gray-900"
              )}>
                {property.title}
              </h1>
              <div className="flex items-center space-x-2 mt-2">
                <MapPin className={cn(
                  "w-4 h-4",
                  isDark ? "text-neon-cyan" : "text-gray-500"
                )} />
                <span className={cn(
                  "text-sm",
                  isDark ? "text-gray-300" : "text-gray-600"
                )}>
                  {property.fullAddress}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold font-poppins",
                  isDark ? "text-neon-blue" : "text-gray-900"
                )}>
                  {property.surface}m²
                </div>
                <div className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Surface
                </div>
              </div>
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold font-poppins",
                  isDark ? "text-neon-purple" : "text-gray-900"
                )}>
                  {property.rooms}
                </div>
                <div className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Pièces
                </div>
              </div>
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold font-poppins",
                  isDark ? "text-neon-cyan" : "text-gray-900"
                )}>
                  {property.bedrooms}
                </div>
                <div className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Chambres
                </div>
              </div>
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold font-poppins",
                  isDark ? "text-neon-magenta" : "text-gray-900"
                )}>
                  {property.bathrooms}
                </div>
                <div className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Salles de bain
                </div>
              </div>
            </div>

            <Separator className={isDark ? "border-white/20" : "border-gray-200"} />

            <div className="flex items-center justify-between">
              <div>
                <span className={cn(
                  "text-3xl font-bold font-poppins",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {property.price}€
                </span>
                <span className={cn(
                  "text-lg ml-2",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  /mois
                </span>
              </div>
              <div className="text-right">
                <div className={cn(
                  "text-sm font-medium",
                  isDark ? "text-neon-cyan" : "text-green-600"
                )}>
                  {property.availableFrom}
                </div>
                <div className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Jusqu'à {property.availableUntil}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Amenities */}
        <Card className={cn(
          "p-6",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-blue-900/30 border border-blue-500/30 backdrop-blur-xl"
            : "bg-white border border-gray-200"
        )}>
          <h2 className={cn(
            "text-xl font-bold mb-4 font-poppins",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Équipements & Services
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {property.amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <Icon className={cn(
                    "w-5 h-5",
                    isDark ? "text-neon-blue" : "text-blue-600"
                  )} />
                  <span className={cn(
                    "text-sm",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}>
                    {amenity.label}
                  </span>
                  {amenity.verified && (
                    <CheckCircle className={cn(
                      "w-4 h-4",
                      isDark ? "text-green-400" : "text-green-500"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Description */}
        <Card className={cn(
          "p-6",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-green-900/30 border border-green-500/30 backdrop-blur-xl"
            : "bg-white border border-gray-200"
        )}>
          <h2 className={cn(
            "text-xl font-bold mb-4 font-poppins",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Description
          </h2>
          <p className={cn(
            "leading-relaxed",
            isDark ? "text-gray-300" : "text-gray-700"
          )}>
            {property.description}
          </p>
        </Card>

        {/* Owner Info */}
        <Card className={cn(
          "p-6",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-cyan-900/30 border border-cyan-500/30 backdrop-blur-xl"
            : "bg-white border border-gray-200"
        )}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn(
              "text-xl font-bold font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              Propriétaire
            </h2>
            {onViewUserProfile && (
              <Button
                onClick={() => onViewUserProfile(property.owner.id)}
                variant="outline"
                size="sm"
                className={cn(
                  "text-sm font-medium",
                  isDark 
                    ? "border-cyan-500/50 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10"
                    : "border-blue-300 text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                )}
              >
                Voir le profil
              </Button>
            )}
          </div>
          <button
            onClick={() => onViewUserProfile?.(property.owner.id)}
            className={cn(
              "flex items-center space-x-4 w-full text-left transition-all duration-300 rounded-lg p-2 -m-2",
              onViewUserProfile && (isDark 
                ? "hover:bg-cyan-500/10 hover:border-cyan-500/30"
                : "hover:bg-blue-50")
            )}
            disabled={!onViewUserProfile}
          >
            <div className="relative">
              <img
                src={property.owner.avatar}
                alt={property.owner.name}
                className={cn(
                  "w-16 h-16 rounded-full object-cover transition-transform duration-200",
                  onViewUserProfile && "hover:scale-105"
                )}
              />
              {property.owner.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className={cn(
                "font-semibold",
                isDark ? "text-white" : "text-gray-900"
              )}>
                {property.owner.name}
                {onViewUserProfile && (
                  <span className={cn(
                    "ml-2 text-xs opacity-70",
                    isDark ? "text-cyan-300" : "text-blue-600"
                  )}>
                    (Cliquez pour voir le profil)
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className={cn(
                  "text-sm",
                  isDark ? "text-gray-300" : "text-gray-700"
                )}>
                  {property.owner.rating} ({property.owner.reviewsCount} avis)
                </span>
              </div>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className={cn(
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  Répond en {property.owner.responseTime}
                </span>
                <span className={cn(
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  {property.owner.exchangesCount} échanges
                </span>
              </div>
            </div>
          </button>
        </Card>

        {/* Match Reasons - Style néon si dark */}
        {isDark ? (
          <Card className="bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-purple-900/30 border border-purple-500/30 backdrop-blur-xl p-6 overflow-hidden relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple/20 via-neon-magenta/20 to-neon-cyan/20 blur-lg opacity-50" />
            <div className="relative">
              <h2 className="text-xl font-bold text-white font-poppins mb-4 drop-shadow-lg">
                <span className="bg-gradient-to-r from-neon-purple to-neon-magenta bg-clip-text text-transparent">
                  Pourquoi ce match parfait ?
                </span>
              </h2>
              <div className="space-y-3">
                {property.matchReasons.map((reason, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Zap className="w-4 h-4 text-neon-cyan animate-pulse" />
                    <span className="text-gray-300">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="bg-green-50 border border-green-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Pourquoi ce match parfait ?
            </h2>
            <div className="space-y-3">
              {property.matchReasons.map((reason, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">{reason}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Exchange Options - SwitchPass System */}
        <Card className={cn(
          "backdrop-blur-xl overflow-hidden relative mb-6",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-orange-900/30 border border-orange-500/30"
            : "glass-strong border border-orange-200/50"
        )}>
          {isDark && (
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-orange/20 via-neon-magenta/20 to-neon-orange/20 blur-lg opacity-50" />
          )}
          <div className="relative p-6">
            <h2 className={cn(
              "text-xl font-semibold mb-4 font-poppins text-center",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {isDark ? (
                <span className="bg-gradient-to-r from-neon-orange to-neon-magenta bg-clip-text text-transparent">
                  Options d'échange
                </span>
              ) : (
                "Options d'échange"
              )}
            </h2>

            <div className="grid gap-4">
              {/* Option 1: Direct Exchange */}
              {onDirectExchange && (
                <button
                  onClick={onDirectExchange}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 transition-all duration-300 text-left",
                    isDark
                      ? "bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border-neon-cyan/50 hover:border-neon-cyan hover:shadow-xl hover:shadow-neon-cyan/30"
                      : "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-300 hover:border-cyan-500 hover:shadow-lg"
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                      isDark 
                        ? "bg-gradient-to-br from-neon-cyan to-neon-blue"
                        : "bg-gradient-to-br from-cyan-500 to-blue-600"
                    )}>
                      <RefreshCw className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={cn(
                        "font-semibold mb-1",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        Échanger directement
                      </h3>
                      <p className={cn(
                        "text-sm",
                        isDark ? "text-gray-400" : "text-gray-600"
                      )}>
                        Si vous avez un logement compatible à proposer
                      </p>
                    </div>
                    <ChevronRight className={cn(
                      "w-6 h-6 flex-shrink-0",
                      isDark ? "text-neon-cyan" : "text-cyan-600"
                    )} />
                  </div>
                </button>
              )}

              {/* Option 2: Use SwitchPass */}
              {onUseSwitchPass && (
                <button
                  onClick={onUseSwitchPass}
                  disabled={switchPassBalance === 0}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 transition-all duration-300 text-left",
                    switchPassBalance > 0
                      ? isDark
                        ? "bg-gradient-to-r from-neon-orange/20 to-neon-magenta/20 border-neon-orange/50 hover:border-neon-orange hover:shadow-xl hover:shadow-neon-orange/30"
                        : "bg-gradient-to-r from-orange-50 to-pink-50 border-orange-300 hover:border-orange-500 hover:shadow-lg"
                      : isDark
                        ? "bg-gray-800/50 border-gray-700/50 opacity-50 cursor-not-allowed"
                        : "bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                      switchPassBalance > 0
                        ? isDark 
                          ? "bg-gradient-to-br from-neon-orange to-neon-magenta"
                          : "bg-gradient-to-br from-orange-500 to-pink-600"
                        : "bg-gray-500"
                    )}>
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={cn(
                          "font-semibold",
                          isDark ? "text-white" : "text-gray-900"
                        )}>
                          Utiliser mon SwitchPass
                        </h3>
                        {switchPassBalance > 0 && (
                          <Badge className={cn(
                            "px-2 py-1",
                            isDark 
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-green-100 text-green-700 border border-green-300"
                          )}>
                            {switchPassBalance} disponible{switchPassBalance > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                      <p className={cn(
                        "text-sm",
                        isDark ? "text-gray-400" : "text-gray-600"
                      )}>
                        {switchPassBalance > 0 
                          ? "Déverrouillez ce logement avec votre Pass"
                          : "Vous n'avez pas de SwitchPass disponible"}
                      </p>
                    </div>
                    <ChevronRight className={cn(
                      "w-6 h-6 flex-shrink-0",
                      switchPassBalance > 0
                        ? isDark ? "text-neon-orange" : "text-orange-600"
                        : "text-gray-500"
                    )} />
                  </div>
                </button>
              )}
            </div>

            {switchPassBalance === 0 && (
              <div className={cn(
                "mt-4 p-3 rounded-lg border text-center",
                isDark 
                  ? "bg-yellow-500/20 border-yellow-500/30"
                  : "bg-yellow-50 border-yellow-200"
              )}>
                <p className={cn(
                  "text-sm",
                  isDark ? "text-yellow-300" : "text-yellow-700"
                )}>
                  💡 Pas de SwitchPass ? Cédez votre logement ou achetez-en un !
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Contact Buttons */}
        <div className="grid grid-cols-2 gap-4 pb-20">
          <Button
            onClick={handleContact}
            className={cn(
              "py-4 text-lg font-semibold transition-all duration-300 font-poppins",
              isDark
                ? "bg-gradient-to-r from-neon-magenta to-purple-600 text-white border border-neon-magenta/50 hover:border-neon-cyan/80 hover:shadow-neon-cyan/30 hover:shadow-2xl"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contacter
          </Button>
          <Button
            variant="outline"
            className={cn(
              "py-4 text-lg font-semibold transition-all duration-300 font-poppins",
              isDark
                ? "border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/20 hover:text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            <Phone className="w-5 h-5 mr-2" />
            Appeler
          </Button>
        </div>
      </div>
    </div>
  );
}