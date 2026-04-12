"use client";

import { useCallback } from "react";
import type { StepComponentProps } from "../types";

export default function ChipStep({ step, value, onChange, onSubmit, labels }: StepComponentProps) {
  const chips = step.chips ?? [];
  const multi = step.multiSelect ?? false;

  const selected = multi
    ? (Array.isArray(value) ? value : []) as string[]
    : (value as string | undefined);

  const toggle = useCallback(
    (id: string) => {
      if (multi) {
        const arr = Array.isArray(value) ? (value as string[]) : [];
        const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
        onChange(next);
      } else {
        onChange(id);
        setTimeout(onSubmit, 200);
      }
    },
    [multi, value, onChange, onSubmit],
  );

  const isSelected = (id: string) =>
    multi ? (selected as string[]).includes(id) : selected === id;

  return (
    <div>
      {step.botSubMessage && (
        <p className="text-body-sm text-gray-400 mb-3">{step.botSubMessage}</p>
      )}
      <div className="flex flex-wrap gap-2.5">
        {chips.map((chip) => {
          const active = isSelected(chip.id);
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => toggle(chip.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-body-md font-semibold transition-all active:scale-95 ${
                active
                  ? "border-brand-dark bg-brand-dark text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {chip.icon && <span>{chip.icon}</span>}
              {chip.label}
            </button>
          );
        })}
      </div>
      {multi && (
        <button
          type="button"
          onClick={onSubmit}
          disabled={(selected as string[]).length === 0 && step.required !== false}
          className="mt-4 w-full py-3 rounded-2xl bg-brand-dark text-white font-bold text-body-md disabled:opacity-30 transition-opacity"
        >
          {labels.continue}
        </button>
      )}
    </div>
  );
}
