import { useState } from "react";
import { MapPin, Calendar, Home, Euro, Sliders, Map } from "lucide-react";
import { PremiumCard } from "../premium/PremiumCard";
import { PremiumInput } from "../premium/PremiumInput";
import { PremiumCheckbox } from "../premium/PremiumCheckbox";
import { OnboardingData } from "../OnboardingScreen";

interface OnboardingStep2Props {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export function OnboardingStep2({ data, onUpdate, onNext }: OnboardingStep2Props) {
  const destinations = [
    "Paris", "Londres", "Berlin", "Rome", "Madrid", "Amsterdam",
    "Barcelone", "Lisbonne", "Prague", "Vienne", "Copenhague", "Stockholm"
  ];

  const propertyTypes = [
    "Studio/T1", "T2", "T3", "T4+", "Maison", "Loft", "Duplex", "Penthouse"
  ];

  const durations = [
    "Week-end (2-3 jours)",
    "1-2 semaines", 
    "1 mois",
    "Plus d'1 mois"
  ];

  const amenities = [
    "Ascenseur", "Balcon/Terrasse", "Parking", "Climatisation", "Bureau",
    "Fibre optique", "Lave-linge", "Lave-vaisselle", "TV", "Baignoire",
    "Cuisine équipée", "Wi-Fi", "Jardin", "Piscine", "Salle de sport"
  ];

  const handleDestinationToggle = (destination: string) => {
    const current = data.destinations || [];
    const updated = current.includes(destination)
      ? current.filter(d => d !== destination)
      : [...current, destination];
    onUpdate({ destinations: updated });
  };

  const handlePropertyTypeToggle = (type: string) => {
    const current = data.propertyTypes || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    onUpdate({ propertyTypes: updated });
  };

  const handleAmenityToggle = (amenity: string) => {
    const current = data.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    onUpdate({ amenities: updated });
  };

  const handlePriorityChange = (priority: string, value: number) => {
    onUpdate({
      priorities: {
        ...data.priorities,
        [priority]: value
      }
    });
  };

