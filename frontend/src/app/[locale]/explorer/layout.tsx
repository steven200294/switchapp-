import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "explorer" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchappart.com";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${baseUrl}/${locale}/explorer`,
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${baseUrl}/${locale}/explorer`,
      siteName: "SwitchAppart",
      locale,
      type: "website",
    },
  };
}

export default function ExplorerLayout({ children }: { children: ReactNode }) {
  return children;
}
