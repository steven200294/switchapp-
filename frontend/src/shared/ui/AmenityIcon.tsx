import {
  Wifi, ParkingCircle, Snowflake, Dog, Sofa,
  Bed, Bath, Maximize,
} from "lucide-react";

const AMENITY_MAP: Record<string, typeof Wifi> = {
  wifi: Wifi,
  internet: Wifi,
  parking: ParkingCircle,
  clim: Snowflake,
  animal: Dog,
  pet: Dog,
  meublé: Sofa,
  furnished: Sofa,
  lit: Bed,
  chambre: Bed,
  bain: Bath,
  douche: Bath,
};

export default function AmenityIcon({ name, className = "w-5 h-5 text-gray-500" }: { name: string; className?: string }) {
  const lower = name.toLowerCase();
  const Icon = Object.entries(AMENITY_MAP).find(([key]) => lower.includes(key))?.[1] ?? Maximize;
  return <Icon className={className} />;
}
