/**
 * Design tokens — single source of truth.
 *
 * Colors & font-sizes are defined as CSS variables in globals.css (@theme).
 * Tailwind utilities are auto-generated:
 *   text-brand-cyan, bg-brand-purple, text-body-sm, text-title, etc.
 *
 * This file exports TS constants for values needed in JS logic
 * (e.g. framer-motion thresholds, fallback URLs).
 */

export const FALLBACK_COVER_HQ =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fit=crop&w=800&q=100";

const SUPABASE_STORAGE_RE = /^https?:\/\/[^/]+\/storage\/v1\/object\/public\/[^/]+\//;

/**
 * Resolve a storage path or URL to a public browser-accessible URL.
 * Handles: relative paths, full Supabase URLs, internal Docker URLs.
 */
export function resolveStorageUrl(path: string, bucket = "properties"): string {
  if (!path) return FALLBACK_COVER_HQ;
  const base = process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://localhost:9000";
  if (path.startsWith("http")) {
    const stripped = path.replace(SUPABASE_STORAGE_RE, "");
    if (stripped !== path) return `${base}/${bucket}/${stripped.split("?")[0]}`;
    const storageHost = new URL(base).host;
    try {
      const urlHost = new URL(path).host;
      if (urlHost === storageHost) return path.replace(/^https?:\/\/[^/]+/, base);
    } catch { /* invalid URL — return as-is */ }
    return path;
  }
  return `${base}/${bucket}/${path}`;
}

/**
 * Pick the best available cover source from a property record.
 * Prefers relative paths (cover_path / photo_paths) over full Supabase URLs.
 */
export function pickCover(p: {
  cover_path?: string | null;
  cover_image?: string | null;
  photo_paths?: string[];
  photos?: string[];
}): string {
  return p.cover_path || p.photo_paths?.[0] || p.cover_image || p.photos?.[0] || "";
}

export const SWIPE_THRESHOLD = 120;
export const DECK_SIZE = 30;
export const STALE_TIME = 5 * 60 * 1000;
