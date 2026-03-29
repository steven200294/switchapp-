import type { ReactNode } from "react";

export interface SettingsSection {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: "personal",
    label: "Informations personnelles",
    href: "/profil/parametres/informations",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    id: "security",
    label: "Connexion et sécurité",
    href: "/profil/parametres/securite",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20" />
      </svg>
    ),
  },
  {
    id: "privacy",
    label: "Confidentialité",
    href: "/profil/confidentialite",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.25 4.5v9M13.75 4v9M6.75 8v6c0 3.5 2.5 5.75 5.25 5.75s5.25-2.25 5.25-5.75v-4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.5V14c0 1.5-2 1.5-2 0" />
      </svg>
    ),
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/profil/parametres/notifications",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    id: "subscription",
    label: "Mon Abonnement",
    href: "/profil/parametres/abonnement",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-7 h-7">
        <rect x="3" y="6" width="18" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M8 14h2" />
      </svg>
    ),
  },
];
