import type { ReactNode } from "react";
import { UserRound, Shield, Bell, CreditCard } from "@/shared/ui/icons";

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
    icon: <UserRound className="w-7 h-7" strokeWidth={1.2} />,
  },
  {
    id: "security",
    label: "Connexion et sécurité",
    href: "/profil/parametres/securite",
    icon: <Shield className="w-7 h-7" strokeWidth={1.2} />,
  },
  {
    id: "privacy",
    label: "Confidentialité",
    href: "/profil/confidentialite",
    icon: <Shield className="w-7 h-7" strokeWidth={1.2} />,
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/profil/parametres/notifications",
    icon: <Bell className="w-7 h-7" strokeWidth={1.2} />,
  },
  {
    id: "subscription",
    label: "Mon Abonnement",
    href: "/profil/parametres/abonnement",
    icon: <CreditCard className="w-7 h-7" strokeWidth={1.2} />,
  },
];
