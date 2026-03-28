import { useState } from "react";
import { Search, Heart, TrendingUp, MapPin, Calendar, Plus, Star, Sun, Moon, Zap } from "lucide-react";
import { MobileHeader } from "./MobileHeader";
import { PropertyCard } from "./PropertyCard";
import { QuickActionButtons, CategoryCards } from "./QuickActionButtons";
import { FiltersSection, PropertyFilters } from "./FiltersSection";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
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
  switchPassBalance?: number;
}

interface HomeScreenProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onPropertySelect: (propertyId: string) => void;
  likedProperties: string[];
  onToggleLike: (propertyId: string) => void;
  onShowFavorites: () => void;
  onAddProperty: () => void;
  onShowMatches: () => void;
  onSearchClick: (query?: string) => void;
  onPerformSearch: (query: string) => void;
  searchHistory: string[];
  matchesCount: number;
  userData?: UserData | null;
}

const featuredProperties = [
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
    owner: {
      name: "Marie Dubois",
      avatar: "https://images.unsplash.com/photo-1745434159123-af6142c7862f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzU2MjE1Mzk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
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
    owner: {
      name: "Thomas Martin",
      avatar: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIxNTQwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
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
    owner: {
      name: "Sophie Laurent",
      avatar: "https://images.unsplash.com/photo-1734092916915-d16146c0726c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU2MTc2MzMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
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
    owner: {
      name: "Lucas Moreau",
      avatar: "https://images.unsplash.com/photo-1543075270-17e1257ec612?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjB5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHNtaWxlfGVufDF8fHx8MTc1NjIxNTQyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  },
  {
    id: "featured-5",
    title: "Penthouse moderne La Défense",
    location: "La Défense, Puteaux",
    price: "3200€",
    compatibilityScore: 87,
    image: "https://images.unsplash.com/photo-1579926716139-2c80ed956d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Juin 2024",
    roommates: 0,
    maxRoommates: 2,
    tags: ["Luxe", "Business", "Vue", "Moderne", "Transport"],
    owner: {
      name: "Camille Roux",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NjIxNTI1N3ww&ixlib=rb-4.1.0&q=80&w=1080"
    }
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
    owner: {
      name: "Emma Leroy",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIwODI0MXww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: "featured-7",
    title: "Maison partagée Vincennes",
    location: "Vincennes, proche métro",
    price: "1300€",
    compatibilityScore: 79,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBwYXJpc3xlbnwxfHx8fDE3NTYyMDgyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Août 2024",
    roommates: 3,
    maxRoommates: 5,
    tags: ["Maison", "Colocation", "Jardin", "Convivial", "Proche Paris"],
    owner: {
      name: "Antoine Dubois",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMHNtaWxlfGVufDF8fHx8MTc1NjIxNTI2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: "featured-8",
    title: "Studio design Le Marais",
    location: "Paris 4ème, Le Marais",
    price: "1600€",
    compatibilityScore: 88,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Septembre 2024",
    roommates: 0,
    maxRoommates: 1,
    tags: ["Design", "Centre", "Historique", "Branché", "Cafés"],
    owner: {
      name: "Julien Garcia",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  }
];

const quickCategories = [
  {
    title: "Nouveautés",
    subtitle: "12 nouveaux logements",
    icon: TrendingUp,
    gradient: "from-blue-500 to-blue-600",
    count: 12
  },
  {
    title: "À proximité",
    subtitle: "Dans votre quartier",
    icon: MapPin,
    gradient: "from-green-500 to-green-600",
    count: 8
  },
  {
    title: "Disponible rapidement",
    subtitle: "Dispo cette semaine",
    icon: Calendar,
    gradient: "from-orange-500 to-orange-600",
    count: 5
  }
];

export function HomeScreen({ 
  isDark, 
  onThemeToggle, 
  onPropertySelect,
  likedProperties,
  onToggleLike,
  onShowFavorites,
  onAddProperty,
  onShowMatches,
  onSearchClick,
  onPerformSearch,
  searchHistory,
  matchesCount,
  userData
}: HomeScreenProps) {
  // Extraire le prénom de l'utilisateur
  const firstName = userData?.full_name?.split(' ')[0] || 'Utilisateur';
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState<PropertyFilters>({
    priceRange: [500, 4000],
    location: [],
    propertyType: [],
    roommates: null,
    availability: []
  });

  // Suggestions de recherche populaires
  const popularSearches = [
    "Paris centre",
    "Lyon Presqu'île", 
    "Studio étudiant",
    "Appartement 2 pièces",
    "Colocation",
    "Proche métro"
  ];

  // Gérer la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onPerformSearch(searchValue);
    } else {
      onSearchClick();
    }
  };

  // Gérer les suggestions de recherche
  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    onPerformSearch(suggestion);
  };

  return (
    <div className={cn(
      "min-h-screen pb-20",
      isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-blue-900/20" 
        : "bg-white"
    )}>
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-50 backdrop-blur-xl border-b",
        isDark 
          ? "bg-dark-bg/80 border-white/10" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="p-4 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={cn(
                "text-2xl lg:text-3xl font-semibold flex items-center space-x-2 font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                <Zap className="w-6 h-6" />
                <span>Bonjour {firstName} !</span>
              </h1>
              <p className={cn(
                "text-sm mt-1 font-poppins",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                Trouvez votre prochain échange
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Favorites Button */}
              {likedProperties.length > 0 && (
                <button
                  onClick={onShowFavorites}
                  className={cn(
                    "relative p-2 rounded-full transition-all duration-300",
                    isDark 
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                      : "bg-red-50 text-red-500 hover:bg-red-100"
                  )}
                >
                  <Heart className="w-5 h-5 fill-current" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {likedProperties.length}
                  </div>
                </button>
              )}
              
              <button 
                onClick={onThemeToggle}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isDark 
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar - Style Airbnb avec suggestions */}
          <div className="relative max-w-2xl lg:max-w-4xl">
            <form onSubmit={handleSearch}>
              <div className={cn(
                "flex items-center p-4 rounded-full border shadow-sm transition-all duration-300",
                isDark 
                  ? "search-bar-dark hover:shadow-lg" 
                  : "search-bar hover:shadow-lg"
              )}>
                <Search className={cn(
                  "w-5 h-5 mr-3",
                  isDark ? "text-gray-400" : "text-gray-500"
                )} />
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Où voulez-vous habiter ?"
                  className={cn(
                    "flex-1 border-0 bg-transparent placeholder:text-gray-500 focus:ring-0 focus:outline-none text-base",
                    isDark ? "text-white placeholder:text-gray-400" : "text-gray-900"
                  )}
                />
                <div className={cn(
                  "flex items-center space-x-2 ml-2 pl-2 border-l",
                  isDark ? "border-gray-600" : "border-gray-300"
                )}>
                  <button
                    type="submit"
                    className={cn(
                      "text-sm font-medium px-3 py-1 rounded-full transition-colors",
                      isDark 
                        ? "text-neon-blue hover:bg-blue-500/20" 
                        : "text-blue-600 hover:bg-blue-50"
                    )}
                  >
                    Rechercher
                  </button>
                </div>
              </div>
            </form>

            {/* Suggestions de recherche */}
            {showSuggestions && (
              <Card className={cn(
                "absolute top-full left-0 right-0 mt-2 z-50 max-h-60 overflow-y-auto",
                isDark 
                  ? "bg-gray-800 border-gray-700" 
                  : "bg-white border-gray-200 shadow-lg"
              )}>
                <div className="p-4">
                  {/* Historique de recherche récent */}
                  {searchHistory.length > 0 && !searchValue && (
                    <div className="mb-4">
                      <h3 className={cn(
                        "text-sm font-medium mb-2",
                        isDark ? "text-gray-300" : "text-gray-700"
                      )}>
                        Recherches récentes
                      </h3>
                      <div className="space-y-1">
                        {searchHistory.slice(0, 3).map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(item)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2",
                              isDark 
                                ? "hover:bg-gray-700 text-gray-300" 
                                : "hover:bg-gray-50 text-gray-700"
                            )}
                          >
                            <Search className="w-4 h-4 opacity-50" />
                            <span>{item}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions populaires */}
                  {!searchValue && (
                    <div>
                      <h3 className={cn(
                        "text-sm font-medium mb-2",
                        isDark ? "text-gray-300" : "text-gray-700"
                      )}>
                        Suggestions populaires
                      </h3>
                      <div className="space-y-1">
                        {popularSearches.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(item)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2",
                              isDark 
                                ? "hover:bg-gray-700 text-gray-300" 
                                : "hover:bg-gray-50 text-gray-700"
                            )}
                          >
                            <TrendingUp className="w-4 h-4 opacity-50" />
                            <span>{item}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions filtrées pendant la saisie */}
                  {searchValue && (
                    <div>
                      <h3 className={cn(
                        "text-sm font-medium mb-2",
                        isDark ? "text-gray-300" : "text-gray-700"
                      )}>
                        Suggestions
                      </h3>
                      <div className="space-y-1">
                        {[...searchHistory, ...popularSearches]
                          .filter(item => 
                            item.toLowerCase().includes(searchValue.toLowerCase()) &&
                            item.toLowerCase() !== searchValue.toLowerCase()
                          )
                          .slice(0, 4)
                          .map((item, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(item)}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2",
                                isDark 
                                  ? "hover:bg-gray-700 text-gray-300" 
                                  : "hover:bg-gray-50 text-gray-700"
                              )}
                            >
                              <Search className="w-4 h-4 opacity-50" />
                              <span>{item}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Overlay pour fermer les suggestions */}
          {showSuggestions && (
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowSuggestions(false)}
            />
          )}
        </div>
      </div>

      <div className="p-4 lg:px-8 space-y-8">
        {/* Filters Section */}
        <section>
          <FiltersSection 
            isDark={isDark}
            onFiltersChange={setActiveFilters}
            className="mb-6"
          />
        </section>

        {/* Quick Categories */}
        <section>
          <h2 className={cn(
            "text-xl lg:text-2xl font-semibold mb-4 font-poppins",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Explorer par catégorie
          </h2>
          <CategoryCards 
            isDark={isDark}
            onCategoryClick={(categoryId) => setSelectedCategory(selectedCategory === categoryId ? null : categoryId)}
            selectedCategory={selectedCategory}
          />
        </section>

        {/* Featured Properties - Responsive Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={cn(
                "text-xl lg:text-2xl font-semibold font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Recommandations pour vous
              </h2>
              <p className={cn(
                "text-sm mt-1 font-poppins",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                {featuredProperties.length} logements sélectionnés pour vous
              </p>
            </div>
            <button className={cn(
              "text-sm font-medium underline",
              isDark 
                ? "text-neon-blue hover:text-blue-400" 
                : "text-blue-600 hover:text-blue-700"
            )}>
              Voir tout
            </button>
          </div>

          {/* Properties Grid - Responsive 1 col mobile, 4 cols desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {featuredProperties.map((property) => (
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
        </section>

        {/* Actions rapides - Nouveau style moderne */}
        <section>
          <h2 className={cn(
            "text-xl lg:text-2xl font-semibold mb-6 font-poppins",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Actions rapides
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Rechercher - Style violet moderne */}
            <button 
              onClick={onSearchClick}
              className={cn(
                "group relative overflow-hidden p-8 lg:p-10 rounded-2xl lg:rounded-3xl text-center space-y-4 lg:space-y-6 transition-all duration-300",
                "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500",
                "shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-purple-600 font-bold text-lg lg:text-xl font-poppins">1</span>
                  </div>
                </div>
                <h3 className="text-white font-semibold text-lg lg:text-xl font-poppins mb-2">Rechercher</h3>
                <p className="text-purple-100 text-sm lg:text-base font-poppins opacity-90">Parcourir les logements</p>
              </div>
            </button>

            {/* Mes matchs - Style bleu moderne */}
            <button 
              onClick={onShowMatches}
              className={cn(
                "group relative overflow-hidden p-8 lg:p-10 rounded-2xl lg:rounded-3xl text-center space-y-4 lg:space-y-6 transition-all duration-300",
                "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500",
                "shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-blue-600 font-bold text-lg lg:text-xl font-poppins">2</span>
                  </div>
                </div>
                <h3 className="text-white font-semibold text-lg lg:text-xl font-poppins mb-2">Mes matchs</h3>
                <p className="text-blue-100 text-sm lg:text-base font-poppins opacity-90">
                  {matchesCount > 0 ? `${matchesCount} compatibilité${matchesCount > 1 ? 's' : ''}` : "Propositions d'échange"}
                </p>
              </div>
            </button>

            {/* Mes favoris - Style vert moderne */}
            <button 
              onClick={onShowFavorites}
              className={cn(
                "group relative overflow-hidden p-8 lg:p-10 rounded-2xl lg:rounded-3xl text-center space-y-4 lg:space-y-6 transition-all duration-300",
                "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500",
                "shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-emerald-600 font-bold text-lg lg:text-xl font-poppins">3</span>
                  </div>
                  {likedProperties.length > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 lg:w-8 lg:h-8 bg-red-500 text-white text-xs lg:text-sm font-bold rounded-full flex items-center justify-center">
                      {likedProperties.length}
                    </div>
                  )}
                </div>
                <h3 className="text-white font-semibold text-lg lg:text-xl font-poppins mb-2">Mes favoris</h3>
                <p className="text-emerald-100 text-sm lg:text-base font-poppins opacity-90">
                  {likedProperties.length > 0 
                    ? `${likedProperties.length} sauvegardé${likedProperties.length > 1 ? 's' : ''}`
                    : "Logements sauvegardés"
                  }
                </p>
              </div>
            </button>

            {/* Publier - Style orange moderne */}
            <button 
              onClick={onAddProperty}
              className={cn(
                "group relative overflow-hidden p-8 lg:p-10 rounded-2xl lg:rounded-3xl text-center space-y-4 lg:space-y-6 transition-all duration-300",
                "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500",
                "shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                    <Plus className="w-6 h-6 lg:w-7 lg:h-7 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-white font-semibold text-lg lg:text-xl font-poppins mb-2">Publier</h3>
                <p className="text-orange-100 text-sm lg:text-base font-poppins opacity-90">Proposer mon logement</p>
              </div>
            </button>
          </div>
        </section>

        {/* Quick Stats - Desktop only */}
        <div className="hidden lg:block">
          <Card className={cn(
            "p-6 lg:p-8",
            isDark 
              ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-purple-900/30 border border-purple-500/30 backdrop-blur-xl"
              : "bg-white border border-gray-200 shadow-sm"
          )}>
            <h3 className={cn(
              "text-lg lg:text-xl font-semibold mb-6 font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              Votre activité
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={cn(
                  "text-2xl lg:text-3xl font-bold",
                  isDark ? "text-red-400" : "text-red-600"
                )}>
                  {likedProperties.length}
                </div>
                <div className={cn(
                  "text-xs lg:text-sm mt-1 font-poppins",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Favoris
                </div>
              </div>
              <div className="text-center">
                <div className={cn(
                  "text-2xl lg:text-3xl font-bold",
                  isDark ? "text-neon-cyan" : "text-green-600"
                )}>
                  3
                </div>
                <div className={cn(
                  "text-xs lg:text-sm mt-1 font-poppins",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Matchs actifs
                </div>
              </div>
              <div className="text-center">
                <div className={cn(
                  "text-2xl lg:text-3xl font-bold",
                  isDark ? "text-neon-magenta" : "text-purple-600"
                )}>
                  12
                </div>
                <div className={cn(
                  "text-xs lg:text-sm mt-1 font-poppins",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Vues profil
                </div>
              </div>
              <div className="text-center">
                <div className={cn(
                  "text-2xl lg:text-3xl font-bold",
                  isDark ? "text-neon-orange" : "text-orange-600"
                )}>
                  95%
                </div>
                <div className={cn(
                  "text-xs lg:text-sm mt-1 font-poppins",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Compatibilité
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}