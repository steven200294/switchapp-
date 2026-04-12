"use client";

import type { ChatStep } from "./types";

interface Props {
  step: ChatStep;
  value: unknown;
  onEdit: () => void;
}

export default function CompletedCard({ step, value, onEdit }: Props) {
  const text = step.formatAnswer ? step.formatAnswer(value) : String(value ?? "");

  return (
    <div className="relative bg-brand-chat-bg rounded-2xl px-4 py-3 pr-10 animate-chat-slide-up">
      <p className="text-body-md font-medium text-gray-800">{text}</p>
      <button
        type="button"
        onClick={onEdit}
        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors active:scale-90"
        aria-label="Edit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <g transform="translate(4,4)">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </g>
        </svg>
      </button>
    </div>
  );
}
