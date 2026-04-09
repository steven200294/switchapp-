"use client";

import { ChevronLeft, Heart, Share2 } from "@/shared/ui/icons";
import PropertyCarouselDesktopNav from "@/app/explorer/components/PropertyCarouselDesktopNav";

interface PropertyCarouselStageOverlaysProps {
  imageCount: number;
  current: number;
  onBack: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
  scrollTo: (index: number) => void;
}

export default function PropertyCarouselStageOverlays({
  imageCount,
  current,
  onBack,
  onFavorite,
  isFavorited,
  scrollTo,
}: PropertyCarouselStageOverlaysProps) {
  const multi = imageCount > 1;

  return (
    <>
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-12 md:pt-6">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full shadow-md text-gray-900 hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full shadow-md text-gray-700 hover:bg-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onFavorite}
            className="w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full shadow-md text-gray-700 hover:bg-white transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorited ? "fill-brand-cyan text-brand-cyan" : ""}`} />
          </button>
        </div>
      </div>

      {multi && <PropertyCarouselDesktopNav imageCount={imageCount} current={current} scrollTo={scrollTo} />}

      {multi && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {Array.from({ length: imageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all ${i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      )}

      {multi && (
        <span className="absolute bottom-3 right-4 text-xs text-white/80 font-medium bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
          {current + 1}/{imageCount}
        </span>
      )}
    </>
  );
}
