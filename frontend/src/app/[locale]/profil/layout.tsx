"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import AuthGate from "@/shared/ui/AuthGate";
import ProfileCard from "@/app/[locale]/profil/components/ProfileCard";
import ProfileMenuSection, { type ProfileMenuItem } from "@/app/[locale]/profil/components/ProfileMenuSection";
import PremiumBanner from "@/app/[locale]/profil/components/PremiumBanner";
import PropertyStatusCard from "@/app/[locale]/profil/components/PropertyStatusCard";
import { useMyProperty } from "@/app/[locale]/profil/hooks/useMyProperty";
import { useAuthStore } from "@/shared/stores/auth.store";
import { FileText, HelpCircle, LogOut, Settings, Share2, Shield, UserCircle, UserRound } from "@/shared/ui/icons";
import EmailVerificationBadge from "@/components/EmailVerificationBadge";

export default function ProfilLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();
  const t = useTranslations("profile");
  const { data: myProperty, isLoading: propertyLoading } = useMyProperty();

  const menuGroup1: ProfileMenuItem[] = [
    { id: "settings", label: t("accountSettings"), description: t("accountSettingsDesc"), icon: Settings, href: "/profil/parametres" },
    { id: "profile", label: t("viewProfile"), description: t("viewProfileDesc"), icon: UserRound, href: "/profil/public" },
    { id: "privacy", label: t("privacy"), description: t("privacyDesc"), icon: Shield, href: "/profil/confidentialite" },
    { id: "help", label: t("getHelp"), description: t("getHelpDesc"), icon: HelpCircle, href: "/profil/aide" },
  ];

  const menuGroup2: ProfileMenuItem[] = [
    { id: "referral", label: t("referral"), description: t("referralDesc"), icon: Share2, href: "/profil/parrainage" },
    { id: "legal", label: t("legal"), description: t("legalDesc"), icon: FileText, href: "/profil/juridique" },
    { id: "logout", label: t("logout"), description: t("logoutDesc"), icon: LogOut, isDestructive: true, action: () => logout() },
  ];

  return (
    <AuthGate
      icon={<UserCircle className="w-10 h-10 text-white" />}
      title={t("authTitle")}
      description={t("authDescription")}
    >
      <div className="min-h-screen flex flex-col bg-gray-50 md:bg-white pb-24 md:pb-0">
        <div className="hidden md:block border-b border-gray-100">
          <Header />
        </div>
        <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-8 pb-12 md:pt-[200px]">
          <div className="flex items-center justify-between gap-4 mb-6 mt-2 md:mt-0 w-full max-w-2xl mx-auto md:max-w-none">
            <h1 className="text-display md:text-display-md font-bold text-gray-900 tracking-tight">{t("title")}</h1>
            <button type="button" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-800" aria-label={t("notifications")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6 w-full max-w-2xl mx-auto md:max-w-none">
            <ProfileCard user={user} />
            <PremiumBanner />
          </div>

          <EmailVerificationBadge />

          <div className="mb-6">
            <PropertyStatusCard property={myProperty} isLoading={propertyLoading} />
          </div>

          <button type="button" className="w-full max-w-2xl mx-auto md:max-w-none bg-white rounded-3xl p-5 shadow-sm border border-brand-purple/20 mb-8 flex items-center justify-between hover:border-brand-purple/40 hover:shadow-md transition-all group text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-brand-purple/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-purple/15 transition-colors">
                <img src="/emojis/thinking.png" alt={t("thinkingEmojiAlt")} className="w-8 h-8 drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-body-lg mb-0.5">{t("verifyIdentity")}</h3>
                <p className="text-body text-gray-500 font-medium leading-tight">{t("verifyDescription")}</p>
              </div>
            </div>
            <div className="hidden sm:flex w-8 h-8 rounded-full bg-gray-50 items-center justify-center text-gray-400 group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-colors" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>

          <ProfileMenuSection variant="mobile-list" items={menuGroup1} />
          <ProfileMenuSection variant="mobile-list" items={menuGroup2} />
          <div className="hidden md:block mt-12">
            <div className="w-full h-px bg-gray-200 mb-10" />
            <ProfileMenuSection variant="desktop-grid" items={[...menuGroup1, ...menuGroup2]} />
          </div>
        </main>
        <BottomNav />
        {children}
      </div>
    </AuthGate>
  );
}
