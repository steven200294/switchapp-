"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import {
  X, Heart, Star, Undo2, MapPin, Maximize, BedDouble, Bath,
  ChevronLeft, Wifi, ParkingCircle, Snowflake, Dog,
} from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ConnectionModal from "@/components/ConnectionModal";
import { useAuthStore } from "@/shared/stores/auth.store";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getSwipeDeck, recordSwipe, undoSwipe } from "@/modules/swipe/swipe.service";
import type { DeckProperty } from "@/modules/swipe/swipe.types";

const SWIPE_THRESHOLD = 120;

function PropertyDetail({ property, onClose, onPass, onLike }: {
  property: DeckProperty;
  onClose: () => void;
  onPass: () => void;
  onLike: () => void;
}) {
  const coverImg = property.cover_image || property.photos[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fit=crop&w=800&q=100";

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto flex flex-col">
      <div className="relative w-full h-[40vh] min-h-[350px]">
        <img src={coverImg} alt={property.title} className="w-full h-full object-cover" />
        <button
          onClick={onClose}
          className="absolute top-12 left-6 w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-full shadow-md text-gray-900 hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto px-6 py-8 pb-32">
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin className="w-4 h-4 text-[#00BFFF]" />
          <span className="text-[13px] font-bold uppercase tracking-wider text-[#00BFFF]">
            {property.city}{property.district ? `, ${property.district}` : ""}
          </span>
        </div>

        <h1 className="text-[32px] md:text-[40px] font-black leading-tight text-gray-900 mb-3 tracking-tight">
          {property.title}
        </h1>

        <p className="text-[16px] md:text-[18px] font-medium text-gray-500 mb-8 pb-6 border-b border-gray-100">
          {property.surface_area}m² {property.rooms && `\u2022 ${property.rooms} pcs`} {property.bedrooms && `\u2022 ${property.bedrooms} ch`}
        </p>

        {property.owner && (
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm bg-gray-200 flex items-center justify-center">
              {property.owner.avatar_url ? (
                <img src={property.owner.avatar_url} alt={property.owner.full_name || ""} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-gray-400">{(property.owner.full_name || "?")[0]}</span>
              )}
            </div>
            <div>
              <p className="text-[18px] font-bold text-gray-900">
                Propos\u00e9 par {property.owner.full_name || "Utilisateur"}
              </p>
              {property.owner.city && (
                <p className="text-[14px] text-gray-500 font-medium">{property.owner.city}</p>
              )}
            </div>
          </div>
        )}

        {property.description && (
          <div className="mb-8">
            <h3 className="text-[20px] font-bold text-gray-900 mb-3">\u00c0 propos de ce logement</h3>
            <p className="text-[16px] text-gray-600 leading-relaxed">{property.description}</p>
          </div>
        )}

        {property.monthly_rent != null && property.monthly_rent > 0 && (
          <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
            <span className="text-[24px] font-black text-gray-900">{property.monthly_rent}\u20ac</span>
            <span className="text-gray-500 text-[14px] font-medium">/mois</span>
          </div>
        )}

        {property.amenities.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[20px] font-bold text-gray-900 mb-4">\u00c9quipements</h3>
            <div className="flex flex-wrap gap-3">
              {property.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                  <AmenityIcon name={item} />
                  <span className="text-[14px] text-gray-700 font-medium whitespace-nowrap">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 md:px-8 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 flex justify-center">
        <div className="w-full max-w-3xl flex items-center justify-between gap-4">
          <button
            onClick={onPass}
            className="flex-1 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-[16px] hover:bg-gray-50 transition-colors"
          >
            Passer
          </button>
          <button
            onClick={onLike}
            className="flex-[2] py-4 bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white rounded-2xl font-bold text-[16px] hover:scale-[1.02] transition-transform shadow-xl shadow-[#8A2BE2]/20"
          >
            Faire un Switch
          </button>
        </div>
      </div>
    </div>
  );
}

function AmenityIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet")) return <Wifi className="w-5 h-5 text-gray-500" />;
  if (lower.includes("parking")) return <ParkingCircle className="w-5 h-5 text-gray-500" />;
  if (lower.includes("clim")) return <Snowflake className="w-5 h-5 text-gray-500" />;
  if (lower.includes("animal") || lower.includes("pet")) return <Dog className="w-5 h-5 text-gray-500" />;
  if (lower.includes("lit") || lower.includes("chambre")) return <BedDouble className="w-5 h-5 text-gray-500" />;
  if (lower.includes("bain") || lower.includes("douche")) return <Bath className="w-5 h-5 text-gray-500" />;
  return <Maximize className="w-5 h-5 text-gray-500" />;
}

function SwipeCard({
  property,
  isTop,
  stackIndex,
  onSwipe,
  onTap,
}: {
  property: DeckProperty;
  isTop: boolean;
  stackIndex: number;
  onSwipe: (direction: "like" | "nope") => void;
  onTap: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const scale = 1 - stackIndex * 0.05;
  const translateY = stackIndex * 16;

  const coverImg = property.cover_image || property.photos[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fit=crop&w=800&q=100";

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("like");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("nope");
    }
  }

  return (
    <motion.div
      className="absolute inset-x-0 top-0 bottom-0 rounded-[2rem] shadow-xl overflow-hidden will-change-transform cursor-grab active:cursor-grabbing"
      style={{
        zIndex: 30 - stackIndex,
        y: translateY,
        scale,
        opacity: 1 - stackIndex * 0.2,
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      onTap={isTop ? onTap : undefined}
      animate={isTop ? undefined : { x: 0, rotate: 0 }}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="absolute inset-0">
        <img src={coverImg} alt={property.title} className="w-full h-full object-cover" />
      </div>

      {isTop && (
        <>
          <motion.div
            className="absolute top-8 left-8 z-10 border-4 border-green-500 rounded-2xl px-6 py-2 rotate-[-20deg]"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-green-500 text-3xl font-black">SWITCH</span>
          </motion.div>
          <motion.div
            className="absolute top-8 right-8 z-10 border-4 border-red-500 rounded-2xl px-6 py-2 rotate-[20deg]"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-red-500 text-3xl font-black">NOPE</span>
          </motion.div>
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
        <div className="flex items-end justify-between w-full">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-[#00BFFF]" />
              <span className="text-[13px] md:text-[14px] font-bold uppercase tracking-wider">
                {property.city}{property.district ? `, ${property.district}` : ""}
              </span>
            </div>
            <h2 className="text-[26px] md:text-[32px] font-black leading-tight mb-2 drop-shadow-md">
              {property.title}
            </h2>
            <p className="text-[15px] md:text-[16px] font-medium text-gray-200">
              {property.surface_area}m² {property.rooms && `\u2022 ${property.rooms} pcs`}
              {property.monthly_rent ? ` \u2022 ${property.monthly_rent}\u20ac/mois` : ""}
            </p>
          </div>

          {property.owner && (
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white shadow-lg mb-1.5 bg-gray-600 flex items-center justify-center">
                {property.owner.avatar_url ? (
                  <img src={property.owner.avatar_url} alt={property.owner.full_name || ""} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-white">{(property.owner.full_name || "?")[0]}</span>
                )}
              </div>
              <span className="text-[12px] font-bold">{property.owner.full_name?.split(" ")[0] || ""}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MatchOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <Heart className="w-24 h-24 fill-white" />
      </motion.div>
      <h2 className="text-4xl font-black mt-6 mb-2">It&apos;s a Switch!</h2>
      <p className="text-white/80 text-lg mb-10">Vous avez un match mutuel</p>
      <button
        onClick={onClose}
        className="bg-white text-[#8A2BE2] font-bold px-8 py-4 rounded-full text-lg hover:scale-105 transition-transform"
      >
        Envoyer un message
      </button>
      <button onClick={onClose} className="mt-4 text-white/60 font-medium hover:text-white">
        Continuer \u00e0 swiper
      </button>
    </motion.div>
  );
}

export default function SwipePage() {
  const { isLoggedIn, isLoading: authLoading } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<DeckProperty | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [localDeckIndex, setLocalDeckIndex] = useState(0);
  const queryClient = useQueryClient();

  const { data: deck = [], isLoading: deckLoading } = useQuery({
    queryKey: QUERY_KEYS.SWIPE_DECK,
    queryFn: () => getSwipeDeck(30),
    enabled: isLoggedIn && !authLoading,
    staleTime: 5 * 60 * 1000,
  });

  const swipeMutation = useMutation({
    mutationFn: ({ propertyId, action }: { propertyId: string; action: "like" | "nope" | "super_like" }) =>
      recordSwipe(propertyId, action),
    onSuccess: (result) => {
      if (result.matched) {
        setShowMatch(true);
      }
    },
  });

  const undoMutation = useMutation({
    mutationFn: undoSwipe,
    onSuccess: (result) => {
      if (result.undone && localDeckIndex > 0) {
        setLocalDeckIndex((prev) => prev - 1);
      }
    },
  });

  const handleSwipe = useCallback(
    (direction: "like" | "nope") => {
      const currentProperty = deck[localDeckIndex];
      if (!currentProperty) return;

      swipeMutation.mutate({
        propertyId: currentProperty.id,
        action: direction,
      });
      setLocalDeckIndex((prev) => prev + 1);
      setSelectedProperty(null);
    },
    [deck, localDeckIndex, swipeMutation],
  );

  const handleSuperLike = useCallback(() => {
    const currentProperty = deck[localDeckIndex];
    if (!currentProperty) return;

    swipeMutation.mutate({
      propertyId: currentProperty.id,
      action: "super_like",
    });
    setLocalDeckIndex((prev) => prev + 1);
  }, [deck, localDeckIndex, swipeMutation]);

  const handleUndo = useCallback(() => {
    undoMutation.mutate();
  }, [undoMutation]);

  if (!authLoading && !isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 pb-24">
        <div className="hidden md:block border-b border-gray-100 bg-white">
          <Header />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Connectez-vous pour switcher</h1>
          <p className="text-gray-500 text-[15px] mb-8 max-w-sm">
            Cr\u00e9ez un compte ou connectez-vous pour d\u00e9couvrir les logements disponibles et matcher.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white font-bold px-8 py-4 rounded-full text-[16px] shadow-lg hover:scale-105 transition-transform"
          >
            Se connecter
          </button>
        </main>
        <BottomNav />
        {showAuth && <ConnectionModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  const currentCards = deck.slice(localDeckIndex, localDeckIndex + 3);
  const isEmpty = !deckLoading && currentCards.length === 0;

  if (selectedProperty) {
    return (
      <PropertyDetail
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onPass={() => handleSwipe("nope")}
        onLike={() => handleSwipe("like")}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 md:bg-white pb-24 md:pb-0 overflow-hidden">
      <div className="hidden md:block border-b border-gray-100 bg-white">
        <Header />
      </div>

      <main className="flex-1 w-full flex flex-col items-center justify-start pt-6 md:pt-10 px-4">

        <div className="relative w-full max-w-[92vw] md:max-w-[400px] h-[72vh] md:max-h-[600px] md:min-h-[450px] mb-8 lg:mb-12">
          {deckLoading ? (
            <div className="absolute inset-0 bg-gray-100 rounded-[2rem] flex items-center justify-center animate-pulse">
              <div className="text-gray-400 font-bold text-lg">Chargement...</div>
            </div>
          ) : isEmpty ? (
            <div className="absolute inset-0 bg-gray-100 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-[20px] font-bold text-gray-900 mb-2">Plus aucun logement !</h3>
              <p className="text-gray-500 text-[14px]">
                Revenez plus tard ou \u00e9largissez vos crit\u00e8res de recherche.
              </p>
              <button
                onClick={() => {
                  setLocalDeckIndex(0);
                  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SWIPE_DECK });
                }}
                className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-full font-bold text-gray-900 hover:bg-gray-50"
              >
                Actualiser
              </button>
            </div>
          ) : (
            [...currentCards].reverse().map((property, reversedIndex) => {
              const stackIndex = currentCards.length - 1 - reversedIndex;
              return (
                <SwipeCard
                  key={property.id}
                  property={property}
                  isTop={stackIndex === 0}
                  stackIndex={stackIndex}
                  onSwipe={handleSwipe}
                  onTap={() => setSelectedProperty(property)}
                />
              );
            })
          )}
        </div>

        {!isEmpty && !deckLoading && currentCards.length > 0 && (
          <div className="flex items-center justify-center gap-3 md:gap-5 w-full max-w-[360px] md:max-w-[420px]">
            <button
              onClick={handleUndo}
              disabled={localDeckIndex === 0}
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 active:scale-95 hover:-translate-y-1 hover:shadow-yellow-500/20 transition-all duration-200 disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <Undo2 className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={() => handleSwipe("nope")}
              className="w-16 h-16 md:w-18 md:h-18 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-gray-400 hover:text-red-500 active:scale-95 hover:-translate-y-1 hover:border-red-100 hover:shadow-red-500/20 transition-all duration-200"
            >
              <X className="w-7 h-7 md:w-8 md:h-8" />
            </button>

            <button
              onClick={() => handleSwipe("like")}
              className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gradient-to-tr from-[#00BFFF] to-[#8A2BE2] rounded-full shadow-xl text-white active:scale-95 hover:-translate-y-1 transition-all duration-200 shadow-[#8A2BE2]/40"
            >
              <Heart className="w-8 h-8 md:w-10 md:h-10 fill-white" />
            </button>

            <button
              onClick={handleSuperLike}
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-[#8A2BE2] hover:bg-purple-50 active:scale-95 hover:-translate-y-1 hover:shadow-[#8A2BE2]/20 transition-all duration-200"
            >
              <Star className="w-6 h-6 md:w-7 md:h-7 fill-[#8A2BE2]" />
            </button>
          </div>
        )}
      </main>

      <BottomNav />
      {showMatch && <MatchOverlay onClose={() => setShowMatch(false)} />}
    </div>
  );
}