  const PrioritySlider = ({ label, value, onChange }: { 
    label: string; 
    value: number; 
    onChange: (value: number) => void; 
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{value}/100</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  return (
    <div className="space-y-6 pt-6">
      {/* Destinations */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary" />
          Destination(s) souhaitée(s)
        </h3>
        <p className="text-sm text-gray-600 mb-4">Sélectionnez une ou plusieurs destinations</p>
        <div className="grid grid-cols-2 gap-3">
          {destinations.map((destination) => (
            <div
              key={destination}
              onClick={() => handleDestinationToggle(destination)}
              className={`
                px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${(data.destinations || []).includes(destination)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="text-sm font-medium">{destination}</span>
            </div>
          ))}
        </div>
      </PremiumCard>

      {/* Dates */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary" />
          Dates et flexibilité
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <PremiumInput
              type="date"
              label="Date de début"
              value={data.dates?.start || ""}
              onChange={(e) => onUpdate({
                dates: { ...data.dates, start: e.target.value }
              })}
            />
            <PremiumInput
              type="date"
              label="Date de fin"
              value={data.dates?.end || ""}
              onChange={(e) => onUpdate({
                dates: { ...data.dates, end: e.target.value }
              })}
            />
          </div>
          <PremiumCheckbox
            label="Dates flexibles"
            description="Je suis ouvert à des dates alternatives"
            checked={data.dates?.flexible || false}
            onChange={(checked) => onUpdate({
              dates: { ...data.dates, flexible: checked }
            })}
          />
        </div>
      </PremiumCard>

      {/* Duration */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Durée du séjour</h3>
        <div className="space-y-2">
          {durations.map((duration) => (
            <div
              key={duration}
              onClick={() => onUpdate({ duration })}
              className={`
                px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${data.duration === duration
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="text-sm font-medium">{duration}</span>
            </div>
          ))}
        </div>
      </PremiumCard>

      {/* Property Type */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Home className="w-5 h-5 mr-2 text-primary" />
          Type de bien recherché
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {propertyTypes.map((type) => (
            <div
              key={type}
              onClick={() => handlePropertyTypeToggle(type)}
              className={`
                px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${(data.propertyTypes || []).includes(type)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="text-sm font-medium">{type}</span>
            </div>
          ))}
        </div>
      </PremiumCard>

      {/* Budget */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Euro className="w-5 h-5 mr-2 text-primary" />
          Budget / Valeur d'échange
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <PremiumInput
            type="number"
            label="Budget minimum (€/mois)"
            placeholder="800"
            value={data.budget?.min || ""}
            onChange={(e) => onUpdate({
              budget: { ...data.budget, min: parseInt(e.target.value) }
            })}
          />
          <PremiumInput
            type="number"
            label="Budget maximum (€/mois)"
            placeholder="2000"
            value={data.budget?.max || ""}
            onChange={(e) => onUpdate({
              budget: { ...data.budget, max: parseInt(e.target.value) }
            })}
          />
        </div>
      </PremiumCard>

      {/* Property Details */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques du logement</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <PremiumInput
            type="number"
            label="Surface min. (m²)"
            placeholder="40"
            value={data.minSurface || ""}
            onChange={(e) => onUpdate({ minSurface: parseInt(e.target.value) })}
          />
          <PremiumInput
            type="number"
            label="Nb. chambres"
            placeholder="1"
            value={data.bedrooms || ""}
            onChange={(e) => onUpdate({ bedrooms: parseInt(e.target.value) })}
          />
          <PremiumInput
            type="number"
            label="Nb. couchages"
            placeholder="2"
            value={data.guests || ""}
            onChange={(e) => onUpdate({ guests: parseInt(e.target.value) })}
          />
        </div>
      </PremiumCard>

      {/* Amenities */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipements indispensables</h3>
        <div className="grid grid-cols-2 gap-3">
          {amenities.map((amenity) => (
            <div
              key={amenity}
              onClick={() => handleAmenityToggle(amenity)}
              className={`
                px-3 py-2 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${(data.amenities || []).includes(amenity)
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

      {/* Rules */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Règles acceptées</h3>
        <div className="space-y-3">
          <PremiumCheckbox
            label="Animaux acceptés"
            checked={data.rules?.petsAllowed || false}
            onChange={(checked) => onUpdate({
              rules: { ...data.rules, petsAllowed: checked }
            })}
          />
          <PremiumCheckbox
            label="Fumeurs acceptés"
            checked={data.rules?.smokingAllowed || false}
            onChange={(checked) => onUpdate({
              rules: { ...data.rules, smokingAllowed: checked }
            })}
          />
          <PremiumCheckbox
            label="Fêtes interdites"
            checked={!data.rules?.partiesAllowed || false}
            onChange={(checked) => onUpdate({
              rules: { ...data.rules, partiesAllowed: !checked }
            })}
          />
        </div>
      </PremiumCard>

      {/* Priorities */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Sliders className="w-5 h-5 mr-2 text-primary" />
          Priorités
        </h3>
        <div className="space-y-6">
          <PrioritySlider
            label="Quartier calme ↔ animé"
            value={data.priorities?.quietArea || 50}
            onChange={(value) => handlePriorityChange('quietArea', value)}
          />
          <PrioritySlider
            label="Proximité transports"
            value={data.priorities?.transport || 70}
            onChange={(value) => handlePriorityChange('transport', value)}
          />
          <PrioritySlider
            label="Luminosité"
            value={data.priorities?.brightness || 80}
            onChange={(value) => handlePriorityChange('brightness', value)}
          />
          <PrioritySlider
            label="Standing"
            value={data.priorities?.standing || 60}
            onChange={(value) => handlePriorityChange('standing', value)}
          />
          <PrioritySlider
            label="Vue"
            value={data.priorities?.view || 40}
            onChange={(value) => handlePriorityChange('view', value)}
          />
          <PrioritySlider
            label="Extérieur (balcon/jardin)"
            value={data.priorities?.outdoor || 60}
            onChange={(value) => handlePriorityChange('outdoor', value)}
          />
        </div>
      </PremiumCard>

      {/* Map */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Map className="w-5 h-5 mr-2 text-primary" />
          Zones préférées
        </h3>
        <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Map className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Sélectionnez vos zones préférées sur la carte</p>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}