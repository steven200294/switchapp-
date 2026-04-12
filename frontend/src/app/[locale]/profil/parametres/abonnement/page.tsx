"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Check, Crown, Zap } from "@/shared/ui/icons";

const FEATURE_KEYS = ["subscriptionFeature1", "subscriptionFeature2", "subscriptionFeature3", "subscriptionFeature4", "subscriptionFeature5", "subscriptionFeature6"] as const;

const PLANS = [
  { labelKey: "oneMonth", price: "9,99€", popular: false as const, saveKey: null as null },
  { labelKey: "sixMonths", price: "7,99€", popular: true as const, saveKey: "planSave20" as const },
  { labelKey: "twelveMonths", price: "5,99€", popular: false as const, saveKey: "planSave40" as const },
];

export default function AbonnementPage() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <Link href="/profil/parametres" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:left-auto md:w-full md:max-w-2xl h-full bg-white shadow-2xl flex flex-col md:animate-page-slide-right animate-page-slide-up overflow-hidden">
        <header className="px-5 py-4 flex items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100">
          <Link href="/profil/parametres" scroll={false} aria-label={tCommon("back")} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-title-sm font-bold text-gray-900 ml-3">{t("subscriptionTitle")}</h1>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 lg:px-10 py-8">

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 mb-8">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <Zap size={20} className="text-gray-500" aria-hidden />
            </div>
            <div>
              <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest">{t("currentPlan")}</p>
              <p className="text-title-sm font-bold text-gray-900">{t("freePlan")}</p>
            </div>
          </div>

          <div className="w-full bg-brand-dark rounded-3xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-cyan/20 via-brand-purple/20 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Crown size={20} className="text-brand-cyan" aria-hidden />
                <span className="text-body-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple uppercase tracking-widest">{t("premiumName")}</span>
              </div>

              <h2 className="text-display-xs font-black text-white mb-6 leading-tight">
                {t("subscriptionBoostLine1")}
                <br />
                {t("subscriptionBoostLine2")}
              </h2>

              <ul className="space-y-3 mb-8">
                {FEATURE_KEYS.map((key) => (
                  <li key={key} className="flex items-center gap-3 text-gray-300 text-body-sm font-medium">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-brand-cyan" aria-hidden />
                    </span>
                    {t(key)}
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {PLANS.map((plan) => (
                  <button
                    key={plan.labelKey}
                    type="button"
                    className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                      plan.popular ? "border-brand-cyan bg-white/10" : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-cyan text-black text-body-2xs font-black px-2 py-0.5 rounded-full whitespace-nowrap">{t("popular")}</span>
                    )}
                    {plan.saveKey && (
                      <span className="text-brand-cyan text-body-2xs font-black mb-1">{t(plan.saveKey)}</span>
                    )}
                    <span className="text-white font-black text-title-sm">{plan.price}</span>
                    <span className="text-gray-400 text-body-2xs">{tCommon("perMonth")}</span>
                    <span className="text-gray-500 text-body-2xs mt-0.5">{t(plan.labelKey)}</span>
                  </button>
                ))}
              </div>

              <button type="button" className="w-full py-4 rounded-2xl bg-white font-black text-body-md transition-all hover:opacity-90 active:scale-[0.98]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">
                  {t("startNow")}
                </span>
              </button>
            </div>
          </div>

          <p className="text-center text-body-sm text-gray-400">{t("noCommitment")}</p>
        </main>
      </div>
    </div>
  );
}
