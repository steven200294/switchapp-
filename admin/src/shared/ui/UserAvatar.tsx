"use client";

import { resolveStorageUrl } from "@/shared/constants/theme";

type UserAvatarProps = {
  avatarUrl: string | null | undefined;
  name: string | null | undefined;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const SIZE_MAP = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12", xl: "w-16 h-16" };
const TEXT_MAP = { sm: "text-xs", md: "text-sm", lg: "text-base", xl: "text-lg" };

export default function UserAvatar({ avatarUrl, name, size = "md", className = "" }: UserAvatarProps) {
  const initial = (name ?? "?")[0].toUpperCase();
  const sizeClass = SIZE_MAP[size];
  const textClass = TEXT_MAP[size];

  if (avatarUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${className}`}>
        <img src={resolveStorageUrl(avatarUrl, "avatars")} alt={name || ""} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${sizeClass} rounded-full bg-gray-200 flex items-center justify-center shrink-0 ${className}`}>
      <span className={`${textClass} font-bold text-gray-400`}>{initial}</span>
    </div>
  );
}
