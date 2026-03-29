import UserAvatar from "@/shared/ui/UserAvatar";
import type { AdminUser } from "@/app/admin/services/admin.service";

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

export default function AdminUserProfileCard({ user }: { user: AdminUser }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <div className="flex items-start gap-4 mb-6">
        <UserAvatar avatarUrl={user.avatar_url} name={user.full_name || user.first_name || user.email} size="xl" className="rounded-2xl! w-20! h-20!" />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900">{displayName(user)}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {user.email_confirmed ? (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                ✓ email verified
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-500">
                ✗ email not verified
              </span>
            )}
            {user.verified && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                ✓ identity verified
              </span>
            )}
            {user.avatar_url && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">has photo</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Field label="First name" value={user.first_name} />
        <Field label="Last name" value={user.last_name} />
        <Field label="City" value={user.city} />
        <Field label="Phone" value={user.phone} />
        <Field label="Profession" value={user.profession} />
        <Field
          label="Last login"
          value={user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString("fr-FR") : null}
        />
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
  );
}
