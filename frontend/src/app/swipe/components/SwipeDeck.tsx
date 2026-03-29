"use client";

import { AnimatePresence } from "framer-motion";
import { Heart } from "@/shared/ui/icons";
import EmptyState from "@/shared/ui/EmptyState";
import type { DeckProperty } from "../types/swipe.types";
import SwipeCard from "./SwipeCard";

interface SwipeDeckProps {
  deck: DeckProperty[];
  localDeckIndex: number;
  deckLoading: boolean;
  onSwipe: (dir: "like" | "nope") => void;
  onTap: (id: string) => void;
  onRefresh: () => void;
}

export default function SwipeDeck({
  deck,
  localDeckIndex,
  deckLoading,
  onSwipe,
  onTap,
  onRefresh,
}: SwipeDeckProps) {
  const currentCards = deck.slice(localDeckIndex, localDeckIndex + 3);
  const isEmpty = !deckLoading && currentCards.length === 0;

  return (
    <div className="relative w-full max-w-[92vw] md:max-w-[400px] h-[72vh] md:max-h-[600px] md:min-h-[450px] mb-8 lg:mb-12">
      {deckLoading ? (
        <div className="absolute inset-0 bg-gray-100 rounded-4xl flex items-center justify-center animate-pulse">
          <div className="text-gray-400 font-bold text-title">Chargement...</div>
        </div>
      ) : isEmpty ? (
        <div className="absolute inset-0 bg-gray-100 rounded-4xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8">
          <EmptyState
            icon={<Heart className="w-10 h-10 text-gray-400" />}
            title="Plus aucun logement !"
            description="Revenez plus tard ou élargissez vos critères de recherche."
            action={
              <button
                type="button"
                onClick={onRefresh}
                className="px-6 py-2 bg-white border border-gray-200 rounded-full font-bold text-gray-900 hover:bg-gray-50 text-body"
              >
                Actualiser
              </button>
            }
          />
        </div>
      ) : (
        <AnimatePresence>
          {[...currentCards].reverse().map((property, reversedIndex) => {
            const stackIndex = currentCards.length - 1 - reversedIndex;
            return (
              <SwipeCard
                key={property.id}
                property={property}
                isTop={stackIndex === 0}
                stackIndex={stackIndex}
                onSwipe={onSwipe}
                onTap={() => onTap(property.id)}
              />
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
