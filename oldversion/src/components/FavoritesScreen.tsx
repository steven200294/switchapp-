import { useState } from "react";
import { Heart, Filter, Grid3X3, List, ArrowLeft, SortAsc, SortDesc, Sun, Moon } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface FavoritesScreenProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onPropertySelect: (propertyId: string) => void;
  onBack?: () => void;
  likedProperties: string[];
  onToggleLike: (propertyId: string) => void;
  onShowMatches: () => void;
  matchesCount: number;
}

// Plus de propriétés favorites pour un meilleur rendu
const favoriteProperties = [
  {
    id: "featured-1",
    title: "Appartement lumineux avec vue panoramique",
    location: "Paris 7ème, Invalides",
    price: "2500€",
    compatibilityScore: 95,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBwYXJpc3xlbnwxfHx8fDE3NTYyMDgyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Disponible maintenant",
    roommates: 0,
    maxRoommates: 1,
    tags: ["Luxe", "Vue Tour Eiffel", "Ascenseur", "Parking", "Terrasse"],
    savedDate: "2024-01-15"
  },
  {
    id: "featured-2",
    title: "Loft créatif dans quartier artistique",
    location: "Paris 20ème, Belleville",
    price: "1400€",
    compatibilityScore: 89,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMGxvZnQlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "15 Mars",
    roommates: 1,
    maxRoommates: 2,
    tags: ["Atelier", "Créatif", "Lumineux", "Unique", "Proche métro"],
    savedDate: "2024-01-20"
  },
  {
    id: "featured-3",
    title: "Studio moderne proche universités",
    location: "Paris 5ème, Quartier Latin",
    price: "1100€",
    compatibilityScore: 82,
    image: "https://images.unsplash.com/photo-1612419299101-6c294dc2901d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwcm9vbSUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NTYyMDgyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "1er Avril",
    roommates: 0,
    maxRoommates: 1,
    tags: ["Étudiant", "Meublé", "WiFi", "Calme"],
    savedDate: "2024-01-25"
  },
  {
    id: "featured-4",
    title: "Duplex familial avec jardin",
    location: "Paris 15ème, Vaugirard",
    price: "2200€",
    compatibilityScore: 91,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Mai 2024",
    roommates: 2,
    maxRoommates: 4,
    tags: ["Familial", "Jardin", "Duplex", "Calme", "Écoles"],
    savedDate: "2024-01-30"
  },
  {
    id: "featured-6",
    title: "Appartement cosy Montmartre",
    location: "Paris 18ème, Montmartre",
    price: "1800€",
    compatibilityScore: 85,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTc1NjIwODI0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Juillet 2024",
    roommates: 1,
    maxRoommates: 2,
    tags: ["Cosy", "Historique", "Artistique", "Vue", "Charme"],
    savedDate: "2024-02-05"
  }
];

type SortOption = "newest" | "oldest" | "price-asc" | "price-desc" | "compatibility";
type ViewMode = "grid" | "list";

