import { BLUSH, COIN, HALO, S, STROKE, W, Star4, type PackShapes } from "./base";

const CREAM = "#FFF6EA";
const BROWN = "#8C5A33";
const BOBA = "#5B3A2E";

function Bear({ face = "#C89B72" }: { face?: string }) {
  return (
    <>
      <circle cx="10.5" cy="10" r="3" fill={face} stroke={STROKE} strokeWidth={W} />
      <circle cx="21.5" cy="10" r="3" fill={face} stroke={STROKE} strokeWidth={W} />
      <circle cx="10.5" cy="10" r="1.3" fill={CREAM} stroke="none" />
      <circle cx="21.5" cy="10" r="1.3" fill={CREAM} stroke="none" />
      <circle cx="16" cy="17.5" r="8" fill={face} stroke={STROKE} strokeWidth={W} />
      <ellipse cx="16" cy="20" rx="3.4" ry="2.6" fill={CREAM} stroke="none" />
      <circle cx="13.2" cy="16.4" r="1" fill={STROKE} stroke="none" />
      <circle cx="18.8" cy="16.4" r="1" fill={STROKE} stroke="none" />
      <path d="M15 19.2 q1 1 2 0" stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" fill="none" />
      <ellipse cx="10.6" cy="19" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
      <ellipse cx="21.4" cy="19" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
    </>
  );
}

