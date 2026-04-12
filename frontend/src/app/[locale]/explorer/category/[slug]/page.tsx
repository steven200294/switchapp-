"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ChevronLeft } from "@/shared/ui/icons";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useCategoryPage } from "@/app/[locale]/explorer/hooks/useProperties";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/app/[locale]/favoris/hooks/useFavorites";
import PropertyListingCard from "@/shared/ui/PropertyListingCard";
import PropertyCardSkeleton from "@/app/[locale]/explorer/components/PropertyCardSkeleton";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const TITLE_KEY_MAP: Record<string, string> = {
  favorites: "topPicks",
  newest: "newest",
  "budget-friendly": "budgetFriendly",
  furnished: "furnishedReady",
  "large-spaces": "largeSpaces",
  "pet-friendly": "petFriendly",
  "for-you": "forYou",
  "in-budget": "inBudget",
  "your-type": "yourType",
  "near-you": "nearYou",
};

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const city = searchParams.get("city") ?? undefined;
  const t = useTranslations("explorer");
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  const [page, setPage] = useState(1);
  const { data, isLoading } = useCategoryPage(slug, page, city);
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

  const onOpen = useCallback((id: string) => router.push(`/explorer/${id}`), [router]);

  const titleKey = data?.title_key ?? TITLE_KEY_MAP[slug] ?? slug;
  const isCityCategory = slug.startsWith("city-") || titleKey === "inCity" || titleKey === "nearYou";
  const displayCity = data?.city ?? city ?? slug.replace("city-", "").replace(/-/g, " ");
  const title = isCityCategory ? t(titleKey, { city: displayCity }) : t(titleKey);
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto pt-36 md:pt-48 pb-6 px-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => router.push("/explorer")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-title-lg md:text-display-xs font-bold text-gray-900">{title}</h1>
            {data && (
              <p className="text-body-sm text-gray-500">
                {t("categoryCount", { count: data.total })}
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }, (_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {data?.properties.map((p) => (
                <PropertyListingCard
                  key={p.id}
                  property={p}
                  onOpen={onOpen}
                  isFavorited={favIds.has(p.id)}
                  onToggleFavorite={onToggleFav}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-body-sm font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-200 transition-colors"
                >
                  {t("prevPage")}
                </button>
                <span className="text-body-sm text-gray-500 px-3">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-body-sm font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-200 transition-colors"
                >
                  {t("nextPage")}
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
