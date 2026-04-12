"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { StepComponentProps, StepperConfig } from "../types";

function SingleStepper({ config, value, onChange }: { config: StepperConfig; value: number; onChange: (v: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clamp = (v: number) => Math.min(config.max, Math.max(config.min, v));

  const startHold = (dir: 1 | -1) => {
    intervalRef.current = setInterval(() => onChange(clamp(value + config.step * dir)), 120);
  };
  const stopHold = () => { if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = null; };
  useEffect(() => () => stopHold(), []);

  const startEdit = () => {
    setDraft(String(value));
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const commitEdit = () => {
    const n = parseInt(draft, 10);
    if (!isNaN(n)) onChange(clamp(n));
    setEditing(false);
  };

  const btnClass = "w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-title font-bold text-gray-600 disabled:opacity-30 active:scale-90 transition-all select-none outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan";

  return (
    <div className="flex items-center justify-between bg-brand-chat-bg rounded-2xl px-4 py-3">
      <span className="text-body-md font-medium text-gray-600">{config.label}</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(clamp(value - config.step))} onPointerDown={() => startHold(-1)} onPointerUp={stopHold} onPointerLeave={stopHold} disabled={value <= config.min} className={btnClass}>−</button>
        {editing ? (
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); }}
            className="w-16 text-center text-title-md font-black tabular-nums text-gray-900 bg-white rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-cyan py-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            autoFocus
          />
        ) : (
          <button type="button" onClick={startEdit} className="w-16 text-center text-title-md font-black tabular-nums text-gray-900 cursor-text hover:bg-white/60 rounded-xl py-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan">
            {value}{config.suffix ?? ""}
          </button>
        )}
        <button type="button" onClick={() => onChange(clamp(value + config.step))} onPointerDown={() => startHold(1)} onPointerUp={stopHold} onPointerLeave={stopHold} disabled={value >= config.max} className={btnClass}>+</button>
      </div>
    </div>
  );
}

export default function StepperStep({ step, value, onChange, onSubmit, labels }: StepComponentProps) {
  const steppers = step.steppers ?? [];
  const current = (value ?? {}) as Record<string, number>;

  const initIfNeeded = useCallback(() => {
    if (Object.keys(current).length === 0) {
      const init: Record<string, number> = {};
      steppers.forEach((s) => { init[s.id] = s.defaultValue; });
      onChange(init);
    }
  }, []);
  useEffect(() => { initIfNeeded(); }, [initIfNeeded]);

  return (
    <div>
      <div className="space-y-3">
        {steppers.map((s) => (
          <SingleStepper key={s.id} config={s} value={current[s.id] ?? s.defaultValue} onChange={(v) => onChange({ ...current, [s.id]: v })} />
        ))}
      </div>
      <button type="button" onClick={onSubmit} className="mt-4 w-full py-3.5 rounded-2xl bg-brand-dark text-white font-bold text-body-md active:scale-[0.98] transition-transform outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan">
        {labels.continue}
      </button>
    </div>
  );
}
