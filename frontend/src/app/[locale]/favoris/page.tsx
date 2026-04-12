"use client";

import { useTranslations } from "next-intl";
import { Heart } from "@/shared/ui/icons";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import AuthGate from "@/shared/ui/AuthGate";
import EmptyState from "@/shared/ui/EmptyState";
import PropertyCardSkeleton from "@/app/[locale]/explorer/components/PropertyCardSkeleton";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useFavorites, useRemoveFavorite } from "@/app/[locale]/favoris/hooks/useFavorites";
import PropertyListingCard from "@/shared/ui/PropertyListingCard";

export default function FavorisPage() {
  const t = useTranslations("favorites");
  const { isLoggedIn, isLoading: authLoading } = useAuthStore();
  const { data: favorites = [], isLoading } = useFavorites(isLoggedIn && !authLoading);
  const removeMutation = useRemoveFavorite();

  return (
    <AuthGate
      icon={<Heart className="w-10 h-10 text-white" />}
      title={t("authTitle")}
      description={t("authDescription")}
    >
      <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0" style={{ overflowX: "clip" }}>
        <Header />

        <main className="flex-1 w-full max-w-6xl mx-auto pt-36 md:pt-48 pb-6 px-6">
          <h1 className="text-title-sm md:text-title-lg font-bold text-gray-900 mb-6">
            {t("title")}
            {!isLoading && favorites.length > 0 && (
              <span className="text-gray-400 font-medium ml-2 text-body-lg">{favorites.length}</span>
            )}
          </h1>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <EmptyState
              icon={<Heart className="w-10 h-10 text-gray-300" />}
              title={t("emptyTitle")}
              description={t("emptyDescription")}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {favorites.map((fav) => (
                <PropertyListingCard
                  key={fav.id}
                  property={fav.property}
                  mode="favorite"
                  onRemove={() => removeMutation.mutate(fav.property_id)}
                />
              ))}
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </AuthGate>
  );
}
