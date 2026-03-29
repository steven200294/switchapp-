"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getAdminUsers, type AdminUser } from "@/shared/services/admin.service";
import UserAvatar from "@/shared/ui/UserAvatar";
import DataTable from "@/app/components/DataTable";

function displayName(u: AdminUser): string {
  if (u.full_name) return u.full_name;
  if (u.first_name || u.last_name) return [u.first_name, u.last_name].filter(Boolean).join(" ");
  return "—";
}

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_USERS, page],
    queryFn: () => getAdminUsers(page),
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Users <span className="text-gray-400 font-normal text-lg">({data?.total ?? 0})</span>
      </h2>
      <DataTable<AdminUser>
        columns={[
          {
            key: "user",
            header: "User",
            render: (u) => (
              <div className="flex items-center gap-3">
                <UserAvatar avatarUrl={u.avatar_url} name={u.full_name || u.first_name || u.email} size="md" />
                <div>
                  <p className="font-medium text-gray-900">{displayName(u)}</p>
                  <p className="text-xs text-gray-400">{u.profession ?? ""}</p>
                </div>
              </div>
            ),
          },
          { key: "city", header: "City", render: (u) => <span className="text-gray-600">{u.city ?? "—"}</span> },
          { key: "email", header: "Email", render: (u) => <span className="text-gray-500">{u.email}</span> },
          {
            key: "login",
            header: "Last Login",
            render: (u) => (
              <span className="text-xs text-gray-400">
                {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("fr-FR") : "—"}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (u) => (
              <div className="flex gap-1 flex-wrap">
                {u.email_confirmed ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">email</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-500">no email</span>
                )}
                {u.avatar_url && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">photo</span>}
                {u.verified && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600">verified</span>}
              </div>
            ),
          },
        ]}
        data={data?.users ?? []}
        keyExtractor={(u) => u.user_id}
        onRowClick={(u) => router.push(`/users/${u.user_id}`)}
        isLoading={isLoading}
        emptyMessage="No users."
        total={data?.total}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}
