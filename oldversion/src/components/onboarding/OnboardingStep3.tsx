import { useState } from "react";
import { Home, MapPin, Upload, Euro, Calendar, Camera, Zap } from "lucide-react";
import { PremiumCard } from "../premium/PremiumCard";
import { PremiumInput } from "../premium/PremiumInput";
import { PremiumCheckbox } from "../premium/PremiumCheckbox";
import { PremiumButton } from "../premium/PremiumButton";
import { OnboardingData } from "../OnboardingScreen";

interface OnboardingStep3Props {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  loading?: boolean;
}

export function OnboardingStep3({ data, onUpdate, onNext, loading = false }: OnboardingStep3Props) {
  const [showPreview, setShowPreview] = useState(false);

  const propertyTypes = [
    "Studio/T1", "T2", "T3", "T4+", "Maison", "Loft", "Duplex", "Penthouse"
  ];

  const amenities = [
    "Fibre optique", "Bureau", "Climatisation", "Lave-linge", "Lave-vaisselle", 
    "TV", "Baignoire", "Parking", "Balcon/Terrasse", "Ascenseur", "Cuisine équipée", 
    "Wi-Fi", "Jardin", "Piscine", "Salle de sport"
  ];

  const energyClasses = ["A", "B", "C", "D", "E", "F", "G"];

  const handleAmenityToggle = (amenity: string) => {
    const current = data.propertyAmenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    onUpdate({ propertyAmenities: updated });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onUpdate({ photos: [...(data.photos || []), ...files] });
  };

  const removePhoto = (index: number) => {
    const photos = data.photos || [];
    const updated = photos.filter((_, i) => i !== index);
    onUpdate({ photos: updated });
  };

  const isFormValid = () => {
    return data.propertyTitle && 
           data.address && 
           data.propertyType && 
           data.surface && 
           data.rooms && 
           data.description &&
           (data.photos?.length || 0) >= 3;
  };

  if (showPreview) {
    return (
      <div className="space-y-6 pt-6">
        <PremiumCard>
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aperçu de votre annonce</h3>
            <p className="text-gray-600">Vérifiez les informations avant publication</p>
          </div>
          
          {/* Preview Content */}
          <div className="space-y-4">
            {data.photos && data.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {data.photos.slice(0, 3).map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-xl overflow-hidden">
                    <img 
                      src={URL.createObjectURL(photo)} 
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div>
              <h4 className="font-semibold text-lg">{data.propertyTitle}</h4>
              <p className="text-gray-600">{data.address}</p>
              <p className="text-primary font-semibold">{data.rent}€/mois</p>
            </div>
            
            <p className="text-gray-700">{data.description}</p>
            
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{data.propertyType}</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{data.surface}m²</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{data.rooms} pièces</span>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <PremiumButton 
              variant="secondary" 
              onClick={() => setShowPreview(false)}
              className="flex-1"
            >
              Modifier
            </PremiumButton>
            <PremiumButton 
              onClick={onNext}
              loading={loading}
              className="flex-1"
            >
              Publier mon bien
            </PremiumButton>
          </div>
        </PremiumCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6">
      {/* Property Title */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Home className="w-5 h-5 mr-2 text-primary" />
          Titre de l'annonce
        </h3>
        <PremiumInput
          placeholder="Ex: Magnifique T2 avec balcon au cœur de Paris"
          value={data.propertyTitle || ""}
          onChange={(e) => onUpdate({ propertyTitle: e.target.value })}
          help="Créez un titre accrocheur pour votre logement"
        />
      </PremiumCard>

      {/* Address */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary" />
          Adresse
        </h3>
        <PremiumInput
          placeholder="Adresse complète du logement"
          value={data.address || ""}
          onChange={(e) => onUpdate({ address: e.target.value })}
          help="Seul le quartier sera affiché publiquement"
        />
        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800">
            📍 Pour votre sécurité, seul le quartier sera visible sur votre annonce. 
            L'adresse exacte ne sera partagée qu'après validation du match.
          </p>
        </div>
      </PremiumCard>

      {/* Property Type & Details */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Type et caractéristiques</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {propertyTypes.map((type) => (
            <div
              key={type}
              onClick={() => onUpdate({ propertyType: type })}
              className={`
                px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${data.propertyType === type
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="text-sm font-medium">{type}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <PremiumInput
            type="number"
            label="Surface (m²)"
            placeholder="45"
            value={data.surface || ""}
            onChange={(e) => onUpdate({ surface: parseInt(e.target.value) })}
          />
          <PremiumInput
            type="number"
            label="Nb. pièces"
            placeholder="2"
            value={data.rooms || ""}
            onChange={(e) => onUpdate({ rooms: parseInt(e.target.value) })}
          />
          <PremiumInput
            type="number"
            label="Chambres"
            placeholder="1"
            value={data.propertyBedrooms || ""}
            onChange={(e) => onUpdate({ propertyBedrooms: parseInt(e.target.value) })}
          />
        </div>
      </PremiumCard>

      {/* Price */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Euro className="w-5 h-5 mr-2 text-primary" />
          Valeur d'échange
        </h3>
        <div className="space-y-4">
          <PremiumInput
            type="number"
            label="Loyer/valeur estimée (€/mois)"
            placeholder="1200"
            value={data.rent || ""}
            onChange={(e) => onUpdate({ rent: parseInt(e.target.value) })}
          />
          
          <div className="flex items-center justify-between">
            <PremiumCheckbox
              label="Charges incluses"
              checked={data.chargesIncluded || false}
              onChange={(checked) => onUpdate({ chargesIncluded: checked })}
            />
          </div>
          
          <div className="space-y-2">
            <PremiumCheckbox
              label="Dépôt de garantie requis"
              checked={data.deposit?.required || false}
              onChange={(checked) => onUpdate({
                deposit: { ...data.deposit, required: checked }
              })}
            />
            {data.deposit?.required && (
              <PremiumInput
                type="number"
                placeholder="Montant du dépôt (€)"
                value={data.deposit?.amount || ""}
                onChange={(e) => onUpdate({
                  deposit: { ...data.deposit, amount: parseInt(e.target.value) }
                })}
              />
            )}
          </div>
        </div>
      </PremiumCard>

      {/* Description */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description détaillée</h3>
        <textarea
          placeholder="Décrivez votre logement, le quartier, les points forts..."
          value={data.description || ""}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={6}
          className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 resize-none"
        />
        <p className="text-sm text-gray-500 mt-2">Minimum 50 caractères recommandés</p>
      </PremiumCard>

      {/* Amenities */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipements</h3>
        <div className="grid grid-cols-2 gap-3">
          {amenities.map((amenity) => (
            <div
              key={amenity}
              onClick={() => handleAmenityToggle(amenity)}
              className={`
                px-3 py-2 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${(data.propertyAmenities || []).includes(amenity)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="text-sm">{amenity}</span>
            </div>
          ))}
        </div>
      </PremiumCard>

      {/* Photos */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-primary" />
          Photos ({(data.photos || []).length}/8 minimum)
        </h3>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {(data.photos || []).map((photo, index) => (
            <div key={index} className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden">
              <img 
                src={URL.createObjectURL(photo)} 
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
          
          {(data.photos || []).length < 12 && (
            <label className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Ajouter</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        
        <div className="p-3 bg-orange-50 rounded-xl">
          <p className="text-sm text-orange-800">
            📸 Ajoutez au moins 8 photos de qualité. La première photo sera utilisée comme photo principale.
          </p>
        </div>
      </PremiumCard>

      {/* Energy Class */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-primary" />
          Classe énergie
        </h3>
        <div className="flex space-x-2">
          {energyClasses.map((energyClass) => (
            <div
              key={energyClass}
              onClick={() => onUpdate({ energyClass })}
              className={`
                w-12 h-12 rounded-xl border-2 cursor-pointer transition-all duration-200
                flex items-center justify-center font-bold
                ${data.energyClass === energyClass
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {energyClass}
            </div>
          ))}
        </div>
      </PremiumCard>

      {/* Availability */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary" />
          Disponibilités
        </h3>
        <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Calendar className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Calendrier de disponibilité</p>
            <p className="text-xs">Sélectionnez vos créneaux disponibles</p>
          </div>
        </div>
      </PremiumCard>

      {/* Validation & Preview */}
      <div className="space-y-4">
        {!isFormValid() && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <h4 className="font-medium text-orange-800 mb-2">Informations manquantes</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              {!data.propertyTitle && <li>• Titre de l'annonce</li>}
              {!data.address && <li>• Adresse</li>}
              {!data.propertyType && <li>• Type de bien</li>}
              {!data.surface && <li>• Surface</li>}
              {!data.rooms && <li>• Nombre de pièces</li>}
              {!data.description && <li>• Description</li>}
              {(data.photos?.length || 0) < 3 && <li>• Au moins 3 photos</li>}
            </ul>
          </div>
        )}
        
        {isFormValid() && (
          <PremiumButton
            variant="secondary"
            onClick={() => setShowPreview(true)}
            className="w-full"
          >
            Prévisualiser l'annonce
          </PremiumButton>
        )}
      </div>
    </div>
  );
}