export function cafeShapes(variant: "peachy" | "cocoa"): Partial<PackShapes> {
  const warm = variant === "peachy" ? "#F6A97E" : "#C89B72";
  const warm2 = variant === "peachy" ? "#FBD3B4" : "#E4C9A8";
  return {
    "nav-rekor":
      variant === "peachy" ? (
        <>
          <circle cx="16" cy="17.5" r="8.6" fill={warm} stroke={STROKE} strokeWidth={W} />
          <path d="M16 9 q-1.5-2.5 0.5-4" stroke={BROWN} strokeWidth={1.8} strokeLinecap="round" fill="none" />
          <path d="M16.5 7.5 C20 5.5 22.5 7 22.5 8.5 C20 10 17.5 9.5 16.5 7.5 Z" fill="#5FA85F" stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
          <path d="M12 13.5 q-2 3-1 6.5" stroke={HALO} strokeWidth={1.8} strokeLinecap="round" fill="none" />
          <circle cx="13.6" cy="18" r="1" fill={STROKE} stroke="none" />
          <circle cx="18.4" cy="18" r="1" fill={STROKE} stroke="none" />
          <path d="M14.6 20.6 q1.4 1.2 2.8 0" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" fill="none" />
          <ellipse cx="10.8" cy="20" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
          <ellipse cx="21.2" cy="20" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
        </>
      ) : (
        <>
          <path d="M7 17 C7 12 11 9 16 9 C21 9 25 12 25 17 C25 21 21 23.5 16 23.5 C11 23.5 7 21 7 17 Z" fill={warm2} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
          <path d="M11 10.5 C9.5 13 9.5 20 11 22.5 M16 9.5 C14.8 13 14.8 20 16 23 M21 10.5 C22.5 13 22.5 20 21 22.5" stroke={BROWN} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <path d="M7.5 15.5 q8.5-3 17 0" stroke={HALO} strokeWidth={1.6} fill="none" strokeLinecap="round" />
          <circle cx="12.5" cy="18.5" r="0.9" fill={STROKE} stroke="none" />
          <circle cx="19.5" cy="18.5" r="0.9" fill={STROKE} stroke="none" />
          <path d="M14.6 20.4 q1.4 1.2 2.8 0" stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </>
      ),
    "nav-stat": (
      <>
        <path d="M10 10.5 h12 l-1.6 14 a2.6 2.6 0 0 1 -2.6 2.3 h-3.6 a2.6 2.6 0 0 1 -2.6-2.3 z" fill={HALO} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M10.6 15.5 h10.8 l-0.5 4.5 h-9.8 z" fill={warm2} stroke="none" />
        <circle cx="13.5" cy="22.5" r="1.3" fill={BOBA} stroke="none" />
        <circle cx="16.5" cy="24" r="1.3" fill={BOBA} stroke="none" />
        <circle cx="18.8" cy="22" r="1.3" fill={BOBA} stroke="none" />
        <path d="M9 10.5 h14" stroke={STROKE} strokeWidth={W} strokeLinecap="round" />
        <path d="M17.5 10.5 L20 4.5" stroke={S} strokeWidth={2.2} strokeLinecap="round" />
        <path d="M10.6 15.5 h10.8" stroke={STROKE} strokeWidth={1.4} strokeLinecap="round" />
      </>
    ),
    "nav-budget":
      variant === "peachy" ? (
        <>
          <path d="M11 10 h10 q3 3.5 3 8 a8 8 0 0 1 -16 0 q0-4.5 3-8 z" fill={COIN} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
          <rect x="10" y="7" width="12" height="3.4" rx="1.7" fill={BROWN} stroke={STROKE} strokeWidth={W} />
          <path d="M12 15 q4 2.5 8 0" stroke={HALO} strokeWidth={1.8} strokeLinecap="round" fill="none" />
          <circle cx="16" cy="6" r="2.2" fill={COIN} stroke={STROKE} strokeWidth={1.6} />
          <ellipse cx="12" cy="19" rx="1.4" ry="0.95" fill={BLUSH} stroke="none" />
          <ellipse cx="20" cy="19" rx="1.4" ry="0.95" fill={BLUSH} stroke="none" />
          <circle cx="14" cy="17.5" r="0.9" fill={STROKE} stroke="none" />
          <circle cx="18" cy="17.5" r="0.9" fill={STROKE} stroke="none" />
        </>
      ) : (
        <>
          <rect x="8.5" y="10" width="15" height="16" rx="4" fill={warm2} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
          <rect x="10.5" y="6.8" width="11" height="3.6" rx="1.8" fill={BROWN} stroke={STROKE} strokeWidth={W} />
          <circle cx="13" cy="16" r="2.2" fill={BROWN} stroke="none" />
          <circle cx="19" cy="18.5" r="2.2" fill={BROWN} stroke="none" />
          <circle cx="15.5" cy="22" r="2.2" fill={BROWN} stroke="none" />
          <circle cx="13" cy="16" r="0.8" fill={warm2} stroke="none" />
          <circle cx="19" cy="18.5" r="0.8" fill={warm2} stroke="none" />
          <circle cx="16" cy="5.6" r="2.2" fill={COIN} stroke={STROKE} strokeWidth={1.6} />
        </>
      ),
    "nav-akun":
      variant === "peachy" ? (
        <>
          <rect x="6" y="11" width="20" height="14" rx="4" fill={warm2} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
          <path d="M6 15 h20 M6 19 h20 M6 23 h20 M10 11 v14 M14 11 v14 M18 11 v14 M22 11 v14" stroke={BROWN} strokeWidth={1.2} />
          <path d="M12 11 v-1.5 a4 4 0 0 1 8 0 V11" stroke={STROKE} strokeWidth={W} fill="none" strokeLinecap="round" />
          <rect x="13.8" y="15.6" width="4.4" height="3.2" rx="1.4" fill={COIN} stroke={STROKE} strokeWidth={1.6} />
        </>
      ) : (
        <>
          <circle cx="9" cy="11" r="2.6" fill={warm} stroke={STROKE} strokeWidth={W} />
          <circle cx="23" cy="11" r="2.6" fill={warm} stroke={STROKE} strokeWidth={W} />
          <rect x="6" y="11" width="20" height="14" rx="5" fill={warm} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
          <ellipse cx="16" cy="20" rx="4.4" ry="3.2" fill={warm2} stroke="none" />
          <circle cx="12.6" cy="16.4" r="1" fill={STROKE} stroke="none" />
          <circle cx="19.4" cy="16.4" r="1" fill={STROKE} stroke="none" />
          <path d="M14.8 19.4 q1.2 1 2.4 0" stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </>
      ),
    "nav-saya": <Bear face={variant === "peachy" ? "#E8B48C" : "#C89B72"} />,
    "fab-catat": (
      <>
        <g transform="rotate(45 16 16)">
          <rect x="13.2" y="6.5" width="5.6" height="13.5" rx="1.4" fill={warm} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
          <path d="M13.2 10.5 h5.6 M13.2 14.5 h5.6" stroke={HALO} strokeWidth={1.4} />
          <path d="M13.2 20 L16 26.2 L18.8 20 Z" fill={CREAM} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
          <path d="M15 24.1 L16 26.2 L17 24.1 Z" fill={STROKE} stroke="none" />
          <path d="M13.2 6.5 q2.8-2.6 5.6 0 q-2.8 1.4-5.6 0 z" fill={COIN} stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
        </g>
        <Star4 x={25.5} y={7.5} s={0.75} fill={COIN} />
      </>
    ),
    "pill-ledger": (
      <>
        <rect x="7" y="6.5" width="18" height="19.5" rx="3.2" fill={warm2} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M11.4 6.5 V26" stroke={warm} strokeWidth={W} strokeLinecap="round" />
        <path d="M15 11.5 h6.5 M15 14.8 h6.5" stroke={BROWN} strokeWidth={W} strokeLinecap="round" />
        <path d="M15.5 18.5 h5.5 l-0.7 5 h-4.1 z" fill={HALO} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
        <path d="M17.5 18.5 L18.6 16" stroke={S} strokeWidth={1.5} strokeLinecap="round" />
      </>
    ),
    "pill-recurring": (
      <>
        <path d="M8.5 13.3 A8 8 0 0 1 23.5 13.3" stroke={warm} strokeWidth={2.6} strokeLinecap="round" fill="none" />
        <path d="M25.6 12.4 L23.2 12.4 L24.4 15.6 Z" fill={warm} stroke="none" />
        <path d="M23.5 18.7 A8 8 0 0 1 8.5 18.7" stroke={BROWN} strokeWidth={2.6} strokeLinecap="round" fill="none" />
        <path d="M6.4 19.6 L8.8 19.6 L7.6 16.4 Z" fill={BROWN} stroke="none" />
        <path d="M13.5 18.5 h5 l-0.6 4.5 h-3.8 z" fill={HALO} stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
        <path d="M14.5 16 q0.8-1.6 0-3 M17.5 16 q0.8-1.6 0-3" stroke={S} strokeWidth={1.5} strokeLinecap="round" fill="none" />
      </>
    ),
    "pill-category": (
      <>
        <path d="M7.4 10 h6.4 l-0.7 5 h-5 z" fill={HALO} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M13.8 11 h1.6 a1.8 1.8 0 0 1 0 3.6 h-2" stroke={STROKE} strokeWidth={1.6} fill="none" />
        <circle cx="21.1" cy="10.9" r="3.5" fill={warm2} stroke={STROKE} strokeWidth={1.8} />
        <circle cx="19.9" cy="10" r="0.7" fill={BROWN} stroke="none" />
        <circle cx="22.2" cy="11.6" r="0.7" fill={BROWN} stroke="none" />
        <path d="M7.4 21.5 h7 v-3 a3.5 3.5 0 0 0 -7 0 z" fill={COIN} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M8.6 18.5 q1.2-1.6 2.4 0 q1.2-1.6 2.2 0" stroke={BROWN} strokeWidth={1.4} fill="none" strokeLinecap="round" />
        <path d="M18 24.5 a3.4 3.4 0 0 1 6.4-1.6 a2.4 2.4 0 0 1 -0.6 4.6 h-4.4 a2.4 2.4 0 0 1 -1.4-3 z" fill={warm} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
      </>
    ),
    "pill-reimburse": (
      <>
        <path d="M24.8 14.8 A9.4 9.4 0 0 0 15.2 6.4" stroke={warm} strokeWidth={2.4} strokeLinecap="round" fill="none" />
        <path d="M26.2 12.6 L23.6 12.6 L24.9 15.8 Z" fill={warm} stroke="none" />
        <circle cx="14.4" cy="18.4" r="7.2" fill={COIN} stroke={STROKE} strokeWidth={W} />
        <path d="M11.4 17 h6 l-0.6 4.6 h-4.8 z" fill={CREAM} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
        <path d="M12.6 15.2 q0.8-1.4 0-2.6 M15.6 15.2 q0.8-1.4 0-2.6" stroke={S} strokeWidth={1.4} strokeLinecap="round" fill="none" />
      </>
    ),
    "pill-bookmark": (
      <>
        <path d="M10.6 6.6 h10.8 a3 3 0 0 1 3 3 v16.2 l-8.4-5.4 -8.4 5.4 V9.6 a3 3 0 0 1 3-3 z" fill={warm2} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M10.6 10.5 q5.4 2 13.8 0" stroke={warm} strokeWidth={2} fill="none" strokeLinecap="round" />
        <circle cx="13.5" cy="14.5" r="0.9" fill={BROWN} stroke="none" />
        <circle cx="18.5" cy="16" r="0.9" fill={BROWN} stroke="none" />
        <circle cx="15.5" cy="18.5" r="0.9" fill={BROWN} stroke="none" />
      </>
    ),
  };
}
