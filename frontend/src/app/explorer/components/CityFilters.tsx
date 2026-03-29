"use client";

interface CityFiltersProps {
  cities: string[];
  activeSearch: string;
  onSelect: (city: string) => void;
}

export default function CityFilters({ cities, activeSearch, onSelect }: CityFiltersProps) {
  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
      {cities.map((city) => {
        const isActive = (city === "Tous" && !activeSearch) || activeSearch === city;
        return (
          <button
            key={city}
            type="button"
            onClick={() => onSelect(city)}
            className={`px-5 py-2 min-w-max rounded-full text-body font-semibold transition-all ${
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
  );
}
