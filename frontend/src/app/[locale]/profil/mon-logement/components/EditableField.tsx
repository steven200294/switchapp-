"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

interface TextFieldProps {
  label: string;
  value: string;
  onSave: (v: string) => void;
  saving?: boolean;
  multiline?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function EditableTextField({ label, value, onSave, saving, multiline, placeholder, maxLength }: TextFieldProps) {
  const tCommon = useTranslations("common");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  const start = () => { setDraft(value); setEditing(true); };
  const cancel = () => setEditing(false);
  const save = () => { if (draft !== value) onSave(draft); setEditing(false); };

  if (editing) {
    return (
      <div className="space-y-2">
        <label className="text-body-sm font-semibold text-gray-500">{label}</label>
        {multiline ? (
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={3}
            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-body text-gray-900 outline-none focus:ring-2 focus:ring-brand-cyan resize-none"
          />
        ) : (
          <input
            ref={ref as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={maxLength}
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-body text-gray-900 outline-none focus:ring-2 focus:ring-brand-cyan"
          />
        )}
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={cancel} className="px-4 py-2 rounded-xl text-body-sm font-semibold text-gray-500 hover:bg-gray-100 outline-none">
            {tCommon("cancel")}
          </button>
          <button type="button" onClick={save} disabled={saving} className="px-4 py-2 rounded-xl bg-brand-dark text-white text-body-sm font-semibold outline-none disabled:opacity-50">
            {saving ? "..." : tCommon("confirm")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" onClick={start} className="w-full flex items-start justify-between py-3 border-b border-gray-50 last:border-0 text-left group">
      <span className="text-body text-gray-500 font-medium">{label}</span>
      <span className="text-body font-semibold text-gray-900 text-right max-w-[60%] group-hover:text-brand-cyan transition-colors flex items-center gap-1.5">
        {value || <span className="text-gray-400 italic">–</span>}
        <PencilIcon />
      </span>
    </button>
  );
}

interface NumberFieldProps {
  label: string;
  value: number | null;
  onSave: (v: number) => void;
  saving?: boolean;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function EditableNumberField({ label, value, onSave, saving, suffix, min = 0, max = 99999, step = 1 }: NumberFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? 0));
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) ref.current?.select();
  }, [editing]);

  const start = () => { setDraft(String(value ?? 0)); setEditing(true); };
  const cancel = () => setEditing(false);
  const save = () => {
    const n = Number(draft);
    if (!isNaN(n) && n !== value) onSave(Math.max(min, Math.min(max, n)));
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 py-2">
        <span className="text-body text-gray-500 font-medium shrink-0">{label}</span>
        <input
          ref={ref}
          type="number"
          inputMode="numeric"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
          onBlur={save}
          min={min}
          max={max}
          step={step}
          className="w-24 ml-auto bg-gray-50 rounded-xl px-3 py-2 text-body text-gray-900 text-right outline-none focus:ring-2 focus:ring-brand-cyan [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          disabled={saving}
          autoFocus
        />
        {suffix && <span className="text-body text-gray-500">{suffix}</span>}
      </div>
    );
  }

  const display = value ? `${value}${suffix ?? ""}` : "–";

  return (
    <button type="button" onClick={start} className="w-full flex items-center justify-between py-3 border-b border-gray-50 last:border-0 text-left group">
      <span className="text-body text-gray-500 font-medium">{label}</span>
      <span className="text-body font-semibold text-gray-900 group-hover:text-brand-cyan transition-colors flex items-center gap-1.5">
        {display}
        <PencilIcon />
      </span>
    </button>
  );
}

function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-brand-cyan transition-colors">
      <g transform="translate(4,4)">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </g>
    </svg>
  );
}
