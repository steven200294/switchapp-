import { useState } from "react";
import { ArrowLeft, Save, MapPin, Home, DollarSign, Users, Star, Trash2, Plus, X } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";

interface SearchPreferencesScreenProps {
  isDark: boolean;
  onBack: () => void;
  onSave: (preferences: SearchPreferences) => void;
  userData?: any;
}

export interface SearchPreferences {
  destinations: string[];
  propertyTypes: string[];
  budgetMin: number;
  budgetMax: number;
  surfaceMin: number;
  rooms: number[];
  amenities: string[];
  maxRoommates: number;
}

const propertyTypes = [
  "Appartement",
  "Studio",
  "Loft",
  "Maison",
  "Duplex",
  "Penthouse"
];

const amenitiesList = [
  "Wi-Fi",
  "Parking",
  "Balcon/Terrasse",
  "Jardin",
  "Meublé",
  "Cuisine équipée",
  "Lave-linge",
  "Lave-vaisselle",
  "Climatisation",
  "Ascenseur",
  "Piscine",
  "Salle de sport"
];

const roomOptions = [1, 2, 3, 4, 5];

export function SearchPreferencesScreen({ isDark, onBack, onSave, userData }: SearchPreferencesScreenProps) {
  const [destinations, setDestinations] = useState<string[]>([]);
  const [destinationInput, setDestinationInput] = useState("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([500, 4000]);
  const [surfaceMin, setSurfaceMin] = useState(30);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [maxRoommates, setMaxRoommates] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddDestination = () => {
    if (destinationInput.trim() && !destinations.includes(destinationInput.trim())) {
      setDestinations([...destinations, destinationInput.trim()]);
      setDestinationInput("");
    }
  };

  const handleRemoveDestination = (destination: string) => {
    setDestinations(destinations.filter(d => d !== destination));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddDestination();
    }
  };

  const togglePropertyType = (type: string) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes(selectedPropertyTypes.filter(t => t !== type));
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
    }
  };

  const toggleRoom = (room: number) => {
    if (selectedRooms.includes(room)) {
      setSelectedRooms(selectedRooms.filter(r => r !== room));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    const preferences: SearchPreferences = {
      destinations,
      propertyTypes: selectedPropertyTypes,
      budgetMin: budgetRange[0],
      budgetMax: budgetRange[1],
      surfaceMin,
      rooms: selectedRooms,
      amenities: selectedAmenities,
      maxRoommates
    };

    // Simuler l'appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(preferences);
    toast.success("Préférences sauvegardées !");
    setIsLoading(false);
  };

  return (
    <div className={cn(
      "min-h-screen pb-20",
      isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20" 
        : "bg-gray-50"
    )}>
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-50 backdrop-blur-xl border-b",
        isDark 
          ? "bg-dark-bg/80 border-white/10" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="p-4 flex items-center justify-between">
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
          
          <h1 className={cn(
            "font-poppins text-xl",
            isDark ? "text-white" : "text-gray-900"
          )}>
            {isDark ? (
              <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                Mes Préférences
              </span>
            ) : (
              "Mes Préférences"
            )}
          </h1>
          
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className={cn(
              "font-poppins transition-all duration-300",
              isDark
                ? "bg-gradient-to-r from-neon-cyan to-neon-blue text-white hover:shadow-lg hover:shadow-cyan-500/50"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Destinations préférées */}
        <Card className={cn(
          "p-6 backdrop-blur-xl shadow-xl overflow-hidden relative",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-blue-900/30 border border-blue-500/30"
            : "bg-white border border-gray-200"
        )}>
          {isDark && (
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue/20 via-neon-cyan/20 to-neon-blue/20 blur-lg opacity-50" />
          )}
          <div className="relative space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className={cn(
                "w-5 h-5 mt-1",
                isDark ? "text-neon-cyan" : "text-blue-600"
              )} />
              <div className="flex-1">
                <Label className={cn(
                  "text-base font-poppins mb-2 block",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  Destinations préférées (optionnel)
                </Label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      value={destinationInput}
                      onChange={(e) => setDestinationInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ex: Paris, Londres, Tokyo, plages méditerranéennes..."
                      className={cn(
                        "flex-1 font-poppins",
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-neon-cyan"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                      )}
                    />
                    <Button
                      onClick={handleAddDestination}
                      type="button"
                      className={cn(
                        isDark
                          ? "bg-neon-cyan text-black hover:bg-neon-cyan/80"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      )}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {destinations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {destinations.map((dest, index) => (
                        <Badge
                          key={index}
                          className={cn(
                            "px-3 py-2 text-sm font-poppins flex items-center space-x-2",
                            isDark
                              ? "bg-gradient-to-r from-neon-cyan/30 to-neon-blue/30 text-neon-cyan border border-neon-cyan/50"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          )}
                        >
                          <span>{dest}</span>
                          <button
                            onClick={() => handleRemoveDestination(dest)}
                            className="hover:opacity-70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <p className={cn(
                    "text-xs font-poppins",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}>
                    Séparez les destinations par des virgules
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Type de logement */}
        <Card className={cn(
          "p-6 backdrop-blur-xl shadow-xl overflow-hidden relative",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-purple-900/30 border border-purple-500/30"
            : "bg-white border border-gray-200"
        )}>
          {isDark && (
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple/20 via-neon-magenta/20 to-neon-purple/20 blur-lg opacity-50" />
          )}
          <div className="relative space-y-4">
            <div className="flex items-start space-x-3">
              <Home className={cn(
                "w-5 h-5 mt-1",
                isDark ? "text-neon-purple" : "text-purple-600"
              )} />
              <div className="flex-1">
                <Label className={cn(
                  "text-base font-poppins mb-3 block",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  Type de logement
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => togglePropertyType(type)}
                      className={cn(
                        "px-4 py-3 rounded-lg font-poppins text-sm transition-all duration-300 border",
                        selectedPropertyTypes.includes(type)
                          ? isDark
                            ? "bg-gradient-to-r from-neon-purple/30 to-neon-magenta/30 border-neon-purple text-neon-purple"
                            : "bg-purple-600 text-white border-purple-600"
                          : isDark
                            ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Budget */}
        <Card className={cn(
          "p-6 backdrop-blur-xl shadow-xl overflow-hidden relative",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-green-900/30 border border-green-500/30"
            : "bg-white border border-gray-200"
        )}>
          {isDark && (
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 blur-lg opacity-50" />
          )}
          <div className="relative space-y-4">
            <div className="flex items-start space-x-3">
              <DollarSign className={cn(
                "w-5 h-5 mt-1",
                isDark ? "text-green-400" : "text-green-600"
              )} />
              <div className="flex-1">
                <Label className={cn(
                  "text-base font-poppins mb-3 block",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  Budget mensuel
                </Label>
                <div className="space-y-4">
                  <Slider
                    value={budgetRange}
                    onValueChange={(value) => setBudgetRange(value as [number, number])}
                    min={300}
                    max={5000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between items-center">
                    <span className={cn(
                      "text-sm font-poppins",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}>
                      {budgetRange[0]}€
                    </span>
                    <span className={cn(
                      "text-sm font-poppins",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      à
                    </span>
                    <span className={cn(
                      "text-sm font-poppins",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}>
                      {budgetRange[1]}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Nombre de pièces */}
        <Card className={cn(
          "p-6 backdrop-blur-xl shadow-xl overflow-hidden relative",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-orange-900/30 border border-orange-500/30"
            : "bg-white border border-gray-200"
        )}>
          {isDark && (
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-orange/20 via-neon-magenta/20 to-neon-orange/20 blur-lg opacity-50" />
          )}
          <div className="relative space-y-4">
            <div className="flex items-start space-x-3">
              <Home className={cn(
                "w-5 h-5 mt-1",
                isDark ? "text-neon-orange" : "text-orange-600"
              )} />
              <div className="flex-1">
                <Label className={cn(
                  "text-base font-poppins mb-3 block",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  Nombre de pièces
                </Label>
                <div className="flex space-x-2">
                  {roomOptions.map((room) => (
                    <button
                      key={room}
                      onClick={() => toggleRoom(room)}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-lg font-poppins transition-all duration-300 border",
                        selectedRooms.includes(room)
                          ? isDark
                            ? "bg-gradient-to-r from-neon-orange/30 to-neon-magenta/30 border-neon-orange text-neon-orange"
                            : "bg-orange-600 text-white border-orange-600"
                          : isDark
                            ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {room}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Surface minimale */}
        <Card className={cn(
          "p-6 backdrop-blur-xl shadow-xl overflow-hidden relative",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-cyan-900/30 border border-cyan-500/30"
            : "bg-white border border-gray-200"
        )}>
          {isDark && (
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 via-neon-blue/20 to-neon-cyan/20 blur-lg opacity-50" />
          )}
          <div className="relative space-y-4">
            <div className="flex items-start space-x-3">
              <Star className={cn(
                "w-5 h-5 mt-1",
                isDark ? "text-neon-cyan" : "text-cyan-600"
              )} />
              <div className="flex-1">
                <Label className={cn(
                  "text-base font-poppins mb-3 block",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  Surface minimale: {surfaceMin}m²
                </Label>
                <Slider
                  value={[surfaceMin]}
                  onValueChange={(value) => setSurfaceMin(value[0])}
                  min={20}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Nombre de colocataires */}
        <Card className={cn(
          "p-6 backdrop-blur-xl shadow-xl overflow-hidden relative",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-pink-900/30 border border-pink-500/30"
            : "bg-white border border-gray-200"
        )}>
          {isDark && (
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-neon-magenta/20 to-pink-500/20 blur-lg opacity-50" />
          )}
          <div className="relative space-y-4">
            <div className="flex items-start space-x-3">
              <Users className={cn(
                "w-5 h-5 mt-1",
                isDark ? "text-neon-magenta" : "text-pink-600"
              )} />
              <div className="flex-1">
                <Label className={cn(
                  "text-base font-poppins mb-3 block",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  Nombre de colocataires maximum: {maxRoommates}
                </Label>
                <Slider
                  value={[maxRoommates]}
                  onValueChange={(value) => setMaxRoommates(value[0])}
                  min={0}
                  max={5}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Équipements souhaités */}
        <Card className={cn(
          "p-6 backdrop-blur-xl shadow-xl overflow-hidden relative",
          isDark 
            ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-blue-900/30 border border-blue-500/30"
            : "bg-white border border-gray-200"
        )}>
          {isDark && (
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-blue/20 blur-lg opacity-50" />
          )}
          <div className="relative space-y-4">
            <div className="flex items-start space-x-3">
              <Star className={cn(
                "w-5 h-5 mt-1",
                isDark ? "text-neon-blue" : "text-blue-600"
              )} />
              <div className="flex-1">
                <Label className={cn(
                  "text-base font-poppins mb-3 block",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  Équipements souhaités
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenitiesList.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={cn(
                        "px-3 py-2 rounded-lg font-poppins text-sm transition-all duration-300 border text-left",
                        selectedAmenities.includes(amenity)
                          ? isDark
                            ? "bg-gradient-to-r from-neon-blue/30 to-neon-purple/30 border-neon-blue text-neon-blue"
                            : "bg-blue-600 text-white border-blue-600"
                          : isDark
                            ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
