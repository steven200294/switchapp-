"use client";

import { useRef, useState } from "react";
import { resolveStorageUrl } from "@/shared/constants/theme";
import PropertyImageCarouselStage from "@/app/explorer/components/PropertyImageCarouselStage";
import PropertyImageCarouselLightbox from "@/app/explorer/components/PropertyImageCarouselLightbox";

interface PropertyImageCarouselProps {
  photos: string[];
  onBack: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
}

export default function PropertyImageCarousel({
  photos,
  onBack,
  onFavorite,
  isFavorited,
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
      />
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
