"use client";

import type { ListingDraft } from "../page";
import { useTranslations } from "next-intl";

interface Props { draft: ListingDraft; update: (d: Partial<ListingDraft>) => void; onNext: () => void; onPrev: () => void; }

const PROPERTY_TYPE_KEYS: Record<string, "summaryTypeAppartement" | "summaryTypeMaison" | "summaryTypeStudio" | "summaryTypeLoft" | "summaryTypeChambre"> = {
  appartement: "summaryTypeAppartement",
  maison: "summaryTypeMaison",
  studio: "summaryTypeStudio",
  loft: "summaryTypeLoft",
  chambre: "summaryTypeChambre",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-body-sm text-gray-400 font-medium">{label}</span>
      <span className="text-body-sm font-bold text-gray-900 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export default function StepSummary({ draft }: Props) {
  const t = useTranslations("listing");
  const tCommon = useTranslations("common");
  const cover = draft.photos[0] ? URL.createObjectURL(draft.photos[0]) : null;
  const typeKey = PROPERTY_TYPE_KEYS[draft.property_type];
  const typeLabel = typeKey ? t(typeKey) : draft.property_type;

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-display-sm font-black text-gray-900 mb-2">{t("summaryTitle")}</h2>
      <p className="text-body-md text-gray-400 mb-8">{t("summarySubtitle")}</p>

      {cover && (
        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-8">
          <img src={cover} alt={t("summaryCoverAlt")} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="bg-gray-50 rounded-2xl p-5 mb-4">
        <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-3">{t("sectionProperty")}</p>
        <Row label={t("rowType")} value={typeLabel} />
        <Row label={t("rowAddress")} value={`${draft.address}, ${draft.postal_code} ${draft.city}`} />
        <Row label={t("rowSurface")} value={`${draft.surface_area} ${tCommon("sqm")}`} />
        <Row label={t("rowRooms")} value={t("rowRoomsSummary", { rooms: draft.rooms, bedrooms: draft.bedrooms, bathrooms: draft.bathrooms })} />
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 mb-4">
        <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-3">{t("sectionPricing")}</p>
        <Row label={t("rowRent")} value={`${draft.monthly_rent} ${tCommon("currency")}`} />
        <Row label={t("rowDeposit")} value={draft.deposit ? `${draft.deposit} ${tCommon("currency")}` : "—"} />
        <Row label={t("rowUtilities")} value={draft.utilities_included ? t("utilitiesYes") : t("utilitiesNo")} />
        <Row label={t("rowAvailableFrom")} value={draft.available_from || "—"} />
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 mb-8">
        <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-3">{t("sectionDescription")}</p>
        <p className="text-body-md font-bold text-gray-900 mb-1">{draft.title}</p>
        <p className="text-body-sm text-gray-500 leading-relaxed line-clamp-3">{draft.description}</p>
      </div>

      <button
        type="button"
        className="w-full py-4 rounded-2xl bg-black text-white font-bold text-body-md hover:bg-gray-800 transition-colors"
        onClick={() => alert(t("publishAlert"))}
      >
        {t("publishButton")}
      </button>
    </div>
  );
}
