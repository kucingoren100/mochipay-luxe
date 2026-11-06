"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { KawaiiSelect } from "@/components/ui/KawaiiSelect";
import { KawaiiSwitch } from "@/components/ui/KawaiiSwitch";
import { Overlay, Pressable } from "@/components/ui/SquircleCard";
import { evaluateExpression, SmartKeypad } from "@/components/transactions/SmartKeypad";
import { createTransaction } from "@/lib/db";
import { useGoals, useWallets } from "@/hooks/useLocalDb";
import { clampWords, compressImage, formatRupiah, nowTime, todayISO, wordCount } from "@/lib/formatters";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TAGS } from "@/lib/seed-data";
import type { Book, Transaction, TxType } from "@/types/finance";

export interface SavedPayload {
  tx: Transaction;
  allocated?: number;
  keepOpen: boolean;
}

const BOOKS: Book[] = ["Pribadi", "Bisnis"];

export function CatatTransaksiSheet({
  open,
  initialTab,
  initialGoalId,
  onClose,
  onSaved,
}: {
  open: boolean;
  initialTab: TxType;
  initialGoalId?: string;
  onClose: () => void;
  onSaved: (payload: SavedPayload) => void;
}) {
  const wallets = useWallets();
  const goals = useGoals();
  const [tab, setTab] = useState<TxType>(initialTab);
  const [expr, setExpr] = useState("35000");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].name);
  const [icon, setIcon] = useState(EXPENSE_CATEGORIES[0].icon);
  const [walletId, setWalletId] = useState("wal_bca");
  const [destination, setDestination] = useState("wallet:wal_mochi");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState(nowTime());
  const [book, setBook] = useState<Book>("Pribadi");
  const [tag, setTag] = useState<string>("Harian");
  const [receipt, setReceipt] = useState("");
  const [multi, setMulti] = useState(false);
  const [autoAllocate, setAutoAllocate] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTab(initialTab);
    setExpr(initialTab === "income" ? "100000" : "35000");
    setDate(todayISO());
    setTime(nowTime());
    setNote("");
    setReceipt("");
    setError("");
    const firstWallet = wallets[0]?.id ?? "wal_bca";
    setWalletId(firstWallet);
    if (initialGoalId) {
      setDestination(`goal:${initialGoalId}`);
      setTab("transfer");
    } else {
      const other = wallets.find((wallet) => wallet.id !== firstWallet);
      setDestination(other ? `wallet:${other.id}` : `goal:${goals[0]?.id ?? "goal_japan"}`);
    }
    const list = (initialGoalId ? "transfer" : initialTab) === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setCategory(list[0].name);
    setIcon(list[0].icon);
    // Form opens once per session. Live wallet updates must not wipe an in-progress entry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialTab, initialGoalId]);

  const categories = tab === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const amount = useMemo(() => evaluateExpression(expr), [expr]);
  const activeWallet = wallets.find((wallet) => wallet.id === walletId);

  const onKey = (key: string) => {
    if (key === "⌫") {
      setExpr((current) => current.slice(0, -1));
      return;
    }
    if (key === "=") {
      setExpr(String(evaluateExpression(expr)));
      return;
    }
    if ("+-×÷".includes(key)) {
      setExpr((current) => {
        if (!current) return current;
        const last = current[current.length - 1];
        if ("+-×÷".includes(last)) return current.slice(0, -1) + key;
        return current + key;
      });
      return;
    }
    setExpr((current) => (current + key).replace(/^0+(?=\d)/, "").slice(0, 28));
  };

  const save = async () => {
    setError("");
    if (amount <= 0) {
      setError("Isi nominal dulu ya bestie");
      return;
    }
    if (tab !== "transfer" && !category) {
      setError("Pilih kategori dulu");
      return;
    }
    setBusy(true);
    try {
      const [kind, destId] = destination.split(":");
      const base = {
        amount,
        walletId,
        date,
        time,
        book,
        tag,
        note,
        receiptImageDataUrl: receipt || undefined,
        adminFee: 0,
      };
      let record: Transaction;
      if (tab === "expense") {
        record = await createTransaction({ ...base, type: "expense", category, categoryIcon: icon });
      } else if (tab === "income") {
        record = await createTransaction({ ...base, type: "income", category, categoryIcon: icon });
      } else {
        record = await createTransaction({
          ...base,
          type: "transfer",
          category: kind === "goal" ? "Nabung Celengan" : "Mutasi Antar Dompet",
          categoryIcon: kind === "goal" ? "🐷" : "🔁",
          toWalletId: kind === "wallet" ? destId : undefined,
          toGoalId: kind === "goal" ? destId : undefined,
        });
      }
      let allocated = 0;
      if (tab === "income" && autoAllocate) {
        const share = Math.round(amount * 0.1);
        const japan = goals.find((goal) => goal.id === "goal_japan") ?? goals[0];
        if (share > 0 && japan) {
          await createTransaction({
            type: "transfer",
            amount: share,
            category: "Nabung Celengan",
            categoryIcon: "🌸",
            walletId,
            toGoalId: japan.id,
            date,
            time,
            book,
            tag: "Harian",
            note: "Auto-alokasi 10% dari cuan masuk",
            adminFee: 0,
          });
          allocated = share;
        }
      }
      if (multi) {
        setExpr("");
        setNote("");
        setReceipt("");
      }
      onSaved({ tx: record, allocated, keepOpen: multi });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Overlay onClose={onClose} wide z="z-[60]">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="font-manrope text-[11px] font-bold uppercase tracking-wider text-muted">Catat Transaksi Sat-Set</p>
              <h2 className="font-outfit text-2xl font-semibold">Buku kas gemes ✨</h2>
            </div>
            <button type="button" aria-label="Tutup" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-inset">
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-full bg-inset p-1">
            {([
              ["expense", "Pengeluaran"],
              ["income", "Pemasukan"],
              ["transfer", "Transfer"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setTab(value);
                  if (value !== "transfer") {
                    const list = value === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
                    setCategory(list[0].name);
                    setIcon(list[0].icon);
                  }
                }}
                className={`h-10 rounded-full font-manrope text-sm font-bold ${tab === value ? "bg-card text-secondary shadow-cloud" : "text-muted"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-inset px-3 py-2">
            <span className="font-manrope text-sm font-semibold text-secondary">Multi-record aktif</span>
            <KawaiiSwitch checked={multi} onChange={setMulti} label="Multi-record aktif" />
          </div>
          {tab !== "transfer" ? (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {categories.map((item) => {
                const active = category === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setCategory(item.name);
                      setIcon(item.icon);
                    }}
                    className={`rounded-lg border px-2 py-2 text-center ${active ? "border-secondary bg-inset" : "border-transparent bg-card"}`}
                  >
                    <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-[var(--icon-badge-bg)] text-lg">{item.icon}</span>
                    <span className="mt-1 block font-manrope text-[11px] font-semibold leading-4">{item.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <label className="block font-manrope text-sm font-semibold">
                Dari Akun (Sumber)
                <KawaiiSelect
                  className="mt-1"
                  ariaLabel="Dari akun sumber"
                  value={walletId}
                  onChange={setWalletId}
                  options={wallets.map((wallet) => ({ value: wallet.id, label: `${wallet.name} · ${formatRupiah(wallet.balance)}`, icon: wallet.icon }))}
                />
              </label>
              <p className="text-center font-outfit text-sm font-semibold text-secondary">⬇️ Pindah Dana Ke (Sat-Set ✨)</p>
              <label className="block font-manrope text-sm font-semibold">
                Ke Akun / Celengan Tujuan
                <KawaiiSelect
                  className="mt-1"
                  ariaLabel="Ke akun atau celengan tujuan"
                  value={destination}
                  onChange={setDestination}
                  options={[
                    ...wallets
                      .filter((wallet) => wallet.id !== walletId)
                      .map((wallet) => ({ value: `wallet:${wallet.id}`, label: wallet.name, icon: wallet.icon, group: "Dompet" })),
                    ...goals.map((goal) => ({ value: `goal:${goal.id}`, label: goal.title, icon: goal.icon, group: "Celengan Impian" })),
                  ]}
                />
              </label>
              <p className="rounded-full bg-inset px-3 py-2 text-center font-manrope text-xs font-semibold text-secondary">
                Bebas Biaya Admin (Pencatatan Internal) Rp 0
              </p>
            </div>
          )}
          {tab === "income" && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-inset px-3 py-2">
              <span className="font-manrope text-sm font-semibold text-secondary">Auto-alokasi aktif</span>
              <KawaiiSwitch checked={autoAllocate} onChange={setAutoAllocate} label="Auto-alokasi aktif" />
            </div>
          )}
          <div className="mt-4 grid gap-2">
            <input
              className="inset-field h-12 px-3"
              placeholder="Catatan"
              value={note}
              onChange={(event) => setNote(clampWords(event.target.value))}
            />
            <p className="text-right font-manrope text-[11px] text-muted">{wordCount(note)}/120 kata</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded-full bg-inset px-3 py-1 font-manrope text-xs font-bold" onClick={() => { setDate(todayISO()); setTime(nowTime()); }}>
                Hari Ini
              </button>
              <input type="date" className="rounded-full bg-inset px-3 py-1 text-xs" value={date} onChange={(event) => setDate(event.target.value)} />
              <input type="time" className="rounded-full bg-inset px-3 py-1 text-xs" value={time} onChange={(event) => setTime(event.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              {BOOKS.map((item) => (
                <button key={item} type="button" onClick={() => setBook(item)} className={`rounded-full px-3 py-1 font-manrope text-xs font-bold ${book === item ? "bg-primary text-on-primary" : "bg-inset"}`}>
                  Buku: {item}
                </button>
              ))}
              <span className="rounded-full bg-inset px-3 py-1 font-manrope text-xs font-bold">Dompet: {activeWallet?.name ?? "Pilih"}</span>
            </div>
            {tab !== "transfer" && (
              <KawaiiSelect
                ariaLabel="Dompet untuk catatan ini"
                value={walletId}
                onChange={setWalletId}
                options={wallets.map((wallet) => ({ value: wallet.id, label: `${wallet.name} · ${formatRupiah(wallet.balance)}`, icon: wallet.icon }))}
              />
            )}
            <div className="flex flex-wrap gap-2">
              {TAGS.map((item) => (
                <button key={item} type="button" onClick={() => setTag(item)} className={`rounded-full px-3 py-1 font-manrope text-xs font-bold ${tag === item ? "bg-tertiary text-on-primary" : "bg-inset"}`}>
                  Tag: {item}
                </button>
              ))}
            </div>
            <label className="flex cursor-pointer items-center justify-between rounded-lg bg-inset px-3 py-3 font-manrope text-sm font-semibold">
              <span>Koleksi Struk / Foto Bukti</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setReceipt(await compressImage(file));
                }}
              />
              <span className="text-secondary">{receipt ? "Struk siap ✨" : "Unggah"}</span>
            </label>
            {receipt && <img src={receipt} alt="Pratinjau struk" className="h-28 w-full rounded-lg object-cover" />}
          </div>
          {error && <p className="mt-3 rounded-lg bg-inset px-3 py-2 font-manrope text-sm text-expense">{error}</p>}
          <div className="mt-4 rounded-xl bg-inset px-4 py-3 text-center">
            <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Nominal</p>
            <p className="tnum text-4xl font-bold text-foreground">{formatRupiah(amount)}</p>
            <p className="mt-1 font-outfit text-sm text-secondary">{expr || "0"}</p>
          </div>
          <div className="mt-3">
            <SmartKeypad onKey={onKey} onSave={() => void save()} disabled={busy} />
          </div>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
