import { useState } from "react";
import { 
  ArrowLeft, Camera, Save, X, User, Mail, Phone, MapPin, Wallet, 
  Clock, Users, Building, FileText, Eye, EyeOff, Upload
} from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface UserData {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  profession?: string;
  bio?: string;
  avatar?: string;
  hasCompletedPropertySetup: boolean;
  switchPassBalance?: number;
}

interface EditProfileScreenProps {
  isDark: boolean;
  onBack: () => void;
  onSave: (profileData: any) => void;
  onThemeToggle: () => void;
  onShowMatches: () => void;
  matchesCount: number;
  userData?: UserData | null;
}

// Initial data - normalement récupéré depuis l'API
const initialProfileData = {
  personal: {
    firstName: "Sophie",
    lastName: "Martinez",
    email: "sophie.martinez@email.com",
    phone: "+33 6 12 34 56 78",
    age: 28,
    profession: "Designer UX/UI",
    bio: "Passionnée de design et voyages, je recherche des échanges d'appartements pour découvrir de nouveaux quartiers tout en travaillant en remote.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjIwODI0MXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  preferences: {
    location: "Paris 1er-11ème",
    maxRent: "2500",
    minSurface: "60",
    duration: "6-12",
    roommates: "0-1",
    amenities: ["Wifi", "Cuisine équipée", "Machine à laver", "Parking"],
    propertyType: "Appartement"
  },
  documents: {
    hasIdDocument: true,
    hasIncomeProof: true,
    hasInsurance: true,
    hasGuarantor: true
  }
};

