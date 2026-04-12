"use client";

import { ChevronLeft, ChevronRight } from "@/shared/ui/icons";

interface PropertyCarouselDesktopNavProps {
  imageCount: number;
  current: number;
  scrollTo: (index: number) => void;
}

const btn =
  "hidden md:flex absolute top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-md text-gray-900 hover:bg-white disabled:opacity-30 transition-all";

export default function PropertyCarouselDesktopNav({
  imageCount,
  current,
  scrollTo,
}: PropertyCarouselDesktopNavProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => scrollTo(current - 1)}
        disabled={current === 0}
        className={`${btn} left-3`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollTo(current + 1)}
        disabled={current === imageCount - 1}
        className={`${btn} right-3`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </>
  );
}
