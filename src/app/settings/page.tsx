"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Check, BookOpen, Download, RotateCcw, Smartphone, Upload } from "lucide-react";
import Link from "next/link";
import { KawaiiSwitch } from "@/components/ui/KawaiiSwitch";
import { KawaiiIcon } from "@/components/ui/KawaiiIcon";
import { KawaiiMascot } from "@/components/ui/KawaiiMascot";
import { Overlay, Pressable } from "@/components/ui/SquircleCard";
import { WidgetGallerySheet, type WidgetPreviewRequest } from "@/components/widgets/WidgetGallerySheet";
import { WidgetPreviewModal } from "@/components/widgets/WidgetPreviewModal";
import { useUi } from "@/components/layout/AppShell";
import { PALETTES, useTheme } from "@/context/ThemeContext";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { useTransactions, useWallets } from "@/hooks/useLocalDb";
import { exportDatabase, importDatabase, isBackupFile, resetDatabase } from "@/lib/db";
import { downloadJsonBackup } from "@/lib/csv-exporter";
import { bytesLabel, endOfMonth, formatRupiah, parseISODate, startOfMonth, toISODate } from "@/lib/formatters";
import type { ThemeMode } from "@/types/finance";

const MODES: { id: ThemeMode; label: string }[] = [
  { id: "light", label: "☀️ Terang" },
  { id: "dark", label: "🌙 Gelap" },
  { id: "system", label: "⚙️ Ikut Sistem" },
];

