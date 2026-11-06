import type { ReactNode } from "react";

export const KAWAII_ICON_NAMES = [
  "nav-rekor",
  "nav-stat",
  "nav-budget",
  "nav-akun",
  "nav-saya",
  "fab-catat",
  "pill-ledger",
  "pill-recurring",
  "pill-category",
  "pill-reimburse",
  "pill-bookmark",
  "pouch-cuan",
  "cat-paw-sparkle",
  "paw-double",
  "bell-kawaii",
  "phone-widget-kawaii",
  "sun-happy",
  "cloud-sun-kawaii",
  "calendar-kawaii",
  "laptop-cat",
  "books-kawaii",
  "sakura-smile",
  "boba-kawaii",
  "flame-high",
  "dot-alert",
  "leaf-calm",
  "repeat-loop",
  "checklist-kawaii",
  "chart-bars-kawaii",
  "cat-alarm-kawaii",
] as const;

export type KawaiiIconName = (typeof KAWAII_ICON_NAMES)[number];

export type PackShapes = Record<KawaiiIconName, ReactNode>;

export const STROKE = "var(--icon-stroke)";
export const HALO = "var(--icon-sticker-halo)";
export const BLUSH = "#FF9EBB";
export const COIN = "#FFD54F";
export const P = "var(--icon-primary)";
export const S = "var(--icon-secondary)";
export const T = "var(--icon-tertiary)";
export const W = 2.2;

export const STAR4 = "M0 -4 L1.1 -1.1 L4 0 L1.1 1.1 L0 4 L-1.1 1.1 L-4 0 L-1.1 -1.1 Z";
export const STAR5 =
  "M0 -3.6 L0.88 -1.21 L3.42 -1.11 L1.43 0.46 L2.12 2.91 L0 1.5 L-2.12 2.91 L-1.43 0.46 L-3.42 -1.11 L-0.88 -1.21 Z";
export const HEART =
  "M0 3.6 C-2.8 1.6 -4.4 -0.2 -4.4 -1.9 C-4.4 -3.2 -3.4 -4.1 -2.2 -4.1 C-1.2 -4.1 -0.4 -3.5 0 -2.8 C0.4 -3.5 1.2 -4.1 2.2 -4.1 C3.4 -4.1 4.4 -3.2 4.4 -1.9 C4.4 -0.2 2.8 1.6 0 3.6 Z";

export function Star4({ x, y, s = 1, fill }: { x: number; y: number; s?: number; fill: string }) {
  return <path d={STAR4} transform={`translate(${x} ${y}) scale(${s})`} fill={fill} stroke="none" />;
}

export function Star5({ x, y, s = 1, fill, outlined = false }: { x: number; y: number; s?: number; fill: string; outlined?: boolean }) {
  return (
    <path
      d={STAR5}
      transform={`translate(${x} ${y}) scale(${s})`}
      fill={fill}
      stroke={outlined ? STROKE : "none"}
      strokeWidth={outlined ? 1.8 : 0}
      strokeLinejoin="round"
    />
  );
}

export function Heart({ x, y, s = 1, fill }: { x: number; y: number; s?: number; fill: string }) {
  return <path d={HEART} transform={`translate(${x} ${y}) scale(${s})`} fill={fill} stroke="none" />;
}

export function Blush({ x, y }: { x: number; y: number }) {
  return <ellipse cx={x} cy={y} rx={1.6} ry={1.05} fill={BLUSH} stroke="none" />;
}

export function Eyes({ x, y, gap = 6, r = 1 }: { x: number; y: number; gap?: number; r?: number }) {
  return (
    <>
      <circle cx={x - gap / 2} cy={y} r={r} fill={STROKE} stroke="none" />
      <circle cx={x + gap / 2} cy={y} r={r} fill={STROKE} stroke="none" />
    </>
  );
}

export function Smile({ x, y, w = 3.2 }: { x: number; y: number; w?: number }) {
  return (
    <path
      d={`M${x - w / 2} ${y} q${w / 4} ${w / 3} ${w / 2} 0`}
      stroke={STROKE}
      strokeWidth={1.6}
      strokeLinecap="round"
      fill="none"
    />
  );
}
