import { useState } from "react";
import { 
  ArrowLeft, Camera, MapPin, Home, Users, Wifi, Car, 
  Coffee, Tv, Utensils, Waves, Trees, Shield, Check, 
  Calendar, Euro, Upload, X, Plus, Info, Sun, Moon, Zap,
  CheckCircle, ArrowRight
} from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface AddPropertyScreenProps {
  isDark: boolean;
  onBack: () => void;
  onSubmit: (propertyData: any) => void;
  onThemeToggle: () => void;
  onShowMatches: () => void;
  matchesCount: number;
}

type PropertyStep = "basic" | "photos" | "amenities" | "pricing" | "availability" | "review";

const initialPropertyData = {
  basic: {
    title: "",
    description: "",
    type: "apartment",
    address: "",
    city: "Paris",
    arrondissement: "",
    surface: "",
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    maxGuests: ""
  },
  photos: {
    mainPhoto: null as string | null,
    additionalPhotos: [] as string[]
  },
  amenities: {
    essential: [] as string[],
    comfort: [] as string[],
    safety: [] as string[]
  },
  pricing: {
    monthlyRent: "",
    charges: "",
    deposit: "",
    fees: "",
    negotiable: false
  },
  availability: {
    availableFrom: "",
    availableUntil: "",
    minDuration: "1",
    maxDuration: "12",
    instantBook: false
  }
};

const propertyTypes = [
  { value: "apartment", label: "Appartement", icon: Home },
  { value: "studio", label: "Studio", icon: Home },
  { value: "house", label: "Maison", icon: Home },
  { value: "loft", label: "Loft", icon: Home },
  { value: "room", label: "Chambre", icon: Users }
];

const amenitiesCategories = {
  essential: [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "kitchen", label: "Cuisine équipée", icon: Utensils },
    { id: "parking", label: "Parking", icon: Car },
    { id: "elevator", label: "Ascenseur", icon: Home },
    { id: "balcony", label: "Balcon/Terrasse", icon: Trees },
    { id: "washing", label: "Lave-linge", icon: Home }
  ],
  comfort: [
    { id: "tv", label: "TV", icon: Tv },
    { id: "ac", label: "Climatisation", icon: Waves },
    { id: "dishwasher", label: "Lave-vaisselle", icon: Utensils },
    { id: "coffee", label: "Machine à café", icon: Coffee },
    { id: "garden", label: "Jardin", icon: Trees },
    { id: "pool", label: "Piscine", icon: Waves }
  ],
  safety: [
    { id: "security", label: "Système de sécurité", icon: Shield },
    { id: "intercom", label: "Interphone", icon: Shield },
    { id: "smoke", label: "Détecteur de fumée", icon: Shield },
    { id: "firstaid", label: "Trousse de secours", icon: Shield }
  ]
};

