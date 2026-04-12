"use client";

import { useRef, useState } from "react";
import { resolveStorageUrl } from "@/shared/constants/theme";
import PropertyImageCarouselStage from "@/app/[locale]/explorer/components/PropertyImageCarouselStage";
import PropertyImageCarouselLightbox from "@/app/[locale]/explorer/components/PropertyImageCarouselLightbox";

interface PropertyImageCarouselProps {
  photos: string[];
  onBack: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
  hideOverlays?: boolean;
}

export default function PropertyImageCarousel({
  photos,
  onBack,
  onFavorite,
  isFavorited,
  hideOverlays = false,
}: PropertyImageCarouselProps) {
  const images = photos.length > 0 ? photos.map((p) => resolveStorageUrl(p)) : [resolveStorageUrl("")];
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollTo(index: number) {
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    setCurrent(clamped);
    scrollRef.current?.children[clamped]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setCurrent(idx);
  }

  function openLightboxAt(index: number) {
    setCurrent(index);
    setLightbox(true);
  }

  return (
    <>
      <PropertyImageCarouselStage
        images={images}
        current={current}
        scrollRef={scrollRef}
        onScroll={handleScroll}
        onImageOpen={openLightboxAt}
        onBack={onBack}
        onFavorite={onFavorite}
        isFavorited={isFavorited}
        scrollTo={scrollTo}
        hideOverlays={hideOverlays}
      />

      {images.length > 1 && (
        <div className="flex gap-2 px-6 py-4 overflow-x-auto scrollbar-hide">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                i === current ? "border-brand-purple shadow-md" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <PropertyImageCarouselLightbox
          images={images}
          current={current}
          onClose={() => setLightbox(false)}
          onSelectIndex={setCurrent}
        />
      )}
    </>
  );
}
