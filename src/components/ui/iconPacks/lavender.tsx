import { BLUSH, COIN, HALO, HEART, P, S, STROKE, T, W, type PackShapes } from "./base";

export const LAVENDER_SHAPES: Partial<PackShapes> = {
  "nav-rekor": (
    <>
      <path d="M5.4 11.6 V9.8 a2.6 2.6 0 0 1 2.6-2.6 h4.2 l2.2 3.2 h9.4 a2.6 2.6 0 0 1 2.6 2.6 v1.6 Z" fill={S} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <rect x="5.4" y="11.6" width="21" height="13.2" rx="3" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M15.9 14.8 L16.78 17.19 L19.32 17.29 L17.33 18.86 L18.02 21.31 L15.9 19.9 L13.78 21.31 L14.47 18.86 L12.48 17.29 L15.02 17.19 Z" fill={COIN} stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
    </>
  ),
  "nav-stat": (
    <>
      <rect x="8" y="7" width="16" height="18.4" rx="3.2" fill={T} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <rect x="12.8" y="4.8" width="6.4" height="4.4" rx="1.8" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <rect x="11" y="19" width="2.8" height="4" rx="1.4" fill={S} stroke={STROKE} strokeWidth={1.6} />
      <rect x="14.6" y="16" width="2.8" height="7" rx="1.4" fill={S} stroke={STROKE} strokeWidth={1.6} />
      <rect x="18.2" y="13" width="2.8" height="10" rx="1.4" fill={P} stroke={STROKE} strokeWidth={1.6} />
      <path d={HEART} transform="translate(11.6 12.4) scale(0.62)" fill={BLUSH} stroke="none" />
    </>
  ),
  "nav-budget": (
    <>
      <circle cx="16" cy="7.6" r="3.2" fill={COIN} stroke={STROKE} strokeWidth={W} />
      <path d="M16 6.1 v3 M14.5 7.6 h3" stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" />
      <ellipse cx="16" cy="19.6" rx="8.6" ry="6.4" fill={P} stroke={STROKE} strokeWidth={W} />
      <path d="M9.8 15.2 L8.6 11 L13.4 13.2 Z" fill={S} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M12.6 14 h6.8" stroke={STROKE} strokeWidth={W} strokeLinecap="round" />
      <rect x="10.6" y="24.4" width="3" height="2.6" rx="1.2" fill={S} stroke={STROKE} strokeWidth={1.6} />
      <rect x="18.4" y="24.4" width="3" height="2.6" rx="1.2" fill={S} stroke={STROKE} strokeWidth={1.6} />
      <circle cx="20.6" cy="19.4" r="2.5" fill={T} stroke={STROKE} strokeWidth={1.8} />
      <path d="M19.7 19.4 h1.8 M20.6 18.6 v1.6" stroke={STROKE} strokeWidth={1.3} strokeLinecap="round" />
      <circle cx="17.2" cy="17.6" r="0.95" fill={STROKE} stroke="none" />
      <ellipse cx="13.4" cy="20.6" rx="1.5" ry="1" fill={BLUSH} stroke="none" />
    </>
  ),
  "nav-akun": (
    <>
      <rect x="9" y="6.6" width="14" height="6" rx="2.4" fill={T} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <circle cx="16" cy="9.6" r="1.4" fill={S} stroke="none" />
      <rect x="5.6" y="11.4" width="20.8" height="14" rx="3.4" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M5.6 16.2 h20.8" stroke={STROKE} strokeWidth={W} strokeLinecap="round" />
      <rect x="18.4" y="18.4" width="5.4" height="4.4" rx="1.8" fill={HALO} stroke={STROKE} strokeWidth={1.8} />
      <circle cx="21.1" cy="20.6" r="1" fill={S} stroke="none" />
    </>
  ),
  "nav-saya": (
    <>
      <path d="M9.6 12.4 L8.2 6.8 L13.6 10 Z" fill="#FFF8FD" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M22.4 12.4 L23.8 6.8 L18.4 10 Z" fill="#FFF8FD" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <circle cx="16" cy="17.4" r="8" fill="#FFF8FD" stroke={STROKE} strokeWidth={W} />
      <circle cx="13" cy="16.6" r="1.05" fill={STROKE} stroke="none" />
      <circle cx="19" cy="16.6" r="1.05" fill={STROKE} stroke="none" />
      <path d="M14.4 19.6 q0.8 1 1.6 0 q0.8 1 1.6 0" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <ellipse cx="10.8" cy="19.2" rx="1.6" ry="1.05" fill={BLUSH} stroke="none" />
      <ellipse cx="21.2" cy="19.2" rx="1.6" ry="1.05" fill={BLUSH} stroke="none" />
      <path d="M8.4 8.6 L11.6 10.6 L9 12.4 Z" fill={S} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M23.6 8.6 L20.4 10.6 L23 12.4 Z" fill={S} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx="16" cy="10.6" r="1.5" fill={P} stroke={STROKE} strokeWidth={1.6} />
    </>
  ),
  "fab-catat": (
    <>
      <g transform="rotate(45 16 16)">
        <rect x="13.2" y="4.6" width="5.6" height="3" rx="1.5" fill={BLUSH} stroke={STROKE} strokeWidth={1.8} />
        <rect x="13.2" y="7" width="5.6" height="14.4" rx="1.4" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M13.2 21.4 L16 27 L18.8 21.4 Z" fill={T} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M15 25 L16 27 L17 25 Z" fill={STROKE} stroke="none" />
      </g>
      <path d="M25 4.4 L25.58 5.98 L27.2 6.05 L25.94 7.03 L26.38 8.6 L25 7.7 L23.62 8.6 L24.06 7.03 L22.8 6.05 L24.42 5.98 Z" fill={COIN} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
    </>
  ),
  "pill-ledger": (
    <>
      <rect x="7" y="6" width="18.4" height="20" rx="3.2" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M11.8 6 V26" stroke={STROKE} strokeWidth={W} strokeLinecap="round" />
      <path d="M15.4 12 h6.4 M15.4 16.2 h6.4" stroke={HALO} strokeWidth={W} strokeLinecap="round" />
      <path d="M19.6 6 v6.4 l-2.2-1.8 -2.2 1.8 V6 Z" fill={S} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
      <ellipse cx="18.6" cy="21.6" rx="2" ry="1.4" fill={BLUSH} stroke="none" />
    </>
  ),
  "pill-recurring": (
    <>
      <path d="M8.5 13.3 A8 8 0 0 1 23.5 13.3" stroke={P} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <path d="M25.6 12.4 L23.2 12.4 L24.4 15.6 Z" fill={P} stroke="none" />
      <path d="M23.5 18.7 A8 8 0 0 1 8.5 18.7" stroke={S} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <path d="M6.4 19.6 L8.8 19.6 L7.6 16.4 Z" fill={S} stroke="none" />
      <circle cx="16" cy="16" r="3.6" fill={COIN} stroke={STROKE} strokeWidth={W} />
      <path d="M16 14.4 v3.2 M14.4 16 h3.2" stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" />
    </>
  ),
  "pill-category": (
    <>
      <rect x="7.4" y="7.4" width="7" height="7" rx="2.4" fill={P} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
      <rect x="17.6" y="7.4" width="7" height="7" rx="2.4" fill={S} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
      <rect x="7.4" y="17.6" width="7" height="7" rx="2.4" fill={T} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
      <rect x="17.6" y="17.6" width="7" height="7" rx="2.4" fill={COIN} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
      <path d={HEART} transform="translate(21.1 10.9) scale(0.5)" fill={HALO} stroke="none" />
    </>
  ),
  "pill-reimburse": (
    <>
      <path d="M24.8 14.8 A9.4 9.4 0 0 0 15.2 6.4" stroke={S} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <path d="M26.2 12.6 L23.6 12.6 L24.9 15.8 Z" fill={S} stroke="none" />
      <circle cx="14.4" cy="18.4" r="7.2" fill={COIN} stroke={STROKE} strokeWidth={W} />
      <path d="M14.4 15.2 v6.4 M11.2 18.4 h6.4" stroke={STROKE} strokeWidth={2} strokeLinecap="round" />
      <ellipse cx="10.2" cy="23.4" rx="1.6" ry="1.1" fill={BLUSH} stroke="none" />
    </>
  ),
  "pill-bookmark": (
    <>
      <path d="M10.6 6.6 h10.8 a3 3 0 0 1 3 3 v16.2 l-8.4-5.4 -8.4 5.4 V9.6 a3 3 0 0 1 3-3 z" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M16 10.6 L16.78 12.99 L19.32 13.09 L17.33 14.66 L18.02 17.11 L16 15.7 L13.98 17.11 L14.67 14.66 L12.68 13.09 L15.22 12.99 Z" fill={COIN} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
    </>
  ),
};