export default function SettingsPage() {
  const ui = useUi();
  const theme = useTheme();
  const pwa = usePwaInstall();
  const transactions = useTransactions();
  const wallets = useWallets();
  const importRef = useRef<HTMLInputElement>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [widgetPreview, setWidgetPreview] = useState<WidgetPreviewRequest | null>(null);
  const [busy, setBusy] = useState(false);

  const preview = useMemo(() => {
    let total = 0;
    for (const w of wallets) total += w.balance;
    const ref = transactions.length ? parseISODate(transactions[0].date) : new Date();
    const mStart = toISODate(startOfMonth(ref));
    const mEnd = toISODate(endOfMonth(ref));
    const lm = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
    const lmStart = toISODate(startOfMonth(lm));
    const lmEnd = toISODate(endOfMonth(lm));
    let inflow = 0;
    let outflow = 0;
    let lmInflow = 0;
    let lmOutflow = 0;
    for (const tx of transactions) {
      if (tx.date >= mStart && tx.date <= mEnd) {
        if (tx.type === "income") inflow += tx.amount;
        else if (tx.type === "expense") outflow += tx.amount;
      }
      if (tx.date >= lmStart && tx.date <= lmEnd) {
        if (tx.type === "income") lmInflow += tx.amount;
        else if (tx.type === "expense") lmOutflow += tx.amount;
      }
    }
    const thisNet = inflow - outflow;
    const lastNet = lmInflow - lmOutflow;
    const growthLabel =
      lastNet > 0
        ? `${thisNet - lastNet >= 0 ? "+" : ""}${Math.round(((thisNet - lastNet) / lastNet) * 100)}% cuan bulan ini 🚀`
        : "+8.5% cuan bulan ini 🚀";
    const pct = inflow > 0 ? Math.min(100, Math.round((thisNet / inflow) * 100)) : 0;
    return { total, growthLabel, pct: Math.max(0, pct) };
  }, [wallets, transactions]);

  const doImport = async (file: File) => {
    setBusy(true);
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isBackupFile(parsed)) throw new Error("File backup tidak dikenali");
      await importDatabase(parsed);
      ui.toast("Restore berhasil. Buku kas lokal sudah diganti 💖");
    } catch (err) {
      ui.toast(err instanceof Error ? err.message : "Restore gagal");
    } finally {
      setBusy(false);
    }
  };

  const doExport = async () => {
    setBusy(true);
    try {
      downloadJsonBackup(await exportDatabase());
      ui.toast("Backup .json sudah diunduh ✨");
    } catch (err) {
      ui.toast(err instanceof Error ? err.message : "Backup gagal");
    } finally {
      setBusy(false);
    }
  };

  const doReset = async () => {
    setBusy(true);
    try {
      await resetDatabase();
      setResetOpen(false);
      ui.toast("Data dikembalikan ke awal. Buku kas segar lagi ✨");
    } catch (err) {
      ui.toast(err instanceof Error ? err.message : "Reset gagal");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="space-y-5">
      <header>
        <h1 className="font-outfit text-2xl font-semibold">Halo, {theme.userName}! 👋</h1>
        <p className="font-manrope text-sm text-muted">Atur profil, warna, dan simpanan lokalmu ✨</p>
      </header>

      {/* Meow Todo shortcut */}
      <Link href="/todo" className="cloud-card relative block overflow-hidden p-5">
        <div className="flex items-center gap-4">
          <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[var(--icon-badge-bg)]">
            <span className="text-4xl">📅</span>
            <span className="absolute -top-1 right-1 text-2xl">🐱</span>
            <span className="absolute bottom-1 left-1 text-sm">✏️</span>
            <span className="absolute left-2 top-1 text-sm">✨</span>
          </div>
          <div className="min-w-0">
            <h2 className="font-outfit text-xl font-semibold leading-7">Buka Cantikk Todo & Jadwal Harian 📝🐾</h2>
            <p className="mt-1 font-manrope text-sm leading-5 text-muted">
              Atur to-do list tugas, jadwal kalender, dan kebiasaanmu dengan tema gemes yang sama!
            </p>
            <span className="btn-primary mt-3 inline-flex h-10 items-center gap-2 px-4 text-sm">Mulai Petualangan Cantikk →</span>
          </div>
        </div>
      </Link>

      {/* Profile */}
      <section className="cloud-card flex items-center gap-3 p-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--icon-badge-bg)] text-2xl">🐰</span>
        <label className="min-w-0 flex-1 font-manrope text-sm font-semibold">
          Nama Panggilan Kamu
          <input
            className="inset-field mt-1 h-12 w-full px-3"
            placeholder="Contoh: Naya Putri"
            value={theme.userName}
            onChange={(e) => theme.setUserName(e.target.value)}
          />
        </label>
      </section>

      {/* Live preview */}
      <section className="cloud-card p-5">
        <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Intip Tampilan Langsung</p>
        <span className="chip-income mt-2 inline-flex rounded-full px-3 py-1 font-manrope text-[11px] font-bold">
          {theme.paletteMeta.name} Aktif {theme.paletteMeta.emoji}
        </span>
        <div className="mt-3 rounded-xl border border-line bg-card p-4">
          <p className="font-manrope text-xs text-muted">Total Cuan Kamu</p>
          <p className="tnum text-2xl font-bold">{formatRupiah(preview.total, theme.maskBalance)}</p>
          <span className="chip-income mt-2 inline-flex rounded-full px-2 py-0.5 font-manrope text-[10px] font-bold">{preview.growthLabel}</span>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-inset">
            <div className="h-full rounded-full bg-primary" style={{ width: `${preview.pct}%` }} />
          </div>
          <div className="mt-3 flex items-end gap-3">
            <KawaiiMascot size={92} />
            <div className="grid flex-1 grid-cols-5 gap-2">
              <KawaiiIcon name="nav-rekor" size={30} badge className="h-11 w-11" />
              <KawaiiIcon name="nav-stat" size={30} badge className="h-11 w-11" />
              <KawaiiIcon name="nav-budget" size={30} badge className="h-11 w-11" />
              <KawaiiIcon name="nav-akun" size={30} badge className="h-11 w-11" />
              <KawaiiIcon name="nav-saya" size={30} badge className="h-11 w-11" />
              <KawaiiIcon name="pill-ledger" size={26} />
              <KawaiiIcon name="pill-recurring" size={26} />
              <KawaiiIcon name="pill-category" size={26} />
              <KawaiiIcon name="pill-reimburse" size={26} />
              <KawaiiIcon name="pill-bookmark" size={26} />
            </div>
          </div>
        </div>
      </section>

      {/* Mode selector */}
      <section className="cloud-card p-4">
        <h2 className="font-outfit text-lg font-semibold">Mode Tampilan</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => theme.setMode(m.id)}
              className={`rounded-xl border px-3 py-3 font-manrope text-sm font-bold ${theme.mode === m.id ? "border-secondary bg-inset" : "border-line bg-card"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      {/* Palette selector */}
      <section className="cloud-card p-4">
        <h2 className="font-outfit text-lg font-semibold">Pilihan Tema Lucu 🌈</h2>
        <p className="font-manrope text-xs text-muted">Tujuh palet pastel aesthetic, masing-masing punya pack ikon & maskot sendiri ✨</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {PALETTES.map((p) => {
            const active = theme.palette === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => theme.setPalette(p.id)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left ${active ? "border-secondary bg-inset" : "border-line bg-card"}`}
              >
                <div className="flex -space-x-1.5">
                  {p.swatches.map((c, i) => (
                    <span key={i} className="h-7 w-7 rounded-full border-2 border-card" style={{ background: c }} />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-outfit text-sm font-semibold">{p.name} {p.emoji}</p>
                  <p className="font-manrope text-xs text-muted">{p.vibe}</p>
                </div>
                <span className={`grid h-5 w-5 place-items-center rounded-full border ${active ? "border-secondary bg-secondary text-white" : "border-line"}`}>
                  {active && <Check size={12} />}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Accessibility */}
      <section className="cloud-card space-y-3 p-4">
        <h2 className="font-outfit text-lg font-semibold">Aksesibilitas</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-manrope text-sm font-semibold">Angka ekstra tebal & kontras</p>
            <p className="font-manrope text-xs text-muted">Tebalkan dan kontraskan semua angka cuan.</p>
          </div>
          <KawaiiSwitch checked={theme.highContrastNumbers} onChange={theme.setHighContrastNumbers} label="Angka ekstra tebal dan kontras" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-manrope text-sm font-semibold">Sembunyikan Saldo (Privasi)</p>
            <p className="font-manrope text-xs text-muted">Tutupi nominal saldo jadi Rp ••••••••</p>
          </div>
          <KawaiiSwitch checked={theme.maskBalance} onChange={theme.toggleMask} label="Sembunyikan saldo privasi" />
        </div>
      </section>

      {/* Management */}
      <section className="cloud-card p-4">
        <h2 className="font-outfit text-lg font-semibold">Pengelolaan</h2>
        <button
          type="button"
          onClick={() => setWidgetOpen(true)}
          className="mt-2 flex w-full items-center gap-3 rounded-xl bg-inset p-3 text-left"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(140deg,var(--primary),var(--tertiary))] text-on-primary">
            <Smartphone size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-manrope text-sm font-bold">Widget Desktop / HP</span>
            <span className="block font-manrope text-xs text-muted">Lihat semua widget yang tersedia untuk layar utama smartphone</span>
          </span>
          <span className="shrink-0 font-manrope text-xs font-bold text-secondary">Lihat semua ›</span>
        </button>
      </section>

      {/* Guide */}
      <section className="cloud-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-outfit text-lg font-semibold">Panduan Pemakaian 📖</h2>
            <p className="mt-1 font-manrope text-xs text-muted">Tata cara pakai lengkap: catat cuan, celengan, dompet, tema, sampai backup.</p>
          </div>
          <Link href="/panduan" className="btn-primary flex h-11 shrink-0 items-center gap-2 px-4 text-sm">
            <BookOpen size={16} /> Buka Panduan
          </Link>
        </div>
      </section>

      {/* Storage controls */}
      <section className="cloud-card p-4">
        <h2 className="font-outfit text-lg font-semibold">Status Penyimpanan Lokal (IndexedDB)</h2>
        <div className="mt-2 rounded-lg bg-inset p-3 font-manrope text-sm">
          <p>Catatan tersimpan: <span className="tnum font-bold">{transactions.length}</span> transaksi</p>
          <p>Penyimpanan persisten: {pwa.persisted ? "aktif, data aman 🔒" : "menunggu izin perangkat"}</p>
          <p>Pemakaian: {bytesLabel(pwa.usage.usage ?? 0)}{pwa.usage.quota ? ` dari ${bytesLabel(pwa.usage.quota)}` : ""}</p>
          <p>Status offline: {pwa.installed ? "terpasang & siap mandiri ✨" : "siap dipasang kapan saja"}</p>
        </div>
        <div className="mt-3 grid gap-2">
          <Pressable className="btn-primary h-12 w-full text-sm" onClick={() => void pwa.requestInstall()}>
            Install Aplikasi (PWA) 📲
          </Pressable>
          <div className="grid gap-2 sm:grid-cols-2">
            <Pressable className="btn-ghost h-12 text-sm" onClick={() => void doExport()} disabled={busy}>
              <span className="flex items-center justify-center gap-2"><Download size={16} /> Export Backup (.json)</span>
            </Pressable>
            <Pressable className="btn-ghost h-12 text-sm" onClick={() => ui.openExport()}>
              <span className="flex items-center justify-center gap-2"><Download size={16} /> Download CSV</span>
            </Pressable>
          </div>
          <Pressable className="btn-ghost h-12 w-full text-sm" onClick={() => importRef.current?.click()} disabled={busy}>
            <span className="flex items-center justify-center gap-2"><Upload size={16} /> Import Restore (.json)</span>
          </Pressable>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void doImport(file);
            }}
          />
          <Pressable className="btn-danger h-12 w-full text-sm" onClick={() => setResetOpen(true)}>
            <span className="flex items-center justify-center gap-2"><RotateCcw size={16} /> Reset ke Data Awal</span>
          </Pressable>
        </div>
      </section>

      <AnimatePresence>
        {resetOpen && (
          <Overlay onClose={() => setResetOpen(false)}>
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-inset text-3xl">🥺</div>
              <h3 className="mt-3 font-outfit text-2xl font-semibold">Yakin Reset ke Data Awal?</h3>
              <p className="mt-2 font-manrope text-sm leading-6 text-muted">
                Semua catatan, dompet, dan celengan buatanmu bakal hilang dan diganti data demo awal. Ini nggak bisa dibatalkan lho!
              </p>
              <div className="mt-5 grid gap-2">
                <Pressable className="btn-danger h-12" onClick={() => void doReset()} disabled={busy}>
                  {busy ? "Mereset…" : "Ya, Reset Aja 🔄"}
                </Pressable>
                <Pressable className="btn-ghost h-12" onClick={() => setResetOpen(false)}>
                  Gak Jadi, Simpan Aja 💖
                </Pressable>
              </div>
            </div>
          </Overlay>
        )}
      </AnimatePresence>

      <WidgetGallerySheet open={widgetOpen} onClose={() => setWidgetOpen(false)} onPreview={setWidgetPreview} />
      <WidgetPreviewModal open={widgetPreview !== null} onClose={() => setWidgetPreview(null)} group={widgetPreview?.group ?? "mochipay"} initialIndex={widgetPreview?.index ?? 0} />
    </main>
  );
}
