"use client";

import { useTranslations } from "next-intl";
import { Dog, Sofa, AmenityIcon } from "@/shared/ui/icons";
import type { Property } from "@/app/[locale]/explorer/types/properties.types";

interface PropertyFeaturesProps {
  property: Property;
}

export default function PropertyFeatures({ property }: PropertyFeaturesProps) {
  const t = useTranslations("property");

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-3">
        {property.furnished && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <Sofa className="w-5 h-5 text-gray-500" />
            <span className="text-body text-gray-700 font-medium">{t("furnished")}</span>
          </div>
        )}
        {property.pets_allowed && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <Dog className="w-5 h-5 text-gray-500" />
            <span className="text-body text-gray-700 font-medium">{t("petsAllowed")}</span>
          </div>
        )}
      </div>

      {property.amenities.length > 0 && (
        <div className="mb-8">
          <h3 className="text-title font-bold text-gray-900 mb-4">{t("amenities")}</h3>
          <div className="flex flex-wrap gap-3">
            {property.amenities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2.5"
              >
                <AmenityIcon name={item} className="w-5 h-5 text-brand-cyan" />
                <span className="text-body text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
