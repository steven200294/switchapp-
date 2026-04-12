import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchappart.com";

const staticPaths = [
  "/explorer",
  "/swipe",
  "/favoris",
  "/messages",
  "/profil",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [locale, `${baseUrl}/${locale}${path}`])
    ) as Record<string, string>;

    entries.push({
      url: `${baseUrl}/${routing.defaultLocale}${path}`,
      lastModified: new Date(),
      alternates: { languages },
    });
  }

  return entries;
}
