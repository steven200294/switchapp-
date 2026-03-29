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

export const SWIPE_THRESHOLD = 120;
export const DECK_SIZE = 30;
export const STALE_TIME = 5 * 60 * 1000;
