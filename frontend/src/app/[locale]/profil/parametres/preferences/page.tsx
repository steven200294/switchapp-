"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Loader2, Check } from "@/shared/ui/icons";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useMyProfile, useUpdatePreferencesMutation } from "@/shared/auth/hooks/useAuthMutations";

const PROPERTY_TYPES = ["apartment", "house", "studio", "loft", "room"] as const;
const AMENITY_KEYS = [
  "wifi", "parking", "furnished", "petsAllowed", "balcony", "terrace",
  "elevator", "laundry", "airConditioning", "pool",
] as const;

export default function SearchPreferencesPage() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const tSearch = useTranslations("search");
  const tAmenity = useTranslations("amenities");
  const { isLoggedIn } = useAuthStore();

  const { data: profile, isLoading } = useMyProfile(isLoggedIn);
  const mutation = useUpdatePreferencesMutation();

  const [city, setCity] = useState("");
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(0);
  const [surfaceMin, setSurfaceMin] = useState(0);
  const [types, setTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (profile && !hydrated) {
      setCity(profile.city ?? "");
      setBudgetMin(profile.budget_min ?? 0);
      setBudgetMax(profile.budget_max ?? 0);
      setSurfaceMin(profile.surface_min ?? 0);
      setTypes(profile.preferred_property_types ?? []);
      setAmenities(profile.preferred_amenities ?? []);
      setHydrated(true);
    }
  }, [profile, hydrated]);

  const handleSave = () => {
    const data: Record<string, unknown> = {
      city: city.trim() || null,
      budget_min: budgetMin || null,
      budget_max: budgetMax || null,
      surface_min: surfaceMin || null,
      preferred_property_types: types.length > 0 ? types : [],
      preferred_amenities: amenities.length > 0 ? amenities : [],
    };
    mutation.mutate(data);
  };

  const toggleType = (type: string) =>
    setTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      <Link href="/profil/parametres" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:left-auto md:w-full md:max-w-2xl h-full bg-white shadow-2xl flex flex-col md:animate-page-slide-right animate-page-slide-up overflow-hidden">
        <header className="px-5 py-4 flex items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100">
          <Link href="/profil/parametres" scroll={false} aria-label={tCommon("back")} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-title-sm font-bold text-gray-900 ml-3">{t("prefsTitle")}</h1>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 lg:px-10 py-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8">
              <p className="text-body text-gray-500">{t("prefsSubtitle")}</p>

              <FieldSection label={t("prefsCityLabel")}>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t("prefsCityPlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-body-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan"
                />
              </FieldSection>

              <FieldSection label={t("prefsBudgetLabel")}>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-body-xs text-gray-500 font-medium mb-1 block">{t("prefsBudgetMin")}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={budgetMin || ""}
                        onChange={(e) => setBudgetMin(Number(e.target.value))}
                        placeholder="0"
                        min={0}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-body-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-cyan pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-body">€</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-body-xs text-gray-500 font-medium mb-1 block">{t("prefsBudgetMax")}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={budgetMax || ""}
                        onChange={(e) => setBudgetMax(Number(e.target.value))}
                        placeholder="3000"
                        min={0}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-body-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-cyan pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-body">€</span>
                    </div>
                  </div>
                </div>
              </FieldSection>

              <FieldSection label={t("prefsSurfaceLabel")}>
                <div className="relative w-40">
                  <input
                    type="number"
                    value={surfaceMin || ""}
                    onChange={(e) => setSurfaceMin(Number(e.target.value))}
                    placeholder={t("prefsSurfacePlaceholder")}
                    min={0}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-body-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-cyan pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-body">m²</span>
                </div>
              </FieldSection>

              <FieldSection label={t("prefsTypeLabel")}>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={`px-4 py-2.5 rounded-xl text-body font-medium transition-all ${
                        types.includes(type)
                          ? "bg-brand-cyan text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tSearch(type)}
                    </button>
                  ))}
                </div>
              </FieldSection>

              <FieldSection label={t("prefsAmenitiesLabel")}>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleAmenity(key)}
                      className={`px-4 py-2.5 rounded-xl text-body font-medium transition-all ${
                        amenities.includes(key)
                          ? "bg-brand-purple text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tAmenity(key)}
                    </button>
                  ))}
                </div>
              </FieldSection>

              {mutation.isSuccess && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <Check className="w-5 h-5" />
                  <span className="text-body font-medium">{t("prefsSaved")}</span>
                </div>
              )}

              {mutation.isError && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-body font-medium rounded-xl px-4 py-3">
                  {mutation.error.message}
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={mutation.isPending}
                className="w-full py-3.5 rounded-2xl bg-black text-white font-bold text-body-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {mutation.isPending ? t("prefsSaving") : t("prefsSave")}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FieldSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-body-md font-semibold text-gray-900 mb-3">{label}</h3>
      {children}
    </div>
  );
}
