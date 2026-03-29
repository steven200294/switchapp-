"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getAdminStats } from "@/app/admin/services/admin.service";
import StatCard from "@/app/admin/components/StatCard";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_STATS,
    queryFn: getAdminStats,
  });

  const stats = [
    { label: "Total users", value: data?.userCount ?? 0 },
    { label: "Email verified", value: data?.verifiedEmailCount ?? 0 },
    { label: "With avatar", value: data?.withAvatarCount ?? 0 },
    { label: "With property", value: data?.withPropertyCount ?? 0 },
    { label: "Properties", value: data?.propertyCount ?? 0 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading
          ? [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
            ))
          : stats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
      </div>
    </div>
  );
}
