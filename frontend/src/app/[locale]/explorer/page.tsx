"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import SearchModal from "@/app/[locale]/explorer/components/search/SearchModal";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useFeed, useProperties } from "@/app/[locale]/explorer/hooks/useProperties";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/app/[locale]/favoris/hooks/useFavorites";
import PropertyCardSkeleton from "@/app/[locale]/explorer/components/PropertyCardSkeleton";
import FeedSection from "@/app/[locale]/explorer/components/FeedSection";
import PromoBanner from "@/app/[locale]/explorer/components/PromoBanner";
import ProposeModal from "@/components/ProposeModal";
import EmptyState from "@/shared/ui/EmptyState";
import { Search } from "@/shared/ui/icons";

const BANNER_ROTATION = ["verify-profile", "exchange-tips", "invite-friends", "complete-listing", "platform-stats"] as const;
const BANNER_INTERVAL = 3;

export default function ExplorerPage() {
  const tExplorer = useTranslations("explorer");
  const [showSearch, setShowSearch] = useState(false);
  const [showPropose, setShowPropose] = useState(true);
  const { isLoggedIn } = useAuthStore();
  const { data: favorites } = useFavorites(isLoggedIn);
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();

  const favIds = useMemo(
    () => new Set((favorites ?? []).map((f: { property_id: string }) => f.property_id)),
    [favorites],
  );

  const onToggleFav = useCallback((id: string) => {
    if (!isLoggedIn) return;
    if (favIds.has(id)) removeFav.mutate(id);
    else addFav.mutate(id);
  }, [isLoggedIn, favIds, addFav, removeFav]);

  const { data: feed, isLoading } = useFeed();
  const { data: fallback } = useProperties();
  const categories = feed?.categories ?? [];
  const hasContent = categories.length > 0 || (fallback?.properties?.length ?? 0) > 0;

  const feedWithBanners = useMemo(() => {
    const items: React.ReactNode[] = [];
    let bannerIdx = 0;
    for (let i = 0; i < categories.length; i++) {
      items.push(
        <FeedSection key={categories[i].slug} category={categories[i]} favIds={favIds} onToggleFav={onToggleFav} />,
      );
      if ((i + 1) % BANNER_INTERVAL === 0 && bannerIdx < BANNER_ROTATION.length) {
        items.push(<PromoBanner key={`b-${bannerIdx}`} variant={BANNER_ROTATION[bannerIdx]} />);
        bannerIdx++;
      }
    }
    return items;
  }, [categories, favIds, onToggleFav]);

  return (
    <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0" style={{ overflowX: "clip" }}>
      <Header onSearchClick={() => setShowSearch(true)} />
      <main className="flex-1 w-full max-w-6xl mx-auto pt-36 md:pt-48 pb-6">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 px-6">
            {Array.from({ length: 8 }, (_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : !hasContent ? (
          <div className="px-6">
            <EmptyState
              icon={<Search className="w-8 h-8 text-gray-400" />}
              title={tExplorer("noResults")}
              description={tExplorer("noResultsSub")}
            />
          </div>
        ) : (
          <div className="space-y-10">{feedWithBanners}</div>
        )}
      </main>
      <BottomNav />
      {showSearch && <SearchModal properties={fallback?.properties ?? []} onClose={() => setShowSearch(false)} />}
      {showPropose && <ProposeModal onClose={() => setShowPropose(false)} />}
    </div>
  );
}
