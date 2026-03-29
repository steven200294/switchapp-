"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth.store";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: DashboardIcon },
      { href: "/monitoring", label: "Monitoring", icon: MonitorIcon },
    ],
  },
  {
    title: "Management",
    items: [
      { href: "/users", label: "Users", icon: UsersIcon },
      { href: "/properties", label: "Properties", icon: PropertyIcon },
      { href: "/matches", label: "Matches", icon: MatchIcon },
      { href: "/swipes", label: "Swipes", icon: SwipeIcon },
      { href: "/messages", label: "Messages", icon: MessageIcon },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/logs", label: "Logs", icon: LogIcon },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shrink-0 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold bg-linear-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
          SwitchAdmin
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">CRM & Monitoring</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2 px-3">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(pathname, item.href)
                      ? "bg-linear-to-r from-blue-50 to-purple-50 text-gray-900"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <item.icon active={isActive(pathname, item.href)} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-1">
        <a
          href={process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3001"}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to site
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  const mobileItems = [
    { href: "/", label: "Dashboard", icon: DashboardIcon },
    { href: "/users", label: "Users", icon: UsersIcon },
    { href: "/properties", label: "Properties", icon: PropertyIcon },
    { href: "/matches", label: "Matches", icon: MatchIcon },
    { href: "/monitoring", label: "Monitoring", icon: MonitorIcon },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold bg-linear-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
          SwitchAdmin
        </h1>
      </div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex">
        {mobileItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center py-2.5 text-[10px] font-medium ${
              isActive(pathname, item.href) ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <item.icon active={isActive(pathname, item.href)} />
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}

function DashboardIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 ${active ? "text-brand-purple" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function UsersIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 ${active ? "text-brand-purple" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function PropertyIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 ${active ? "text-brand-purple" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function MatchIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 ${active ? "text-brand-purple" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function SwipeIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 ${active ? "text-brand-purple" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function MessageIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 ${active ? "text-brand-purple" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function MonitorIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 ${active ? "text-brand-purple" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function LogIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 ${active ? "text-brand-purple" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
