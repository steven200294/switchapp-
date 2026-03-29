import { Dog, Sofa } from "lucide-react";
import type { Property } from "@/app/explorer/types/properties.types";
import AmenityIcon from "@/shared/ui/AmenityIcon";

interface PropertyFeaturesProps {
  property: Property;
}

export default function PropertyFeatures({ property }: PropertyFeaturesProps) {
  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-3">
        {property.furnished && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <Sofa className="w-5 h-5 text-gray-500" />
            <span className="text-body text-gray-700 font-medium">Meublé</span>
          </div>
        )}
        {property.pets_allowed && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <Dog className="w-5 h-5 text-gray-500" />
            <span className="text-body text-gray-700 font-medium">Animaux acceptés</span>
          </div>
        )}
      </div>

      {property.amenities.length > 0 && (
        <div className="mb-8">
          <h3 className="text-title font-bold text-gray-900 mb-4">Équipements</h3>
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
