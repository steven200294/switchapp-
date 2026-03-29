"use client";

import { useState, type FormEvent } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useProperties } from "@/app/explorer/hooks/useProperties";
import PropertyCard from "@/app/explorer/components/PropertyCard";
import PropertyCardSkeleton from "@/app/explorer/components/PropertyCardSkeleton";
import ExplorerSearchBar from "@/app/explorer/components/ExplorerSearchBar";
import CityFilters from "@/app/explorer/components/CityFilters";
import EmptyState from "@/shared/ui/EmptyState";

const QUICK_CITIES = ["Tous", "Paris", "Lyon", "Marseille", "Bordeaux"];

export default function ExplorerPage() {
  const [searchCity, setSearchCity] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data, isLoading } = useProperties(activeSearch || undefined);
  const properties = data?.properties ?? [];
  const total = data?.total ?? 0;
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchCity.trim());
  };
  const handleCitySelect = (city: string) => {
    setActiveSearch(city === "Tous" ? "" : city);
    setSearchCity(city === "Tous" ? "" : city);
  };
  const clearSearch = () => {
    setActiveSearch("");
    setSearchCity("");
  };
  return (
    <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-title-lg md:text-display-sm font-black text-gray-900 tracking-tight">
              {activeSearch ? `Logements à ${activeSearch}` : "Logements disponibles"}
            </h1>
            <p className="text-body text-gray-500 font-medium mt-1">
              {isLoading ? "Chargement..." : `${total} logement${total > 1 ? "s" : ""} disponible${total > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            type="button"
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-body font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
        </div>
        <ExplorerSearchBar searchCity={searchCity} setSearchCity={setSearchCity} onSubmit={handleSearch} />
        <CityFilters cities={QUICK_CITIES} activeSearch={activeSearch} onSelect={handleCitySelect} />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <EmptyState
            icon={<Search className="w-10 h-10 text-gray-300" />}
            title="Aucun logement trouvé"
            description={activeSearch ? `Aucun logement disponible à ${activeSearch}. Essayez une autre ville.` : "Aucun logement disponible pour le moment."}
            action={activeSearch ? <button type="button" onClick={clearSearch} className="text-brand-purple font-bold text-body-md hover:underline">Voir tous les logements</button> : undefined}
          />
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
