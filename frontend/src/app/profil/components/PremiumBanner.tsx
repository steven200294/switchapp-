"use client";

import { ChevronRight, Crown } from "@/shared/ui/icons";

export default function PremiumBanner() {
  return (
    <div className="w-full md:max-w-[400px] rounded-[1.5rem] bg-gradient-to-br from-brand-dark to-brand-dark-alt p-5 md:p-6 text-white shadow-xl relative overflow-hidden shrink-0 border border-white/10 group mb-8 md:mb-0 flex flex-col justify-between h-auto md:h-[220px]">
      <div className="relative z-10 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <Crown className="w-5 h-5 text-brand-cyan" aria-hidden />
        </div>
        <div>
          <h4 className="text-title-sm font-bold text-white leading-tight mb-2 tracking-tight">
            Démarquez-vous. Sortez du lot.
          </h4>
          <p className="text-body-sm text-gray-400 font-medium mb-5 leading-snug">
            Découvrez qui vous a liké et profitez des Swipes illimités & Boosts mensuels.
          </p>
        </div>
      </div>
      <button
        type="button"
        className="relative z-10 mt-auto w-full flex items-center justify-between group/btn transition-all active:scale-[0.98]"
      >
        <span className="font-bold text-body-md text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple tracking-wide">
          Découvrir les avantages
        </span>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover/btn:bg-white/20 group-hover/btn:translate-x-1 transition-all">
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} aria-hidden />
        </div>
      </button>
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-brand-cyan/20 via-brand-purple/20 to-transparent rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none" />
    </div>
  );
}
