'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { getAdminUser } from '@/modules/admin/services/admin.service';

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_USER(id),
    queryFn: () => getAdminUser(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-64 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>
    );
  }

  const user = data?.user;
  const properties = data?.properties ?? [];

  return (
    <div>
      <button
        onClick={() => router.push('/admin/users')}
        className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-flex items-center gap-1"
      >
        ← Back to Users
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">User Detail</h2>

      {/* User profile card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center text-white text-xl font-bold">
              {user?.full_name?.charAt(0) ?? user?.email?.charAt(0) ?? '?'}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user?.full_name ?? 'No name'}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">City</span>
            <p className="font-medium text-gray-900">{user?.city ?? '-'}</p>
          </div>
          <div>
            <span className="text-gray-500">Verified</span>
            <p className="font-medium text-gray-900">{user?.verified ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <span className="text-gray-500">Role</span>
            <p className="font-medium text-gray-900">{user?.role ?? '-'}</p>
          </div>
          <div>
            <span className="text-gray-500">Joined</span>
            <p className="font-medium text-gray-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Properties */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties ({properties.length})</h3>
      {properties.length === 0 ? (
        <p className="text-gray-400 text-sm">No properties listed.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h4 className="font-semibold text-gray-900 mb-1">{prop.title}</h4>
              <p className="text-sm text-gray-500">{prop.city}</p>
              <p className="text-sm text-gray-500 mt-1">{prop.rent} EUR/month</p>
              <span className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                prop.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {prop.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
