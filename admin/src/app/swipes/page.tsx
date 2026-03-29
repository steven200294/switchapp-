"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getAdminSwipes, getAdminSwipeStats, type AdminSwipe } from "@/shared/services/admin.service";
import StatCard from "@/app/components/StatCard";
import DataTable from "@/app/components/DataTable";

const ACTION_STYLE: Record<string, string> = {
  like: "bg-green-100 text-green-700",
  dislike: "bg-red-50 text-red-500",
  super_like: "bg-yellow-100 text-yellow-700",
};

export default function SwipesPage() {
  const [page, setPage] = useState(1);

  const { data: stats } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_SWIPE_STATS,
    queryFn: getAdminSwipeStats,
  });

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_SWIPES, page],
    queryFn: () => getAdminSwipes(page),
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Swipes</h2>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total" value={stats.totalSwipes} />
          <StatCard label="Likes" value={stats.likes} trend="up" />
          <StatCard label="Dislikes" value={stats.dislikes} trend="down" />
          <StatCard label="Super Likes" value={stats.superLikes} trend="up" />
        </div>
      )}

      <DataTable<AdminSwipe>
        columns={[
          { key: "user", header: "User", render: (s) => <span className="font-medium text-gray-900">{s.user_name ?? s.user_id.slice(0, 8)}</span> },
          { key: "property", header: "Property", render: (s) => <span className="text-gray-700">{s.property_title ?? s.property_id.slice(0, 8)}</span> },
          {
            key: "action",
            header: "Action",
            render: (s) => (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_STYLE[s.action] ?? "bg-gray-100 text-gray-500"}`}>
                {s.action}
              </span>
            ),
          },
          {
            key: "date",
            header: "Date",
            render: (s) => <span className="text-xs text-gray-400">{new Date(s.created_at).toLocaleString("fr-FR")}</span>,
          },
        ]}
        data={data?.swipes ?? []}
        keyExtractor={(s) => s.id}
        isLoading={isLoading}
        emptyMessage="No swipes yet."
        total={data?.total}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}