export function EditProfileScreen({ isDark, onBack, onSave, onThemeToggle, onShowMatches, matchesCount, userData }: EditProfileScreenProps) {
  // Fonction pour calculer l'âge à partir de la date de naissance
  const calculateAge = (dateString?: string): number | null => {
    if (!dateString) return null;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Convertir userData en format profileData
  const userDataToProfileData = () => {
    if (!userData) return initialProfileData;
    
    const nameParts = userData.full_name?.split(' ') || ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const age = calculateAge(userData.date_of_birth) || 28;
    
    return {
      personal: {
        firstName,
        lastName,
        email: userData.email || '',
        phone: userData.phone || '',
        age,
        profession: userData.profession || '',
        bio: userData.bio || '',
        avatar: userData.avatar || initialProfileData.personal.avatar
      },
      preferences: initialProfileData.preferences,
      documents: initialProfileData.documents
    };
  };

  const [activeSection, setActiveSection] = useState<"personal" | "preferences" | "documents">("personal");
  const [profileData, setProfileData] = useState(userDataToProfileData());
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Force mode clair pour cette page
  const isLight = true;

  const updatePersonalData = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const updatePreferences = (field: string, value: string | string[]) => {
    setProfileData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  const updateDocuments = (field: string, value: boolean) => {
    setProfileData(prev => ({
      ...prev,
      documents: { ...prev.documents, [field]: value }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSave(profileData);
    setIsLoading(false);
  };

  const sections = [
    { id: "personal", label: "Personnel", icon: User },
    { id: "preferences", label: "Préférences", icon: MapPin },
    { id: "documents", label: "Documents", icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative">
        <div className="relative backdrop-blur-xl border-b border-gray-200 bg-white/80">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <h1 className="font-poppins text-xl font-semibold text-gray-900">
                Modifier mon profil
              </h1>
              
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-600 text-white font-poppins hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation - Pas de scroll horizontal */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={cn(
                  "flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300",
                  activeSection === section.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Personal Information Section */}
        {activeSection === "personal" && (
          <div className="space-y-6">
            {/* Profile Picture */}
            <Card className="bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins mb-4">
                Photo de profil
              </h2>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={profileData.personal.avatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover"
                  />
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Changer la photo
                  </Button>
                  <p className="text-gray-500 text-sm mt-2">
                    JPG, PNG ou GIF. Max 5MB.
                  </p>
                </div>
              </div>
            </Card>

            {/* Basic Information */}
            <Card className="bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins mb-4">
                Informations personnelles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Prénom *</Label>
                  <Input
                    value={profileData.personal.firstName}
                    onChange={(e) => updatePersonalData("firstName", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="Sophie"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700">Nom *</Label>
                  <Input
                    value={profileData.personal.lastName}
                    onChange={(e) => updatePersonalData("lastName", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="Martinez"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700">Email *</Label>
                  <Input
                    type="email"
                    value={profileData.personal.email}
                    onChange={(e) => updatePersonalData("email", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="sophie@email.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700">Téléphone</Label>
                  <Input
                    type="tel"
                    value={profileData.personal.phone}
                    onChange={(e) => updatePersonalData("phone", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700">Âge</Label>
                  <Input
                    type="number"
                    value={profileData.personal.age}
                    onChange={(e) => updatePersonalData("age", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="28"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700">Profession</Label>
                  <Input
                    value={profileData.personal.profession}
                    onChange={(e) => updatePersonalData("profession", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="Designer UX/UI"
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label className="text-gray-700">Bio / Présentation</Label>
                <Textarea
                  value={profileData.personal.bio}
                  onChange={(e) => updatePersonalData("bio", e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 resize-none"
                  placeholder="Présentez-vous en quelques mots..."
                  rows={4}
                />
                <p className="text-gray-500 text-sm">
                  {profileData.personal.bio.length}/500 caractères
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Preferences Section */}
        {activeSection === "preferences" && (
          <div className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins mb-4">
                Préférences de logement
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Quartiers souhaités</span>
                  </Label>
                  <Input
                    value={profileData.preferences.location}
                    onChange={(e) => updatePreferences("location", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="Paris 1er-11ème"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-green-600" />
                    <span>Loyer maximum (€)</span>
                  </Label>
                  <Input
                    type="number"
                    value={profileData.preferences.maxRent}
                    onChange={(e) => updatePreferences("maxRent", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="2500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center space-x-2">
                    <Building className="w-4 h-4 text-purple-600" />
                    <span>Surface minimum (m²)</span>
                  </Label>
                  <Input
                    type="number"
                    value={profileData.preferences.minSurface}
                    onChange={(e) => updatePreferences("minSurface", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="60"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>Durée (mois)</span>
                  </Label>
                  <Input
                    value={profileData.preferences.duration}
                    onChange={(e) => updatePreferences("duration", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="6-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Colocation</span>
                  </Label>
                  <Input
                    value={profileData.preferences.roommates}
                    onChange={(e) => updatePreferences("roommates", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="0-1 colocataire"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700">Type de logement</Label>
                  <select
                    value={profileData.preferences.propertyType}
                    onChange={(e) => updatePreferences("propertyType", e.target.value)}
                    className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Appartement">Appartement</option>
                    <option value="Studio">Studio</option>
                    <option value="Maison">Maison</option>
                    <option value="Loft">Loft</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label className="text-gray-700">Équipements souhaités</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {["Wifi", "Cuisine équipée", "Machine à laver", "Parking", "Balcon", "Terrasse", "Ascenseur", "Climatisation"].map((amenity) => (
                    <Badge
                      key={amenity}
                      onClick={() => {
                        const current = profileData.preferences.amenities;
                        const updated = current.includes(amenity)
                          ? current.filter(a => a !== amenity)
                          : [...current, amenity];
                        updatePreferences("amenities", updated);
                      }}
                      className={cn(
                        "cursor-pointer transition-all duration-300 text-center justify-center",
                        profileData.preferences.amenities.includes(amenity)
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                      )}
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Documents Section */}
        {activeSection === "documents" && (
          <div className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins mb-4">
                Documents et vérifications
              </h2>
              
              <div className="space-y-4">
                {[
                  { key: "hasIdDocument", label: "Pièce d'identité", description: "Carte d'identité ou passeport" },
                  { key: "hasIncomeProof", label: "Justificatifs de revenus", description: "3 derniers bulletins de salaire" },
                  { key: "hasInsurance", label: "Assurance habitation", description: "Attestation d'assurance valide" },
                  { key: "hasGuarantor", label: "Garant ou garanties", description: "Dossier garant ou garantie bancaire" }
                ].map((doc) => (
                  <div
                    key={doc.key}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border transition-all duration-300",
                      profileData.documents[doc.key as keyof typeof profileData.documents]
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    )}
                  >
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-medium">{doc.label}</h3>
                      <p className="text-gray-600 text-sm">{doc.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateDocuments(doc.key, !profileData.documents[doc.key as keyof typeof profileData.documents])}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-all duration-300",
                          profileData.documents[doc.key as keyof typeof profileData.documents]
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-400 text-white hover:bg-gray-500"
                        )}
                      >
                        {profileData.documents[doc.key as keyof typeof profileData.documents] ? "Fourni" : "Manquant"}
                      </button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-blue-800 text-sm text-center">
                  Plus votre dossier est complet, plus vous avez de chances de trouver des matchs de qualité ! 
                  Un profil 100% vérifié augmente vos chances de 60%.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className={cn(
              "w-full py-4 text-lg font-semibold transition-all duration-300",
              "bg-blue-600 text-white hover:bg-blue-700",
              "shadow-lg hover:shadow-xl",
              "hover:scale-105 active:scale-95",
              "font-poppins",
              "relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/20 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative flex items-center justify-center space-x-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sauvegarde en cours...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Sauvegarder les modifications</span>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}