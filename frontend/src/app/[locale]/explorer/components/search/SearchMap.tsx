"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface SearchMapProps {
  properties: { id: string; latitude: number | null; longitude: number | null; city: string | null; title: string; monthly_rent: number | null }[];
  onSelect: (id: string) => void;
}

const FRANCE_CENTER: [number, number] = [46.6, 2.3];
const DEFAULT_ZOOM = 6;

export default function SearchMap({ properties, onSelect }: SearchMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView(FRANCE_CENTER, DEFAULT_ZOOM);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    const bounds: [number, number][] = [];

    for (const p of properties) {
      if (p.latitude == null || p.longitude == null) continue;
      const pos: [number, number] = [p.latitude, p.longitude];
      bounds.push(pos);

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="display:flex;flex-direction:column;align-items:center;gap:1px">
          <div style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;background:rgba(100,100,100,0.45);border:2px solid rgba(255,255,255,0.6);">
            <img src="/emojis/house-marker.png" style="width:28px;height:28px;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3))" />
          </div>
          <div style="background:#111;color:#fff;font-weight:700;font-size:10px;padding:1px 6px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2)">${p.monthly_rent ?? "?"}€</div>
        </div>`,
        iconAnchor: [20, 30],
        iconSize: [40, 30],
      });

      L.marker(pos, { icon })
        .on("click", () => onSelect(p.id))
        .addTo(map);
    }

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [properties, onSelect]);

  return <div ref={mapRef} className="w-full h-full" />;
}
