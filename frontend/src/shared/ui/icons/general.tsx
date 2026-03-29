import type { IconProps } from "./types";

const S = 2;
const base = (p: IconProps) => {
  const { size = 24, className, ...r } = p;
  return { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: S, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className, ...r };
};

export function Search(p: IconProps) {
  return <svg {...base(p)}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
}

export function Heart(p: IconProps) {
  return <svg {...base(p)}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>;
}

export function X(p: IconProps) {
  return <svg {...base(p)}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
}

export function Star(p: IconProps) {
  return <svg {...base(p)}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}

export function Crown(p: IconProps) {
  return <svg {...base(p)}><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" /><path d="M5 16h14" /><path d="M5 20h14" /></svg>;
}

export function MessageCircle(p: IconProps) {
  return <svg {...base(p)}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>;
}

export function Share2(p: IconProps) {
  return <svg {...base(p)}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.83 3.98" /><path d="m15.41 6.51-6.82 3.98" /></svg>;
}

export function SlidersHorizontal(p: IconProps) {
  return <svg {...base(p)}><path d="M21 4h-7" /><path d="M10 4H3" /><path d="M21 12h-11" /><path d="M6 12H3" /><path d="M21 20h-3" /><path d="M14 20H3" /><path d="M14 2v4" /><path d="M6 10v4" /><path d="M18 18v4" /></svg>;
}

export function Undo2(p: IconProps) {
  return <svg {...base(p)}><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>;
}

export function Loader2(p: IconProps) {
  return <svg {...base(p)}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>;
}
