import { BLUSH, COIN, P, S, STROKE, T, W, Star4, Star5, type PackShapes } from "./base";

const SKY = "#8FC4F2";
const SKY2 = "#BFE0FA";
const CREAM = "#FFFFFF";

function Cloud({ cx, cy, s = 1, fill = CREAM }: { cx: number; cy: number; s?: number; fill?: string }) {
  return (
    <path
      d="M-7 3 a3.6 3.6 0 0 1 0.4-7 a4.6 4.6 0 0 1 8.8-1.2 a3.8 3.8 0 0 1 4.8 3.6 a2.9 2.9 0 0 1 -0.6 4.6 z"
      transform={`translate(${cx} ${cy}) scale(${s})`}
      fill={fill}
      stroke={STROKE}
      strokeWidth={W / s}
      strokeLinejoin="round"
    />
  );
}

export const SKY_SHAPES: Partial<PackShapes> = {
  "nav-rekor": (
    <>
      <Cloud cx={16} cy={16.5} s={1.35} />
      <circle cx="13" cy="16.5" r="1" fill={STROKE} stroke="none" />
      <circle cx="19" cy="16.5" r="1" fill={STROKE} stroke="none" />
      <path d="M14.4 19 q1.6 1.4 3.2 0" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <ellipse cx="10.4" cy="18.4" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
      <ellipse cx="21.6" cy="18.4" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
      <Star5 x={24} y={8.5} s={0.85} fill={COIN} outlined />
    </>
  ),
  "nav-stat": (
    <>
      <path d="M16 5 a8 8 0 0 1 8 8 h-16 a8 8 0 0 1 8-8 z" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M16 5 a8 8 0 0 0 -8 8 h4.5 a8 8 0 0 1 3.5-8 z" fill={S} stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M16 5 a8 8 0 0 1 3.5 8 H24 a8 8 0 0 0 -8-8 z" fill={T} stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M9.5 13 L13 22 h6 l3.5-9" stroke={STROKE} strokeWidth={1.6} fill="none" strokeLinejoin="round" />
      <rect x="12.5" y="21.5" width="7" height="5" rx="2" fill={COIN} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <Cloud cx={7} cy={22} s={0.62} />
      <Cloud cx={25.5} cy={19} s={0.55} />
    </>
  ),
  "nav-budget": (
    <>
      <path d="M20 6.5 a9.5 9.5 0 1 0 5.5 12.5 a8 8 0 0 1 -5.5-12.5 z" fill={COIN} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <circle cx="14.5" cy="15.5" r="1" fill={STROKE} stroke="none" />
      <path d="M12.5 18.5 q1.6 1.4 3.4 0.4" stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" fill="none" />
      <path d="M23 22 v3 M26 19.5 v3" stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" />
      <Star4 x={23} y={26.5} s={0.7} fill={P} />
      <Star4 x={26} y={24} s={0.55} fill={S} />
      <path d="M17 8.5 h4" stroke={STROKE} strokeWidth={W} strokeLinecap="round" />
    </>
  ),
  "nav-akun": (
    <>
      <Cloud cx={16} cy={18} s={1.4} />
      <path d="M9 15 L7 8.5 M23 15 L25 8.5" stroke={S} strokeWidth={2} strokeLinecap="round" />
      <Star5 x={16} y={7} s={0.8} fill={COIN} outlined />
      <path d="M12.5 18.5 h7" stroke={STROKE} strokeWidth={W} strokeLinecap="round" />
      <circle cx="19.5" cy="18.5" r="1.4" fill={S} stroke={STROKE} strokeWidth={1.4} />
    </>
  ),
  "nav-saya": (
    <>
      <path d="M11 12 C10 5.5 12 4 13 4.5 C14.4 5.2 14.6 9 14.4 12 Z M21 12 C22 5.5 20 4 19 4.5 C17.6 5.2 17.4 9 17.6 12 Z" fill={CREAM} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M11.6 10.5 C11.4 7.5 12.2 6 12.8 6.2 M20.4 10.5 C20.6 7.5 19.8 6 19.2 6.2" stroke={SKY2} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <circle cx="16" cy="18.5" r="7.8" fill={CREAM} stroke={STROKE} strokeWidth={W} />
      <circle cx="13.2" cy="18.6" r="1" fill={STROKE} stroke="none" />
      <circle cx="18.8" cy="18.6" r="1" fill={STROKE} stroke="none" />
      <path d="M14.6 21.2 q1.4 1.2 2.8 0" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <ellipse cx="10.6" cy="20.6" rx="1.7" ry="1.1" fill={SKY2} stroke="none" />
      <ellipse cx="21.4" cy="20.6" rx="1.7" ry="1.1" fill={SKY2} stroke="none" />
      <Star4 x={24.5} y={9} s={0.7} fill={COIN} />
    </>
  ),
  "fab-catat": (
    <>
      <g transform="rotate(45 16 16)">
        <rect x="13.4" y="6.5" width="5.2" height="13.5" rx="1.4" fill={SKY} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M13.4 10.5 q2.6 1.6 5.2 0 M13.4 14.5 q2.6 1.6 5.2 0" stroke={CREAM} strokeWidth={1.4} fill="none" />
        <path d="M13.4 20 L16 26.2 L18.6 20 Z" fill={CREAM} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M15.1 24.1 L16 26.2 L16.9 24.1 Z" fill={STROKE} stroke="none" />
        <Star5 x={16} y={5} s={0.75} fill={COIN} outlined />
      </g>
      <Cloud cx={25.5} cy={24} s={0.55} />
    </>
  ),
  "pill-ledger": (
    <>
      <rect x="7" y="6.5" width="18" height="19.5" rx="3.2" fill={SKY2} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M11.4 6.5 V26" stroke={SKY} strokeWidth={W} strokeLinecap="round" />
      <Cloud cx={18.5} cy={13} s={0.85} />
      <path d="M15 19 h7 M15 22 h4.5" stroke={S} strokeWidth={W} strokeLinecap="round" />
    </>
  ),
  "pill-recurring": (
    <>
      <path d="M8.5 13.3 A8 8 0 0 1 23.5 13.3" stroke={SKY} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <path d="M25.6 12.4 L23.2 12.4 L24.4 15.6 Z" fill={SKY} stroke="none" />
      <path d="M23.5 18.7 A8 8 0 0 1 8.5 18.7" stroke={S} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <path d="M6.4 19.6 L8.8 19.6 L7.6 16.4 Z" fill={S} stroke="none" />
      <Cloud cx={16} cy={16} s={0.72} />
    </>
  ),
  "pill-category": (
    <>
      <Cloud cx={10.9} cy={10.9} s={0.72} />
      <Star5 x={21.1} y={10.9} s={1} fill={COIN} outlined />
      <path d="M7.4 21.1 a3.5 3.5 0 0 1 7 0 z" fill={P} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M8.6 21.1 v2 M10.9 21.1 v2.6 M13.2 21.1 v2" stroke={S} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M24.6 21.1 a3.5 3.5 0 1 0 -3.5 3.5 a2.8 2.8 0 0 1 3.5-3.5 z" fill={COIN} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
    </>
  ),
  "pill-reimburse": (
    <>
      <path d="M24.8 14.8 A9.4 9.4 0 0 0 15.2 6.4" stroke={SKY} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <path d="M26.2 12.6 L23.6 12.6 L24.9 15.8 Z" fill={SKY} stroke="none" />
      <circle cx="14.4" cy="18.4" r="7.2" fill={COIN} stroke={STROKE} strokeWidth={W} />
      <Star4 x={14.4} y={18.4} s={0.85} fill={CREAM} />
    </>
  ),
  "pill-bookmark": (
    <>
      <path d="M10.6 6.6 h10.8 a3 3 0 0 1 3 3 v16.2 l-8.4-5.4 -8.4 5.4 V9.6 a3 3 0 0 1 3-3 z" fill={SKY} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <Star5 x={16} y={13.5} s={0.95} fill={COIN} outlined />
      <path d="M13 18.5 q3 1.8 6 0" stroke={CREAM} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </>
  ),
};
