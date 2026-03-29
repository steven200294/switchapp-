import type { IconProps } from "./types";

const ab = (p: IconProps, children: React.ReactNode) => {
  const { size = 24, className, ...r } = p;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: "block", overflow: "visible" }} {...r}>
      <g transform="translate(4,4)">{children}</g>
    </svg>
  );
};

export function Search(p: IconProps) {
  return ab(p, <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>);
}

export function Heart(p: IconProps) {
  return ab(p, <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />);
}

export function FavoriteHeart(p: IconProps) {
  const { size = 24, className, ...r } = p;
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" width={size} height={size} className={className} style={{ display: "block", overflow: "visible", ...r.style }} {...r}>
      <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 1.95L16 7.85l-2.05-1.9A6.98 6.98 0 0 0 9 4c-3.86 0-7 3.13-7 7 0 7 7 12.27 14 17z" />
    </svg>
  );
}

export function X(p: IconProps) {
  return ab(p, <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>);
}

export function Star(p: IconProps) {
  return ab(p, <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />);
}

export function Crown(p: IconProps) {
  return ab(p, <><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" /><path d="M5 16h14" /><path d="M5 20h14" /></>);
}

export function MessageCircle(p: IconProps) {
  return ab(p, <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />);
}

export function Share2(p: IconProps) {
  return ab(p, <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.83 3.98" /><path d="m15.41 6.51-6.82 3.98" /></>);
}

export function SlidersHorizontal(p: IconProps) {
  return ab(p, <><path d="M21 4h-7" /><path d="M10 4H3" /><path d="M21 12h-11" /><path d="M6 12H3" /><path d="M21 20h-3" /><path d="M14 20H3" /><path d="M14 2v4" /><path d="M6 10v4" /><path d="M18 18v4" /></>);
}

export function Undo2(p: IconProps) {
  return ab(p, <><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></>);
}

export function Loader2(p: IconProps) {
  return ab(p, <path d="M21 12a9 9 0 1 1-6.219-8.56" />);
}

export function Plus(p: IconProps) {
  return ab(p, <path d="M12 4v16m8-8H4" />);
}

export function Send(p: IconProps) {
  return ab(p, <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />);
}

export function MoreHorizontal(p: IconProps) {
  return ab(p, <><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>);
}

export function Bell(p: IconProps) {
  return ab(p, <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />);
}

export function Trash(p: IconProps) {
  return ab(p, <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />);
}

export function AlertTriangle(p: IconProps) {
  return ab(p, <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />);
}

export function Zap(p: IconProps) {
  return ab(p, <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />);
}

export function Check(p: IconProps) {
  return ab(p, <path d="M5 13l4 4L19 7" />);
}

export function Layers(p: IconProps) {
  return ab(p, <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />);
}

export function Lock(p: IconProps) {
  return ab(p, <><rect x="3" y="11" width="18" height="11" rx="3" /><path d="M7 11V7a5 5 0 0110 0v4" /></>);
}

export function Mail(p: IconProps) {
  return ab(p, <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 7l9 6 9-6" /></>);
}

export function Users2(p: IconProps) {
  return ab(p, <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>);
}

export function Smartphone(p: IconProps) {
  return ab(p, <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></>);
}

export function CreditCard(p: IconProps) {
  return ab(p, <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M8 14h2" /></>);
}

export function ChatBubbleDots(p: IconProps) {
  return ab(p, <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />);
}
