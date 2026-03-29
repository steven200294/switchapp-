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
}> = {
  "verify-profile": {
    title: "Vérifiez votre profil",
    description: "Les profils vérifiés ont 3x plus de chances de matcher.",
    cta: "Vérifier",
    href: "/profil",
    gradient: "from-blue-50 to-cyan-50",
    icon: "🛡️",
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
    <div className={`mx-6 rounded-2xl bg-linear-to-r ${b.gradient} border border-gray-100 p-5 md:p-6`}>
      <div className="flex items-start gap-4">
        <span className="text-2xl shrink-0 mt-0.5">{b.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-[15px]">{b.title}</h3>
          <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{b.description}</p>
        </div>
        <Link
          href={b.href}
          className="shrink-0 self-center px-4 py-2 rounded-full text-[12px] font-bold text-white bg-linear-to-r from-brand-cyan to-brand-purple hover:opacity-90 transition-opacity"
        >
          {b.cta}
        </Link>
      </div>
    </div>
  );
}
