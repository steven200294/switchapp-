"use client";

import { useState, useCallback, useEffect } from "react";
import type { ChatBotProps } from "./types";
import ChatMessage from "./ChatMessage";
import StepRenderer from "./StepRenderer";
import CompletedCard from "./CompletedCard";
import useChatEngine from "./useChatEngine";

export default function ChatBot({
  steps, onComplete, onAction, onClose, introMessage, storageKey, labels,
}: ChatBotProps) {
  const e = useChatEngine({ steps, storageKey, onComplete });
  const wasRestored = e.restoredIdx > 0;
  const [typingDone, setTypingDone] = useState(wasRestored);
  const [introDone, setIntroDone] = useState(!introMessage || wasRestored);

  const handleAction = (actionId: string) => {
    e.clearDraft();
    onAction?.(actionId, e.data);
  };

  const onBotTypingDone = useCallback(() => setTypingDone(true), []);
  const onIntroTypingDone = useCallback(() => setIntroDone(true), []);

  useEffect(() => { e.scrollToBottom(); }, [typingDone, introDone, e.scrollToBottom]);

  const visibleCount = Math.min(e.currentIdx + 1, steps.length);

  const handleReset = useCallback(() => {
    e.reset();
    setTypingDone(false);
    setIntroDone(!introMessage);
  }, [e, introMessage]);

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader onClose={onClose} onReset={handleReset} resetLabel={labels.restart} />
      <div ref={e.scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-safe max-w-2xl mx-auto w-full">
        {introMessage && (
          <ChatMessage
            entry={{ id: "intro", role: "bot", content: introMessage }}
            animate={!introDone && !wasRestored}
            onTypingDone={onIntroTypingDone}
          />
        )}

        {introDone && steps.slice(0, visibleCount).map((step, idx) => {
          const isActive = idx === e.currentIdx && e.editingIdx === null;
          const isEditing = e.editingIdx === idx;
          const isCompleted = idx < e.currentIdx && !isEditing;
          const isLatest = idx === e.currentIdx;
          const isRestored = idx < e.restoredIdx;
          const controlReady = isLatest ? typingDone : true;
          const shouldAnimate = !isRestored;

          return (
            <div key={step.id} className="space-y-3">
              <ChatMessage
                entry={{ id: `bot-${step.id}`, role: "bot", content: step.botMessage }}
                animate={isLatest && !typingDone && shouldAnimate}
                onTypingDone={isLatest ? onBotTypingDone : undefined}
              />
              {isCompleted && (
                <div className={shouldAnimate ? "animate-chat-card-in" : undefined}>
                  <CompletedCard step={step} value={e.data[step.id]} onEdit={() => { setTypingDone(true); e.startEdit(idx); }} />
                </div>
              )}
              {(isActive || isEditing) && controlReady && (
                <div className={shouldAnimate ? "animate-chat-card-in" : undefined}>
                  <StepRenderer
                    step={step}
                    value={e.data[step.id]}
                    onChange={(v) => e.handleChange(step.id, v)}
                    onSubmit={() => { setTypingDone(false); e.handleSubmit(idx); }}
                    onAction={handleAction}
                    labels={labels}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChatHeader({ onClose, onReset, resetLabel }: { onClose?: () => void; onReset: () => void; resetLabel: string }) {
  return (
    <header className="px-4 py-3 border-b border-gray-100 flex items-center shrink-0 bg-white/95 backdrop-blur-sm">
      {onClose ? (
        <button type="button" onClick={onClose} className="w-9 h-9 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center outline-none text-gray-900" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      ) : (
        <div className="w-9" />
      )}
      <div className="flex-1 text-center">
        <div className="w-8 h-8 mx-auto rounded-full bg-linear-to-br from-brand-cyan to-brand-purple flex items-center justify-center">
          <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
            <path d="M10 2a3 3 0 00-3 3v1H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-2V5a3 3 0 00-3-3zm-1 3a1 1 0 112 0v1H9V5zm-1 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm4 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
          </svg>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="h-9 px-2.5 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5 outline-none text-gray-500 hover:text-gray-700"
        aria-label={resetLabel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        <span className="text-caption font-medium hidden sm:inline">{resetLabel}</span>
      </button>
    </header>
  );
}
