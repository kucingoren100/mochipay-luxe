"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { LedgerRow } from "@/components/transactions/TransactionDetailSheet";
import { KawaiiSelect } from "@/components/ui/KawaiiSelect";
import { Pressable } from "@/components/ui/SquircleCard";
import { KawaiiMascot } from "@/components/ui/KawaiiMascot";
import { useUi } from "@/components/layout/AppShell";
import { useTheme } from "@/context/ThemeContext";
import { useTransactions, useWallets } from "@/hooks/useLocalDb";
import { addDays, endOfMonth, formatRupiah, parseISODate, startOfMonth, startOfWeek, toISODate } from "@/lib/formatters";

type PeriodKey = "month" | "week" | "lastMonth" | "custom";
type TypeFilter = "all" | "expense" | "income" | "transfer";

const PERIODS: { id: PeriodKey; label: string }[] = [
  { id: "month", label: "Bulan Ini 🌸" },
  { id: "week", label: "Minggu Ini ⚡" },
  { id: "lastMonth", label: "Bulan Lalu 🍂" },
  { id: "custom", label: "Custom" },
];

const TYPE_CHIPS: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "expense", label: "Pengeluaran" },
  { id: "income", label: "Pemasukan" },
  { id: "transfer", label: "Transfer Antar Dompet" },
];

const DONUT_COLORS = ["#B8A7E0", "#F4A6CD", "#98D8AA", "#F8B896", "#99C8F5", "#E8AA42", "#CBB094", "#EA7B7B"];

export default function RiwayatPage() {
  const ui = useUi();
  const { maskBalance } = useTheme();
  const transactions = useTransactions();
  const wallets = useWallets();
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [catFilter, setCatFilter] = useState("all");
  const [walletFilter, setWalletFilter] = useState("all");

  const ref = useMemo(
    () => (transactions.length ? parseISODate(transactions[0].date) : new Date()),
    [transactions],
  );

  const bounds = useMemo<[string, string]>(() => {
    if (period === "month") return [toISODate(startOfMonth(ref)), toISODate(endOfMonth(ref))];
    if (period === "week") return [toISODate(startOfWeek(ref)), toISODate(addDays(startOfWeek(ref), 6))];
    if (period === "lastMonth") {
      const lm = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
      return [toISODate(startOfMonth(lm)), toISODate(endOfMonth(lm))];
    }
    return [customStart || "0000-01-01", customEnd || "9999-12-31"];
  }, [period, ref, customStart, customEnd]);

  const periodTx = useMemo(
    () => transactions.filter((tx) => tx.date >= bounds[0] && tx.date <= bounds[1]),
    [transactions, bounds],
  );

  const analysis = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    const byCat: Record<string, number> = {};
    const byCatInc: Record<string, number> = {};
    const catIcon: Record<string, string> = {};
    for (const tx of periodTx) {
      catIcon[tx.category] = tx.categoryIcon;
      if (tx.type === "income") {
        inflow += tx.amount;
        byCatInc[tx.category] = (byCatInc[tx.category] ?? 0) + tx.amount;
      } else if (tx.type === "expense") {
        outflow += tx.amount;
        byCat[tx.category] = (byCat[tx.category] ?? 0) + tx.amount;
      }
    }
    const net = inflow - outflow;
    const rate = inflow > 0 ? (inflow - outflow) / inflow : -1;
    let score: string;
    if (inflow === 0 && outflow === 0) score = "Belum ada catatan 🌸";
    else if (rate >= 0.2) score = "Sefruit Anak Rajin Hemat ✨ (Aman dari Bokek)";
    else if (rate >= 0) score = "Lumayan Hemat 🌸 (Tetap Semangat Nabung)";
    else score = "Wah Bokek 🥺 (Ayo Rapikan Jajan)";

    const makeSegments = (map: Record<string, number>) => {
      const total = Object.values(map).reduce((sum, value) => sum + value, 0) || 1;
      return Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value], i) => ({
          label: name,
          value,
          pct: Math.round((value / total) * 100),
          color: DONUT_COLORS[i % DONUT_COLORS.length],
          icon: catIcon[name] ?? "🏷️",
        }));
    };
    return { inflow, outflow, net, score, segments: makeSegments(byCat), incomeSegments: makeSegments(byCatInc) };
  }, [periodTx]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    periodTx.forEach((tx) => set.add(tx.category));
    return ["all", ...Array.from(set).sort()];
  }, [periodTx]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return periodTx.filter((tx) => {
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (catFilter !== "all" && tx.category !== catFilter) return false;
      if (walletFilter !== "all" && tx.walletId !== walletFilter) return false;
      if (q) {
        const hay = `${tx.note} ${tx.category} ${tx.tag} ${tx.invoiceCode}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [periodTx, query, typeFilter, catFilter, walletFilter]);

  const totalMoved = filtered.reduce((s, tx) => s + tx.amount, 0);
  const walletName = (id: string) => wallets.find((w) => w.id === id)?.name ?? "Dompet";
  const hasFilter = query || typeFilter !== "all" || catFilter !== "all" || walletFilter !== "all";

  const resetFilter = () => {
    setQuery("");
    setTypeFilter("all");
    setCatFilter("all");
    setWalletFilter("all");
  };

  return (
    <main className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-2xl font-semibold">Riwayat & Analisis Cuan 📊</h1>
          <p className="font-manrope text-sm text-muted">Lacak arus kas dan jajanmu ✨</p>
        </div>
        <Pressable className="btn-primary h-10 px-3 text-sm" onClick={() => ui.openExport()}>
          <Download size={16} /> CSV
        </Pressable>
      </header>

      {/* Period pills */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeriod(p.id)}
            className={`rounded-full px-3 py-1.5 font-manrope text-xs font-bold ${period === p.id ? "bg-primary text-on-primary" : "bg-inset"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {period === "custom" && (
        <div className="flex flex-wrap gap-2">
          <input type="date" className="rounded-full bg-inset px-3 py-1.5 text-xs" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
          <input type="date" className="rounded-full bg-inset px-3 py-1.5 text-xs" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
        </div>
      )}

      {/* Health score */}
      <section className="cloud-card p-5">
        <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Skor Keuangan</p>
        <p className="mt-1 font-outfit text-lg font-semibold">{analysis.score}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-inset p-3">
            <p className="font-manrope text-xs text-muted">Saldo Arus Kas</p>
            <p className={`tnum text-base font-bold ${analysis.net >= 0 ? "text-income" : "text-expense"}`}>{formatRupiah(analysis.net, maskBalance)}</p>
          </div>
          <div className="rounded-lg bg-inset p-3">
            <p className="font-manrope text-xs text-muted">Masuk</p>
            <p className="tnum text-base font-bold text-income">{formatRupiah(analysis.inflow, maskBalance)}</p>
          </div>
          <div className="rounded-lg bg-inset p-3">
            <p className="font-manrope text-xs text-muted">Keluar</p>
            <p className="tnum text-base font-bold text-expense">{formatRupiah(analysis.outflow, maskBalance)}</p>
          </div>
        </div>
      </section>

      {/* Dual diagram: expense & income */}
      <FlowDiagram title="Pengeluaran" emoji="💸" segments={analysis.segments} mask={maskBalance} />
      <FlowDiagram title="Pendapatan" emoji="💰" segments={analysis.incomeSegments} mask={maskBalance} />

      {/* Search & filter */}
      <section className="cloud-card p-4">
        <input
          className="inset-field h-12 w-full px-3"
          placeholder="Cari catatan, kategori, tag, atau invoice…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {TYPE_CHIPS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTypeFilter(t.id)} className={`rounded-full px-3 py-1 font-manrope text-xs font-bold ${typeFilter === t.id ? "bg-secondary text-white" : "bg-inset"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <KawaiiSelect
            ariaLabel="Filter kategori"
            value={catFilter}
            onChange={setCatFilter}
            options={categories.map((c) => ({ value: c, label: c === "all" ? "Semua Kategori" : c }))}
          />
          <KawaiiSelect
            ariaLabel="Filter dompet"
            value={walletFilter}
            onChange={setWalletFilter}
            options={[{ value: "all", label: "Semua Dompet" }, ...wallets.map((w) => ({ value: w.id, label: w.name, icon: w.icon }))]}
          />
        </div>
        <div className="mt-3 flex items-center justify-between font-manrope text-xs">
          <span className="font-bold">Menampilkan {filtered.length} catatan · Total: {formatRupiah(totalMoved, maskBalance)}</span>
          {hasFilter && (
            <button type="button" onClick={resetFilter} className="font-bold text-secondary">
              Reset Filter
            </button>
          )}
        </div>
      </section>

      {/* Transaction list */}
      <section className="space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg bg-inset px-4 py-6 text-center">
            <KawaiiMascot size={148} />
            <p className="font-manrope text-sm text-muted">Tidak ada catatan yang cocok. Coba ubah filter ya 🌸</p>
          </div>
        ) : (
          filtered.map((tx) => (
            <LedgerRow key={tx.id} tx={tx} walletName={walletName(tx.walletId)} mask={maskBalance} onClick={() => ui.openDetail(tx.id)} />
          ))
        )}
      </section>
    </main>
  );
}

