"use client";

import { useState, useMemo, type ReactNode } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useProperties } from "@/app/explorer/hooks/useProperties";
import PropertyCard from "@/app/explorer/components/PropertyCard";
import PropertyCardCompact from "@/app/explorer/components/PropertyCardCompact";
import PropertyCardSkeleton from "@/app/explorer/components/PropertyCardSkeleton";
import HorizontalSection from "@/app/explorer/components/HorizontalSection";
import PromoBanner from "@/app/explorer/components/PromoBanner";
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

function useFeed(properties: Property[]): ReactNode[] {
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
          <PropertyCardCompact key={p.id} property={p} />
        ))}
      </HorizontalSection>
    );

    contentBlocks.push(
      <HorizontalSection key="newest" title="Nouveautés" subtitle="Récemment ajoutés">
        {sorted.slice(0, 6).map((p) => (
          <PropertyCardCompact key={p.id} property={p} />
        ))}
      </HorizontalSection>
    );

    for (const [city, list] of cityGroups) {
      contentBlocks.push(
        <HorizontalSection key={`city-${city}`} title={`À ${city}`} subtitle={`${list.length} logements`}>
          {list.slice(0, 8).map((p) => (
            <PropertyCardCompact key={p.id} property={p} />
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
            <PropertyCard key={p.id} property={p} />
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
  }, [properties]);
}

export default function ExplorerPage() {
  const [activeSearch] = useState("");

  const { data, isLoading } = useProperties(activeSearch || undefined);
  const properties = data?.properties ?? [];
  const feed = useFeed(properties);

  const showFeed = !activeSearch && feed.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0 overflow-x-hidden">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto pt-6 md:pt-8 pb-6 ">

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
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
