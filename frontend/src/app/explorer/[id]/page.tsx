"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth.store";
import { FALLBACK_COVER_HQ } from "@/shared/constants/theme";
import { useProperty } from "@/app/explorer/hooks/useProperties";
import { useAddFavorite } from "@/app/favoris/hooks/useFavorites";
import PropertyHero from "@/app/explorer/components/PropertyHero";
import PropertyInfo from "@/app/explorer/components/PropertyInfo";
import PropertyOwnerCard from "@/app/explorer/components/PropertyOwnerCard";
import PropertyFeatures from "@/app/explorer/components/PropertyFeatures";
import PropertyBottomBar from "@/app/explorer/components/PropertyBottomBar";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const id = params.id as string;
  const { data: property, isLoading } = useProperty(id);
  const favMutation = useAddFavorite();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-body-lg font-medium">Chargement...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-body-lg">Logement introuvable</p>
        <button type="button" onClick={() => router.back()} className="text-brand-purple font-bold text-body hover:underline">
          Retour
        </button>
      </div>
    );
  }

  const coverImg = property.cover_image || property.photos[0] || FALLBACK_COVER_HQ;

  return (
    <div className="min-h-screen bg-white">
      <PropertyHero
        coverImg={coverImg}
        onBack={() => router.back()}
        onFavorite={() => isLoggedIn && favMutation.mutate(id)}
        isFavorited={favMutation.isSuccess}
      />
      <div className="w-full max-w-3xl mx-auto px-6 py-8 pb-32">
        <PropertyInfo property={property} />
        {property.owner && <PropertyOwnerCard owner={property.owner} />}
        {property.description && (
          <div className="mb-8">
            <h3 className="text-title font-bold text-gray-900 mb-3">À propos de ce logement</h3>
            <p className="text-body-lg text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>
        )}
        <PropertyFeatures property={property} />
      </div>
      <PropertyBottomBar monthlyRent={property.monthly_rent ?? 0} />
    </div>
  );
}
