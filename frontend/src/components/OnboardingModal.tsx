"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { X, ChevronRight, MapPin, Wallet, Home, Sparkles } from "@/shared/ui/icons";
import { useUpdatePreferencesMutation } from "@/shared/auth/hooks/useAuthMutations";

const PROPERTY_TYPES = ["apartment", "house", "studio", "loft", "room"] as const;
const AMENITY_KEYS = [
  "wifi", "parking", "furnished", "petsAllowed", "balcony", "terrace",
  "elevator", "laundry", "airConditioning", "pool",
] as const;

interface OnboardingModalProps {
  onClose: () => void;
}

export default function OnboardingModal({ onClose }: OnboardingModalProps) {
  const t = useTranslations("onboarding");
  const tSearch = useTranslations("search");
  const tAmenity = useTranslations("amenities");
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [city, setCity] = useState("");
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(3000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const prefsMutation = useUpdatePreferencesMutation();

  const toggleType = useCallback((type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }, []);

  const toggleAmenity = useCallback((amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
    );
  }, []);

  const handleNext = useCallback(() => setStep((s) => s + 1), []);
  const handleSkip = useCallback(() => setStep((s) => s + 1), []);

  const handleFinish = useCallback((listProperty: boolean) => {
    const prefs: Record<string, unknown> = {};
    if (city.trim()) prefs.city = city.trim();
    if (budgetMin > 0) prefs.budget_min = budgetMin;
    if (budgetMax > 0 && budgetMax !== 3000) prefs.budget_max = budgetMax;
    if (selectedTypes.length > 0) prefs.preferred_property_types = selectedTypes;
    if (selectedAmenities.length > 0) prefs.preferred_amenities = selectedAmenities;

    if (Object.keys(prefs).length > 0) {
      prefsMutation.mutate(prefs, {
        onSettled: () => {
          onClose();
          if (listProperty) router.push("/profil/mon-logement");
        },
      });
    } else {
      onClose();
      if (listProperty) router.push("/profil/mon-logement");
    }
  }, [city, budgetMin, budgetMax, selectedTypes, selectedAmenities, onClose, router, prefsMutation]);

  const STEPS = [
    { icon: MapPin, label: t("cityQuestion") },
    { icon: Wallet, label: t("budgetQuestion") },
    { icon: Home, label: t("typeQuestion") },
    { icon: Sparkles, label: t("amenitiesQuestion") },
  ];

  const totalSteps = STEPS.length;
  const isFinal = step >= totalSteps;

  return (
    <div className="fixed inset-0 z-540 flex flex-col justify-end pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={onClose} />
      <div className="w-full bg-white rounded-t-3xl shadow-2xl pointer-events-auto relative max-h-[85vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full bg-white z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 pt-10 pb-8 max-w-md mx-auto">
          {!isFinal && (
            <div className="flex gap-1 mb-6">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= step ? "bg-brand-cyan" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}

          {step === 0 && <StepCity city={city} setCity={setCity} label={STEPS[0].label} placeholder={t("cityPlaceholder")} onNext={handleNext} onSkip={handleSkip} t={t} />}
          {step === 1 && <StepBudget min={budgetMin} max={budgetMax} setMin={setBudgetMin} setMax={setBudgetMax} label={STEPS[1].label} onNext={handleNext} onSkip={handleSkip} t={t} />}
          {step === 2 && <StepTypes selectedTypes={selectedTypes} toggleType={toggleType} label={STEPS[2].label} tSearch={tSearch} onNext={handleNext} onSkip={handleSkip} t={t} />}
          {step === 3 && <StepAmenities selectedAmenities={selectedAmenities} toggleAmenity={toggleAmenity} label={STEPS[3].label} tAmenity={tAmenity} onNext={handleNext} onSkip={handleSkip} t={t} />}
          {isFinal && <StepDone t={t} saving={prefsMutation.isPending} onFinish={handleFinish} />}
        </div>
      </div>
    </div>
  );
}

function StepCity({ city, setCity, label, placeholder, onNext, onSkip, t }: {
  city: string; setCity: (v: string) => void; label: string; placeholder: string;
  onNext: () => void; onSkip: () => void; t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-brand-cyan" />
        </div>
        <h2 className="text-title-sm font-bold text-gray-900">{label}</h2>
      </div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-body-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan mb-6"
      />
      <StepActions onNext={onNext} onSkip={onSkip} t={t} />
    </div>
  );
}

function StepBudget({ min, max, setMin, setMax, label, onNext, onSkip, t }: {
  min: number; max: number; setMin: (v: number) => void; setMax: (v: number) => void;
  label: string; onNext: () => void; onSkip: () => void; t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-brand-purple" />
        </div>
        <h2 className="text-title-sm font-bold text-gray-900">{label}</h2>
      </div>
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="text-body-xs text-gray-500 font-medium mb-1 block">{t("budgetMin")}</label>
          <div className="relative">
            <input
              type="number"
              value={min || ""}
              onChange={(e) => setMin(Number(e.target.value))}
              placeholder="0"
              min={0}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-body-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-cyan pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-body">€</span>
          </div>
        </div>
        <div className="flex-1">
          <label className="text-body-xs text-gray-500 font-medium mb-1 block">{t("budgetMax")}</label>
          <div className="relative">
            <input
              type="number"
              value={max || ""}
              onChange={(e) => setMax(Number(e.target.value))}
              placeholder="3000"
              min={0}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-body-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-cyan pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-body">€</span>
          </div>
        </div>
      </div>
      <StepActions onNext={onNext} onSkip={onSkip} t={t} />
    </div>
  );
}

function StepTypes({ selectedTypes, toggleType, label, tSearch, onNext, onSkip, t }: {
  selectedTypes: string[]; toggleType: (t: string) => void; label: string;
  tSearch: ReturnType<typeof useTranslations>; onNext: () => void; onSkip: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center">
          <Home className="w-5 h-5 text-brand-cyan" />
        </div>
        <h2 className="text-title-sm font-bold text-gray-900">{label}</h2>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {PROPERTY_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => toggleType(type)}
            className={`px-4 py-2.5 rounded-xl text-body font-medium transition-all ${
              selectedTypes.includes(type)
                ? "bg-brand-cyan text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tSearch(type)}
          </button>
        ))}
      </div>
      <StepActions onNext={onNext} onSkip={onSkip} t={t} />
    </div>
  );
}

function StepAmenities({ selectedAmenities, toggleAmenity, label, tAmenity, onNext, onSkip, t }: {
  selectedAmenities: string[]; toggleAmenity: (a: string) => void; label: string;
  tAmenity: ReturnType<typeof useTranslations>; onNext: () => void; onSkip: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-brand-purple" />
        </div>
        <h2 className="text-title-sm font-bold text-gray-900">{label}</h2>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {AMENITY_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => toggleAmenity(key)}
            className={`px-4 py-2.5 rounded-xl text-body font-medium transition-all ${
              selectedAmenities.includes(key)
                ? "bg-brand-purple text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tAmenity(key)}
          </button>
        ))}
      </div>
      <StepActions onNext={onNext} onSkip={onSkip} t={t} />
    </div>
  );
}

