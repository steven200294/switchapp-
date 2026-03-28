import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Home, Users, MessageCircle } from "lucide-react";
import { cn } from "./ui/utils";
import switchAppartLogo from "figma:asset/02d9788b9b0c27ad9d93452286cf4d695e50cccb.png";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    title: "Échangez vos logements",
    description: "Découvrez une nouvelle façon de voyager en échangeant votre bail d'appartement avec d'autres locataires du monde entier.",
    icon: Home,
    color: "#00BFFF", // neon-blue
  },
  {
    title: "Matching intelligent", 
    description: "Notre algorithme trouve les meilleures correspondances selon vos critères et préférences pour garantir des échanges parfaits.",
    icon: Users,
    color: "#8A2BE2", // neon-purple
  },
  {
    title: "Communication sécurisée",
    description: "Chattez en toute sécurité avec les autres utilisateurs, partagez vos disponibilités et organisez vos échanges facilement.",
    icon: MessageCircle,
    color: "#FF00FF", // neon-magenta
  }
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextStep = () => {
    if (currentStep === onboardingSteps.length - 1) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const currentStepData = onboardingSteps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-dark-bg relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

      <div className="relative z-10 flex flex-col min-h-screen px-6">
        {/* Header with logo and tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-16 pb-12 text-center"
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <img 
              src={switchAppartLogo}
              alt="SwitchAppart" 
              className="w-48 h-auto"
            />
          </div>
          
          {/* Tagline */}
          <p className="text-gray-400 text-base leading-relaxed max-w-xs mx-auto">
            Bienvenue dans l'échange de logements nouvelle génération
          </p>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center space-x-3 mb-16"
        >
          {onboardingSteps.map((_, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentStep 
                  ? "bg-neon-purple scale-150" 
                  : index < currentStep 
                    ? "bg-neon-blue" 
                    : "bg-white/30"
              )}
            />
          ))}
        </motion.div>

        {/* Main Content Card */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ 
                opacity: 0, 
                x: direction > 0 ? 50 : -50,
                scale: 0.95
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                x: direction > 0 ? -50 : 50,
                scale: 0.95
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full max-w-sm"
            >
              {/* Glass Card */}
              <div className="glass-strong-dark rounded-3xl p-8 border border-white/20 shadow-2xl">
                {/* Icon Circle */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.2, 
                    type: "spring", 
                    stiffness: 200,
                    damping: 15
                  }}
                  className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: currentStepData.color,
                    boxShadow: `0 0 30px ${currentStepData.color}40`
                  }}
                >
                  <Icon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl font-semibold text-white mb-6 text-center font-poppins"
                >
                  {currentStepData.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-gray-300 text-base leading-relaxed text-center font-poppins"
                >
                  {currentStepData.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="pb-12 pt-8"
        >
          <div className="flex items-center justify-between">
            {/* Previous button */}
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 0}
              whileHover={{ scale: currentStep > 0 ? 1.05 : 1 }}
              whileTap={{ scale: currentStep > 0 ? 0.95 : 1 }}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300",
                currentStep > 0 
                  ? "text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20" 
                  : "text-transparent cursor-not-allowed"
              )}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Précédent</span>
            </motion.button>

            {/* Skip button */}
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-400 hover:text-white transition-colors px-4 py-2 font-medium"
            >
              Passer
            </motion.button>

            {/* Next button */}
            <motion.button
              onClick={nextStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 bg-gradient-to-r from-neon-cyan to-neon-blue text-white shadow-lg hover:shadow-xl"
              style={{
                boxShadow: "0 4px 20px rgba(0, 255, 255, 0.3)"
              }}
            >
              <span>
                {currentStep === onboardingSteps.length - 1 ? "Commencer" : "Suivant"}
              </span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}