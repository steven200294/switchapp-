type StatCardProps = {
  label: string;
  value: string | number;
  detail?: string;
  trend?: "up" | "down" | "neutral";
};

export default function StatCard({ label, value, detail, trend }: StatCardProps) {
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-400";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {detail && <p className={`text-xs mt-1 ${trendColor}`}>{detail}</p>}
    </div>
  );
}
