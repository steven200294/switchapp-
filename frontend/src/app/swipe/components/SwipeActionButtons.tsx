"use client";

import { X, Heart, Star, Undo2 } from "@/shared/ui/icons";

interface SwipeActionButtonsProps {
  onNope: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export default function SwipeActionButtons({ onNope, onLike, onSuperLike, onUndo, canUndo }: SwipeActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-3 md:gap-5 w-full max-w-[360px] md:max-w-[420px]">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 active:scale-95 hover:-translate-y-1 hover:shadow-yellow-500/20 transition-all duration-200 disabled:opacity-40 disabled:hover:translate-y-0"
      >
        <Undo2 className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <button
        onClick={onNope}
        className="w-16 h-16 md:w-18 md:h-18 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-gray-400 hover:text-red-500 active:scale-95 hover:-translate-y-1 hover:border-red-100 hover:shadow-red-500/20 transition-all duration-200"
      >
        <X className="w-7 h-7 md:w-8 md:h-8" />
      </button>

      <button
        onClick={onLike}
        className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-linear-to-tr from-brand-cyan to-brand-purple rounded-full text-white active:scale-95 hover:-translate-y-1 transition-all duration-200 shadow-[0_0_18px_rgba(0,191,255,0.4),0_0_18px_rgba(138,43,226,0.4)] hover:shadow-[0_0_28px_rgba(0,191,255,0.6),0_0_28px_rgba(138,43,226,0.6)]"
      >
        <Heart className="w-8 h-8 md:w-10 md:h-10 fill-white" />
      </button>

      <button
        onClick={onSuperLike}
        className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-brand-purple hover:bg-purple-50 active:scale-95 hover:-translate-y-1 hover:shadow-brand-purple/20 transition-all duration-200"
      >
        <Star className="w-6 h-6 md:w-7 md:h-7 fill-brand-purple" />
      </button>
    </div>
  );
}
