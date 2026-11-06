import type { ReactNode } from "react";
import { BLUSH, COIN, Eyes, HEART, P, S, Star4, STROKE, T, W, type KawaiiIconName } from "./base";

const CREAM = "#FDFBF7";
const INK = "#5D4037";

function Paw({ x, y, s = 1, pad = P, toes = S }: { x: number; y: number; s?: number; pad?: string; toes?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2.2" rx="4.4" ry="3.5" fill={pad} stroke={STROKE} strokeWidth={1.8} />
      <ellipse cx="-4" cy="-2.4" rx="1.7" ry="2.2" fill={toes} stroke={STROKE} strokeWidth={1.6} />
      <ellipse cx="-1.3" cy="-4" rx="1.7" ry="2.2" fill={toes} stroke={STROKE} strokeWidth={1.6} />
      <ellipse cx="1.5" cy="-4" rx="1.7" ry="2.2" fill={toes} stroke={STROKE} strokeWidth={1.6} />
      <ellipse cx="4.2" cy="-2.4" rx="1.7" ry="2.2" fill={toes} stroke={STROKE} strokeWidth={1.6} />
    </g>
  );
}

export const TODO_SHAPES: Partial<Record<KawaiiIconName, ReactNode>> = {
  "pouch-cuan": (
    <>
      <circle cx="16" cy="8" r="3" fill={COIN} stroke={STROKE} strokeWidth={W} />
      <path d="M14.8 7.2 l1.2 1.2 1.4-1.6" stroke={STROKE} strokeWidth={1.3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 10.6 c-7 0 -10.2 4.2 -10.2 9.2 c0 4.2 3.6 6.6 10.2 6.6 c6.6 0 10.2 -2.4 10.2 -6.6 c0 -5 -3.2 -9.2 -10.2 -9.2 Z" fill={COIN} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M9.6 15.8 q6.4 3.2 12.8 0" stroke={STROKE} strokeWidth={1.7} fill="none" strokeLinecap="round" />
      <Star4 x={16} y={21.6} s={0.9} fill={T} />
      <Eyes x={16} y={19.4} gap={4.6} r={0.85} />
    </>
  ),
  "cat-paw-sparkle": (
    <>
      <Paw x={14.6} y={17.4} s={1.15} />
      <Star4 x={24.4} y={8.4} s={1.15} fill={COIN} />
      <Star4 x={7.6} y={7.6} s={0.75} fill={T} />
      <Star4 x={25.6} y={21.6} s={0.6} fill={BLUSH} />
    </>
  ),
  "paw-double": (
    <>
      <g transform="translate(11.4 19.6) rotate(-14) scale(1.05)">
        <ellipse cx="0" cy="2.2" rx="4.4" ry="3.5" fill={S} stroke={STROKE} strokeWidth={1.8} />
        <ellipse cx="-4" cy="-2.4" rx="1.7" ry="2.2" fill={T} stroke={STROKE} strokeWidth={1.5} />
        <ellipse cx="-1.3" cy="-4" rx="1.7" ry="2.2" fill={T} stroke={STROKE} strokeWidth={1.5} />
        <ellipse cx="1.5" cy="-4" rx="1.7" ry="2.2" fill={T} stroke={STROKE} strokeWidth={1.5} />
        <ellipse cx="4.2" cy="-2.4" rx="1.7" ry="2.2" fill={T} stroke={STROKE} strokeWidth={1.5} />
      </g>
      <g transform="translate(20.4 12.6) rotate(12) scale(0.92)">
        <ellipse cx="0" cy="2.2" rx="4.4" ry="3.5" fill={P} stroke={STROKE} strokeWidth={1.8} />
        <ellipse cx="-4" cy="-2.4" rx="1.7" ry="2.2" fill={T} stroke={STROKE} strokeWidth={1.5} />
        <ellipse cx="-1.3" cy="-4" rx="1.7" ry="2.2" fill={T} stroke={STROKE} strokeWidth={1.5} />
        <ellipse cx="1.5" cy="-4" rx="1.7" ry="2.2" fill={T} stroke={STROKE} strokeWidth={1.5} />
        <ellipse cx="4.2" cy="-2.4" rx="1.7" ry="2.2" fill={T} stroke={STROKE} strokeWidth={1.5} />
      </g>
    </>
  ),
  "bell-kawaii": (
    <>
      <circle cx="16" cy="6.6" r="1.7" fill={S} stroke={STROKE} strokeWidth={1.8} />
      <path d="M16 8.4 c-5.4 0 -8.2 4 -8.2 9.2 c0 2.8 -1 4.4 -2.2 5.6 h20.8 c-1.2 -1.2 -2.2 -2.8 -2.2 -5.6 c0 -5.2 -2.8 -9.2 -8.2 -9.2 Z" fill={COIN} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M23.6 12.8 q2.6 2.6 2.2 6.4 M25.6 10.4 q4 3.4 3.4 8.8" stroke={T} strokeWidth={1.7} fill="none" strokeLinecap="round" />
      <Eyes x={16} y={15.6} gap={5} r={1} />
      <path d={HEART} transform="translate(16 24.6) scale(0.6)" fill={BLUSH} stroke="none" />
    </>
  ),
  "phone-widget-kawaii": (
    <>
      <rect x="9" y="4.6" width="14" height="22.8" rx="3.4" fill={CREAM} stroke={STROKE} strokeWidth={W} />
      <rect x="11.2" y="8" width="9.6" height="15.2" rx="2" fill={P} stroke="none" />
      <rect x="21.4" y="15.8" width="6.4" height="6.4" rx="2.2" fill={T} stroke={STROKE} strokeWidth={1.8} />
      <Eyes x={16} y={13.6} gap={4.6} r={0.95} />
      <path d="M14.2 17.2 q1.8 1.8 3.6 0" stroke={STROKE} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <Star4 x={24.6} y={12.4} s={0.7} fill={COIN} />
    </>
  ),
  "sun-happy": (
    <>
      <g stroke={COIN} strokeWidth={2.3} strokeLinecap="round">
        <path d="M16 3.4 v3.2" />
        <path d="M16 25.4 v3.2" />
        <path d="M3.4 16 h3.2" />
        <path d="M25.4 16 h3.2" />
        <path d="M6.8 6.8 l2.3 2.3" />
        <path d="M22.9 22.9 l2.3 2.3" />
        <path d="M25.2 6.8 l-2.3 2.3" />
        <path d="M9.1 22.9 l-2.3 2.3" />
      </g>
      <circle cx="16" cy="16" r="7.4" fill={COIN} stroke={STROKE} strokeWidth={W} />
      <Eyes x={16} y={15} gap={5} r={1} />
      <path d="M14 18.6 q2 1.8 4 0" stroke={STROKE} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <circle cx="11.6" cy="17.6" r="1.3" fill={BLUSH} stroke="none" />
      <circle cx="20.4" cy="17.6" r="1.3" fill={BLUSH} stroke="none" />
    </>
  ),
  "cloud-sun-kawaii": (
    <>
      <circle cx="22" cy="10" r="4.6" fill={COIN} stroke={STROKE} strokeWidth={1.8} />
      <path d="M12.4 24.6 h10.2 a4.4 4.4 0 0 0 0.6 -8.6 a6 6 0 0 0 -11.4 -1.4 a4.8 4.8 0 0 0 0.6 10 Z" fill={CREAM} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <Eyes x={15.6} y={19.4} gap={5} r={1} />
      <circle cx="11.6" cy="21.4" r="1.2" fill={BLUSH} stroke="none" />
      <circle cx="19.6" cy="21.4" r="1.2" fill={BLUSH} stroke="none" />
    </>
  ),
  "calendar-kawaii": (
    <>
      <rect x="5" y="7" width="22" height="20" rx="3.2" fill={CREAM} stroke={STROKE} strokeWidth={W} />
      <path d="M5 10.2 a3.2 3.2 0 0 1 3.2 -3.2 h15.6 a3.2 3.2 0 0 1 3.2 3.2 v2.4 h-22 Z" fill={P} stroke={STROKE} strokeWidth={W} />
      <rect x="9.4" y="4.2" width="2.6" height="5" rx="1.3" fill={S} stroke={STROKE} strokeWidth={1.6} />
      <rect x="20" y="4.2" width="2.6" height="5" rx="1.3" fill={S} stroke={STROKE} strokeWidth={1.6} />
      <rect x="8.4" y="15.4" width="4" height="3.4" rx="1" fill={T} stroke="none" />
      <rect x="14" y="15.4" width="4" height="3.4" rx="1" fill={T} stroke="none" opacity={0.5} />
      <rect x="8.4" y="20.6" width="4" height="3.4" rx="1" fill={T} stroke="none" opacity={0.5} />
      <rect x="19.6" y="15.4" width="4" height="3.4" rx="1" fill={T} stroke="none" opacity={0.5} />
      <path d={HEART} transform="translate(21.6 22.6) scale(0.72)" fill="#D93829" stroke="none" />
    </>
  ),
  "laptop-cat": (
    <>
      <rect x="7" y="7" width="18" height="13" rx="2.4" fill={P} stroke={STROKE} strokeWidth={W} />
      <Paw x={16} y={13.6} s={0.62} pad={CREAM} toes={T} />
      <path d="M4.6 20 h22.8 l-1.6 3.4 a1.8 1.8 0 0 1 -1.7 1.1 h-16.2 a1.8 1.8 0 0 1 -1.7 -1.1 Z" fill={S} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <Star4 x={26.4} y={7.4} s={0.6} fill={COIN} />
    </>
  ),
  "books-kawaii": (
    <>
      <rect x="6" y="20" width="20" height="5.4" rx="1.6" fill={S} stroke={STROKE} strokeWidth={W} />
      <rect x="8" y="14.6" width="16" height="5.4" rx="1.6" fill={T} stroke={STROKE} strokeWidth={W} />
      <rect x="10" y="9.2" width="12" height="5.4" rx="1.6" fill={P} stroke={STROKE} strokeWidth={W} />
      <rect x="18.6" y="9.2" width="1.8" height="16.2" fill={BLUSH} stroke="none" opacity={0.9} />
      <circle cx="13.4" cy="6.4" r="2.4" fill="#D93829" stroke={STROKE} strokeWidth={1.6} />
      <path d="M13.4 4.2 q1.2 -1.6 2.6 -1.2" stroke="#416D4E" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </>
  ),
  "sakura-smile": (
    <>
      <g fill={P} stroke={STROKE} strokeWidth={1.7} strokeLinejoin="round">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="16" cy="9.2" rx="3.6" ry="5.2" transform={`rotate(${a} 16 16)`} />
        ))}
      </g>
      <circle cx="16" cy="16" r="4.4" fill={BLUSH} stroke={STROKE} strokeWidth={1.6} />
      <Eyes x={16} y={15.2} gap={3.4} r={0.8} />
      <path d="M14.6 17.6 q1.4 1.4 2.8 0" stroke={STROKE} strokeWidth={1.4} fill="none" strokeLinecap="round" />
    </>
  ),
  "boba-kawaii": (
    <>
      <path d="M18.6 4.6 l6 4.2" stroke={T} strokeWidth={3} strokeLinecap="round" />
      <path d="M9 12.4 h14 l-1.6 13 a2.6 2.6 0 0 1 -2.6 2.3 h-5.6 a2.6 2.6 0 0 1 -2.6 -2.3 Z" fill={CREAM} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M8.2 10.6 h15.6 a1.8 1.8 0 0 1 0 3.6 h-15.6 a1.8 1.8 0 0 1 0 -3.6 Z" fill={P} stroke={STROKE} strokeWidth={W} />
      <circle cx="12.8" cy="24" r="1.7" fill={INK} stroke="none" />
      <circle cx="16" cy="25" r="1.7" fill={INK} stroke="none" />
      <circle cx="19.2" cy="24" r="1.7" fill={INK} stroke="none" />
      <Eyes x={16} y={17.6} gap={4.6} r={0.9} />
      <path d="M14.4 20.2 q1.6 1.4 3.2 0" stroke={STROKE} strokeWidth={1.4} fill="none" strokeLinecap="round" />
    </>
  ),
  "flame-high": (
    <>
      <path d="M16 4 c2.6 3.8 7 6.4 7 12 a7 7 0 0 1 -14 0 c0 -3.6 2.4 -5.6 3.6 -8.4 c0.6 1.8 2 2.8 3.4 1.2 Z" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M16 14.6 c1.4 1.8 3 3 3 5 a3 3 0 0 1 -6 0 c0 -2 1.6 -3.2 3 -5 Z" fill={COIN} stroke="none" />
      <Eyes x={16} y={18.6} gap={3.8} r={0.85} />
    </>
  ),
  "dot-alert": (
    <>
      <circle cx="16" cy="16" r="8.6" fill={COIN} stroke={STROKE} strokeWidth={W} />
      <path d="M16 10.8 v6.4" stroke={STROKE} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx="16" cy="21" r="1.4" fill={STROKE} stroke="none" />
      <Star4 x={25.6} y={7.4} s={0.6} fill={T} />
    </>
  ),
  "leaf-calm": (
    <>
      <path d="M16 26.4 c-7 0 -11 -5 -11 -11 c0 -6 5.6 -9.8 11 -11.8 c5.4 2 11 5.8 11 11.8 c0 6 -4 11 -11 11 Z" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M16 24.4 v-13 M16 15.4 l-4 -3.4 M16 18.4 l4 -3.4" stroke={STROKE} strokeWidth={1.7} fill="none" strokeLinecap="round" />
      <circle cx="21.6" cy="21.6" r="1.6" fill={T} stroke={STROKE} strokeWidth={1.2} />
    </>
  ),
  "repeat-loop": (
    <>
      <path d="M8 13.4 a8.6 8.6 0 0 1 15.6 -3.6" fill="none" stroke={P} strokeWidth={3} strokeLinecap="round" />
      <path d="M24 18.6 a8.6 8.6 0 0 1 -15.6 3.6" fill="none" stroke={S} strokeWidth={3} strokeLinecap="round" />
      <path d="M24.8 5.6 l0.6 5.2 -5.2 -0.6 Z" fill={P} stroke={STROKE} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M7.2 26.4 l-0.6 -5.2 5.2 0.6 Z" fill={S} stroke={STROKE} strokeWidth={1.4} strokeLinejoin="round" />
      <path d={HEART} transform="translate(16 16.4) scale(0.5)" fill={BLUSH} stroke="none" />
    </>
  ),
  "checklist-kawaii": (
    <>
      <rect x="12.4" y="3.8" width="7.2" height="3.8" rx="1.6" fill={S} stroke={STROKE} strokeWidth={1.7} />
      <rect x="6" y="6" width="20" height="22" rx="3" fill={CREAM} stroke={STROKE} strokeWidth={W} />
      <rect x="9" y="11.4" width="3.6" height="3.6" rx="1.2" fill={T} stroke={STROKE} strokeWidth={1.4} />
      <path d="M9.8 13.2 l1 1 1.8 -2.2" stroke={STROKE} strokeWidth={1.3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 13.2 h7" stroke={STROKE} strokeWidth={1.7} strokeLinecap="round" />
      <rect x="9" y="18.6" width="3.6" height="3.6" rx="1.2" fill={T} stroke={STROKE} strokeWidth={1.4} />
      <path d="M15 20.4 h7" stroke={STROKE} strokeWidth={1.7} strokeLinecap="round" />
      <path d="M22.8 9.2 l0.8 1.9 1.9 0.8 -1.9 0.8 -0.8 1.9 -0.8 -1.9 -1.9 -0.8 1.9 -0.8 Z" fill={COIN} stroke="none" />
    </>
  ),
  "chart-bars-kawaii": (
    <>
      <rect x="6.4" y="17.6" width="4.6" height="8.4" rx="2.3" fill={T} stroke={STROKE} strokeWidth={1.9} />
      <rect x="13.7" y="12.6" width="4.6" height="13.4" rx="2.3" fill={P} stroke={STROKE} strokeWidth={1.9} />
      <rect x="21" y="8" width="4.6" height="18" rx="2.3" fill={S} stroke={STROKE} strokeWidth={1.9} />
      <Star4 x={26.6} y={5} s={0.8} fill={COIN} />
    </>
  ),
  "cat-alarm-kawaii": (
    <>
      <path d="M8.6 9.6 l-3.2 -4 a2.6 2.6 0 0 1 4.6 -0.4 Z" fill={P} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M23.4 9.6 l3.2 -4 a2.6 2.6 0 0 0 -4.6 -0.4 Z" fill={P} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx="7.6" cy="7.6" r="2.4" fill={COIN} stroke={STROKE} strokeWidth={1.6} />
      <circle cx="24.4" cy="7.6" r="2.4" fill={COIN} stroke={STROKE} strokeWidth={1.6} />
      <circle cx="16" cy="18" r="9" fill={CREAM} stroke={STROKE} strokeWidth={W} />
      <Eyes x={16} y={16.4} gap={5.4} r={1} />
      <path d="M14.6 19.8 q1.4 1.4 2.8 0" stroke={STROKE} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <path d="M10.2 24.6 l-1.8 2.4 M21.8 24.6 l1.8 2.4" stroke={STROKE} strokeWidth={1.9} strokeLinecap="round" />
    </>
  ),
};

