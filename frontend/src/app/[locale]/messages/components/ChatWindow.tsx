"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "@/shared/ui/icons";
import { useAuthStore } from "@/shared/stores/auth.store";
import type { ConversationThread } from "../types/messages.types";
import { useMessages } from "../hooks/useMessages";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMenu from "./ChatMenu";

interface ChatWindowProps {
  activeChat: ConversationThread;
  setActiveChat: (c: ConversationThread | null) => void;
  isMobile: boolean;
}

export default function ChatWindow({ activeChat, setActiveChat, isMobile }: ChatWindowProps) {
  const t = useTranslations("messages");
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const userId = useAuthStore((s) => s.user?.id);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useMessages(activeChat.id, true);
  const messages = data?.messages ?? [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <>
      <div
        className={`flex flex-col bg-white overflow-hidden ${
          isMobile
            ? "fixed inset-0 z-200 animate-page-slide-right pb-[env(safe-area-inset-bottom)]"
            : "w-full h-full relative z-10"
        }`}
      >
        <ChatHeader
          name={activeChat.name}
          avatar={activeChat.avatar}
          onBack={() => setActiveChat(null)}
          onMenuOpen={() => setIsChatMenuOpen(true)}
          isMobile={isMobile}
        />

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 bg-brand-chat-bg flex flex-col gap-3 scrollbar-hide">
          <div className="flex justify-center mb-2">
            <span className="text-body-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
              {t("today")}
            </span>
          </div>

          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          )}

          {messages.map((msg) => {
            const isOwn = msg.sender_id === userId;
            return (
              <div key={msg.id} className={`flex ${isOwn ? "self-end" : "self-start"} max-w-[85%] gap-2 items-end`}>
                {!isOwn && (
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-auto">
                    <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={`px-4 py-3 rounded-2xl text-body-md leading-snug ${
                  isOwn
                    ? "bg-linear-to-r from-brand-cyan to-brand-purple text-white rounded-br-none"
                    : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-none"
                }`}>
                  {msg.content || "—"}
                </div>
              </div>
            );
          })}

          {!isLoading && messages.length === 0 && (
            <div className="flex self-start max-w-[85%] gap-2 items-end">
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-auto">
                <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-gray-100 shadow-sm text-gray-800 text-body-md leading-snug">
                {activeChat.lastMessage || "—"}
              </div>
            </div>
          )}
        </div>

        <ChatInput conversationId={activeChat.id} />
      </div>

      {isChatMenuOpen && (
        <ChatMenu activeChat={activeChat} isMobile={isMobile} onClose={() => setIsChatMenuOpen(false)} />
      )}
    </>
  );
}