type Segment = { label: string; value: number; pct: number; color: string; icon: string };

function FlowDiagram({ title, emoji, segments, mask }: { title: string; emoji: string; segments: Segment[]; mask: boolean }) {
  return (
    <section className="cloud-card p-5">
      <h2 className="font-outfit text-lg font-semibold">{title} {emoji}</h2>
      {segments.length === 0 ? (
        <p className="mt-3 font-manrope text-sm text-muted">Belum ada catatan {title.toLowerCase()} di periode ini 🌸</p>
      ) : (
        <>
          <div className="mt-3 flex items-center gap-4">
            <DonutChart segments={segments} />
            <div className="min-w-0 flex-1 space-y-1.5">
              {segments.slice(0, 5).map((seg) => (
                <div key={seg.label} className="flex items-center gap-2 font-manrope text-xs">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: seg.color }} />
                  <span className="min-w-0 flex-1 truncate">{seg.label}</span>
                  <span className="tnum font-bold">{seg.pct.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {segments.slice(0, 5).map((seg) => (
              <div key={seg.label} className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-inset text-lg">{seg.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-manrope text-sm font-semibold">{seg.label}</p>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-inset">
                    <div className="h-full rounded-full" style={{ width: `${seg.pct}%`, background: seg.color }} />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="tnum text-sm font-bold">{formatRupiah(seg.value, mask)}</p>
                  <p className="tnum font-manrope text-xs text-muted">{seg.pct.toFixed(2)}%</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; pct: number; color: string }[] }) {
  const r = 64;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0">
      <circle cx="80" cy="80" r={r} fill="none" stroke="var(--inset)" strokeWidth="22" />
      {segments.map((seg, i) => {
        const len = (seg.pct / 100) * circ;
        const node = (
          <circle
            key={i}
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="22"
            strokeDasharray={`${len} ${circ - len}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 80 80)"
          />
        );
        offset += len;
        return node;
      })}
    </svg>
  );
}
