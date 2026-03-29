"use client";

import Link from "next/link";
import { resolveStorageUrl } from "@/shared/constants/theme";
import type { Property } from "../types/properties.types";

export default function PropertyCard({ property }: { property: Property }) {
  const coverImg = resolveStorageUrl(property.cover_image || property.photos[0] || "");

  return (
    <Link href={`/explorer/${property.id}`} className="group block">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <img
          src={coverImg}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <button
          className="absolute top-3 right-3 transition-transform active:scale-95"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'rgba(0, 0, 0, 0.5)', height: '24px', width: '24px', stroke: '#FFFFFF', strokeWidth: '2', overflow: 'visible' }}>
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 1.95L16 7.85l-2.05-1.9A6.98 6.98 0 0 0 9 4c-3.86 0-7 3.13-7 7 0 7 7 12.27 14 17z"></path>
          </svg>
        </button>
      </div>

      <div className="flex justify-between items-start">
        <div className="flex-1 pr-2">
          <h3 className="font-semibold text-gray-900 text-[15px] leading-snug truncate">
            {property.city || "Logement"}{property.district ? `, ${property.district}` : ""}
          </h3>
          
          <p className="text-[#6A6A6A] text-[15px] leading-snug mt-0.5 truncate">
            {property.title}
          </p>
          
          <p className="text-[#6A6A6A] text-[15px] leading-snug truncate">
            {property.surface_area ? `${property.surface_area} m²` : ""}
            {property.surface_area && property.rooms ? " · " : ""}
            {property.rooms ? `${property.rooms} pièce${property.rooms > 1 ? "s" : ""}` : ""}
            {(!property.surface_area && !property.rooms) && "Particulier"}
          </p>
          
          <div className="mt-1.5 flex items-center text-[15px]">
            <span className="font-semibold text-gray-900">{property.monthly_rent} €</span>
            <span className="text-gray-900 ml-1">par mois</span>
          </div>
        </div>

      </div>
    </Link>
  );
}
