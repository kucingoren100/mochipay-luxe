"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";
import type { PaletteId } from "@/types/finance";
import { BLUSH, COIN, P, S, STROKE, T, W, Star4 } from "./iconPacks/base";

const INK_EYE = STROKE;
const WHITE = "#FFF8FD";
const CREAM = "#FFF6EA";

function Bob({ children, dur = 3, y = -6 }: { children: ReactNode; dur?: number; y?: number }) {
  return (
    <motion.g animate={{ y: [0, y, 0] }} transition={{ repeat: Infinity, duration: dur, ease: "easeInOut" }}>
      {children}
    </motion.g>
  );
}

function SiennaMascot() {
  return (
    <>
      <ellipse cx="80" cy="120" rx="46" ry="14" fill={P} opacity="0.35" stroke="none" />
      <Bob dur={3.2}>
        <path d="M62 96 q-6 22 4 30 h28 q10-8 4-30 q-4-14-18-14 t-18 14 z" fill="#BFE8C0" stroke={STROKE} strokeWidth={W + 0.4} strokeLinejoin="round" />
        <rect x="58" y="52" width="44" height="40" rx="16" fill="#D8F2D5" stroke={STROKE} strokeWidth={W + 0.4} />
        <circle cx="70" cy="72" r="2.6" fill={INK_EYE} stroke="none" />
        <circle cx="90" cy="72" r="2.6" fill={INK_EYE} stroke="none" />
        <path d="M76 80 q4 3 8 0" stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <ellipse cx="64" cy="79" rx="4" ry="2.6" fill={BLUSH} stroke="none" />
        <ellipse cx="96" cy="79" rx="4" ry="2.6" fill={BLUSH} stroke="none" />
        <path d="M96 92 h14 v12 a4 4 0 0 1 -4 4 h-6 a4 4 0 0 1 -4-4 z" fill={COIN} stroke={STROKE} strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M110 95 q6 2 0 8" stroke={STROKE} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <path d="M70 46 q2-8 8-8 M88 46 q-2-8-8-8" stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <Star4 x={118} y={52} s={1.4} fill={COIN} />
        <Star4 x={42} y={66} s={1} fill="#F49AC1" />
      </Bob>
    </>
  );
}

function LavenderMascot() {
  return (
    <>
      <Bob dur={3.4}>
        <path d="M44 62 C46 78 54 88 64 94" stroke={STROKE} strokeWidth={2} strokeLinecap="round" fill="none" />
        <circle cx="44" cy="46" r="17" fill={P} stroke={STROKE} strokeWidth={W} />
        <path d="M41 62 h6 l-3 5 z" fill={P} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
        <ellipse cx="38" cy="40" rx="4.4" ry="3" fill="var(--icon-sticker-halo)" stroke="none" transform="rotate(-28 38 40)" />
      </Bob>
      <Bob dur={2.6} y={-8}>
        <path d="M116 56 C114 72 106 84 96 92" stroke={STROKE} strokeWidth={2} strokeLinecap="round" fill="none" />
        <circle cx="116" cy="40" r="15" fill={T} stroke={STROKE} strokeWidth={W} />
        <path d="M113 54 h6 l-3 5 z" fill={T} stroke={STROKE} strokeWidth={1.8} strokeLinejoin="round" />
        <ellipse cx="111" cy="35" rx="3.8" ry="2.6" fill="var(--icon-sticker-halo)" stroke="none" transform="rotate(-28 111 35)" />
      </Bob>
      <Bob dur={3}>
        <path d="M58 60 L54 34 L76 48 Z" fill={WHITE} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M102 60 L106 34 L84 48 Z" fill={WHITE} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M60 55 L58.5 41 L70 48.5 Z" fill={BLUSH} stroke="none" />
        <path d="M100 55 L101.5 41 L90 48.5 Z" fill={BLUSH} stroke="none" />
        <circle cx="80" cy="72" r="27" fill={WHITE} stroke={STROKE} strokeWidth={W} />
        <circle cx="70" cy="69" r="3" fill={INK_EYE} stroke="none" />
        <circle cx="90" cy="69" r="3" fill={INK_EYE} stroke="none" />
        <circle cx="71" cy="67.6" r="1.1" fill="#FFFFFF" stroke="none" />
        <circle cx="91" cy="67.6" r="1.1" fill="#FFFFFF" stroke="none" />
        <path d="M77.5 76 q2.5 2.6 5 0" stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <path d="M80 73.4 l-1.8 2 h3.6 z" fill={BLUSH} stroke="none" />
        <ellipse cx="63" cy="77" rx="4.4" ry="2.8" fill={BLUSH} stroke="none" />
        <ellipse cx="97" cy="77" rx="4.4" ry="2.8" fill={BLUSH} stroke="none" />
        <circle cx="64" cy="94" r="6" fill={WHITE} stroke={STROKE} strokeWidth={W} />
        <circle cx="96" cy="92" r="6" fill={WHITE} stroke={STROKE} strokeWidth={W} />
      </Bob>
      <rect x="40" y="100" width="80" height="48" rx="12" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <rect x="72" y="100" width="16" height="48" fill={S} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <rect x="33" y="90" width="94" height="18" rx="8" fill={P} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <rect x="72" y="90" width="16" height="18" fill={S} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M42 116 h22 M42 126 h14" stroke="var(--icon-sticker-halo)" strokeWidth={W} strokeLinecap="round" />
    </>
  );
}

