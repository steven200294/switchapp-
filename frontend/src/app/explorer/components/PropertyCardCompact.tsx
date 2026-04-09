"use client";

import { FavoriteHeart } from "@/shared/ui/icons";
import { resolveStorageUrl, pickCover } from "@/shared/constants/theme";
import type { Property } from "../types/properties.types";

export default function PropertyCardCompact({ property, onOpen, isFavorited, onToggleFavorite }: { property: Property; onOpen?: (id: string) => void; isFavorited?: boolean; onToggleFavorite?: (id: string) => void }) {
  const coverImg = resolveStorageUrl(pickCover(property));

  return (
    <div
      onClick={() => onOpen?.(property.id)}
      className="group block shrink-0 w-[240px] md:w-[270px] snap-start cursor-pointer"
    >
      <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-2.5">
        <img
          src={coverImg}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

        <button
          className="absolute top-2.5 right-2.5 transition-transform active:scale-95"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(property.id); }}
        >
          <FavoriteHeart size={24} style={{ fill: isFavorited ? "var(--brand-cyan)" : "rgba(0,0,0,0.5)", stroke: isFavorited ? "var(--brand-cyan)" : "#fff", strokeWidth: "2" }} />
        </button>

        {property.monthly_rent != null && (
          <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-[13px] font-bold text-gray-900">{property.monthly_rent} €</span>
            <span className="text-[13px] text-gray-500">/mois</span>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 text-[14px] leading-snug truncate">
        {property.city || "Logement"}{property.district ? `, ${property.district}` : ""}
      </h3>
      <p className="text-[13px] text-gray-500 leading-snug truncate mt-0.5">
        {property.title}
      </p>
      <p className="text-[12px] text-gray-400 truncate">
        {[
          property.surface_area && `${property.surface_area} m²`,
          property.rooms && `${property.rooms} p.`,
        ].filter(Boolean).join(" · ") || "Particulier"}
      </p>
    </div>
  );
}