export function FavoritesScreen({ 
  isDark, 
  onThemeToggle, 
  onPropertySelect, 
  onBack,
  likedProperties,
  onToggleLike,
  onShowMatches,
  matchesCount
}: FavoritesScreenProps) {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filtrer les propriétés favorites
  const filteredFavorites = favoriteProperties.filter(property => 
    likedProperties.includes(property.id)
  );

  // Trier les propriétés
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
      case "oldest":
        return new Date(a.savedDate).getTime() - new Date(b.savedDate).getTime();
      case "price-asc":
        return parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, ""));
      case "price-desc":
        return parseInt(b.price.replace(/\D/g, "")) - parseInt(a.price.replace(/\D/g, ""));
      case "compatibility":
        return b.compatibilityScore - a.compatibilityScore;
      default:
        return 0;
    }
  });

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case "newest": return "Plus récents";
      case "oldest": return "Plus anciens";
      case "price-asc": return "Prix croissant";
      case "price-desc": return "Prix décroissant";
      case "compatibility": return "Compatibilité";
      default: return "Plus récents";
    }
  };

  return (
    <div className={cn(
      "min-h-screen pb-20",
      isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-red-900/20" 
        : "bg-gray-50"
    )}>
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-50 backdrop-blur-xl border-b",
        isDark 
          ? "bg-dark-bg/80 border-white/10" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="p-4 lg:px-8">
          <div className="flex items-center justify-between">
            {onBack && (
              <button
                onClick={onBack}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
            <div className="flex-1 text-center">
              <h1 className={cn(
                "text-xl lg:text-2xl font-semibold font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                {isDark ? (
                  <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-magenta bg-clip-text text-transparent">
                    Mes favoris
                  </span>
                ) : (
                  "Mes favoris"
                )}
              </h1>
              <p className={cn(
                "text-sm mt-1 font-poppins",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                {filteredFavorites.length} logement{filteredFavorites.length > 1 ? 's' : ''} sauvegardé{filteredFavorites.length > 1 ? 's' : ''}
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

      <div className="p-4 lg:px-8 space-y-6">
        {/* Filters and View Controls */}
        {filteredFavorites.length > 0 && (
          <Card className={cn(
            "p-4",
            isDark 
              ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10" 
              : "bg-white shadow-sm border border-gray-200"
          )}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Sort Controls */}
              <div className="flex items-center space-x-3">
                <span className={cn(
                  "text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-600"
                )}>
                  Trier par:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className={cn(
                    "text-sm px-3 py-2 rounded-lg border-0 focus:ring-2 transition-all",
                    isDark 
                      ? "bg-gray-700 text-white focus:ring-red-500/50" 
                      : "bg-gray-50 text-gray-900 focus:ring-red-500/50"
                  )}
                >
                  <option value="newest">Plus récents</option>
                  <option value="oldest">Plus anciens</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="compatibility">Compatibilité</option>
                </select>
              </div>

              {/* View Mode Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    viewMode === "grid"
                      ? (isDark 
                          ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                          : "bg-red-50 text-red-600 border border-red-200")
                      : (isDark 
                          ? "bg-gray-700 text-gray-400 hover:bg-gray-600" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    viewMode === "list"
                      ? (isDark 
                          ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                          : "bg-red-50 text-red-600 border border-red-200")
                      : (isDark 
                          ? "bg-gray-700 text-gray-400 hover:bg-gray-600" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Favorites List/Grid */}
        {filteredFavorites.length > 0 ? (
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
              : "space-y-4"
          )}>
            {sortedFavorites.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                isDark={isDark}
                liked={likedProperties.includes(property.id)}
                onLike={() => onToggleLike(property.id)}
                onView={() => onPropertySelect(property.id)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className={cn(
            "text-center py-16 px-6",
            isDark 
              ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10" 
              : "bg-white shadow-sm border border-gray-200"
          )}>
            <div className={cn(
              "w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center",
              isDark 
                ? "bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30" 
                : "bg-gradient-to-br from-red-50 to-pink-50 border border-red-200"
            )}>
              <Heart className={cn(
                "w-10 h-10",
                isDark ? "text-red-400" : "text-red-500"
              )} />
            </div>
            
            <h3 className={cn(
              "text-xl font-bold mb-3",
              isDark ? "text-white" : "text-gray-900"
            )}>
              Aucun favori pour le moment
            </h3>
            
            <p className={cn(
              "text-sm mb-6 max-w-md mx-auto",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              Explorez nos logements et cliquez sur le cœur pour ajouter vos coups de cœur ici. 
              Ils seront sauvegardés pour que vous puissiez les retrouver facilement.
            </p>
            
            <Button
              onClick={() => onBack && onBack()}
              className={cn(
                "px-6 py-2 font-medium transition-all duration-300",
                isDark 
                  ? "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-400 hover:to-pink-500" 
                  : "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-400 hover:to-pink-500"
              )}
            >
              Explorer les logements
            </Button>
          </Card>
        )}

        {/* Quick Stats */}
        {filteredFavorites.length > 0 && (
          <Card className={cn(
            "p-6",
            isDark 
              ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10" 
              : "bg-white shadow-sm border border-gray-200"
          )}>
            <h3 className={cn(
              "text-lg font-bold mb-4",
              isDark ? "text-white" : "text-gray-900"
            )}>
              Statistiques de vos favoris
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-red-400" : "text-red-600"
                )}>
                  {filteredFavorites.length}
                </div>
                <div className={cn(
                  "text-xs mt-1",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Favoris
                </div>
              </div>
              
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-green-400" : "text-green-600"
                )}>
                  {Math.round(filteredFavorites.reduce((acc, p) => acc + p.compatibilityScore, 0) / filteredFavorites.length)}%
                </div>
                <div className={cn(
                  "text-xs mt-1",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Compatibilité moy.
                </div>
              </div>
              
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-blue-400" : "text-blue-600"
                )}>
                  {Math.round(filteredFavorites.reduce((acc, p) => acc + parseInt(p.price.replace(/\D/g, "")), 0) / filteredFavorites.length)}€
                </div>
                <div className={cn(
                  "text-xs mt-1",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Prix moyen
                </div>
              </div>
              
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-purple-400" : "text-purple-600"
                )}>
                  {filteredFavorites.filter(p => p.available === "Disponible maintenant").length}
                </div>
                <div className={cn(
                  "text-xs mt-1",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Dispo maintenant
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}