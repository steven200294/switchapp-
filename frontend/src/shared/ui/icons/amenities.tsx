import type { IconProps } from "./types";

const S = 2;
const base = (p: IconProps) => {
  const { size = 24, className, ...r } = p;
  return { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: S, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className, ...r };
};

export function Wifi(p: IconProps) {
  return <svg {...base(p)}><path d="M12 20h.01" /><path d="M2 8.82a15 15 0 0 1 20 0" /><path d="M5 12.859a10 10 0 0 1 14 0" /><path d="M8.5 16.429a5 5 0 0 1 7 0" /></svg>;
}

export function ParkingCircle(p: IconProps) {
  return <svg {...base(p)}><circle cx="12" cy="12" r="10" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" /></svg>;
}

export function Snowflake(p: IconProps) {
  return <svg {...base(p)}><line x1="2" x2="22" y1="12" y2="12" /><line x1="12" x2="12" y1="2" y2="22" /><path d="m20 16-4-4 4-4" /><path d="m4 8 4 4-4 4" /><path d="m16 4-4 4-4-4" /><path d="m8 20 4-4 4 4" /></svg>;
}

export function Tv(p: IconProps) {
  return <svg {...base(p)}><rect width="20" height="15" x="2" y="7" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" /></svg>;
}

export function WashingMachine(p: IconProps) {
  return <svg {...base(p)}><path d="M3 6h3" /><path d="M17 6h.01" /><rect width="18" height="20" x="3" y="2" rx="2" /><circle cx="12" cy="13" r="5" /><path d="M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5" /></svg>;
}

export function Refrigerator(p: IconProps) {
  return <svg {...base(p)}><path d="M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z" /><path d="M5 10h14" /><path d="M15 7v6" /></svg>;
}

export function Microwave(p: IconProps) {
  return <svg {...base(p)}><rect width="20" height="15" x="2" y="4" rx="2" /><rect width="8" height="7" x="6" y="8" rx="1" /><path d="M18 8v7" /><path d="M6 19v2" /><path d="M18 19v2" /></svg>;
}

export function Coffee(p: IconProps) {
  return <svg {...base(p)}><path d="M10 2v2" /><path d="M14 2v2" /><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" /><path d="M6 2v2" /></svg>;
}

export function Flame(p: IconProps) {
  return <svg {...base(p)}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>;
}
