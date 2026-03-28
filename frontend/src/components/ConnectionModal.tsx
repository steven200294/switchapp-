"use client";

import { useEffect, useState } from "react";

type Props = {
  onClose: () => void;
};

export default function ConnectionModal({ onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 z-[540] flex flex-col justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 pointer-events-auto ${visible ? "opacity-100" : "opacity-0"}`} 
        onClick={handleClose} 
      />
      <div
        className="w-full bg-white border-t border-gray-200 shadow-2xl transition-transform duration-300 ease-out min-h-[80vh] rounded-t-[3rem] relative pointer-events-auto"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Cercles décoratifs d'appartements responsifs, bien séparés et très visibles */}
        <div className="absolute inset-0 overflow-hidden rounded-t-[3rem] pointer-events-none z-0">
          
          {/* Gauche haut */}
          <div className="absolute top-[5%] left-[-8%] md:left-[-2%] lg:left-[5%] w-28 h-28 md:w-40 md:h-40 lg:w-56 lg:h-56 rounded-full border-4 border-white overflow-hidden opacity-100">
            <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fit=crop&w=600&q=100" alt="Apartment interior" className="w-full h-full object-cover" />
          </div>

          {/* Gauche bas */}
          <div className="absolute bottom-[8%] left-[-8%] md:left-[0%] lg:left-[8%] w-28 h-28 md:w-44 md:h-44 lg:w-60 lg:h-60 rounded-full border-4 border-white overflow-hidden opacity-100">
            <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?fit=crop&w=600&q=100" alt="Apartment interior" className="w-full h-full object-cover" />
          </div>

          {/* Droite haut */}
          <div className="absolute top-[15%] right-[-8%] md:right-[-2%] lg:right-[5%] w-28 h-28 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full border-4 border-white overflow-hidden opacity-100">
            <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?fit=crop&w=600&q=100" alt="Apartment interior" className="w-full h-full object-cover" />
          </div>

          {/* Droite bas */}
          <div className="absolute bottom-[5%] right-[-8%] md:right-[2%] lg:right-[10%] w-28 h-28 md:w-40 md:h-40 lg:w-52 lg:h-52 rounded-full border-4 border-white overflow-hidden opacity-100">
            <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?fit=crop&w=600&q=100" alt="Apartment interior" className="w-full h-full object-cover" />
          </div>
          {/* Petits cercles Desktop */}
          {/* Petit gauche milieu */}
          <div className="hidden lg:block absolute top-[45%] left-[18%] w-24 h-24 rounded-full border-2 border-white overflow-hidden opacity-90">
            <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fit=crop&w=300&q=80" alt="Apartment interior" className="w-full h-full object-cover" />
          </div>

          {/* Petit gauche haut */}
          <div className="hidden lg:block absolute top-[22%] left-[22%] w-16 h-16 rounded-full border-2 border-white overflow-hidden opacity-80">
            <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?fit=crop&w=300&q=80" alt="Apartment interior" className="w-full h-full object-cover" />
          </div>

          {/* Petit droite milieu */}
          <div className="hidden lg:block absolute top-[38%] right-[16%] w-20 h-20 rounded-full border-2 border-white overflow-hidden opacity-90">
            <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?fit=crop&w=300&q=80" alt="Apartment interior" className="w-full h-full object-cover" />
          </div>

          {/* Petit droite haut */}
          <div className="hidden lg:block absolute top-[28%] right-[22%] w-14 h-14 rounded-full border-2 border-white overflow-hidden opacity-80">
            <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?fit=crop&w=300&q=80" alt="Apartment interior" className="w-full h-full object-cover" />
          </div>

        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-2 rounded-full z-50"
          aria-label="Fermer"
        >
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <path d="M21 7L7 21M7 7l14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex flex-col items-center pt-12 pb-8 px-6 w-full max-w-md mx-auto overflow-y-auto max-h-[80vh] relative z-10">

          {/* Titre */}
          <div className="text-center mb-6">
            <h2 className="text-[28px] font-bold text-gray-900 mb-1">
              {activeTab === "signin" ? "Connexion" : "Créer un compte"}
            </h2>
            <p className="text-[14px] text-gray-400">
              {activeTab === "signin"
                ? "Bon retour, veuillez entrer vos informations"
                : "Inscrivez-vous pour commencer"}
            </p>
            {activeTab === "signup" && (
              <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People%20with%20professions/Woman%20Medium-Light%20Skin%20Tone.png"
                alt="Woman Medium-Light Skin Tone"
                width={120}
                height={120}
                className="mx-auto mt-2"
              />
            )}
            {activeTab === "signin" && (
              <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People%20with%20professions/Woman%20Medium-Light%20Skin%20Tone.png"
                alt="Woman Medium-Light Skin Tone"
                width={120}
                height={120}
                className="mx-auto mt-2"
              />
            )}
          </div>

          {/* Toggle */}
          <div className="bg-gray-100 p-[5px] rounded-2xl flex w-full mb-8">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-3 text-center text-[15px] font-semibold rounded-xl transition-all ${
                activeTab === "signin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-3 text-center text-[15px] font-semibold rounded-xl transition-all ${
                activeTab === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Formulaire */}
          <div className="w-full space-y-4 mb-6">

            {/* Nom — uniquement Sign Up */}
            {activeTab === "signup" && (
              <div className="border border-gray-200 rounded-2xl flex items-center p-2 bg-white shadow-sm focus-within:border-gray-300 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center text-black shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
                <div className="w-px h-8 bg-gray-200 shrink-0 mx-1" />
                <div className="flex-1 flex flex-col justify-center pl-3 pr-2">
                  <label className="text-[11px] text-gray-500 font-medium mb-0.5">Nom complet</label>
                  <input
                    type="text"
                    placeholder="Jean Dupont"
                    className="text-[14px] font-bold text-black outline-none bg-transparent w-full placeholder:font-normal placeholder:text-gray-300"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="border border-gray-200 rounded-2xl flex items-center p-2 bg-white shadow-sm focus-within:border-gray-300 transition-colors">
              <div className="w-12 h-12 flex items-center justify-center text-black shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </div>
              <div className="w-px h-8 bg-gray-200 shrink-0 mx-1" />
              <div className="flex-1 flex flex-col justify-center pl-3 pr-2">
                <label className="text-[11px] text-gray-500 font-medium mb-0.5">Adresse email</label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="text-[14px] font-bold text-black outline-none bg-transparent w-full placeholder:font-normal placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="border border-gray-200 rounded-2xl flex items-center p-2 bg-white shadow-sm focus-within:border-gray-300 transition-colors">
              <div className="w-12 h-12 flex items-center justify-center text-black shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="3" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <div className="w-px h-8 bg-gray-200 shrink-0 mx-1" />
              <div className="flex-1 flex flex-col justify-center pl-3 pr-2">
                <label className="text-[11px] text-gray-500 font-medium mb-0.5">Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="text-[14px] font-bold text-black outline-none bg-transparent w-full placeholder:font-normal placeholder:text-gray-300 tracking-widest"
                />
              </div>
            </div>

            {/* Confirmer le mot de passe — uniquement Sign Up */}
            {activeTab === "signup" && (
              <div className="border border-gray-200 rounded-2xl flex items-center p-2 bg-white shadow-sm focus-within:border-gray-300 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center text-black shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="3" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <div className="w-px h-8 bg-gray-200 shrink-0 mx-1" />
                <div className="flex-1 flex flex-col justify-center pl-3 pr-2">
                  <label className="text-[11px] text-gray-500 font-medium mb-0.5">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="text-[14px] font-bold text-black outline-none bg-transparent w-full placeholder:font-normal placeholder:text-gray-300 tracking-widest"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bouton */}
          <button className="w-full bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white font-black rounded-full py-4 text-[16px] transition-opacity hover:opacity-90 shadow-md mb-8">
            {activeTab === "signin" ? "Se connecter" : "Créer un compte"}
          </button>

          {/* Divider */}
          <div className="flex items-center w-full mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-4 text-[13px] text-gray-400 font-medium">Ou continuer avec</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social */}
          <div className="flex items-center justify-center space-x-5 mb-8">
            <button className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            <button className="w-14 h-14 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-900 transition-colors shadow-sm">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 14.4c0-2.4 1.9-3.5 1.9-3.5-.9-1.3-2.3-1.5-2.8-1.5-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3.1-2.5.8-3.2 2-1.3 2.3-.3 5.7 1 7.6.6.9 1.4 1.9 2.4 1.9 1 0 1.4-.6 2.5-.6 1.1 0 1.5.6 2.5.6 1 0 1.7-1 2.3-1.9.8-1.1 1.1-2.3 1.1-2.4 0-.1-2.1-.8-2.1-3.2zM14.6 10c.5-.7.9-1.6.8-2.5-.8 0-1.8.4-2.4 1-.5.5-.9 1.4-.8 2.3.9.1 1.8-.4 2.4-1z" />
              </svg>
            </button>
            <button className="w-14 h-14 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:bg-[#166FE5] transition-colors shadow-sm">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>

          {/* Lien toggle bas */}
          <p className="text-[13px] text-gray-400 text-center pb-4">
            {activeTab === "signin" ? (
              <>Pas encore de compte ?{" "}
                <button onClick={() => setActiveTab("signup")} className="text-gray-900 font-semibold hover:underline">
                  S'inscrire
                </button>
              </>
            ) : (
              <>Déjà un compte ?{" "}
                <button onClick={() => setActiveTab("signin")} className="text-gray-900 font-semibold hover:underline">
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
