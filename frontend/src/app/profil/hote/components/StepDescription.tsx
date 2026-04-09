"use client";

import type { ListingDraft } from "../page";

interface Props { draft: ListingDraft; update: (d: Partial<ListingDraft>) => void; onNext: () => void; onPrev: () => void; }

const inputCls = "w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all";

export default function StepDescription({ draft, update, onNext }: Props) {
  const valid = draft.title.trim().length >= 5 && draft.description.trim().length >= 20;

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-display-sm font-black text-gray-900 mb-2">Titre et description</h2>
      <p className="text-body-md text-gray-400 mb-8">Un bon titre et une description claire attirent plus de candidats.</p>

      <div className="space-y-5 mb-10">
        <div>
          <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Titre de l'annonce</label>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="ex : Bel appartement lumineux au cœur de Paris"
            maxLength={80}
            className={inputCls}
          />
          <p className="text-body-xs text-gray-400 mt-1.5 text-right">{draft.title.length}/80</p>
        </div>

        <div>
          <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Description</label>
          <textarea
            value={draft.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Décrivez votre logement : ambiance, quartier, transports, points forts..."
            rows={6}
            maxLength={1000}
            className={`${inputCls} resize-none`}
          />
          <p className="text-body-xs text-gray-400 mt-1.5 text-right">{draft.description.length}/1000</p>
        </div>
      </div>

      <button type="button" onClick={onNext} disabled={!valid} className="w-full py-4 rounded-2xl bg-black text-white font-bold text-body-md hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
        Voir le récapitulatif
      </button>
    </div>
  );
}
