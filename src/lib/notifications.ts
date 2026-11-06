import type { TodoTask } from "@/types/finance";
import { addDays, toISODate } from "@/lib/formatters";

export interface NotifSettings {
  enabled: boolean;
  leadMinutes: number;
  repeatCount: number;
  repeatIntervalMinutes: number;
  nextDaySummary: boolean;
  summaryTime: string;
}

export const DEFAULT_NOTIF_SETTINGS: NotifSettings = {
  enabled: true,
  leadMinutes: 15,
  repeatCount: 1,
  repeatIntervalMinutes: 10,
  nextDaySummary: false,
  summaryTime: "07:30",
};

export const LEAD_OPTIONS = [0, 5, 10, 15, 30, 60, 120, 1440];
export const REPEAT_OPTIONS = [1, 2, 3, 5];

const SETTINGS_KEY = "mochipay_notif_settings_v1";
const FIRED_KEY = "mochipay_notif_fired_v1";

export function loadNotifSettings(): NotifSettings {
  if (typeof window === "undefined") return DEFAULT_NOTIF_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_NOTIF_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<NotifSettings>;
    return {
      enabled: parsed.enabled !== false,
      leadMinutes: LEAD_OPTIONS.includes(parsed.leadMinutes ?? -1) ? (parsed.leadMinutes as number) : DEFAULT_NOTIF_SETTINGS.leadMinutes,
      repeatCount: REPEAT_OPTIONS.includes(parsed.repeatCount ?? -1) ? (parsed.repeatCount as number) : DEFAULT_NOTIF_SETTINGS.repeatCount,
      repeatIntervalMinutes: Number.isFinite(parsed.repeatIntervalMinutes) && (parsed.repeatIntervalMinutes as number) > 0 ? (parsed.repeatIntervalMinutes as number) : DEFAULT_NOTIF_SETTINGS.repeatIntervalMinutes,
      nextDaySummary: Boolean(parsed.nextDaySummary),
      summaryTime: /^\d{2}:\d{2}$/.test(parsed.summaryTime ?? "") ? (parsed.summaryTime as string) : DEFAULT_NOTIF_SETTINGS.summaryTime,
    };
  } catch {
    return DEFAULT_NOTIF_SETTINGS;
  }
}

export function saveNotifSettings(settings: NotifSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* penyimpanan penuh: abaikan */
  }
}

export function notifPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function requestNotifPermission(): Promise<NotificationPermission | "unsupported"> {
  if (notifPermission() === "unsupported") return "unsupported";
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

export function leadLabel(minutes: number): string {
  if (minutes === 0) return "tepat saat deadline";
  if (minutes < 60) return `${minutes} menit sebelum deadline`;
  if (minutes < 1440) return `${minutes / 60} jam sebelum deadline`;
  return "1 hari sebelum deadline";
}

export interface NotifPayload {
  key: string;
  title: string;
  body: string;
  tag: string;
}

export function userNameForGreeting(): string {
  try {
    const raw = localStorage.getItem("mochipay_preferences_v1");
    const name = raw ? (JSON.parse(raw) as { userName?: string }).userName : undefined;
    return name?.trim() || "bestie";
  } catch {
    return "bestie";
  }
}

function minutesOf(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function dueAt(task: TodoTask): number | null {
  const t = Date.parse(`${task.dueDate}T${task.dueTime || "09:00"}:00`);
  return Number.isNaN(t) ? null : t;
}

function readFired(): Record<string, number> {
  try {
    const raw = localStorage.getItem(FIRED_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function writeFired(map: Record<string, number>): void {
  const cutoff = Date.now() - 3 * 864e5;
  const pruned: Record<string, number> = {};
  for (const [key, at] of Object.entries(map)) {
    if (at > cutoff) pruned[key] = at;
  }
  try {
    localStorage.setItem(FIRED_KEY, JSON.stringify(pruned));
  } catch {
    /* abaikan */
  }
}

export function dueNotifs(tasks: TodoTask[], settings: NotifSettings, now: Date): NotifPayload[] {
  const fired = readFired();
  const next: Record<string, number> = { ...fired };
  const out: NotifPayload[] = [];
  const nowMs = now.getTime();
  const todayIso = toISODate(now);
  const minutesToday = now.getHours() * 60 + now.getMinutes();

  for (const task of tasks) {
    if (!settings.enabled) break;
    if (task.isCompleted || task.dueDate !== todayIso) continue;
    const at = dueAt(task);
    if (at === null) continue;
    const first = at - settings.leadMinutes * 60000;
    for (let k = 0; k < settings.repeatCount; k += 1) {
      const fireAt = first + k * settings.repeatIntervalMinutes * 60000;
      if (nowMs < fireAt || nowMs - fireAt > 3 * 60000) continue;
      const key = `${task.id}|${task.dueDate}|${k}`;
      if (key in fired) continue;
      next[key] = nowMs;
      out.push({
        key,
        title: `⏰ ${task.title}`,
        body: `Deadline ${task.dueTime} — ${leadLabel(settings.leadMinutes)}`,
        tag: key,
      });
    }
  }

  if (settings.nextDaySummary) {
    const key = `summary|${todayIso}`;
    const due = minutesOf(settings.summaryTime);
    if (minutesToday >= due && minutesToday - due <= 90 && !(key in fired)) {
      const tomorrowIso = toISODate(addDays(now, 1));
      const list = tasks.filter((task) => task.dueDate === tomorrowIso && !task.isCompleted);
      if (list.length > 0) {
        next[key] = nowMs;
        const preview = list.slice(0, 3).map((task) => task.title).join(", ");
        out.push({
          key,
          title: "📅 Besok, ya 🐾",
          body: `${userNameForGreeting()}, ada ${list.length} tugas menunggu: ${preview}${list.length > 3 ? ", dst." : ""}`,
          tag: key,
        });
      }
    }
  }

  writeFired(next);
  return out;
}