function StepDone({ t, saving, onFinish }: {
  t: ReturnType<typeof useTranslations>; saving: boolean;
  onFinish: (listProperty: boolean) => void;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-brand-cyan to-brand-purple flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-title-lg font-black text-gray-900 mb-2">{t("allSet")}</h2>
      <p className="text-body text-gray-500 mb-8 leading-relaxed">{t("allSetSub")}</p>
      <button
        type="button"
        disabled={saving}
        onClick={() => onFinish(true)}
        className="w-full py-4 bg-black text-white font-bold text-body-lg rounded-2xl hover:bg-gray-800 transition-colors mb-3 disabled:opacity-50"
      >
        {t("listProperty")}
      </button>
      <button
        type="button"
        disabled={saving}
        onClick={() => onFinish(false)}
        className="w-full py-3 text-gray-500 font-medium text-body hover:text-gray-700 transition-colors disabled:opacity-50"
      >
        {t("startExploring")}
      </button>
    </div>
  );
}

function StepActions({ onNext, onSkip, t }: {
  onNext: () => void; onSkip: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onSkip}
        className="flex-1 py-3.5 text-gray-500 font-medium text-body hover:text-gray-700 transition-colors"
      >
        {t("skip")}
      </button>
      <button
        type="button"
        onClick={onNext}
        className="flex-1 py-3.5 bg-black text-white font-bold text-body rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
      >
        <span>{t("next")}</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
