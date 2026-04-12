"use client";

import type { ListingDraft } from "../page";
import { useTranslations } from "next-intl";
import { Wifi, ParkingCircle, Snowflake, Tv, WashingMachine, Refrigerator, Microwave, Coffee, Sofa, Dog } from "@/shared/ui/icons";

interface Props { draft: ListingDraft; update: (d: Partial<ListingDraft>) => void; onNext: () => void; onPrev: () => void; }

const AMENITIES = [
  { value: "wifi", messageKey: "wifi", Icon: Wifi },
  { value: "parking", messageKey: "parking", Icon: ParkingCircle },
  { value: "climatisation", messageKey: "airConditioning", Icon: Snowflake },
  { value: "television", messageKey: "television", Icon: Tv },
  { value: "lave-linge", messageKey: "washingMachine", Icon: WashingMachine },
  { value: "refrigerateur", messageKey: "refrigerator", Icon: Refrigerator },
  { value: "micro-ondes", messageKey: "microwave", Icon: Microwave },
  { value: "machine-cafe", messageKey: "coffeeMaker", Icon: Coffee },
  { value: "meuble", messageKey: "furnishedAmenity", Icon: Sofa },
  { value: "animaux", messageKey: "petsAmenity", Icon: Dog },
] as const;

export default function StepAmenities({ draft, update, onNext }: Props) {
  const t = useTranslations("listing");
  const tCommon = useTranslations("common");
  function toggle(value: string) {
    const current = draft.amenities;
    update({ amenities: current.includes(value) ? current.filter((a) => a !== value) : [...current, value] });
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-display-sm font-black text-gray-900 mb-2">{t("amenitiesTitle")}</h2>
      <p className="text-body-md text-gray-400 mb-8">{t("amenitiesSubtitle")}</p>

      <div className="grid grid-cols-2 gap-3 mb-10">
        {AMENITIES.map(({ value, messageKey, Icon }) => {
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
              <Icon size={20} className={active ? "text-black" : "text-gray-400"} aria-hidden />
              <span className={`text-body-sm font-semibold ${active ? "text-gray-900" : "text-gray-500"}`}>{t(messageKey)}</span>
            </button>
          );
        })}
      </div>

      <button type="button" onClick={onNext} className="w-full py-4 rounded-2xl bg-black text-white font-bold text-body-md hover:bg-gray-800 transition-colors">
        {tCommon("next")}
      </button>
    </div>
  );
}
