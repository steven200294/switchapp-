import { useState, useEffect } from "react";
import { Search, MapPin, SlidersHorizontal, Heart, Star, Sun, Moon, TrendingUp, Calendar, Clock, X } from "lucide-react";
import { MobileHeader } from "./MobileHeader";
import { PropertyCard } from "./PropertyCard";
import { RealMapView } from "./RealMapView";
import { QuickActionButtons, CategoryCards } from "./QuickActionButtons";
import { FiltersSection, PropertyFilters } from "./FiltersSection";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";

interface SearchScreenProps {
  onPropertySelect: (propertyId: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  likedProperties: string[];
  onToggleLike: (propertyId: string) => void;
  onShowMatches: () => void;
  onSearchClick: (query?: string) => void;
  initialSearchQuery?: string;
  searchHistory?: string[];
  onClearSearchHistory?: () => void;
  matchesCount: number;
}

const allProperties = [
  // Appartements Paris
  {
    id: "search-1",
    title: "Appartement moderne centre-ville",
    location: "Paris 1er, Châtelet",
    price: "2200€",
    compatibilityScore: 92,
    lat: 48.8566,
    lng: 2.3477,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBwYXJpc3xlbnwxfHx8fDE3NTYyMDgyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Mars 2024",
    roommates: 0,
    maxRoommates: 1,
    tags: ["Centre-ville", "Métro proche", "Rénové", "Lumineux"],
    category: "available-now",
    city: "paris",
    owner: {
      name: "Claire Martin",
      avatar: "https://images.unsplash.com/photo-1745434159123-af6142c7862f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzU2MjE1Mzk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  },
  {
    id: "search-2",
    title: "Studio étudiant quartier Latin",
    location: "Paris 5ème, Panthéon",
    price: "1200€",
    compatibilityScore: 87,
    lat: 48.8462,
    lng: 2.3372,
    image: "https://images.unsplash.com/photo-1612419299101-6c294dc2901d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwcm9vbSUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NTYyMDgyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Avril 2024",
    roommates: 0,
    maxRoommates: 1,
    tags: ["Étudiant", "Université proche", "Meublé", "Calme"],
    category: "budget-friendly",
    city: "paris",
    owner: {
      name: "Pierre Leroy",
      avatar: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIxNTQwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  },
  {
    id: "search-3",
    title: "Colocation artistique Belleville",
    location: "Paris 20ème, Belleville",
    price: "1500€",
    compatibilityScore: 84,
    lat: 48.8720,
    lng: 2.3984,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMGxvZnQlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Mai 2024",
    roommates: 2,
    maxRoommates: 3,
    tags: ["Créatif", "Colocation", "Atelier", "Convivial"],
    category: "nearby",
    city: "paris",
    owner: {
      name: "Amélie Garnier",
      avatar: "https://images.unsplash.com/photo-1734092916915-d16146c0726c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU2MTc2MzMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  },
  
  // Appartements Lyon (10 nouveaux)
  {
    id: "lyon-1",
    title: "Appartement haussmannien Presqu'île",
    location: "Lyon 2ème, Presqu'île",
    price: "1800€",
    compatibilityScore: 95,
    lat: 45.7640,
    lng: 4.8357,
    image: "https://images.unsplash.com/photo-1666304789124-320713fb4005?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBwYXJpc3xlbnwxfHx8fDE3NTYyMDgyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Disponible maintenant",
    roommates: 0,
    maxRoommates: 1,
    tags: ["Haussmannien", "Centre historique", "Métro", "Commerces"],
    category: "available-now",
    city: "lyon",
    owner: {
      name: "Isabelle Rousseau",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIwODI0MXww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: "lyon-2",
    title: "Loft moderne Part-Dieu",
    location: "Lyon 3ème, Part-Dieu",
    price: "2100€",
    compatibilityScore: 88,
    lat: 45.7606,
    lng: 4.8626,
    image: "https://images.unsplash.com/photo-1732298286181-12bae2624d77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsb2Z0JTIwYXBhcnRtZW50JTIwZXVyb3BlYW58ZW58MXx8fHwxNzU2MjE0NTg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Mars 2024",
    roommates: 0,
    maxRoommates: 2,
    tags: ["Loft", "Moderne", "Business", "Transport"],
    category: "new",
    city: "lyon",
    owner: {
      name: "Marc Petit",
      avatar: "https://images.unsplash.com/photo-1543075270-17e1257ec612?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjB5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHNtaWxlfGVufDF8fHx8MTc1NjIxNTQyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  },
  {
    id: "lyon-3",
    title: "Studio cosy Vieux Lyon",
    location: "Lyon 5ème, Vieux Lyon",
    price: "1200€",
    compatibilityScore: 82,
    lat: 45.7608,
    lng: 4.8270,
    image: "https://images.unsplash.com/photo-1610123172763-1f587473048f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBhcGFydG1lbnQlMjBzdHVkaW8lMjBjb3p5fGVufDF8fHx8MTc1NjIxNDU4NHww&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Avril 2024",
    roommates: 0,
    maxRoommates: 1,
    tags: ["Historique", "Cosy", "UNESCO", "Authentique"],
    category: "budget-friendly",
    city: "lyon",
    owner: {
      name: "Julie Blanc",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NjIxNTI1N3ww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: "lyon-4",
    title: "Appartement familial Croix-Rousse",
    location: "Lyon 4ème, Croix-Rousse",
    price: "1900€",
    compatibilityScore: 90,
    lat: 45.7745,
    lng: 4.8319,
    image: "https://images.unsplash.com/photo-1691009154444-55e2f3d66d65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxseW9uJTIwYXBhcnRtZW50JTIwaW50ZXJpb3IlMjBmcmVuY2h8ZW58MXx8fHwxNzU2MjE0NTc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Mai 2024",
    roommates: 2,
    maxRoommates: 4,
    tags: ["Familial", "Terrasse", "Vue", "Calme"],
    category: "nearby",
    city: "lyon",
    owner: {
      name: "Nicolas Bernard",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMHNtaWxlfGVufDF8fHx8MTc1NjIxNTI2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: "lyon-5",  
    title: "T3 rénové Villeurbanne",
    location: "Villeurbanne, proche Lyon",
    price: "1400€",
    compatibilityScore: 85,
    lat: 45.7663,
    lng: 4.8795,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Disponible maintenant",
    roommates: 1,
    maxRoommates: 2,
    tags: ["Rénové", "Proche université", "Transport", "Moderne"],
    category: "available-now",
    city: "lyon",
    owner: {
      name: "Carla Morin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhY2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: "lyon-6",
    title: "Duplex moderne Confluence",  
    location: "Lyon 2ème, Confluence",
    price: "2300€",
    compatibilityScore: 93,
    lat: 45.7424,
    lng: 4.8183,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTc1NjIwODI0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Juin 2024",
    roommates: 0,
    maxRoommates: 2,
    tags: ["Duplex", "Moderne", "Quartier neuf", "Terrasse"],
    category: "new", 
    city: "lyon"
  },
  {
    id: "lyon-7",
    title: "Colocation étudiante Bron",
    location: "Bron, proche campus",
    price: "900€",
    compatibilityScore: 78,
    lat: 45.7361,
    lng: 4.9111,
    image: "https://images.unsplash.com/photo-1579926716139-2c80ed956d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjMyfDA&ixlib=rb-4.1.0&q=80&w=1080", 
    available: "Septembre 2024",
    roommates: 3,
    maxRoommates: 4,
    tags: ["Étudiant", "Colocation", "Proche fac", "Économique"],
    category: "budget-friendly",
    city: "lyon"
  },
  {
    id: "lyon-8",
    title: "Penthouse Bellecour",
    location: "Lyon 2ème, Bellecour", 
    price: "3200€",
    compatibilityScore: 89,
    lat: 45.7578,
    lng: 4.8320,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBwYXJpc3xlbnwxfHx8fDE3NTYyMDgyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Juillet 2024",
    roommates: 0,
    maxRoommates: 1,
    tags: ["Luxe", "Penthouse", "Centre", "Vue exceptionnelle"],
    category: "new",
    city: "lyon"
  },
  {
    id: "lyon-9",
    title: "Maison partagée Caluire",
    location: "Caluire, proche Lyon",
    price: "1100€",
    compatibilityScore: 86,
    lat: 45.7974,
    lng: 4.8506,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBwYXJpc3xlbnwxfHx8fDE3NTYyMDgyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Disponible maintenant", 
    roommates: 2,
    maxRoommates: 3,
    tags: ["Maison", "Jardin", "Calme", "Parking"],
    category: "available-now",
    city: "lyon"
  },
  {
    id: "lyon-10",
    title: "Studio design Guillotière",
    location: "Lyon 7ème, Guillotière",
    price: "1350€",
    compatibilityScore: 81,
    lat: 45.7539,
    lng: 4.8433,
    image: "https://images.unsplash.com/photo-1612419299101-6c294dc2901d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwcm9vbSUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NTYyMDgyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: "Août 2024",
    roommates: 0,
    maxRoommates: 1,
    tags: ["Design", "Multiculturel", "Restaurants", "Animé"],
    category: "nearby",
    city: "lyon"
  }
];

const quickCategories = [
  {
    id: "new",
    title: "Nouveautés",
    subtitle: "Derniers ajouts",
    icon: TrendingUp,
    gradient: "from-blue-500 to-blue-600",
    count: 0
  },
  {
    id: "nearby",
    title: "À proximité", 
    subtitle: "Dans votre secteur",
    icon: MapPin,
    gradient: "from-green-500 to-green-600",
    count: 0
  },
  {
    id: "available-now",
    title: "Disponible maintenant",
    subtitle: "Emménagement rapide",
    icon: Calendar,
    gradient: "from-orange-500 to-orange-600",
    count: 0
  }
];

const quickFilters = [
  { label: "Disponible maintenant", active: false },
  { label: "< 1500€", active: true },
  { label: "Centre Paris", active: false },
  { label: "Meublé", active: false },
  { label: "Parking", active: false }
];

export function SearchScreen({ onPropertySelect, isDark, onThemeToggle, likedProperties, onToggleLike, onShowMatches, onSearchClick, initialSearchQuery = "", searchHistory = [], onClearSearchHistory, matchesCount }: SearchScreenProps) {
  const [searchValue, setSearchValue] = useState(initialSearchQuery);
  const [activeFilters, setActiveFilters] = useState(quickFilters);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [detailedFilters, setDetailedFilters] = useState<PropertyFilters>({
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
    "Proche métro",
    "Belleville",
    "Montparnasse"
  ];

  // Mettre à jour la recherche quand initialSearchQuery change
  useEffect(() => {
    if (initialSearchQuery && initialSearchQuery !== searchValue) {
      setSearchValue(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Filtrer les propriétés selon la recherche et les filtres
  const getFilteredProperties = () => {
    let filtered = [...allProperties];
    
    // Filtre par texte de recherche
    if (searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase();
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.city.toLowerCase().includes(searchTerm) ||
        property.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filtre par catégorie sélectionnée
    if (selectedCategory) {
      filtered = filtered.filter(property => property.category === selectedCategory);
    }
    
    // Filtres rapides actifs
    activeFilters.forEach(filter => {
      if (!filter.active) return;
      
      if (filter.label === "Disponible maintenant") {
        filtered = filtered.filter(p => p.available === "Disponible maintenant");
      } else if (filter.label === "< 1500€") {
        filtered = filtered.filter(p => parseInt(p.price.replace(/\D/g, "")) < 1500);
      } else if (filter.label === "Centre Paris") {
        filtered = filtered.filter(p => p.city === "paris" && p.location.includes("1er"));
      } else if (filter.label === "Meublé") {
        filtered = filtered.filter(p => p.tags.includes("Meublé"));
      } else if (filter.label === "Parking") {
        filtered = filtered.filter(p => p.tags.includes("Parking"));
      }
    });
    
    return filtered;
  };

  const filteredProperties = getFilteredProperties();

  // Calculer les compteurs des catégories
  const categoriesWithCounts = quickCategories.map(category => ({
    ...category,
    count: allProperties.filter(p => p.category === category.id).length
  }));

  const toggleFilter = (index: number) => {
    setActiveFilters(prev => prev.map((filter, i) => 
      i === index ? { ...filter, active: !filter.active } : filter
    ));
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleMyMatchesClick = () => {
    onShowMatches();
  };

  // Gérer la sélection d'une suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    // Optionnel : déclencher automatiquement la recherche
  };

  // Gérer la recherche
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearchClick(searchValue);
      setShowSuggestions(false);
    }
  };

  // Effacer la recherche
  const handleClearSearch = () => {
    setSearchValue("");
    setShowSuggestions(false);
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
                "text-2xl lg:text-3xl font-semibold font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                {isDark ? (
                  <span className="bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-blue bg-clip-text text-transparent">
                    Explorer
                  </span>
                ) : (
                  "Explorer"
                )}
              </h1>
              <p className={cn(
                "text-sm mt-1 font-poppins", 
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                {filteredProperties.length} logements{searchValue && ` pour "${searchValue}"`}
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

          {/* Search Bar */}
          <div className="space-y-3">
            <div className="relative max-w-2xl lg:max-w-4xl">
              <form onSubmit={handleSearchSubmit}>
                <div className={cn(
                  "flex items-center p-3 lg:p-4 rounded-xl border transition-all duration-300",
                  isDark 
                    ? "bg-gray-800 border-gray-700 hover:border-gray-600" 
                    : "bg-white border-gray-300 hover:border-gray-400 shadow-sm"
                )}>
                  <Search className={cn(
                    "w-5 h-5 mr-3",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )} />
                  <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Quartier, ville, adresse (ex: Lyon, Paris, Belleville...)"
                    className={cn(
                      "flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none text-base font-poppins",
                      isDark 
                        ? "text-white placeholder:text-gray-400" 
                        : "text-gray-900 placeholder:text-gray-500"
                    )}
                  />
                  {searchValue && (
                    <button 
                      type="button"
                      onClick={handleClearSearch}
                      className={cn(
                        "p-1 rounded-full transition-all duration-200 mr-2",
                        isDark 
                          ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    type="button"
                    className={cn(
                      "p-2 rounded-lg transition-all duration-300",
                      isDark 
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Suggestions de recherche */}
              {showSuggestions && (searchValue || searchHistory.length > 0) && (
                <Card className={cn(
                  "absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto",
                  isDark 
                    ? "bg-gray-800 border-gray-700" 
                    : "bg-white border-gray-200 shadow-lg"
                )}>
                  <div className="p-4">
                    {/* Historique de recherche */}
                    {searchHistory.length > 0 && !searchValue && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={cn(
                            "text-sm font-medium",
                            isDark ? "text-gray-300" : "text-gray-700"
                          )}>
                            Recherches récentes
                          </h3>
                          {onClearSearchHistory && (
                            <button
                              onClick={onClearSearchHistory}
                              className={cn(
                                "text-xs underline",
                                isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-600"
                              )}
                            >
                              Effacer
                            </button>
                          )}
                        </div>
                        <div className="space-y-1">
                          {searchHistory.slice(0, 5).map((item, index) => (
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
                              <Clock className="w-4 h-4 opacity-50" />
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
                          Recherches populaires
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

                    {/* Suggestions filtrées */}
                    {searchValue && (
                      <div>
                        <h3 className={cn(
                          "text-sm font-medium mb-2",
                          isDark ? "text-gray-300" : "text-gray-700"
                        )}>
                          Suggestions
                        </h3>
                        <div className="space-y-1">
                          {popularSearches
                            .filter(item => 
                              item.toLowerCase().includes(searchValue.toLowerCase())
                            )
                            .slice(0, 3)
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

            {/* Quick Filters - Sans scroll horizontal */}
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <button
                  key={index}
                  onClick={() => toggleFilter(index)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 font-poppins",
                    filter.active
                      ? isDark
                        ? "bg-neon-blue text-black font-semibold shadow-lg"
                        : "bg-blue-600 text-white"
                      : isDark
                        ? "bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay pour fermer les suggestions */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}

      <div className="p-4 lg:px-8 space-y-8">
        {/* Filters Section */}
        <section>
          <FiltersSection 
            isDark={isDark}
            onFiltersChange={setDetailedFilters}
            className="mb-6"
          />
        </section>

        {/* Map View avec RealMapView */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn(
              "text-xl lg:text-2xl font-semibold font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              Logements sur la carte
            </h2>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "text-sm underline font-poppins",
                  isDark 
                    ? "text-neon-cyan hover:text-cyan-400" 
                    : "text-blue-600 hover:text-blue-700"
                )}
              >
                Voir tout
              </button>
            )}
          </div>
          <RealMapView 
            properties={filteredProperties}
            isDark={isDark}
            onPropertySelect={onPropertySelect}
            selectedCategory={selectedCategory}
            likedProperties={likedProperties}
            onToggleLike={onToggleLike}
          />
        </section>

        {/* Quick Categories - Cliquables */}
        <section>
          <h2 className={cn(
            "text-xl lg:text-2xl font-semibold mb-4 font-poppins",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Explorer par catégorie
          </h2>
          <CategoryCards 
            isDark={isDark}
            onCategoryClick={handleCategoryClick}
            selectedCategory={selectedCategory}
          />
        </section>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className={cn(
              "w-5 h-5",
              isDark ? "text-neon-cyan" : "text-blue-600"
            )} />
            <span className={cn(
              "font-medium font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {selectedCategory 
                ? `Catégorie : ${categoriesWithCounts.find(c => c.id === selectedCategory)?.title}`
                : searchValue 
                  ? `Résultats pour "${searchValue}"`
                  : "Tous les résultats"
              }
            </span>
          </div>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "text-sm underline font-poppins",
                isDark 
                  ? "text-neon-cyan hover:text-cyan-400" 
                  : "text-blue-600 hover:text-blue-700"
              )}
            >
              Voir tout
            </button>
          )}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredProperties.map((property) => (
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

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <Card className={cn(
            "text-center py-16 px-6",
            isDark 
              ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10" 
              : "bg-white shadow-sm border border-gray-200"
          )}>
            <Search className={cn(
              "w-16 h-16 mx-auto mb-4",
              isDark ? "text-gray-600" : "text-gray-400"
            )} />
            <h3 className={cn(
              "text-xl font-semibold mb-2 font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              Aucun résultat trouvé
            </h3>
            <p className={cn(
              "text-center max-w-md mx-auto font-poppins",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              {searchValue 
                ? `Aucun logement ne correspond à "${searchValue}". Essayez avec d'autres mots-clés.`
                : "Aucun logement ne correspond à vos critères. Modifiez vos filtres."
              }
            </p>
            <button
              onClick={() => {
                setSearchValue("");
                setSelectedCategory(null);
                setActiveFilters(quickFilters.map(f => ({ ...f, active: false })));
              }}
              className={cn(
                "mt-4 px-6 py-2 rounded-xl font-medium transition-all duration-300 font-poppins",
                isDark
                  ? "bg-gradient-to-r from-neon-blue to-neon-cyan text-white hover:from-neon-cyan hover:to-neon-blue"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
              )}
            >
              Réinitialiser les filtres
            </button>
          </Card>
        )}

        {/* Load More */}
        {filteredProperties.length > 0 && (
          <div className="text-center">
            <button className={cn(
              "px-8 py-4 rounded-xl font-medium transition-all duration-300 text-base font-poppins",
              isDark
                ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-600 hover:border-gray-500 hover:from-gray-700 hover:to-gray-600"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
            )}>
              Charger plus de résultats
            </button>
          </div>
        )}
      </div>
    </div>
  );
}