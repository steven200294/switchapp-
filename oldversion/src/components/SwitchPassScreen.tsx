import { motion } from "motion/react";
import { ArrowLeft, Check, CreditCard, Ticket, Zap, Shield, Users, Home, Star, Sun, Moon } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";
import { useState } from "react";

interface SwitchPassScreenProps {
  isDark: boolean;
  onBack: () => void;
  onThemeToggle: () => void;
  onPurchase: () => void;
  currentBalance: number;
}

export function SwitchPassScreen({ isDark, onBack, onThemeToggle, onPurchase, currentBalance }: SwitchPassScreenProps) {
  const [selectedPackage, setSelectedPackage] = useState<"single" | "pack3" | "pack5">("single");

  const packages = [
    {
      id: "single" as const,
      name: "1 SwitchPass",
      price: 99,
      passes: 1,
      pricePerPass: 99,
      popular: false,
      savings: 0
    },
    {
      id: "pack3" as const,
      name: "Pack 3 SwitchPass",
      price: 249,
      passes: 3,
      pricePerPass: 83,
      popular: true,
      savings: 48
    },
    {
      id: "pack5" as const,
      name: "Pack 5 SwitchPass",
      price: 379,
      passes: 5,
      pricePerPass: 76,
      popular: false,
      savings: 116
    }
  ];

  const selectedPack = packages.find(p => p.id === selectedPackage)!;

  const features = [
    { icon: Home, text: "Accès à tous les logements disponibles", color: "cyan" },
    { icon: Zap, text: "Activation instantanée", color: "purple" },
    { icon: Shield, text: "Garantie satisfait ou remboursé 30j", color: "magenta" },
    { icon: Users, text: "Priorité dans les matchs", color: "orange" },
  ];

  const howItWorks = [
    { step: "1", title: "Achetez votre SwitchPass", description: "Choisissez le pack qui vous convient" },
    { step: "2", title: "Trouvez votre logement", description: "Parcourez les annonces disponibles" },
    { step: "3", title: "Utilisez votre Pass", description: "Déverrouillez l'accès au logement souhaité" },
    { step: "4", title: "Finalisez l'échange", description: "Signez votre nouveau bail avec le bailleur" },
  ];

  return (
    <div className={cn(
      "min-h-screen pb-20",
      isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20" 
        : "bg-white"
    )}>
      {/* Header */}
      <div className="relative">
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-magenta/10 blur-3xl" />
        )}
        <div className={cn(
          "relative backdrop-blur-xl border-b",
          isDark 
            ? "border-white/10 bg-dark-bg/80" 
            : "border-gray-200 glass"
        )}>
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
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
        </div>
      </div>

      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          {/* Icon with neon effect */}
          <div className="relative inline-block">
            {isDark && (
              <>
                <div className="absolute inset-0 rounded-full bg-neon-orange blur-2xl opacity-60 animate-pulse scale-150" />
                <div className="absolute inset-0 rounded-full bg-neon-magenta blur-xl opacity-40 animate-pulse scale-125" />
              </>
            )}
            <div className={cn(
              "relative w-24 h-24 mx-auto rounded-full flex items-center justify-center",
              isDark 
                ? "bg-gradient-to-br from-neon-orange to-neon-magenta border-2 border-neon-orange shadow-2xl"
                : "bg-gradient-to-br from-orange-500 to-pink-600 shadow-xl"
            )}>
              <Ticket className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className={cn(
            "font-poppins text-3xl lg:text-5xl font-bold drop-shadow-2xl",
            isDark ? "text-white" : "text-gray-900"
          )}>
            {isDark ? (
              <span className="bg-gradient-to-r from-neon-orange via-neon-magenta to-neon-cyan bg-clip-text text-transparent">
                SwitchPass
              </span>
            ) : (
              "SwitchPass"
            )}
          </h1>
          
          <p className={cn(
            "text-lg lg:text-xl max-w-2xl mx-auto",
            isDark ? "text-gray-300" : "text-gray-600"
          )}>
            Ton ticket pour ton prochain appart. Pas de logement à céder ? Pas de problème !
          </p>

          {/* Current Balance */}
          {currentBalance > 0 && (
            <div className={cn(
              "inline-flex items-center space-x-2 px-4 py-2 rounded-full border",
              isDark 
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30"
                : "bg-green-50 border-green-200"
            )}>
              <Ticket className={cn(
                "w-5 h-5",
                isDark ? "text-green-400" : "text-green-600"
              )} />
              <span className={cn(
                "font-semibold",
                isDark ? "text-green-400" : "text-green-700"
              )}>
                Vous possédez {currentBalance} SwitchPass
              </span>
            </div>
          )}
        </motion.div>

        {/* Package Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className={cn(
            "text-2xl font-semibold mb-6 text-center font-poppins",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Choisissez votre pack
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={cn(
                    "relative cursor-pointer transition-all duration-300 overflow-hidden",
                    selectedPackage === pkg.id
                      ? isDark
                        ? "bg-gradient-to-br from-neon-orange/30 to-neon-magenta/30 border-2 border-neon-orange shadow-2xl shadow-neon-orange/50"
                        : "bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-500 shadow-xl"
                      : isDark
                        ? "bg-dark-secondary/60 border border-white/10 hover:border-white/20"
                        : "bg-white border border-gray-200 hover:border-gray-300",
                  )}
                >
                  {pkg.popular && (
                    <div className={cn(
                      "absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-lg",
                      isDark 
                        ? "bg-gradient-to-r from-neon-orange to-neon-magenta text-white"
                        : "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                    )}>
                      POPULAIRE
                    </div>
                  )}
                  
                  <div className="p-6 space-y-4">
                    <div className="text-center">
                      <h3 className={cn(
                        "text-xl font-bold mb-2",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        {pkg.name}
                      </h3>
                      <div className="space-y-1">
                        <div className={cn(
                          "text-4xl font-bold font-poppins",
                          isDark ? "text-neon-orange" : "text-orange-600"
                        )}>
                          {pkg.price}€
                        </div>
                        <div className={cn(
                          "text-sm",
                          isDark ? "text-gray-400" : "text-gray-500"
                        )}>
                          {pkg.pricePerPass}€ / Pass
                        </div>
                      </div>
                    </div>

                    {pkg.savings > 0 && (
                      <div className={cn(
                        "text-center px-3 py-1 rounded-full text-sm font-medium",
                        isDark 
                          ? "bg-green-500/20 text-green-400"
                          : "bg-green-100 text-green-700"
                      )}>
                        Économisez {pkg.savings}€
                      </div>
                    )}

                    <div className="flex items-center justify-center space-x-2">
                      <Ticket className={cn(
                        "w-5 h-5",
                        isDark ? "text-neon-magenta" : "text-pink-600"
                      )} />
                      <span className={cn(
                        "font-semibold",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        {pkg.passes} SwitchPass
                      </span>
                    </div>

                    {selectedPackage === pkg.id && (
                      <div className="flex items-center justify-center">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center",
                          isDark 
                            ? "bg-neon-orange text-black"
                            : "bg-orange-500 text-white"
                        )}>
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={cn(
            "backdrop-blur-xl overflow-hidden relative",
            isDark 
              ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-purple-900/30 border border-purple-500/30"
              : "glass-strong border border-purple-200/50"
          )}>
            {isDark && (
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple/20 via-neon-cyan/20 to-neon-magenta/20 blur-lg opacity-50" />
            )}
            <div className="relative p-6 lg:p-8">
              <h2 className={cn(
                "text-2xl font-semibold mb-6 text-center font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Les avantages du SwitchPass
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start space-x-3 p-4 rounded-lg border",
                        isDark 
                          ? "bg-white/5 border-white/10"
                          : "bg-gray-50 border-gray-200"
                      )}
                    >
                      <Icon className={cn(
                        "w-6 h-6 flex-shrink-0",
                        isDark && feature.color === "cyan" && "text-neon-cyan",
                        isDark && feature.color === "purple" && "text-neon-purple",
                        isDark && feature.color === "magenta" && "text-neon-magenta",
                        isDark && feature.color === "orange" && "text-neon-orange",
                        !isDark && "text-purple-600"
                      )} />
                      <span className={cn(
                        isDark ? "text-gray-300" : "text-gray-700"
                      )}>
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={cn(
            "backdrop-blur-xl overflow-hidden relative",
            isDark 
              ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-cyan-900/30 border border-cyan-500/30"
              : "glass-strong border border-cyan-200/50"
          )}>
            {isDark && (
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 blur-lg opacity-50" />
            )}
            <div className="relative p-6 lg:p-8">
              <h2 className={cn(
                "text-2xl font-semibold mb-6 text-center font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Comment ça marche ?
              </h2>

              <div className="space-y-4">
                {howItWorks.map((step, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start space-x-4 p-4 rounded-lg border",
                      isDark 
                        ? "bg-white/5 border-white/10"
                        : "bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold",
                      isDark 
                        ? "bg-gradient-to-br from-neon-cyan to-neon-blue text-black"
                        : "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                    )}>
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className={cn(
                        "font-semibold mb-1",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        {step.title}
                      </h3>
                      <p className={cn(
                        "text-sm",
                        isDark ? "text-gray-400" : "text-gray-600"
                      )}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={cn(
            "backdrop-blur-xl overflow-hidden relative",
            isDark 
              ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-green-900/30 border border-green-500/30"
              : "glass-strong border border-green-200/50"
          )}>
            {isDark && (
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 blur-lg opacity-50" />
            )}
            <div className="relative p-6 lg:p-8">
              <h2 className={cn(
                "text-2xl font-semibold mb-4 text-center font-poppins",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Exemple concret
              </h2>

              <div className="space-y-3">
                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark 
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50 border-gray-200"
                )}>
                  <p className={cn(
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}>
                    <strong className={isDark ? "text-neon-cyan" : "text-cyan-600"}>Julie</strong> quitte son appart → gagne 1 SwitchPass
                  </p>
                </div>

                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark 
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50 border-gray-200"
                )}>
                  <p className={cn(
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}>
                    Elle utilise son Pass pour prendre l'appart de <strong className={isDark ? "text-neon-magenta" : "text-pink-600"}>Karim</strong>
                  </p>
                </div>

                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark 
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50 border-gray-200"
                )}>
                  <p className={cn(
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}>
                    Karim reçoit à son tour 1 SwitchPass
                  </p>
                </div>

                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark 
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50 border-gray-200"
                )}>
                  <p className={cn(
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}>
                    <strong className={isDark ? "text-neon-orange" : "text-orange-600"}>Sarah</strong>, nouvelle à Paris, achète un SwitchPass (99 €)
                  </p>
                </div>

                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark 
                    ? "bg-green-500/20 border-green-500/30"
                    : "bg-green-50 border-green-200"
                )}>
                  <p className={cn(
                    isDark ? "text-green-300" : "text-green-700"
                  )}>
                    Sarah utilise son Pass pour débloquer le logement de Karim → <strong>boucle complète !</strong>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Purchase Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="sticky bottom-20 lg:bottom-8 z-10"
        >
          <Card className={cn(
            "backdrop-blur-xl overflow-hidden relative",
            isDark 
              ? "bg-gradient-to-r from-dark-secondary/90 to-dark-bg/90 border border-neon-orange/30"
              : "glass-strong border border-orange-200/50"
          )}>
            {isDark && (
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-orange/30 via-neon-magenta/30 to-neon-orange/30 blur-lg opacity-60 animate-pulse" />
            )}
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={cn(
                    "text-sm",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}>
                    Total à payer
                  </p>
                  <p className={cn(
                    "text-3xl font-bold font-poppins",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {selectedPack.price}€
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}>
                    Vous recevrez
                  </p>
                  <div className="flex items-center space-x-2">
                    <Ticket className={cn(
                      "w-5 h-5",
                      isDark ? "text-neon-orange" : "text-orange-600"
                    )} />
                    <p className={cn(
                      "text-2xl font-bold font-poppins",
                      isDark ? "text-neon-orange" : "text-orange-600"
                    )}>
                      {selectedPack.passes}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onPurchase}
                className={cn(
                  "w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2",
                  isDark
                    ? "bg-gradient-to-r from-neon-orange to-neon-magenta text-black hover:shadow-2xl hover:shadow-neon-orange/50 hover:scale-[1.02]"
                    : "bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:shadow-xl hover:scale-[1.02]"
                )}
              >
                <CreditCard className="w-6 h-6" />
                <span>Acheter maintenant</span>
              </button>

              <p className={cn(
                "text-xs text-center mt-3",
                isDark ? "text-gray-500" : "text-gray-500"
              )}>
                Paiement sécurisé • Garantie 30 jours satisfait ou remboursé
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
