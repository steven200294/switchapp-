"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

function SavedBadge({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-green-600 text-body-xs font-semibold animate-fade-in ml-1">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
      </svg>
    </span>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onSave: (v: string) => void;
  saving?: boolean;
  saved?: boolean;
  multiline?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function EditableTextField({ label, value, onSave, saving, saved, multiline, placeholder, maxLength }: TextFieldProps) {
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
      <span className="text-body text-gray-500 font-medium flex items-center">{label}<SavedBadge visible={!!saved} /></span>
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
  saved?: boolean;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function EditableNumberField({ label, value, onSave, saving, saved, suffix, min = 0, max = 99999, step = 1 }: NumberFieldProps) {
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
      <span className="text-body text-gray-500 font-medium flex items-center">{label}<SavedBadge visible={!!saved} /></span>
      <span className="text-body font-semibold text-gray-900 group-hover:text-brand-cyan transition-colors flex items-center gap-1.5">
        {display}
        <PencilIcon />
      </span>
    </button>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSave: (v: string) => void;
  saving?: boolean;
  saved?: boolean;
}

export function EditableSelectField({ label, value, options, onSave, saving, saved }: SelectFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const start = () => { setDraft(value); setEditing(true); };
  const cancel = () => setEditing(false);
  const save = () => { if (draft !== value) onSave(draft); setEditing(false); };

  const displayLabel = options.find((o) => o.value === value)?.label ?? value;

  if (editing) {
    return (
      <div className="py-2 space-y-2">
        <span className="text-body text-gray-500 font-medium">{label}</span>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setDraft(o.value)}
              disabled={saving}
              className={`px-4 py-2 rounded-xl text-body-sm font-semibold transition-colors outline-none ${
                draft === o.value
                  ? "bg-brand-cyan text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={cancel} className="px-4 py-2 rounded-xl text-body-sm font-semibold text-gray-500 hover:bg-gray-100 outline-none">
            ✕
          </button>
          <button type="button" onClick={save} disabled={saving} className="px-4 py-2 rounded-xl bg-brand-dark text-white text-body-sm font-semibold outline-none disabled:opacity-50">
            {saving ? "..." : "✓"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" onClick={start} className="w-full flex items-center justify-between py-3 border-b border-gray-50 last:border-0 text-left group">
      <span className="text-body text-gray-500 font-medium flex items-center">{label}<SavedBadge visible={!!saved} /></span>
      <span className="text-body font-semibold text-gray-900 group-hover:text-brand-cyan transition-colors flex items-center gap-1.5">
        {displayLabel}
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
