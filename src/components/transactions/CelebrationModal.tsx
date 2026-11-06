"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { Overlay, Pressable } from "@/components/ui/SquircleCard";
import { formatDateTime, formatRupiah } from "@/lib/formatters";
import type { Goal, Transaction, Wallet } from "@/types/finance";

const CONFETTI = ["#B8A7E0", "#F4A6CD", "#98D8AA", "#F8B896", "#99C8F5", "#E8AA42", "#FFFFFF"];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        id: index,
        left: `${(index * 17) % 100}%`,
        delay: (index % 8) * 0.05,
        color: CONFETTI[index % CONFETTI.length],
        rotate: (index * 24) % 180,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-0 h-2.5 w-1.5 rounded-full"
          style={{ left: piece.left, background: piece.color }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: 280, opacity: [0, 1, 1, 0], rotate: piece.rotate }}
          transition={{ duration: 1.5, delay: piece.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function CelebrationModal({
  tx,
  wallets,
  goals,
  allocated = 0,
  onAnother,
  onHome,
  onAllocate,
}: {
  tx: Transaction | null;
  wallets: Wallet[];
  goals: Goal[];
  allocated?: number;
  onAnother: () => void;
  onHome: () => void;
  onAllocate?: () => void;
}) {
  const wallet = wallets.find((item) => item.id === tx?.walletId);
  const destWallet = wallets.find((item) => item.id === tx?.toWalletId);
  const destGoal = goals.find((item) => item.id === tx?.toGoalId);
  return (
    <AnimatePresence>
      {tx && (
        <Overlay onClose={onHome} z="z-[75]">
          <div className="relative overflow-hidden">
            <Confetti />
            {tx.type === "expense" && (
              <div className="relative text-center">
                <p className="text-4xl">🎉</p>
                <h3 className="mt-2 font-outfit text-2xl font-semibold">Hore, Berhasil Dicatat! 🎉</h3>
                <p className="mt-2 font-manrope text-sm leading-6 text-muted">
                  Pengeluaran kamu udah rapi masuk ke pembukuan. Tetap hemat dan semangat ya bestie! 💖
                </p>
              </div>
            )}
            {tx.type === "income" && (
              <div className="relative text-center">
                <span className="chip-income inline-flex rounded-full px-3 py-1 font-manrope text-[10px] font-bold tracking-wide">
                  REZEKI MASUK 💰 • CUAN TERVERIFIKASI ✨
                </span>
                <h3 className="mt-3 font-outfit text-2xl font-semibold">Alhamdulillah, Cuan Masuk! 💸✨</h3>
                <p className="font-outfit text-lg font-semibold text-secondary">Cuan Berhasil Mendarat! 🥂</p>
                <p className="mt-2 font-manrope text-xs text-muted">{tx.invoiceCode}</p>
              </div>
            )}
            {tx.type === "transfer" && (
              <div className="relative text-center">
                <p className="text-4xl">✈️</p>
                <h3 className="mt-2 font-outfit text-2xl font-semibold">Transfer Berhasil! ✈️</h3>
                <p className="mt-2 font-manrope text-sm text-muted">Dana sudah pindah dan saldo kedua sisi ikut diperbarui.</p>
              </div>
            )}
            <div className="relative mt-4 space-y-2 rounded-lg bg-inset p-4 text-left font-manrope text-sm">
              <Row label="Nominal" value={formatRupiah(tx.amount)} />
              <Row label="Kategori" value={`${tx.categoryIcon} ${tx.category}`} />
              <Row label="Dompet" value={wallet?.name ?? "-"} />
              <Row label="Waktu" value={formatDateTime(tx.date, tx.time)} />
              {tx.note && <Row label="Catatan" value={tx.note} />}
              {wallet && <Row label="Saldo sumber" value={formatRupiah(wallet.balance)} />}
              {destWallet && <Row label={`Saldo ${destWallet.name}`} value={formatRupiah(destWallet.balance)} />}
              {destGoal && <Row label={destGoal.title} value={formatRupiah(destGoal.currentAmount)} />}
              {tx.contactName && <Row label="Bestie" value={tx.contactName} />}
              {allocated > 0 && <Row label="Auto-alokasi 10%" value={formatRupiah(allocated)} />}
            </div>
            {tx.type === "income" && allocated <= 0 && onAllocate && (
              <div className="relative mt-3 rounded-lg border border-line bg-card p-3 text-left">
                <p className="font-manrope text-sm font-semibold">Tips Sat-Set: Mau langsung alokasi 10% ke Celengan Impian?</p>
                <Pressable className="btn-ghost mt-2 h-10 w-full text-sm" onClick={onAllocate}>
                  Alokasi 10% ke Jepang 🌸
                </Pressable>
              </div>
            )}
            <div className="relative mt-4 grid gap-2">
              {tx.type === "income" && (
                <Pressable
                  className="btn-ghost h-11 text-sm"
                  onClick={async () => {
                    const text = `${tx.invoiceCode}\n${tx.category} ${formatRupiah(tx.amount)}\n${formatDateTime(tx.date, tx.time)}\n${tx.note}`;
                    if (navigator.share) {
                      await navigator.share({ title: "Bukti Cuan MochiMoy", text }).catch(() => undefined);
                      return;
                    }
                    await navigator.clipboard.writeText(text);
                  }}
                >
                  Bagikan Bukti Struk Cantik 📤
                </Pressable>
              )}
              <Pressable className="btn-primary h-11" onClick={onAnother}>
                Catat Transaksi Lain ✍️
              </Pressable>
              <Pressable className="btn-ghost h-11" onClick={onHome}>
                Kembali ke Beranda 🏠
              </Pressable>
            </div>
          </div>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className="tnum text-right font-semibold">{value}</span>
    </div>
  );
}
