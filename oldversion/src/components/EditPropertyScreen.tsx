import { useState } from "react";
import { ArrowLeft, MapPin, Home, Ruler, Users, Euro, Calendar, Wifi, Car, Zap, Camera, Save, X } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface EditPropertyScreenProps {
  isDark: boolean;
  onBack: () => void;
  onSave: (propertyData: any) => void;
  onThemeToggle: () => void;
  onShowMatches: () => void;
  matchesCount: number;
}

// Données du logement actuel (normalement récupérées depuis l'API)
const initialPropertyData = {
  title: "Appartement moderne Bastille",
  description: "Magnifique appartement de 75m² situé au cœur du 11ème arrondissement, proche de la Place de la Bastille. Entièrement rénové avec goût, il offre tout le confort moderne.",
  address: "15 Rue de la Roquette, 75011 Paris",
  surface: "75",
  rooms: "3",
  rent: "1850",
  charges: "150",
  deposit: "1850",
  availability: "2024-03-15",
  minDuration: "6",
  maxDuration: "12",
  furnished: true,
  amenities: ["wifi", "dishwasher", "washing_machine", "parking", "elevator", "balcony"],
  photos: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1NjIwODMwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwZGVzaWdufGVufDF8fHx8MTc1NjIwODMxNHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc1NjIwODMxOHww&ixlib=rb-4.1.0&q=80&w=1080"
  ]
};

const availableAmenities = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "dishwasher", label: "Lave-vaisselle", icon: Home },
  { id: "washing_machine", label: "Lave-linge", icon: Home },
  { id: "parking", label: "Parking", icon: Car },
  { id: "elevator", label: "Ascenseur", icon: Home },
  { id: "balcony", label: "Balcon", icon: Home }
];

