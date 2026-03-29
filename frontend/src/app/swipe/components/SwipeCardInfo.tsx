"use client";

import { MapPin } from "@/shared/ui/icons";
import type { DeckProperty } from "../types/swipe.types";

interface SwipeCardInfoProps {
  property: DeckProperty;
}

export default function SwipeCardInfo({ property }: SwipeCardInfoProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
      <div className="flex items-end justify-between w-full">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-brand-cyan" />
            <span className="text-body-sm md:text-body font-bold uppercase tracking-wider">
              {property.city}
              {property.district ? `, ${property.district}` : ""}
            </span>
          </div>
          <h2 className="text-display-xs md:text-display font-black leading-tight mb-2 drop-shadow-md">
            {property.title}
          </h2>
          <p className="text-body-md md:text-body-lg font-medium text-gray-200">
            {property.surface_area}m² {property.rooms && `• ${property.rooms} pcs`}
            {property.monthly_rent ? ` • ${property.monthly_rent}€/mois` : ""}
          </p>
        </div>

        {property.owner && (
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white shadow-lg mb-1.5 bg-gray-600 flex items-center justify-center">
              {property.owner.avatar_url ? (
                <img
                  src={property.owner.avatar_url}
                  alt={property.owner.full_name || ""}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-body-lg font-bold text-white">
                  {(property.owner.full_name || "?")[0]}
                </span>
              )}
            </div>
            <span className="text-caption font-bold">
              {property.owner.full_name?.split(" ")[0] || ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
