import { useState } from "react";
import { Heart, ArrowLeft, Star, MapPin, Clock, Sun, Moon, MessageCircle, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface Match {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  propertyId: string;
  propertyTitle: string;
  compatibility: number;
  timestamp: Date;
}

interface MatchesListScreenProps {
  matches: Match[];
  isDark: boolean;
  onBack: () => void;
  onThemeToggle: () => void;
  onPropertySelect: (propertyId: string) => void;
  onStartConversation: (match: Match) => void;
  onViewUserProfile?: (userId: string, compatibilityScore?: number) => void;
  onShowMatches: () => void;
  matchesCount: number;
}

export function MatchesListScreen({ 
  matches, 
  isDark, 
  onBack, 
  onThemeToggle, 
  onPropertySelect, 
  onStartConversation,
  onViewUserProfile,
  onShowMatches,
  matchesCount 
}: MatchesListScreenProps) {
  const [filter, setFilter] = useState<'all' | 'recent' | 'high-compatibility'>('all');

  const getFilteredMatches = () => {
    let filtered = [...matches];
    
    switch (filter) {
      case 'recent':
        return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
      case 'high-compatibility':
        return filtered.filter(m => m.compatibility >= 90).sort((a, b) => b.compatibility - a.compatibility);
      default:
        return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
  };

  const filteredMatches = getFilteredMatches();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const getFilterLabel = (filterType: string) => {
    switch (filterType) {
      case 'recent': return 'Récents';
      case 'high-compatibility': return 'Très compatibles';
      default: return 'Tous';
    }
  };

  return (
    <div className={cn(
      "min-h-screen pb-20",
      isDark 
        ? "bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20" 
        : "bg-white"
    )}>
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-50 backdrop-blur-xl border-b",
        isDark 
          ? "bg-dark-bg/80 border-white/10" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
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
              
              <div>
                <h1 className={cn(
                  "text-2xl font-semibold font-poppins",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {isDark ? (
                    <span className="bg-gradient-to-r from-neon-magenta via-neon-cyan to-neon-magenta bg-clip-text text-transparent">
                      Mes Matchs
                    </span>
                  ) : (
                    "Mes Matchs"
                  )}
                </h1>
                <p className={cn(
                  "text-sm mt-1 font-poppins",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  {filteredMatches.length} match{filteredMatches.length > 1 ? 's' : ''} trouvé{filteredMatches.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
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

          {/* Filters */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {(['all', 'recent', 'high-compatibility'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap font-poppins",
                  filter === filterType
                    ? (isDark
                        ? "bg-gradient-to-r from-neon-magenta to-neon-cyan text-black"
                        : "bg-red-500 text-white")
                    : (isDark
                        ? "bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400")
                )}
              >
                {getFilterLabel(filterType)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <Card
              key={match.id}
              className={cn(
                "overflow-hidden transition-all duration-300 hover-lift",
                isDark 
                  ? "bg-gradient-to-br from-dark-secondary/80 via-dark-secondary/60 to-purple-900/30 border border-purple-500/30 backdrop-blur-xl" 
                  : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
              )}
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="relative">
                    <button
                      onClick={() => onViewUserProfile?.(match.userId, match.compatibility)}
                      className="block hover:scale-105 transition-transform duration-200"
                    >
                      <img
                        src={match.userAvatar}
                        alt={match.userName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-background">
                        <Heart className="w-3 h-3 text-white fill-current" />
                      </div>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <button
                          onClick={() => onViewUserProfile?.(match.userId, match.compatibility)}
                          className="text-left hover:underline"
                        >
                          <h3 className={cn(
                            "font-semibold font-poppins",
                            isDark ? "text-white" : "text-gray-900"
                          )}>
                            {match.userName}
                          </h3>
                        </button>
                        <p className={cn(
                          "text-sm font-poppins",
                          isDark ? "text-gray-400" : "text-gray-600"
                        )}>
                          {formatTimeAgo(match.timestamp)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={cn(
                          "px-2 py-1 text-xs font-medium font-poppins",
                          match.compatibility >= 90
                            ? (isDark ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-green-50 text-green-600 border-green-200")
                            : match.compatibility >= 80
                            ? (isDark ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : "bg-yellow-50 text-yellow-600 border-yellow-200")
                            : (isDark ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-blue-50 text-blue-600 border-blue-200")
                        )}>
                          <Star className="w-3 h-3 mr-1" />
                          {match.compatibility}%
                        </Badge>
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="mb-4">
                      <button
                        onClick={() => onPropertySelect(match.propertyId)}
                        className={cn(
                          "text-left transition-colors duration-200 hover:underline",
                          isDark ? "text-neon-cyan" : "text-blue-600"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium font-poppins">{match.propertyTitle}</span>
                        </div>
                      </button>
                    </div>

                    {/* Compatibility Message */}
                    <div className={cn(
                      "p-3 rounded-lg mb-4",
                      isDark 
                        ? "bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30"
                        : "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
                    )}>
                      <p className={cn(
                        "text-sm font-medium font-poppins",
                        isDark ? "text-purple-300" : "text-purple-700"
                      )}>
                        🎉 Nouveau match ! Compatibilité exceptionnelle de {match.compatibility}%
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => onStartConversation(match)}
                        className={cn(
                          "flex-1 font-medium font-poppins text-sm sm:text-base",
                          isDark
                            ? "bg-gradient-to-r from-neon-blue to-neon-cyan text-black hover:from-neon-cyan hover:to-neon-blue"
                            : "bg-red-500 text-white hover:bg-red-600"
                        )}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Envoyer un message</span>
                        <span className="sm:hidden">Message</span>
                      </Button>
                      
                      <Button
                        onClick={() => onViewUserProfile?.(match.userId, match.compatibility)}
                        variant="outline"
                        className={cn(
                          "flex-1 sm:flex-none sm:px-6 font-poppins text-sm sm:text-base whitespace-nowrap",
                          isDark 
                            ? "border-purple-500/50 text-purple-300 hover:border-purple-400 hover:bg-purple-500/10"
                            : "border-purple-300 text-purple-700 hover:border-purple-400 hover:bg-purple-50"
                        )}
                      >
                        <span className="hidden sm:inline">Voir le profil</span>
                        <span className="sm:hidden">Profil</span>
                      </Button>
                      
                      <Button
                        onClick={() => onPropertySelect(match.propertyId)}
                        variant="outline"
                        className={cn(
                          "flex-1 sm:flex-none sm:px-6 font-poppins text-sm sm:text-base whitespace-nowrap",
                          isDark 
                            ? "border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                            : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                        )}
                      >
                        <span className="hidden sm:inline">Voir le logement</span>
                        <span className="sm:hidden">Logement</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          /* Empty State */
          <Card className={cn(
            "text-center py-16 px-6",
            isDark 
              ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10" 
              : "bg-white shadow-sm border border-gray-200"
          )}>
            <div className={cn(
              "w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center",
              isDark 
                ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30" 
                : "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200"
            )}>
              <Zap className={cn(
                "w-10 h-10",
                isDark ? "text-purple-400" : "text-purple-500"
              )} />
            </div>
            
            <h3 className={cn(
              "text-xl font-semibold mb-3 font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {filter === 'all' ? "Aucun match pour le moment" : `Aucun match ${getFilterLabel(filter).toLowerCase()}`}
            </h3>
            
            <p className={cn(
              "text-sm mb-6 max-w-md mx-auto font-poppins",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              {filter === 'all' 
                ? "Continuez à explorer les logements et utilisez le système de matching pour trouver vos partenaires d'échange idéaux."
                : "Modifiez vos filtres ou continuez à explorer pour trouver plus de matchs."
              }
            </p>
            
            <Button
              onClick={() => setFilter('all')}
              className={cn(
                "px-6 py-2 font-medium transition-all duration-300 font-poppins",
                isDark 
                  ? "bg-gradient-to-r from-neon-purple to-neon-magenta text-white hover:from-neon-magenta hover:to-neon-purple" 
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              )}
            >
              {filter === 'all' ? "Explorer les logements" : "Voir tous les matchs"}
            </Button>
          </Card>
        )}

        {/* Stats */}
        {filteredMatches.length > 0 && (
          <Card className={cn(
            "p-6",
            isDark 
              ? "bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10" 
              : "bg-white shadow-sm border border-gray-200"
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-4 font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              Statistiques de vos matchs
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold font-poppins",
                  isDark ? "text-neon-magenta" : "text-red-600"
                )}>
                  {matches.length}
                </div>
                <div className={cn(
                  "text-xs mt-1 font-poppins",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Total matchs
                </div>
              </div>
              
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold font-poppins",
                  isDark ? "text-neon-cyan" : "text-green-600"
                )}>
                  {matches.filter(m => m.compatibility >= 90).length}
                </div>
                <div className={cn(
                  "text-xs mt-1 font-poppins",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Très compatibles
                </div>
              </div>
              
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold font-poppins",
                  isDark ? "text-neon-orange" : "text-orange-600"
                )}>
                  {Math.round(matches.reduce((acc, m) => acc + m.compatibility, 0) / matches.length) || 0}%
                </div>
                <div className={cn(
                  "text-xs mt-1 font-poppins",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Compatibilité moy.
                </div>
              </div>
              
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold font-poppins",
                  isDark ? "text-neon-purple" : "text-purple-600"
                )}>
                  {matches.filter(m => {
                    const daysDiff = (new Date().getTime() - m.timestamp.getTime()) / (1000 * 60 * 60 * 24);
                    return daysDiff <= 7;
                  }).length}
                </div>
                <div className={cn(
                  "text-xs mt-1 font-poppins",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  Cette semaine
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}