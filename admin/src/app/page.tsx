"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getMetricsSummary } from "@/shared/services/admin.service";
import StatCard from "@/app/components/StatCard";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_METRICS_SUMMARY,
    queryFn: getMetricsSummary,
    refetchInterval: 30_000,
  });

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-16 mb-3" />
              <div className="h-7 bg-gray-200 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Users</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={data.users.total} />
            <StatCard label="Verified" value={data.users.verified} detail={`${Math.round(data.users.verified / Math.max(data.users.total, 1) * 100)}%`} />
            <StatCard label="With Avatar" value={data.users.withAvatar} />
            <StatCard label="With Property" value={data.users.withProperty} />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Properties</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard label="Total" value={data.properties.total} />
            <StatCard label="Published" value={data.properties.published} trend="up" />
            <StatCard label="Draft" value={data.properties.draft} />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Matches</h3>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Total" value={data.matches.total} />
              <StatCard label="Last 24h" value={data.matches.last24h} trend={data.matches.last24h > 0 ? "up" : "neutral"} />
              <StatCard label="Last 7d" value={data.matches.last7d} />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Swipes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total" value={data.swipes.total} />
              <StatCard label="Likes" value={data.swipes.likes} trend="up" />
              <StatCard label="Dislikes" value={data.swipes.dislikes} trend="down" />
              <StatCard label="Last 24h" value={data.swipes.last24h} />
            </div>
          </section>
        </div>

        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Messages</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Conversations" value={data.conversations.total} />
            <StatCard label="With Messages" value={data.conversations.withMessages} />
            <StatCard label="Total Messages" value={data.messages.total} />
            <StatCard label="Last 24h" value={data.messages.last24h} trend={data.messages.last24h > 0 ? "up" : "neutral"} />
          </div>
        </section>
      </div>
    </div>
  );
}
