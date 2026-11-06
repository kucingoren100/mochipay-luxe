"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { DeleteConfirmModal } from "@/components/transactions/DeleteConfirmModal";
import { KawaiiSelect } from "@/components/ui/KawaiiSelect";
import { evaluateExpression, SmartKeypad } from "@/components/transactions/SmartKeypad";
import { Overlay, Pressable } from "@/components/ui/SquircleCard";
import { deleteTransaction, updateTransaction } from "@/lib/db";
import { useWallets } from "@/hooks/useLocalDb";
import { clampWords, compressImage, formatDateTime, formatRupiah, wordCount } from "@/lib/formatters";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/seed-data";
import type { Transaction } from "@/types/finance";

export function LedgerRow({
  tx,
  walletName,
  mask,
  onClick,
}: {
  tx: Transaction;
  walletName: string;
  mask: boolean;
  onClick: () => void;
}) {
  const tone = tx.type === "income" ? "text-income" : tx.type === "expense" ? "text-expense" : "text-secondary";
  const sign = tx.type === "income" ? "+" : tx.type === "expense" ? "-" : "↔";
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-lg bg-inset/70 px-3 py-3 text-left">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-card text-xl">{tx.categoryIcon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-manrope text-sm font-bold">{tx.category}</span>
        <span className="block truncate font-manrope text-xs text-muted">
          {walletName} · {formatDateTime(tx.date, tx.time)}
        </span>
      </span>
      <span className={`tnum shrink-0 text-sm font-bold ${tone}`}>
        {sign} {formatRupiah(tx.amount, mask)}
      </span>
    </button>
  );
}

export function TransactionDetailSheet({
  tx,
  onClose,
  onSaved,
}: {
  tx: Transaction | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const wallets = useWallets();
  const [expr, setExpr] = useState("");
  const [category, setCategory] = useState("");
  const [icon, setIcon] = useState("");
  const [walletId, setWalletId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [receipt, setReceipt] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tx) return;
    setExpr(String(tx.amount));
    setCategory(tx.category);
    setIcon(tx.categoryIcon);
    setWalletId(tx.walletId);
    setDate(tx.date);
    setTime(tx.time);
    setNote(tx.note);
    setReceipt(tx.receiptImageDataUrl ?? "");
    setError("");
    setConfirm(false);
  }, [tx]);

  const amount = useMemo(() => evaluateExpression(expr), [expr]);
  const options = tx?.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const wallet = wallets.find((item) => item.id === walletId);

  const onKey = (key: string) => {
    if (key === "⌫") return setExpr((current) => current.slice(0, -1));
    if (key === "=") return setExpr(String(evaluateExpression(expr)));
    if ("+-×÷".includes(key)) {
      setExpr((current) => {
        if (!current) return current;
        const last = current[current.length - 1];
        return "+-×÷".includes(last) ? current.slice(0, -1) + key : current + key;
      });
      return;
    }
    setExpr((current) => (current + key).slice(0, 28));
  };

  const save = async () => {
    if (!tx) return;
    setBusy(true);
    setError("");
    try {
      await updateTransaction(tx.id, {
        amount,
        category,
        categoryIcon: icon,
        walletId,
        date,
        time,
        note,
        receiptImageDataUrl: receipt || undefined,
      });
      onSaved(`Perubahan Berhasil Disimpan! ✨ Data transaksi ${category} (${formatRupiah(amount)}) sudah diperbarui di dompet ${wallet?.name ?? "dompet"}.`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!tx) return;
    setBusy(true);
    try {
      await deleteTransaction(tx.id);
      setConfirm(false);
      onSaved("Catatan dihapus dan saldo dompet sudah dikembaliin 💖");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {tx && (
          <Overlay onClose={onClose} wide z="z-[65]">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="font-manrope text-[11px] font-bold uppercase tracking-wider text-muted">Detail & Edit Transaksi Manual</p>
                <h2 className="font-outfit text-2xl font-semibold">{tx.categoryIcon} {tx.category}</h2>
                <p className="font-manrope text-xs text-muted">{tx.invoiceCode}</p>
              </div>
              <button type="button" aria-label="Tutup detail" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-inset">✕</button>
            </div>
            <p className="tnum text-center text-4xl font-bold">{formatRupiah(amount)}</p>
            {tx.type !== "transfer" && (
              <div className="mt-3 grid max-h-40 grid-cols-3 gap-2 overflow-y-auto">
                {options.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setCategory(item.name);
                      setIcon(item.icon);
                    }}
                    className={`rounded-lg px-2 py-2 text-xs font-semibold ${category === item.name ? "bg-inset text-secondary" : "bg-card"}`}
                  >
                    {item.icon} {item.name}
                  </button>
                ))}
              </div>
            )}
            <div className="mt-3 grid gap-2">
              <KawaiiSelect
                ariaLabel="Dompet catatan ini"
                value={walletId}
                onChange={setWalletId}
                options={wallets.map((item) => ({ value: item.id, label: item.name, icon: item.icon }))}
              />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="inset-field h-12 px-3" value={date} onChange={(event) => setDate(event.target.value)} />
                <input type="time" className="inset-field h-12 px-3" value={time} onChange={(event) => setTime(event.target.value)} />
              </div>
              <textarea
                className="inset-field min-h-24 px-3 py-3"
                value={note}
                onChange={(event) => setNote(clampWords(event.target.value))}
                placeholder="Catatan (maks 120 kata)"
              />
              <p className="text-right font-manrope text-[11px] text-muted">{wordCount(note)}/120 kata</p>
              <div className="rounded-lg bg-inset p-3">
                <div className="flex items-center justify-between">
                  <p className="font-manrope text-sm font-semibold">{receipt ? "Struk Kasir.jpg" : "Belum ada foto struk"}</p>
                  <label className="cursor-pointer font-manrope text-xs font-bold text-secondary">
                    {receipt ? "Ganti" : "Lampirkan"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) setReceipt(await compressImage(file));
                      }}
                    />
                  </label>
                </div>
                {receipt && (
                  <>
                    <img src={receipt} alt="Struk transaksi" className="mt-2 max-h-48 w-full rounded-lg object-contain" />
                    <button type="button" className="mt-2 font-manrope text-xs font-bold text-expense" onClick={() => setReceipt("")}>
                      Hapus foto
                    </button>
                  </>
                )}
              </div>
            </div>
            {error && <p className="mt-3 font-manrope text-sm text-expense">{error}</p>}
            <div className="mt-4">
              <SmartKeypad onKey={onKey} onSave={() => void save()} disabled={busy} />
            </div>
            <Pressable className="btn-danger mt-3 h-12 w-full" onClick={() => setConfirm(true)}>
              Hapus Transaksi Ini 🗑️
            </Pressable>
          </Overlay>
        )}
      </AnimatePresence>
      <DeleteConfirmModal open={confirm} busy={busy} onCancel={() => setConfirm(false)} onConfirm={() => void remove()} />
    </>
  );
}
