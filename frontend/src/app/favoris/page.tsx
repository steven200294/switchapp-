"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MapPin, Maximize, Bed, Trash2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ConnectionModal from "@/components/ConnectionModal";
import { useAuthStore } from "@/shared/stores/auth.store";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { listFavorites, removeFavorite, type FavoriteItem } from "@/modules/favorites/favorites.service";
import { useState } from "react";

function FavoriteCard({ fav, onRemove }: { fav: FavoriteItem; onRemove: () => void }) {
  const p = fav.property;
  const coverImg = p.cover_image || p.photos[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fit=crop&w=800&q=80";

  return (
    <div className="group relative">
      <Link href={`/explorer/${p.id}`} className="block">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
          <img
            src={coverImg}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {p.monthly_rent != null && p.monthly_rent > 0 && (
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
              <span className="text-[14px] font-black text-gray-900">{p.monthly_rent}&euro;</span>
              <span className="text-[12px] text-gray-500 font-medium">/mois</span>
            </div>
          )}
        </div>

        <div className="px-1">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#00BFFF]" />
            <span className="text-[13px] font-bold text-gray-900">
              {p.city}{p.district ? `, ${p.district}` : ""}
            </span>
          </div>
          <h3 className="text-[15px] font-semibold text-gray-800 leading-snug mb-1 line-clamp-1">
            {p.title}
          </h3>
          <div className="flex items-center gap-3 text-[13px] text-gray-500 font-medium">
            {p.surface_area != null && p.surface_area > 0 && (
              <span className="flex items-center gap-1">
                <Maximize className="w-3.5 h-3.5" />
                {p.surface_area}m&sup2;
              </span>
            )}
            {p.rooms != null && p.rooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5" />
                {p.rooms} pcs
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
        className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 transition-colors group/btn"
      >
        <Heart className="w-4.5 h-4.5 text-red-500 fill-red-500" />
      </button>
    </div>
  );
}

export default function FavorisPage() {
  const { isLoggedIn, isLoading: authLoading } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.FAVORITES,
    queryFn: listFavorites,
    enabled: isLoggedIn && !authLoading,
  });

  const removeMutation = useMutation({
    mutationFn: (propertyId: string) => removeFavorite(propertyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES }),
  });

  if (!authLoading && !isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0">
        <div className="hidden md:block">
          <Header />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Vos favoris</h1>
          <p className="text-gray-500 text-[15px] mb-8 max-w-sm">
            Connectez-vous pour sauvegarder vos logements pr&eacute;f&eacute;r&eacute;s.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white font-bold px-8 py-4 rounded-full text-[16px] shadow-lg hover:scale-105 transition-transform"
          >
            Se connecter
          </button>
        </main>
        <BottomNav />
        {showAuth && <ConnectionModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0">
      <div className="hidden md:block">
        <Header />
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-6">
        <h1 className="text-[28px] md:text-[32px] font-black text-gray-900 mb-2 tracking-tight">
          Favoris
        </h1>
        <p className="text-gray-500 text-[14px] font-medium mb-8">
          {isLoading ? "Chargement..." : `${favorites.length} logement${favorites.length > 1 ? "s" : ""} sauvegard&eacute;${favorites.length > 1 ? "s" : ""}`}
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
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-[20px] font-bold text-gray-900 mb-2">Aucun favori</h3>
            <p className="text-gray-500 text-[15px] max-w-sm mx-auto">
              Explorez les logements et appuyez sur le c&oelig;ur pour les sauvegarder ici.
            </p>
          </div>
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
  );
}
