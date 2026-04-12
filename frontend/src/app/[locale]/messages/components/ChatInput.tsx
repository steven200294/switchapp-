"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Plus, Send, Loader2 } from "@/shared/ui/icons";
import { useSendMessage } from "../hooks/useMessages";

interface ChatInputProps {
  conversationId: string;
}

export default function ChatInput({ conversationId }: ChatInputProps) {
  const t = useTranslations("messages");
  const [text, setText] = useState("");
  const sendMutation = useSendMessage(conversationId);

  const handleSend = useCallback(() => {
    const content = text.trim();
    if (!content || sendMutation.isPending) return;
    sendMutation.mutate(content, {
      onSuccess: () => setText(""),
    });
  }, [text, sendMutation]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="p-3 bg-white border-t border-gray-200 shrink-0">
      <div className="flex items-center bg-gray-100 rounded-[24px] pr-2 pl-4 py-2 ring-1 ring-gray-200/50 focus-within:ring-brand-purple focus-within:bg-white transition-all">
        <button
          type="button"
          className="p-1 mr-2 text-gray-400 hover:text-brand-cyan transition-colors"
          aria-label={t("addAttachment")}
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("messagePlaceholder")}
          className="flex-1 bg-transparent border-none focus:ring-0 text-body-md text-gray-900 outline-none min-w-0"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || sendMutation.isPending}
          className="w-9 h-9 rounded-full bg-linear-to-r from-brand-cyan to-brand-purple text-white flex items-center justify-center shrink-0 ml-2 shadow-[0_0_10px_rgba(0,191,255,0.35),0_0_10px_rgba(138,43,226,0.35)] hover:shadow-[0_0_18px_rgba(0,191,255,0.5),0_0_18px_rgba(138,43,226,0.5)] transition-shadow active:scale-95 disabled:opacity-50"
          aria-label={t("send")}
        >
          {sendMutation.isPending
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Send className="w-4 h-4 ml-0.5" strokeWidth={2.5} />
          }
        </button>
      </div>
    </div>
  );
}
