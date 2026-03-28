"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Bed, Maximize, Heart, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { listProperties, type Property } from "@/modules/properties/properties.service";

function PropertyCard({ property }: { property: Property }) {
  const coverImg = property.cover_image || property.photos[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fit=crop&w=800&q=80";

  return (
    <Link href={`/explorer/${property.id}`} className="group block">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
        <img
          src={coverImg}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <button
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <Heart className="w-4.5 h-4.5 text-gray-600" />
        </button>
        {property.monthly_rent != null && property.monthly_rent > 0 && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
            <span className="text-[14px] font-black text-gray-900">{property.monthly_rent}&euro;</span>
            <span className="text-[12px] text-gray-500 font-medium">/mois</span>
          </div>
        )}
      </div>

      <div className="px-1">
        <div className="flex items-center gap-1.5 mb-1">
          <MapPin className="w-3.5 h-3.5 text-[#00BFFF]" />
          <span className="text-[13px] font-bold text-gray-900">
            {property.city}{property.district ? `, ${property.district}` : ""}
          </span>
        </div>
        <h3 className="text-[15px] font-semibold text-gray-800 leading-snug mb-1 line-clamp-1">
          {property.title}
        </h3>
        <div className="flex items-center gap-3 text-[13px] text-gray-500 font-medium">
          {property.surface_area != null && property.surface_area > 0 && (
            <span className="flex items-center gap-1">
              <Maximize className="w-3.5 h-3.5" />
              {property.surface_area}m&sup2;
            </span>
          )}
          {property.rooms != null && property.rooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {property.rooms} pi&egrave;ce{property.rooms > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {property.owner && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {property.owner.avatar_url ? (
                <img src={property.owner.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold text-gray-400">
                  {(property.owner.full_name || "?")[0]}
                </span>
              )}
            </div>
            <span className="text-[12px] text-gray-500 font-medium">
              {property.owner.full_name || "Utilisateur"}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] rounded-2xl bg-gray-200 mb-3" />
      <div className="px-1">
        <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-32" />
      </div>
    </div>
  );
}

export default function ExplorerPage() {
  const [searchCity, setSearchCity] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.PROPERTIES, activeSearch],
    queryFn: () => listProperties({
      limit: 20,
      ...(activeSearch ? { city: activeSearch } : {}),
    }),
  });

  const properties = data?.properties ?? [];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setActiveSearch(searchCity.trim());
  }

  return (
    <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-6">
        {/* Mobile search bar */}
        <form onSubmit={handleSearch} className="md:hidden mb-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Rechercher une ville..."
              className="flex-1 bg-transparent outline-none text-[15px] text-gray-900 placeholder-gray-400 font-medium"
            />
            {searchCity && (
              <button type="submit" className="shrink-0 bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white text-[13px] font-bold px-4 py-1.5 rounded-full">
                Go
              </button>
            )}
          </div>
        </form>

        {/* Section title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[24px] md:text-[28px] font-black text-gray-900 tracking-tight">
              {activeSearch ? `Logements \u00e0 ${activeSearch}` : "Logements disponibles"}
            </h1>
            <p className="text-[14px] text-gray-500 font-medium mt-1">
              {isLoading ? "Chargement..." : `${data?.total ?? 0} logement${(data?.total ?? 0) > 1 ? "s" : ""} disponible${(data?.total ?? 0) > 1 ? "s" : ""}`}
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-[14px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
        </div>

        {/* Quick filter pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {["Tous", "Paris", "Lyon", "Marseille", "Bordeaux"].map((city) => {
            const isActive = (city === "Tous" && !activeSearch) || activeSearch === city;
            return (
              <button
                key={city}
                onClick={() => {
                  setActiveSearch(city === "Tous" ? "" : city);
                  setSearchCity(city === "Tous" ? "" : city);
                }}
                className={`px-5 py-2 min-w-max rounded-full text-[14px] font-semibold transition-all ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>

        {/* Property grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-[20px] font-bold text-gray-900 mb-2">Aucun logement trouv&eacute;</h3>
            <p className="text-gray-500 text-[15px] max-w-sm mx-auto">
              {activeSearch
                ? `Aucun logement disponible \u00e0 ${activeSearch}. Essayez une autre ville.`
                : "Aucun logement disponible pour le moment."}
            </p>
            {activeSearch && (
              <button
                onClick={() => { setActiveSearch(""); setSearchCity(""); }}
                className="mt-4 text-[#8A2BE2] font-bold text-[15px] hover:underline"
              >
                Voir tous les logements
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
