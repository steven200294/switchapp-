import Link from "next/link";
import { MapPin, Maximize, Bed, Heart } from "@/shared/ui/icons";
import { resolveStorageUrl } from "@/shared/constants/theme";
import type { FavoriteItem } from "../types/favorites.types";

interface FavoriteCardProps {
  fav: FavoriteItem;
  onRemove: () => void;
}

export default function FavoriteCard({ fav, onRemove }: FavoriteCardProps) {
  const p = fav.property;
  const coverImg = resolveStorageUrl(p.cover_image || p.photos[0] || "");

  return (
    <div className="group relative">
      <Link href={`/explorer/${p.id}`} className="block">
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-3">
          <img
            src={coverImg}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {p.monthly_rent != null && p.monthly_rent > 0 && (
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
              <span className="text-body font-black text-gray-900">{p.monthly_rent}€</span>
              <span className="text-caption text-gray-500 font-medium">/mois</span>
            </div>
          )}
        </div>

        <div className="px-1">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="text-body-sm font-bold text-gray-900">
              {p.city}{p.district ? `, ${p.district}` : ""}
            </span>
          </div>
          <h3 className="text-body-md font-semibold text-gray-800 leading-snug mb-1 line-clamp-1">
            {p.title}
          </h3>
          <div className="flex items-center gap-3 text-body-sm text-gray-500 font-medium">
            {p.surface_area != null && p.surface_area > 0 && (
              <span className="flex items-center gap-1">
                <Maximize className="w-3.5 h-3.5" />
                {p.surface_area}m²
              </span>
            )}
            {p.rooms != null && p.rooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5" />
                {p.rooms} pcs
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
        className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 transition-colors"
      >
        <Heart className="w-4.5 h-4.5 text-red-500 fill-red-500" />
      </button>
    </div>
  );
}
