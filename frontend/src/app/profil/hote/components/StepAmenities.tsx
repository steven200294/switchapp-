"use client";

import type { ListingDraft } from "../page";
import { Wifi, ParkingCircle, Snowflake, Tv, WashingMachine, Refrigerator, Microwave, Coffee, Sofa, Dog } from "@/shared/ui/icons";

interface Props { draft: ListingDraft; update: (d: Partial<ListingDraft>) => void; onNext: () => void; onPrev: () => void; }

const AMENITIES = [
  { value: "wifi", label: "Wi-Fi", Icon: Wifi },
  { value: "parking", label: "Parking", Icon: ParkingCircle },
  { value: "climatisation", label: "Climatisation", Icon: Snowflake },
  { value: "television", label: "Télévision", Icon: Tv },
  { value: "lave-linge", label: "Lave-linge", Icon: WashingMachine },
  { value: "refrigerateur", label: "Réfrigérateur", Icon: Refrigerator },
  { value: "micro-ondes", label: "Micro-ondes", Icon: Microwave },
  { value: "machine-cafe", label: "Cafetière", Icon: Coffee },
  { value: "meuble", label: "Meublé", Icon: Sofa },
  { value: "animaux", label: "Animaux acceptés", Icon: Dog },
];

export default function StepAmenities({ draft, update, onNext }: Props) {
  function toggle(value: string) {
    const current = draft.amenities;
    update({ amenities: current.includes(value) ? current.filter((a) => a !== value) : [...current, value] });
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-display-sm font-black text-gray-900 mb-2">Équipements disponibles</h2>
      <p className="text-body-md text-gray-400 mb-8">Sélectionnez tout ce que vous proposez dans votre logement.</p>

      <div className="grid grid-cols-2 gap-3 mb-10">
        {AMENITIES.map(({ value, label, Icon }) => {
          const active = draft.amenities.includes(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all text-left ${
                active ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <Icon size={20} className={active ? "text-black" : "text-gray-400"} />
              <span className={`text-body-sm font-semibold ${active ? "text-gray-900" : "text-gray-500"}`}>{label}</span>
            </button>
          );
        })}
      </div>

      <button type="button" onClick={onNext} className="w-full py-4 rounded-2xl bg-black text-white font-bold text-body-md hover:bg-gray-800 transition-colors">
        Continuer
      </button>
    </div>
  );
}
