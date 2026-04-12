"use client";

import { Link } from "@/i18n/routing";
import { ChevronRight } from "@/shared/ui/icons";
import type { ProfileMenuItem } from "../types/profile-menu-types";
import ProfileMenuDesktopGrid from "./ProfileMenuDesktopGrid";

export type { ProfileMenuItem } from "../types/profile-menu-types";

export default function ProfileMenuSection({
  title,
  items,
  variant,
}: {
  title?: string;
  items: ProfileMenuItem[];
  variant: "mobile-list" | "desktop-grid";
}) {
  if (variant === "desktop-grid") {
    return <ProfileMenuDesktopGrid items={items} />;
  }
  return (
    <div className="md:hidden bg-white max-w-2xl mx-auto rounded-3xl p-2 shadow-sm border border-gray-100 mb-6 last:mb-0">
      {title ? <p className="px-4 pt-3 text-body-sm font-semibold text-gray-500">{title}</p> : null}
      <div className="flex flex-col">
        {items.map((item, i) => {
          const Icon = item.icon;
          const sep = i < items.length - 1 ? "border-b border-gray-50" : "";
          const row = `w-full flex items-center justify-between p-4 bg-white active:bg-gray-50 transition-colors rounded-xl ${sep}`;
          if (item.isDestructive) {
            return (
              <button type="button" key={item.id} onClick={() => item.action?.()} className={row}>
                <div className="flex items-center gap-4">
                  <Icon className="w-6 h-6 text-red-500" />
                  <span className="text-body-lg font-semibold text-red-500">{item.label}</span>
                </div>
              </button>
            );
          }
          const core = (
            <>
              <div className="flex items-center gap-4">
                <Icon className="w-6 h-6 text-gray-700" />
                <span className="text-body-lg text-gray-900">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" strokeWidth={2} aria-hidden />
            </>
          );
          return item.href ? (
            <Link key={item.id} href={item.href} className={row}>
              {core}
            </Link>
          ) : (
            <button type="button" key={item.id} onClick={() => item.action?.()} className={row}>
              {core}
            </button>
          );
        })}
      </div>
    </div>
  );
}
