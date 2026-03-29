export const BRAND = {
  cyan: "var(--brand-cyan)",
  purple: "var(--brand-purple)",
  dark: "var(--brand-dark)",
  darkAlt: "var(--brand-dark-alt)",
} as const;

export const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fit=crop&w=800&q=80";

const SUPABASE_STORAGE_RE = /^https?:\/\/[^/]+\/storage\/v1\/object\/public\/[^/]+\//;

export function resolveStorageUrl(path: string, bucket = "properties"): string {
  if (!path) return FALLBACK_COVER;
  const base = process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://localhost:9000";
  if (path.startsWith("http")) {
    const stripped = path.replace(SUPABASE_STORAGE_RE, "");
    if (stripped !== path) return `${base}/${bucket}/${stripped.split("?")[0]}`;
    return path.replace(/^https?:\/\/[^/]+/, base);
  }
  return `${base}/${bucket}/${path}`;
}
