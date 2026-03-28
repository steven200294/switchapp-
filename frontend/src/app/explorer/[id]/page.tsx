"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft, MapPin, Maximize, Bed, Bath, Heart,
  Wifi, ParkingCircle, Snowflake, Dog, Sofa, Share2,
} from "lucide-react";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getProperty } from "@/modules/properties/properties.service";
import { addFavorite } from "@/modules/favorites/favorites.service";
import { useAuthStore } from "@/shared/stores/auth.store";

function AmenityIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet")) return <Wifi className="w-5 h-5 text-gray-500" />;
  if (lower.includes("parking")) return <ParkingCircle className="w-5 h-5 text-gray-500" />;
  if (lower.includes("clim")) return <Snowflake className="w-5 h-5 text-gray-500" />;
  if (lower.includes("animal") || lower.includes("pet")) return <Dog className="w-5 h-5 text-gray-500" />;
  if (lower.includes("meublé") || lower.includes("furnished")) return <Sofa className="w-5 h-5 text-gray-500" />;
  if (lower.includes("lit") || lower.includes("chambre")) return <Bed className="w-5 h-5 text-gray-500" />;
  if (lower.includes("bain") || lower.includes("douche")) return <Bath className="w-5 h-5 text-gray-500" />;
  return <Maximize className="w-5 h-5 text-gray-500" />;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: property, isLoading } = useQuery({
    queryKey: QUERY_KEYS.PROPERTY(id),
    queryFn: () => getProperty(id),
    enabled: !!id,
  });

  const favMutation = useMutation({
    mutationFn: () => addFavorite(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg font-medium">Chargement...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Logement introuvable</p>
        <button onClick={() => router.back()} className="text-[#8A2BE2] font-bold hover:underline">
          Retour
        </button>
      </div>
    );
  }

  const coverImg = property.cover_image || property.photos[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fit=crop&w=800&q=100";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero image */}
      <div className="relative w-full h-[45vh] md:h-[50vh] min-h-[350px]">
        <img src={coverImg} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-12 md:pt-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full shadow-md text-gray-900 hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full shadow-md text-gray-700 hover:bg-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => isLoggedIn && favMutation.mutate()}
              className="w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full shadow-md text-gray-700 hover:bg-white transition-colors"
            >
              <Heart className={`w-5 h-5 ${favMutation.isSuccess ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-3xl mx-auto px-6 py-8 pb-32">
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin className="w-4 h-4 text-[#00BFFF]" />
          <span className="text-[13px] font-bold uppercase tracking-wider text-[#00BFFF]">
            {property.city}{property.district ? `, ${property.district}` : ""}
          </span>
        </div>

        <h1 className="text-[28px] md:text-[36px] font-black leading-tight text-gray-900 mb-3 tracking-tight">
          {property.title}
        </h1>

        {/* Quick stats */}
        <div className="flex flex-wrap items-center gap-4 text-[15px] text-gray-500 font-medium mb-6 pb-6 border-b border-gray-100">
          {property.surface_area != null && property.surface_area > 0 && (
            <span className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4" /> {property.surface_area}m&sup2;
            </span>
          )}
          {property.rooms != null && (
            <span className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" /> {property.rooms} pi&egrave;ce{property.rooms > 1 ? "s" : ""}
            </span>
          )}
          {property.bedrooms != null && (
            <span className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" /> {property.bedrooms} ch.
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" /> {property.bathrooms} sdb
            </span>
          )}
        </div>

        {/* Price */}
        {property.monthly_rent != null && property.monthly_rent > 0 && (
          <div className="mb-8 p-5 bg-gray-50 rounded-2xl flex items-baseline gap-1">
            <span className="text-[28px] font-black text-gray-900">{property.monthly_rent}&euro;</span>
            <span className="text-gray-500 text-[15px] font-medium">/mois</span>
            {property.utilities_included && (
              <span className="ml-3 text-[12px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Charges incluses
              </span>
            )}
          </div>
        )}

        {/* Owner */}
        {property.owner && (
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm bg-gray-200 flex items-center justify-center shrink-0">
              {property.owner.avatar_url ? (
                <img src={property.owner.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-gray-400">{(property.owner.full_name || "?")[0]}</span>
              )}
            </div>
            <div>
              <p className="text-[18px] font-bold text-gray-900">
                Propos&eacute; par {property.owner.full_name || "Utilisateur"}
              </p>
              {property.owner.profession && (
                <p className="text-[14px] text-gray-500 font-medium">{property.owner.profession}</p>
              )}
              {property.owner.city && (
                <p className="text-[13px] text-gray-400">{property.owner.city}</p>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {property.description && (
          <div className="mb-8">
            <h3 className="text-[20px] font-bold text-gray-900 mb-3">&Agrave; propos de ce logement</h3>
            <p className="text-[16px] text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>
        )}

        {/* Features grid */}
        <div className="mb-8 grid grid-cols-2 gap-3">
          {property.furnished && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <Sofa className="w-5 h-5 text-gray-500" />
              <span className="text-[14px] text-gray-700 font-medium">Meubl&eacute;</span>
            </div>
          )}
          {property.pets_allowed && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <Dog className="w-5 h-5 text-gray-500" />
              <span className="text-[14px] text-gray-700 font-medium">Animaux accept&eacute;s</span>
            </div>
          )}
        </div>

        {/* Amenities */}
        {property.amenities.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[20px] font-bold text-gray-900 mb-4">&Eacute;quipements</h3>
            <div className="flex flex-wrap gap-3">
              {property.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
                  <AmenityIcon name={item} />
                  <span className="text-[14px] text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 md:px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 flex justify-center"
        style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}
      >
        <div className="w-full max-w-3xl flex items-center justify-between gap-4">
          <div>
            <span className="text-[22px] font-black text-gray-900">{property.monthly_rent ?? 0}&euro;</span>
            <span className="text-gray-500 text-[14px]"> /mois</span>
          </div>
          <button className="px-8 py-4 bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white rounded-2xl font-bold text-[16px] hover:scale-[1.02] transition-transform shadow-xl shadow-[#8A2BE2]/20">
            Proposer un Switch
          </button>
        </div>
      </div>
    </div>
  );
}
