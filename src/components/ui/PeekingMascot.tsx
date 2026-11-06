"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";
import type { PaletteId } from "@/types/finance";
import { BLUSH, STROKE, W } from "./iconPacks/base";

const WHITE = "#FFF8FD";
const CREAM = "#FFF6EA";

function Paws({ y = 40, fill = WHITE }: { y?: number; fill?: string }) {
  return (
    <>
      <circle cx="22" cy={y} r="4.6" fill={fill} stroke={STROKE} strokeWidth={W} />
      <circle cx="42" cy={y} r="4.6" fill={fill} stroke={STROKE} strokeWidth={W} />
    </>
  );
}

function Face({ y = 30 }: { y?: number }) {
  return (
    <>
      <circle cx="26" cy={y} r="1.7" fill={STROKE} stroke="none" />
      <circle cx="38" cy={y} r="1.7" fill={STROKE} stroke="none" />
      <path d={`M29 ${y + 5} q3 2.6 6 0`} stroke={STROKE} strokeWidth={1.8} strokeLinecap="round" fill="none" />
      <ellipse cx="20" cy={y + 4} rx="2.6" ry="1.7" fill={BLUSH} stroke="none" />
      <ellipse cx="44" cy={y + 4} rx="2.6" ry="1.7" fill={BLUSH} stroke="none" />
    </>
  );
}

const HEADS: Record<PaletteId, () => ReactNode> = {
  "sienna-artsy": () => (
    <>
      <rect x="14" y="12" width="36" height="30" rx="12" fill="#D8F2D5" stroke={STROKE} strokeWidth={W} />
      <path d="M24 10 q2-6 6-6 M40 10 q-2-6-6-6" stroke={STROKE} strokeWidth={1.8} strokeLinecap="round" fill="none" />
      <Face y={28} />
      <Paws y={42} fill="#BFE8C0" />
    </>
  ),
  lavender: () => (
    <>
      <path d="M16 18 L13 6 L25 12 Z M48 18 L51 6 L39 12 Z" fill={WHITE} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <circle cx="32" cy="26" r="16" fill={WHITE} stroke={STROKE} strokeWidth={W} />
      <path d="M14 12 L20 16 L15 19 Z M50 12 L44 16 L49 19 Z" fill="var(--icon-secondary)" stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" />
      <Face y={26} />
      <Paws y={42} />
    </>
  ),
  strawberry: () => (
    <>
      <path d="M18 16 L16 4 L26 10 Z M46 16 L48 4 L38 10 Z" fill="#FFD3DE" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <circle cx="32" cy="26" r="16" fill="#FFD3DE" stroke={STROKE} strokeWidth={W} />
      <path d="M17 15 q15-10 30 0 q-3 5-15 5 t-15-5 z" fill="#E85D75" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <circle cx="24" cy="12" r="1.2" fill={CREAM} stroke="none" />
      <circle cx="38" cy="11" r="1.2" fill={CREAM} stroke="none" />
      <Face y={27} />
      <Paws y={42} fill="#FFD3DE" />
    </>
  ),
  matcha: () => (
    <>
      <path d="M14 26 a18 18 0 0 1 36 0 v6 a18 18 0 0 1 -36 0 z" fill="#79C27E" stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <circle cx="18" cy="12" r="4.4" fill="#79C27E" stroke={STROKE} strokeWidth={W} />
      <circle cx="46" cy="12" r="4.4" fill="#79C27E" stroke={STROKE} strokeWidth={W} />
      <circle cx="18" cy="11.4" r="1.5" fill={STROKE} stroke="none" />
      <circle cx="46" cy="11.4" r="1.5" fill={STROKE} stroke="none" />
      <circle cx="32" cy="28" r="12.5" fill="#F4FBF2" stroke={STROKE} strokeWidth={W} />
      <Face y={27} />
      <Paws y={42} fill="#F4FBF2" />
    </>
  ),
  sky: () => (
    <>
      <path d="M22 16 C20 2 24 0 26 1 C29 3 29 10 28.5 16 Z M42 16 C44 2 40 0 38 1 C35 3 35 10 35.5 16 Z" fill={WHITE} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      <circle cx="32" cy="27" r="15.5" fill={WHITE} stroke={STROKE} strokeWidth={W} />
      <Face y={27} />
      <ellipse cx="20" cy="31" rx="2.8" ry="1.8" fill="#BFE0FA" stroke="none" />
      <ellipse cx="44" cy="31" rx="2.8" ry="1.8" fill="#BFE0FA" stroke="none" />
      <Paws y={42} />
    </>
  ),
  peachy: () => (
    <>
      <circle cx="18" cy="12" r="5.4" fill="#E8B48C" stroke={STROKE} strokeWidth={W} />
      <circle cx="46" cy="12" r="5.4" fill="#E8B48C" stroke={STROKE} strokeWidth={W} />
      <circle cx="18" cy="12" r="2.2" fill={CREAM} stroke="none" />
      <circle cx="46" cy="12" r="2.2" fill={CREAM} stroke="none" />
      <circle cx="32" cy="26" r="16" fill="#E8B48C" stroke={STROKE} strokeWidth={W} />
      <ellipse cx="32" cy="31" rx="7" ry="5.2" fill={CREAM} stroke="none" />
      <Face y={25} />
      <Paws y={42} fill="#E8B48C" />
    </>
  ),
  cocoa: () => (
    <>
      <circle cx="18" cy="12" r="5.4" fill="#C89B72" stroke={STROKE} strokeWidth={W} />
      <circle cx="46" cy="12" r="5.4" fill="#C89B72" stroke={STROKE} strokeWidth={W} />
      <circle cx="18" cy="12" r="2.2" fill={CREAM} stroke="none" />
      <circle cx="46" cy="12" r="2.2" fill={CREAM} stroke="none" />
      <circle cx="32" cy="26" r="16" fill="#C89B72" stroke={STROKE} strokeWidth={W} />
      <ellipse cx="32" cy="31" rx="7" ry="5.2" fill={CREAM} stroke="none" />
      <Face y={25} />
      <Paws y={42} fill="#C89B72" />
    </>
  ),
};

const MORPH = { type: "spring", stiffness: 450, damping: 25 } as const;

export function PeekingMascot({
  size = 56,
  variant = "sit",
  className = "",
}: {
  size?: number;
  variant?: "sit" | "lounge";
  className?: string;
}) {
  const { palette } = useTheme();
  const Head = HEADS[palette] ?? HEADS.lavender;
  const tilt = variant === "lounge" ? -10 : 0;

  return (
    <span
      className={`kawaii-mascot pointer-events-none inline-block ${className}`}
      style={{ width: size, height: size * 0.75 }}
      aria-hidden="true"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${palette}-${variant}`}
          className="block"
          initial={{ scale: 0.5, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: tilt, opacity: 1 }}
          exit={{ scale: 0.5, rotate: 12, opacity: 0 }}
          transition={MORPH}
        >
          <motion.svg
            viewBox="0 0 64 48"
            width={size}
            height={size * 0.75}
            fill="none"
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          >
            <Head />
          </motion.svg>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
