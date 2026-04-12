"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { StepComponentProps } from "../types";

interface PhotonFeature {
  properties: {
    name?: string; housenumber?: string; street?: string; postcode?: string;
    city?: string; state?: string; country?: string; countrycode?: string;
  };
  geometry: { coordinates: [number, number] };
}

export interface AddressValue {
  address: string; city: string; postalCode: string; country: string;
  countryCode: string; district: string; lat: number; lng: number; display: string;
}

function extractAddress(f: PhotonFeature): AddressValue {
  const p = f.properties;
  const street = [p.housenumber, p.street ?? p.name].filter(Boolean).join(" ");
  const [lng, lat] = f.geometry.coordinates;
  return {
    address: street, city: p.city ?? "", postalCode: p.postcode ?? "",
    country: p.country ?? "", countryCode: p.countrycode ?? "",
    district: p.state ?? "", lat, lng,
    display: [street, p.postcode, p.city, p.country].filter(Boolean).join(", "),
  };
}

export default function AddressStep({ value, onChange, onSubmit, labels }: StepComponentProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressValue[]>([]);
  const [loading, setLoading] = useState(false);
  const selected = value as AddressValue | undefined;
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback(async (q: string) => {
    if (q.length < 3) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=fr`);
      const json = await res.json();
      setResults((json.features ?? []).map(extractAddress));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const handleInput = (v: string) => {
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(v), 300);
  };

  if (selected) {
    return (
      <div>
        <div className="bg-brand-chat-bg rounded-2xl p-4 space-y-1">
          <p className="text-body-md font-bold text-gray-800">{selected.address || selected.city}</p>
          <p className="text-body-sm text-gray-500">{selected.postalCode} {selected.city} · {selected.country}</p>
        </div>
        <div className="flex gap-3 mt-3">
          <button type="button" onClick={() => onChange(undefined)} className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-body-md font-semibold text-gray-600 active:scale-95 transition-all">
            {labels.edit}
          </button>
          <button type="button" onClick={onSubmit} className="flex-1 py-3 rounded-2xl bg-brand-dark text-white text-body-md font-bold active:scale-95 transition-all">
            {labels.confirm}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center bg-brand-chat-bg rounded-2xl px-4 py-3 gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
          <g transform="translate(4,4)"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></g>
        </svg>
        <input type="text" value={query} onChange={(e) => handleInput(e.target.value)} placeholder="12 rue de la Paix, Paris..." className="flex-1 bg-transparent outline-none text-body-md text-gray-800 placeholder:text-gray-400" autoFocus />
        {loading && <div className="w-4 h-4 border-2 border-gray-300 border-t-brand-cyan rounded-full animate-spin" />}
      </div>
      {results.length > 0 && (
        <div className="mt-2 space-y-1">
          {results.map((addr, i) => (
            <button key={i} type="button" onClick={() => { onChange(addr); setResults([]); setQuery(""); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-brand-chat-bg transition-colors">
              <p className="text-body-md font-medium text-gray-800">{addr.address || addr.city}</p>
              <p className="text-body-sm text-gray-400">{addr.postalCode} {addr.city}, {addr.country}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
