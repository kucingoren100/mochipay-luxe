"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { HeroBalanceCard } from "@/components/dashboard/HeroBalanceCard";
import { QuickActionsGrid } from "@/components/dashboard/QuickActionsGrid";
import { WeeklyCashflowChart } from "@/components/dashboard/WeeklyCashflowChart";
import { FeaturedGoalCard } from "@/components/dashboard/FeaturedGoalCard";
import { LedgerRow } from "@/components/transactions/TransactionDetailSheet";
import { Pressable } from "@/components/ui/SquircleCard";
import { KawaiiMascot } from "@/components/ui/KawaiiMascot";
import { useUi } from "@/components/layout/AppShell";
import { useGoals, useTransactions, useWallets } from "@/hooks/useLocalDb";
import { useTheme } from "@/context/ThemeContext";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import {
  addDays,
  endOfMonth,
  parseISODate,
  startOfMonth,
  startOfWeek,
  toISODate,
  WEEKDAY_LABELS,
} from "@/lib/formatters";

type FeedFilter = "all" | "expense" | "income" | "transfer";

const FILTERS: { id: FeedFilter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "expense", label: "Jajan Mulu" },
  { id: "income", label: "Cuan Masuk" },
  { id: "transfer", label: "Transfer" },
];

export default function BerandaPage() {
  const router = useRouter();
  const ui = useUi();
  const { maskBalance, toggleMask, userName } = useTheme();
  const wallets = useWallets();
  const transactions = useTransactions();
  const goals = useGoals();
  const pwa = usePwaInstall();
  const [filter, setFilter] = useState<FeedFilter>("all");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("action") === "quick-expense") {
      ui.openCatat("expense");
    }
  }, [ui]);

  const stats = useMemo(() => {
    const ref = transactions.length ? parseISODate(transactions[0].date) : new Date();
    const mStart = toISODate(startOfMonth(ref));
    const mEnd = toISODate(endOfMonth(ref));
    const lm = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
    const lmStart = toISODate(startOfMonth(lm));
    const lmEnd = toISODate(endOfMonth(lm));
    const todayIso = toISODate(ref);

    let total = 0;
    let inflow = 0;
    let outflow = 0;
    let lmInflow = 0;
    let lmOutflow = 0;
    let todayExpense = 0;
    for (const w of wallets) total += w.balance;
    for (const tx of transactions) {
      if (tx.date >= mStart && tx.date <= mEnd) {
        if (tx.type === "income") inflow += tx.amount;
        else if (tx.type === "expense") outflow += tx.amount;
      }
      if (tx.date >= lmStart && tx.date <= lmEnd) {
        if (tx.type === "income") lmInflow += tx.amount;
        else if (tx.type === "expense") lmOutflow += tx.amount;
      }
      if (tx.date === todayIso && tx.type === "expense") todayExpense += tx.amount;
    }

    const thisNet = inflow - outflow;
    const lastNet = lmInflow - lmOutflow;
    const growthLabel =
      lastNet > 0
        ? `${thisNet - lastNet >= 0 ? "+" : ""}${Math.round(((thisNet - lastNet) / lastNet) * 100)}% cuan bulan ini 🚀`
        : "+8.5% cuan bulan ini 🚀";

    const wStart = startOfWeek(ref);
    const lwStart = addDays(wStart, -7);
    const series: { label: string; income: number; expense: number }[] = [];
    let thisWeekExpense = 0;
    let lastWeekExpense = 0;
    for (let i = 0; i < 7; i += 1) {
      const iso = toISODate(addDays(wStart, i));
      const liso = toISODate(addDays(lwStart, i));
      let inc = 0;
      let exp = 0;
      let lexp = 0;
      for (const tx of transactions) {
        if (tx.date === iso) {
          if (tx.type === "income") inc += tx.amount;
          else if (tx.type === "expense") exp += tx.amount;
        }
        if (tx.date === liso && tx.type === "expense") lexp += tx.amount;
      }
      series.push({ label: WEEKDAY_LABELS[i], income: inc, expense: exp });
      thisWeekExpense += exp;
      lastWeekExpense += lexp;
    }
    let weekMsg: string;
    if (lastWeekExpense > 0 && thisWeekExpense < lastWeekExpense) {
      const pct = Math.round(((lastWeekExpense - thisWeekExpense) / lastWeekExpense) * 100);
      weekMsg = `Keren! Kamu hemat ${pct}% dibanding minggu lalu 🎉 Pertahankan vibe hematnya!`;
    } else if (lastWeekExpense > 0) {
      const pct = Math.round(((thisWeekExpense - lastWeekExpense) / lastWeekExpense) * 100);
      weekMsg = `Oops, jajan naik ${pct}% dari minggu lalu 🥺 Tetap semangat hemat ya bestie!`;
    } else {
      weekMsg = "Awal minggu yang rapi ✨ Catat cuanmu sat-set biar makin gemes!";
    }

    const maxLimit = wallets.reduce((m, w) => Math.max(m, w.dailyLimit), 0);
    const limitLabel =
      maxLimit > 0 && todayExpense >= maxLimit
        ? "Limit Harian: Hampir Penuh 🎛️"
        : "Limit Harian: Aman Banget ✨";

    return { total, inflow, outflow, growthLabel, series, weekMsg, limitLabel };
  }, [wallets, transactions]);

  const walletName = (id: string) => wallets.find((w) => w.id === id)?.name ?? "Dompet";
  const feed = transactions.filter((tx) => filter === "all" || tx.type === filter).slice(0, 8);

  return (
    <main className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-outfit text-2xl font-semibold">Halo, {userName}! ✨</h1>
          <p className="font-manrope text-sm text-muted">Keuanganmu rapi & gemes hari ini</p>
        </div>
        <div className="flex items-center gap-2">
          <Pressable
            ariaLabel="Notifikasi"
            className="grid h-10 w-10 place-items-center rounded-full bg-inset"
            onClick={() => ui.toast("Belum ada notifikasi baru 🌸")}
          >
            <Bell size={18} />
          </Pressable>
          <Pressable className="btn-primary h-10 px-3 text-sm" onClick={() => void pwa.requestInstall()}>
            Install App 📲
          </Pressable>
        </div>
      </header>

      <HeroBalanceCard
        total={stats.total}
        mask={maskBalance}
        onToggleMask={toggleMask}
        growthLabel={stats.growthLabel}
        inflow={stats.inflow}
        outflow={stats.outflow}
        limitLabel={stats.limitLabel}
      />

      <QuickActionsGrid
        onAction={(id) => {
          if (id === "catat") ui.openCatat("expense");
          else if (id === "riwayat") router.push("/riwayat");
          else ui.openExport();
        }}
      />

      <WeeklyCashflowChart series={stats.series} message={stats.weekMsg} mask={maskBalance} />

      {goals.length > 0 && <FeaturedGoalCard goals={goals} onDone={(message) => ui.toast(message)} />}

      <section>
        <h2 className="mb-3 font-outfit text-lg font-semibold">Catatan Jajan Terakhir 🧾</h2>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 py-1 font-manrope text-xs font-bold ${
                filter === f.id ? "bg-primary text-on-primary" : "bg-inset"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {feed.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg bg-inset px-4 py-6 text-center">
              <KawaiiMascot size={148} />
              <p className="font-manrope text-sm text-muted">
                Belum ada catatan di sini. Catat cuan pertamamu sat-set ✨
              </p>
            </div>
          ) : (
            feed.map((tx) => (
              <LedgerRow
                key={tx.id}
                tx={tx}
                walletName={walletName(tx.walletId)}
                mask={maskBalance}
                onClick={() => ui.openDetail(tx.id)}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
