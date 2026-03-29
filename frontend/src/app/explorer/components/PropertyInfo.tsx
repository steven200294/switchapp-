import { MapPin, Maximize, Bed, Bath } from "lucide-react";
import type { Property } from "@/app/explorer/types/properties.types";

interface PropertyInfoProps {
  property: Property;
}

export default function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <>
      <div className="flex items-center gap-1.5 mb-2">
        <MapPin className="w-4 h-4 text-brand-cyan" />
        <span className="text-body-sm font-bold uppercase tracking-wider text-brand-cyan">
          {property.city}
          {property.district ? `, ${property.district}` : ""}
        </span>
      </div>

      <h1 className="text-display-sm md:text-display-md font-black leading-tight text-gray-900 mb-3 tracking-tight">
        {property.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-body-md text-gray-500 font-medium mb-6 pb-6 border-b border-gray-100">
        {property.surface_area != null && property.surface_area > 0 && (
          <span className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4" /> {property.surface_area}m²
          </span>
        )}
        {property.rooms != null && (
          <span className="flex items-center gap-1.5">
            <Bed className="w-4 h-4" /> {property.rooms} pièce{property.rooms > 1 ? "s" : ""}
          </span>
        )}
        {property.bedrooms != null && (
          <span className="flex items-center gap-1.5">
            <Bed className="w-4 h-4" /> {property.bedrooms} ch.
          </span>
        )}
        {property.bathrooms != null && (
          <span className="flex items-center gap-1.5">
            <Bath className="w-4 h-4" /> {property.bathrooms} sdb
          </span>
        )}
      </div>

      {property.monthly_rent != null && property.monthly_rent > 0 && (
        <div className="mb-8 p-5 bg-gray-50 rounded-2xl flex items-baseline gap-1 flex-wrap">
          <span className="text-display-sm font-black text-gray-900">{property.monthly_rent}€</span>
          <span className="text-gray-500 text-body-md font-medium">/mois</span>
          {property.utilities_included && (
            <span className="ml-3 text-caption font-bold text-brand-cyan bg-green-50 px-2 py-1 rounded-full">
              Charges incluses
            </span>
          )}
        </div>
      )}
    </>
  );
}
