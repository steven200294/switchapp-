"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  ExplorerIcon,
  FavorisIcon,
  MessagesIcon,
  ProfilIcon,
  SwipeIcon,
} from "./bottom-nav/NavIcons";

const tabKeys = ["explorer", "favorites", "switch", "messages", "profile"] as const;
const tabHrefs = ["/explorer", "/favoris", "/swipe", "/messages", "/profil"] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <>
      <svg width="1" height="1" className="absolute opacity-0 pointer-events-none -z-50" aria-hidden>
        <defs>
          <linearGradient id="nav-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brand-cyan)" />
            <stop offset="100%" stopColor="var(--brand-purple)" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex items-center justify-around pt-3 px-2 z-100 md:hidden overflow-visible will-change-transform"
        style={{
          paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        {tabKeys.map((key, i) => {
          const href = tabHrefs[i];
          const label = t(key);
          const isActive = pathname === href || pathname?.startsWith(`${href}/`);

          if (key === "switch") {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 min-w-16 relative"
              >
                <div className="w-[66px] h-[66px] rounded-full bg-linear-to-br from-brand-cyan to-brand-purple flex items-center justify-center shadow-[0_8px_16px_rgba(138,43,226,0.3)] absolute -top-[34px] left-1/2 -translate-x-1/2 z-100">
                  <SwipeIcon />
                </div>
                <div className="h-6 w-[66px]" />
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 min-w-16 transition-colors"
            >
              <div className={isActive ? "" : "text-gray-400"}>
                {key === "explorer" && <ExplorerIcon isActive={isActive} />}
                {key === "favorites" && <FavorisIcon isActive={isActive} />}
                {key === "messages" && <MessagesIcon isActive={isActive} />}
                {key === "profile" && <ProfilIcon isActive={isActive} />}
              </div>
              <span
                className={`text-body-xs font-medium tracking-wide ${
                  isActive
                    ? "text-gray-900 font-bold"
                    : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
