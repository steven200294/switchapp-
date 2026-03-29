"use client";

import { useState } from "react";
import type { MockConversation } from "../types/messages.types";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMenu from "./ChatMenu";

interface ChatWindowProps {
  activeChat: MockConversation;
  setActiveChat: (c: MockConversation | null) => void;
  isMobile: boolean;
}

export default function ChatWindow({ activeChat, setActiveChat, isMobile }: ChatWindowProps) {
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

  return (
    <>
      <div
        className={`flex flex-col bg-white overflow-hidden ${
          isMobile
            ? "fixed inset-0 z-[200] animate-page-slide-right pb-[env(safe-area-inset-bottom)]"
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

        <div className="flex-1 overflow-y-auto px-4 py-6 bg-brand-chat-bg flex flex-col gap-6 scrollbar-hide">
          <div className="flex justify-center mb-2">
            <span className="text-body-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
              AUJOURD&apos;HUI
            </span>
          </div>
          <div className="flex self-start max-w-[85%] gap-2 items-end">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-auto">
              <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-gray-100 shadow-sm text-gray-800 text-body-md leading-snug">
              {activeChat.lastMessage}
            </div>
          </div>
          {activeChat.unread && (
            <div className="flex self-end max-w-[85%] gap-2 items-end">
              <div className="px-4 py-3 rounded-2xl rounded-br-none bg-gradient-to-r from-brand-cyan to-brand-purple text-white text-body-md leading-snug shadow-md shadow-brand-purple/20">
                Super merci beaucoup ! Je te tiens au courant très vite.
              </div>
            </div>
          )}
        </div>

        <ChatInput />
      </div>

      {isChatMenuOpen && (
        <ChatMenu activeChat={activeChat} isMobile={isMobile} onClose={() => setIsChatMenuOpen(false)} />
      )}
    </>
  );
}
