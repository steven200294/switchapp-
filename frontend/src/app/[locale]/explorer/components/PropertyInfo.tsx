"use client";

import { useTranslations } from "next-intl";
import { MapPin, Maximize, Bed, Bath } from "@/shared/ui/icons";
import type { Property } from "@/app/[locale]/explorer/types/properties.types";

interface PropertyInfoProps {
  property: Property;
}

export default function PropertyInfo({ property }: PropertyInfoProps) {
  const t = useTranslations("property");
  const tCommon = useTranslations("common");

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
            <Maximize className="w-4 h-4" /> {property.surface_area}{tCommon("sqm")}
          </span>
        )}
        {property.rooms != null && (
          <span className="flex items-center gap-1.5">
            <Bed className="w-4 h-4" /> {t("rooms", { count: property.rooms })}
          </span>
        )}
        {property.bedrooms != null && (
          <span className="flex items-center gap-1.5">
            <Bed className="w-4 h-4" /> {t("bedrooms", { count: property.bedrooms })}
          </span>
        )}
        {property.bathrooms != null && (
          <span className="flex items-center gap-1.5">
            <Bath className="w-4 h-4" /> {t("bathrooms", { count: property.bathrooms })}
          </span>
        )}
      </div>

      {property.monthly_rent != null && property.monthly_rent > 0 && (
        <div className="mb-8 p-5 bg-gray-50 rounded-2xl flex items-baseline gap-1 flex-wrap">
          <span className="text-display-sm font-black text-gray-900">{property.monthly_rent}{tCommon("currency")}</span>
          <span className="text-gray-500 text-body-md font-medium">{tCommon("perMonth")}</span>
          {property.utilities_included && (
            <span className="ml-3 text-caption font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
              {t("utilitiesIncluded")}
            </span>
          )}
        </div>
      )}
    </>
  );
}
