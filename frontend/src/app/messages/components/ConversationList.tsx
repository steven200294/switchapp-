"use client";

import type { ConversationThread } from "../types/messages.types";

const FILTER_LABELS = ["Tous", "Non lus (1)", "Demandes (1)"] as const;

interface ConversationListProps {
  conversations: ConversationThread[];
  activeChat: ConversationThread | null;
  onSelect: (conv: ConversationThread) => void;
  isLoading?: boolean;
}

export default function ConversationList({
  conversations,
  activeChat,
  onSelect,
  isLoading,
}: ConversationListProps) {
  const inactiveTab =
    "px-5 py-2 min-w-max bg-white text-gray-700 border border-gray-200 text-body font-semibold rounded-full hover:bg-gray-50 transition-colors";
  const activeTab = "px-5 py-2 min-w-max bg-gray-900 text-white text-body font-bold rounded-full";

  return (
    <>
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:-mx-8 md:px-8">
        {FILTER_LABELS.map((label, i) => (
          <button key={label} type="button" className={i === 0 ? activeTab : inactiveTab}>
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-col">
        {isLoading && conversations.length === 0 ? (
          <p className="text-body text-gray-400 text-center py-10">Chargement de vos conversations…</p>
        ) : null}
        {!isLoading && conversations.length === 0 ? (
          <p className="text-body text-gray-400 text-center py-10">Aucune conversation pour le moment.</p>
        ) : null}
        {conversations.map((conv, index) => (
          <button
            key={conv.id}
            type="button"
            onClick={() => onSelect(conv)}
            className={`w-full flex items-start gap-4 py-4 rounded-xl transition-all text-left ${
              activeChat?.id === conv.id ? "bg-gray-50/80 -mx-3 px-3" : "hover:bg-gray-50/50 -mx-3 px-3"
            } ${index !== conversations.length - 1 ? "border-b border-gray-50" : ""}`}
          >
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm">
                <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
              </div>
              {conv.unread && (
                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-linear-to-r from-brand-cyan to-brand-purple rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0 pr-2 pt-0.5">
              <div className="flex items-baseline justify-between mb-0.5">
                <h2
                  className={`text-body-lg truncate pr-2 ${conv.unread ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}
                >
                  {conv.name}
                </h2>
                <span
                  className={`text-caption shrink-0 font-medium ${conv.unread ? "text-brand-purple" : "text-gray-400"}`}
                >
                  {conv.time}
                </span>
              </div>
              {conv.status && (
                <p className="text-body-xs font-bold text-gray-900 mb-0.5 uppercase tracking-wide">{conv.status}</p>
              )}
              <p
                className={`text-body line-clamp-1 leading-snug ${conv.unread ? "font-semibold text-gray-900" : "font-medium text-gray-500"}`}
              >
                {conv.lastMessage}
              </p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
