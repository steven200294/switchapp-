import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Home, MapPin, Camera, Calendar, Check, Upload, Plus, X } from "lucide-react";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import switchAppartLogo from "figma:asset/02d9788b9b0c27ad9d93452286cf4d695e50cccb.png";

interface PropertyOnboardingScreenProps {
  onComplete: () => void;
  isDark?: boolean;
}

interface PropertyData {
  propertyType: string;
  surface: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  address: string;
  city: string;
  postalCode: string;
  neighborhood: string;
  description: string;
  amenities: string[];
  photos: File[];
  availableFrom: string;
  availableTo: string;
  preferredDestinations: string[];
  propertyFeatures: string[];
}

const steps = [
  {
    id: 1,
    title: "Type de bien",
    subtitle: "Décrivez votre logement",
    icon: Home,
    color: "neon-blue"
  },
  {
    id: 2,
    title: "Localisation",
    subtitle: "Où se situe votre bien ?",
    icon: MapPin,
    color: "neon-purple"
  },
  {
    id: 3,
    title: "Photos & Description",
    subtitle: "Montrez votre logement",
    icon: Camera,
    color: "neon-cyan"
  },
  {
    id: 4,
    title: "Disponibilités",
    subtitle: "Quand êtes-vous prêt à échanger ?",
    icon: Calendar,
    color: "neon-magenta"
  }
];

const propertyTypes = [
  "Appartement",
  "Maison",
  "Studio",
  "Loft",
  "Villa",
  "Penthouse",
  "Duplex",
  "Autre"
];

const amenitiesList = [
  "Wi-Fi",
  "Climatisation",
  "Chauffage",
  "Cuisine équipée",
  "Lave-vaisselle",
  "Lave-linge",
  "Sèche-linge",
  "Télévision",
  "Balcon/Terrasse",
  "Jardin",
  "Parking",
  "Piscine",
  "Salle de sport",
  "Ascenseur"
];

const propertyFeatures = [
  "Vue sur mer",
  "Vue sur montagne",
  "Vue sur ville",
  "Récemment rénové",
  "Meublé",
  "Animaux acceptés",
  "Non-fumeur",
  "Accessible PMR",
  "Proche transports",
  "Quartier calme"
];

