"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { Heart } from "@/shared/ui/icons";
import { useRouter } from "@/i18n/routing";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import AuthGate from "@/shared/ui/AuthGate";
import { useAuthStore } from "@/shared/stores/auth.store";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useSwipeDeck, useSwipeMutation, useUndoSwipe } from "@/app/[locale]/swipe/hooks/useSwipe";
import SwipeDeck from "@/app/[locale]/swipe/components/SwipeDeck";
import SwipeActionButtons from "@/app/[locale]/swipe/components/SwipeActionButtons";
import MatchOverlay from "@/app/[locale]/swipe/components/MatchOverlay";

export default function SwipePage() {
  const t = useTranslations("swipe");
  const { isLoggedIn, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [showMatch, setShowMatch] = useState(false);
  const [localDeckIndex, setLocalDeckIndex] = useState(0);
  const [exitX, setExitX] = useState(400);
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

      setExitX(direction === "like" ? 400 : -400);

      if (direction === "nope") {
        setLocalDeckIndex((prev) => prev + 1);
        return;
      }

      swipeMutation.mutate(
        { propertyId: currentProperty.id, action: direction },
        { onSuccess: () => setLocalDeckIndex((prev) => prev + 1) },
      );
    },
    [deck, localDeckIndex, swipeMutation],
  );
  const handleSuperLike = useCallback(() => {
    const currentProperty = deck[localDeckIndex];
    if (!currentProperty) return;
    setExitX(400);
    swipeMutation.mutate(
      { propertyId: currentProperty.id, action: "super_like" },
      { onSuccess: () => setLocalDeckIndex((prev) => prev + 1) },
    );
  }, [deck, localDeckIndex, swipeMutation]);
  const showActionButtons = !deckLoading && Boolean(deck[localDeckIndex]);
  const onRefresh = useCallback(() => {
    setLocalDeckIndex(0);
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SWIPE_DECK });
  }, [queryClient]);

  // Auto-refresh when running low on cards
  const didAutoRefresh = useRef(false);
  const remainingCards = deck.length - localDeckIndex;
  useEffect(() => {
    if (!deckLoading && remainingCards > 0 && remainingCards < 3 && !didAutoRefresh.current) {
      didAutoRefresh.current = true;
      onRefresh();
    }
    if (remainingCards >= 5) {
      didAutoRefresh.current = false;
    }
  }, [remainingCards, deckLoading, onRefresh]);

  // Auto-refresh when user returns to the tab after 30s+ away
  const lastHiddenAt = useRef(0);
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "hidden") {
        lastHiddenAt.current = Date.now();
      } else if (document.visibilityState === "visible" && Date.now() - lastHiddenAt.current > 30_000) {
        onRefresh();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [onRefresh]);

  return (
    <AuthGate
      icon={<Heart className="w-10 h-10 text-white" />}
      title={t("authTitle")}
      description={t("authDescription")}
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
            exitX={exitX}
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
