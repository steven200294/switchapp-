import { useState } from "react";
import { SlidersHorizontal, MapPin, Euro, Home, Users, Calendar, X } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { cn } from "./ui/utils";

interface FiltersSectionProps {
  isDark: boolean;
  onFiltersChange: (filters: PropertyFilters) => void;
  className?: string;
}

export interface PropertyFilters {
  priceRange: [number, number];
  location: string[];
  propertyType: string[];
  roommates: number | null;
  availability: string[];
}

const defaultFilters: PropertyFilters = {
  priceRange: [500, 4000],
  location: [],
  propertyType: [],
  roommates: null,
  availability: []
};

const locationOptions = [
  { id: "paris-center", label: "Paris Centre (1-4ème)", count: 12 },
  { id: "paris-west", label: "Paris Ouest (7,8,16,17ème)", count: 8 },
  { id: "paris-east", label: "Paris Est (11,12,20ème)", count: 15 },
  { id: "paris-north", label: "Paris Nord (9,10,18,19ème)", count: 10 },
  { id: "paris-south", label: "Paris Sud (13,14,15ème)", count: 7 },
  { id: "proche-banlieue", label: "Proche banlieue", count: 5 }
];

const propertyTypeOptions = [
  { id: "studio", label: "Studio", icon: Home, count: 18 },
  { id: "t2", label: "T2", icon: Home, count: 24 },
  { id: "t3", label: "T3", icon: Home, count: 16 },
  { id: "t4-plus", label: "T4+", icon: Home, count: 9 },
  { id: "loft", label: "Loft", icon: Home, count: 4 },
  { id: "maison", label: "Maison", icon: Home, count: 6 }
];

const availabilityOptions = [
  { id: "immediate", label: "Immédiat", count: 12 },
  { id: "march", label: "Mars 2024", count: 8 },
  { id: "april", label: "Avril 2024", count: 10 },
  { id: "may", label: "Mai 2024", count: 6 },
  { id: "june", label: "Juin 2024", count: 4 }
];

const roommatesOptions = [
  { value: 0, label: "Seul(e)" },
  { value: 1, label: "1 colocataire" },
  { value: 2, label: "2 colocataires" },
  { value: 3, label: "3+ colocataires" }
];

export function FiltersSection({ isDark, onFiltersChange, className }: FiltersSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
    
    // Count active filters
    let count = 0;
    if (updated.priceRange[0] !== 500 || updated.priceRange[1] !== 4000) count++;
    if (updated.location.length > 0) count++;
    if (updated.propertyType.length > 0) count++;
    if (updated.roommates !== null) count++;
    if (updated.availability.length > 0) count++;
    setActiveFiltersCount(count);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setActiveFiltersCount(0);
    onFiltersChange(defaultFilters);
  };

  const toggleArrayFilter = (key: 'location' | 'propertyType' | 'availability', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters({ [key]: newArray });
  };

  return (
    <div className={className}>
      {/* Filters Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn(
          "text-lg font-semibold font-poppins",
          isDark ? "text-white" : "text-gray-900"
        )}>
          Filtres
        </h3>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Badge className={cn(
              "text-xs font-poppins",
              isDark 
                ? "bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                : "bg-blue-50 text-blue-600 border-blue-200"
            )}>
              {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          )}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            size="sm"
            className={cn(
              "gap-2 font-poppins",
              isDark 
                ? "border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {isExpanded ? "Masquer" : "Afficher"}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {isExpanded && (
        <Card className={cn(
          "p-4 space-y-6 transition-all duration-300 animate-in slide-in-from-top-2",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-purple-900/30 border border-purple-500/30 backdrop-blur-xl"
            : "bg-white border border-gray-200 shadow-sm"
        )}>
          {/* Quick Clear */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <span className={cn(
                "text-sm font-poppins",
                isDark ? "text-gray-300" : "text-gray-600"
              )}>
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
              </span>
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs gap-1 font-poppins",
                  isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <X className="w-3 h-3" />
                Effacer tout
              </Button>
            </div>
          )}

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Euro className={cn(
                "w-4 h-4",
                isDark ? "text-neon-orange" : "text-orange-600"
              )} />
              <label className={cn(
                "text-sm font-medium font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Loyer mensuel
              </label>
            </div>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                max={4000}
                min={500}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500 font-poppins">
                <span>{filters.priceRange[0]}€</span>
                <span>{filters.priceRange[1]}€</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className={cn(
                "w-4 h-4",
                isDark ? "text-neon-cyan" : "text-blue-600"
              )} />
              <label className={cn(
                "text-sm font-medium font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Localisation
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {locationOptions.map((location) => (
                <button
                  key={location.id}
                  onClick={() => toggleArrayFilter('location', location.id)}
                  className={cn(
                    "p-2 rounded-lg border text-left transition-all duration-200 text-xs font-poppins",
                    filters.location.includes(location.id)
                      ? (isDark 
                          ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                          : "bg-blue-50 border-blue-500 text-blue-700")
                      : (isDark 
                          ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300")
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span>{location.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {location.count}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Home className={cn(
                "w-4 h-4",
                isDark ? "text-neon-purple" : "text-purple-600"
              )} />
              <label className={cn(
                "text-sm font-medium font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Type de logement
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {propertyTypeOptions.map((type) => (
                <button
                  key={type.id}
                  onClick={() => toggleArrayFilter('propertyType', type.id)}
                  className={cn(
                    "p-2 rounded-lg border text-center transition-all duration-200 text-xs font-poppins",
                    filters.propertyType.includes(type.id)
                      ? (isDark 
                          ? "bg-neon-purple/20 border-neon-purple text-neon-purple"
                          : "bg-purple-50 border-purple-500 text-purple-700")
                      : (isDark 
                          ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300")
                  )}
                >
                  <div className="space-y-1">
                    <div>{type.label}</div>
                    <Badge variant="secondary" className="text-xs">
                      {type.count}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Roommates */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Users className={cn(
                "w-4 h-4",
                isDark ? "text-neon-magenta" : "text-pink-600"
              )} />
              <label className={cn(
                "text-sm font-medium font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Colocation
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {roommatesOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilters({ 
                    roommates: filters.roommates === option.value ? null : option.value 
                  })}
                  className={cn(
                    "p-2 rounded-lg border text-center transition-all duration-200 text-xs font-poppins",
                    filters.roommates === option.value
                      ? (isDark 
                          ? "bg-neon-magenta/20 border-neon-magenta text-neon-magenta"
                          : "bg-pink-50 border-pink-500 text-pink-700")
                      : (isDark 
                          ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300")
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className={cn(
                "w-4 h-4",
                isDark ? "text-neon-orange" : "text-orange-600"
              )} />
              <label className={cn(
                "text-sm font-medium font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Disponibilité
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availabilityOptions.map((availability) => (
                <button
                  key={availability.id}
                  onClick={() => toggleArrayFilter('availability', availability.id)}
                  className={cn(
                    "p-2 rounded-lg border text-center transition-all duration-200 text-xs font-poppins",
                    filters.availability.includes(availability.id)
                      ? (isDark 
                          ? "bg-neon-orange/20 border-neon-orange text-neon-orange"
                          : "bg-orange-50 border-orange-500 text-orange-700")
                      : (isDark 
                          ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300")
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span>{availability.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {availability.count}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}