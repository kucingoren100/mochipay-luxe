import type { PaletteId } from "@/types/finance";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTHS_LONG = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function formatRupiah(value: number, mask = false): string {
  if (mask) return "Rp ••••••••";
  const negative = value < 0;
  const abs = Math.round(Math.abs(value));
  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negative ? "-" : ""}Rp ${formatted}`;
}

export function formatIdDate(iso: string): string {
  const date = parseISODate(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatLongMonth(date: Date): string {
  return `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatPeriodLabel(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateTime(date: string, time: string): string {
  return `${formatIdDate(date)} • ${time}`;
}

export function startOfWeek(date: Date): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function isWithin(iso: string, start: string, end: string): boolean {
  return iso >= start && iso <= end;
}

export function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function clampWords(text: string, max = 120): string {
  const parts = text.trim().split(/\s+/);
  if (parts.length <= max || !text.trim()) return text;
  return parts.slice(0, max).join(" ");
}

export function uid(prefix: string): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function makeInvoice(date: string): string {
  const compact = date.replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `INV-CUAN-${compact}-${rand}`;
}

export function bytesLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export const CARD_SKINS: Record<PaletteId, string> = {
  lavender: "linear-gradient(145deg, #E7DCFF 0%, #B8A7E0 48%, #F4A6CD 100%)",
  strawberry: "linear-gradient(145deg, #FFE0EC 0%, #F9B3CE 46%, #FF8FB9 100%)",
  peachy: "linear-gradient(145deg, #FFE8DA 0%, #F8B896 48%, #FFC7A8 100%)",
  matcha: "linear-gradient(145deg, #E7F8EC 0%, #98D8AA 50%, #C9EFD6 100%)",
  sky: "linear-gradient(145deg, #E5F3FF 0%, #99C8F5 48%, #C9E6FF 100%)",
  cocoa: "linear-gradient(145deg, #F6EDE3 0%, #CBB094 50%, #E6D3C2 100%)",
  "sienna-artsy": "linear-gradient(145deg, #FBE3D2 0%, #E9866A 50%, #F2C879 100%)",
};

export const WEEKDAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] as const;

export async function compressImage(file: File, max = 960, quality = 0.72): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Foto tidak bisa dibaca"));
      img.src = url;
    });
    const scale = Math.min(1, max / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Kanvas tidak tersedia");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}
