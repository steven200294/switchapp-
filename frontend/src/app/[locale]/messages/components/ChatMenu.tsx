"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Home, UserRound, Trash, AlertTriangle } from "@/shared/ui/icons";
import type { ConversationThread } from "../types/messages.types";

interface ChatMenuProps {
  activeChat: ConversationThread;
  isMobile: boolean;
  onClose: () => void;
}

const MENU_ITEMS: { messageKey: "viewProperty" | "viewPublicProfile" | "deleteConversation" | "reportOrBlock"; icon: ReactNode }[] = [
  { messageKey: "viewProperty", icon: <Home className="w-6 h-6" strokeWidth={1.5} /> },
  { messageKey: "viewPublicProfile", icon: <UserRound className="w-6 h-6" strokeWidth={1.5} /> },
  { messageKey: "deleteConversation", icon: <Trash className="w-6 h-6" strokeWidth={1.5} /> },
  { messageKey: "reportOrBlock", icon: <AlertTriangle className="w-6 h-6" strokeWidth={1.5} /> },
];

export default function ChatMenu({ activeChat, isMobile, onClose }: ChatMenuProps) {
  const t = useTranslations("messages");

  return (
    <div className={`absolute inset-0 z-300 flex flex-col justify-end ${isMobile ? "" : "rounded-3xl overflow-hidden"}`}>
      <button
        type="button"
        className={`absolute inset-0 w-full h-full bg-black/40 backdrop-blur-[2px] cursor-default ${
          isMobile ? "animate-fade-in" : ""
        }`}
        onClick={onClose}
        aria-label={t("closeMenu")}
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
          {t("optionsFor", { name: activeChat.name })}
        </h3>
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.messageKey}
            type="button"
            className={`flex items-center gap-4 px-2 py-4 w-full text-left active:bg-gray-50 transition-colors group ${
              i < MENU_ITEMS.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="text-gray-900 flex items-center justify-center group-active:scale-95 transition-transform">
              {item.icon}
            </div>
            <span className="text-body-xl font-medium text-gray-900">{t(item.messageKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
