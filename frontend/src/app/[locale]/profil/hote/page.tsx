"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState } from "react";
import StepType from "./components/StepType";
import StepLocation from "./components/StepLocation";
import StepFeatures from "./components/StepFeatures";
import StepAmenities from "./components/StepAmenities";
import StepPhotos from "./components/StepPhotos";
import StepPricing from "./components/StepPricing";
import StepDescription from "./components/StepDescription";
import StepSummary from "./components/StepSummary";

export interface ListingDraft {
  property_type: string;
  city: string;
  district: string;
  postal_code: string;
  address: string;
  surface_area: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  amenities: string[];
  photos: File[];
  monthly_rent: number;
  deposit: number;
  utilities_included: boolean;
  pets_allowed: boolean;
  available_from: string;
  available_until: string;
  title: string;
  description: string;
}

const EMPTY_DRAFT: ListingDraft = {
  property_type: "", city: "", district: "", postal_code: "", address: "",
  surface_area: 0, rooms: 1, bedrooms: 1, bathrooms: 1,
  furnished: false, amenities: [], photos: [],
  monthly_rent: 0, deposit: 0, utilities_included: false, pets_allowed: false,
  available_from: "", available_until: "",
  title: "", description: "",
};

const STEP_KEYS = ["type", "location", "features", "amenities", "photos", "pricing", "description", "summary"] as const;

export default function HotePage() {
  const t = useTranslations("listing");
  const tCommon = useTranslations("common");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ListingDraft>(EMPTY_DRAFT);

  const update = (data: Partial<ListingDraft>) => setDraft((d) => ({ ...d, ...data }));
  const next = () => setStep((s) => Math.min(s + 1, STEP_KEYS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const progress = ((step + 1) / STEP_KEYS.length) * 100;

  const stepProps = { draft, update, onNext: next, onPrev: prev };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <Link href="/profil" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      <div className="absolute inset-0 w-full h-full bg-white shadow-2xl flex flex-col animate-page-slide-right overflow-hidden">
        {/* Header */}
        <header className="px-5 py-4 border-b border-gray-100 flex items-center gap-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10 shrink-0">
          {step > 0 ? (
            <button type="button" onClick={prev} aria-label={tCommon("back")} className="w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          ) : (
            <Link href="/profil" scroll={false} aria-label={tCommon("close")} className="w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </Link>
          )}
          <div className="flex-1">
            <p className="text-body-xs text-gray-400 font-medium mb-1">{t("stepProgress", { current: step + 1, total: STEP_KEYS.length, name: t(`steps.${STEP_KEYS[step]}`) })}</p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </header>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto">
          {step === 0 && <StepType {...stepProps} />}
          {step === 1 && <StepLocation {...stepProps} />}
          {step === 2 && <StepFeatures {...stepProps} />}
          {step === 3 && <StepAmenities {...stepProps} />}
          {step === 4 && <StepPhotos {...stepProps} />}
          {step === 5 && <StepPricing {...stepProps} />}
          {step === 6 && <StepDescription {...stepProps} />}
          {step === 7 && <StepSummary {...stepProps} />}
        </div>
      </div>
    </div>
  );
}
