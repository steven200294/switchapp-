"use client";

import type { MockConversation } from "../types/messages.types";

interface ChatMenuProps {
  activeChat: MockConversation;
  isMobile: boolean;
  onClose: () => void;
}

const MENU_ITEMS: { icon: string; label: string; isCircle?: boolean }[] = [
  {
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    label: "Voir le logement proposé",
  },
  {
    icon: "M12 7a4 4 0 100 8 4 4 0 000-8zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2",
    label: "Consulter son profil public",
    isCircle: true,
  },
  {
    icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    label: "Supprimer la conversation",
  },
  {
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    label: "Signaler ou Bloquer",
  },
];

export default function ChatMenu({ activeChat, isMobile, onClose }: ChatMenuProps) {
  return (
    <div className={`absolute inset-0 z-[300] flex flex-col justify-end ${isMobile ? "" : "rounded-3xl overflow-hidden"}`}>
      <button
        type="button"
        className={`absolute inset-0 w-full h-full bg-black/40 backdrop-blur-[2px] cursor-default ${
          isMobile ? "animate-fade-in" : ""
        }`}
        onClick={onClose}
        aria-label="Fermer le menu"
      />
      <div
        className={`relative bg-white pt-3 px-5 shadow-2xl shadow-black/10 w-full flex flex-col ${
          isMobile
            ? "rounded-t-3xl pb-[calc(24px+env(safe-area-inset-bottom))] animate-page-slide-up"
            : "rounded-t-2xl pb-6 border-x border-gray-100"
        }`}
      >
        <div className="w-10 h-[5px] bg-gray-200 rounded-full mx-auto mb-6" />
        <h3 className="text-caption font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
          Options &bull; {activeChat.name}
        </h3>
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.label}
            type="button"
            className={`flex items-center gap-4 px-2 py-4 w-full text-left active:bg-gray-50 transition-colors group ${
              i < MENU_ITEMS.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="text-gray-900 flex items-center justify-center group-active:scale-95 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                {item.isCircle && <circle cx="12" cy="7" r="4" />}
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
            </div>
            <span className="text-body-xl font-medium text-gray-900">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
