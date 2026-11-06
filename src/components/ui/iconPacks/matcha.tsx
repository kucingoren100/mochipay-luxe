import { BLUSH, COIN, HALO, P, S, STROKE, W, Star4, type PackShapes } from "./base";

const LEAF = "#4E8F5B";
const LEAF2 = "#7FBF8A";
const CREAM = "#F4FBF2";
const FROG = "#79C27E";

function Clover({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 90, 180, 270].map((deg) => (
        <circle key={deg} cx="0" cy="-1.7" r="1.5" fill={CREAM} stroke="none" transform={`rotate(${deg})`} />
      ))}
    </g>
  );
}

export const MATCHA_SHAPES: Partial<PackShapes> = {
  "nav-rekor": (
    <>
      <path d="M6.5 14 h19 a9.5 9.5 0 0 1 -19 0 z" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M6.5 14 h19" stroke={STROKE} strokeWidth={W} strokeLinecap="round" />
      <path d="M9.5 17.5 q6.5 2.6 13 0" stroke={HALO} strokeWidth={1.8} strokeLinecap="round" fill="none" />
      <path d="M12 25.5 h8" stroke={STROKE} strokeWidth={W} strokeLinecap="round" />
      <path d="M16 12 V5.5 M13.5 12 V7 M18.5 12 V7" stroke="#8C5A33" strokeWidth={1.8} strokeLinecap="round" />
      <path d="M14 5.5 h4" stroke="#8C5A33" strokeWidth={1.8} strokeLinecap="round" />
      <Clover x={16} y={15.6} s={0.9} />
    </>
  ),
  "nav-stat": (
    <>
      <path d="M10 20 h12 l-1.4 6.5 h-9.2 z" fill={S} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M16 20 V13" stroke={LEAF} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M16 15 C11 15 9.5 11 10 8.5 C14 8.5 16 11 16 15 Z" fill={LEAF2} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M16 13 C21 13 22.5 9 22 6.5 C18 6.5 16 9 16 13 Z" fill={LEAF} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M16 18.5 C13.5 18.5 12.5 16.5 12.8 15.2 C15 15.2 16 16.5 16 18.5 Z" fill={LEAF2} stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
      <Star4 x={24} y={16} s={0.7} fill={COIN} />
    </>
  ),
  "nav-budget": (
    <>
      <circle cx="16" cy="7.4" r="3" fill={COIN} stroke={STROKE} strokeWidth={W} />
      <path d="M16 6 v2.8 M14.6 7.4 h2.8" stroke={STROKE} strokeWidth={1.4} strokeLinecap="round" />
      <ellipse cx="16" cy="19" rx="9" ry="7.4" fill={FROG} stroke={STROKE} strokeWidth={W} />
      <circle cx="11.5" cy="12.5" r="2.8" fill={FROG} stroke={STROKE} strokeWidth={W} />
      <circle cx="20.5" cy="12.5" r="2.8" fill={FROG} stroke={STROKE} strokeWidth={W} />
      <circle cx="11.5" cy="12.2" r="1" fill={STROKE} stroke="none" />
      <circle cx="20.5" cy="12.2" r="1" fill={STROKE} stroke="none" />
      <path d="M13 14.5 h6" stroke={STROKE} strokeWidth={W} strokeLinecap="round" />
      <path d="M12.5 18.5 q1.2 1.2 2.4 0 M17.1 18.5 q1.2 1.2 2.4 0" stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" fill="none" />
      <ellipse cx="9.6" cy="19.5" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
      <ellipse cx="22.4" cy="19.5" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
      <path d="M10 25.5 l-1.6 1.8 M22 25.5 l1.6 1.8" stroke={STROKE} strokeWidth={2} strokeLinecap="round" />
    </>
  ),
  "nav-akun": (
    <>
      <path d="M8 13 q8-4.5 16 0 l1.6 9 a3 3 0 0 1 -3 3.4 h-13.2 a3 3 0 0 1 -3-3.4 z" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M9.5 17.5 q6.5 2.4 13 0" stroke={S} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M12 11.5 a4 4 0 0 1 8 0" stroke={STROKE} strokeWidth={W} fill="none" strokeLinecap="round" />
      <circle cx="13.4" cy="12.6" r="1.7" fill={COIN} stroke={STROKE} strokeWidth={1.6} />
      <circle cx="18.6" cy="12.6" r="1.7" fill={COIN} stroke={STROKE} strokeWidth={1.6} />
      <rect x="14.4" y="11.2" width="3.2" height="2.8" rx="1.2" fill={S} stroke={STROKE} strokeWidth={1.5} />
    </>
  ),
  "nav-saya": (
    <>
      <path d="M7.5 15 a8.5 8.5 0 0 1 17 0 v4 a8.5 8.5 0 0 1 -17 0 z" fill={FROG} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <circle cx="10.5" cy="9.5" r="2.4" fill={FROG} stroke={STROKE} strokeWidth={W} />
      <circle cx="21.5" cy="9.5" r="2.4" fill={FROG} stroke={STROKE} strokeWidth={W} />
      <circle cx="10.5" cy="9.2" r="0.9" fill={STROKE} stroke="none" />
      <circle cx="21.5" cy="9.2" r="0.9" fill={STROKE} stroke="none" />
      <circle cx="16" cy="17.5" r="6.4" fill={CREAM} stroke={STROKE} strokeWidth={W} />
      <path d="M11.8 14.6 L11 11.8 L13.6 13.2 Z M20.2 14.6 L21 11.8 L18.4 13.2 Z" fill={CREAM} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx="13.8" cy="17.6" r="0.95" fill={STROKE} stroke="none" />
      <circle cx="18.2" cy="17.6" r="0.95" fill={STROKE} stroke="none" />
      <path d="M14.8 20 q1.2 1 2.4 0" stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" fill="none" />
      <ellipse cx="11.6" cy="19.6" rx="1.4" ry="0.95" fill={BLUSH} stroke="none" />
      <ellipse cx="20.4" cy="19.6" rx="1.4" ry="0.95" fill={BLUSH} stroke="none" />
    </>
  ),
  "fab-catat": (
    <>
      <g transform="rotate(45 16 16)">
        <rect x="13.4" y="6.5" width="5.2" height="13.5" rx="1.4" fill={LEAF2} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M13.4 10 h5.2 M13.4 14 h5.2" stroke={HALO} strokeWidth={1.4} />
        <path d="M13.4 20 L16 26.2 L18.6 20 Z" fill={CREAM} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M15.1 24.1 L16 26.2 L16.9 24.1 Z" fill={STROKE} stroke="none" />
        <path d="M13.4 6.5 q2.6-3 5.2 0 q-2.6 1.6-5.2 0 z" fill={LEAF} stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
      </g>
      <Clover x={25.5} y={8} s={0.85} />
    </>
  ),
  "pill-ledger": (
    <>
      <rect x="8" y="7" width="16" height="18.5" rx="3" fill={LEAF2} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <rect x="8" y="11.5" width="16" height="3.4" fill={S} stroke={STROKE} strokeWidth={1.6} />
      <path d="M12 18.5 h8 M12 21.8 h5.5" stroke={CREAM} strokeWidth={W} strokeLinecap="round" />
      <Clover x={21} y={21.5} s={0.8} />
    </>
  ),
  "pill-recurring": (
    <>
      <path d="M8.5 13.3 A8 8 0 0 1 23.5 13.3" stroke={LEAF2} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <path d="M25.6 12.4 L23.2 12.4 L24.4 15.6 Z" fill={LEAF2} stroke="none" />
      <path d="M23.5 18.7 A8 8 0 0 1 8.5 18.7" stroke={LEAF} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <path d="M6.4 19.6 L8.8 19.6 L7.6 16.4 Z" fill={LEAF} stroke="none" />
      <path d="M16 19.5 V14" stroke={LEAF} strokeWidth={2} strokeLinecap="round" />
      <path d="M16 15.5 C12.5 15.5 11.5 12.5 11.9 10.8 C14.8 10.8 16 12.6 16 15.5 Z" fill={LEAF2} stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M16 14 C19.5 14 20.5 11 20.1 9.3 C17.2 9.3 16 11.1 16 14 Z" fill={LEAF} stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
    </>
  ),
  "pill-category": (
    <>
      <path d="M7.4 11 a3.5 3.5 0 0 1 7 0 v3.4 h-7 z" fill={LEAF2} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M10.9 7.5 v-2" stroke={LEAF} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx="21.1" cy="10.9" r="3.5" fill={P} stroke={STROKE} strokeWidth={1.8} />
      <path d="M19.4 10.9 q1.7-1.6 3.4 0" stroke={HALO} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <path d="M7.4 21.1 a3.5 3.5 0 0 0 7 0 z" fill={S} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
      <Clover x={21.1} y={21.1} s={1.05} />
      <circle cx="21.1" cy="21.1" r="1.1" fill={COIN} stroke={STROKE} strokeWidth={1.2} />
    </>
  ),
  "pill-reimburse": (
    <>
      <path d="M24.8 14.8 A9.4 9.4 0 0 0 15.2 6.4" stroke={LEAF} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <path d="M26.2 12.6 L23.6 12.6 L24.9 15.8 Z" fill={LEAF} stroke="none" />
      <circle cx="14.4" cy="18.4" r="7.2" fill={FROG} stroke={STROKE} strokeWidth={W} />
      <circle cx="11.6" cy="16.4" r="1" fill={STROKE} stroke="none" />
      <circle cx="17.2" cy="16.4" r="1" fill={STROKE} stroke="none" />
      <path d="M11.6 20 q2.8 2 5.6 0" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <ellipse cx="9.8" cy="19.4" rx="1.4" ry="0.95" fill={BLUSH} stroke="none" />
      <ellipse cx="19" cy="19.4" rx="1.4" ry="0.95" fill={BLUSH} stroke="none" />
    </>
  ),
  "pill-bookmark": (
    <>
      <path d="M10.6 6.6 h10.8 a3 3 0 0 1 3 3 v16.2 l-8.4-5.4 -8.4 5.4 V9.6 a3 3 0 0 1 3-3 z" fill={LEAF2} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M16 10.5 V19 M16 13.5 C13.5 13.5 12.6 11.4 12.9 10.2 C15 10.2 16 11.4 16 13.5 Z M16 16 C18.5 16 19.4 13.9 19.1 12.7 C17 12.7 16 13.9 16 16 Z" fill={CREAM} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
    </>
  ),
};
