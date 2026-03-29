"use client";

import Link from "next/link";
import { FavoriteHeart } from "@/shared/ui/icons";
import { resolveStorageUrl, pickCover } from "@/shared/constants/theme";
import type { Property } from "../types/properties.types";

export default function PropertyCard({ property }: { property: Property }) {
  const coverImg = resolveStorageUrl(pickCover(property));

  return (
    <Link href={`/explorer/${property.id}`} className="group block min-w-0 overflow-hidden">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <img
          src={coverImg}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <button
          className="absolute top-3 right-3 transition-transform active:scale-95"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <FavoriteHeart size={24} style={{ fill: "rgba(0,0,0,0.5)", stroke: "#fff", strokeWidth: "2" }} />
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
