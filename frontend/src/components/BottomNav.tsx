"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExplorerIcon,
  FavorisIcon,
  MessagesIcon,
  ProfilIcon,
  SwipeIcon,
} from "./bottom-nav/NavIcons";

const tabs = [
  { href: "/explorer", label: "Explorer" as const },
  { href: "/favoris", label: "Favoris" as const },
  { href: "/swipe", label: "Switch" as const },
  { href: "/messages", label: "Messages" as const },
  { href: "/profil", label: "Profil" as const },
];

export default function BottomNav() {
  const pathname = usePathname();

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
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);

          if (tab.label === "Switch") {
            return (
              <Link
                key={tab.href}
                href={tab.href}
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
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 min-w-16 transition-colors"
            >
              <div className={isActive ? "" : "text-[#7A8A9E]"}>
                {tab.label === "Explorer" && <ExplorerIcon isActive={isActive} />}
                {tab.label === "Favoris" && <FavorisIcon isActive={isActive} />}
                {tab.label === "Messages" && <MessagesIcon isActive={isActive} />}
                {tab.label === "Profil" && <ProfilIcon isActive={isActive} />}
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide ${
                  isActive
                    ? "text-gray-900 font-bold"
                    : "text-[#7A8A9E]"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
