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

export const BRAND = {
  cyan: "var(--brand-cyan)",
  purple: "var(--brand-purple)",
  dark: "var(--brand-dark)",
  darkAlt: "var(--brand-dark-alt)",
} as const;

export const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fit=crop&w=800&q=80";
export const FALLBACK_COVER_HQ =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?fit=crop&w=800&q=100";

const SUPABASE_STORAGE_RE = /^https?:\/\/[^/]+\/storage\/v1\/object\/public\/[^/]+\//;
const SUPABASE_STORAGE_BASE =
  "https://aakdzvvwhvmbpjpmbpep.supabase.co/storage/v1/object/public/make-515d6ac6-property-photos";

/**
 * Resolve a storage path or URL to a public browser-accessible URL.
 * Handles: relative paths, full Supabase URLs, internal Docker URLs.
 */
export function resolveStorageUrl(path: string): string {
  if (!path) return FALLBACK_COVER_HQ;
  // Full Supabase URLs are already publicly accessible — return as-is
  if (SUPABASE_STORAGE_RE.test(path)) return path;
  // Any other full URL — return as-is
  if (path.startsWith("http")) return path;
  // Relative path — build Supabase URL
  return `${SUPABASE_STORAGE_BASE}/${path}`;
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
  return p.cover_image || p.cover_path || p.photo_paths?.[0] || p.photos?.[0] || "";
}

export const SWIPE_THRESHOLD = 120;
export const DECK_SIZE = 30;
export const STALE_TIME = 5 * 60 * 1000;
