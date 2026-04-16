"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import HorizontalSection from "./HorizontalSection";
import PropertyListingCard from "@/shared/ui/PropertyListingCard";
import SeeAllCard from "./SeeAllCard";
import type { FeedCategory } from "../types/properties.types";

const SUB_KEY_MAP: Record<string, string> = {
  topPicks: "topPicksSub",
  newest: "newestSub",
  budgetFriendly: "budgetFriendlySub",
  furnishedReady: "furnishedReadySub",
  largeSpaces: "largeSpacesSub",
  petFriendly: "petFriendlySub",
  forYou: "forYouSub",
  inBudget: "inBudgetSub",
  yourType: "yourTypeSub",
  nearYou: "nearYouSub",
  inCity: "citySub",
};

interface FeedSectionProps {
  category: FeedCategory;
  favIds: Set<string>;
  onToggleFav: (id: string) => void;
}

export default function FeedSection({ category, favIds, onToggleFav }: FeedSectionProps) {
  const t = useTranslations("explorer");
  const router = useRouter();

  const onOpen = useCallback(
    (id: string) => router.push(`/explorer/${id}`),
    [router],
  );

  const titleParams = category.city ? { city: category.city } : undefined;
  const title = t(category.title_key, titleParams);

  const subKey = SUB_KEY_MAP[category.title_key];
  const subParams: Record<string, string | number> = { count: category.total };
  if (category.city) subParams.city = category.city;
  const subtitle = subKey ? t(subKey, subParams) : undefined;

  const categoryUrl = buildCategoryUrl(category);

  return (
    <HorizontalSection title={title} subtitle={subtitle}>
      {category.properties.map((p) => (
        <PropertyListingCard
          key={p.id}
          property={p}
          variant="compact"
          onOpen={onOpen}
          isFavorited={favIds.has(p.id)}
          onToggleFavorite={onToggleFav}
        />
      ))}
      <SeeAllCard
        label={t("seeAll")}
        categoryTitle={title}
        total={category.total}
        href={categoryUrl}
      />
    </HorizontalSection>
  );
}

function buildCategoryUrl(category: FeedCategory): string {
  const base = `/explorer/category/${category.slug}`;
  if (category.city) return `${base}?city=${encodeURIComponent(category.city)}`;
  return base;
}
