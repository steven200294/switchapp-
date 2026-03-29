import { Check } from "@/shared/ui/icons";
import CompatibilityGauge from "@/app/explorer/components/CompatibilityGauge";
import type { CompatibilityResult } from "@/app/explorer/types/compatibility.types";

interface PropertyCompatibilityCardProps {
  isLoading: boolean;
  error: Error | null;
  data: CompatibilityResult | undefined;
}

export default function PropertyCompatibilityCard({ isLoading, error, data }: PropertyCompatibilityCardProps) {
  if (isLoading) {
    return (
      <div className="mb-8 p-5 rounded-2xl bg-gray-50 border border-gray-100 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-20 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mb-8 p-5 rounded-2xl bg-gray-50 border border-gray-100">
        <p className="text-body text-gray-500">
          {error?.message?.includes("not configured")
            ? "Score de compatibilité indisponible (API IA non configurée)."
            : "Impossible de calculer le score pour le moment."}
        </p>
      </div>
    );
  }

  return (
    <section className="mb-8 p-5 rounded-2xl bg-linear-to-br from-brand-cyan/5 to-brand-purple/5 border border-brand-purple/15">
      <h3 className="text-title font-bold text-gray-900 mb-4">Votre compatibilité</h3>
      <CompatibilityGauge result={data} />
      {data.commonPoints.length > 0 && (
        <ul className="mt-5 space-y-2">
          {data.commonPoints.map((p, i) => (
            <li key={`c-${i}-${p.slice(0, 24)}`} className="flex gap-2 text-body text-gray-700">
              <Check className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
      {data.weakPoints.length > 0 && (
        <ul className="mt-4 space-y-2">
          {data.weakPoints.map((p, i) => (
            <li key={`w-${i}-${p.slice(0, 24)}`} className="flex gap-2 text-body text-gray-700">
              <span className="text-amber-600 font-bold shrink-0">!</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-5 text-body text-gray-600 leading-relaxed whitespace-pre-line">{data.recommendation}</p>
    </section>
  );
}
