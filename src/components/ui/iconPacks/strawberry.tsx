import { BLUSH, COIN, HALO, P, S, STROKE, W, Heart, Star4, type PackShapes } from "./base";

const BERRY = "#E85D75";
const LEAF = "#5FA85F";
const CREAM = "#FFF3F6";

function Berry({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <path d={`M${cx} ${cy + r} C${cx - r * 1.15} ${cy + r * 0.35} ${cx - r * 0.95} ${cy - r * 0.75} ${cx} ${cy - r * 0.55} C${cx + r * 0.95} ${cy - r * 0.75} ${cx + r * 1.15} ${cy + r * 0.35} ${cx} ${cy + r} Z`} fill={BERRY} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d={`M${cx - r * 0.55} ${cy - r * 0.6} q${r * 0.55} ${-r * 0.5} ${r * 1.1} 0 q${-r * 0.3} ${r * 0.42} ${-r * 0.55} ${r * 0.36} q${-r * 0.25} ${-0.04 * r} ${-r * 0.55} ${-0.36 * r} z`} fill={LEAF} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx={cx - r * 0.35} cy={cy + r * 0.1} r={0.7} fill={CREAM} stroke="none" />
      <circle cx={cx + r * 0.3} cy={cy + r * 0.3} r={0.7} fill={CREAM} stroke="none" />
      <circle cx={cx} cy={cy - r * 0.05} r={0.7} fill={CREAM} stroke="none" />
    </>
  );
}

