"use client";

import { useState } from "react";
import {
  User, Settings, Heart, Gift, Shield, HelpCircle, ChevronRight,
  LogOut, Home, Scale, Crown,
} from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ConnectionModal from "@/components/ConnectionModal";
import { useAuthStore } from "@/shared/stores/auth.store";

const menuSections = [
  {
    title: "Mon compte",
    items: [
      { href: "/profil/public", icon: User, label: "Profil public" },
      { href: "/profil/parametres", icon: Settings, label: "Param\u00e8tres" },
      { href: "/profil/hote", icon: Home, label: "Devenir h\u00f4te" },
    ],
  },
  {
    title: "Avantages",
    items: [
      { href: "/profil/parrainage", icon: Gift, label: "Parrainage" },
      { href: "/profil/cadeaux", icon: Crown, label: "Avantages Switch" },
    ],
  },
  {
    title: "Assistance",
    items: [
      { href: "/profil/aide", icon: HelpCircle, label: "Centre d\u2019aide" },
      { href: "/profil/confidentialite", icon: Shield, label: "Confidentialit\u00e9" },
      { href: "/profil/juridique", icon: Scale, label: "Mentions l\u00e9gales" },
    ],
  },
] as const;

export default function ProfilPage() {
  const { isLoggedIn, user, isLoading, logout } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-24">
        <div className="animate-pulse text-gray-400 font-medium">Chargement...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-white pb-24">
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] rounded-full flex items-center justify-center mb-6">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-[28px] font-black text-gray-900 mb-2">Votre profil</h1>
          <p className="text-gray-500 text-[15px] mb-8 max-w-xs">
            Connectez-vous pour g&eacute;rer votre profil et acc&eacute;der &agrave; toutes les fonctionnalit&eacute;s.
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

  const initial = (user?.full_name || user?.email || "?")[0]?.toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-24">
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-6 pt-12 pb-6">
        {/* Profile card */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center shadow-lg shadow-[#8A2BE2]/20 shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-white">{initial}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[22px] font-black text-gray-900 truncate">
                {user?.full_name || "Mon profil"}
              </h1>
              <p className="text-[14px] text-gray-500 truncate">{user?.email}</p>
              <Link
                href="/profil/public"
                className="text-[13px] font-bold text-[#8A2BE2] mt-1 inline-block hover:underline"
              >
                Voir le profil
              </Link>
            </div>
          </div>
        </div>

        {/* Menu sections */}
        {menuSections.map((section) => (
          <div key={section.title} className="mb-4">
            <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">
              {section.title}
            </h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {section.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${
                      idx < section.items.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5 text-gray-500 shrink-0" />
                    <span className="flex-1 text-[15px] font-semibold text-gray-900">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-5 py-4 bg-white rounded-2xl shadow-sm hover:bg-red-50 transition-colors mt-4"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span className="text-[15px] font-semibold text-red-500">Se d&eacute;connecter</span>
        </button>

        <p className="text-center text-[12px] text-gray-400 mt-8">
          SwitchAppart v1.0 &mdash; 2026
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
