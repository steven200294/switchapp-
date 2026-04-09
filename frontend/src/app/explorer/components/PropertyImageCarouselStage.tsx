"use client";

import type { RefObject } from "react";
import PropertyCarouselStageOverlays from "@/app/explorer/components/PropertyCarouselStageOverlays";

interface PropertyImageCarouselStageProps {
  images: string[];
  current: number;
  scrollRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onImageOpen: (index: number) => void;
  onBack: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
  scrollTo: (index: number) => void;
  hideOverlays?: boolean;
}

export default function PropertyImageCarouselStage({
  images,
  current,
  scrollRef,
  onScroll,
  onImageOpen,
  onBack,
  onFavorite,
  isFavorited,
  scrollTo,
  hideOverlays = false,
}: PropertyImageCarouselStageProps) {
  return (
    <div className="relative w-full h-[45vh] md:h-[50vh] min-h-[350px] overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="shrink-0 w-full h-full snap-center cursor-zoom-in"
            onClick={() => onImageOpen(i)}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {!hideOverlays && (
        <>
          <div className="absolute inset-0 bg-linear-to-t from-gray-900/20 to-transparent pointer-events-none" />
          <PropertyCarouselStageOverlays
            imageCount={images.length}
            current={current}
            onBack={onBack}
            onFavorite={onFavorite}
            isFavorited={isFavorited}
            scrollTo={scrollTo}
          />
        </>
      )}
    </div>
  );
}
