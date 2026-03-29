"use client";

import UserAvatar from "@/shared/ui/UserAvatar";

type ProfileCardUser = {
  avatar_url?: string;
  full_name?: string;
  email?: string;
  created_at?: string;
} | null;

function formatMemberSince(createdAt?: string): string {
  if (!createdAt) return "Membre SwitchAppart";
  try {
    const d = new Date(createdAt);
    return `Membre depuis ${d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`;
  } catch {
    return "Membre SwitchAppart";
  }
}

export default function ProfileCard({ user }: { user: ProfileCardUser }) {
  const displayName = user?.full_name || user?.email?.split("@")[0] || "Utilisateur";
  const subtitle = formatMemberSince(user?.created_at);

  return (
    <div className="flex-1 bg-white rounded-4xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-8 flex flex-col items-center justify-center md:h-[220px]">
      <div className="mb-3 md:mb-5">
        <UserAvatar avatarUrl={user?.avatar_url} name={displayName} size="xl" className="w-[88px]! h-[88px]! md:w-[104px]! md:h-[104px]! shadow-sm" />
      </div>
      <h2 className="text-title-lg md:text-display-sm font-bold text-gray-900 mb-0.5 tracking-tight">{displayName}</h2>
      <p className="text-body md:text-body-md font-bold text-brand-purple">{subtitle}</p>
    </div>
  );
}
