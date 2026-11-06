"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { KawaiiSelect } from "@/components/ui/KawaiiSelect";
import { Overlay, Pressable } from "@/components/ui/SquircleCard";
import { createTransaction } from "@/lib/db";
import { useWallets } from "@/hooks/useLocalDb";
import { formatRupiah, nowTime, todayISO } from "@/lib/formatters";
import type { Goal } from "@/types/finance";

const ROTATE_MS = 5000;

export function FeaturedGoalCard({ goals, onDone }: { goals: Goal[]; onDone: (message: string) => void }) {
  const wallets = useWallets();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? "wal_bca");
  const [amount, setAmount] = useState("100000");
  const [error, setError] = useState("");

  const count = goals.length;
  const safeIndex = count ? index % count : 0;
  const goal = goals[safeIndex];

  useEffect(() => {
    if (open || count < 2) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % count), ROTATE_MS);
    return () => clearInterval(timer);
  }, [open, count]);

  if (!goal) return null;

  const ratio = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const remain = Math.max(0, goal.targetAmount - goal.currentAmount);
  const go = (dir: number) => setIndex((current) => (current + dir + count) % count);

  const save = async () => {
    setError("");
    const value = Math.round(Number(amount.replace(/\D/g, "")) || 0);
    if (value <= 0) {
      setError("Isi nominal nabung dulu");
      return;
    }
    try {
      await createTransaction({
        type: "transfer",
        amount: value,
        category: "Nabung Celengan",
        categoryIcon: goal.icon,
        walletId,
        toGoalId: goal.id,
        date: todayISO(),
        time: nowTime(),
        book: "Pribadi",
        tag: "Harian",
        note: `Nabung kilat untuk ${goal.title}`,
        adminFee: 0,
      });
      setOpen(false);
      onDone(`Nabung kilat ${formatRupiah(value)} masuk ke ${goal.title} ✨`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal nabung");
    }
  };

  return (
    <section className="cloud-card p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Highlight Celengan Impian ✨</p>
        {count > 1 && (
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Celengan sebelumnya" onClick={() => go(-1)} className="grid h-8 w-8 place-items-center rounded-full bg-inset text-muted">
              <ChevronLeft size={16} />
            </button>
            <button type="button" aria-label="Celengan berikutnya" onClick={() => go(1)} className="grid h-8 w-8 place-items-center rounded-full bg-inset text-muted">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="relative mt-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={goal.id}
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -48, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <h2 className="font-outfit text-xl font-semibold">{goal.icon} {goal.title}</h2>
            <p className="font-manrope text-sm text-muted">{goal.subtitle}</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-inset">
              <div className="h-full rounded-full bg-primary" style={{ width: `${ratio}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between font-manrope text-sm">
              <span className="tnum font-bold">{ratio}%</span>
              <span className="text-muted">sisa {formatRupiah(remain)} lagi!</span>
            </div>
            <p className="tnum mt-2 text-sm">
              {formatRupiah(goal.currentAmount)} / {formatRupiah(goal.targetAmount)}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <Pressable className="btn-primary mt-4 h-11 w-full" onClick={() => setOpen(true)}>
        + Nabung Kilat
      </Pressable>

      {count > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {goals.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Lihat celengan ${item.title}`}
              aria-current={i === safeIndex}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === safeIndex ? "w-6 bg-secondary" : "w-2 bg-inset"}`}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <Overlay onClose={() => setOpen(false)}>
            <h3 className="font-outfit text-xl font-semibold">Nabung Kilat {goal.icon}</h3>
            <p className="mt-1 font-manrope text-sm text-muted">Dana pindah dari dompet pilihan ke celengan ini.</p>
            <p className="mt-4 font-manrope text-sm font-semibold">Dari dompet</p>
            <KawaiiSelect
              className="mt-1"
              ariaLabel="Dari dompet"
              value={walletId}
              onChange={setWalletId}
              options={wallets.map((wallet) => ({ value: wallet.id, label: `${wallet.name} · ${formatRupiah(wallet.balance)}`, icon: wallet.icon }))}
            />
            <label className="mt-3 block font-manrope text-sm font-semibold">
              Nominal
              <input className="inset-field mt-1 h-12 w-full px-3" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^\d]/g, ""))} />
            </label>
            {error && <p className="mt-2 font-manrope text-sm text-expense">{error}</p>}
            <Pressable className="btn-primary mt-4 h-12 w-full" onClick={() => void save()}>
              Simpan ke Celengan
            </Pressable>
          </Overlay>
        )}
      </AnimatePresence>
    </section>
  );
}
