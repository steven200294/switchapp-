"use client";

import type { ListingDraft } from "../page";
import { MapPin, Bed, Sofa, Maximize } from "@/shared/ui/icons";

interface Props { draft: ListingDraft; update: (d: Partial<ListingDraft>) => void; onNext: () => void; onPrev: () => void; }

const TYPES = [
  { value: "appartement", label: "Appartement", icon: MapPin, desc: "Dans un immeuble" },
  { value: "maison", label: "Maison", icon: MapPin, desc: "Individuelle ou mitoyenne" },
  { value: "studio", label: "Studio", icon: Sofa, desc: "Pièce unique" },
  { value: "loft", label: "Loft", icon: Maximize, desc: "Espace ouvert" },
  { value: "chambre", label: "Chambre", icon: Bed, desc: "Dans un logement partagé" },
];

export default function StepType({ draft, update, onNext }: Props) {
  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-display-sm font-black text-gray-900 mb-2">Quel type de logement proposez-vous ?</h2>
      <p className="text-body-md text-gray-400 mb-8">Choisissez le type qui correspond le mieux à votre bien.</p>

      <div className="space-y-3 mb-10">
        {TYPES.map(({ value, label, icon: Icon, desc }) => {
          const active = draft.property_type === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => update({ property_type: value })}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all text-left ${
                active ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className={`text-body-lg font-bold ${active ? "text-gray-900" : "text-gray-700"}`}>{label}</p>
                <p className="text-body-sm text-gray-400">{desc}</p>
              </div>
              {active && (
                <div className="ml-auto w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!draft.property_type}
        className="w-full py-4 rounded-2xl bg-black text-white font-bold text-body-md hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Continuer
      </button>
    </div>
  );
}