export function EditPropertyScreen({ 
  isDark, 
  onBack, 
  onSave, 
  onThemeToggle, 
  onShowMatches, 
  matchesCount 
}: EditPropertyScreenProps) {
  const [propertyData, setPropertyData] = useState(initialPropertyData);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setPropertyData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleRemovePhoto = (index: number) => {
    setPropertyData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validation basique
    if (!propertyData.title.trim() || !propertyData.address.trim() || !propertyData.surface || !propertyData.rent) {
      alert("Veuillez remplir tous les champs obligatoires");
      setIsLoading(false);
      return;
    }

    onSave(propertyData);
    setIsLoading(false);
  };

  return (
    <div className={cn(
      "min-h-screen pb-20",
      isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-orange-900/20" 
        : "bg-gray-50"
    )}>
      {/* Header */}
      <div className="relative">
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-neon-orange/10 to-orange-500/10 blur-3xl" />
        )}
        <div className={cn(
          "relative backdrop-blur-xl border-b",
          isDark 
            ? "border-white/10 bg-dark-bg/80" 
            : "border-gray-200 bg-white/80"
        )}>
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
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
                  "text-xl lg:text-2xl font-semibold font-poppins",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {isDark ? (
                    <span className="bg-gradient-to-r from-orange-400 to-neon-orange bg-clip-text text-transparent">
                      Modifier mon logement
                    </span>
                  ) : (
                    "Modifier mon logement"
                  )}
                </h1>
              </div>
              
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className={cn(
                  "px-6 py-2 font-medium transition-all duration-300",
                  isDark 
                    ? "bg-gradient-to-r from-orange-500 to-neon-orange text-white hover:from-orange-600 hover:to-orange-400" 
                    : "bg-orange-500 text-white hover:bg-orange-600"
                )}
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-6 space-y-6">
        
        {/* Photos Section */}
        <Card className={cn(
          "p-6 shadow-lg",
          isDark 
            ? "glass-dark border-orange-500/30" 
            : "glass border-orange-200/50"
        )}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn(
              "text-lg font-semibold font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              Photos du logement
            </h2>
            <Badge className={cn(
              "px-3 py-1",
              isDark 
                ? "bg-orange-500/20 text-orange-300 border-orange-500/30" 
                : "bg-orange-100 text-orange-700 border-orange-300"
            )}>
              {propertyData.photos.length} / 10
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {propertyData.photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {/* Add Photo Button */}
            {propertyData.photos.length < 10 && (
              <button className={cn(
                "h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all duration-300",
                isDark 
                  ? "border-orange-500/50 text-orange-300 hover:border-orange-500 hover:bg-orange-500/10" 
                  : "border-orange-300 text-orange-600 hover:border-orange-500 hover:bg-orange-50"
              )}>
                <Camera className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Ajouter</span>
              </button>
            )}
          </div>
        </Card>

        {/* Basic Information */}
        <Card className={cn(
          "p-6 shadow-lg",
          isDark 
            ? "glass-dark border-orange-500/30" 
            : "glass border-orange-200/50"
        )}>
          <h2 className={cn(
            "text-lg font-semibold font-poppins mb-4",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Informations générales
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label className={cn(
                "text-sm font-medium mb-2 block",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Titre de l'annonce *
              </Label>
              <Input
                value={propertyData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Ex: Appartement moderne Bastille"
                className={cn(
                  "w-full",
                  isDark 
                    ? "bg-dark-secondary border-orange-500/30 text-white placeholder-gray-400" 
                    : "bg-white border-orange-200 text-gray-900"
                )}
              />
            </div>
            
            <div>
              <Label className={cn(
                "text-sm font-medium mb-2 block",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Description
              </Label>
              <Textarea
                value={propertyData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Décrivez votre logement en détail..."
                rows={4}
                className={cn(
                  "w-full",
                  isDark 
                    ? "bg-dark-secondary border-orange-500/30 text-white placeholder-gray-400" 
                    : "bg-white border-orange-200 text-gray-900"
                )}
              />
            </div>
            
            <div>
              <Label className={cn(
                "text-sm font-medium mb-2 block",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Adresse *
              </Label>
              <div className="relative">
                <MapPin className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                  isDark ? "text-gray-400" : "text-gray-500"
                )} />
                <Input
                  value={propertyData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Ex: 15 Rue de la Roquette, 75011 Paris"
                  className={cn(
                    "w-full pl-10",
                    isDark 
                      ? "bg-dark-secondary border-orange-500/30 text-white placeholder-gray-400" 
                      : "bg-white border-orange-200 text-gray-900"
                  )}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Property Details */}
        <Card className={cn(
          "p-6 shadow-lg",
          isDark 
            ? "glass-dark border-orange-500/30" 
            : "glass border-orange-200/50"
        )}>
          <h2 className={cn(
            "text-lg font-semibold font-poppins mb-4",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Caractéristiques
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className={cn(
                "text-sm font-medium mb-2 block",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Surface (m²) *
              </Label>
              <div className="relative">
                <Ruler className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                  isDark ? "text-gray-400" : "text-gray-500"
                )} />
                <Input
                  type="number"
                  value={propertyData.surface}
                  onChange={(e) => handleInputChange("surface", e.target.value)}
                  placeholder="75"
                  className={cn(
                    "w-full pl-10",
                    isDark 
                      ? "bg-dark-secondary border-orange-500/30 text-white" 
                      : "bg-white border-orange-200 text-gray-900"
                  )}
                />
              </div>
            </div>
            
            <div>
              <Label className={cn(
                "text-sm font-medium mb-2 block",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Nombre de pièces *
              </Label>
              <div className="relative">
                <Home className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                  isDark ? "text-gray-400" : "text-gray-500"
                )} />
                <Input
                  type="number"
                  value={propertyData.rooms}
                  onChange={(e) => handleInputChange("rooms", e.target.value)}
                  placeholder="3"
                  className={cn(
                    "w-full pl-10",
                    isDark 
                      ? "bg-dark-secondary border-orange-500/30 text-white" 
                      : "bg-white border-orange-200 text-gray-900"
                  )}
                />
              </div>
            </div>
            
            <div>
              <Label className={cn(
                "text-sm font-medium mb-2 block",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Loyer (€) *
              </Label>
              <div className="relative">
                <Euro className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                  isDark ? "text-gray-400" : "text-gray-500"
                )} />
                <Input
                  type="number"
                  value={propertyData.rent}
                  onChange={(e) => handleInputChange("rent", e.target.value)}
                  placeholder="1850"
                  className={cn(
                    "w-full pl-10",
                    isDark 
                      ? "bg-dark-secondary border-orange-500/30 text-white" 
                      : "bg-white border-orange-200 text-gray-900"
                  )}
                />
              </div>
            </div>
            
            <div>
              <Label className={cn(
                "text-sm font-medium mb-2 block",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Charges (€)
              </Label>
              <Input
                type="number"
                value={propertyData.charges}
                onChange={(e) => handleInputChange("charges", e.target.value)}
                placeholder="150"
                className={cn(
                  "w-full",
                  isDark 
                    ? "bg-dark-secondary border-orange-500/30 text-white" 
                    : "bg-white border-orange-200 text-gray-900"
                )}
              />
            </div>
            
            <div>
              <Label className={cn(
                "text-sm font-medium mb-2 block",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Dépôt de garantie (€)
              </Label>
              <Input
                type="number"
                value={propertyData.deposit}
                onChange={(e) => handleInputChange("deposit", e.target.value)}
                placeholder="1850"
                className={cn(
                  "w-full",
                  isDark 
                    ? "bg-dark-secondary border-orange-500/30 text-white" 
                    : "bg-white border-orange-200 text-gray-900"
                )}
              />
            </div>
            
            <div>
              <Label className={cn(
                "text-sm font-medium mb-2 block",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Disponible à partir du
              </Label>
              <div className="relative">
                <Calendar className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                  isDark ? "text-gray-400" : "text-gray-500"
                )} />
                <Input
                  type="date"
                  value={propertyData.availability}
                  onChange={(e) => handleInputChange("availability", e.target.value)}
                  className={cn(
                    "w-full pl-10",
                    isDark 
                      ? "bg-dark-secondary border-orange-500/30 text-white" 
                      : "bg-white border-orange-200 text-gray-900"
                  )}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Amenities */}
        <Card className={cn(
          "p-6 shadow-lg",
          isDark 
            ? "glass-dark border-orange-500/30" 
            : "glass border-orange-200/50"
        )}>
          <h2 className={cn(
            "text-lg font-semibold font-poppins mb-4",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Équipements et services
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {availableAmenities.map((amenity) => {
              const Icon = amenity.icon;
              const isSelected = propertyData.amenities.includes(amenity.id);
              
              return (
                <button
                  key={amenity.id}
                  onClick={() => handleAmenityToggle(amenity.id)}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-300 flex items-center space-x-3",
                    isSelected
                      ? isDark 
                        ? "bg-orange-500/20 border-orange-500 text-orange-300" 
                        : "bg-orange-100 border-orange-500 text-orange-700"
                      : isDark 
                        ? "bg-dark-secondary border-gray-600 text-gray-300 hover:border-orange-500/50" 
                        : "bg-white border-gray-300 text-gray-600 hover:border-orange-300"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{amenity.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Duration Preferences */}
        <Card className={cn(
          "p-6 shadow-lg",
          isDark 
            ? "glass-dark border-orange-500/30" 
            : "glass border-orange-200/50"
        )}>
          <h2 className={cn(
            "text-lg font-semibold font-poppins mb-4",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Durée d'échange
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className={cn(
                "text-sm font-medium mb-2 block",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Durée minimum (mois)
              </Label>
              <Input
                type="number"
                value={propertyData.minDuration}
                onChange={(e) => handleInputChange("minDuration", e.target.value)}
                placeholder="6"
                className={cn(
                  "w-full",
                  isDark 
                    ? "bg-dark-secondary border-orange-500/30 text-white" 
                    : "bg-white border-orange-200 text-gray-900"
                )}
              />
            </div>
            
            <div>
              <Label className={cn(
                "text-sm font-medium mb-2 block",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Durée maximum (mois)
              </Label>
              <Input
                type="number"
                value={propertyData.maxDuration}
                onChange={(e) => handleInputChange("maxDuration", e.target.value)}
                placeholder="12"
                className={cn(
                  "w-full",
                  isDark 
                    ? "bg-dark-secondary border-orange-500/30 text-white" 
                    : "bg-white border-orange-200 text-gray-900"
                )}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}