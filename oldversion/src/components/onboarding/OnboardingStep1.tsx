import { useState } from "react";
import { Upload, Calendar, MapPin, Globe } from "lucide-react";
import { PremiumCard } from "../premium/PremiumCard";
import { PremiumInput } from "../premium/PremiumInput";
import { PremiumCheckbox } from "../premium/PremiumCheckbox";
import { PremiumButton } from "../premium/PremiumButton";
import { OnboardingData } from "../OnboardingScreen";

interface OnboardingStep1Props {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export function OnboardingStep1({ data, onUpdate, onNext }: OnboardingStep1Props) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const languages = [
    "Français", "Anglais", "Espagnol", "Italien", "Allemand", 
    "Portugais", "Chinois", "Japonais", "Arabe", "Russe"
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onUpdate({ profilePhoto: file });
    }
  };

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = data.languages || [];
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];
    onUpdate({ languages: newLanguages });
  };

  const isFormValid = () => {
    return data.birthDate && 
           data.city && 
           data.country && 
           (data.languages?.length || 0) > 0;
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Profile Photo */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo de profil</h3>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <label htmlFor="photo-upload" className="cursor-pointer">
              <PremiumButton as="span" variant="secondary">
                {photoPreview ? "Changer la photo" : "Ajouter une photo"}
              </PremiumButton>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-1">Formats: JPG, PNG (max 5MB)</p>
          </div>
        </div>
      </PremiumCard>

      {/* Basic Information */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>
        <div className="space-y-4">
          <PremiumInput
            type="date"
            label="Date de naissance"
            value={data.birthDate || ""}
            onChange={(e) => onUpdate({ birthDate: e.target.value })}
            icon={<Calendar className="w-4 h-4" />}
            help="Vous devez avoir au moins 18 ans"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <PremiumInput
              placeholder="Paris"
              label="Ville de résidence"
              value={data.city || ""}
              onChange={(e) => onUpdate({ city: e.target.value })}
              icon={<MapPin className="w-4 h-4" />}
            />
            <PremiumInput
              placeholder="France"
              label="Pays"
              value={data.country || ""}
              onChange={(e) => onUpdate({ country: e.target.value })}
              icon={<Globe className="w-4 h-4" />}
            />
          </div>
        </div>
      </PremiumCard>

      {/* Languages */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Langues parlées</h3>
        <p className="text-sm text-gray-600 mb-4">Sélectionnez toutes les langues que vous parlez</p>
        <div className="grid grid-cols-2 gap-3">
          {languages.map((language) => (
            <div
              key={language}
              onClick={() => handleLanguageToggle(language)}
              className={`
                px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${(data.languages || []).includes(language)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="text-sm font-medium">{language}</span>
            </div>
          ))}
        </div>
      </PremiumCard>

      {/* Identity Verification */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vérification d'identité</h3>
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-blue-800">
            Pour garantir la sécurité de tous, nous vérifions l'identité de nos membres.
          </p>
        </div>
        <PremiumButton variant="secondary" className="w-full">
          Démarrer la vérification
        </PremiumButton>
      </PremiumCard>

      {/* Preferences */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences générales</h3>
        <div className="space-y-3">
          <PremiumCheckbox
            label="Fumeur"
            checked={data.preferences?.smoker || false}
            onChange={(checked) => onUpdate({
              preferences: { ...data.preferences, smoker: checked }
            })}
          />
          <PremiumCheckbox
            label="Animaux de compagnie"
            checked={data.preferences?.pets || false}
            onChange={(checked) => onUpdate({
              preferences: { ...data.preferences, pets: checked }
            })}
          />
          <PremiumCheckbox
            label="Enfants"
            checked={data.preferences?.children || false}
            onChange={(checked) => onUpdate({
              preferences: { ...data.preferences, children: checked }
            })}
          />
          <PremiumCheckbox
            label="Besoins d'accessibilité"
            checked={data.preferences?.accessibility || false}
            onChange={(checked) => onUpdate({
              preferences: { ...data.preferences, accessibility: checked }
            })}
          />
        </div>
      </PremiumCard>

      {/* RGPD */}
      <PremiumCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Communications</h3>
        <PremiumCheckbox
          label="Je souhaite recevoir la newsletter et les actualités SwitchAppart"
          description="Vous pouvez vous désabonner à tout moment"
          checked={data.acceptNewsletter || false}
          onChange={(checked) => onUpdate({ acceptNewsletter: checked })}
        />
      </PremiumCard>

      {/* Validation Message */}
      {!isFormValid() && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-sm text-orange-800">
            Veuillez compléter les champs obligatoires pour continuer.
          </p>
        </div>
      )}
    </div>
  );
}