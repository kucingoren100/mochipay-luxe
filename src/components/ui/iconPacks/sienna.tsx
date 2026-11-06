import { BLUSH, COIN, STROKE, W, Star4, type PackShapes } from "./base";

const TOMATO = "#E4573D";
const MUSTARD = "#E9B44C";
const INK = "#221E26";
const CREAM = "#FFF6EC";

function TomatoBody({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={TOMATO} stroke={STROKE} strokeWidth={W} />
      <path d={`M${cx - r * 0.5} ${cy - r * 0.85} q${r * 0.5} ${-r * 0.55} ${r} 0 q${-r * 0.25} ${r * 0.4} ${-r * 0.5} ${r * 0.35} q${-r * 0.25} ${-0.05 * r} ${-r * 0.5} ${-0.35 * r} z`} fill="#5FA85F" stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
    </>
  );
}

export const SIENNA_SHAPES: Partial<PackShapes> = {
  "nav-rekor": (
    <>
      <rect x="4.5" y="4.5" width="23" height="23" rx="7.5" fill={TOMATO} stroke={STROKE} strokeWidth={W} />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="16" cy="11.6" rx="2.5" ry="3.4" fill="#7FB4E6" stroke={STROKE} strokeWidth={1.4} transform={`rotate(${deg} 16 16)`} />
      ))}
      <circle cx="16" cy="16" r="2.4" fill={CREAM} stroke={STROKE} strokeWidth={1.4} />
    </>
  ),
  "nav-stat": (
    <>
      <rect x="4.5" y="4.5" width="23" height="23" rx="7.5" fill={INK} stroke={STROKE} strokeWidth={W} />
      <Star4 x={11} y={12} s={1.05} fill={COIN} />
      <Star4 x={20.5} y={10.5} s={0.8} fill="#F49AC1" />
      <Star4 x={17} y={20} s={1.2} fill="#7FD8E8" />
      <circle cx="23" cy="21.5" r="0.9" fill={CREAM} stroke="none" />
    </>
  ),
  "nav-budget": (
    <>
      <circle cx="16" cy="16" r="10.5" fill={MUSTARD} stroke={STROKE} strokeWidth={W} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <path key={deg} d="M16 3.4 v2.4" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" transform={`rotate(${deg} 16 16)`} />
      ))}
      <ellipse cx="15" cy="18" rx="6" ry="4.6" fill="#FFFFFF" stroke={STROKE} strokeWidth={W} />
      <path d="M11.5 14.5 L10.4 10.6 L13.6 12.6 Z M17.5 14 L18.6 10.2 L15.6 12.2 Z" fill="#FFFFFF" stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M10.5 21.5 l-2 2.6 M14 22.4 l-1 2.6 M19 21.6 l1.6 2.4" stroke={STROKE} strokeWidth={1.8} strokeLinecap="round" />
      <rect x="14.5" y="16.5" width="5.4" height="4.4" rx="1.6" fill="#E8763B" stroke={STROKE} strokeWidth={1.6} />
      <path d="M14.5 18 L10.8 15.4" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" />
      <circle cx="13" cy="17.2" r="0.85" fill={STROKE} stroke="none" />
    </>
  ),
  "nav-akun": (
    <>
      <rect x="5.5" y="10" width="21" height="15" rx="3.4" fill="#8C5A33" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M11 10 V25 M21 10 V25" stroke={STROKE} strokeWidth={1.8} />
      <path d="M12.5 10 v-2 a3.5 3.5 0 0 1 7 0 v2" stroke={STROKE} strokeWidth={W} fill="none" strokeLinecap="round" />
      <rect x="13.6" y="15.4" width="4.8" height="3.4" rx="1.2" fill={MUSTARD} stroke={STROKE} strokeWidth={1.6} />
      <path d="M8.6 12.6 L9.2 14.2 L10.8 14.3 L9.6 15.3 L10 16.9 L8.6 16 L7.2 16.9 L7.6 15.3 L6.4 14.3 L8 14.2 Z" fill="#F49AC1" stroke={STROKE} strokeWidth={1.2} strokeLinejoin="round" />
    </>
  ),
  "nav-saya": (
    <>
      <rect x="4.5" y="4.5" width="23" height="23" rx="7.5" fill={MUSTARD} stroke={STROKE} strokeWidth={W} />
      <path d="M10.5 12 L9.6 8.2 L13 10.2 Z M21.5 12 L22.4 8.2 L19 10.2 Z" fill={INK} stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx="16" cy="16.5" r="7" fill={INK} stroke={STROKE} strokeWidth={W} />
      <path d="M11.5 15.5 h4 M16.5 15.5 h4" stroke={COIN} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M13.5 19.5 q2.5 1.8 5 0" stroke={CREAM} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <path d="M8.5 17.5 h2.6 M22.9 17.5 h2.6" stroke={STROKE} strokeWidth={1.4} strokeLinecap="round" />
    </>
  ),
  "fab-catat": (
    <>
      <rect x="4.5" y="4.5" width="23" height="23" rx="4" fill={CREAM} stroke={STROKE} strokeWidth={W} strokeDasharray="2.6 2.2" />
      <TomatoBody cx={16} cy={17} r={7.4} />
      <circle cx="13.6" cy="17.4" r="0.95" fill={STROKE} stroke="none" />
      <circle cx="18.4" cy="17.4" r="0.95" fill={STROKE} stroke="none" />
      <path d="M14.6 20 q1.4 1.2 2.8 0" stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" fill="none" />
      <path d="M8 8.6 h4 M8 11 h2.6" stroke={TOMATO} strokeWidth={1.6} strokeLinecap="round" />
    </>
  ),
  "pill-ledger": (
    <>
      <TomatoBody cx={16} cy={15.5} r={8} />
      <circle cx="13.2" cy="16" r="1" fill={STROKE} stroke="none" />
      <circle cx="18.8" cy="16" r="1" fill={STROKE} stroke="none" />
      <path d="M14.4 18.6 q1.6 1.4 3.2 0" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <path d="M12 23 l-1.6 3.4 M20 23 l1.6 3.4" stroke={STROKE} strokeWidth={2} strokeLinecap="round" />
      <ellipse cx="10.6" cy="18.6" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
      <ellipse cx="21.4" cy="18.6" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
    </>
  ),
  "pill-recurring": (
    <>
      <path d="M10.5 9.5 a3 3 0 0 1 4.4-2.4 M21.5 9.5 a3 3 0 0 0 -4.4-2.4" stroke={STROKE} strokeWidth={W} fill="none" strokeLinecap="round" />
      <circle cx="10.6" cy="8.4" r="1.8" fill={COIN} stroke={STROKE} strokeWidth={1.6} />
      <circle cx="21.4" cy="8.4" r="1.8" fill={COIN} stroke={STROKE} strokeWidth={1.6} />
      <circle cx="16" cy="17.5" r="8.4" fill="#6C63D2" stroke={STROKE} strokeWidth={W} />
      <circle cx="16" cy="17.5" r="5.6" fill={CREAM} stroke={STROKE} strokeWidth={1.6} />
      <path d="M16 14.4 v3.1 l2.4 1.6" stroke={STROKE} strokeWidth={1.8} strokeLinecap="round" fill="none" />
      <path d="M12.6 11.4 L11.8 9 M19.4 11.4 L20.2 9" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" />
      <ellipse cx="12.6" cy="19.6" rx="1.4" ry="0.95" fill={BLUSH} stroke="none" />
      <ellipse cx="19.4" cy="19.6" rx="1.4" ry="0.95" fill={BLUSH} stroke="none" />
    </>
  ),
  "pill-category": (
    <>
      <path d="M20 5.5 L12.5 12 M22.5 7.5 L15 14" stroke="#8C5A33" strokeWidth={1.8} strokeLinecap="round" />
      <path d="M6.5 14 h19 a9.5 9.5 0 0 1 -19 0 z" fill="#4E7FB4" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M6.5 14 h19" stroke={STROKE} strokeWidth={W} strokeLinecap="round" />
      <path d="M9.5 17.5 q6.5 2.6 13 0" stroke={CREAM} strokeWidth={1.8} strokeLinecap="round" fill="none" />
      <path d="M11 11.5 q1.5-2.5 0-4.5 M15.5 11.5 q1.5-2.5 0-4.5 M20 11.5 q1.5-2.5 0-4.5" stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" fill="none" />
      <path d="M12 25.5 h8" stroke={STROKE} strokeWidth={W} strokeLinecap="round" />
    </>
  ),
  "pill-reimburse": (
    <>
      <rect x="4.5" y="4.5" width="23" height="23" rx="7.5" fill={MUSTARD} stroke={STROKE} strokeWidth={W} />
      <path d="M22 12.5 q4 3.5 0 7 q-2.5-1.6-3.4-3.5 q0.9-1.9 3.4-3.5 z" fill="#E8763B" stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
      <ellipse cx="14.5" cy="16" rx="7" ry="5" fill="#E8763B" stroke={STROKE} strokeWidth={W} />
      <circle cx="10.5" cy="15" r="0.9" fill={STROKE} stroke="none" />
      <path d="M12 13.5 q2.5-1.6 5 0 M12 18.5 q2.5 1.6 5 0" stroke={CREAM} strokeWidth={1.4} strokeLinecap="round" fill="none" />
      <path d="M14 22.5 q1.5 2 3.5 1.6" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" fill="none" />
    </>
  ),
  "pill-bookmark": (
    <>
      <rect x="4.5" y="4.5" width="23" height="23" rx="7.5" fill="#F49AC1" stroke={STROKE} strokeWidth={W} />
      <Star4 x={12} y={13} s={1.15} fill="#5FA85F" />
      <Star4 x={20} y={19.5} s={0.85} fill="#7FD8E8" />
      <path d="M14.5 15.5 q3 2 4.5 3 M21.5 21.5 q1.6 1 2.6 1.2" stroke={CREAM} strokeWidth={1.6} strokeLinecap="round" fill="none" />
    </>
  ),
};
