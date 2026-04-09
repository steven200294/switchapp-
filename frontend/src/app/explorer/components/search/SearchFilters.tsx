"use client";

import { Bed, Sofa, Maximize, Dog, FileText, MapPin } from "@/shared/ui/icons";
import type { IconProps } from "@/shared/ui/icons/types";

interface Filters {
  property_type: string | null;
  max_rent: number | null;
  min_surface: number | null;
  rooms: number | null;
  furnished: boolean | null;
  pets_allowed: boolean | null;
  utilities_included: boolean | null;
}

interface SearchFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClose: () => void;
  onReset: () => void;
}

type IconComponent = React.ComponentType<IconProps>;

const PROPERTY_TYPES: { label: string; Icon: IconComponent }[] = [
  { label: "Appartement", Icon: MapPin },
  { label: "Maison", Icon: MapPin },
  { label: "Studio", Icon: Sofa },
  { label: "Loft", Icon: Maximize },
  { label: "Chambre", Icon: Bed },
];

const RENTS = [500, 800, 1000, 1500, 2000];
const SURFACES = [20, 30, 50, 80, 100];
const ROOMS = [1, 2, 3, 4, 5];

const OPTIONS: { key: keyof Filters; label: string; Icon: IconComponent }[] = [
  { key: "furnished", label: "Meublé", Icon: Sofa },
  { key: "pets_allowed", label: "Animaux acceptés", Icon: Dog },
  { key: "utilities_included", label: "Charges comprises", Icon: FileText },
];

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${active ? "bg-gray-900" : "bg-gray-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${active ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function Pills<T extends number>({ options, value, onChange, format }: {
  options: T[];
  value: T | null;
  onChange: (v: T | null) => void;
  format: (v: T, i: number) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt, i) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(active ? null : opt)}
            className={`px-4 py-2 rounded-full text-body-sm font-semibold border transition-all ${
              active
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
            }`}
          >
            {format(opt, i)}
          </button>
        );
      })}
    </div>
  );
}

export default function SearchFilters({ filters, onChange, onClose, onReset }: SearchFiltersProps) {
  return (
    <div className="absolute inset-0 z-[9999] bg-white flex flex-col animate-filter-open">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
        <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-title-sm font-bold text-gray-900">Filtres</span>
        <button type="button" onClick={onReset} className="text-body-sm text-gray-400 hover:text-gray-900 transition-colors font-medium underline underline-offset-2">
          Réinitialiser
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 py-2 space-y-7">

          <section>
            <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Type de logement</p>
            <div className="grid grid-cols-3 gap-2">
              {PROPERTY_TYPES.map(({ label, Icon }) => {
                const active = filters.property_type === label.toLowerCase();
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onChange({ ...filters, property_type: active ? null : label.toLowerCase() })}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all ${
                      active ? "border-gray-900 bg-gray-50" : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={22} className={active ? "text-gray-900" : "text-gray-400"} />
                    <span className={`text-body-xs font-semibold ${active ? "text-gray-900" : "text-gray-500"}`}>{label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Loyer maximum</p>
            <Pills
              options={RENTS}
              value={filters.max_rent as typeof RENTS[number] | null}
              onChange={(v) => onChange({ ...filters, max_rent: v })}
              format={(v, i) => i === RENTS.length - 1 ? `${v}€+` : `${v}€`}
            />
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Surface minimum</p>
            <Pills
              options={SURFACES}
              value={filters.min_surface as typeof SURFACES[number] | null}
              onChange={(v) => onChange({ ...filters, min_surface: v })}
              format={(v, i) => i === SURFACES.length - 1 ? `${v}m²+` : `${v}m²`}
            />
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Pièces minimum</p>
            <Pills
              options={ROOMS}
              value={filters.rooms as typeof ROOMS[number] | null}
              onChange={(v) => onChange({ ...filters, rooms: v })}
              format={(v, i) => i === ROOMS.length - 1 ? `${v}+` : `${v}`}
            />
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Options</p>
            <div className="space-y-4">
              {OPTIONS.map(({ key, label, Icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-gray-500" />
                    <span className="text-body-md font-semibold text-gray-800">{label}</span>
                  </div>
                  <Toggle active={filters[key] === true} onToggle={() => onChange({ ...filters, [key]: filters[key] === true ? null : true })} />
                </div>
              ))}
            </div>
          </section>

          <div className="h-4" />
        </div>
      </div>

      <div className="shrink-0 px-5 py-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 rounded-2xl text-white font-bold text-body-md transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(90deg, var(--brand-cyan), var(--brand-purple))" }}
        >
          Voir les résultats
        </button>
      </div>
    </div>
  );
}
