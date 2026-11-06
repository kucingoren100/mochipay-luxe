"use client";

import { KawaiiMascot } from "@/components/ui/KawaiiMascot";
import { addDays, formatRupiah, startOfWeek, toISODate, WEEKDAY_LABELS } from "@/lib/formatters";
import type { Budget, Goal, Transaction, Wallet } from "@/types/finance";

export interface WidgetData {
  transactions: Transaction[];
  wallets: Wallet[];
  goals: Goal[];
  budgets: Budget[];
  mask: boolean;
}

export interface WidgetVariant {
  id: string;
  title: string;
  size: string;
  desc: string;
}

export const WIDGET_VARIANTS: WidgetVariant[] = [
  { id: "quick-1x1", title: "Rekaman Cepat", size: "1x1", desc: "Squircle gelap dengan pill kategori bercahaya; sekali tap langsung buka Catat untuk kategori itu." },
  { id: "quick-2x1", title: "Rekaman Cepat", size: "2x1", desc: "Kapsul horizontal: ikon kategori, nama, jumlah transaksi, dan nominal terakhir." },
  { id: "budget-4x1", title: "Anggaran", size: "4x1", desc: "Maskot uang 💸, total budget, badge persen terpakai, dan sisa budget aman." },
  { id: "stats-4x1", title: "Statistik Bulanan", size: "4x1", desc: "Pengeluaran vs pemasukan bulan ini (plus delta) dengan maskot kucing pensil di kanan." },
  { id: "actions-4x1", title: "Entri Cepat", size: "4x1", desc: "Bar 5 shortcut squircle mirip pill header: Buku Besar, Berulang, Kategori, Reimburse, Bookmark." },
  { id: "bar-4x1", title: "Graf Batang", size: "4x1", desc: "Intensitas jajan harian bulan ini sebagai batang vertikal berwarna aksen tema." },
  { id: "curve-4x1", title: "Graf Kurva", size: "4x1", desc: "Sparkline mulus kumulatif pemasukan vs pengeluaran sepanjang bulan + garis threshold putus-putus." },
  { id: "pie-4x2", title: "Graf Pie", size: "4x2", desc: "Donut kategori di kiri; total pengeluaran bulanan dan persentase kategori teratas di kanan." },
  { id: "assets-4x2", title: "Aset", size: "4x2", desc: "Donut distribusi saldo antar dompet dengan total saldo dan rincian persen per akun." },
  { id: "cal-week-4x1", title: "Kalender Mingguan", size: "4x1", desc: "Strip 7 hari (Min–Sab) dengan nomor hari dan nominal jajan di bawahnya; hari puncak disorot." },
  { id: "cal-year", title: "Kalender Tahunan & Bulanan", size: "4x1 / 4x3", desc: "Grid 12 bulan dengan total per bulan (bulan tertinggi disorot stroberi) + matriks bulan penuh ber-heatmap pastel." },
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const DONUT_COLORS = ["#B8A7E0", "#F4A6CD", "#98D8AA", "#F8B896", "#99C8F5", "#E8AA42", "#CBB094", "#EA7B7B"];

const num = (v: number) => Math.round(v).toLocaleString("id-ID");

function expenseByCategory(tx: Transaction[], monthPrefix: string) {
  const map = new Map<string, number>();
  for (const t of tx) {
    if (t.type !== "expense" || !t.date.startsWith(monthPrefix)) continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function Donut({ segments, size = 96 }: { segments: { value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 40;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="shrink-0">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--inset)" strokeWidth="16" />
      {segments.map((seg, i) => {
        const len = (seg.value / total) * circ;
        const node = (
          <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={seg.color} strokeWidth="16" strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-offset} transform="rotate(-90 50 50)" />
        );
        offset += len;
        return node;
      })}
    </svg>
  );
}

export function WidgetPreviewCard({ variant, data }: { variant: WidgetVariant; data: WidgetData }) {
  const { transactions, wallets, budgets, mask } = data;
  const now = new Date();
  const todayIso = toISODate(now);
  const monthPrefix = todayIso.slice(0, 7);
  const yearPrefix = todayIso.slice(0, 4);

  const monthTx = transactions.filter((t) => t.date.startsWith(monthPrefix));
  const monthExpense = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const monthIncome = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const catRows = expenseByCategory(transactions, monthPrefix);
  const topCat = catRows[0];

  const shell = "rounded-2xl border border-line bg-card p-3";

  if (variant.id === "quick-1x1") {
    return (
      <div className="grid aspect-square w-28 place-items-center rounded-2xl bg-[linear-gradient(140deg,#3A3344,#2E2A36)] shadow-float">
        <span className="rounded-full bg-[var(--tertiary)] px-3 py-1.5 font-manrope text-[11px] font-bold text-on-primary shadow-[0_0_18px_rgba(var(--shadow-rgb),0.6)]">
          {topCat ? `${topCat[0]}` : "Makanan"}
        </span>
      </div>
    );
  }

  if (variant.id === "quick-2x1") {
    const count = catRows.length ? transactions.filter((t) => t.type === "expense" && t.category === topCat[0]).length : 0;
    return (
      <div className="flex w-full items-center gap-3 rounded-full bg-[linear-gradient(120deg,var(--primary),var(--tertiary))] px-4 py-3 text-on-primary">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/25 text-lg">{topCat ? "🍔" : "🍔"}</span>
        <span className="min-w-0 flex-1 truncate font-manrope text-sm font-bold">{topCat ? topCat[0] : "Makanan & Jajan"}</span>
        <span className="tnum font-manrope text-xs font-bold">{count} tx · {formatRupiah(topCat ? topCat[1] : 0, mask)}</span>
      </div>
    );
  }

  if (variant.id === "budget-4x1") {
    const limit = budgets.reduce((s, b) => s + b.limitAmount, 0);
    const spent = budgets.reduce((s, b) => s + b.spentAmount, 0);
    const pct = limit ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
    return (
      <div className={`${shell} flex items-center gap-3`}>
        <span className="text-2xl">💸</span>
        <div className="min-w-0 flex-1">
          <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Total Budget</p>
          <p className="tnum font-outfit text-lg font-semibold">{formatRupiah(limit, mask)}</p>
        </div>
        <span className="tnum rounded-full bg-income px-2 py-1 font-manrope text-xs font-bold text-white">{pct}%</span>
        <span className="tnum font-manrope text-xs text-muted">sisa {formatRupiah(Math.max(0, limit - spent), mask)}</span>
      </div>
    );
  }

  if (variant.id === "stats-4x1") {
    const delta = monthIncome - monthExpense;
    return (
      <div className={`${shell} flex items-center gap-3`}>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="tnum font-manrope text-xs"><span className="text-muted">Keluar:</span> <b className="text-expense">{formatRupiah(monthExpense, mask)}</b> ({delta >= 0 ? "+" : ""}{num(delta)})</p>
          <p className="tnum font-manrope text-xs"><span className="text-muted">Masuk:</span> <b className="text-income">{formatRupiah(monthIncome, mask)}</b></p>
        </div>
        <KawaiiMascot size={56} />
      </div>
    );
  }

  if (variant.id === "actions-4x1") {
    const items = [
      { icon: "📔", label: "Buku Besar" },
      { icon: "🗓️", label: "Berulang" },
      { icon: "🍔", label: "Kategori" },
      { icon: "💼", label: "Reimburse" },
      { icon: "🔖", label: "Bookmark" },
    ];
    return (
      <div className={`${shell} grid grid-cols-5 gap-2`}>
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-inset text-lg">{item.icon}</span>
            <span className="font-manrope text-[9px] font-bold text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant.id === "bar-4x1") {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daily = Array.from({ length: daysInMonth }, () => 0);
    for (const t of monthTx) if (t.type === "expense") daily[Number(t.date.slice(8)) - 1] += t.amount;
    const max = Math.max(1, ...daily);
    return (
      <div className={shell}>
        <svg viewBox={`0 0 ${daysInMonth * 8} 48`} className="h-16 w-full" preserveAspectRatio="none">
          {daily.map((v, i) => (
            <rect key={i} x={i * 8 + 1} y={48 - (v / max) * 44} width="6" height={Math.max(2, (v / max) * 44)} rx="2" fill={v ? "var(--secondary)" : "var(--inset)"} />
          ))}
        </svg>
      </div>
    );
  }

  if (variant.id === "curve-4x1") {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    let ci = 0;
    let ce = 0;
    const inc: number[] = [];
    const exp: number[] = [];
    for (let d = 1; d <= daysInMonth; d += 1) {
      const iso = `${monthPrefix}-${String(d).padStart(2, "0")}`;
      for (const t of transactions) {
        if (t.date !== iso) continue;
        if (t.type === "income") ci += t.amount;
        else if (t.type === "expense") ce += t.amount;
      }
      inc.push(ci);
      exp.push(ce);
    }
    const max = Math.max(1, ci, ce);
    const pt = (arr: number[]) => arr.map((v, i) => `${(i / (daysInMonth - 1)) * 300},${44 - (v / max) * 40}`).join(" ");
    return (
      <div className={shell}>
        <svg viewBox="0 0 300 48" className="h-16 w-full" preserveAspectRatio="none">
          <line x1="0" y1="24" x2="300" y2="24" stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 4" />
          <polyline points={pt(inc)} fill="none" stroke="var(--income)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={pt(exp)} fill="none" stroke="var(--expense)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (variant.id === "pie-4x2") {
    const segments = catRows.slice(0, 6).map(([label, value], i) => ({ label, value, color: DONUT_COLORS[i % DONUT_COLORS.length] }));
    return (
      <div className={`${shell} flex items-center gap-4`}>
        <Donut segments={segments} size={104} />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="tnum font-outfit text-sm font-semibold">{formatRupiah(monthExpense, mask)}</p>
          {segments.slice(0, 4).map((seg) => (
            <p key={seg.label} className="flex items-center gap-1.5 truncate font-manrope text-[11px]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: seg.color }} />
              <span className="min-w-0 flex-1 truncate">{seg.label}</span>
              <span className="tnum font-bold">{Math.round((seg.value / (monthExpense || 1)) * 100)}%</span>
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (variant.id === "assets-4x2") {
    const total = wallets.reduce((s, w) => s + w.balance, 0);
    const segments = wallets.map((w, i) => ({ label: w.name, value: w.balance, color: DONUT_COLORS[i % DONUT_COLORS.length] }));
    return (
      <div className={`${shell} flex items-center gap-4`}>
        <Donut segments={segments} size={104} />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="tnum font-outfit text-sm font-semibold">{formatRupiah(total, mask)}</p>
          {segments.map((seg) => (
            <p key={seg.label} className="flex items-center gap-1.5 truncate font-manrope text-[11px]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: seg.color }} />
              <span className="min-w-0 flex-1 truncate">{seg.label}</span>
              <span className="tnum font-bold">{Math.round((seg.value / (total || 1)) * 100)}%</span>
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (variant.id === "cal-week-4x1") {
    const wStart = startOfWeek(now);
    const days = Array.from({ length: 7 }, (_, i) => toISODate(addDays(wStart, i)));
    const spend = days.map((iso) => transactions.filter((t) => t.date === iso && t.type === "expense").reduce((s, t) => s + t.amount, 0));
    const peak = Math.max(...spend);
    return (
      <div className={`${shell} grid grid-cols-7 gap-1.5`}>
        {days.map((iso, i) => {
          const isPeak = spend[i] === peak && peak > 0;
          return (
            <div key={iso} className={`flex flex-col items-center gap-0.5 rounded-xl py-2 ${isPeak ? "bg-secondary text-white" : "bg-inset"}`}>
              <span className="font-manrope text-[9px] font-bold">{WEEKDAY_LABELS[i]}</span>
              <span className="tnum text-xs font-bold">{Number(iso.slice(8))}</span>
              <span className="tnum font-manrope text-[9px]">{num(spend[i])}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // cal-year: grid 12 bulan + matriks bulan penuh
  const monthTotals = MONTH_LABELS.map((_, m) =>
    transactions.filter((t) => t.type === "expense" && t.date.startsWith(`${yearPrefix}-${String(m + 1).padStart(2, "0")}`)).reduce((s, t) => s + t.amount, 0),
  );
  const yearPeak = Math.max(...monthTotals);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const cells: (string | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${monthPrefix}-${String(i + 1).padStart(2, "0")}`),
  ];
  const daySpend = (iso: string) => transactions.filter((t) => t.date === iso && t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const monthPeakDay = Math.max(1, ...cells.filter((c): c is string => !!c).map(daySpend));

  return (
    <div className="space-y-3">
      <div className={`${shell} grid grid-cols-6 gap-1.5`}>
        {MONTH_LABELS.map((label, m) => {
          const isPeak = monthTotals[m] === yearPeak && yearPeak > 0;
          return (
            <div key={label} className={`flex flex-col items-center rounded-lg py-1.5 ${isPeak ? "bg-secondary text-white" : "bg-inset"}`}>
              <span className="font-manrope text-[9px] font-bold">{label}</span>
              <span className="tnum font-manrope text-[9px]">{num(monthTotals[m])}</span>
            </div>
          );
        })}
      </div>
      <div className={`${shell} grid grid-cols-7 gap-1`}>
        {WEEKDAY_LABELS.map((w) => (
          <span key={w} className="text-center font-manrope text-[9px] font-bold text-muted">{w}</span>
        ))}
        {cells.map((iso, i) =>
          iso === null ? (
            <span key={`e${i}`} />
          ) : (
            <div
              key={iso}
              className={`flex flex-col items-center rounded-md py-1 ${iso === todayIso ? "ring-2 ring-secondary" : ""}`}
              style={{ background: `color-mix(in srgb, var(--secondary) ${Math.round((daySpend(iso) / monthPeakDay) * 45)}%, transparent)` }}
            >
              <span className="tnum text-[10px] font-bold">{Number(iso.slice(8))}</span>
              <span className="tnum font-manrope text-[8px]">{num(daySpend(iso))}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
