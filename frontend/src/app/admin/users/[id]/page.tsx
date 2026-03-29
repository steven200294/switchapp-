"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getAdminUser } from "@/app/admin/services/admin.service";
import AdminUserProfileCard from "@/app/admin/components/AdminUserProfileCard";

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
      <button onClick={() => router.push("/admin/users")} className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-flex items-center gap-1">
        ← Back to Users
      </button>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">User Detail</h2>
      <AdminUserProfileCard user={user} />

      <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties ({properties.length})</h3>
      {properties.length === 0 ? (
        <p className="text-gray-400 text-sm">No properties listed.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((prop: { id: string; title: string; city: string; rent: number; status: string }) => (
            <div key={prop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h4 className="font-semibold text-gray-900 mb-1">{prop.title}</h4>
              <p className="text-sm text-gray-500">{prop.city}</p>
              <p className="text-sm text-gray-500 mt-1">{prop.rent} EUR/month</p>
              <span className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                prop.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
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
