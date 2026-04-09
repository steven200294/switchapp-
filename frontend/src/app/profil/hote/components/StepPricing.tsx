"use client";

import type { ListingDraft } from "../page";

interface Props { draft: ListingDraft; update: (d: Partial<ListingDraft>) => void; onNext: () => void; onPrev: () => void; }

function Toggle({ active, onToggle, label, desc }: { active: boolean; onToggle: () => void; label: string; desc: string }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100">
      <div>
        <p className="text-body-md font-bold text-gray-900">{label}</p>
        <p className="text-body-sm text-gray-400">{desc}</p>
      </div>
      <button type="button" onClick={onToggle} className={`relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ml-4 ${active ? "bg-gray-900" : "bg-gray-200"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${active ? "translate-x-6" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

const inputCls = "w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all";

export default function StepPricing({ draft, update, onNext }: Props) {
  const valid = draft.monthly_rent > 0 && draft.available_from;

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-display-sm font-black text-gray-900 mb-2">Tarif et disponibilité</h2>
      <p className="text-body-md text-gray-400 mb-8">Définissez le loyer et les dates de disponibilité de votre logement.</p>

      <div className="space-y-5 mb-6">
        <div>
          <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Loyer mensuel (€)</label>
          <div className="relative">
            <input type="number" min={1} value={draft.monthly_rent || ""} onChange={(e) => update({ monthly_rent: Number(e.target.value) })} placeholder="ex : 1200" className={inputCls} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-lg font-bold text-gray-400">€</span>
          </div>
        </div>

        <div>
          <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Dépôt de garantie (€)</label>
          <div className="relative">
            <input type="number" min={0} value={draft.deposit || ""} onChange={(e) => update({ deposit: Number(e.target.value) })} placeholder="ex : 2400" className={inputCls} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-lg font-bold text-gray-400">€</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Disponible dès</label>
            <input type="date" value={draft.available_from} onChange={(e) => update({ available_from: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Jusqu'au</label>
            <input type="date" value={draft.available_until} onChange={(e) => update({ available_until: e.target.value })} className={inputCls} />
          </div>
        </div>
      </div>

      <div className="mb-10">
        <Toggle active={draft.utilities_included} onToggle={() => update({ utilities_included: !draft.utilities_included })} label="Charges comprises" desc="Eau, électricité et gaz inclus dans le loyer" />
        <Toggle active={draft.pets_allowed} onToggle={() => update({ pets_allowed: !draft.pets_allowed })} label="Animaux acceptés" desc="Chiens, chats et autres animaux de compagnie" />
      </div>

      <button type="button" onClick={onNext} disabled={!valid} className="w-full py-4 rounded-2xl bg-black text-white font-bold text-body-md hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
        Continuer
      </button>
    </div>
  );
}
