"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";

export default function InformationsPage() {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    full_name: user?.full_name ?? "",
    email: user?.email ?? "",
    phone: "",
    city: user?.city ?? "",
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <Link href="/profil/parametres" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:left-auto md:w-full md:max-w-2xl h-full bg-white shadow-2xl flex flex-col md:animate-page-slide-right animate-page-slide-up overflow-hidden">
        <header className="px-5 py-4 flex items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100">
          <Link href="/profil/parametres" scroll={false} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-title-sm font-bold text-gray-900 ml-3">Informations personnelles</h1>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 lg:px-10 py-8 space-y-8">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-display font-bold text-gray-300">
                  {user?.full_name?.[0] ?? "?"}
                </div>
              )}
            </div>
            <div>
              <button className="text-body-md font-bold text-gray-900 hover:underline">Modifier la photo</button>
              <p className="text-body-sm text-gray-400 mt-0.5">JPG, PNG ou GIF · 5 Mo max</p>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Champs */}
          <div className="space-y-5">
            <div>
              <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Prénom et nom</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-cyan transition-all"
                placeholder="Votre nom complet"
              />
            </div>

            <div>
              <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Adresse e-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-body-lg text-gray-500 focus:outline-none cursor-not-allowed"
                disabled
              />
              <p className="text-body-sm text-gray-400 mt-2">L'adresse e-mail ne peut pas être modifiée.</p>
            </div>

            <div>
              <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Téléphone</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  defaultValue="+33"
                  className="w-20 text-center px-3 py-3.5 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 transition-all"
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="6 12 34 56 78"
                  className="flex-1 px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Ville</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Paris, France"
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 transition-all"
              />
              <p className="text-body-sm text-gray-400 mt-2">Votre adresse exacte ne sera jamais partagée avant la validation d'un Switch.</p>
            </div>
          </div>
        </main>

        <div className="shrink-0 px-6 lg:px-10 py-5 border-t border-gray-100">
          <button
            onClick={handleSave}
            className={`w-full py-4 rounded-2xl font-bold text-body-md text-white transition-all hover:opacity-90 active:scale-[0.98] ${saved ? "bg-green-500" : "bg-black"}`}
          >
            {saved ? "Enregistré ✓" : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}
