"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Heart } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ConnectionModal from "@/components/ConnectionModal";
import { useAuthStore } from "@/shared/stores/auth.store";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { listConversations, type ConversationListItem } from "@/modules/messages/messages.service";
import { useState } from "react";

type ActiveChat = {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string;
  time: string;
};

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return date.toLocaleDateString("fr-FR", { weekday: "short" });
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function ChatWindow({ activeChat, setActiveChat, isMobile }: { activeChat: ActiveChat; setActiveChat: (c: ActiveChat | null) => void; isMobile: boolean }) {
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

  return (
    <>
      <div className={`flex flex-col bg-white overflow-hidden ${isMobile ? "fixed inset-0 z-[200] animate-page-slide-right pb-[env(safe-area-inset-bottom)]" : "w-full h-full relative z-10"}`}>
        <header className="px-4 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveChat(null)}
              className={`p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 ${!isMobile ? "md:hidden" : ""}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm relative bg-gray-200 flex items-center justify-center">
                {activeChat.avatar ? (
                  <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-gray-400">{activeChat.name[0]}</span>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">{activeChat.name}</h2>
            </div>
          </div>
          <button onClick={() => setIsChatMenuOpen(true)} className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 bg-[#f8f9fa] flex flex-col gap-6 scrollbar-hide">
          <div className="flex justify-center mb-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">AUJOURD&apos;HUI</span>
          </div>
          <div className="flex self-start max-w-[85%] gap-2 items-end">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-auto bg-gray-200 flex items-center justify-center">
              {activeChat.avatar ? (
                <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold text-gray-400">{activeChat.name[0]}</span>
              )}
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] text-gray-800 text-[15px] leading-snug">
              {activeChat.lastMessage}
            </div>
          </div>
        </div>

        <div className="p-3 bg-white border-t border-gray-200 shrink-0">
          <div className="flex items-center bg-[#f1f3f5] rounded-[24px] pr-2 pl-4 py-2 ring-1 ring-gray-200/50 focus-within:ring-[#8A2BE2] focus-within:bg-white transition-all">
            <button className="p-1 mr-2 text-gray-400 hover:text-[#00BFFF] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            </button>
            <input
              type="text"
              placeholder="\u00c9crire un message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] text-gray-900 outline-none min-w-0"
            />
            <button className="w-9 h-9 rounded-full bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white flex items-center justify-center shrink-0 ml-2 shadow-sm hover:scale-105 transition-transform active:scale-95">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 ml-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            </button>
          </div>
        </div>
      </div>

      {isChatMenuOpen && (
        <div className={`absolute inset-0 z-[300] flex flex-col justify-end ${isMobile ? "" : "rounded-3xl overflow-hidden"}`}>
          <button
            className={`absolute inset-0 w-full h-full bg-black/40 backdrop-blur-[2px] cursor-default ${isMobile ? "animate-fade-in" : ""}`}
            onClick={() => setIsChatMenuOpen(false)}
          />
          <div className={`relative bg-white pt-3 px-5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] w-full flex flex-col ${isMobile ? "rounded-t-3xl pb-[calc(24px+env(safe-area-inset-bottom))] animate-page-slide-up" : "rounded-t-2xl pb-6 border-x border-gray-100"}`}>
            <div className="w-10 h-[5px] bg-gray-200 rounded-full mx-auto mb-6" />
            <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Options &bull; {activeChat.name}</h3>
            <button className="flex items-center gap-4 px-2 py-4 border-b border-gray-100 w-full text-left active:bg-gray-50 transition-colors">
              <span className="text-[15px] font-semibold text-gray-900">Voir le profil</span>
            </button>
            <button className="flex items-center gap-4 px-2 py-4 border-b border-gray-100 w-full text-left active:bg-gray-50 transition-colors">
              <span className="text-[15px] font-semibold text-red-500">Signaler</span>
            </button>
            <button
              onClick={() => setIsChatMenuOpen(false)}
              className="mt-4 w-full py-3 text-center text-[15px] font-bold text-gray-500 bg-gray-100 rounded-2xl active:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function MessagesPage() {
  const { isLoggedIn, isLoading: authLoading } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.CONVERSATIONS,
    queryFn: listConversations,
    enabled: isLoggedIn && !authLoading,
  });

  if (!authLoading && !isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0">
        <div className="hidden md:block border-b border-gray-100">
          <Header />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] rounded-full flex items-center justify-center mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Vos messages</h1>
          <p className="text-gray-500 text-[15px] mb-8 max-w-sm">
            Connectez-vous pour voir vos conversations et &eacute;changer avec vos matchs.
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

  const chatList = conversations.map((c) => ({
    id: c.id,
    name: c.otherUser?.full_name || "Utilisateur",
    avatar: c.otherUser?.avatar_url || null,
    lastMessage: c.last_message_text || "Aucun message",
    time: formatTime(c.last_message_at),
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white md:bg-gray-50/50">
      <div className="hidden md:block border-b border-gray-100 bg-white">
        <Header />
      </div>

      <main className="flex-1 flex w-full max-w-7xl mx-auto md:p-6 md:gap-6 overflow-hidden" style={{ height: "calc(100vh - 81px)" }}>

        {/* LEFT — conversation list */}
        <div className={`w-full md:w-[400px] lg:w-[450px] shrink-0 h-full overflow-y-auto scrollbar-hide flex-col pb-[90px] md:pb-0
          ${activeChat ? "hidden md:flex" : "flex"}
          md:border md:border-gray-100 md:bg-white md:rounded-3xl md:shadow-sm`}
        >
          <div className="px-6 pt-10 md:pt-8 md:px-8 pb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
            <h1 className="text-[32px] md:text-3xl font-bold text-gray-900 tracking-tight">Messages</h1>
          </div>

          <div className="px-6 md:px-8 py-4">
            {/* Filters */}
            <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:-mx-8 md:px-8">
              <button className="px-5 py-2 min-w-max bg-gray-900 text-white text-[14px] font-bold rounded-full">Tous</button>
              <button className="px-5 py-2 min-w-max bg-white text-gray-700 border border-gray-200 text-[14px] font-semibold rounded-full hover:bg-gray-50 transition-colors">Non lus</button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-3">
                    <div className="w-14 h-14 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32" />
                      <div className="h-3 bg-gray-200 rounded w-56" />
                    </div>
                  </div>
                ))}
              </div>
            ) : chatList.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-[20px] font-bold text-gray-900 mb-2">Pas encore de conversation</h3>
                <p className="text-gray-500 text-[15px] max-w-sm mx-auto">
                  Swipez et matchez pour commencer &agrave; discuter !
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {chatList.map((conv, index) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveChat(conv)}
                    className={`w-full flex items-start gap-4 py-4 rounded-xl transition-all text-left ${
                      activeChat?.id === conv.id ? "bg-gray-50/80 -mx-3 px-3" : "hover:bg-gray-50/50 -mx-3 px-3"
                    } ${index !== chatList.length - 1 ? "border-b border-gray-50" : ""}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm bg-gray-200 flex items-center justify-center">
                        {conv.avatar ? (
                          <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-gray-400">{conv.name[0]}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pr-2 pt-0.5">
                      <div className="flex items-baseline justify-between mb-0.5">
                        <h2 className="text-[16px] truncate pr-2 font-semibold text-gray-800">{conv.name}</h2>
                        <span className="text-[12px] shrink-0 font-medium text-gray-400">{conv.time}</span>
                      </div>
                      <p className="text-[14px] line-clamp-1 leading-snug font-medium text-gray-500">{conv.lastMessage}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — desktop chat / empty state */}
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
              <p className="text-gray-500 font-medium">S&eacute;lectionnez une conversation pour &eacute;changer sur vos futurs Switch !</p>
            </div>
          )}
        </div>
      </main>

      <div className="md:hidden">
        <BottomNav />
      </div>

      {activeChat && (
        <div className="md:hidden">
          <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} isMobile={true} />
        </div>
      )}
    </div>
  );
}
