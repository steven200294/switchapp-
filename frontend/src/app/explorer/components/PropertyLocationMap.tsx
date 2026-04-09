"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyLocationMapProps {
  latitude: number;
  longitude: number;
  city: string;
}

export default function PropertyLocationMap({ latitude, longitude, city }: PropertyLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      boxZoom: false,
      keyboard: false,
    }).setView([latitude, longitude], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
      maxZoom: 19,
    }).addTo(map);

    const icon = L.divIcon({
      className: "custom-marker",
      html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px">
        <div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,0.85);border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
          <img src="/emojis/house-marker.png" style="width:22px;height:22px" />
        </div>
      </div>`,
      iconAnchor: [20, 40],
      iconSize: [40, 40],
    });

    L.marker([latitude, longitude], { icon }).addTo(map);
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [latitude, longitude]);

  return (
    <div className="mb-8">
      <h3 className="text-title font-bold text-gray-900 mb-4">Localisation</h3>
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div ref={mapRef} className="w-full h-52" />
        <div className="px-4 py-3 bg-white flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <p className="text-body-sm text-gray-500 font-medium">
            Quartier de <span className="font-bold text-gray-900">{city}</span> · Adresse exacte après confirmation du Switch
          </p>
        </div>
      </div>
    </div>
  );
}
