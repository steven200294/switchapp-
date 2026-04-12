"use client";

import { useTranslations } from "next-intl";

interface PropertyBottomBarProps {
  monthlyRent: number;
  utilitiesIncluded?: boolean;
  onPropose?: () => void;
}

export default function PropertyBottomBar({ monthlyRent, utilitiesIncluded, onPropose }: PropertyBottomBarProps) {
  const tCommon = useTranslations("common");
  const tProperty = useTranslations("property");

  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 md:px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 flex justify-center"
      style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}
    >
      <div className="w-full max-w-3xl flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <div>
            <span className="text-title-md font-black text-gray-900">{monthlyRent}{tCommon("currency")}</span>
            <span className="text-gray-500 text-body"> {tCommon("perMonth")}</span>
          </div>
          {utilitiesIncluded && (
            <span className="text-body-xs font-bold text-green-600 mt-0.5">
              {tProperty("utilitiesIncluded")}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onPropose}
          className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-bold text-body-lg transition-colors"
        >
          {tProperty("proposeSwitch")}
        </button>
      </div>
    </div>
  );
}
