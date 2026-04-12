"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

const LOCALE_META: { code: Locale; flag: string; labelKey: "french" | "english" }[] = [
  { code: "fr", flag: "🇫🇷", labelKey: "french" },
  { code: "en", flag: "🇬🇧", labelKey: "english" },
];

export default function LangueSettingsPage() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function handleSelect(locale: Locale) {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax`;
    router.replace(pathname, { locale });
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <Link href="/profil/parametres" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:left-auto md:w-full md:max-w-2xl h-full bg-white shadow-2xl flex flex-col md:animate-page-slide-right animate-page-slide-up overflow-hidden">
        <header className="px-5 py-4 flex items-center justify-start sticky top-0 bg-white/95 backdrop-blur-sm z-10 w-full mb-2">
          <Link href="/profil/parametres" scroll={false} aria-label={tCommon("back")} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 lg:px-10 pb-12">
          <h1 className="text-display font-bold text-gray-900 tracking-tight mb-2">{t("languageTitle")}</h1>
          <p className="text-body-md text-gray-500 mb-8">{t("languageDescription")}</p>

          <div className="flex flex-col gap-3">
            {LOCALE_META.map((lang) => {
              const isActive = currentLocale === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    isActive
                      ? "border-brand-cyan bg-brand-cyan/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="text-display-xs">{lang.flag}</span>
                  <span className="text-body-lg font-semibold text-gray-900 flex-1 text-left">
                    {t(lang.labelKey)}
                  </span>
                  {isActive && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-brand-cyan" aria-hidden>
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
