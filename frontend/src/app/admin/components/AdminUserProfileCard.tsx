interface AdminUserProfileCardProps {
  user: {
    avatar_url?: string;
    full_name?: string;
    email?: string;
    city?: string;
    verified?: boolean;
    role?: string;
    created_at?: string;
  } | null;
}

export default function AdminUserProfileCard({ user }: AdminUserProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple flex items-center justify-center text-white text-xl font-bold">
            {user?.full_name?.charAt(0) ?? user?.email?.charAt(0) ?? "?"}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{user?.full_name ?? "No name"}</h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-gray-500">City</span>
          <p className="font-medium text-gray-900">{user?.city ?? "-"}</p>
        </div>
        <div>
          <span className="text-gray-500">Verified</span>
          <p className="font-medium text-gray-900">{user?.verified ? "Yes" : "No"}</p>
        </div>
        <div>
          <span className="text-gray-500">Role</span>
          <p className="font-medium text-gray-900">{user?.role ?? "-"}</p>
        </div>
        <div>
          <span className="text-gray-500">Joined</span>
          <p className="font-medium text-gray-900">
            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
