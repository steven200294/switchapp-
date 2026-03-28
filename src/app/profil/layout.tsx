import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { ReactNode } from "react";

// --- Icons ---
const SettingsIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ProfileIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const PrivacyIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002" /></svg>;
const HelpIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>;
const ReferralIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>;
const HomeIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
const GiftIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
const LegalIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
const LogoutIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>;

// --- Data ---
type MenuItemType = {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
  isDestructive?: boolean;
  href?: string;
};

const menuGroup1: MenuItemType[] = [
  { id: "settings", label: "Paramètres du compte", description: "Gérez vos informations de compte, moyens de paiement et préférences", icon: SettingsIcon, href: "/profil/parametres" },
  { id: "profile", label: "Voir le profil", description: "Accédez à votre profil public tel que les autres utilisateurs le voient", icon: ProfileIcon, href: "/profil/public" },
  { id: "privacy", label: "Confidentialité", description: "Contrôlez les données partagées et sécurisez votre compte", icon: PrivacyIcon, href: "/profil/confidentialite" },
  { id: "help", label: "Obtenir de l'aide", description: "Trouvez des réponses à vos questions et contactez le support", icon: HelpIcon, href: "/profil/aide" },
];

const menuGroup2: MenuItemType[] = [
  { id: "referral", label: "Parrainer un ami", description: "Invitez vos amis et gagnez des avantages exclusifs sur la plateforme", icon: ReferralIcon, href: "/profil/parrainage" },
  { id: "host", label: "Proposer votre logement", description: "Créez une annonce pour mettre votre appartement à disposition", icon: HomeIcon, href: "/profil/hote" },
  { id: "gift", label: "Cartes cadeaux", description: "Offrez ou utilisez un code promotionnel SwitchAppart", icon: GiftIcon, href: "/profil/cadeaux" },
  { id: "legal", label: "Juridique", description: "Consultez nos conditions générales et politiques d'utilisation", icon: LegalIcon, href: "/profil/juridique" },
  { id: "logout", label: "Se déconnecter", description: "Fermez votre session en toute sécurité sur cet appareil", icon: LogoutIcon, isDestructive: true },
];

