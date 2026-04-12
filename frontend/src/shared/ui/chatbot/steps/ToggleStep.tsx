"use client";

import type { StepComponentProps } from "../types";

export default function ToggleStep({ step, value, onChange, onSubmit, labels }: StepComponentProps) {
  const toggles = step.toggles ?? [];
  const selected = (value ?? []) as string[];

  function toggle(id: string) {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    onChange(next);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {toggles.map((t) => {
          const active = selected.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => toggle(t.id)}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border-2 text-body-sm font-medium transition-all active:scale-95 ${
                active
                  ? "border-brand-dark bg-brand-dark text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              {t.icon && <span>{t.icon}</span>}
              <span className="truncate">{t.label}</span>
              {active && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0">
                  <g transform="translate(4,4)"><path d="M5 13l4 4L19 7" /></g>
                </svg>
              )}
            </button>
          );
        })}
      </div>
      <button type="button" onClick={onSubmit} className="mt-4 w-full py-3.5 rounded-2xl bg-brand-dark text-white font-bold text-body-md active:scale-[0.98] transition-transform">
        {labels.continue}
      </button>
    </div>
  );
}
