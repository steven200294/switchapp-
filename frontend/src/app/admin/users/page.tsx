"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getAdminUsers, type AdminUser } from "@/app/admin/services/admin.service";
import AdminUserTableRow from "@/app/admin/components/AdminUserTableRow";

export default function AdminUsersPage() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_USERS,
    queryFn: getAdminUsers,
  });

  const users: AdminUser[] = data?.users ?? [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Users <span className="text-gray-400 font-normal text-lg">({data?.total ?? 0})</span>
      </h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 5, 6, 7].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Last login</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <AdminUserTableRow
                    key={user.user_id}
                    user={user}
                    onNavigate={(userId) => router.push(`/admin/users/${userId}`)}
                  />
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-center text-gray-400 py-12">No users.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