export function PropertyOnboardingScreen({ onComplete, isDark = true }: PropertyOnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyData, setPropertyData] = useState<PropertyData>({
    propertyType: "",
    surface: "",
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    address: "",
    city: "",
    postalCode: "",
    neighborhood: "",
    description: "",
    amenities: [],
    photos: [],
    availableFrom: "",
    availableTo: "",
    preferredDestinations: [],
    propertyFeatures: []
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Sauvegarder les données et terminer l'onboarding
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // TODO: Sauvegarder les données de la propriété via l'API
      console.log("Données de propriété:", propertyData);
      onComplete();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const updatePropertyData = (field: keyof PropertyData, value: any) => {
    setPropertyData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof PropertyData, item: string) => {
    const currentArray = propertyData[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updatePropertyData(field, newArray);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      updatePropertyData("photos", [...propertyData.photos, ...fileArray]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = propertyData.photos.filter((_, i) => i !== index);
    updatePropertyData("photos", newPhotos);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div>
                <Label className="text-white mb-3 block">Type de logement</Label>
                <Select value={propertyData.propertyType} onValueChange={(value) => updatePropertyData("propertyType", value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Sélectionnez le type de bien" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-bg/95 backdrop-blur-xl border-white/20">
                    {propertyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Surface (m²)</Label>
                  <Input
                    type="number"
                    placeholder="85"
                    value={propertyData.surface}
                    onChange={(e) => updatePropertyData("surface", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Pièces</Label>
                  <Input
                    type="number"
                    placeholder="3"
                    value={propertyData.rooms}
                    onChange={(e) => updatePropertyData("rooms", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Chambres</Label>
                  <Input
                    type="number"
                    placeholder="2"
                    value={propertyData.bedrooms}
                    onChange={(e) => updatePropertyData("bedrooms", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Salles de bain</Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={propertyData.bathrooms}
                    onChange={(e) => updatePropertyData("bathrooms", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div>
                <Label className="text-white mb-2 block">Adresse complète</Label>
                <Input
                  placeholder="123 rue de la Paix"
                  value={propertyData.address}
                  onChange={(e) => updatePropertyData("address", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Ville</Label>
                  <Input
                    placeholder="Paris"
                    value={propertyData.city}
                    onChange={(e) => updatePropertyData("city", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Code postal</Label>
                  <Input
                    placeholder="75001"
                    value={propertyData.postalCode}
                    onChange={(e) => updatePropertyData("postalCode", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">Quartier</Label>
                <Input
                  placeholder="Marais, Châtelet, etc."
                  value={propertyData.neighborhood}
                  onChange={(e) => updatePropertyData("neighborhood", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label className="text-white mb-3 block">Caractéristiques du logement</Label>
                <div className="grid grid-cols-2 gap-2">
                  {propertyFeatures.map(feature => (
                    <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={propertyData.propertyFeatures.includes(feature)}
                        onCheckedChange={() => toggleArrayItem("propertyFeatures", feature)}
                        className="border-white/30"
                      />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Label className="text-white mb-2 block">Description de votre logement</Label>
              <Textarea
                placeholder="Décrivez votre logement, le quartier, les points forts..."
                rows={4}
                value={propertyData.description}
                onChange={(e) => updatePropertyData("description", e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label className="text-white mb-3 block">Équipements disponibles</Label>
              <div className="grid grid-cols-2 gap-2">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={propertyData.amenities.includes(amenity)}
                      onCheckedChange={() => toggleArrayItem("amenities", amenity)}
                      className="border-white/30"
                    />
                    <span className="text-sm text-gray-300">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-white mb-3 block">Photos de votre logement</Label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Cliquez pour ajouter des photos</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG jusqu'à 10MB</p>
                  </label>
                </div>

                {propertyData.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {propertyData.photos.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg bg-gray-800 flex items-center justify-center">
                          <span className="text-xs text-gray-400">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block">Disponible à partir du</Label>
                <Input
                  type="date"
                  value={propertyData.availableFrom}
                  onChange={(e) => updatePropertyData("availableFrom", e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Disponible jusqu'au</Label>
                <Input
                  type="date"
                  value={propertyData.availableTo}
                  onChange={(e) => updatePropertyData("availableTo", e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-white mb-2 block">Destinations préférées (optionnel)</Label>
              <Textarea
                placeholder="Ex: Paris, Londres, Tokyo, plages méditerranéennes..."
                rows={3}
                value={propertyData.preferredDestinations.join(", ")}
                onChange={(e) => updatePropertyData("preferredDestinations", e.target.value.split(", ").filter(d => d.trim()))}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">Séparez les destinations par des virgules</p>
            </div>

            <div className="bg-neon-blue/10 border border-neon-blue/30 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-neon-blue mt-0.5" />
                <div>
                  <h4 className="text-white font-medium">Presque terminé !</h4>
                  <p className="text-gray-300 text-sm">
                    Votre logement sera visible par d'autres utilisateurs et vous pourrez commencer à recevoir des propositions d'échange définitif.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return propertyData.propertyType && propertyData.surface && propertyData.rooms;
      case 2:
        return propertyData.address && propertyData.city && propertyData.postalCode;
      case 3:
        return propertyData.description.length > 10;
      case 4:
        return propertyData.availableFrom;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-neon-blue/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-40 right-16 w-24 h-24 bg-neon-purple/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-neon-cyan/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="pt-12 pb-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={switchAppartLogo}
              alt="SwitchAppart" 
              className="w-32 h-auto"
            />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Configurez votre logement
          </motion.h1>
          <p className="text-gray-400">
            Quelques informations pour créer votre profil d'échange
          </p>
        </div>

        {/* Progress Steps */}
        <div className="px-6 mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isActive && `bg-${step.color} text-black`,
                    isCompleted && "bg-green-500 text-white",
                    !isActive && !isCompleted && "bg-white/10 text-gray-400"
                  )}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-12 h-0.5 mx-2 transition-all duration-300",
                      currentStep > step.id ? "bg-green-500" : "bg-white/20"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step */}
        <div className="flex-1 px-6 pb-8">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong-dark rounded-2xl p-6 border border-white/10 shadow-2xl"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-1">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-gray-400 text-sm">
                  {steps[currentStep - 1].subtitle}
                </p>
              </div>

              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="text-gray-400 hover:text-white disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!isStepComplete()}
                  className={cn(
                    "bg-gradient-to-r text-black font-medium px-6",
                    currentStep === 1 && "from-neon-blue to-neon-cyan",
                    currentStep === 2 && "from-neon-purple to-neon-magenta",
                    currentStep === 3 && "from-neon-cyan to-neon-blue",
                    currentStep === 4 && "from-neon-magenta to-neon-orange",
                    "hover:shadow-lg transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {currentStep === steps.length ? "Terminer" : "Suivant"}
                  {currentStep < steps.length && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}