"use client";

import { useState } from "react";

export default function Header() {
  const [activeTab, setActiveTab] = useState<"logements" | "utilisateurs">("logements");

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      
      {/* =========================================================
          VERSION DESKTOP & TABLETTE (cachée sur mobile)
      ========================================================= */}
      
      {/* Ligne du haut : Logo, Navigation, Actions */}
      <div className="max-w-[1440px] mx-auto px-6 h-20 hidden md:flex items-center justify-between">
        
        {/* Left : Logo */}
        <div className="flex-1 min-w-0">
          <span className="text-2xl font-black bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] bg-clip-text text-transparent cursor-pointer tracking-tight">
            SwitchAppart
          </span>
        </div>

        {/* Center : Tabs sans emojis */}
        <div className="flex-1 flex justify-center gap-8">
          <button
            onClick={() => setActiveTab("logements")}
            className={`text-[16px] transition-colors pb-1 border-b-2 flex flex-col items-center gap-1 ${
              activeTab === "logements"
                ? "font-semibold text-gray-900 border-black"
                : "font-medium text-gray-500 hover:text-gray-900 border-transparent hover:border-gray-300"
            }`}
          >
            Logements
          </button>
          <button
            onClick={() => setActiveTab("utilisateurs")}
            className={`text-[16px] transition-colors pb-1 border-b-2 flex flex-col items-center gap-1 ${
              activeTab === "utilisateurs"
                ? "font-semibold text-gray-900 border-black"
                : "font-medium text-gray-500 hover:text-gray-900 border-transparent hover:border-gray-300"
            }`}
          >
            Utilisateurs
          </button>
        </div>

        {/* Right : Actions & Profil */}
        <div className="flex-1 flex items-center justify-end gap-2 text-gray-700">
          <button className="hidden lg:block text-[14px] font-semibold hover:bg-gray-100 px-4 py-3 rounded-full transition-colors truncate">
            Proposer son logement
          </button>
          
          <button className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 transition-colors">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor' }}>
              <path d="M8 .5a7.5 7.5 0 1 0 7.5 7.5A7.5 7.5 0 0 0 8 .5zm0 14a6.5 6.5 0 1 1 6.5-6.5A6.5 6.5 0 0 1 8 14.5z"></path>
              <path d="M8 1.5c-1.8 0-3.3 2.5-3.8 5.5h7.6c-.5-3-2-5.5-3.8-5.5zm-4 .5A6.5 6.5 0 0 0 1.6 8h4.5c.2-2.7 1-4.8 2-5.6a6.5 6.5 0 0 0-4-1.4zM1.6 9a6.5 6.5 0 0 0 5.4 5.5c-.8-1-1.6-3-2-5.5H1.6zm6.4 5.5c1.8 0 3.3-2.5 3.8-5.5H4.2c.5 3 2 5.5 3.8 5.5zm4-.5a6.5 6.5 0 0 0 2.4-5h-4.6c-.2 2.7-1 4.8-2 5.6a6.5 6.5 0 0 0 4-1.4zM14.4 8a6.5 6.5 0 0 0-5.4-5.5c.8 1 1.6 3 2 5.5h3.4z"></path>
            </svg>
          </button>

          <button className="flex items-center gap-3 border border-gray-300 rounded-full py-[5px] pl-3 pr-[5px] hover:shadow-md transition-all ml-1 bg-white">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: '3', overflow: 'visible' }}>
              <g fill="none" fillRule="nonzero"><path d="m2 16h28"></path><path d="m2 24h28"></path><path d="m2 8h28"></path></g>
            </svg>
            <div className="w-[30px] h-[30px] rounded-full bg-gray-500 overflow-hidden text-gray-400 border border-transparent">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentcolor' }}>
                <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Barre de recherche (Milieu Bas) */}
      <div className="max-w-[700px] mx-auto pb-6 px-6 hidden md:block">
        <div className="bg-white border border-gray-200 rounded-full shadow-[0_3px_12px_rgba(0,0,0,0.08)] flex items-center h-16 relative">
          
          <div className="flex-1 h-full rounded-full hover:bg-gray-100 flex flex-col justify-center px-8 cursor-pointer group transition-colors relative z-10 focus-within:bg-white focus-within:shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
            <label htmlFor="ville-search" className="text-[12px] font-bold text-black tracking-wide cursor-pointer mb-[2px]">
              Ville
            </label>
            <input 
              id="ville-search"
              type="text" 
              placeholder="Rechercher une destination" 
              className="w-full bg-transparent outline-none text-[14px] text-gray-900 placeholder-gray-500 font-medium truncate"
            />
          </div>

          <div className="w-[1px] h-8 bg-gray-300 pointer-events-none absolute left-1/2 -translate-x-1/2 z-0" />

          <div className="flex-1 h-full rounded-full hover:bg-gray-100 flex flex-col justify-center pl-8 pr-2 cursor-pointer group transition-colors relative z-10 focus-within:bg-white focus-within:shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between w-full h-full">
              <div className="flex-1 flex flex-col justify-center">
                <label htmlFor="user-search" className="text-[12px] font-bold text-black tracking-wide cursor-pointer mb-[2px]">
                  Utilisateur
                </label>
                <input 
                  id="user-search"
                  type="text" 
                  placeholder="Chercher un profil" 
                  className="w-full bg-transparent outline-none text-[14px] text-gray-900 placeholder-gray-500 font-medium truncate"
                />
              </div>

              <button className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shrink-0 shadow-md">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: '4', overflow: 'visible' }}>
                  <g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path></g>
                </svg>
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* =========================================================
          VERSION MOBILE (affichée uniquement sur petits écrans)
      ========================================================= */}
      <div className="block md:hidden px-4 pt-4 pb-0 bg-white shadow-sm">
        {/* Barre de recherche (Pilule large) */}
        <button className="w-full h-14 bg-white border border-gray-300 shadow-[0_3px_10px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center gap-3 active:scale-[0.98] transition-transform">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '18px', width: '18px', stroke: 'currentcolor', strokeWidth: '5', overflow: 'visible' }}>
            <g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path></g>
          </svg>
          <span className="text-[15px] font-semibold text-gray-900 tracking-wide">
            Commencer ma recherche
          </span>
        </button>

        {/* Navigation / Tabs (Mobile) */}
        <div className="flex justify-center gap-10 mt-6 relative z-10">
          <button
            onClick={() => setActiveTab("logements")}
            className={`text-[14px] transition-colors pb-3 border-b-2 flex flex-col items-center gap-1 ${
              activeTab === "logements"
                ? "font-semibold text-gray-900 border-black"
                : "font-medium text-gray-500 hover:text-gray-900 border-transparent hover:border-gray-300"
            }`}
          >
            Logements
          </button>
          <button
            onClick={() => setActiveTab("utilisateurs")}
            className={`text-[14px] transition-colors pb-3 border-b-2 flex flex-col items-center gap-1 ${
              activeTab === "utilisateurs"
                ? "font-semibold text-gray-900 border-black"
                : "font-medium text-gray-500 hover:text-gray-900 border-transparent hover:border-gray-300"
            }`}
          >
            Utilisateurs
          </button>
        </div>
      </div>
    </header>
  );
}
