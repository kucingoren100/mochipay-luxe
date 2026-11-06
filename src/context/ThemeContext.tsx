"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PaletteId, PaletteMeta, Preferences, ThemeMode } from "@/types/finance";

export const PREF_KEY = "mochipay_preferences_v1";

export const PALETTES: PaletteMeta[] = [
  { id: "strawberry", name: "Stroberi Pink", emoji: "🍓", vibe: "Manis & Ceria", swatches: ["#FFD1DC", "#F9B3CE", "#9E4D6E"] },
  { id: "lavender", name: "Lavender Dream", emoji: "🪻", vibe: "Default Master", swatches: ["#E3D7FF", "#B8A7E0", "#7D6BA8"] },
  { id: "peachy", name: "Peachy Cream", emoji: "🍑", vibe: "Hangat & Gemes", swatches: ["#FFE2D1", "#F8B896", "#A85A32"] },
  { id: "matcha", name: "Matcha Garden", emoji: "🍵", vibe: "Adem & Segar", swatches: ["#D2F3DC", "#98D8AA", "#416D4E"] },
  { id: "sky", name: "Sky Bunny", emoji: "☁️", vibe: "Ringan & Kalem", swatches: ["#D6EBFF", "#99C8F5", "#3F6E9C"] },
  { id: "cocoa", name: "Milky Cocoa", emoji: "🐻", vibe: "Hangat & Netral", swatches: ["#EFE3D5", "#CBB094", "#6E5540"] },
  { id: "sienna-artsy", name: "Sienna Artsy Collage", emoji: "🎨", vibe: "Tomat & Mustard Artsy", swatches: ["#F2C879", "#E9866A", "#9C4A32"] },
];

const DEFAULTS: Preferences = {
  palette: "lavender",
  mode: "system",
  highContrastNumbers: false,
  maskBalance: false,
  userName: "NAILAH NASYWA",
};

function readPrefs(): Preferences {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      palette: PALETTES.some((item) => item.id === parsed.palette) ? (parsed.palette as PaletteId) : DEFAULTS.palette,
      mode: parsed.mode === "light" || parsed.mode === "dark" || parsed.mode === "system" ? parsed.mode : DEFAULTS.mode,
      highContrastNumbers: Boolean(parsed.highContrastNumbers),
      maskBalance: Boolean(parsed.maskBalance),
      userName: typeof parsed.userName === "string" && parsed.userName.trim() ? parsed.userName.trim() : DEFAULTS.userName,
    };
  } catch {
    return DEFAULTS;
  }
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

interface ThemeContextValue extends Preferences {
  hydrated: boolean;
  activeTheme: "light" | "dark";
  paletteMeta: PaletteMeta;
  setPalette: (palette: PaletteId) => void;
  setMode: (mode: ThemeMode) => void;
  setHighContrastNumbers: (value: boolean) => void;
  toggleMask: () => void;
  setUserName: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  const [activeTheme, setActiveTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setPrefs(readPrefs());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const apply = () => {
      const theme = resolveTheme(prefs.mode);
      const root = document.documentElement;
      root.setAttribute("data-palette", prefs.palette);
      root.setAttribute("data-theme", theme);
      root.setAttribute("data-mode", prefs.mode);
      root.classList.toggle("hc-nums", prefs.highContrastNumbers);
      root.setAttribute("data-mask", prefs.maskBalance ? "1" : "0");
      root.style.colorScheme = theme;
      setActiveTheme(theme);
      localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    };
    apply();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [hydrated, prefs]);

  const value = useMemo<ThemeContextValue>(() => {
    const paletteMeta = PALETTES.find((item) => item.id === prefs.palette) ?? PALETTES[1];
    return {
      ...prefs,
      hydrated,
      activeTheme,
      paletteMeta,
      setPalette: (palette) => setPrefs((current) => ({ ...current, palette })),
      setMode: (mode) => setPrefs((current) => ({ ...current, mode })),
      setHighContrastNumbers: (highContrastNumbers) => setPrefs((current) => ({ ...current, highContrastNumbers })),
      toggleMask: () => setPrefs((current) => ({ ...current, maskBalance: !current.maskBalance })),
      setUserName: (name) => setPrefs((current) => ({ ...current, userName: name.slice(0, 40) })),
    };
  }, [prefs, hydrated, activeTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme harus dipakai di dalam ThemeProvider");
  return ctx;
}

export const themeBootScript = `(function(){try{var raw=localStorage.getItem("${PREF_KEY}");var prefs=raw?JSON.parse(raw):{};var palette=prefs.palette||"lavender";var mode=prefs.mode||"system";var theme=mode;if(mode==="system"){theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}var root=document.documentElement;root.setAttribute("data-palette",palette);root.setAttribute("data-theme",theme);root.setAttribute("data-mode",mode);if(prefs.highContrastNumbers)root.classList.add("hc-nums");root.setAttribute("data-mask",prefs.maskBalance?"1":"0");root.style.colorScheme=theme;}catch(e){}})();`;