export default function ProfilLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 md:bg-white pb-24 md:pb-0">
      {/* Header caché sur mobile */}
      <div className="hidden md:block border-b border-gray-100">
        <Header />
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-8 pb-12">
        {/* Header Profil & Cloche */}
        <div className="flex items-center justify-between gap-4 mb-6 mt-2 md:mt-0 w-full max-w-2xl mx-auto md:max-w-none">
          <h1 className="text-[32px] md:text-4xl font-bold text-gray-900 tracking-tight">Profil</h1>
          <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-800">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
        </div>

        {/* Section Cards (Profil + Premium) */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 w-full max-w-2xl mx-auto md:max-w-none">
          
          <div className="flex-1 bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-8 flex flex-col items-center justify-center md:h-[220px]">
            <div className="w-[88px] h-[88px] md:w-[104px] md:h-[104px] bg-[#222222] rounded-full flex items-center justify-center text-white text-[32px] md:text-[36px] font-semibold mb-3 md:mb-5 shadow-sm">
              K
            </div>
            <h2 className="text-[24px] md:text-[28px] font-bold text-gray-900 mb-0.5 tracking-tight">Kuti</h2>
            <p className="text-[14px] md:text-[15px] font-bold text-[#8A2BE2]">Switcher</p>
          </div>

          {/* Abonnement Box Compacte (Style Tinder Gold) sans le titre agressif */}
          <div className="w-full md:max-w-[400px] rounded-[1.5rem] bg-[#111111] p-5 md:p-6 text-white shadow-xl relative overflow-hidden shrink-0 border border-white/10 group mb-8 md:mb-0 flex flex-col justify-between h-auto md:h-[220px]">
            <div className="relative z-10">
              <h4 className="text-[19px] font-bold text-white leading-tight mb-2 tracking-tight">
                Démarquez-vous. Sortez du lot.
              </h4>
              <p className="text-[13px] text-gray-400 font-medium mb-5 leading-snug">
                Découvrez qui vous a liké et profitez des Swipes illimités & Boosts mensuels.
              </p>
            </div>
            
            <button className="relative z-10 mt-auto w-full flex items-center justify-between group/btn transition-all active:scale-[0.98]">
              <span className="font-bold text-[15px] text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] tracking-wide">
                Découvrir les avantages
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover/btn:bg-white/20 group-hover/btn:translate-x-1 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
              </div>
            </button>
            
            {/* Lueur d'ambiance Premium - réduite */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-[#00BFFF]/20 via-[#8A2BE2]/20 to-transparent rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
          </div>
        </div>

        {/* 🧐 Banner Vérification d'Identité (Style application native avec émoji 3D) */}
        <button className="w-full max-w-2xl mx-auto md:max-w-none bg-white rounded-3xl p-5 shadow-sm border border-purple-100/50 mb-8 flex items-center justify-between hover:border-purple-200 hover:shadow-md transition-all group text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-50/50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-purple-100/50 transition-colors">
              <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Thinking%20Face.png" alt="Thinking Face" className="w-8 h-8 drop-shadow-sm" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-[16px] mb-0.5">Faites vérifier votre identité</h3>
              <p className="text-[14px] text-gray-500 font-medium leading-tight">Gagnez la confiance de la communauté SwitchAppart.</p>
            </div>
          </div>
          <div className="hidden sm:flex w-8 h-8 rounded-full bg-gray-50 items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
          </div>
        </button>

        {/* --- VERSION MOBILE --- (Liste) */}
        <div className="md:hidden bg-white max-w-2xl mx-auto rounded-3xl p-2 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col">
            {menuGroup1.map((item, index) => {
              const Tag = item.href ? Link : 'button';
              return (
                <Tag href={item.href || '#'} key={item.id} className={`w-full flex items-center justify-between p-4 bg-white active:bg-gray-50 transition-colors rounded-xl ${index !== menuGroup1.length -1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 text-gray-700">{item.icon}</div>
                    <span className="text-[16px] text-gray-900">{item.label}</span>
                  </div>
                  <div className="text-gray-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                  </div>
                </Tag>
              );
            })}
          </div>
        </div>
        
        <div className="md:hidden bg-white max-w-2xl mx-auto rounded-3xl p-2 shadow-sm border border-gray-100">
          <div className="flex flex-col">
            {menuGroup2.map((item, index) => {
              const Tag = item.href ? Link : 'button';
              return (
                <Tag href={item.href || '#'} key={item.id} className={`w-full flex items-center justify-between p-4 bg-white active:bg-gray-50 transition-colors rounded-xl ${index !== menuGroup2.length -1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 ${item.isDestructive ? 'text-red-500' : 'text-gray-700'}`}>{item.icon}</div>
                    <span className={`text-[16px] ${item.isDestructive ? 'font-semibold text-red-500' : 'text-gray-900'}`}>{item.label}</span>
                  </div>
                  {!item.isDestructive && (
                    <div className="text-gray-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </div>
                  )}
                </Tag>
              );
            })}
          </div>
        </div>

        {/* --- VERSION DESKTOP --- (Grille de Cards) */}
        <div className="hidden md:block mt-12">
          <div className="w-full h-px bg-gray-200 mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...menuGroup1, ...menuGroup2].map((item) => {
              const Tag = item.href ? Link : 'button';
              return (
                <Tag 
                  href={item.href || '#'}
                  key={item.id} 
                  className="group flex flex-col items-start p-6 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-lg transition-all text-left h-full"
                >
                  <div className={`w-8 h-8 mb-5 ${item.isDestructive ? 'text-red-500' : 'text-gray-900'}`}>
                    {item.icon}
                  </div>
                  <h3 className={`text-[17px] font-bold mb-2 ${item.isDestructive ? 'text-red-500' : 'text-gray-900'}`}>
                    {item.label}
                  </h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </Tag>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav />
      {children}
    </div>
  );
}
