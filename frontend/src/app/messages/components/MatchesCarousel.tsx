"use client";

import type { MockMatch, MockConversation } from "../types/messages.types";

interface MatchesCarouselProps {
  matches: MockMatch[];
  onSelectMatch: (conv: MockConversation) => void;
}

export default function MatchesCarousel({ matches, onSelectMatch }: MatchesCarouselProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-title-sm font-bold text-gray-900">Nouveaux matchs</h2>
        <img
          src="/emojis/grinning.png"
          alt=""
          width={28}
          height={28}
        />
        <span className="w-5 h-5 rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple flex items-center justify-center text-white text-body-xs font-black">
          {matches.length}
        </span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 md:-mx-8 md:px-8 scrollbar-hide">
        {matches.map((match) => (
          <button
            key={match.id}
            type="button"
            className="flex flex-col items-center gap-2 shrink-0 cursor-pointer hover:scale-105 transition-transform"
            onClick={() =>
              onSelectMatch({
                id: match.id,
                name: match.name,
                avatar: match.avatar,
                lastMessage: "Envoyez le premier message !",
                time: "À l'instant",
                unread: false,
                status: "",
              })
            }
          >
            <div className="w-20 h-20 rounded-full overflow-hidden p-[2.5px] bg-gradient-to-r from-brand-cyan to-brand-purple">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                <img src={match.avatar} alt={match.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-body-sm font-semibold text-gray-800">{match.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
