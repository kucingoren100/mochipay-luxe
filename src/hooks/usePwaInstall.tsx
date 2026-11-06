"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface StorageEstimate {
  usage?: number;
  quota?: number;
}

interface PwaContextValue {
  canInstall: boolean;
  installed: boolean;
  ios: boolean;
  persisted: boolean | null;
  usage: StorageEstimate;
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
  requestInstall: () => Promise<void>;
  refreshUsage: () => Promise<void>;
}

const PwaContext = createContext<PwaContextValue | null>(null);

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [usage, setUsage] = useState<StorageEstimate>({});
  const [helpOpen, setHelpOpen] = useState(false);

  const refreshUsage = async () => {
    if (!navigator.storage?.estimate) return;
    const estimate = await navigator.storage.estimate();
    setUsage({ usage: estimate.usage, quota: estimate.quota });
    if (navigator.storage.persisted) setPersisted(await navigator.storage.persisted());
  };

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setInstalled(standalone);
    const ua = navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIos(isIos && !standalone);
    void refreshUsage();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      navigator.serviceWorker.addEventListener("message", (event) => {
        const data = event.data as { action?: string; url?: string } | undefined;
        if (data?.action === "open-window" && data.url) window.open(data.url, "_blank");
      });
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const value = useMemo<PwaContextValue>(
    () => ({
      canInstall: Boolean(deferred) && !installed,
      installed,
      ios,
      persisted,
      usage,
      helpOpen,
      setHelpOpen,
      refreshUsage,
      requestInstall: async () => {
        if (deferred && !installed) {
          await deferred.prompt();
          const choice = await deferred.userChoice;
          if (choice.outcome === "accepted") setInstalled(true);
          setDeferred(null);
          return;
        }
        setHelpOpen(true);
      },
    }),
    [deferred, installed, ios, persisted, usage, helpOpen],
  );

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
}

export function usePwaInstall() {
  const ctx = useContext(PwaContext);
  if (!ctx) throw new Error("usePwaInstall harus dipakai di dalam PwaProvider");
  return ctx;
}
