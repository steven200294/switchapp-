"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getAdminUser } from "@/app/admin/services/admin.service";
import AdminUserDetailSkeleton from "@/app/admin/components/AdminUserDetailSkeleton";
import AdminUserProfileCard from "@/app/admin/components/AdminUserProfileCard";
import AdminUserProperties from "@/app/admin/components/AdminUserProperties";

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_USER(id),
    queryFn: () => getAdminUser(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <AdminUserDetailSkeleton />;
  }

  const user = data?.user;
  const properties = data?.properties ?? [];

  if (!user) {
    return <p className="text-gray-400">User not found.</p>;
  }

  return (
    <div>
      <button
        onClick={() => router.push("/admin/users")}
        className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-flex items-center gap-1"
      >
        ← Back to Users
      </button>

      <AdminUserProfileCard user={user} />
      <AdminUserProperties properties={properties} />
    </div>
  );
}
