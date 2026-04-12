"use client";

import { useLocale, useTranslations } from "next-intl";

type ProfileCardUser = {
  avatar_url?: string;
  full_name?: string;
  email?: string;
  created_at?: string;
} | null;

function formatMemberSince(
  createdAt: string | undefined,
  locale: string,
  t: (key: "memberLabel" | "memberSince", values?: { date: string }) => string,
): string {
  if (!createdAt) return t("memberLabel");
  try {
    const d = new Date(createdAt);
    const tag = locale.startsWith("fr") ? "fr-FR" : "en-US";
    return t("memberSince", { date: d.toLocaleDateString(tag, { month: "long", year: "numeric" }) });
  } catch {
    return t("memberLabel");
  }
}

export default function ProfileCard({ user }: { user: ProfileCardUser }) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const displayName = user?.full_name || user?.email?.split("@")[0] || t("userFallback");
  const initial = displayName.charAt(0).toUpperCase();
  const subtitle = formatMemberSince(user?.created_at, locale, t);

  return (
    <div className="flex-1 bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-8 flex flex-col items-center justify-center md:h-[220px]">
      {user?.avatar_url ? (
        <div className="w-[88px] h-[88px] md:w-[104px] md:h-[104px] rounded-full overflow-hidden mb-3 md:mb-5 shadow-sm">
          <img src={user.avatar_url} alt={displayName} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-[88px] h-[88px] md:w-[104px] md:h-[104px] bg-brand-dark-alt rounded-full flex items-center justify-center text-white text-display md:text-display-md font-semibold mb-3 md:mb-5 shadow-sm">
          {initial}
        </div>
      )}
      <h2 className="text-title-lg md:text-display-sm font-bold text-gray-900 mb-0.5 tracking-tight">{displayName}</h2>
      <p className="text-body md:text-body-md font-bold text-brand-purple">{subtitle}</p>
    </div>
  );
}
