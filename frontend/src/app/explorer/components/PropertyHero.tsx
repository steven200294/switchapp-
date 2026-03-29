"use client";

import { ChevronLeft, Heart, Share2 } from "lucide-react";

interface PropertyHeroProps {
  coverImg: string;
  onBack: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
}

export default function PropertyHero({
  coverImg,
  onBack,
  onFavorite,
  isFavorited,
}: PropertyHeroProps) {
  return (
    <div className="relative w-full h-[45vh] md:h-[50vh] min-h-[350px]">
      <img src={coverImg} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />

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
            <Heart
              className={`w-5 h-5 ${isFavorited ? "fill-brand-purple text-brand-purple" : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
