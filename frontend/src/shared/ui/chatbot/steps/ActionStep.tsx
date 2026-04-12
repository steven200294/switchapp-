"use client";

import type { ChatStep } from "../types";

interface Props {
  step: ChatStep;
  onAction?: (actionId: string) => void;
}

const variantStyles = {
  primary:
    "bg-linear-to-r from-brand-cyan to-brand-purple text-white font-bold shadow-[0_0_14px_rgba(0,191,255,0.35),0_0_14px_rgba(138,43,226,0.35)]",
  secondary: "bg-brand-dark text-white font-bold",
  ghost: "border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-400",
} as const;

export default function ActionStep({ step, onAction }: Props) {
  const actions = step.actions ?? [];

  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => onAction?.(action.id)}
          className={`w-full py-4 rounded-2xl text-body-md transition-all active:scale-[0.97] outline-none ${
            variantStyles[action.variant]
          }`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
