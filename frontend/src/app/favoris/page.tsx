"use client";

import { Heart } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import AuthGate from "@/shared/ui/AuthGate";
import EmptyState from "@/shared/ui/EmptyState";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useFavorites, useRemoveFavorite } from "@/app/favoris/hooks/useFavorites";
import FavoriteCard from "@/app/favoris/components/FavoriteCard";

export default function FavorisPage() {
  const { isLoggedIn, isLoading: authLoading } = useAuthStore();
  const { data: favorites = [], isLoading } = useFavorites(isLoggedIn && !authLoading);
  const removeMutation = useRemoveFavorite();

  return (
    <AuthGate
      icon={<Heart className="w-10 h-10 text-white" />}
      title="Vos favoris"
      description="Connectez-vous pour sauvegarder vos logements préférés."
    >
      <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0">
        <div className="hidden md:block">
          <Header />
        </div>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-6">
          <h1 className="text-display-sm md:text-display font-black text-gray-900 mb-2 tracking-tight">
            Favoris
          </h1>
          <p className="text-gray-500 text-body font-medium mb-8">
            {isLoading ? "Chargement..." : `${favorites.length} logement${favorites.length > 1 ? "s" : ""} sauvegardé${favorites.length > 1 ? "s" : ""}`}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] rounded-2xl bg-gray-200 mb-3" />
                  <div className="px-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-200 rounded w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <EmptyState
              icon={<Heart className="w-10 h-10 text-gray-300" />}
              title="Aucun favori"
              description="Explorez les logements et appuyez sur le cœur pour les sauvegarder ici."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {favorites.map((fav) => (
                <FavoriteCard
                  key={fav.id}
                  fav={fav}
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