export const STRAWBERRY_SHAPES: Partial<PackShapes> = {
  "nav-rekor": (
    <>
      <Berry cx={16} cy={17} r={9.5} />
      <circle cx="13.4" cy="17.6" r="1" fill={STROKE} stroke="none" />
      <circle cx="18.6" cy="17.6" r="1" fill={STROKE} stroke="none" />
      <path d="M14.6 20.2 q1.4 1.2 2.8 0" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <ellipse cx="11.4" cy="19.6" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
      <ellipse cx="20.6" cy="19.6" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
    </>
  ),
  "nav-stat": (
    <>
      <path d="M8 24 L8 12 L24 12 Z" fill={CREAM} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M8 24 L8 18.5 L17.5 12 L24 12 Z" fill={P} stroke="none" />
      <path d="M8 15 h13 M8 21 l10-6.6" stroke={HALO} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M8 24 h16.5" stroke={STROKE} strokeWidth={W} strokeLinecap="round" />
      <circle cx="21.5" cy="9" r="2.4" fill={BERRY} stroke={STROKE} strokeWidth={1.6} />
      <path d="M21.5 6.6 q0.6-1.6 2-1.8" stroke={LEAF} strokeWidth={1.6} strokeLinecap="round" fill="none" />
    </>
  ),
  "nav-budget": (
    <>
      <path d="M10 10 h12 l1.6 14 a2.6 2.6 0 0 1 -2.6 2.8 h-10 a2.6 2.6 0 0 1 -2.6-2.8 z" fill={HALO} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <rect x="8.6" y="6.6" width="14.8" height="3.6" rx="1.8" fill={P} stroke={STROKE} strokeWidth={W} />
      <Star4 x={13} y={16} s={0.8} fill="#F49AC1" />
      <Star4 x={19} y={18.5} s={0.7} fill="#7FD8E8" />
      <circle cx="16" cy="21.5" r="1.7" fill={COIN} stroke={STROKE} strokeWidth={1.4} />
      <circle cx="12.6" cy="21" r="1.5" fill={COIN} stroke={STROKE} strokeWidth={1.4} />
      <path d="M10.4 12.6 h11.2" stroke={STROKE} strokeWidth={1.4} strokeLinecap="round" />
    </>
  ),
  "nav-akun": (
    <>
      <rect x="6" y="11" width="20" height="14" rx="4" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M6 15.5 l5 4.5 5-4.5 5 4.5 5-4.5 M6 20.5 l5 4.5 5-4.5 5 4.5 5-4.5" stroke={S} strokeWidth={1.4} fill="none" />
      <path d="M11 11 v-1.6 a5 5 0 0 1 10 0 V11" stroke={STROKE} strokeWidth={W} fill="none" strokeLinecap="round" />
      <path d="M13.4 8.6 L16 10.4 L13.8 12.2 Z M18.6 8.6 L16 10.4 L18.2 12.2 Z" fill={BERRY} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx="16" cy="10.6" r="1.5" fill={CREAM} stroke={STROKE} strokeWidth={1.5} />
    </>
  ),
  "nav-saya": (
    <>
      <path d="M10.5 12 L9.8 6.4 L13.6 9.6 Z M21.5 12 L22.2 6.4 L18.4 9.6 Z" fill="#FFD3DE" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <circle cx="16" cy="18" r="7.6" fill="#FFD3DE" stroke={STROKE} strokeWidth={W} />
      <circle cx="13.2" cy="18.4" r="1" fill={STROKE} stroke="none" />
      <circle cx="18.8" cy="18.4" r="1" fill={STROKE} stroke="none" />
      <path d="M14.6 21 q1.4 1.2 2.8 0" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <ellipse cx="10.6" cy="20.4" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
      <ellipse cx="21.4" cy="20.4" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
      <path d="M9.5 11.5 q6.5-4.6 13 0 q-1.5 2.4-6.5 2.4 t-6.5-2.4 z" fill={BERRY} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <circle cx="13" cy="10.6" r="0.7" fill={CREAM} stroke="none" />
      <circle cx="18.6" cy="10.4" r="0.7" fill={CREAM} stroke="none" />
      <path d="M16 7.6 q0.4-1.6 1.8-2" stroke={LEAF} strokeWidth={1.6} strokeLinecap="round" fill="none" />
    </>
  ),
  "fab-catat": (
    <>
      <g transform="rotate(45 16 16)">
        <rect x="13.2" y="7" width="5.6" height="13" rx="1.4" fill={BERRY} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <circle cx="15" cy="11" r="0.7" fill={CREAM} stroke="none" />
        <circle cx="17" cy="14.5" r="0.7" fill={CREAM} stroke="none" />
        <path d="M13.2 20 L16 26.4 L18.8 20 Z" fill={CREAM} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M15 24.2 L16 26.4 L17 24.2 Z" fill={STROKE} stroke="none" />
        <path d="M13.2 7 q2.8-3.4 5.6 0 q-2.8 1.8-5.6 0 z" fill={LEAF} stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
      </g>
      <Star4 x={25.5} y={7.5} s={0.8} fill={COIN} />
    </>
  ),
  "pill-ledger": (
    <>
      <rect x="7" y="6.5" width="18" height="19.5" rx="3.2" fill={CREAM} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M11.4 6.5 V26" stroke={BERRY} strokeWidth={W} strokeLinecap="round" />
      <path d="M15 12.5 h6.5 M15 16.5 h6.5" stroke={S} strokeWidth={W} strokeLinecap="round" />
      <Berry cx={18.5} cy={21.5} r={3.4} />
    </>
  ),
  "pill-recurring": (
    <>
      <path d="M8.5 13.3 A8 8 0 0 1 23.5 13.3" stroke={BERRY} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <path d="M25.6 12.4 L23.2 12.4 L24.4 15.6 Z" fill={BERRY} stroke="none" />
      <path d="M23.5 18.7 A8 8 0 0 1 8.5 18.7" stroke={LEAF} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <path d="M6.4 19.6 L8.8 19.6 L7.6 16.4 Z" fill={LEAF} stroke="none" />
      <Berry cx={16} cy={16} r={4.4} />
    </>
  ),
  "pill-category": (
    <>
      <Berry cx={10.9} cy={10.9} r={4.2} />
      <path d="M17.6 13.5 h7 v-2 a3.5 3.5 0 0 0 -7 0 z" fill={P} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M18.4 13.5 l0.8 3 h3.8 l0.8-3" stroke={STROKE} strokeWidth={1.8} fill={CREAM} strokeLinejoin="round" />
      <circle cx="10.9" cy="21.1" r="4.2" fill={COIN} stroke={STROKE} strokeWidth={1.8} />
      <circle cx="10.9" cy="21.1" r="1.6" fill={P} stroke={STROKE} strokeWidth={1.4} />
      <path d="M17.6 21.1 a3.5 3.5 0 0 1 7 0 z" fill="#F49AC1" stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M17.6 21.1 h7" stroke={STROKE} strokeWidth={1.8} strokeLinecap="round" />
    </>
  ),
  "pill-reimburse": (
    <>
      <path d="M24.8 14.8 A9.4 9.4 0 0 0 15.2 6.4" stroke={LEAF} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <path d="M26.2 12.6 L23.6 12.6 L24.9 15.8 Z" fill={LEAF} stroke="none" />
      <circle cx="14.4" cy="18.4" r="7.2" fill={COIN} stroke={STROKE} strokeWidth={W} />
      <Heart x={14.4} y={18.2} s={0.72} fill={BERRY} />
    </>
  ),
  "pill-bookmark": (
    <>
      <path d="M10.6 6.6 h10.8 a3 3 0 0 1 3 3 v16.2 l-8.4-5.4 -8.4 5.4 V9.6 a3 3 0 0 1 3-3 z" fill={BERRY} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <circle cx="13.6" cy="11" r="0.8" fill={CREAM} stroke="none" />
      <circle cx="18.4" cy="12.6" r="0.8" fill={CREAM} stroke="none" />
      <circle cx="15.6" cy="16" r="0.8" fill={CREAM} stroke="none" />
      <path d="M12.6 8.4 q3.4-2.2 6.8 0 q-1.6 1.6-3.4 1.6 t-3.4-1.6 z" fill={LEAF} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
    </>
  ),
};
