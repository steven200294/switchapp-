'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { getAdminStats, getAdminUsers } from '@/modules/admin/services/admin.service';
import type { AuthUser } from '@/modules/auth/types/auth.types';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

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

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statsLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard label="Total Users" value={stats?.totalUsers ?? 0} />
            <StatCard label="Total Properties" value={stats?.totalProperties ?? 0} />
            <StatCard label="Recent Signups (7d)" value={stats?.recentSignups ?? 0} />
          </>
        )}
      </div>

      {/* Recent users table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
        </div>
        {usersLoading ? (
          <div className="p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded mb-2 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">City</th>
                  <th className="px-6 py-3">Verified</th>
                  <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(users ?? []).slice(0, 10).map((user: AuthUser) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.full_name ?? '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.city ?? '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.verified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
