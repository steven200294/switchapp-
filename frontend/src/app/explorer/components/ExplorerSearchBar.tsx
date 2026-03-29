"use client";

import type { FormEvent } from "react";
import { Search } from "lucide-react";

interface ExplorerSearchBarProps {
  searchCity: string;
  setSearchCity: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function ExplorerSearchBar({
  searchCity,
  setSearchCity,
  onSubmit,
}: ExplorerSearchBarProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="md:hidden flex gap-2 mb-6"
    >
      <label className="sr-only" htmlFor="explorer-search-city">
        Ville
      </label>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-cyan pointer-events-none" />
        <input
          id="explorer-search-city"
          type="search"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          placeholder="Rechercher une ville…"
          className="w-full pl-10 pr-3 py-3 rounded-2xl bg-gray-100 text-body text-gray-900 placeholder:text-gray-400 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white text-body font-bold shadow-lg shadow-brand-purple/20"
      >
        Go
      </button>
    </form>
  );
}
