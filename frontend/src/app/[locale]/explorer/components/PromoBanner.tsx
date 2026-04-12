"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

type BannerVariant = "verify-profile" | "complete-listing" | "invite-friends" | "exchange-tips" | "platform-stats";

const BANNER_CONFIG: Record<BannerVariant, {
  titleKey: string;
  descriptionKey: string;
  ctaKey: string;
  href: string;
  gradient: string;
  icon: string;
  dark?: boolean;
}> = {
  "verify-profile": {
    titleKey: "verifyProfile",
    descriptionKey: "verifyProfileDesc",
    ctaKey: "verifyProfileCta",
    href: "/profil",
    gradient: "from-brand-dark to-brand-dark-alt",
    icon: "🛡️",
    dark: true,
  },
  "complete-listing": {
    titleKey: "completeListing",
    descriptionKey: "completeListingDesc",
    ctaKey: "completeListingCta",
    href: "/profil",
    gradient: "from-purple-50 to-pink-50",
    icon: "📸",
  },
  "invite-friends": {
    titleKey: "inviteFriends",
    descriptionKey: "inviteFriendsDesc",
    ctaKey: "inviteFriendsCta",
    href: "/profil",
    gradient: "from-amber-50 to-orange-50",
    icon: "🎁",
  },
  "exchange-tips": {
    titleKey: "exchangeTips",
    descriptionKey: "exchangeTipsDesc",
    ctaKey: "exchangeTipsCta",
    href: "/explorer",
    gradient: "from-emerald-50 to-teal-50",
    icon: "💡",
  },
  "platform-stats": {
    titleKey: "platformStats",
    descriptionKey: "platformStatsDesc",
    ctaKey: "platformStatsCta",
    href: "/explorer",
    gradient: "from-violet-50 to-indigo-50",
    icon: "📊",
  },
};

export default function PromoBanner({ variant }: { variant: BannerVariant }) {
  const t = useTranslations("promo");
  const b = BANNER_CONFIG[variant];

  return (
    <div className={`mx-6 rounded-2xl bg-linear-to-r ${b.gradient} border ${b.dark ? "border-white/10 shadow-xl" : "border-gray-100"} p-7 md:p-10 relative overflow-hidden`}>
      <div className="flex items-start gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-body-md ${b.dark ? "text-white" : "text-gray-900"}`}>{t(b.titleKey)}</h3>
          <p className={`text-body-sm mt-1 leading-relaxed ${b.dark ? "text-gray-400" : "text-gray-500"}`}>{t(b.descriptionKey)}</p>
        </div>
        <Link
          href={b.href}
          className={`shrink-0 self-center px-4 py-2 rounded-full text-caption font-bold transition-colors ${b.dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-900 text-white hover:bg-gray-800"}`}
        >
          {t(b.ctaKey)}
        </Link>
      </div>
      {b.dark && <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-linear-to-br from-brand-cyan/20 via-brand-purple/20 to-transparent rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none" />}
    </div>
  );
}
