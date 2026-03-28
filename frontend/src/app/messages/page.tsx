"use client";

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";

// Types
type Match = { id: number; name: string; avatar: string; city: string };
type Conversation = { id: number; name: string; avatar: string; lastMessage: string; time: string; unread: boolean; status: string };

const mockMatches: Match[] = [
  { id: 1, name: "Thomas", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=150&q=80", city: "Paris" },
  { id: 2, name: "Émilie", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&q=80", city: "Lyon" },
  { id: 3, name: "Lucas", avatar: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?fit=crop&w=150&q=80", city: "Marseille" },
  { id: 4, name: "Marie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=150&q=80", city: "Bordeaux" },
  { id: 5, name: "Antoine", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&q=80", city: "Nice" },
];

const mockConversations: Conversation[] = [
  {
    id: 1, name: "Thomas Dubois", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=150&q=80",
    lastMessage: "Salut ! Ton appartement à Paris a l'air super, on pourrait échanger sur les dates ?", time: "14:32", unread: true, status: "Demande reçue",
  },
  {
    id: 2, name: "Émilie Laurent", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&q=80",
    lastMessage: "C'est confirmé pour le 15 août. J'ai hâte, merci encore ! On se capte à l'arrivée.", time: "Hier", unread: false, status: "Échange confirmé",
  },
  {
    id: 3, name: "Lucas & Chloé", avatar: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?fit=crop&w=150&q=80",
    lastMessage: "Bonjour, est-ce que le quartier est calme le soir ? Nous cherchons un endroit reposant.", time: "Lun.", unread: false, status: "",
  },
  {
    id: 4, name: "Marie Silva", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=150&q=80",
    lastMessage: "Merci pour les infos. Je regarde ça et je vous tiens au courant très rapidement.", time: "12 Mar", unread: false, status: "",
  }
];

// Composant interne pour l'interface du Chat (réutilisable Desktop / Mobile)
function ChatWindow({ activeChat, setActiveChat, isMobile }: { activeChat: Conversation, setActiveChat: (c: typeof activeChat | null) => void, isMobile: boolean }) {
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

  return (
    <>
      <div className={`flex flex-col bg-white overflow-hidden ${isMobile ? "fixed inset-0 z-[200] animate-page-slide-right pb-[env(safe-area-inset-bottom)]" : "w-full h-full relative z-10"}`}>
        
        {/* Header du Chat */}
        <header className="px-4 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            {/* Bouton retour (utile pour mobile ET pour désélectionner sur desktop) */}
            <button 
              onClick={() => setActiveChat(null)} 
              className={`p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 ${!isMobile ? 'md:hidden' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm relative">
                <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">{activeChat.name}</h2>
            </div>
          </div>
          
          <button onClick={() => setIsChatMenuOpen(true)} className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </header>

        {/* Espace Discussions */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-[#f8f9fa] flex flex-col gap-6 scrollbar-hide">
          <div className="flex justify-center mb-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
              AUJOURD'HUI
            </span>
          </div>
          
          {/* Message Locataire */}
          <div className="flex self-start max-w-[85%] gap-2 items-end">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-auto">
              <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] text-gray-800 text-[15px] leading-snug">
              {activeChat.lastMessage}
            </div>
          </div>

          {/* Réponse Hôte */}
          {activeChat.unread && (
            <div className="flex self-end max-w-[85%] gap-2 items-end">
              <div className="px-4 py-3 rounded-2xl rounded-br-none bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white text-[15px] leading-snug shadow-[0_4px_14px_rgba(138,43,226,0.2)]">
                Super merci beaucoup ! Je te tiens au courant très vite. 🙌
              </div>
            </div>
          )}
        </div>

        {/* Barre du bas de frappe */}
        <div className="p-3 bg-white border-t border-gray-200 shrink-0">
          <div className="flex items-center bg-[#f1f3f5] rounded-[24px] pr-2 pl-4 py-2 ring-1 ring-gray-200/50 focus-within:ring-[#8A2BE2] focus-within:bg-white transition-all">
            <button className="p-1 mr-2 text-gray-400 hover:text-[#00BFFF] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            </button>
            <input 
              type="text" 
              placeholder="Écrire un message..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] text-gray-900 outline-none min-w-0"
            />
            <button className="w-9 h-9 rounded-full bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white flex items-center justify-center shrink-0 ml-2 shadow-sm hover:scale-105 transition-transform active:scale-95">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 ml-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* OVERLAY MENU 3 POINTS */}
      {isChatMenuOpen && (
        <div className={`absolute inset-0 z-[300] flex flex-col justify-end ${isMobile ? '' : 'rounded-3xl overflow-hidden'}`}>
          <button 
            className={`absolute inset-0 w-full h-full bg-black/40 backdrop-blur-[2px] cursor-default ${isMobile ? 'animate-fade-in' : ''}`}
            onClick={() => setIsChatMenuOpen(false)}
          />
          <div className={`relative bg-white pt-3 px-5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] w-full flex flex-col ${isMobile ? 'rounded-t-3xl pb-[calc(24px+env(safe-area-inset-bottom))] animate-page-slide-up' : 'rounded-t-2xl pb-6 border-x border-gray-100'}`}>
            <div className="w-10 h-[5px] bg-gray-200 rounded-full mx-auto mb-6" />
            <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Options • {activeChat.name}</h3>
            
            <button className="flex items-center gap-4 px-2 py-4 border-b border-gray-100 w-full text-left active:bg-gray-50 transition-colors group">
              <div className="text-gray-900 flex items-center justify-center group-active:scale-95 transition-transform">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[26px] h-[26px]"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              </div>
              <span className="text-[17px] font-medium text-gray-900">Voir le logement proposé</span>
            </button>
            <button className="flex items-center gap-4 px-2 py-4 border-b border-gray-100 w-full text-left active:bg-gray-50 transition-colors group">
              <div className="text-gray-900 flex items-center justify-center group-active:scale-95 transition-transform">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[26px] h-[26px]"><circle cx="12" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>
              </div>
              <span className="text-[17px] font-medium text-gray-900">Consulter son profil public</span>
            </button>
            <button className="flex items-center gap-4 px-2 py-4 border-b border-gray-100 w-full text-left active:bg-gray-50 transition-colors group">
              <div className="text-gray-900 flex items-center justify-center group-active:scale-95 transition-transform">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[26px] h-[26px]"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </div>
              <span className="text-[17px] font-medium text-gray-900">Supprimer la conversation</span>
            </button>
            <button className="flex items-center gap-4 px-2 py-4 w-full text-left active:bg-gray-50 transition-colors group">
              <div className="text-gray-900 flex items-center justify-center group-active:scale-95 transition-transform">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[26px] h-[26px]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <span className="text-[17px] font-medium text-gray-900">Signaler ou Bloquer</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ================= PAGE PRINCIPALE =================
export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <div className="hidden md:block border-b border-gray-100 shrink-0">
        <Header />
      </div>

      <main className="flex-1 w-full max-w-[1400px] mx-auto flex md:p-6 gap-6 overflow-hidden relative">
        
        {/* ================= GAUCHE / MASTER LIST ================= */}
        <div className={`w-full md:w-[400px] lg:w-[450px] shrink-0 h-full overflow-y-auto scrollbar-hide flex-col pb-[90px] md:pb-0 
          ${activeChat ? "hidden md:flex" : "flex"} 
          md:border md:border-gray-100 md:bg-white md:rounded-3xl md:shadow-sm`}
        >
          <div className="px-6 pt-10 md:pt-8 md:px-8 pb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-transparent">
            <h1 className="text-[32px] md:text-3xl font-bold text-gray-900 tracking-tight">Messages</h1>
          </div>

          <div className="px-6 md:px-8 py-4">
            {/* Section Matchs */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-5">
                <h2 className="text-[18px] font-bold text-gray-900">Nouveaux matchs</h2>
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Face%20with%20Big%20Eyes.png" alt="Face" width="28" height="28" />
                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center text-white text-[11px] font-black">
                  {mockMatches.length}
                </span>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 md:-mx-8 md:px-8 scrollbar-hide">
                {mockMatches.map((match) => (
                  <div key={match.id} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer hover:scale-105 transition-transform" 
                       onClick={() => setActiveChat({ id: match.id, name: match.name, avatar: match.avatar, lastMessage: "Envoyez le premier message !", time: "À l'instant", unread: false, status: "" })}>
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden p-[2.5px] bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2]">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                          <img src={match.avatar} alt={match.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[13px] font-semibold text-gray-800">{match.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:-mx-8 md:px-8">
              <button className="px-5 py-2 min-w-max bg-gray-900 text-white text-[14px] font-bold rounded-full">Tous</button>
              <button className="px-5 py-2 min-w-max bg-white text-gray-700 border border-gray-200 text-[14px] font-semibold rounded-full hover:bg-gray-50 transition-colors">Non lus (1)</button>
              <button className="px-5 py-2 min-w-max bg-white text-gray-700 border border-gray-200 text-[14px] font-semibold rounded-full hover:bg-gray-50 transition-colors">Demandes (1)</button>
            </div>

            {/* Liste des conversations */}
            <div className="flex flex-col">
              {mockConversations.map((conv, index) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveChat(conv)}
                  className={`w-full flex items-start gap-4 py-4 rounded-xl transition-all text-left ${
                    activeChat?.id === conv.id ? 'bg-gray-50/80 -mx-3 px-3' : 'hover:bg-gray-50/50 -mx-3 px-3'
                  } ${index !== mockConversations.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm">
                      <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                    </div>
                    {conv.unread && (
                      <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-2 pt-0.5">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <h2 className={`text-[16px] truncate pr-2 ${conv.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>
                        {conv.name}
                      </h2>
                      <span className={`text-[12px] shrink-0 font-medium ${conv.unread ? 'text-[#8A2BE2]' : 'text-gray-400'}`}>
                        {conv.time}
                      </span>
                    </div>
                    {conv.status && (
                      <p className="text-[11px] font-bold text-gray-900 mb-0.5 uppercase tracking-wide">{conv.status}</p>
                    )}
                    <p className={`text-[14px] line-clamp-1 leading-snug ${conv.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-500'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= DROITE / DESKTOP VIEW ================= */}
        <div className="hidden md:flex flex-1 h-full bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden relative">
          {activeChat ? (
            <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} isMobile={false} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-[20px] font-bold text-gray-900 mb-2 tracking-tight">Vos messages</h2>
              <p className="text-gray-500 font-medium">Sélectionnez une conversation pour échanger sur vos futurs Switch !</p>
            </div>
          )}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden">
        <BottomNav />
      </div>

      {/* MOBILE FULLSCREEN MODAL */}
      {activeChat && (
        <div className="md:hidden">
           <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} isMobile={true} />
        </div>
      )}

    </div>
  );
}
