"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getAdminMatches, type AdminMatch } from "@/shared/services/admin.service";
import DataTable from "@/app/components/DataTable";

export default function MatchesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_MATCHES, page],
    queryFn: () => getAdminMatches(page),
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Matches <span className="text-gray-400 font-normal text-lg">({data?.total ?? 0})</span>
      </h2>
      <DataTable<AdminMatch>
        columns={[
          {
            key: "users",
            header: "Users",
            render: (m) => (
              <div className="space-y-0.5">
                <p className="font-medium text-gray-900">{m.user_a_name ?? m.user_a.slice(0, 8)}</p>
                <p className="text-xs text-gray-400">↔ {m.user_b_name ?? m.user_b.slice(0, 8)}</p>
              </div>
            ),
          },
          {
            key: "properties",
            header: "Properties",
            render: (m) => (
              <div className="space-y-0.5">
                <p className="text-sm text-gray-700">{m.property_a_title ?? "—"}</p>
                <p className="text-xs text-gray-400">↔ {m.property_b_title ?? "—"}</p>
              </div>
            ),
          },
          {
            key: "date",
            header: "Date",
            render: (m) => (
              <span className="text-xs text-gray-400">
                {new Date(m.created_at).toLocaleDateString("fr-FR")}
              </span>
            ),
          },
        ]}
        data={data?.matches ?? []}
        keyExtractor={(m) => m.id}
        onRowClick={(m) => router.push(`/users/${m.user_a}`)}
        isLoading={isLoading}
        emptyMessage="No matches yet."
        total={data?.total}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}
