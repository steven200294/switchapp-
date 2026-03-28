"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const mockFlats = [
  {
    id: 1,
    city: "Paris, 11ème",
    title: "T2 Lumineux avec Balcon",
    size: "45m² • 1 Chambre",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fit=crop&w=800&q=100",
    description: "Découvrez ce magnifique T2 idéalement situé dans le quartier dynamique du 11ème arrondissement. Il dispose d'un grand salon baigné de lumière, d'une cuisine équipée ouverte et d'un petit balcon parfait pour prendre son café le matin. Parfait pour un couple souhaitant explorer la capitale !",
    amenities: ["Wi-Fi Rapide", "Cuisine équipée", "Lave-linge", "Balcon filant", "Ascenseur"],
    host: {
      name: "Thomas",
      memberSince: "Membre depuis 2021",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=150&q=80",
    }
  },
  {
    id: 2,
    city: "Lyon, Presqu'île",
    title: "Loft moderne hyper-centre",
    size: "60m² • 2 Chambres",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?fit=crop&w=800&q=100",
    description: "Ce loft d'architecte refait à neuf vous accueille au cœur de la Presqu'île. Hauts plafonds, murs en pierres apparentes et décoration soignée. Vous serez à deux pas de la place Bellecour et de tous les commerces. Un vrai cocon urbain !",
    amenities: ["Climatisation", "Parking privé", "Netflix", "Lit King Size", "Baignoire îlot"],
    host: {
      name: "Marie",
      memberSince: "Super Host",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=150&q=80",
    }
  },
  {
    id: 3,
    city: "Marseille, Vieux-Port",
    title: "Appartement vue mer",
    size: "55m² • 1 Chambre",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?fit=crop&w=800&q=100",
    description: "Logement exceptionnel situé sur les quais du Vieux-Port. Dégustez votre pastis en admirant Notre-Dame de la Garde depuis le canapé. Entièrement rénové en 2023 avec un style méditerranéen contemporain. L'échange parfait pour se dépayser.",
    amenities: ["Vue exceptionnelle", "Machine Nespresso", "Bose SoundLink", "Lave-vaisselle", "Proche métro"],
    host: {
      name: "Lucas",
      memberSince: "Membre depuis 2023",
      avatar: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?fit=crop&w=150&q=80",
    }
  }
];

