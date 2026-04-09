"use client";

import Link from "next/link";

type BannerVariant = "verify-profile" | "complete-listing" | "invite-friends" | "exchange-tips" | "platform-stats";

const BANNERS: Record<BannerVariant, {
  title: string;
  description: string;
  cta: string;
  href: string;
  gradient: string;
  icon: string;
  dark?: boolean;
}> = {
  "verify-profile": {
    title: "Vérifiez votre profil",
    description: "Les profils vérifiés ont 3x plus de chances de matcher.",
    cta: "Vérifier",
    href: "/profil",
    gradient: "from-brand-dark to-brand-dark-alt",
    icon: "🛡️",
    dark: true,
  },
  "complete-listing": {
    title: "Complétez votre annonce",
    description: "Ajoutez des photos et une description pour plus de visibilité.",
    cta: "Compléter",
    href: "/profil",
    gradient: "from-purple-50 to-pink-50",
    icon: "📸",
  },
  "invite-friends": {
    title: "Invitez vos amis",
    description: "Partagez SwitchAppart et gagnez des SwitchPass gratuits.",
    cta: "Inviter",
    href: "/profil",
    gradient: "from-amber-50 to-orange-50",
    icon: "🎁",
  },
  "exchange-tips": {
    title: "5 conseils pour réussir votre échange",
    description: "Découvrez comment maximiser vos chances de trouver le logement idéal.",
    cta: "Lire",
    href: "/explorer",
    gradient: "from-emerald-50 to-teal-50",
    icon: "💡",
  },
  "platform-stats": {
    title: "La communauté grandit",
    description: "Rejoignez des centaines d'utilisateurs qui échangent déjà leur logement.",
    cta: "Découvrir",
    href: "/explorer",
    gradient: "from-violet-50 to-indigo-50",
    icon: "📊",
  },
};

export default function PromoBanner({ variant }: { variant: BannerVariant }) {
  const b = BANNERS[variant];

  return (
    <div className={`mx-6 rounded-2xl bg-linear-to-r ${b.gradient} border ${b.dark ? "border-white/10 shadow-xl" : "border-gray-100"} p-7 md:p-10 relative overflow-hidden`}>
      <div className="flex items-start gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-[15px] ${b.dark ? "text-white" : "text-gray-900"}`}>{b.title}</h3>
          <p className={`text-[13px] mt-1 leading-relaxed ${b.dark ? "text-gray-400" : "text-gray-500"}`}>{b.description}</p>
        </div>
        <Link
          href={b.href}
          className={`shrink-0 self-center px-4 py-2 rounded-full text-[12px] font-bold transition-colors ${b.dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-900 text-white hover:bg-gray-800"}`}
        >
          {b.cta}
        </Link>
      </div>
      {b.dark && <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-brand-cyan/20 via-brand-purple/20 to-transparent rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none" />}
    </div>
  );
}
