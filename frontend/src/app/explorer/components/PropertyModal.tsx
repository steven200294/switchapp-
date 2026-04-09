"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useProperty } from "@/app/explorer/hooks/useProperties";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/app/favoris/hooks/useFavorites";
import PropertyImageCarousel from "@/app/explorer/components/PropertyImageCarousel";
import PropertyInfo from "@/app/explorer/components/PropertyInfo";
import PropertyOwnerCard from "@/app/explorer/components/PropertyOwnerCard";
import PropertyFeatures from "@/app/explorer/components/PropertyFeatures";
import PropertyCompatibilityCard from "@/app/explorer/components/PropertyCompatibilityCard";
import { useCompatibility } from "@/app/explorer/hooks/useCompatibility";
import OwnerSidePanel from "@/app/explorer/components/OwnerSidePanel";
import dynamic from "next/dynamic";

const PropertyLocationMap = dynamic(() => import("./PropertyLocationMap"), { ssr: false });

interface PropertyModalProps {
  propertyId: string;
  onClose: () => void;
}

export default function PropertyModal({ propertyId, onClose }: PropertyModalProps) {
  const { isLoggedIn } = useAuthStore();
  const { data: property, isLoading } = useProperty(propertyId);
  const compat = useCompatibility(propertyId, isLoggedIn);
  const { data: favorites } = useFavorites(isLoggedIn);
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();
  const isFavorited = favorites?.some((f: { property_id: string }) => f.property_id === propertyId) ?? false;

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

  const bestPhotos = property?.photos?.length ? property.photos : property?.photo_paths ?? [];
  const bestCover = property?.cover_image || property?.cover_path;
  const photos = property ? [
    ...(bestCover ? [bestCover] : []),
    ...bestPhotos.filter((p) => p !== bestCover),
  ].filter(Boolean) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center md:py-6 md:px-4">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 flex items-start gap-4 w-full md:w-auto md:max-w-5xl">
      <div
        className="bg-white w-full h-full md:h-auto md:max-h-[calc(100vh-48px)] md:w-[720px] md:rounded-2xl md:shadow-2xl overflow-y-auto scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            if (!isLoggedIn) return;
            if (isFavorited) { removeFav.mutate(propertyId); } else { addFav.mutate(propertyId); }
          }}
          className="absolute top-4 left-4 z-30 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Favori"
        >
          <svg viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={`w-4 h-4 ${isFavorited ? "text-brand-cyan" : ""}`}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Fermer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-gray-400 text-body-lg font-medium">Chargement...</div>
          </div>
        ) : !property ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-gray-500 text-body-lg">Logement introuvable</p>
            <button type="button" onClick={onClose} className="text-brand-purple font-bold text-body hover:underline">Fermer</button>
          </div>
        ) : (
          <>
            <PropertyImageCarousel
              photos={photos}
              onBack={onClose}
              onFavorite={() => {
                if (!isLoggedIn) return;
                if (isFavorited) { removeFav.mutate(propertyId); } else { addFav.mutate(propertyId); }
              }}
              isFavorited={isFavorited}
              hideOverlays
            />
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
              <div>
                <span className="text-title-md font-black text-gray-900">{property.monthly_rent ?? 0}€</span>
                <span className="text-gray-500 text-body"> /mois</span>
              </div>
              <button
                type="button"
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-bold text-body-md transition-colors"
              >
                Proposer un Switch
              </button>
            </div>
            <div className="px-6 py-8">
              <PropertyInfo property={property} />
              {property.owner && <PropertyOwnerCard owner={property.owner} />}
              {isLoggedIn && (
                <PropertyCompatibilityCard
                  isLoading={compat.isPending}
                  error={compat.error instanceof Error ? compat.error : null}
                  data={compat.data}
                />
              )}
              {property.description && (
                <div className="mb-8">
                  <h3 className="text-title font-bold text-gray-900 mb-3">A propos de ce logement</h3>
                  <p className="text-body-lg text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              )}
              <PropertyFeatures property={property} />
              {property.latitude && property.longitude && (
                <PropertyLocationMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  city={property.city ?? ""}
                />
              )}
            </div>
          </>
        )}
      </div>
      {property?.owner && <OwnerSidePanel owner={property.owner} />}
      </div>
    </div>
  );
}
