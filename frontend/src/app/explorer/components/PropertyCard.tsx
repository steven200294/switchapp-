import Link from "next/link";
import { MapPin, Maximize, Bed, Heart } from "@/shared/ui/icons";
import { FALLBACK_COVER } from "@/shared/constants/theme";
import type { Property } from "../types/properties.types";

export default function PropertyCard({ property }: { property: Property }) {
  const coverImg = property.cover_image || property.photos[0] || FALLBACK_COVER;

  return (
    <Link href={`/explorer/${property.id}`} className="group block">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
        <img
          src={coverImg}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <button
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <Heart className="w-4.5 h-4.5 text-gray-600" />
        </button>
        {property.monthly_rent != null && property.monthly_rent > 0 && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
            <span className="text-body font-black text-gray-900">{property.monthly_rent}€</span>
            <span className="text-caption text-gray-500 font-medium">/mois</span>
          </div>
        )}
      </div>

      <div className="px-1">
        <div className="flex items-center gap-1.5 mb-1">
          <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
          <span className="text-body-sm font-bold text-gray-900">
            {property.city}{property.district ? `, ${property.district}` : ""}
          </span>
        </div>
        <h3 className="text-body-md font-semibold text-gray-800 leading-snug mb-1 line-clamp-1">
          {property.title}
        </h3>
        <div className="flex items-center gap-3 text-body-sm text-gray-500 font-medium">
          {property.surface_area != null && property.surface_area > 0 && (
            <span className="flex items-center gap-1">
              <Maximize className="w-3.5 h-3.5" />
              {property.surface_area}m²
            </span>
          )}
          {property.rooms != null && property.rooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {property.rooms} pièce{property.rooms > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {property.owner && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {property.owner.avatar_url ? (
                <img src={property.owner.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-body-2xs font-bold text-gray-400">
                  {(property.owner.full_name || "?")[0]}
                </span>
              )}
            </div>
            <span className="text-caption text-gray-500 font-medium">
              {property.owner.full_name || "Utilisateur"}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
