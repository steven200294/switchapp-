"use client";

import type { ListingDraft } from "../page";

interface Props { draft: ListingDraft; update: (d: Partial<ListingDraft>) => void; onNext: () => void; onPrev: () => void; }

function Stepper({ label, value, onChange, min = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100">
      <span className="text-body-lg font-semibold text-gray-900">{label}</span>
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-black transition-colors font-bold text-lg">−</button>
        <span className="w-8 text-center text-body-lg font-bold text-gray-900">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-black transition-colors font-bold text-lg">+</button>
      </div>
    </div>
  );
}

export default function StepFeatures({ draft, update, onNext }: Props) {
  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-display-sm font-black text-gray-900 mb-2">Caractéristiques du logement</h2>
      <p className="text-body-md text-gray-400 mb-8">Indiquez les dimensions et la configuration de votre bien.</p>

      <div className="mb-6">
        <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Surface habitable (m²)</label>
        <input
          type="number" min={1} value={draft.surface_area || ""}
          onChange={(e) => update({ surface_area: Number(e.target.value) })}
          placeholder="ex : 45"
          className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
        />
      </div>

      <div className="mb-10">
        <Stepper label="Pièces" value={draft.rooms} onChange={(v) => update({ rooms: v })} />
        <Stepper label="Chambres" value={draft.bedrooms} onChange={(v) => update({ bedrooms: v })} />
        <Stepper label="Salles de bain" value={draft.bathrooms} onChange={(v) => update({ bathrooms: v })} />
      </div>

      <button type="button" onClick={onNext} className="w-full py-4 rounded-2xl bg-black text-white font-bold text-body-md hover:bg-gray-800 transition-colors">
        Continuer
      </button>
    </div>
  );
}
