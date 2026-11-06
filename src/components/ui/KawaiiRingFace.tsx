"use client";

import { motion } from "framer-motion";

export function KawaiiRingFace({ pct, size = 34 }: { pct: number; size?: number }) {
  const perfect = pct >= 100;
  const blink = {
    animate: { scaleY: [1, 1, 0.15, 1] },
    transition: { duration: 0.35, repeat: Infinity, repeatDelay: 2.6, repeatType: "loop" as const },
  };

  return (
    <span className="kawaii-icon grid place-items-center" style={{ width: size, height: size }}>
      <motion.svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill="none"
        role="img"
        aria-label={perfect ? "Semua tugas selesai!" : `Progres ${pct}%`}
        animate={perfect ? { rotate: [0, -8, 8, -5, 0], scale: [1, 1.15, 1] } : { y: [0, -1.5, 0] }}
        transition={perfect ? { duration: 0.7, repeat: Infinity, repeatDelay: 1.4 } : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M7.6 11.4 L8.4 5 L13.6 8.2 Z" fill="var(--icon-primary)" stroke="var(--icon-stroke)" strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M24.4 11.4 L23.6 5 L18.4 8.2 Z" fill="var(--icon-primary)" stroke="var(--icon-stroke)" strokeWidth={1.8} strokeLinejoin="round" />
        <circle cx="16" cy="18" r="9.4" fill="var(--icon-primary)" stroke="var(--icon-stroke)" strokeWidth={2} />
        {perfect ? (
          <>
            <path d="M10.6 16.6 l2.6 -1.8 2.6 1.8" stroke="var(--icon-stroke)" strokeWidth={1.7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="20.8" cy="15.8" r="1.2" fill="var(--icon-stroke)" stroke="none" />
          </>
        ) : (
          <>
            <motion.circle cx="13.2" cy="16" r="1.2" fill="var(--icon-stroke)" stroke="none" style={{ transformBox: "fill-box", transformOrigin: "center" }} {...blink} />
            <motion.circle cx="18.8" cy="16" r="1.2" fill="var(--icon-stroke)" stroke="none" style={{ transformBox: "fill-box", transformOrigin: "center" }} {...blink} />
          </>
        )}
        <path d="M14.4 20.4 q1.6 1.6 3.2 0" stroke="var(--icon-stroke)" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        <path d="M16 18.8 l-1.2 -1 M16 18.8 l1.2 -1" stroke="var(--icon-stroke)" strokeWidth={1.2} strokeLinecap="round" />
        <circle cx="10.6" cy="19" r="1.4" fill="var(--icon-tertiary)" stroke="none" opacity={0.85} />
        <circle cx="21.4" cy="19" r="1.4" fill="var(--icon-tertiary)" stroke="none" opacity={0.85} />
      </motion.svg>
    </span>
  );
}
