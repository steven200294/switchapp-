"use client";

import type { StepComponentProps, RatingConfig } from "../types";

const GRADE_COLORS: Record<string, string> = {
  A: "bg-green-500", B: "bg-lime-500", C: "bg-yellow-400",
  D: "bg-orange-400", E: "bg-orange-500", F: "bg-red-400", G: "bg-red-600",
};

function SingleRating({ config, value, onChange }: { config: RatingConfig; value: string | undefined; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-body-sm font-medium text-gray-600">{config.label}</p>
      <div className="flex gap-1.5">
        {config.grades.map((g) => {
          const active = value === g;
          const color = GRADE_COLORS[g] ?? "bg-gray-400";
          return (
            <button key={g} type="button" onClick={() => onChange(g)} className={`flex-1 py-2.5 rounded-xl text-body-md font-bold transition-all active:scale-90 ${active ? `${color} text-white shadow-md scale-105` : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
              {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function RatingStep({ step, value, onChange, onSubmit, labels }: StepComponentProps) {
  const ratings = step.ratings ?? [];
  const current = (value ?? {}) as Record<string, string>;

  return (
    <div>
      <div className="space-y-4">
        {ratings.map((r) => (
          <SingleRating key={r.id} config={r} value={current[r.id]} onChange={(v) => onChange({ ...current, [r.id]: v })} />
        ))}
      </div>
      <button type="button" onClick={onSubmit} className="mt-4 w-full py-3.5 rounded-2xl bg-brand-dark text-white font-bold text-body-md active:scale-[0.98] transition-transform">
        {labels.continue}
      </button>
    </div>
  );
}
