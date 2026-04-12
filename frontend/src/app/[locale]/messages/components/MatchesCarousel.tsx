"use client";

import { useTranslations } from "next-intl";
import { resolveStorageUrl } from "@/shared/constants/theme";
import type { ConversationThread, MatchListItem } from "../types/messages.types";
import { matchToConversationThread } from "../utils/conversationDisplay";

interface MatchesCarouselProps {
  matches: MatchListItem[];
  onSelectMatch: (conv: ConversationThread) => void;
  isLoading?: boolean;
}

const PLACEHOLDER_AVATARS = [
  "/emojis/avatar-placeholder.svg",
  "/emojis/avatar-placeholder.svg",
  "/emojis/avatar-placeholder.svg",
  "/emojis/avatar-placeholder.svg",
];

export default function MatchesCarousel({ matches, onSelectMatch, isLoading }: MatchesCarouselProps) {
  const t = useTranslations("messages");
  const avatars = matches.length > 0
    ? matches.slice(0, 4).map((m) => resolveStorageUrl(m.otherUser?.avatar_url ?? "", "avatars"))
    : PLACEHOLDER_AVATARS;

  const count = matches.length;

  return (
    <div className="mb-8 flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
      <div className="relative flex items-center shrink-0" style={{ width: `${28 + avatars.length * 26}px`, height: "56px" }}>
        {avatars.map((src, i) => (
          <div
            key={i}
            className="absolute w-14 h-14 rounded-full border-2 border-white overflow-hidden animate-float shadow-md"
            style={{
              left: `${i * 26}px`,
              zIndex: avatars.length - i,
              animationDelay: `${i * 0.25}s`,
            }}
          >
            <img src={src} alt={t("matchesAvatarAlt")} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-body-md font-bold text-gray-900">
          {count > 0 ? t("newMatches", { count }) : t("yourFutureMatches")}
        </p>
        <p className="text-body-xs text-gray-400 truncate">
          {count > 0 ? t("startChatting") : t("swipeToMatch")}
        </p>
      </div>

      {count > 0 && (
        <button
          type="button"
          onClick={() => {
            const thread = matchToConversationThread(matches[0]);
            if (thread) onSelectMatch(thread);
          }}
          className="shrink-0 px-4 py-2 rounded-full bg-black text-white text-body-xs font-bold hover:bg-gray-800 transition-colors"
        >
          {t("view")}
        </button>
      )}

      {count === 0 && !isLoading && (
        <div className="shrink-0 px-4 py-2 rounded-full border border-gray-200 text-body-xs font-semibold text-gray-400">
          {t("noMatch")}
        </div>
      )}
    </div>
  );
}
