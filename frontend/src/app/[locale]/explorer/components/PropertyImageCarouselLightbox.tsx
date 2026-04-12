"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft } from "@/shared/ui/icons";

interface PropertyImageCarouselLightboxProps {
  images: string[];
  current: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export default function PropertyImageCarouselLightbox({
  images,
  current,
  onClose,
  onSelectIndex,
}: PropertyImageCarouselLightboxProps) {
  const tCommon = useTranslations("common");

  return (
    <div className="fixed inset-0 z-600 bg-black flex flex-col" onClick={onClose}>
      <div className="flex items-center justify-between px-4 py-4 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label={tCommon("close")}
          className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-white/70 text-sm">
          {current + 1} / {images.length}
        </span>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 min-h-0" onClick={(e) => e.stopPropagation()}>
        <img src={images[current]} alt="" className="max-w-full max-h-full object-contain" />
      </div>

      {images.length > 1 && (
        <div className="shrink-0 px-4 py-4 flex gap-2 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectIndex(i)}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === current ? "border-white" : "border-transparent opacity-50"
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
