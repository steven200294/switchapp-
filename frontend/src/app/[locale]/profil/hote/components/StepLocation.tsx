"use client";

import type { ListingDraft } from "../page";
import { useTranslations } from "next-intl";

interface Props { draft: ListingDraft; update: (d: Partial<ListingDraft>) => void; onNext: () => void; onPrev: () => void; }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all";

export default function StepLocation({ draft, update, onNext }: Props) {
  const t = useTranslations("listing");
  const tCommon = useTranslations("common");
  const valid = draft.city.trim().length > 0 && draft.address.trim().length > 0;

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-display-sm font-black text-gray-900 mb-2">{t("locationTitle")}</h2>
      <p className="text-body-md text-gray-400 mb-8">{t("locationSubtitle")}</p>

      <div className="space-y-5 mb-10">
        <Field label={t("addressLabel")}>
          <input type="text" value={draft.address} onChange={(e) => update({ address: e.target.value })} placeholder={t("addressPlaceholder")} className={inputCls} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={t("postalCodeLabel")}>
            <input type="text" value={draft.postal_code} onChange={(e) => update({ postal_code: e.target.value })} placeholder={t("postalCodePlaceholder")} className={inputCls} />
          </Field>
          <Field label={t("cityLabel")}>
            <input type="text" value={draft.city} onChange={(e) => update({ city: e.target.value })} placeholder={t("cityPlaceholder")} className={inputCls} />
          </Field>
        </div>

        <Field label={t("districtLabel")}>
          <input type="text" value={draft.district} onChange={(e) => update({ district: e.target.value })} placeholder={t("districtPlaceholder")} className={inputCls} />
        </Field>
      </div>

      <button type="button" onClick={onNext} disabled={!valid} className="w-full py-4 rounded-2xl bg-black text-white font-bold text-body-md hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
        {tCommon("next")}
      </button>
    </div>
  );
}
