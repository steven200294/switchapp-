"use client";

import Link from "next/link";
import { useAuthStore } from "@/shared/stores/auth.store";
import { resolveStorageUrl } from "@/shared/constants/theme";
import { MapPin, Shield, Star } from "@/shared/ui/icons";

export default function ProfilPublicPage() {
  const { user } = useAuthStore();

  const avatar = resolveStorageUrl(user?.avatar_url ?? "", "avatars");
  const name = user?.full_name ?? "Utilisateur";
  const city = user?.city ?? null;
  const verified = user?.verified ?? false;
  const joined = user?.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center md:items-center">
      <Link href="/profil" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      <div className="relative w-full md:max-w-lg h-[92vh] md:h-auto md:max-h-[85vh] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col animate-page-slide-up overflow-hidden">

        {/* Drag handle mobile */}
        <div className="w-full flex justify-center pt-3 pb-1 md:hidden shrink-0">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <header className="px-5 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10 shrink-0">
          <div className="w-10" />
          <h1 className="text-body-xl font-bold text-gray-900">Profil public</h1>
          <Link href="/profil" scroll={false} className="w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-400 hover:text-gray-900">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto">
          {/* Cover / Avatar */}
          <div className="relative h-32 bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                {user?.avatar_url ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-display font-black text-gray-300">
                    {name[0]}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-14 px-6 pb-8">
            {/* Nom + badges */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-title-md font-black text-gray-900">{name}</h2>
                {verified && (
                  <span className="flex items-center gap-1 bg-brand-cyan/10 text-brand-cyan text-body-xs font-bold px-2 py-0.5 rounded-full">
                    <Shield size={12} /> Vérifié
                  </span>
                )}
              </div>
              {city && (
                <div className="flex items-center justify-center gap-1 text-gray-400 text-body-sm">
                  <MapPin size={14} />
                  <span>{city}</span>
                </div>
              )}
              <p className="text-body-sm text-gray-400 mt-1">Membre depuis {joined}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: "Switchs", value: "0" },
                { label: "Avis", value: "0" },
                { label: "Note", value: "—" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-2xl p-4 text-center">
                  <p className="text-title font-black text-gray-900">{value}</p>
                  <p className="text-body-xs text-gray-400 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* À propos */}
            <div className="mb-8">
              <h3 className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-3">À propos</h3>
              <p className="text-body-md text-gray-500 leading-relaxed">
                Aucune description pour le moment. Complétez votre profil pour augmenter vos chances de match !
              </p>
            </div>

            {/* Avis */}
            <div>
              <h3 className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Avis</h3>
              <div className="flex flex-col items-center py-8 gap-3 text-center">
                <Star size={32} className="text-gray-200" />
                <p className="text-body-sm text-gray-400 font-medium">Aucun avis pour le moment.</p>
                <p className="text-body-xs text-gray-300">Les avis apparaîtront après vos premiers échanges.</p>
              </div>
            </div>
          </div>
        </main>

        {/* CTA */}
        <div className="shrink-0 px-6 py-5 border-t border-gray-100">
          <Link
            href="/profil/parametres/informations"
            scroll={false}
            className="w-full py-4 rounded-2xl font-bold text-body-md text-white flex items-center justify-center transition-all hover:opacity-90"
            style={{ background: "linear-gradient(90deg, var(--brand-cyan), var(--brand-purple))" }}
          >
            Compléter mon profil
          </Link>
        </div>
      </div>
    </div>
  );
}
