"use client";

import { useState } from "react";
import type { StepComponentProps } from "../types";

export default function TextareaStep({ step, value, onChange, onSubmit, labels }: StepComponentProps) {
  const text = (value as string) ?? "";
  const [focused, setFocused] = useState(false);
  const maxLen = step.maxLength ?? 500;

  return (
    <div className="space-y-3">
      <div className={`bg-brand-chat-bg rounded-2xl p-4 transition-all ${focused ? "ring-2 ring-brand-cyan" : ""}`}>
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={step.placeholder}
          maxLength={maxLen}
          rows={4}
          className="w-full bg-transparent resize-none outline-none text-body-md text-gray-800 placeholder:text-gray-400 leading-relaxed"
        />
        <p className="text-right text-caption text-gray-400 mt-1">{text.length}/{maxLen}</p>
      </div>
      <button
        type="button"
        onClick={onSubmit}
        className="w-full py-3.5 rounded-2xl bg-brand-dark text-white font-bold text-body-md active:scale-[0.97] transition-all outline-none"
      >
        {step.required === false && !text ? labels.continue : labels.continue}
      </button>
    </div>
  );
}