function StrawberryMascot() {
  return (
    <>
      <Bob dur={3.2}>
        <path d="M96 40 h22 l-4 62 a6 6 0 0 1 -6 5 h-4 a6 6 0 0 1 -6-5 z" fill="var(--icon-sticker-halo)" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M98 62 h18 l-1.4 20 h-15.2 z" fill="#F49AC1" stroke="none" />
        <path d="M99 82 h16 l-1 14 h-14 z" fill={CREAM} stroke="none" />
        <circle cx="107" cy="34" r="7" fill="#E85D75" stroke={STROKE} strokeWidth={W} />
        <path d="M107 27 q1-4 4-5" stroke="#5FA85F" strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <path d="M96 52 h22" stroke={STROKE} strokeWidth={2} strokeLinecap="round" />
      </Bob>
      <Bob dur={2.8}>
        <path d="M46 62 L42 36 L64 50 Z M94 62 L98 36 L76 50 Z" fill="#FFD3DE" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <circle cx="70" cy="78" r="30" fill="#FFD3DE" stroke={STROKE} strokeWidth={W} />
        <path d="M48 60 q22-16 44 0 q-5 8-22 8 t-22-8 z" fill="#E85D75" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <circle cx="58" cy="52" r="1.6" fill={CREAM} stroke="none" />
        <circle cx="80" cy="50" r="1.6" fill={CREAM} stroke="none" />
        <circle cx="60" cy="80" r="3" fill={INK_EYE} stroke="none" />
        <circle cx="80" cy="80" r="3" fill={INK_EYE} stroke="none" />
        <path d="M66 88 q4 3.4 8 0" stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <ellipse cx="50" cy="86" rx="4.6" ry="3" fill={BLUSH} stroke="none" />
        <ellipse cx="90" cy="86" rx="4.6" ry="3" fill={BLUSH} stroke="none" />
        <circle cx="96" cy="98" r="7" fill="#FFD3DE" stroke={STROKE} strokeWidth={W} />
      </Bob>
      <path d="M34 118 q36 16 72 0 l-6 26 h-60 z" fill="#F49AC1" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M40 128 h60" stroke={CREAM} strokeWidth={W} strokeLinecap="round" />
    </>
  );
}

function MatchaMascot() {
  return (
    <>
      <path d="M20 108 C40 78 120 78 140 108 C120 132 40 132 20 108 Z" fill="#7FBF8A" stroke={STROKE} strokeWidth={W + 0.4} strokeLinejoin="round" />
      <path d="M80 84 V126 M80 96 L58 88 M80 96 L102 88 M80 110 L62 104 M80 110 L98 104" stroke="#4E8F5B" strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Bob dur={3.4} y={-4}>
        <circle cx="80" cy="72" r="26" fill="#F4FBF2" stroke={STROKE} strokeWidth={W} />
        <path d="M58 56 L54 36 L72 46 Z M102 56 L106 36 L88 46 Z" fill="#F4FBF2" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M66 72 q4 4 8 0 M86 72 q4 4 8 0" stroke={STROKE} strokeWidth={2.4} strokeLinecap="round" fill="none" />
        <path d="M76 80 q4 3 8 0" stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <ellipse cx="62" cy="78" rx="4.4" ry="2.8" fill={BLUSH} stroke="none" />
        <ellipse cx="98" cy="78" rx="4.4" ry="2.8" fill={BLUSH} stroke="none" />
        <path d="M104 60 q10-2 12 6 q-8 4-12-2 z" fill="#79C27E" stroke={STROKE} strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M112 40 h8 M116 36 v8" stroke={S} strokeWidth={2.4} strokeLinecap="round" />
        <path d="M124 26 h6 M127 23 v6" stroke={S} strokeWidth={2} strokeLinecap="round" />
      </Bob>
      <Star4 x={36} y={52} s={1.2} fill={COIN} />
    </>
  );
}

