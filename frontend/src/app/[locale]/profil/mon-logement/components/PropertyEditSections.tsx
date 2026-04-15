"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { MyProperty } from "../../types/property.types";

interface Props {
  property: MyProperty;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
  savedField?: string | null;
}

const ALL_AMENITIES = [
  "wifi", "parking", "balcon", "terrasse", "cave", "ascenseur",
  "gardien", "interphone", "piscine", "salle_sport",
  "buanderie", "climatisation", "chauffage_central",
] as const;

const AMENITY_LABEL_KEYS: Record<string, string> = {
  wifi: "wifi", parking: "parking", balcon: "balcony", terrasse: "terrace",
  cave: "cellar", ascenseur: "elevator", gardien: "caretaker",
  interphone: "intercom", piscine: "pool", salle_sport: "gym",
  buanderie: "laundry", climatisation: "airConditioning",
  chauffage_central: "centralHeating",
};

function ToggleRow({ label, active, onToggle, disabled, saved }: {
  label: string; active: boolean; onToggle: () => void; disabled: boolean; saved?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className="w-full flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
    >
      <span className="text-body text-gray-700 font-medium flex items-center gap-1">
        {label}
        {saved && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-600 animate-fade-in">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
          </svg>
        )}
      </span>
      <div className={`w-11 h-6 rounded-full relative transition-colors ${active ? "bg-brand-cyan" : "bg-gray-300"}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${active ? "left-5.5" : "left-0.5"}`} />
      </div>
    </button>
  );
}

export default function PropertyEditSections({ property: p, onSave, saving, savedField }: Props) {
  const t = useTranslations("propertyManage");
  const tAmenity = useTranslations("amenities");
  const [editingAmenities, setEditingAmenities] = useState(false);
  const [amenitiesDraft, setAmenitiesDraft] = useState<string[]>(p.amenities);

  const toggleCondition = (field: string, current: boolean | null) => {
    onSave({ [field]: !current });
  };

  const saveAmenities = () => {
    onSave({ amenities: amenitiesDraft });
    setEditingAmenities(false);
  };

  return (
    <>
      <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-4">
        <h3 className="text-body-lg font-bold text-gray-900 mb-1">{t("conditions")}</h3>
        <ToggleRow label={t("furnished")} active={!!p.furnished} onToggle={() => toggleCondition("furnished", p.furnished)} disabled={saving} saved={savedField === "furnished"} />
        <ToggleRow label={t("petsAllowed")} active={!!p.pets_allowed} onToggle={() => toggleCondition("pets_allowed", p.pets_allowed)} disabled={saving} saved={savedField === "pets_allowed"} />
        <ToggleRow label={t("smokerAllowed")} active={!!p.smoking_allowed} onToggle={() => toggleCondition("smoking_allowed", p.smoking_allowed)} disabled={saving} saved={savedField === "smoking_allowed"} />
        <ToggleRow label={t("utilitiesIncluded")} active={!!p.utilities_included} onToggle={() => toggleCondition("utilities_included", p.utilities_included)} disabled={saving} saved={savedField === "utilities_included"} />
      </div>

      <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-body-lg font-bold text-gray-900">{t("amenities")}</h3>
          {!editingAmenities ? (
            <button type="button" onClick={() => { setAmenitiesDraft(p.amenities); setEditingAmenities(true); }} className="text-body-sm font-semibold text-brand-cyan outline-none">
              {t("edit")}
            </button>
          ) : (
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditingAmenities(false)} className="text-body-sm font-semibold text-gray-400 outline-none">{t("cancel")}</button>
              <button type="button" onClick={saveAmenities} disabled={saving} className="text-body-sm font-semibold text-brand-cyan outline-none">{t("save")}</button>
            </div>
          )}
        </div>

        {editingAmenities ? (
          <div className="flex flex-wrap gap-2">
            {ALL_AMENITIES.map((a) => {
              const selected = amenitiesDraft.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAmenitiesDraft(prev => selected ? prev.filter(x => x !== a) : [...prev, a])}
                  className={`px-3 py-1.5 rounded-full text-body-sm font-medium transition-colors outline-none ${
                    selected ? "bg-brand-cyan text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {AMENITY_LABEL_KEYS[a] ? tAmenity(AMENITY_LABEL_KEYS[a]) : a.replace(/_/g, " ")}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {p.amenities.length > 0 ? p.amenities.map((a) => (
              <span key={a} className="px-3 py-1.5 bg-gray-50 rounded-full text-body-sm font-medium text-gray-700">
                {AMENITY_LABEL_KEYS[a] ? tAmenity(AMENITY_LABEL_KEYS[a]) : a.replace(/_/g, " ")}
              </span>
            )) : (
              <span className="text-body-sm text-gray-400 italic">{t("noValue")}</span>
            )}
          </div>
        )}
      </div>
    </>
  );
}
