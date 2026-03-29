"use client";

import { resolveStorageUrl } from "@/shared/constants/theme";

interface UserAvatarProps {
  avatarUrl?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_MAP = {
  xs: "w-6 h-6",
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-12 h-12 md:w-14 md:h-14",
  xl: "w-16 h-16",
} as const;

const TEXT_MAP = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
} as const;

export default function UserAvatar({ avatarUrl, name, size = "md", className = "" }: UserAvatarProps) {
  const initial = (name || "?")[0].toUpperCase();
  const sizeClass = SIZE_MAP[size];
  const textClass = TEXT_MAP[size];

  if (avatarUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${className}`}>
        <img
          src={resolveStorageUrl(avatarUrl, "avatars")}
          alt={name || ""}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-gray-200 flex items-center justify-center shrink-0 ${className}`}>
      <span className={`${textClass} font-bold text-gray-400`}>{initial}</span>
    </div>
  );
}