function SkyMascot() {
  return (
    <>
      <path d="M18 96 a10 10 0 0 1 2-19 a13 13 0 0 1 25-3 a11 11 0 0 1 13 10 a8 8 0 0 1 -2 12 z" fill="#FFFFFF" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" opacity="0.9" />
      <path d="M96 128 a9 9 0 0 1 2-17 a12 12 0 0 1 23-3 a10 10 0 0 1 12 9 a7 7 0 0 1 -2 11 z" fill="#FFFFFF" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" opacity="0.9" />
      <Bob dur={2.8} y={-8}>
        <path d="M62 44 C60 22 66 16 70 18 C75 21 76 34 75 44 Z M98 44 C100 22 94 16 90 18 C85 21 84 34 85 44 Z" fill="#FFFFFF" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <circle cx="80" cy="66" r="26" fill="#FFFFFF" stroke={STROKE} strokeWidth={W} />
        <circle cx="71" cy="66" r="2.8" fill={INK_EYE} stroke="none" />
        <circle cx="89" cy="66" r="2.8" fill={INK_EYE} stroke="none" />
        <path d="M76 74 q4 3.4 8 0" stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <ellipse cx="62" cy="72" rx="4.4" ry="2.8" fill="#BFE0FA" stroke="none" />
        <ellipse cx="98" cy="72" rx="4.4" ry="2.8" fill="#BFE0FA" stroke="none" />
        <path d="M104 84 L126 62" stroke={S} strokeWidth={3} strokeLinecap="round" />
        <path d="M126 62 L121 58 L130 54 L128 64 L134 60 L129 68 Z" fill={COIN} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
        <circle cx="58" cy="88" r="7" fill="#FFFFFF" stroke={STROKE} strokeWidth={W} />
      </Bob>
      <Star4 x={40} y={40} s={1.3} fill={COIN} />
      <Star4 x={124} y={96} s={1} fill="#F49AC1" />
    </>
  );
}

function CafeMascot({ variant }: { variant: "peachy" | "cocoa" }) {
  const fur = variant === "peachy" ? "#E8B48C" : "#C89B72";
  return (
    <>
      <Bob dur={3.2}>
        <circle cx="56" cy="46" r="12" fill={fur} stroke={STROKE} strokeWidth={W} />
        <circle cx="104" cy="46" r="12" fill={fur} stroke={STROKE} strokeWidth={W} />
        <circle cx="56" cy="46" r="5" fill={CREAM} stroke="none" />
        <circle cx="104" cy="46" r="5" fill={CREAM} stroke="none" />
        <circle cx="80" cy="74" r="30" fill={fur} stroke={STROKE} strokeWidth={W} />
        <ellipse cx="80" cy="84" rx="13" ry="10" fill={CREAM} stroke="none" />
        <circle cx="69" cy="70" r="3" fill={INK_EYE} stroke="none" />
        <circle cx="91" cy="70" r="3" fill={INK_EYE} stroke="none" />
        <path d="M76 82 q4 3.4 8 0" stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <ellipse cx="58" cy="78" rx="4.6" ry="3" fill={BLUSH} stroke="none" />
        <ellipse cx="102" cy="78" rx="4.6" ry="3" fill={BLUSH} stroke="none" />
        <path d="M104 96 h18 v16 a5 5 0 0 1 -5 5 h-8 a5 5 0 0 1 -5-5 z" fill="#FFFFFF" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M122 100 q8 3 0 10" stroke={STROKE} strokeWidth={W} fill="none" strokeLinecap="round" />
        <path d="M108 92 q2-5 0-9 M116 92 q2-5 0-9" stroke={S} strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <rect x="42" y="100" width="26" height="22" rx="4" fill={COIN} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
        <path d="M42 108 h26" stroke="#B7791F" strokeWidth={2.2} />
      </Bob>
      <path d="M30 132 q50 14 100 0" stroke={P} strokeWidth={W + 1} strokeLinecap="round" fill="none" />
    </>
  );
}

const MASCOTS: Record<PaletteId, () => ReactNode> = {
  lavender: LavenderMascot,
  "sienna-artsy": SiennaMascot,
  strawberry: StrawberryMascot,
  matcha: MatchaMascot,
  sky: SkyMascot,
  peachy: () => <CafeMascot variant="peachy" />,
  cocoa: () => <CafeMascot variant="cocoa" />,
};

const MORPH = { type: "spring", stiffness: 450, damping: 25 } as const;

export function KawaiiMascot({ size = 160, className = "" }: { size?: number; className?: string }) {
  const { palette } = useTheme();
  const Art = MASCOTS[palette] ?? LavenderMascot;

  return (
    <span className={`kawaii-mascot inline-block ${className}`} style={{ width: size, height: size }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={palette}
          className="block"
          initial={{ scale: 0.5, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.5, rotate: 12, opacity: 0 }}
          transition={MORPH}
        >
          <svg viewBox="0 0 160 160" width={size} height={size} fill="none" aria-hidden="true">
            <Art />
          </svg>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
