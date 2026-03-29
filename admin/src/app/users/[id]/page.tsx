"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getAdminUser, type AdminUser, type AdminProperty } from "@/shared/services/admin.service";
import UserAvatar from "@/shared/ui/UserAvatar";
import { resolveStorageUrl } from "@/shared/constants/theme";

function displayName(u: AdminUser): string {
  if (u.full_name) return u.full_name;
  if (u.first_name || u.last_name) return [u.first_name, u.last_name].filter(Boolean).join(" ");
  return u.email;
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || "—"}</p>
    </div>
  );
}

function PropertyCard({ prop }: { prop: AdminProperty }) {
  const raw = prop.cover_image || prop.cover_path || prop.photos?.[0] || null;
  const src = raw ? resolveStorageUrl(raw) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {src ? (
        <img src={src} alt="" className="w-full h-36 object-cover" />
      ) : (
        <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-300 text-3xl">🏠</div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-gray-900 text-sm">{prop.title}</h4>
          <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
            prop.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}>
            {prop.published ? "live" : "draft"}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{prop.city ?? "—"}</p>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>
            {[prop.rooms && `${prop.rooms}p`, prop.surface_area && `${prop.surface_area}m²`].filter(Boolean).join(" · ")}
          </span>
          {prop.monthly_rent ? <span className="font-semibold text-gray-700">{prop.monthly_rent} €/m</span> : null}
        </div>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
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
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-48" />
        </div>
      </div>
    );
  }

  const user = data?.user;
  const properties = data?.properties ?? [];
  if (!user) return <p className="text-gray-400">User not found.</p>;

  return (
    <div>
      <button
        onClick={() => router.push("/users")}
        className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-flex items-center gap-1"
      >
        ← Back to Users
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <UserAvatar avatarUrl={user.avatar_url} name={user.full_name || user.first_name || user.email} size="xl" />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900">{displayName(user)}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {user.email_confirmed ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">email verified</span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-500">email not verified</span>
              )}
              {user.verified && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600">identity verified</span>}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Field label="First name" value={user.first_name} />
          <Field label="Last name" value={user.last_name} />
          <Field label="City" value={user.city} />
          <Field label="Phone" value={user.phone} />
          <Field label="Profession" value={user.profession} />
          <Field label="Last login" value={user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString("fr-FR") : null} />
          <Field label="Registered" value={user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : null} />
          <Field label="User ID" value={user.user_id} />
        </div>
        {user.bio && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Bio</p>
            <p className="text-sm text-gray-700">{user.bio}</p>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Properties <span className="text-gray-400 font-normal">({properties.length})</span>
      </h3>
      {properties.length === 0 ? (
        <p className="text-gray-400 text-sm">No properties.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((prop) => <PropertyCard key={prop.id} prop={prop} />)}
        </div>
      )}
    </div>
  );
}
