"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import AuthGate from "@/shared/ui/AuthGate";
import { useAuthStore } from "@/shared/stores/auth.store";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useSwipeDeck, useSwipeMutation, useUndoSwipe } from "@/app/swipe/hooks/useSwipe";
import SwipeDeck from "@/app/swipe/components/SwipeDeck";
import SwipeActionButtons from "@/app/swipe/components/SwipeActionButtons";
import MatchOverlay from "@/app/swipe/components/MatchOverlay";

export default function SwipePage() {
  const { isLoggedIn, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [showMatch, setShowMatch] = useState(false);
  const [localDeckIndex, setLocalDeckIndex] = useState(0);
  const queryClient = useQueryClient();
  const { data: deck = [], isLoading: deckLoading } = useSwipeDeck(isLoggedIn && !authLoading);
  const swipeMutation = useSwipeMutation(() => setShowMatch(true));
  const undoMutation = useUndoSwipe(() => {
    if (localDeckIndex > 0) setLocalDeckIndex((prev) => prev - 1);
  });
  const handleSwipe = useCallback(
    (direction: "like" | "nope") => {
      const currentProperty = deck[localDeckIndex];
      if (!currentProperty) return;
      swipeMutation.mutate({ propertyId: currentProperty.id, action: direction });
      setLocalDeckIndex((prev) => prev + 1);
    },
    [deck, localDeckIndex, swipeMutation],
  );
  const handleSuperLike = useCallback(() => {
    const currentProperty = deck[localDeckIndex];
    if (!currentProperty) return;
    swipeMutation.mutate({ propertyId: currentProperty.id, action: "super_like" });
    setLocalDeckIndex((prev) => prev + 1);
  }, [deck, localDeckIndex, swipeMutation]);
  const showActionButtons = !deckLoading && Boolean(deck[localDeckIndex]);
  const onRefresh = useCallback(() => {
    setLocalDeckIndex(0);
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SWIPE_DECK });
  }, [queryClient]);

  return (
    <AuthGate
      icon={<Heart className="w-10 h-10 text-white" />}
      title="Connectez-vous pour switcher"
      description="Créez un compte ou connectez-vous pour découvrir les logements disponibles et matcher."
    >
      <div className="min-h-screen flex flex-col bg-gray-50 md:bg-white pb-24 md:pb-0 overflow-hidden">
        <div className="hidden md:block border-b border-gray-100 bg-white">
          <Header />
        </div>
        <main className="flex-1 w-full flex flex-col items-center justify-start pt-6 md:pt-10 px-4">
          <SwipeDeck
            deck={deck}
            localDeckIndex={localDeckIndex}
            deckLoading={deckLoading}
            onSwipe={handleSwipe}
            onTap={(id) => router.push(`/explorer/${id}`)}
            onRefresh={onRefresh}
          />
          {showActionButtons && (
            <SwipeActionButtons
              onNope={() => handleSwipe("nope")}
              onLike={() => handleSwipe("like")}
              onSuperLike={handleSuperLike}
              onUndo={() => undoMutation.mutate()}
              canUndo={localDeckIndex > 0}
            />
          )}
        </main>
        <BottomNav />
        {showMatch && <MatchOverlay onClose={() => setShowMatch(false)} />}
      </div>
    </AuthGate>
  );
}