export function AddPropertyScreen({ isDark, onBack, onSubmit, onThemeToggle, onShowMatches, matchesCount }: AddPropertyScreenProps) {
  const [currentStep, setCurrentStep] = useState<PropertyStep>("basic");
  const [propertyData, setPropertyData] = useState(initialPropertyData);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const steps = [
    { id: "basic", label: "Informations de base", completed: false },
    { id: "photos", label: "Photos", completed: false },
    { id: "amenities", label: "Équipements", completed: false },
    { id: "pricing", label: "Prix", completed: false },
    { id: "availability", label: "Disponibilité", completed: false },
    { id: "review", label: "Vérification", completed: false }
  ];

  const updateBasicData = (field: string, value: string) => {
    setPropertyData(prev => ({
      ...prev,
      basic: { ...prev.basic, [field]: value }
    }));
  };

  const updateAmenities = (category: keyof typeof amenitiesCategories, amenityId: string) => {
    setPropertyData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [category]: prev.amenities[category].includes(amenityId)
          ? prev.amenities[category].filter(id => id !== amenityId)
          : [...prev.amenities[category], amenityId]
      }
    }));
  };

  const updatePricing = (field: string, value: string | boolean) => {
    setPropertyData(prev => ({
      ...prev,
      pricing: { ...prev.pricing, [field]: value }
    }));
  };

  const updateAvailability = (field: string, value: string | boolean) => {
    setPropertyData(prev => ({
      ...prev,
      availability: { ...prev.availability, [field]: value }
    }));
  };

  const handlePublish = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPublished(true);
    setIsLoading(false);
    
    // After 2 seconds, submit and go back
    setTimeout(() => {
      onSubmit(propertyData);
    }, 2000);
  };

  const getStepProgress = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as PropertyStep);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as PropertyStep);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "basic":
        return propertyData.basic.title && propertyData.basic.address && propertyData.basic.surface;
      case "photos":
        return true; // Photos are optional
      case "amenities":
        return true; // Amenities are optional
      case "pricing":
        return propertyData.pricing.monthlyRent;
      case "availability":
        return propertyData.availability.availableFrom;
      case "review":
        return true;
      default:
        return false;
    }
  };

  const isLastStep = currentStep === "review";

  // Success screen after publishing
  if (isPublished) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center p-4",
        isDark 
          ? "bg-gradient-to-br from-dark-bg via-dark-bg to-green-900/20" 
          : "bg-gray-50"
      )}>
        <Card className={cn(
          "p-8 text-center max-w-md w-full",
          isDark 
            ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-green-500/30" 
            : "bg-white shadow-xl border border-green-200"
        )}>
          <div className={cn(
            "w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center",
            isDark 
              ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30" 
              : "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
          )}>
            <CheckCircle className={cn(
              "w-8 h-8",
              isDark ? "text-green-400" : "text-green-600"
            )} />
          </div>
          
          <h2 className={cn(
            "text-2xl font-bold mb-4 font-poppins",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Logement publié !
          </h2>
          
          <p className={cn(
            "text-center mb-6 font-poppins",
            isDark ? "text-gray-300" : "text-gray-600"
          )}>
            Votre logement "{propertyData.basic.title}" est maintenant disponible pour l'échange avec d'autres propriétaires.
          </p>
          
          <div className={cn(
            "p-4 rounded-lg mb-6",
            isDark 
              ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
              : "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
          )}>
            <p className={cn(
              "text-sm font-medium font-poppins",
              isDark ? "text-green-300" : "text-green-700"
            )}>
              🎉 Félicitations ! Vous allez bientôt recevoir vos premières propositions d'échange.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen pb-20",
      isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-green-900/20" 
        : "bg-gray-50"
    )}>
      {/* Header with Progress */}
      <div className={cn(
        "sticky top-0 z-50 backdrop-blur-xl border-b",
        isDark 
          ? "bg-dark-bg/80 border-white/10" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
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
            
            <h1 className={cn(
              "font-orbitron text-xl font-bold",
              isDark ? "text-white" : "text-gray-900"
            )}>
              <span className={cn(
                isDark 
                  ? "bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                  : "text-green-600"
              )}>
                Ajouter mon logement
              </span>
            </h1>
            
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
                <Zap className="w-5 h-5" />
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
          
          {/* Step indicator */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className={cn(
              "text-sm font-medium font-poppins",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              Étape {steps.findIndex(s => s.id === currentStep) + 1} sur {steps.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className={cn(
            "w-full h-2 rounded-full overflow-hidden",
            isDark ? "bg-gray-800" : "bg-gray-200"
          )}>
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Basic Information Step */}
        {currentStep === "basic" && (
          <Card className={cn(
            "p-6",
            isDark 
              ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10" 
              : "bg-white shadow-sm border border-gray-200"
          )}>
            <h2 className={cn(
              "text-lg font-bold mb-6 font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              <span className="mr-2">🏠</span>
              Informations de base
            </h2>
            
            <div className="space-y-6">
              {/* Property Type */}
              <div className="space-y-3">
                <Label className={cn("text-base font-medium font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                  Type de logement *
                </Label>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {propertyTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => updateBasicData("type", type.value)}
                        className={cn(
                          "p-4 rounded-xl border transition-all duration-300 text-center font-poppins",
                          propertyData.basic.type === type.value
                            ? (isDark 
                                ? "bg-green-500/20 border-green-500/50 text-green-400" 
                                : "bg-green-50 border-green-200 text-green-600")
                            : (isDark 
                                ? "bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-600/50" 
                                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100")
                        )}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">{type.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title and Description */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className={cn("font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                    Titre de l'annonce *
                  </Label>
                  <Input
                    value={propertyData.basic.title}
                    onChange={(e) => updateBasicData("title", e.target.value)}
                    placeholder="Ex: Appartement lumineux avec vue sur Seine"
                    className={cn(
                      "text-base font-poppins",
                      isDark 
                        ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400" 
                        : "bg-white border-gray-300 text-gray-900"
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className={cn("font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                    Description
                  </Label>
                  <Textarea
                    value={propertyData.basic.description}
                    onChange={(e) => updateBasicData("description", e.target.value)}
                    placeholder="Décrivez votre logement, son ambiance, ses atouts..."
                    rows={4}
                    className={cn(
                      "font-poppins",
                      isDark 
                        ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400" 
                        : "bg-white border-gray-300 text-gray-900"
                    )}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={cn("font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                    Adresse *
                  </Label>
                  <Input
                    value={propertyData.basic.address}
                    onChange={(e) => updateBasicData("address", e.target.value)}
                    placeholder="123 Rue de la Paix"
                    className={cn(
                      "font-poppins",
                      isDark 
                        ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400" 
                        : "bg-white border-gray-300 text-gray-900"
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className={cn("font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                    Arrondissement
                  </Label>
                  <select
                    value={propertyData.basic.arrondissement}
                    onChange={(e) => updateBasicData("arrondissement", e.target.value)}
                    className={cn(
                      "w-full p-3 rounded-lg border transition-all font-poppins",
                      isDark 
                        ? "bg-gray-800/50 border-gray-700 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    )}
                  >
                    <option value="">Sélectionner</option>
                    {Array.from({length: 20}, (_, i) => i + 1).map(num => (
                      <option key={num} value={`${num}ème`}>
                        Paris {num}ème
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className={cn("font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                    Surface (m²) *
                  </Label>
                  <Input
                    type="number"
                    value={propertyData.basic.surface}
                    onChange={(e) => updateBasicData("surface", e.target.value)}
                    placeholder="50"
                    className={cn(
                      "font-poppins",
                      isDark 
                        ? "bg-gray-800/50 border-gray-700 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className={cn("font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                    Pièces
                  </Label>
                  <Input
                    type="number"
                    value={propertyData.basic.rooms}
                    onChange={(e) => updateBasicData("rooms", e.target.value)}
                    placeholder="3"
                    className={cn(
                      "font-poppins",
                      isDark 
                        ? "bg-gray-800/50 border-gray-700 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className={cn("font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                    Chambres
                  </Label>
                  <Input
                    type="number"
                    value={propertyData.basic.bedrooms}
                    onChange={(e) => updateBasicData("bedrooms", e.target.value)}
                    placeholder="2"
                    className={cn(
                      "font-poppins",
                      isDark 
                        ? "bg-gray-800/50 border-gray-700 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className={cn("font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                    Occupants max
                  </Label>
                  <Input
                    type="number"
                    value={propertyData.basic.maxGuests}
                    onChange={(e) => updateBasicData("maxGuests", e.target.value)}
                    placeholder="4"
                    className={cn(
                      "font-poppins",
                      isDark 
                        ? "bg-gray-800/50 border-gray-700 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    )}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Photos Step - Simplified */}
        {currentStep === "photos" && (
          <Card className={cn(
            "p-6",
            isDark 
              ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10" 
              : "bg-white shadow-sm border border-gray-200"
          )}>
            <h2 className={cn(
              "text-lg font-bold mb-6 font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              <span className="mr-2">📸</span>
              Photos du logement
            </h2>
            
            <div className="space-y-6">
              <div className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
                isDark 
                  ? "border-gray-600 hover:border-green-500/50 bg-gray-800/30" 
                  : "border-gray-300 hover:border-green-400 bg-gray-50"
              )}>
                <Camera className={cn(
                  "w-12 h-12 mx-auto mb-4",
                  isDark ? "text-gray-400" : "text-gray-500"
                )} />
                <Button className="mb-2 bg-green-500 hover:bg-green-400 text-white font-poppins">
                  <Upload className="w-4 h-4 mr-2" />
                  Choisir des photos
                </Button>
                <p className={cn("text-sm font-poppins", isDark ? "text-gray-400" : "text-gray-500")}>
                  JPG, PNG ou WebP. Max 10MB par photo.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Amenities Step - Simplified */}
        {currentStep === "amenities" && (
          <Card className={cn(
            "p-6",
            isDark 
              ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10" 
              : "bg-white shadow-sm border border-gray-200"
          )}>
            <h2 className={cn(
              "text-lg font-bold mb-6 font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              <span className="mr-2">✨</span>
              Équipements
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesCategories.essential.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = propertyData.amenities.essential.includes(amenity.id);
                
                return (
                  <button
                    key={amenity.id}
                    onClick={() => updateAmenities("essential", amenity.id)}
                    className={cn(
                      "p-4 rounded-xl border transition-all duration-300 text-left flex items-center space-x-3 font-poppins",
                      isSelected
                        ? (isDark 
                            ? "bg-green-500/20 border-green-500/50 text-green-400" 
                            : "bg-green-50 border-green-200 text-green-600")
                        : (isDark 
                            ? "bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-600/50" 
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100")
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{amenity.label}</span>
                    {isSelected && <Check className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Pricing Step */}
        {currentStep === "pricing" && (
          <Card className={cn(
            "p-6",
            isDark 
              ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10" 
              : "bg-white shadow-sm border border-gray-200"
          )}>
            <h2 className={cn(
              "text-lg font-bold mb-6 font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              <span className="mr-2">💰</span>
              Tarification
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className={cn("font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                  Loyer mensuel (€) *
                </Label>
                <Input
                  type="number"
                  value={propertyData.pricing.monthlyRent}
                  onChange={(e) => updatePricing("monthlyRent", e.target.value)}
                  placeholder="1500"
                  className={cn(
                    "font-poppins",
                    isDark 
                      ? "bg-gray-800/50 border-gray-700 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label className={cn("font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                  Charges (€)
                </Label>
                <Input
                  type="number"
                  value={propertyData.pricing.charges}
                  onChange={(e) => updatePricing("charges", e.target.value)}
                  placeholder="150"
                  className={cn(
                    "font-poppins",
                    isDark 
                      ? "bg-gray-800/50 border-gray-700 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  )}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Availability Step */}
        {currentStep === "availability" && (
          <Card className={cn(
            "p-6",
            isDark 
              ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10" 
              : "bg-white shadow-sm border border-gray-200"
          )}>
            <h2 className={cn(
              "text-lg font-bold mb-6 font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              <span className="mr-2">📅</span>
              Disponibilité
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className={cn("font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                  Disponible à partir du *
                </Label>
                <Input
                  type="date"
                  value={propertyData.availability.availableFrom}
                  onChange={(e) => updateAvailability("availableFrom", e.target.value)}
                  className={cn(
                    "font-poppins",
                    isDark 
                      ? "bg-gray-800/50 border-gray-700 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label className={cn("font-poppins", isDark ? "text-gray-300" : "text-gray-700")}>
                  Disponible jusqu'au
                </Label>
                <Input
                  type="date"
                  value={propertyData.availability.availableUntil}
                  onChange={(e) => updateAvailability("availableUntil", e.target.value)}
                  className={cn(
                    "font-poppins",
                    isDark 
                      ? "bg-gray-800/50 border-gray-700 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  )}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Review Step */}
        {currentStep === "review" && (
          <div className="space-y-6">
            <Card className={cn(
              "p-6",
              isDark 
                ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10" 
                : "bg-white shadow-sm border border-gray-200"
            )}>
              <h2 className={cn(
                "text-lg font-bold mb-6 font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                <span className="mr-2">✅</span>
                Récapitulatif de votre annonce
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className={cn(
                    "font-semibold text-lg font-poppins",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {propertyData.basic.title || "Titre de l'annonce"}
                  </h3>
                  <p className={cn(
                    "text-sm mt-1 font-poppins",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}>
                    {propertyData.basic.address}, {propertyData.basic.arrondissement}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={cn(
                    "p-3 rounded-lg",
                    isDark ? "bg-gray-700/50" : "bg-gray-50"
                  )}>
                    <p className={cn(
                      "text-xs font-poppins",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      Surface
                    </p>
                    <p className={cn(
                      "font-semibold font-poppins",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      {propertyData.basic.surface}m²
                    </p>
                  </div>
                  
                  <div className={cn(
                    "p-3 rounded-lg",
                    isDark ? "bg-gray-700/50" : "bg-gray-50"
                  )}>
                    <p className={cn(
                      "text-xs font-poppins",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      Loyer
                    </p>
                    <p className={cn(
                      "font-semibold font-poppins",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      {propertyData.pricing.monthlyRent}€/mois
                    </p>
                  </div>
                  
                  <div className={cn(
                    "p-3 rounded-lg",
                    isDark ? "bg-gray-700/50" : "bg-gray-50"
                  )}>
                    <p className={cn(
                      "text-xs font-poppins",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      Type
                    </p>
                    <p className={cn(
                      "font-semibold font-poppins",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      {propertyTypes.find(t => t.value === propertyData.basic.type)?.label}
                    </p>
                  </div>
                  
                  <div className={cn(
                    "p-3 rounded-lg",
                    isDark ? "bg-gray-700/50" : "bg-gray-50"
                  )}>
                    <p className={cn(
                      "text-xs font-poppins",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      Disponible
                    </p>
                    <p className={cn(
                      "font-semibold font-poppins",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      {propertyData.availability.availableFrom || "Non renseigné"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            onClick={prevStep}
            variant="outline"
            disabled={currentStep === "basic"}
            className={cn(
              "px-6 py-3 font-poppins",
              isDark 
                ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            Précédent
          </Button>
          
          {isLastStep ? (
            <Button
              onClick={handlePublish}
              disabled={!canProceed() || isLoading}
              className={cn(
                "px-8 py-3 font-semibold font-poppins",
                "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Publication en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Publier mon annonce
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className={cn(
                "px-6 py-3 font-poppins",
                "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              Suivant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}