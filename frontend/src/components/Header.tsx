"use client";

import { useState } from "react";
import { Search, Globe, Menu, User } from "lucide-react";
import Link from "next/link";
import ConnectionModal from "./ConnectionModal";
import { useAuthStore } from "@/shared/stores/auth.store";

export default function Header() {
  const [activeTab, setActiveTab] = useState<"logements" | "utilisateurs">("logements");
  const { isLoggedIn, user, logout } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Desktop */}
        <div className="max-w-[1440px] mx-auto px-6 h-20 hidden md:flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <Link href="/explorer" className="text-2xl font-black bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] bg-clip-text text-transparent cursor-pointer tracking-tight">
              SwitchAppart
            </Link>
          </div>

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

          <div className="flex-1 flex items-center justify-end gap-2 text-gray-700">
            <Link href="/explorer" className="hidden lg:block text-[14px] font-semibold hover:bg-gray-100 px-4 py-3 rounded-full transition-colors truncate">
              Proposer son logement
            </Link>

            <button className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 transition-colors">
              <Globe className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  if (isLoggedIn) setShowMenu(!showMenu);
                  else setShowAuth(true);
                }}
                className="flex items-center gap-3 border border-gray-300 rounded-full py-[5px] pl-3 pr-[5px] hover:shadow-md transition-all ml-1 bg-white"
              >
                <Menu className="w-4 h-4" />
                <div className="w-[30px] h-[30px] rounded-full bg-gray-500 overflow-hidden text-gray-300 flex items-center justify-center">
                  {isLoggedIn && user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
              </button>

              {showMenu && isLoggedIn && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-[14px] font-bold text-gray-900">{user?.full_name || "Mon profil"}</p>
                    <p className="text-[12px] text-gray-400">{user?.email}</p>
                  </div>
                  <Link
                    href="/profil"
                    className="block px-4 py-3 text-[14px] text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    Mon profil
                  </Link>
                  <Link
                    href="/messages"
                    className="block px-4 py-3 text-[14px] text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    Messages
                  </Link>
                  <Link
                    href="/favoris"
                    className="block px-4 py-3 text-[14px] text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    Favoris
                  </Link>
                  <button
                    onClick={() => { logout(); setShowMenu(false); }}
                    className="w-full text-left px-4 py-3 text-[14px] text-red-500 font-medium hover:bg-red-50 transition-colors border-t border-gray-100"
                  >
                    Se d&eacute;connecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop search bar */}
        <div className="max-w-[700px] mx-auto pb-6 px-6 hidden md:block">
          <div className="bg-white border border-gray-200 rounded-full shadow-[0_3px_12px_rgba(0,0,0,0.08)] flex items-center h-16 relative">
            <div className="flex-1 h-full rounded-full hover:bg-gray-100 flex flex-col justify-center px-8 cursor-pointer transition-colors focus-within:bg-white focus-within:shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
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

            <div className="w-[1px] h-8 bg-gray-300 pointer-events-none" />

            <div className="flex-1 h-full rounded-full hover:bg-gray-100 flex flex-col justify-center pl-8 pr-2 cursor-pointer transition-colors focus-within:bg-white focus-within:shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
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
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="block md:hidden px-4 pt-4 pb-0 bg-white shadow-sm">
          <button className="w-full h-14 bg-white border border-gray-300 shadow-[0_3px_10px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center gap-3 active:scale-[0.98] transition-transform">
            <Search className="w-[18px] h-[18px] text-gray-900" />
            <span className="text-[15px] font-semibold text-gray-900 tracking-wide">
              Commencer ma recherche
            </span>
          </button>

          <div className="flex justify-center gap-10 mt-6 relative z-10">
            <button
              onClick={() => setActiveTab("logements")}
              className={`text-[14px] transition-colors pb-3 border-b-2 ${
                activeTab === "logements"
                  ? "font-semibold text-gray-900 border-black"
                  : "font-medium text-gray-500 hover:text-gray-900 border-transparent"
              }`}
            >
              Logements
            </button>
            <button
              onClick={() => setActiveTab("utilisateurs")}
              className={`text-[14px] transition-colors pb-3 border-b-2 ${
                activeTab === "utilisateurs"
                  ? "font-semibold text-gray-900 border-black"
                  : "font-medium text-gray-500 hover:text-gray-900 border-transparent"
              }`}
            >
              Utilisateurs
            </button>
          </div>
        </div>
      </header>

      {showAuth && <ConnectionModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
