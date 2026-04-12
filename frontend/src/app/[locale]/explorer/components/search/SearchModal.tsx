"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useRouter } from "@/i18n/routing";
import type { Property } from "@/app/[locale]/explorer/types/properties.types";
import { resolveStorageUrl, pickCover } from "@/shared/constants/theme";
import SearchFilters from "./SearchFilters";

const SearchMap = dynamic(() => import("./SearchMap"), { ssr: false });

interface SearchModalProps {
  properties: Property[];
  onClose: () => void;
}

interface Filters {
  property_type: string | null;
  max_rent: number | null;
  min_surface: number | null;
  rooms: number | null;
  furnished: boolean | null;
  pets_allowed: boolean | null;
  utilities_included: boolean | null;
}

const DEFAULT_FILTERS: Filters = {
  property_type: null, max_rent: null, min_surface: null,
  rooms: null, furnished: null, pets_allowed: null, utilities_included: null,
};

export default function SearchModal({ properties, onClose }: SearchModalProps) {
  const tSearch = useTranslations("search");
  const tCommon = useTranslations("common");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const activeFiltersCount = useMemo(
    () => Object.values(filters).filter((v) => v !== null).length,
    [filters]
  );

  const filtered = useMemo(() => {
    let list = properties;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.city?.toLowerCase().includes(q) ||
        p.title?.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q)
      );
    }
    if (filters.property_type) list = list.filter((p) => p.property_type?.toLowerCase() === filters.property_type);
    if (filters.max_rent) list = list.filter((p) => (p.monthly_rent ?? 0) <= filters.max_rent!);
    if (filters.min_surface) list = list.filter((p) => (p.surface_area ?? 0) >= filters.min_surface!);
    if (filters.rooms) list = list.filter((p) => (p.rooms ?? 0) >= filters.rooms!);
    if (filters.furnished !== null) list = list.filter((p) => p.furnished === filters.furnished);
    if (filters.pets_allowed !== null) list = list.filter((p) => p.pets_allowed === filters.pets_allowed);
    if (filters.utilities_included !== null) list = list.filter((p) => p.utilities_included === filters.utilities_included);
    return list;
  }, [properties, query, filters]);

  const selectedProperty = useMemo(
    () => filtered.find((p) => p.id === selectedId) ?? null,
    [filtered, selectedId]
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setClickCount((c) => c + 1);
  }, []);

  const handleView = useCallback((id: string) => {
    router.push(`/explorer/${id}`);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white md:flex-row md:justify-end md:bg-transparent">
      <div className="hidden md:block absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="search-modal-panel relative z-10 bg-white w-full h-full md:h-full md:w-[75vw] md:max-w-5xl md:shadow-2xl flex flex-col overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} aria-label={tCommon("close")} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tSearch("searchPlaceholder")}
              className="flex-1 h-12 bg-gray-100 rounded-full px-5 text-body-md text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-purple/30"
              autoFocus
            />
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300 text-body-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 12h10M11 18h2" />
              </svg>
              {tSearch("filters")}
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-body-2xs font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="flex flex-col md:h-full md:flex-1 shrink-0 overflow-visible">
            <div className="h-[40vh] md:flex-1">
              <SearchMap properties={filtered} onSelect={handleSelect} />
            </div>

            {selectedProperty && (
              <div key={clickCount} className="shrink-0 -mt-10 px-14 relative z-[1000] animate-fade-in">
                <div className="flex items-center gap-3 border border-gray-200 rounded-2xl p-3 bg-white shadow-lg">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    <img src={resolveStorageUrl(pickCover(selectedProperty))} alt={selectedProperty.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-bold text-gray-900 truncate">{selectedProperty.title}</p>
                    <p className="text-body-xs text-gray-500 truncate">{selectedProperty.city}{selectedProperty.district ? `, ${selectedProperty.district}` : ""}</p>
                    <p className="text-body-sm font-bold text-gray-900 mt-0.5">{selectedProperty.monthly_rent}{tCommon("currency")}<span className="font-normal text-gray-400"> {tCommon("perMonth")}</span></p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleView(selectedProperty.id)}
                    className="shrink-0 px-5 py-2.5 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors text-body-2xs"
                  >
                    {tSearch("viewListing")}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 md:w-[320px] md:flex-none overflow-y-auto scrollbar-hide border-t md:border-t-0 md:border-l border-gray-100">
            <div className="p-4">
              <p className="text-body-sm text-gray-400 font-medium mb-3">{tSearch("propertyCount", { count: filtered.length })}</p>
              <div className="space-y-3">
                {filtered.map((p) => (
                  <button key={p.id} type="button" onClick={() => handleView(p.id)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                    <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img src={resolveStorageUrl(pickCover(p))} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-body-sm font-semibold text-gray-900 truncate">{p.city}{p.district ? `, ${p.district}` : ""}</h4>
                      <p className="text-body-xs text-gray-500 truncate">{p.title}</p>
                      <p className="text-body-sm font-bold text-gray-900 mt-0.5">{p.monthly_rent}{tCommon("currency")}<span className="font-normal text-gray-400"> {tCommon("perMonth")}</span></p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showFilters && (
          <SearchFilters
            filters={filters}
            onChange={setFilters}
            onClose={() => setShowFilters(false)}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        )}
      </div>

    </div>
  );
}
