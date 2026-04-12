"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Home, ChevronRight, AlertTriangle } from "@/shared/ui/icons";
import type { MyProperty } from "../types/property.types";

interface Props {
  property: MyProperty | null | undefined;
  isLoading: boolean;
}

function CompletionRing({ percent }: { percent: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  const color = percent >= 70 ? "var(--brand-cyan)" : "var(--color-amber-400)";

  return (
    <svg width={44} height={44} className="shrink-0">
      <circle cx={22} cy={22} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-gray-100" />
      <circle
        cx={22} cy={22} r={r} fill="none"
        stroke={color} strokeWidth={3}
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
        className="transition-all duration-500"
      />
      <text x={22} y={23} textAnchor="middle" dominantBaseline="central" className="fill-gray-900 text-[11px] font-bold">
        {percent}%
      </text>
    </svg>
  );
}

export default function PropertyStatusCard({ property, isLoading }: Props) {
  const t = useTranslations("profile");
  const router = useRouter();
  const [popoverDismissed, setPopoverDismissed] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto md:max-w-none bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-100 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-100 rounded w-40" />
            <div className="h-4 bg-gray-50 rounded w-56" />
          </div>
        </div>
      </div>
    );
  }

  const hasProperty = !!property;
  const isDraft = hasProperty && property.status === "draft";
  const completion = property?.completion ?? 0;
  const showPopover = hasProperty && !isDraft && completion < 70 && !popoverDismissed;

  return (
    <div className="relative w-full max-w-2xl mx-auto md:max-w-none">
      {showPopover && (
        <div className="absolute -top-2 left-6 right-6 -translate-y-full z-10">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 shadow-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-semibold text-amber-800">{t("finishListing")}</p>
              <p className="text-caption text-amber-600 leading-snug mt-0.5">{t("finishListingDesc")}</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setPopoverDismissed(true); }}
              className="w-6 h-6 rounded-full hover:bg-amber-100 flex items-center justify-center text-amber-400 hover:text-amber-600 transition-colors shrink-0 outline-none"
              aria-label="Dismiss"
            >
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="ml-12 w-3 h-3 bg-amber-50 border-b border-r border-amber-200 rotate-45 -mt-1.5" />
        </div>
      )}

      <button
        type="button"
        onClick={() => router.push("/profil/mon-logement")}
        className="w-full bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:border-brand-cyan/30 hover:shadow-md transition-all group text-left flex items-center gap-4"
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          hasProperty
            ? "bg-brand-cyan/10 group-hover:bg-brand-cyan/15"
            : "bg-linear-to-br from-brand-cyan/10 to-brand-purple/10 group-hover:from-brand-cyan/15 group-hover:to-brand-purple/15"
        }`}>
          <Home className={`w-6 h-6 ${hasProperty ? "text-brand-cyan" : "text-brand-purple"}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-gray-900 text-body-lg truncate">
              {hasProperty ? t("myProperty") : t("listProperty")}
            </h3>
            {hasProperty && (
              <span className={`text-body-2xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                isDraft
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}>
                {isDraft ? t("propertyDraft") : t("propertyPublished")}
              </span>
            )}
          </div>
          <p className="text-body text-gray-500 font-medium leading-tight truncate">
            {hasProperty ? t("myPropertyDesc") : t("listPropertyDesc")}
          </p>
        </div>

        {hasProperty ? (
          <CompletionRing percent={completion} />
        ) : (
          <div className="hidden sm:flex w-8 h-8 rounded-full bg-gray-50 items-center justify-center text-gray-400 group-hover:bg-brand-cyan/10 group-hover:text-brand-cyan transition-colors shrink-0" aria-hidden>
            <ChevronRight className="w-5 h-5" />
          </div>
        )}
      </button>
    </div>
  );
}
