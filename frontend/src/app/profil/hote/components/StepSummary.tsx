"use client";

import type { ListingDraft } from "../page";

interface Props { draft: ListingDraft; update: (d: Partial<ListingDraft>) => void; onNext: () => void; onPrev: () => void; }

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-body-sm text-gray-400 font-medium">{label}</span>
      <span className="text-body-sm font-bold text-gray-900 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export default function StepSummary({ draft }: Props) {
  const cover = draft.photos[0] ? URL.createObjectURL(draft.photos[0]) : null;

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-display-sm font-black text-gray-900 mb-2">Récapitulatif</h2>
      <p className="text-body-md text-gray-400 mb-8">Vérifiez les informations avant de publier votre annonce.</p>

      {cover && (
        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-8">
          <img src={cover} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="bg-gray-50 rounded-2xl p-5 mb-4">
        <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Logement</p>
        <Row label="Type" value={draft.property_type} />
        <Row label="Adresse" value={`${draft.address}, ${draft.postal_code} ${draft.city}`} />
        <Row label="Surface" value={`${draft.surface_area} m²`} />
        <Row label="Pièces" value={`${draft.rooms} pièce${draft.rooms > 1 ? "s" : ""} · ${draft.bedrooms} chambre${draft.bedrooms > 1 ? "s" : ""} · ${draft.bathrooms} SDB`} />
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 mb-4">
        <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Tarif</p>
        <Row label="Loyer mensuel" value={`${draft.monthly_rent} €`} />
        <Row label="Dépôt" value={draft.deposit ? `${draft.deposit} €` : "—"} />
        <Row label="Charges" value={draft.utilities_included ? "Comprises" : "Non comprises"} />
        <Row label="Disponible dès" value={draft.available_from || "—"} />
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 mb-8">
        <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Description</p>
        <p className="text-body-md font-bold text-gray-900 mb-1">{draft.title}</p>
        <p className="text-body-sm text-gray-500 leading-relaxed line-clamp-3">{draft.description}</p>
      </div>

      <button
        type="button"
        className="w-full py-4 rounded-2xl bg-black text-white font-bold text-body-md hover:bg-gray-800 transition-colors"
        onClick={() => alert("Annonce publiée ! (à brancher sur l'API)")}
      >
        Publier mon annonce
      </button>
    </div>
  );
}