export const TODO_ICON_PACK: Record<KawaiiIconName, ReactNode> = {
  ...({} as Record<KawaiiIconName, ReactNode>),
  ...TODO_SHAPES,
} as Record<KawaiiIconName, ReactNode>;

const EMOJI_TO_ICON: Record<string, KawaiiIconName> = {
  "🐾": "cat-paw-sparkle",
  "💰": "pouch-cuan",
  "💻": "laptop-cat",
  "🖥️": "laptop-cat",
  "⌨️": "laptop-cat",
  "📚": "books-kawaii",
  "📖": "books-kawaii",
  "📝": "books-kawaii",
  "🌸": "sakura-smile",
  "🌷": "sakura-smile",
  "🧋": "boba-kawaii",
  "🛍️": "boba-kawaii",
  "☕": "boba-kawaii",
  "✨": "cat-paw-sparkle",
  "⭐": "chart-bars-kawaii",
  "🗂️": "checklist-kawaii",
  "🔔": "bell-kawaii",
  "📲": "phone-widget-kawaii",
  "🗓️": "calendar-kawaii",
  "📅": "calendar-kawaii",
  "☀️": "sun-happy",
  "🌤️": "cloud-sun-kawaii",
  "⏰": "cat-alarm-kawaii",
  "📊": "chart-bars-kawaii",
  "✅": "checklist-kawaii",
};

export function emojiToKawaii(emoji: string): KawaiiIconName {
  return EMOJI_TO_ICON[emoji.trim()] ?? "cat-paw-sparkle";
}