export default function SwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFlat, setSelectedFlat] = useState<typeof mockFlats[0] | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  // Fonction pour swiper (avec un effet minimaliste)
  const handleAction = (type: "pass" | "like" | "superlike") => {
    if (currentIndex >= mockFlats.length) return;
    
    // Animation de sortie
    setSwipeDirection(type === "pass" ? "left" : "right");
    
    // Attendre la fin de l'animation pour changer l'index (300ms)
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  // Tableau des cartes restantes
  const currentCards = mockFlats.slice(currentIndex, currentIndex + 3);

  // Si on est en mode "Vue détaillée"
  if (selectedFlat) {
    return (
      <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in slide-in-from-bottom flex flex-col">
        {/* Entête avec image */}
        <div className="relative w-full h-[40vh] min-h-[350px]">
          <img src={selectedFlat.image} alt={selectedFlat.title} className="w-full h-full object-cover" />
          {/* Bouton retour absolu */}
          <button 
            onClick={() => setSelectedFlat(null)}
            className="absolute top-12 left-6 w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-full shadow-md text-gray-900 hover:bg-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Détails du logement */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 py-8 pb-32">
          <div className="flex items-center gap-1.5 mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#00BFFF]">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="text-[13px] font-bold uppercase tracking-wider text-[#00BFFF]">{selectedFlat.city}</span>
          </div>
          
          <h1 className="text-[32px] md:text-[40px] font-black leading-tight text-gray-900 mb-3 tracking-tight">
            {selectedFlat.title}
          </h1>
          
          <p className="text-[16px] md:text-[18px] font-medium text-gray-500 mb-8 pb-6 border-b border-gray-100">
            {selectedFlat.size}
          </p>

          {/* Hôte */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm">
              <img src={selectedFlat.host.avatar} alt={selectedFlat.host.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[18px] font-bold text-gray-900">Proposé par {selectedFlat.host.name}</p>
              <p className="text-[14px] text-gray-500 font-medium">{selectedFlat.host.memberSince}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-[20px] font-bold text-gray-900 mb-3">À propos de ce logement</h3>
            <p className="text-[16px] text-gray-600 leading-relaxed">
              {selectedFlat.description}
            </p>
          </div>

          {/* Équipements */}
          <div className="mb-4">
            <h3 className="text-[20px] font-bold text-gray-900 mb-4">Ce que propose ce logement</h3>
            <div className="flex flex-wrap gap-3">
              {selectedFlat.amenities.map((item, idx) => {
                const amenityIcons: Record<string, React.ReactNode> = {
                  "Wi-Fi Rapide": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" /></svg>,
                  "Cuisine équipée": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v5H3zM3 8v13h18V8M9 3v18M15 3v18" /></svg>,
                  "Lave-linge": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path strokeLinecap="round" d="M7 6h.01M10 6h.01"/></svg>,
                  "Balcon filant": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M4 21V9l8-6 8 6v12M9 21v-6h6v6"/></svg>,
                  "Ascenseur": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 10l3-3 3 3M9 14l3 3 3-3"/></svg>,
                  "Climatisation": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>,
                  "Parking privé": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>,
                  "Netflix": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path strokeLinecap="round" d="M8 21h8M12 17v4"/></svg>,
                  "Lit King Size": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2 9V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3M2 9h20M2 9v9m20-9v9M2 18h20M7 9v9M17 9v9"/></svg>,
                  "Baignoire îlot": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4zM6 12V7a3 3 0 0 1 6 0"/></svg>,
                  "Vue exceptionnelle": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>,
                  "Machine Nespresso": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>,
                  "Bose SoundLink": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>,
                  "Lave-vaisselle": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M7 7h.01M10 7h.01"/><circle cx="12" cy="13" r="4"/></svg>,
                  "Proche métro": <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="14" rx="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l-2 4m10-4 2 4M8 10h.01M16 10h.01M12 10v4"/></svg>,
                };
                const icon = amenityIcons[item] ?? <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
                return (
                  <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                    {icon}
                    <span className="text-[14px] text-gray-700 font-medium whitespace-nowrap">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barre d'action fixe en bas pour la page de détail */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 md:px-8 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 flex justify-center">
          <div className="w-full max-w-3xl flex items-center justify-between gap-4">
            <button 
              onClick={() => { handleAction("pass"); setSelectedFlat(null); }}
              className="flex-1 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-[16px] hover:bg-gray-50 transition-colors"
            >
              Passer
            </button>
            <button 
              onClick={() => { handleAction("like"); setSelectedFlat(null); }}
              className="flex-[2] py-4 md:py-4 bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white rounded-2xl font-bold text-[16px] hover:scale-[1.02] transition-transform shadow-xl shadow-[#8A2BE2]/20"
            >
              Faire un Switch
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Vue Swipe Pricipale ---
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 md:bg-white pb-24 md:pb-0 overflow-hidden">
      {/* Header Desktop */}
      <div className="hidden md:block border-b border-gray-100 bg-white">
        <Header />
      </div>

      <main className="flex-1 w-full flex flex-col items-center justify-start pt-6 md:pt-10 px-4">
        
        {/* En-tête (Titre et instructions) */}
        <div className="w-full max-w-sm mb-6 text-center">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] tracking-tight">
            Switch
          </h1>
          <p className="text-gray-500 text-[14px] font-medium mt-1">
            Trouvez votre prochain logement d'échange.
          </p>
        </div>

        {/* Pile de cartes */}
        <div className="relative w-full max-w-[340px] md:max-w-[400px] h-[65vh] max-h-[600px] min-h-[450px] mb-8 lg:mb-12">
          
          {currentCards.length === 0 ? (
            // Aucun appartement restant
            <div className="absolute inset-0 bg-gray-100 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-[20px] font-bold text-gray-900 mb-2">Plus aucun logement !</h3>
              <p className="text-gray-500 text-[14px]">Revenez plus tard ou élargissez vos critères de recherche dans les paramètres pour voir plus d'appartements.</p>
              <button 
                onClick={() => setCurrentIndex(0)} 
                className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-full font-bold text-gray-900 hover:bg-gray-50"
              >
                Recommencer
              </button>
            </div>
          ) : (
            // Cartes dynamiques
            [...currentCards].reverse().map((flat, reversedIndex) => {
              // Calculer le "vrai" index dans la pile locale (0 = top, 1 = middle, 2 = bottom)
              const stackIndex = currentCards.length - 1 - reversedIndex;
              
              // Déterminer si c'est la carte active du dessus
              const isTop = stackIndex === 0;

              // Styles pour la profondeur Z-index et de l'échelle arrière
              // Carte top : scale 1, aucune translation, super opacity
              // Cartes dessous : scale plus petit, translation vers le bas, opacité plus basse
              const scale = 1 - stackIndex * 0.05; 
              const translateY = stackIndex * 16; 
              const zIndex = 30 - stackIndex;
              const opacity = 1 - stackIndex * 0.2;
              
              // Si la carte est au dessus et on "swipe", on applique l'animation de translation X
              let transformString = `translateY(${translateY}px) scale(${scale})`;
              if (isTop && swipeDirection === 'left') transformString += " translateX(-150%) rotate(-15deg)";
              if (isTop && swipeDirection === 'right') transformString += " translateX(150%) rotate(15deg)";

              return (
                <div 
                  key={flat.id}
                  onClick={() => isTop && setSelectedFlat(flat)}
                  className={`absolute inset-x-0 top-0 bottom-0 bg-white rounded-[2rem] shadow-xl overflow-hidden will-change-transform ${
                    isTop ? "cursor-pointer hover:-translate-y-1" : "pointer-events-none"
                  } transition-all duration-300 ease-out`}
                  style={{ 
                    zIndex, 
                    transform: transformString,
                    opacity: opacity
                  }}
                >
                  {/* Image Appartement */}
                  <div className="absolute inset-0">
                    <img src={flat.image} alt={flat.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Dégradé sombre */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
                    <div className="flex items-end justify-between w-full">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#00BFFF]">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span className="text-[13px] md:text-[14px] font-bold uppercase tracking-wider shadow-sm">{flat.city}</span>
                        </div>
                        <h2 className="text-[26px] md:text-[32px] font-black leading-tight mb-2 drop-shadow-md">
                          {flat.title}
                        </h2>
                        <p className="text-[15px] md:text-[16px] font-medium text-gray-200">
                          {flat.size}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-center">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white shadow-lg mb-1.5">
                          <img src={flat.host.avatar} alt={flat.host.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[12px] font-bold">{flat.host.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badge optionnel */}
                  {flat.id === 1 && (
                    <div className="absolute top-5 left-5 bg-white/20 backdrop-blur-md border border-white/50 text-white text-[12px] font-bold px-3 py-1.5 rounded-full">
                      Coup de cœur
                    </div>
                  )}

                  {/* Info "Appuyer pour voir" visible uniquement sur la carte du haut */}
                  {isTop && (
                    <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                      Détails
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Boutons d'action type Tinder */}
        {currentCards.length > 0 && (
          <div className="flex items-center justify-center gap-3 md:gap-5 w-full max-w-[360px] md:max-w-[420px]">
            
            {/* Bouton Rewind/Retour (Jaune) */}
            <button className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 active:scale-95 hover:-translate-y-1 hover:shadow-yellow-500/20 transition-all duration-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 md:w-6 md:h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5" /></svg>
            </button>

            {/* Bouton Refuser (Croix) */}
            <button 
              onClick={() => handleAction("pass")}
              className="w-16 h-16 md:w-18 md:h-18 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-gray-400 hover:text-red-500 active:scale-95 hover:-translate-y-1 hover:border-red-100 hover:shadow-red-500/20 transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7 md:w-8 md:h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Bouton Switch/Like (Cœur) */}
            <button 
              onClick={() => handleAction("like")}
              className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gradient-to-tr from-[#00BFFF] to-[#8A2BE2] rounded-full shadow-xl text-white active:scale-95 hover:-translate-y-1 transition-all duration-200 shadow-[#8A2BE2]/40"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            {/* Bouton Boost (Éclair Violet) */}
            <button className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-[#8A2BE2] hover:bg-purple-50 active:scale-95 hover:-translate-y-1 hover:shadow-[#8A2BE2]/20 transition-all duration-200">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7">
                 <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </button>

          </div>
        )}

      </main>

      {/* On cache le BottomNav si on regarde une fiche en détail */}
      <div className={selectedFlat ? "hidden" : ""}>
        <BottomNav />
      </div>
    </div>
  );
}
