import type { CompatibilityResult } from "@/app/explorer/types/compatibility.types";

function scoreTone(score: number): string {
  if (score >= 70) return "text-emerald-600";
  if (score >= 45) return "text-amber-600";
  return "text-red-500";
}

function barTone(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 45) return "bg-amber-500";
  return "bg-red-400";
}

export default function CompatibilityGauge({ result }: { result: CompatibilityResult }) {
  const pct = Math.min(100, Math.max(0, result.score));

  return (
    <div className="flex items-center gap-4">
      <div className={`text-display-md font-black tabular-nums ${scoreTone(result.score)}`}>{result.score}</div>
      <div className="flex-1 min-w-0">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${barTone(result.score)}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-caption font-bold text-gray-400 uppercase tracking-wide mt-1">Compatibilité</p>
      </div>
    </div>
  );
}
