"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDb } from "@/lib/db";
import {
  dueNotifs,
  loadNotifSettings,
  notifPermission,
  requestNotifPermission,
  saveNotifSettings,
  type NotifPayload,
  type NotifSettings,
} from "@/lib/notifications";

export function showBrowserNotif(payload: NotifPayload): void {
  if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") return;
  const options: NotificationOptions = { body: payload.body, tag: payload.tag, icon: "/icons/icon-192x192.png" };
  const viaSw = navigator.serviceWorker
    ?.getRegistration()
    .then((reg) => reg?.showNotification(payload.title, options))
    .catch(() => undefined);
  if (viaSw) {
    // fallback langsung kalau SW belum siap (tab baru, registrasi masih jalan)
    const timer = window.setTimeout(() => {
      try {
        new Notification(payload.title, options);
      } catch {
        /* beberapa platform melarang konstruktor langsung */
      }
    }, 2500);
    viaSw.then(() => window.clearTimeout(timer));
  } else {
    try {
      new Notification(payload.title, options);
    } catch {
      /* abaikan */
    }
  }
}

export function useNotifSettings() {
  const [settings, setSettings] = useState<NotifSettings | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    setSettings(loadNotifSettings());
    setPermission(notifPermission());
    const onStorage = (event: StorageEvent) => {
      if (event.key === "mochipay_notif_settings_v1") setSettings(loadNotifSettings());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((patch: Partial<NotifSettings>) => {
    setSettings((current) => {
      const nextSettings = { ...(current ?? loadNotifSettings()), ...patch };
      saveNotifSettings(nextSettings);
      return nextSettings;
    });
  }, []);

  const askPermission = useCallback(async () => {
    const result = await requestNotifPermission();
    setPermission(result);
    return result;
  }, []);

  return { settings, permission, update, askPermission };
}

export function useNotifScheduler(active: boolean) {
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const tick = async () => {
      if (Notification.permission !== "granted") return;
      const settings = loadNotifSettings();
      const tasks = await getDb().todoTasks.toArray();
      for (const payload of dueNotifs(tasks, settings, new Date())) showBrowserNotif(payload);
    };
    void tick();
    const id = window.setInterval(() => void tick(), 30000);
    return () => window.clearInterval(id);
  }, [active]);
}
