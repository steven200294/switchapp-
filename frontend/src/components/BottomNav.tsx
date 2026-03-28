"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ExplorerIcon = ({ isActive }: { isActive: boolean }) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke={isActive ? 'url(#nav-gradient)' : 'currentColor'} strokeWidth={isActive ? '3' : '2'} style={{ display: 'block', overflow: 'visible' }}>
    <g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path></g>
  </svg>
);

const SwipeIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <rect x="2" y="6" width="14" height="14" rx="2" ry="2" />
    <path d="M6 6V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2" />
  </svg>
);

const MessagesIcon = ({ isActive }: { isActive: boolean }) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" width="24" height="24" fill={isActive ? 'url(#nav-gradient)' : 'none'} stroke={isActive ? 'url(#nav-gradient)' : 'currentColor'} strokeWidth="2" style={{ display: 'block', overflow: 'visible' }}>
    <path d="M26 4H6C4.895 4 4 4.895 4 6v14c0 1.105.895 2 2 2h4v5l7-5h9c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2z"></path>
  </svg>
);

const ProfilIcon = ({ isActive }: { isActive: boolean }) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" width="24" height="24" fill={isActive ? 'url(#nav-gradient)' : 'none'} stroke={isActive ? 'url(#nav-gradient)' : 'currentColor'} strokeWidth="2" style={{ display: 'block', overflow: 'visible' }}>
    <path d="M16 17c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7zm0 2c5.523 0 10 4.477 10 10V31H6v-2c0-5.523 4.477-10 10-10z"></path>
  </svg>
);

const tabs = [
  { href: "/explorer", label: "Explorer" },
  { href: "/swipe", label: "Switch" },
  { href: "/messages", label: "Messages" },
  { href: "/profil", label: "Profil" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <svg width="1" height="1" className="absolute opacity-0 pointer-events-none -z-50" aria-hidden="true">
        <defs>
          <linearGradient id="nav-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00BFFF" />
            <stop offset="100%" stopColor="#8A2BE2" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex items-center justify-around pt-3 px-2 z-[100] md:hidden overflow-visible will-change-transform"
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
                className="flex flex-col items-center gap-[4px] min-w-[64px] relative"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center shadow-md absolute -top-8 left-1/2 -translate-x-1/2 z-[100]">
                  <SwipeIcon />
                </div>
                <div className="h-6 w-14" />
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-[4px] min-w-[64px] transition-colors"
            >
              <div className={isActive ? "" : "text-gray-500 hover:text-gray-900"}>
                {tab.label === "Explorer" && <ExplorerIcon isActive={isActive} />}
                {tab.label === "Messages" && <MessagesIcon isActive={isActive} />}
                {tab.label === "Profil" && <ProfilIcon isActive={isActive} />}
              </div>
              <span
                className={`text-[10px] font-medium tracking-wide ${
                  isActive
                    ? "bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] bg-clip-text text-transparent font-bold"
                    : "text-gray-500 hover:text-gray-900"
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
