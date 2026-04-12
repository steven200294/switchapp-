"use client";

import type { ChatEntry } from "./types";
import TypingText from "./TypingText";

interface Props {
  entry: ChatEntry;
  animate?: boolean;
  onTypingDone?: () => void;
}

export default function ChatMessage({ entry, animate = false, onTypingDone }: Props) {
  const isBot = entry.role === "bot";

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} ${animate ? "animate-chat-slide-up" : ""}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-cyan to-brand-purple flex items-center justify-center shrink-0 mr-2.5 mt-1 shadow-sm">
          <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
            <path d="M10 2a3 3 0 00-3 3v1H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-2V5a3 3 0 00-3-3zm-1 3a1 1 0 112 0v1H9V5zm-1 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm4 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
          </svg>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-body-md leading-relaxed ${
          isBot ? "bg-brand-chat-bg text-gray-800 rounded-tl-md" : "bg-brand-dark text-white rounded-tr-md"
        }`}
      >
        {isBot && animate ? (
          <TypingText text={entry.content} speed={20} onDone={onTypingDone} />
        ) : (
          entry.content
        )}
      </div>
    </div>
  );
}
