"use client";

import { useState, useMemo, useCallback, type ReactNode } from "react";
import PropertyModal from "@/app/explorer/components/PropertyModal";
import SearchModal from "@/app/explorer/components/search/SearchModal";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useProperties } from "@/app/explorer/hooks/useProperties";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/app/favoris/hooks/useFavorites";
import PropertyCard from "@/app/explorer/components/PropertyCard";
import PropertyCardCompact from "@/app/explorer/components/PropertyCardCompact";
import PropertyCardSkeleton from "@/app/explorer/components/PropertyCardSkeleton";
import HorizontalSection from "@/app/explorer/components/HorizontalSection";
import PromoBanner from "@/app/explorer/components/PromoBanner";
import ProposeModal from "@/components/ProposeModal";
import type { Property } from "./types/properties.types";


type BannerVariant = "verify-profile" | "complete-listing" | "invite-friends" | "exchange-tips" | "platform-stats";
const BANNER_ROTATION: BannerVariant[] = [
  "verify-profile",
  "exchange-tips",
  "invite-friends",
  "complete-listing",
  "platform-stats",
];
const BANNER_INTERVAL = 3;

function useFeed(properties: Property[], onOpen: (id: string) => void, favIds: Set<string>, onToggleFav: (id: string) => void): ReactNode[] {
  return useMemo(() => {
    if (properties.length === 0) return [];

    const sorted = [...properties].sort(
      (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    );

    const cityCounts = new Map<string, Property[]>();
    for (const p of properties) {
      if (!p.city) continue;
      const list = cityCounts.get(p.city) ?? [];
      list.push(p);
      cityCounts.set(p.city, list);
    }
    const cityGroups = [...cityCounts.entries()]
      .filter(([, list]) => list.length >= 2)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3);

    const contentBlocks: ReactNode[] = [];

    contentBlocks.push(
      <HorizontalSection key="featured" title="Coups de cœur" subtitle="Les plus populaires">
        {properties.slice(0, 6).map((p) => (
          <PropertyCardCompact key={p.id} property={p} onOpen={onOpen} isFavorited={favIds.has(p.id)} onToggleFavorite={onToggleFav} />
        ))}
      </HorizontalSection>
    );

    contentBlocks.push(
      <HorizontalSection key="newest" title="Nouveautés" subtitle="Récemment ajoutés">
        {sorted.slice(0, 6).map((p) => (
          <PropertyCardCompact key={p.id} property={p} onOpen={onOpen} isFavorited={favIds.has(p.id)} onToggleFavorite={onToggleFav} />
        ))}
      </HorizontalSection>
    );

    for (const [city, list] of cityGroups) {
      contentBlocks.push(
        <HorizontalSection key={`city-${city}`} title={`À ${city}`} subtitle={`${list.length} logements`}>
          {list.slice(0, 8).map((p) => (
            <PropertyCardCompact key={p.id} property={p} onOpen={onOpen} isFavorited={favIds.has(p.id)} onToggleFavorite={onToggleFav} />
          ))}
        </HorizontalSection>
      );
    }

    contentBlocks.push(
      <section key="all" className="px-6">
        <h2 className="text-title-sm md:text-title-lg font-bold text-gray-900 mb-4">
          Tous les logements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} onOpen={onOpen} isFavorited={favIds.has(p.id)} onToggleFavorite={onToggleFav} />
          ))}
        </div>
      </section>
    );

    const feed: ReactNode[] = [];
    let bannerIdx = 0;
    for (let i = 0; i < contentBlocks.length; i++) {
      feed.push(contentBlocks[i]);
      if ((i + 1) % BANNER_INTERVAL === 0 && bannerIdx < BANNER_ROTATION.length) {
        feed.push(<PromoBanner key={`banner-${bannerIdx}`} variant={BANNER_ROTATION[bannerIdx]} />);
        bannerIdx++;
      }
    }

    return feed;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, onOpen, favIds, onToggleFav]);
}

export default function ExplorerPage() {
  const [activeSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showPropose, setShowPropose] = useState(true);
  const { isLoggedIn } = useAuthStore();
  const { data: favorites } = useFavorites(isLoggedIn);
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();

  const favIds = useMemo(() => new Set((favorites ?? []).map((f: { property_id: string }) => f.property_id)), [favorites]);

  const onOpen = useCallback((id: string) => setSelectedId(id), []);
  const onToggleFav = useCallback((id: string) => {
    if (!isLoggedIn) return;
    if (favIds.has(id)) { removeFav.mutate(id); } else { addFav.mutate(id); }
  }, [isLoggedIn, favIds, addFav, removeFav]);

  const { data, isLoading } = useProperties(activeSearch || undefined);
  const properties = data?.properties ?? [];
  const feed = useFeed(properties, onOpen, favIds, onToggleFav);

  const showFeed = !activeSearch && feed.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0 overflow-x-hidden">
      <Header onSearchClick={() => setShowSearch(true)} />

      <main className="flex-1 w-full max-w-6xl mx-auto pt-36 md:pt-48 pb-6">

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 px-6">
            {[...Array(8)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="px-6">
          </div>
        ) : showFeed ? (
          <div className="space-y-10">{feed}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 px-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} onOpen={onOpen} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />

      {selectedId && (
        <PropertyModal propertyId={selectedId} onClose={() => setSelectedId(null)} />
      )}

      {showSearch && (
        <SearchModal
          properties={properties}
          onClose={() => setShowSearch(false)}
          onSelectProperty={(id) => { setShowSearch(false); setSelectedId(id); }}
        />
      )}

      {showPropose && <ProposeModal onClose={() => setShowPropose(false)} />}
    </div>
  );
}
