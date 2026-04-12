"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useProperty } from "@/app/[locale]/explorer/hooks/useProperties";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/app/[locale]/favoris/hooks/useFavorites";
import PropertyImageCarousel from "@/app/[locale]/explorer/components/PropertyImageCarousel";
import PropertyInfo from "@/app/[locale]/explorer/components/PropertyInfo";
import PropertyOwnerCard from "@/app/[locale]/explorer/components/PropertyOwnerCard";
import PropertyFeatures from "@/app/[locale]/explorer/components/PropertyFeatures";
import PropertyBottomBar from "@/app/[locale]/explorer/components/PropertyBottomBar";
import PropertyCompatibilityCard from "@/app/[locale]/explorer/components/PropertyCompatibilityCard";
import OwnerSidePanel from "@/app/[locale]/explorer/components/OwnerSidePanel";
import ConnectionModal from "@/components/ConnectionModal";
import { useCompatibility } from "@/app/[locale]/explorer/hooks/useCompatibility";
import dynamic from "next/dynamic";

const PropertyLocationMap = dynamic(() => import("@/app/[locale]/explorer/components/PropertyLocationMap"), { ssr: false });

export default function PropertyDetailPage() {
  const tCommon = useTranslations("common");
  const tProperty = useTranslations("property");
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const id = params.id as string;
  const { data: property, isLoading } = useProperty(id);
  const compat = useCompatibility(id, isLoggedIn);
  const { data: favorites } = useFavorites(isLoggedIn);
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();
  const isFavorited = favorites?.some((f: { property_id: string }) => f.property_id === id) ?? false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-brand-cyan rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-body-lg">{tProperty("notFound")}</p>
        <button type="button" onClick={() => router.back()} className="text-brand-purple font-bold text-body hover:underline">
          {tCommon("back")}
        </button>
      </div>
    );
  }

  const bestPhotos = property.photos?.length ? property.photos : property.photo_paths;
  const bestCover = property.cover_image || property.cover_path;
  const photos = [
    ...(bestCover ? [bestCover] : []),
    ...bestPhotos.filter((p) => p !== bestCover),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      <div className="max-w-5xl mx-auto md:py-6 md:px-4">
        <div className="flex items-start gap-5">
          <div className="flex-1 min-w-0 bg-white md:rounded-2xl md:shadow-sm overflow-hidden">
            <PropertyImageCarousel
              photos={photos}
              onBack={() => router.back()}
              onFavorite={() => {
                if (!isLoggedIn) return;
                if (isFavorited) { removeFav.mutate(id); } else { addFav.mutate(id); }
              }}
              isFavorited={isFavorited}
            />

            <div className="px-5 md:px-8 py-6 pb-40">
              <PropertyInfo property={property} />

              <div className="md:hidden">
                {property.owner && <PropertyOwnerCard owner={property.owner} />}
              </div>

              {isLoggedIn && (
                <PropertyCompatibilityCard
                  isLoading={compat.isPending}
                  error={compat.error instanceof Error ? compat.error : null}
                  data={compat.data}
                />
              )}

              {property.description && (
                <div className="mb-8">
                  <h3 className="text-title font-bold text-gray-900 mb-3">{tProperty("aboutProperty")}</h3>
                  <p className="text-body-lg text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {property.latitude && property.longitude && (
                <PropertyLocationMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  city={property.city ?? ""}
                />
              )}

              <PropertyFeatures property={property} />
            </div>
          </div>

          {property.owner && <OwnerSidePanel owner={property.owner} />}
        </div>
      </div>

      <PropertyBottomBar
        monthlyRent={property.monthly_rent ?? 0}
        utilitiesIncluded={property.utilities_included ?? false}
        onPropose={() => {
          if (!isLoggedIn) setShowAuth(true);
        }}
      />

      {showAuth && <ConnectionModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
