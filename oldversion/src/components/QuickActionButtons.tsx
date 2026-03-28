import { Search, Zap, TrendingUp, MapPin, Calendar } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";

interface QuickActionButtonsProps {
  isDark: boolean;
  onSearchClick: () => void;
  onMatchesClick: () => void;
  className?: string;
}

export function QuickActionButtons({ isDark, onSearchClick, onMatchesClick, className }: QuickActionButtonsProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
      {/* Rechercher Button */}
      <button
        onClick={onSearchClick}
        className="group w-full"
      >
        <Card className={cn(
          "p-6 lg:p-8 text-left transition-all duration-300 hover-lift border-0 bg-gradient-to-br",
          isDark 
            ? "from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-2xl"
            : "from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 shadow-xl hover:shadow-2xl"
        )}>
          <div className="flex items-start space-x-4">
            <div className={cn(
              "w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
              isDark 
                ? "bg-white/20 backdrop-blur-sm"
                : "bg-white/30 backdrop-blur-sm"
            )}>
              <Search className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg lg:text-xl font-poppins mb-1">
                Rechercher
              </h3>
              <p className="text-white/80 text-sm lg:text-base font-poppins">
                Parcourir les logements
              </p>
            </div>
          </div>
        </Card>
      </button>

      {/* Mes matchs Button */}
      <button
        onClick={onMatchesClick}
        className="group w-full"
      >
        <Card className={cn(
          "p-6 lg:p-8 text-left transition-all duration-300 hover-lift border-0 bg-gradient-to-br",
          isDark 
            ? "from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 shadow-2xl"
            : "from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 shadow-xl hover:shadow-2xl"
        )}>
          <div className="flex items-start space-x-4">
            <div className={cn(
              "w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
              isDark 
                ? "bg-white/20 backdrop-blur-sm"
                : "bg-white/30 backdrop-blur-sm"
            )}>
              <Zap className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg lg:text-xl font-poppins mb-1">
                Mes matchs
              </h3>
              <p className="text-white/80 text-sm lg:text-base font-poppins">
                Logements compatibles
              </p>
            </div>
          </div>
        </Card>
      </button>
    </div>
  );
}

// Composant pour les catégories avec compteurs
interface CategoryCardsProps {
  isDark: boolean;
  onCategoryClick: (categoryId: string) => void;
  selectedCategory?: string | null;
  className?: string;
}

const categories = [
  {
    id: "new",
    title: "Nouveautés",
    subtitle: "12 nouveaux logements",
    icon: TrendingUp,
    gradient: "from-blue-500 to-blue-600",
    count: 12
  },
  {
    id: "nearby",
    title: "À proximité", 
    subtitle: "Dans votre quartier",
    icon: MapPin,
    gradient: "from-green-500 to-green-600",
    count: 8
  },
  {
    id: "available-now",
    title: "Disponible rapidement",
    subtitle: "Dispo cette semaine",
    icon: Calendar,
    gradient: "from-orange-500 to-orange-600",
    count: 5
  }
];

export function CategoryCards({ isDark, onCategoryClick, selectedCategory, className }: CategoryCardsProps) {
  return (
    <div className={cn(
      // Mobile: en colonne, Desktop: en ligne
      "space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6", 
      className
    )}>
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className="w-full group"
          >
            <Card className={cn(
              "p-4 lg:p-6 transition-all duration-300 hover-lift",
              isSelected
                ? (isDark 
                    ? "bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 border-2 border-neon-blue shadow-lg"
                    : "bg-blue-50 border-2 border-blue-500 shadow-md")
                : (isDark 
                    ? "bg-gradient-to-br from-dark-secondary/80 to-dark-secondary/60 border border-white/10 hover:from-dark-secondary/90 hover:to-dark-secondary/70" 
                    : "bg-white border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md")
            )}>
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-r flex items-center justify-center",
                  category.gradient
                )}>
                  <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={cn(
                    "font-semibold font-poppins text-base lg:text-lg",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {category.title}
                  </h3>
                  <p className={cn(
                    "text-sm font-poppins",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}>
                    {category.subtitle}
                  </p>
                </div>
                <div className={cn(
                  "w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-sm lg:text-base font-bold font-poppins",
                  isDark 
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-blue-50 text-blue-600"
                )}>
                  {category.count}
                </div>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}