"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";
import type { PaletteId } from "@/types/finance";
import { HALO, KAWAII_ICON_NAMES, type KawaiiIconName, type PackShapes } from "./iconPacks/base";
import { LAVENDER_SHAPES } from "./iconPacks/lavender";
import { SIENNA_SHAPES } from "./iconPacks/sienna";
import { STRAWBERRY_SHAPES } from "./iconPacks/strawberry";
import { MATCHA_SHAPES } from "./iconPacks/matcha";
import { SKY_SHAPES } from "./iconPacks/sky";
import { cafeShapes } from "./iconPacks/cafe";
import { TODO_SHAPES } from "./iconPacks/todo";

export { KAWAII_ICON_NAMES };
export type { KawaiiIconName, PackShapes };

type MergedShapes = Partial<Record<KawaiiIconName, ReactNode>>;

export const THEME_ICON_PACKS: Record<PaletteId, Partial<PackShapes>> = {
  lavender: LAVENDER_SHAPES,
  "sienna-artsy": SIENNA_SHAPES,
  strawberry: STRAWBERRY_SHAPES,
  matcha: MATCHA_SHAPES,
  sky: SKY_SHAPES,
  peachy: cafeShapes("peachy"),
  cocoa: cafeShapes("cocoa"),
};

const MORPH = { type: "spring", stiffness: 450, damping: 25 } as const;

const STATIC_VARS: CSSProperties = {
  "--icon-primary": "#B8A7E0",
  "--icon-secondary": "#7D6BA8",
  "--icon-tertiary": "#F4A6CD",
  "--icon-stroke": "#2E2A36",
  "--icon-sticker-halo": "rgba(255,255,255,0.9)",
} as CSSProperties;

type Manifest = Partial<Record<PaletteId, string[]>>;

let manifestPromise: Promise<Manifest> | null = null;

function loadManifest(): Promise<Manifest> {
  if (!manifestPromise) {
    manifestPromise = fetch("/icons/themes/manifest.json")
      .then((res) => (res.ok ? (res.json() as Promise<Manifest>) : {}))
      .catch(() => ({}));
  }
  return manifestPromise;
}

const overrideCache = new Map<string, string | null>();

function useThemeOverride(themeId: PaletteId, name: KawaiiIconName): string | null {
  const key = `${themeId}/${name}`;
  const [svg, setSvg] = useState<string | null>(() => overrideCache.get(key) ?? null);

  useEffect(() => {
    const cached = overrideCache.get(key);
    if (cached !== undefined) {
      setSvg(cached);
      return;
    }
    let alive = true;
    loadManifest()
      .then((manifest) => {
        if (!manifest[themeId]?.includes(name)) return null;
        return fetch(`/icons/themes/${themeId}/${name}.svg`).then((res) => (res.ok ? res.text() : null));
      })
      .then((text) => {
        overrideCache.set(key, text ?? null);
        if (alive) setSvg(text ?? null);
      })
      .catch(() => {
        overrideCache.set(key, null);
        if (alive) setSvg(null);
      });
    return () => {
      alive = false;
    };
  }, [key, themeId, name]);

  return svg;
}

export function KawaiiIcon({
  name,
  size = 28,
  badge = false,
  themeAdaptive = true,
  className = "",
  title,
}: {
  name: KawaiiIconName;
  size?: number;
  badge?: boolean;
  themeAdaptive?: boolean;
  className?: string;
  title?: string;
}) {
  const { palette } = useTheme();
  const override = useThemeOverride(palette, name);
  const shapes: MergedShapes = { ...THEME_ICON_PACKS[palette], ...TODO_SHAPES };

  const art = override ? (
    <span
      className="kawaii-icon-override block"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: override }}
    />
  ) : (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect x="1.1" y="1.1" width="29.8" height="29.8" rx="9.4" fill={HALO} stroke="none" />
      {shapes[name]}
    </svg>
  );

  const morph = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={`${palette}-${name}-${override ? "override" : "pack"}`}
        className="block"
        initial={{ scale: 0.5, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.5, rotate: 12, opacity: 0 }}
        transition={MORPH}
      >
        {art}
      </motion.span>
    </AnimatePresence>
  );

  if (!badge) {
    return (
      <span className={`kawaii-icon inline-flex ${className}`} style={themeAdaptive ? undefined : STATIC_VARS}>
        {morph}
      </span>
    );
  }

  return (
    <span
      className={`kawaii-icon inline-grid place-items-center rounded-2xl bg-[var(--icon-badge-bg)] ${className}`}
      style={{
        border: "1.5px solid color-mix(in srgb, var(--primary) 30%, transparent)",
        ...(themeAdaptive ? null : STATIC_VARS),
      }}
    >
      {morph}
    </span>
  );
}
