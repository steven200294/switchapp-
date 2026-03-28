import { Heart, Star, Users, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  compatibilityScore: number;
  image: string;
  available: string;
  roommates: number;
  maxRoommates: number;
  tags: string[];
  owner?: {
    name: string;
    avatar: string;
  };
  liked?: boolean;
  isDark?: boolean;
  onLike?: () => void;
  onView?: () => void;
}

export function PropertyCard({
  title,
  location,
  price,
  compatibilityScore,
  image,
  available,
  roommates,
  maxRoommates,
  tags,
  owner,
  liked = false,
  isDark = false,
  onLike,
  onView
}: PropertyCardProps) {
  return (
    <div 
      onClick={onView}
      className={cn(
        "group cursor-pointer hover-lift rounded-xl overflow-hidden",
        isDark 
          ? "airbnb-card-dark hover-lift-dark" 
          : "airbnb-card"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike?.();
          }}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full transition-all duration-300",
            "bg-white/90 hover:bg-white hover:scale-110 backdrop-blur-sm",
            isDark && "bg-black/60 hover:bg-black/80"
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors duration-300",
              liked 
                ? "text-red-500 fill-red-500" 
                : isDark 
                  ? "text-white hover:text-red-400" 
                  : "text-gray-600 hover:text-red-500"
            )}
          />
        </button>

        {/* Compatibility Score Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={cn(
            "px-3 py-1 font-medium backdrop-blur-sm border-0",
            compatibilityScore >= 90 
              ? "bg-green-500/90 text-white"
              : compatibilityScore >= 75
                ? "bg-blue-500/90 text-white" 
                : "bg-orange-500/90 text-white"
          )}>
            <Star className="w-3 h-3 mr-1 fill-current" />
            {compatibilityScore}%
          </Badge>
        </div>

        {/* Quick Tags */}
        {tags.length > 0 && (
          <div className="absolute bottom-3 left-3">
            <Badge className={cn(
              "px-2 py-1 text-xs backdrop-blur-sm border-0",
              isDark 
                ? "bg-black/60 text-white" 
                : "bg-white/90 text-gray-800"
            )}>
              {tags[0]}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Location & Availability */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className={cn(
              "w-4 h-4",
              isDark ? "text-gray-400" : "text-gray-500"
            )} />
            <span className={cn(
              "text-sm font-medium font-poppins",
              isDark ? "text-gray-300" : "text-gray-700"
            )}>
              {location}
            </span>
          </div>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-poppins",
            isDark 
              ? "bg-green-500/20 text-green-400" 
              : "bg-green-50 text-green-600"
          )}>
            {available}
          </span>
        </div>

        {/* Title */}
        <h3 className={cn(
          "text-lg font-semibold line-clamp-2 leading-tight font-poppins",
          isDark ? "text-white" : "text-gray-900"
        )}>
          {title}
        </h3>

        {/* Roommates Info */}
        <div className="flex items-center space-x-1">
          <Users className={cn(
            "w-4 h-4",
            isDark ? "text-gray-400" : "text-gray-500"
          )} />
          <span className={cn(
            "text-sm font-poppins",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            {roommates}/{maxRoommates} colocataires
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={cn(
                "text-xs px-2 py-0.5 font-normal",
                isDark 
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs px-2 py-0.5 font-normal",
                isDark 
                  ? "bg-gray-700 text-gray-300" 
                  : "bg-gray-100 text-gray-700"
              )}
            >
              +{tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Owner Info */}
        {owner && (
          <div className="flex items-center space-x-2 py-2">
            <img
              src={owner.avatar}
              alt={owner.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className={cn(
              "text-sm font-medium font-poppins",
              isDark ? "text-gray-300" : "text-gray-700"
            )}>
              {owner.name}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className={cn(
              "text-xl font-bold font-poppins",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {price.split('/')[0]}
            </span>
            <span className={cn(
              "text-sm ml-1 font-poppins",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              /mois
            </span>
          </div>
          
          {/* Subtle neon accent for SwitchAppart identity */}
          <div className={cn(
            "px-3 py-1 rounded-full border transition-all duration-300",
            "hover:glow-blue-subtle cursor-pointer",
            isDark 
              ? "border-neon-blue/30 text-neon-blue hover:border-neon-blue/50" 
              : "border-blue-200 text-blue-600 hover:border-blue-300"
          )}>
            <span className="text-xs font-medium font-poppins">Voir plus</span>
          </div>
        </div>
      </div>
    </div>
  );
}