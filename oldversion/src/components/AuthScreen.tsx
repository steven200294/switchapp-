import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, Eye, EyeOff, Apple, Phone, Calendar, Briefcase, MessageSquare, Home, Camera, X } from "lucide-react";
import { cn } from "./ui/utils";
import switchAppartLogo from "figma:asset/02d9788b9b0c27ad9d93452286cf4d695e50cccb.png";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { authApi } from '../utils/api';
import { GeneratedAvatar } from './GeneratedAvatar';

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

interface AuthScreenProps {
  onComplete: (user: UserData, token: string) => void;
  isDark?: boolean;
}

type AuthMode = "login" | "register" | "forgot";

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  profession: string;
  bio: string;
  acceptTerms: boolean;
  rememberMe: boolean;
  avatar?: File | null;
}

interface FormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  profession?: string;
  bio?: string;
  acceptTerms?: string;
}

export function AuthScreen({ onComplete, isDark = false }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    profession: "",
    bio: "",
    acceptTerms: false,
    rememberMe: false,
    avatar: null
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, email: 'Veuillez sélectionner une image valide' }));
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, email: 'L\'image doit faire moins de 5 MB' }));
        return;
      }

      handleInputChange('avatar', file);
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    handleInputChange('avatar', null);
    setAvatarPreview(null);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    
    if (mode !== "forgot") {
      if (!formData.password) {
        newErrors.password = "Mot de passe requis";
      } else if (mode === "register" && formData.password.length < 8) {
        newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
      }
    }
    
    if (mode === "register") {
      if (!formData.firstName) newErrors.firstName = "Le prénom est requis";
      if (!formData.lastName) newErrors.lastName = "Le nom est requis";
      if (!formData.phone) newErrors.phone = "Le numéro de téléphone est requis";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "La date de naissance est requise";
      if (!formData.profession) newErrors.profession = "La profession est requise";
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "Veuillez accepter les conditions d'utilisation";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (mode === "register") {
        // Appel API pour l'inscription avec upload de photo si présente
        const response = await authApi.signup({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          full_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone || undefined,
          date_of_birth: formData.dateOfBirth || undefined,
          profession: formData.profession || undefined,
          bio: formData.bio || undefined,
          avatar: formData.avatar || undefined,
        });

        if (response.success && response.user) {
          console.log('Inscription réussie:', response.user);
          onComplete(response.user, response.user.access_token || '');
        } else {
          setErrors({ email: response.error || 'Erreur lors de l\'inscription' });
        }

      } else if (mode === "login") {
        // Appel API pour la connexion
        const response = await authApi.signin({
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        });

        if (response.success && response.user) {
          console.log('Connexion réussie:', response.user);
          onComplete(response.user, response.user.access_token || '');
        } else {
          setErrors({ email: 'Identifiants invalides' });
        }

      } else if (mode === "forgot") {
        // Simulation pour le mot de passe oublié (à implémenter)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMode("login");
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      
      // Gérer les erreurs spécifiques
      if (error.message?.includes('email_exists') || error.message?.includes('already been registered') || error.message?.includes('déjà utilisé')) {
        setErrors({ 
          email: 'Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.' 
        });
      } else {
        setErrors({ 
          email: error.message || 'Une erreur est survenue. Veuillez réessayer.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: string) => {
    setIsLoading(true);
    try {
      // Simulate social auth
      await new Promise(resolve => setTimeout(resolve, 1200));
      onComplete();
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "from-red-500 to-red-600";
    if (passwordStrength < 75) return "from-yellow-400 to-orange-500";
    return "from-green-400 to-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Faible";
    if (passwordStrength < 75) return "Moyen";
    return "Fort";
  };

  const handleQuickTestLogin = () => {
    const demoUser: UserData = {
      id: `demo-user-${Date.now()}`,
      email: "demo@switchappart.local",
      full_name: "Utilisateur Test",
      profession: "Testeur",
      hasCompletedPropertySetup: true,
      switchPassBalance: 1,
    };

    // Use anon JWT so the app keeps a valid token format in session.
    onComplete(demoUser, publicAnonKey);
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
        {/* Header with logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-16 pb-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <img 
              src={switchAppartLogo}
              alt="SwitchAppart" 
              className="w-40 h-auto"
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p className="text-gray-400 text-sm">
              {mode === "login" && "Connectez-vous à votre espace"}
              {mode === "register" && "Rejoignez la communauté d'échange"}
              {mode === "forgot" && "Récupération de mot de passe"}
            </p>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 px-6 pb-8">
          <div className="max-w-sm mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-strong-dark rounded-2xl p-6 border border-white/10 shadow-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-white mb-1">
                      {mode === "login" && "Connexion"}
                      {mode === "register" && "Inscription"}
                      {mode === "forgot" && "Mot de passe oublié"}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {mode === "login" && "Accédez à vos échanges"}
                      {mode === "register" && "Créez votre compte"}
                      {mode === "forgot" && "Entrez votre email"}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "register" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        {/* Photo de profil */}
                        <div className="flex flex-col items-center mb-4">
                          <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="cursor-pointer group relative"
                          >
                            {avatarPreview ? (
                              <div className="relative">
                                <img
                                  src={avatarPreview}
                                  alt="Avatar preview"
                                  className="w-24 h-24 rounded-full object-cover border-2 border-neon-blue shadow-[0_0_20px_rgba(0,191,255,0.6)] group-hover:scale-105 transition-transform"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeAvatar();
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : formData.firstName ? (
                              <div className="relative">
                                <GeneratedAvatar 
                                  name={formData.firstName} 
                                  size="xl"
                                  className="group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Camera className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-blue to-neon-cyan border-2 border-white/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,191,255,0.4)]">
                                <Camera className="w-10 h-10 text-white" />
                              </div>
                            )}
                          </label>
                          <p className="text-gray-400 text-xs mt-2">
                            {avatarPreview ? 'Cliquez pour changer' : 'Ajouter une photo (optionnel)'}
                          </p>
                        </div>

                        {/* Nom et Prénom */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="relative">
                              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Prénom"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                onFocus={() => setFocusedField("firstName")}
                                onBlur={() => setFocusedField(null)}
                                className={cn(
                                  "w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400",
                                  "transition-all duration-300 backdrop-blur-sm",
                                  focusedField === "firstName" 
                                    ? "border-neon-blue shadow-lg glow-blue-subtle" 
                                    : errors.firstName 
                                      ? "border-red-400" 
                                      : "border-white/20 hover:border-white/30",
                                  "focus:outline-none focus:border-neon-blue focus:shadow-lg"
                                )}
                              />
                            </div>
                            {errors.firstName && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-1"
                              >
                                {errors.firstName}
                              </motion.p>
                            )}
                          </div>
                          <div>
                            <div className="relative">
                              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Nom"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                onFocus={() => setFocusedField("lastName")}
                                onBlur={() => setFocusedField(null)}
                                className={cn(
                                  "w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400",
                                  "transition-all duration-300 backdrop-blur-sm",
                                  focusedField === "lastName" 
                                    ? "border-neon-blue shadow-lg glow-blue-subtle" 
                                    : errors.lastName 
                                      ? "border-red-400" 
                                      : "border-white/20 hover:border-white/30",
                                  "focus:outline-none focus:border-neon-blue focus:shadow-lg"
                                )}
                              />
                            </div>
                            {errors.lastName && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-1"
                              >
                                {errors.lastName}
                              </motion.p>
                            )}
                          </div>
                        </div>

                        {/* Téléphone et Date de naissance */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type="tel"
                                placeholder="Téléphone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                onFocus={() => setFocusedField("phone")}
                                onBlur={() => setFocusedField(null)}
                                className={cn(
                                  "w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400",
                                  "transition-all duration-300 backdrop-blur-sm",
                                  focusedField === "phone" 
                                    ? "border-neon-purple shadow-lg glow-purple-subtle" 
                                    : errors.phone 
                                      ? "border-red-400" 
                                      : "border-white/20 hover:border-white/30",
                                  "focus:outline-none focus:border-neon-purple focus:shadow-lg"
                                )}
                              />
                            </div>
                            {errors.phone && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-1"
                              >
                                {errors.phone}
                              </motion.p>
                            )}
                          </div>
                          <div>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type="date"
                                placeholder="Date de naissance"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                onFocus={() => setFocusedField("dateOfBirth")}
                                onBlur={() => setFocusedField(null)}
                                className={cn(
                                  "w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400",
                                  "transition-all duration-300 backdrop-blur-sm",
                                  focusedField === "dateOfBirth" 
                                    ? "border-neon-cyan shadow-lg glow-cyan-subtle" 
                                    : errors.dateOfBirth 
                                      ? "border-red-400" 
                                      : "border-white/20 hover:border-white/30",
                                  "focus:outline-none focus:border-neon-cyan focus:shadow-lg"
                                )}
                              />
                            </div>
                            {errors.dateOfBirth && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-1"
                              >
                                {errors.dateOfBirth}
                              </motion.p>
                            )}
                          </div>
                        </div>

                        {/* Profession */}
                        <div>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Profession"
                              value={formData.profession}
                              onChange={(e) => handleInputChange("profession", e.target.value)}
                              onFocus={() => setFocusedField("profession")}
                              onBlur={() => setFocusedField(null)}
                              className={cn(
                                "w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400",
                                "transition-all duration-300 backdrop-blur-sm",
                                focusedField === "profession" 
                                  ? "border-neon-magenta shadow-lg glow-magenta-subtle" 
                                  : errors.profession 
                                    ? "border-red-400" 
                                    : "border-white/20 hover:border-white/30",
                                "focus:outline-none focus:border-neon-magenta focus:shadow-lg"
                              )}
                            />
                          </div>
                          {errors.profession && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-400 text-xs mt-1"
                            >
                              {errors.profession}
                            </motion.p>
                          )}
                        </div>

                        {/* Bio (optionnelle) */}
                        <div>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <textarea
                              placeholder="Parlez-nous de vous... (optionnel)"
                              rows={3}
                              value={formData.bio}
                              onChange={(e) => handleInputChange("bio", e.target.value)}
                              onFocus={() => setFocusedField("bio")}
                              onBlur={() => setFocusedField(null)}
                              className={cn(
                                "w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 resize-none",
                                "transition-all duration-300 backdrop-blur-sm",
                                focusedField === "bio" 
                                  ? "border-neon-orange shadow-lg glow-orange-subtle" 
                                  : "border-white/20 hover:border-white/30",
                                "focus:outline-none focus:border-neon-orange focus:shadow-lg"
                              )}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Adresse email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          className={cn(
                            "w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400",
                            "transition-all duration-300 backdrop-blur-sm",
                            focusedField === "email" 
                              ? "border-neon-blue shadow-lg glow-blue-subtle" 
                              : errors.email 
                                ? "border-red-400" 
                                : "border-white/20 hover:border-white/30",
                            "focus:outline-none focus:border-neon-blue focus:shadow-lg"
                          )}
                        />
                      </div>
                      {errors.email && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    {mode !== "forgot" && (
                      <div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            onFocus={() => setFocusedField("password")}
                            onBlur={() => setFocusedField(null)}
                            className={cn(
                              "w-full bg-white/5 border rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-400",
                              "transition-all duration-300 backdrop-blur-sm",
                              focusedField === "password" 
                                ? "border-neon-blue shadow-lg glow-blue-subtle" 
                                : errors.password 
                                  ? "border-red-400" 
                                  : "border-white/20 hover:border-white/30",
                              "focus:outline-none focus:border-neon-blue focus:shadow-lg"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs mt-1"
                          >
                            {errors.password}
                          </motion.p>
                        )}
                        
                        {/* Password strength indicator for register */}
                        {mode === "register" && formData.password && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">Force du mot de passe</span>
                              <span className={cn(
                                "text-xs font-medium",
                                passwordStrength < 40 && "text-red-400",
                                passwordStrength >= 40 && passwordStrength < 75 && "text-yellow-400",
                                passwordStrength >= 75 && "text-green-400"
                              )}>
                                {getPasswordStrengthText()}
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${passwordStrength}%` }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                  "h-1.5 rounded-full bg-gradient-to-r",
                                  getPasswordStrengthColor()
                                )}
                              />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Options for login */}
                    {mode === "login" && (
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                            className="w-4 h-4 text-neon-blue rounded border-white/20 bg-white/5 focus:ring-neon-blue focus:ring-offset-0"
                          />
                          <span className="text-sm text-gray-400">Se souvenir</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setMode("forgot")}
                          className="text-sm text-neon-blue hover:text-neon-cyan transition-colors"
                        >
                          Mot de passe oublié ?
                        </button>
                      </div>
                    )}

                    {/* Terms acceptance for register */}
                    {mode === "register" && (
                      <div className="space-y-2">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.acceptTerms}
                            onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                            className="w-4 h-4 mt-1 text-neon-blue rounded border-white/20 bg-white/5 focus:ring-neon-blue focus:ring-offset-0"
                          />
                          <span className="text-sm text-gray-400 leading-tight">
                            J'accepte les{" "}
                            <button
                              type="button"
                              className="text-neon-blue hover:text-neon-cyan underline"
                            >
                              conditions d'utilisation
                            </button>
                            {" "}et la{" "}
                            <button
                              type="button"
                              className="text-neon-blue hover:text-neon-cyan underline"
                            >
                              politique de confidentialité
                            </button>
                          </span>
                        </label>
                        {errors.acceptTerms && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs"
                          >
                            {errors.acceptTerms}
                          </motion.p>
                        )}
                      </div>
                    )}

                    {/* Submit button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 relative overflow-hidden",
                        "bg-gradient-to-r from-neon-cyan to-neon-blue text-black shadow-lg",
                        "hover:from-neon-blue hover:to-neon-purple hover:shadow-xl",
                        "focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2 focus:ring-offset-transparent",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "glow-blue-subtle hover:glow-purple-subtle",
                        "flex items-center justify-center" // Centrage ajouté
                      )}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          <span>
                            {mode === "login" && "Connexion..."}
                            {mode === "register" && "Inscription..."}
                            {mode === "forgot" && "Envoi..."}
                          </span>
                        </div>
                      ) : (
                        <span className="text-center">
                          {mode === "login" && "Se connecter"}
                          {mode === "register" && "Créer mon compte"}
                          {mode === "forgot" && "Envoyer le lien"}
                        </span>
                      )}
                    </motion.button>

                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={handleQuickTestLogin}
                        disabled={isLoading}
                        className={cn(
                          "w-full py-3 px-4 rounded-xl font-medium transition-all duration-300",
                          "bg-white/5 text-neon-cyan border border-neon-cyan/30",
                          "hover:bg-neon-cyan/10 hover:border-neon-cyan/60",
                          "focus:outline-none focus:ring-2 focus:ring-neon-cyan/40",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        Mode test (sans inscription)
                      </button>
                    )}

                    {/* Mode switchers */}
                    <div className="text-center space-y-3">
                      {mode === "forgot" && (
                        <button
                          type="button"
                          onClick={() => setMode("login")}
                          className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          Retour à la connexion
                        </button>
                      )}
                      
                      {mode !== "forgot" && (
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-transparent text-gray-400">ou</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </form>

                  {/* Social login buttons */}
                  {mode !== "forgot" && (
                    <div className="space-y-3 mt-4">
                      {/* Apple Login */}
                      <motion.button
                        type="button"
                        onClick={() => handleSocialAuth("apple")}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "w-full py-3 px-4 rounded-xl font-medium transition-all duration-300",
                          "bg-black text-white border border-white/20",
                          "hover:bg-gray-900 hover:border-white/30",
                          "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "flex items-center justify-center space-x-2"
                        )}
                      >
                        <Apple className="w-5 h-5" />
                        <span>Continuer avec Apple</span>
                      </motion.button>

                      {/* Google Login */}
                      <motion.button
                        type="button"
                        onClick={() => handleSocialAuth("google")}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "w-full py-3 px-4 rounded-xl font-medium transition-all duration-300",
                          "bg-white text-gray-800 border border-gray-300",
                          "hover:bg-gray-50 hover:border-gray-400",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "flex items-center justify-center space-x-2"
                        )}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Continuer avec Google</span>
                      </motion.button>
                    </div>
                  )}

                  {/* Switch between login and register */}
                  {mode !== "forgot" && (
                    <div className="text-center mt-6">
                      <span className="text-sm text-gray-400">
                        {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}
                        {" "}
                        <button
                          type="button"
                          onClick={() => setMode(mode === "login" ? "register" : "login")}
                          className="text-neon-blue hover:text-neon-cyan font-medium transition-colors"
                        >
                          {mode === "login" ? "Inscrivez-vous" : "Connectez-vous"}
                        </button>
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Explanation Section - Only on login mode */}
            {mode === "login" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 space-y-6"
              >
                {/* Why SwitchAppart */}
                <div className="glass-strong-dark rounded-2xl p-6 border border-white/10">
                  <h3 className="text-neon-cyan mb-4">Pourquoi SwitchAppart ?</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-neon-blue/20 border border-neon-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-neon-blue text-xs">1</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        <span className="text-white font-medium">Échanges définitifs</span> - Changez de vie sans contrainte avec un nouvel appartement permanent
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-neon-purple/20 border border-neon-purple flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-neon-purple text-xs">2</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        <span className="text-white font-medium">Simple et rapide</span> - Trouvez votre match en quelques swipes, chattez et organisez la visite
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-neon-magenta/20 border border-neon-magenta flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-neon-magenta text-xs">3</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        <span className="text-white font-medium">Système SwitchPass</span> - Achetez un pass pour rejoindre sans avoir d'appart à céder
                      </p>
                    </div>
                  </div>
                </div>

                {/* How Matching Works - Fun Explanation */}
                <div className="glass-strong-dark rounded-2xl p-6 border border-neon-cyan/30 bg-gradient-to-br from-neon-cyan/5 to-transparent">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-black" />
                    </div>
                    <h3 className="text-white">Comment ça matche ?</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/40 flex items-center justify-center">
                            <Home className="w-6 h-6 text-neon-blue" />
                          </div>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-neon-cyan"
                          >
                            →
                          </motion.div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-magenta to-neon-purple flex items-center justify-center animate-pulse">
                          <span className="text-white text-lg">💫</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <motion.div
                            animate={{ x: [0, -5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-neon-cyan"
                          >
                            ←
                          </motion.div>
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-magenta/20 border border-neon-purple/40 flex items-center justify-center">
                            <Home className="w-6 h-6 text-neon-purple" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <p className="text-gray-300 text-sm">
                          Swipez les appartements qui vous plaisent 👍
                        </p>
                        <p className="text-neon-cyan text-sm font-medium">
                          Match = Vous aimez leur appart ET ils aiment le vôtre !
                        </p>
                        <p className="text-gray-400 text-xs">
                          Une fois matché, chattez ensemble et organisez des visites pour finaliser l'échange 🎉
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}