import { useState } from "react";
import { MapPin, Home, Zap, Calendar, TrendingUp, Eye, Heart } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  owner: {
    name: string;
    avatar: string;
  };
  category: string;
  coordinates: { lat: number; lng: number };
  compatibilityScore?: number;
}

interface MapViewProps {
  properties: Property[];
  isDark: boolean;
  onPropertySelect: (propertyId: string) => void;
  selectedCategory?: string | null;
  likedProperties: string[];
  onToggleLike: (propertyId: string) => void;
}

// Propriétés avec coordonnées Paris
const parisProperties: Property[] = [
  {
    id: "map-1",
    title: "Appartement Trocadéro",
    location: "Paris 16ème",
    price: "2800€",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBwYXJpc3xlbnwxfHx8fDE3NTYyMDgyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: {
      name: "Marie Dubois",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIwODI0MXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    category: "new",
    coordinates: { lat: 48.8634, lng: 2.2877 },
    compatibilityScore: 95
  },
  {
    id: "map-2", 
    title: "Studio République",
    location: "Paris 11ème",
    price: "1400€",
    image: "https://images.unsplash.com/photo-1612419299101-6c294dc2901d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwcm9vbSUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NTYyMDgyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: {
      name: "Thomas Martin",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    category: "nearby",
    coordinates: { lat: 48.8656, lng: 2.3667 },
    compatibilityScore: 88
  },
  {
    id: "map-3",
    title: "T3 Montmartre",
    location: "Paris 18ème", 
    price: "1900€",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: {
      name: "Sophie Laurent",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhY2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    category: "available-now",
    coordinates: { lat: 48.8862, lng: 2.3439 },
    compatibilityScore: 82
  },
  {
    id: "map-4",
    title: "Loft Marais",
    location: "Paris 4ème",
    price: "2200€", 
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMGxvZnQlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU2MjA4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: {
      name: "Lucas Moreau",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTYyMDgyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    category: "new",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    compatibilityScore: 91
  },
  {
    id: "map-5",
    title: "Penthouse Invalides",
    location: "Paris 7ème",
    price: "3500€",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBwYXJpc3xlbnwxfHx8fDE3NTYyMDgyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: {
      name: "Camille Roux",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NjIxNTI1N3ww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    category: "available-now",
    coordinates: { lat: 48.8566, lng: 2.3122 },
    compatibilityScore: 96
  },
  {
    id: "map-6",
    title: "Studio Châtelet",
    location: "Paris 1er",
    price: "1600€",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTc1NjIwODI0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    owner: {
      name: "Antoine Dubois",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMHNtaWxlfGVufDF8fHx8MTc1NjIxNTI2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    category: "nearby", 
    coordinates: { lat: 48.8584, lng: 2.3470 },
    compatibilityScore: 79
  }
];

// Noms de rues Paris pour affichage réaliste
const parisStreets = [
  { name: "Av. des Champs-Élysées", x: 30, y: 35, rotation: 45 },
  { name: "Rue de Rivoli", x: 45, y: 60, rotation: 0 },
  { name: "Bd Saint-Germain", x: 40, y: 70, rotation: 10 },
  { name: "Rue de la République", x: 60, y: 45, rotation: 80 },
  { name: "Av. de l'Opéra", x: 50, y: 50, rotation: 30 },
  { name: "Bd du Montparnasse", x: 35, y: 85, rotation: 0 },
  { name: "Rue du Faubourg Saint-Antoine", x: 75, y: 55, rotation: 15 },
  { name: "Av. de la Grande Armée", x: 20, y: 25, rotation: 45 },
];

export function MapView({ isDark, onPropertySelect, selectedCategory, likedProperties, onToggleLike }: MapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Filtrer les propriétés selon la catégorie sélectionnée
  const filteredProperties = selectedCategory 
    ? parisProperties.filter(p => p.category === selectedCategory)
    : parisProperties;

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handlePropertyView = (propertyId: string) => {
    onPropertySelect(propertyId);
    setSelectedProperty(null);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.3, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.3, 0.8));
  };

  return (
    <div className="relative w-full h-96 lg:h-[500px] rounded-xl overflow-hidden">
      {/* Map Background - Style réaliste */}
      <div 
        className={cn(
          "absolute inset-0 transition-all duration-500",
          isDark 
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900" 
            : "bg-gradient-to-br from-green-50 via-blue-50 to-green-100"
        )}
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
      >
        {/* Parcs et espaces verts */}
        <div className={cn(
          "absolute rounded-lg opacity-60",
          isDark ? "bg-green-800" : "bg-green-200"
        )} style={{ top: '20%', left: '15%', width: '12%', height: '8%' }} />
        <div className={cn(
          "absolute rounded-lg opacity-60",
          isDark ? "bg-green-800" : "bg-green-200"
        )} style={{ top: '45%', left: '70%', width: '15%', height: '12%' }} />
        
        {/* Seine River */}
        <div 
          className={cn(
            "absolute rounded-full opacity-70",
            isDark ? "bg-blue-700" : "bg-blue-300"
          )}
          style={{ 
            top: '45%', 
            left: '20%', 
            width: '60%', 
            height: '3px',
            transform: 'rotate(-15deg)',
            boxShadow: isDark ? '0 0 10px rgba(59, 130, 246, 0.5)' : '0 0 5px rgba(59, 130, 246, 0.3)'
          }} 
        />
        
        {/* Îles */}
        <div className={cn(
          "absolute rounded-full opacity-80",
          isDark ? "bg-gray-700" : "bg-yellow-100"
        )} style={{ top: '48%', left: '48%', width: '4%', height: '2%' }} />
        
        {/* Street grid - Plus détaillé */}
        <div className="absolute inset-0 opacity-30">
          {/* Rues principales horizontales */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`h-${i}`} className={cn(
              "absolute w-full h-px",
              isDark ? "bg-gray-600" : "bg-gray-400"
            )} style={{ 
              top: `${(i + 1) * 8}%`,
              left: `${Math.sin(i * 0.5) * 2}%`,
              width: `${95 + Math.cos(i * 0.3) * 10}%`
            }} />
          ))}
          
          {/* Rues principales verticales */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={`v-${i}`} className={cn(
              "absolute h-full w-px",
              isDark ? "bg-gray-600" : "bg-gray-400"
            )} style={{ 
              left: `${(i + 1) * 6.5}%`,
              top: `${Math.cos(i * 0.4) * 3}%`,
              height: `${90 + Math.sin(i * 0.2) * 15}%`
            }} />
          ))}
          
          {/* Boulevards - Plus épais */}
          <div className={cn(
            "absolute h-full",
            isDark ? "bg-gray-500" : "bg-gray-500"
          )} style={{ 
            left: '50%',
            width: '2px',
            opacity: 0.4,
            transform: 'rotate(5deg)',
            transformOrigin: 'center'
          }} />
        </div>

        {/* Noms de rues */}
        {parisStreets.map((street, index) => (
          <div
            key={index}
            className={cn(
              "absolute text-xs font-medium pointer-events-none transition-opacity duration-300",
              isDark ? "text-gray-400" : "text-gray-600",
              zoomLevel > 1.2 ? "opacity-100" : "opacity-60"
            )}
            style={{
              left: `${street.x}%`,
              top: `${street.y}%`,
              transform: `rotate(${street.rotation}deg)`,
              fontSize: `${0.7 * zoomLevel}rem`,
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            {street.name}
          </div>
        ))}

        {/* Monuments emblématiques */}
        <div className={cn(
          "absolute w-2 h-2 rounded-full",
          isDark ? "bg-yellow-400" : "bg-yellow-600"
        )} style={{ top: '35%', left: '30%' }} title="Tour Eiffel" />
        
        <div className={cn(
          "absolute w-2 h-2 rounded-full",
          isDark ? "bg-gray-300" : "bg-gray-700"
        )} style={{ top: '50%', left: '48%' }} title="Notre-Dame" />
        
        <div className={cn(
          "absolute w-2 h-2 rounded-full",
          isDark ? "bg-purple-400" : "bg-purple-600"
        )} style={{ top: '25%', left: '45%' }} title="Arc de Triomphe" />

        {/* Property Markers */}
        {filteredProperties.map((property) => {
          const isHovered = hoveredProperty === property.id;
          const isSelected = selectedProperty?.id === property.id;
          const isLiked = likedProperties.includes(property.id);
          
          return (
            <button
              key={property.id}
              className={cn(
                "absolute transition-all duration-300 group z-10",
                isSelected || isHovered ? "z-20" : "z-10"
              )}
              style={{
                left: `${((property.coordinates.lng - 2.2) / 0.3) * 100}%`,
                top: `${((48.9 - property.coordinates.lat) / 0.1) * 100}%`,
                transform: "translate(-50%, -50%)"
              }}
              onClick={() => handleMarkerClick(property)}
              onMouseEnter={() => setHoveredProperty(property.id)}
              onMouseLeave={() => setHoveredProperty(null)}
            >
              {/* Pin Shadow */}
              <div className={cn(
                "absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-2 rounded-full opacity-30 transition-all duration-300",
                isDark ? "bg-black" : "bg-gray-600",
                isSelected || isHovered ? "scale-150" : "scale-100"
              )} />
              
              {/* Pin */}
              <div className={cn(
                "relative w-8 h-8 rounded-full border-2 transition-all duration-300 shadow-lg",
                isSelected || isHovered ? "scale-125" : "scale-100",
                isLiked
                  ? "bg-red-500 border-red-400 shadow-red-500/50"
                  : property.category === "new"
                  ? isDark ? "bg-neon-blue border-blue-400 shadow-blue-500/50" : "bg-blue-500 border-blue-400 shadow-blue-500/30"
                  : property.category === "available-now"
                  ? isDark ? "bg-neon-orange border-orange-400 shadow-orange-500/50" : "bg-orange-500 border-orange-400 shadow-orange-500/30" 
                  : isDark ? "bg-neon-cyan border-cyan-400 shadow-cyan-500/50" : "bg-green-500 border-green-400 shadow-green-500/30"
              )}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {isLiked ? (
                    <Heart className="w-4 h-4 text-white fill-current" />
                  ) : (
                    <Home className="w-4 h-4 text-white" />
                  )}
                </div>
                
                {/* Price badge */}
                <div className={cn(
                  "absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-300 font-poppins",
                  isSelected || isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90",
                  isDark 
                    ? "bg-dark-secondary border border-white/20 text-white shadow-lg" 
                    : "bg-white border border-gray-200 text-gray-900 shadow-md"
                )}>
                  {property.price}
                </div>
              </div>
            </button>
          );
        })}

        {/* Zones d'arrondissements - Labels */}
        <div className={cn(
          "absolute text-sm font-semibold pointer-events-none opacity-40",
          isDark ? "text-gray-500" : "text-gray-600"
        )} style={{ top: '15%', left: '25%' }}>
          16ème
        </div>
        <div className={cn(
          "absolute text-sm font-semibold pointer-events-none opacity-40",
          isDark ? "text-gray-500" : "text-gray-600"
        )} style={{ top: '40%', left: '70%' }}>
          11ème
        </div>
        <div className={cn(
          "absolute text-sm font-semibold pointer-events-none opacity-40",
          isDark ? "text-gray-500" : "text-gray-600"
        )} style={{ top: '20%', left: '70%' }}>
          18ème
        </div>
      </div>

      {/* Legend */}
      <div className={cn(
        "absolute bottom-4 left-4 p-3 rounded-lg backdrop-blur-md border transition-all duration-300",
        isDark 
          ? "bg-dark-secondary/80 border-white/20 text-white"
          : "bg-white/90 border-gray-200 text-gray-900"
      )}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs font-medium font-poppins">Nouveautés ({parisProperties.filter(p => p.category === 'new').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs font-medium font-poppins">À proximité ({parisProperties.filter(p => p.category === 'nearby').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xs font-medium font-poppins">Disponible ({parisProperties.filter(p => p.category === 'available-now').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs font-medium font-poppins">Favoris ({likedProperties.length})</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button 
          onClick={handleZoomIn}
          className={cn(
            "w-10 h-10 rounded-lg backdrop-blur-md border transition-all duration-300 flex items-center justify-center",
            isDark 
              ? "bg-dark-secondary/80 border-white/20 text-white hover:bg-dark-secondary"
              : "bg-white/90 border-gray-200 text-gray-900 hover:bg-white"
          )}
        >
          <span className="text-lg font-bold">+</span>
        </button>
        <button 
          onClick={handleZoomOut}
          className={cn(
            "w-10 h-10 rounded-lg backdrop-blur-md border transition-all duration-300 flex items-center justify-center",
            isDark 
              ? "bg-dark-secondary/80 border-white/20 text-white hover:bg-dark-secondary"
              : "bg-white/90 border-gray-200 text-gray-900 hover:bg-white"
          )}
        >
          <span className="text-lg font-bold">-</span>
        </button>
      </div>

      {/* Property Details Popup */}
      {selectedProperty && (
        <div className="absolute bottom-4 right-4 w-80 z-30">
          <Card className={cn(
            "overflow-hidden backdrop-blur-xl border transition-all duration-300 animate-in slide-in-from-bottom-4",
            isDark 
              ? "bg-dark-secondary/90 border-white/20" 
              : "bg-white/95 border-gray-200 shadow-xl"
          )}>
            <div className="relative">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => onToggleLike(selectedProperty.id)}
                className={cn(
                  "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  likedProperties.includes(selectedProperty.id)
                    ? "bg-red-500 text-white"
                    : isDark 
                    ? "bg-black/50 text-white hover:bg-red-500"
                    : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
                )}
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className={cn(
                    "font-semibold font-poppins",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {selectedProperty.title}
                  </h3>
                  <div className="flex items-center space-x-1 mt-1">
                    <MapPin className={cn(
                      "w-3 h-3",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )} />
                    <span className={cn(
                      "text-xs font-poppins",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      {selectedProperty.location}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "font-semibold font-poppins",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {selectedProperty.price}
                  </div>
                  <div className={cn(
                    "text-xs font-poppins",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}>
                    /mois
                  </div>
                </div>
              </div>

              {/* Owner */}
              <div className="flex items-center space-x-2 mb-3">
                <img
                  src={selectedProperty.owner.avatar}
                  alt={selectedProperty.owner.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className={cn(
                  "text-sm font-medium font-poppins",
                  isDark ? "text-gray-300" : "text-gray-600"
                )}>
                  {selectedProperty.owner.name}
                </span>
                {selectedProperty.compatibilityScore && (
                  <Badge className={cn(
                    "ml-auto text-xs font-poppins",
                    isDark 
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : "bg-green-50 text-green-600 border-green-200"
                  )}>
                    {selectedProperty.compatibilityScore}% compatibilité
                  </Badge>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handlePropertyView(selectedProperty.id)}
                  className={cn(
                    "flex-1 text-sm font-medium font-poppins",
                    isDark
                      ? "bg-gradient-to-r from-neon-blue to-neon-cyan text-black hover:from-neon-cyan hover:to-neon-blue"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  )}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Voir
                </Button>
                <Button
                  onClick={() => setSelectedProperty(null)}
                  variant="outline"
                  className={cn(
                    "px-4 font-poppins",
                    isDark 
                      ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  ✕
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}