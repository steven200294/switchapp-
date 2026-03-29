"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getAdminStats, getAdminUsers } from "@/app/admin/services/admin.service";
import StatCard from "@/app/admin/components/StatCard";
import RecentUsersTable from "@/app/admin/components/RecentUsersTable";
import type { AuthUser } from "@/shared/auth/types/auth.types";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_STATS,
    queryFn: getAdminStats,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_USERS,
    queryFn: getAdminUsers,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statsLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))
        ) : (
          <>
            <StatCard label="Total Users" value={stats?.totalUsers ?? 0} />
            <StatCard label="Total Properties" value={stats?.totalProperties ?? 0} />
            <StatCard label="Recent Signups (7d)" value={stats?.recentSignups ?? 0} />
          </>
        )}
      </div>

      <RecentUsersTable users={(users ?? []) as AuthUser[]} isLoading={usersLoading} />
    </div>
  );
}
