import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

const TITLE_KEY_MAP: Record<string, string> = {
  favorites: "topPicks",
  newest: "newest",
  "budget-friendly": "budgetFriendly",
  furnished: "furnishedReady",
  "large-spaces": "largeSpaces",
  "pet-friendly": "petFriendly",
  "for-you": "forYou",
  "in-budget": "inBudget",
  "your-type": "yourType",
  "near-you": "nearYou",
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "explorer" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchappart.com";

  const titleKey = TITLE_KEY_MAP[slug] ?? "topPicks";
  const categoryName = t(titleKey);
  const title = `${categoryName} | SwitchAppart`;
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/${locale}/explorer/category/${slug}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/explorer/category/${slug}`,
      siteName: "SwitchAppart",
      locale,
      type: "website",
    },
  };
}

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return children;
}
