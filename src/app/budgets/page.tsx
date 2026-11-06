"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { KawaiiSelect } from "@/components/ui/KawaiiSelect";
import { KawaiiSwitch } from "@/components/ui/KawaiiSwitch";
import { Overlay, Pressable } from "@/components/ui/SquircleCard";
import { useUi } from "@/components/layout/AppShell";
import { useBudgets, useGoals, useTransactions, useWallets } from "@/hooks/useLocalDb";
import {
  addBudget,
  addGoal,
  createTransaction,
  deleteBudget,
  deleteGoal,
  scaleBudgetLimits,
  updateBudget,
  updateGoal,
} from "@/lib/db";
import { formatIdDate, formatPeriodLabel, formatRupiah, nowTime, parseISODate, todayISO, uid } from "@/lib/formatters";
import type { Budget, Goal } from "@/types/finance";

export default function BudgetsPage() {
  const ui = useUi();
  const budgets = useBudgets();
  const goals = useGoals();
  const wallets = useWallets();
  const transactions = useTransactions();

  const ref = useMemo(
    () => (transactions.length ? parseISODate(transactions[0].date) : new Date()),
    [transactions],
  );
  const periodLabel = formatPeriodLabel(ref);

  const totals = useMemo(() => {
    const limit = budgets.reduce((s, b) => s + b.limitAmount, 0);
    const spent = budgets.reduce((s, b) => s + b.spentAmount, 0);
    const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
    const sisa = Math.max(0, limit - spent);
    const daysElapsed = Math.max(1, ref.getDate());
    const dailyAvg = Math.round(spent / daysElapsed);
    return { limit, spent, pct, sisa, dailyAvg };
  }, [budgets, ref]);

  const [editLimitOpen, setEditLimitOpen] = useState(false);
  const [editLimitValue, setEditLimitValue] = useState("");
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [editCat, setEditCat] = useState<Budget | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatSubtitle, setEditCatSubtitle] = useState("");
  const [editCatIcon, setEditCatIcon] = useState("✨");
  const [editCatLimit, setEditCatLimit] = useState("");
  const [deleteCat, setDeleteCat] = useState<Budget | null>(null);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [eTitle, setETitle] = useState("");
  const [eSubtitle, setESubtitle] = useState("");
  const [eIcon, setEIcon] = useState("⭐");
  const [eTarget, setETarget] = useState("");
  const [eDate, setEDate] = useState("");
  const [eMonthly, setEMonthly] = useState("");
  const [deleteGoalTarget, setDeleteGoalTarget] = useState<Goal | null>(null);
  const [topupGoal, setTopupGoal] = useState<Goal | null>(null);
  const [topupWallet, setTopupWallet] = useState("");
  const [topupAmount, setTopupAmount] = useState("100000");
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [gTitle, setGTitle] = useState("");
  const [gSubtitle, setGSubtitle] = useState("");
  const [gIcon, setGIcon] = useState("⭐");
  const [gTarget, setGTarget] = useState("");
  const [gDate, setGDate] = useState("");
  const [gMonthly, setGMonthly] = useState("");
  const [catName, setCatName] = useState("");
  const [catSubtitle, setCatSubtitle] = useState("");
  const [catIcon, setCatIcon] = useState("✨");
  const [catLimit, setCatLimit] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const openError = (msg: string) => {
    setError(msg);
  };

  const saveLimit = async () => {
    const value = Math.round(Number(editLimitValue.replace(/\D/g, "")) || 0);
    if (value <= 0) return openError("Isi nominal limit dulu");
    setBusy(true);
    setError("");
    try {
      await scaleBudgetLimits(value);
      setEditLimitOpen(false);
      setEditLimitValue("");
      ui.toast(`Total batas jajan diatur jadi ${formatRupiah(value)} ✨`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setBusy(false);
    }
  };

  const saveCat = async () => {
    const limit = Math.round(Number(catLimit.replace(/\D/g, "")) || 0);
    if (!catName.trim() || limit <= 0) return openError("Isi nama dan limit kategori");
    setBusy(true);
    setError("");
    try {
      const budget: Budget = {
        id: uid("bud"),
        name: catName.trim(),
        subtitle: catSubtitle.trim() || "Kategori jajan baru",
        icon: catIcon.trim() || "✨",
        limitAmount: limit,
        spentAmount: 0,
        period: periodLabel,
      };
      await addBudget(budget);
      setAddCatOpen(false);
      setCatName("");
      setCatSubtitle("");
      setCatIcon("✨");
      setCatLimit("");
      ui.toast(`Kategori "${budget.name}" ditambahkan ✨`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah kategori");
    } finally {
      setBusy(false);
    }
  };

  const saveEditCat = async () => {
    if (!editCat) return;
    const limit = Math.round(Number(editCatLimit.replace(/\D/g, "")) || 0);
    if (!editCatName.trim() || limit <= 0) return openError("Isi nama dan limit baru");
    setBusy(true);
    setError("");
    try {
      await updateBudget(editCat.id, {
        name: editCatName.trim(),
        subtitle: editCatSubtitle.trim() || "Kategori jajan",
        icon: editCatIcon,
        limitAmount: limit,
      });
      const name = editCatName.trim();
      setEditCat(null);
      ui.toast(`Kategori "${name}" diperbarui ✨`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setBusy(false);
    }
  };

  const confirmDeleteCat = async () => {
    if (!deleteCat) return;
    setBusy(true);
    setError("");
    try {
      const name = deleteCat.name;
      await deleteBudget(deleteCat.id);
      setDeleteCat(null);
      ui.toast(`Kategori "${name}" dihapus 🗑️`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus kategori");
    } finally {
      setBusy(false);
    }
  };

  const openEditGoal = (goal: Goal) => {
    setError("");
    setEditGoal(goal);
    setETitle(goal.title);
    setESubtitle(goal.subtitle);
    setEIcon(goal.icon);
    setETarget(String(goal.targetAmount));
    setEDate(/^\d{4}-\d{2}-\d{2}$/.test(goal.targetDate) ? goal.targetDate : "");
    setEMonthly(goal.monthlyRoutine > 0 ? String(goal.monthlyRoutine) : "");
  };

  const saveEditGoal = async () => {
    if (!editGoal) return;
    const target = Math.round(Number(eTarget.replace(/\D/g, "")) || 0);
    if (!eTitle.trim() || target <= 0) return openError("Isi judul dan target celengan");
    setBusy(true);
    setError("");
    try {
      await updateGoal(editGoal.id, {
        title: eTitle.trim(),
        subtitle: eSubtitle.trim() || "Celengan impian",
        icon: eIcon,
        targetAmount: target,
        targetDate: eDate.trim() || "Belum ditentukan",
        monthlyRoutine: Math.round(Number(eMonthly.replace(/\D/g, "")) || 0),
      });
      const title = eTitle.trim();
      setEditGoal(null);
      ui.toast(`Celengan "${title}" diperbarui ✨`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan celengan");
    } finally {
      setBusy(false);
    }
  };

  const confirmDeleteGoal = async () => {
    if (!deleteGoalTarget) return;
    setBusy(true);
    setError("");
    try {
      const title = deleteGoalTarget.title;
      await deleteGoal(deleteGoalTarget.id);
      setDeleteGoalTarget(null);
      ui.toast(`Celengan "${title}" dihapus 🗑️`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus celengan");
      setDeleteGoalTarget(null);
    } finally {
      setBusy(false);
    }
  };

  const saveTopup = async () => {
    if (!topupGoal) return;
    const value = Math.round(Number(topupAmount.replace(/\D/g, "")) || 0);
    if (value <= 0) return openError("Isi nominal nabung dulu");
    const walletId = topupWallet || wallets[0]?.id || "wal_bca";
    setBusy(true);
    setError("");
    try {
      await createTransaction({
        type: "transfer",
        amount: value,
        category: "Nabung Celengan",
        categoryIcon: topupGoal.icon,
        walletId,
        toGoalId: topupGoal.id,
        date: todayISO(),
        time: nowTime(),
        book: "Pribadi",
        tag: "Harian",
        note: `Setor receh untuk ${topupGoal.title}`,
        adminFee: 0,
      });
      const name = topupGoal.title;
      setTopupGoal(null);
      ui.toast(`Setor ${formatRupiah(value)} masuk ke ${name} ✨`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menabung");
    } finally {
      setBusy(false);
    }
  };

  const toggleLock = async (goal: Goal) => {
    try {
      await updateGoal(goal.id, { isLocked: !goal.isLocked });
      ui.toast(goal.isLocked ? `${goal.title} dibuka kuncinya 🔓` : `${goal.title} dikunci 🔒`);
    } catch (err) {
      ui.toast(err instanceof Error ? err.message : "Gagal mengubah kunci");
    }
  };

  const saveGoal = async () => {
    const target = Math.round(Number(gTarget.replace(/\D/g, "")) || 0);
    if (!gTitle.trim() || target <= 0) return openError("Isi judul dan target celengan");
    setBusy(true);
    setError("");
    try {
      const goal: Goal = {
        id: uid("goal"),
        title: gTitle.trim(),
        subtitle: gSubtitle.trim() || "Celengan impian baru",
        icon: gIcon.trim() || "⭐",
        currentAmount: 0,
        targetAmount: target,
        targetDate: gDate.trim() || "Belum ditentukan",
        monthlyRoutine: Math.round(Number(gMonthly.replace(/\D/g, "")) || 0),
        isLocked: false,
        badgeText: "Baru dibuat ✨",
      };
      await addGoal(goal);
      setAddGoalOpen(false);
      setGTitle("");
      setGSubtitle("");
      setGIcon("⭐");
      setGTarget("");
      setGMonthly("");
      ui.toast(`Celengan "${goal.title}" dibuat 🎯`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat celengan");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="space-y-5">
      <header>
        <h1 className="font-outfit text-2xl font-semibold">Atur Duit & Celengan Impian 💰</h1>
        <p className="font-manrope text-sm text-muted">Rapikan jajan dan kejar mimpi sat-set ✨</p>
      </header>

      {/* Batas Jajan Bulan Ini */}
      <section className="cloud-card p-5">
        <div className="flex items-center justify-between">
          <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Batas Jajan {periodLabel}</p>
          <Pressable className="btn-ghost h-8 px-3 text-xs" onClick={() => { setError(""); setEditLimitValue(String(totals.limit)); setEditLimitOpen(true); }}>
            Edit Limit
          </Pressable>
        </div>
        <p className="tnum mt-2 text-3xl font-bold">{formatRupiah(totals.spent)} <span className="text-base font-medium text-muted">/ {formatRupiah(totals.limit)}</span></p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-inset">
          <div className="h-full rounded-full bg-primary" style={{ width: `${totals.pct}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between font-manrope text-sm">
          <span className="text-muted">Terpakai {totals.pct}%</span>
          <span className="font-semibold text-income">Sisa Aman ✨ {formatRupiah(totals.sisa)}</span>
        </div>
        <p className="mt-3 rounded-full bg-inset px-3 py-1.5 font-manrope text-xs font-bold text-muted">
          Rata-rata jajan {formatRupiah(totals.dailyAvg)} /hari
        </p>
      </section>

      {/* Kategori Jajan Kamu */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-outfit text-lg font-semibold">Kategori Jajan Kamu 🍰</h2>
          <Pressable className="btn-primary h-9 px-3 text-xs" onClick={() => { setError(""); setAddCatOpen(true); }}>
            + Tambah Kategori
          </Pressable>
        </div>
        <div className="space-y-3">
          {budgets.map((b) => {
            const pct = b.limitAmount > 0 ? Math.min(100, Math.round((b.spentAmount / b.limitAmount) * 100)) : 0;
            const sisa = Math.max(0, b.limitAmount - b.spentAmount);
            const over = b.spentAmount >= b.limitAmount;
            return (
              <div key={b.id} className="cloud-card p-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setError(""); setEditCat(b); setEditCatName(b.name); setEditCatSubtitle(b.subtitle); setEditCatIcon(b.icon); setEditCatLimit(String(b.limitAmount)); }}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--icon-badge-bg)] text-lg">{b.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-outfit text-sm font-semibold">{b.name}</span>
                      <span className="block truncate font-manrope text-xs text-muted">{b.subtitle}</span>
                    </span>
                    <span className="tnum text-right text-sm font-bold">
                      {formatRupiah(b.spentAmount)}
                      <span className="block text-xs font-medium text-muted">/ {formatRupiah(b.limitAmount)}</span>
                    </span>
                  </button>
                  <Pressable
                    ariaLabel={`Edit kategori ${b.name}`}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-inset text-secondary"
                    onClick={() => { setError(""); setEditCat(b); setEditCatName(b.name); setEditCatSubtitle(b.subtitle); setEditCatIcon(b.icon); setEditCatLimit(String(b.limitAmount)); }}
                  >
                    <Pencil size={15} />
                  </Pressable>
                  <Pressable
                    ariaLabel={`Hapus kategori ${b.name}`}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-inset text-expense"
                    onClick={() => { setError(""); setDeleteCat(b); }}
                  >
                    <Trash2 size={15} />
                  </Pressable>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-inset">
                  <div className={`h-full rounded-full ${over ? "bg-expense" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1.5 flex items-center justify-between font-manrope text-xs">
                  <span className={over ? "font-bold text-expense" : "text-muted"}>{over ? "Limit kepenuh 🥺" : `${pct}% terpakai`}</span>
                  <span className="text-muted">Sisa {formatRupiah(sisa)}</span>
                </div>
              </div>
            );
          })}
          {budgets.length === 0 && (
            <p className="rounded-lg bg-inset px-4 py-6 text-center font-manrope text-sm text-muted">
              Belum ada kategori. Tambahkan yang pertama ✨
            </p>
          )}
        </div>
      </section>

      {/* Celengan Wishlist Impian */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-outfit text-lg font-semibold">Celengan Wishlist Impian 🎯</h2>
          <Pressable className="btn-primary h-9 px-3 text-xs" onClick={() => { setError(""); setAddGoalOpen(true); }}>
            + Bikin Baru
          </Pressable>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {goals.map((g) => {
            const pct = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
            const sisa = Math.max(0, g.targetAmount - g.currentAmount);
            return (
              <div key={g.id} className="cloud-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{g.icon}</span>
                    <div>
                      <p className="font-outfit text-sm font-semibold">{g.title}</p>
                      <p className="font-manrope text-xs text-muted">{g.subtitle}</p>
                    </div>
                  </div>
                  {g.isLocked && <span className="rounded-full bg-inset px-2 py-0.5 text-xs">🔒</span>}
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-inset">
                  <div className="h-full rounded-full bg-secondary" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between font-manrope text-xs">
                  <span className="tnum font-bold">{pct}%</span>
                  <span className="text-muted">sisa {formatRupiah(sisa)} lagi!</span>
                </div>
                <p className="tnum mt-1 text-xs text-muted">{formatRupiah(g.currentAmount)} / {formatRupiah(g.targetAmount)}</p>
                <p className="mt-1 font-manrope text-xs text-muted">Target: {/^\d{4}-\d{2}-\d{2}$/.test(g.targetDate) ? formatIdDate(g.targetDate) : g.targetDate} · {g.badgeText}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Pressable className="btn-primary h-9 flex-1 text-xs" onClick={() => { setError(""); setTopupGoal(g); setTopupWallet(wallets[0]?.id ?? ""); setTopupAmount("100000"); }}>
                    + Isi Celengan
                  </Pressable>
                  <Pressable ariaLabel={`Edit celengan ${g.title}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-inset text-secondary" onClick={() => openEditGoal(g)}>
                    <Pencil size={15} />
                  </Pressable>
                  <Pressable ariaLabel={`Hapus celengan ${g.title}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-inset text-expense" onClick={() => { setError(""); setDeleteGoalTarget(g); }}>
                    <Trash2 size={15} />
                  </Pressable>
                  <KawaiiSwitch checked={g.isLocked} onChange={() => void toggleLock(g)} label={`Kunci dana ${g.title}`} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Edit total limit */}
      <AnimatePresence>
        {editLimitOpen && (
          <Overlay onClose={() => setEditLimitOpen(false)}>
            <h3 className="font-outfit text-xl font-semibold">Edit Total Batas Jajan</h3>
            <p className="mt-1 font-manrope text-sm text-muted">Nominal dibagi proporsional ke tiap kategori.</p>
            <input
              className="inset-field mt-4 h-12 w-full px-3"
              inputMode="numeric"
              placeholder="Contoh: 5000000"
              value={editLimitValue}
              onChange={(e) => setEditLimitValue(e.target.value.replace(/[^\d]/g, ""))}
            />
            {error && <p className="mt-2 font-manrope text-sm text-expense">{error}</p>}
            <Pressable className="btn-primary mt-4 h-12 w-full" onClick={() => void saveLimit()} disabled={busy}>
              {busy ? "Menyimpan…" : "Simpan Limit Baru"}
            </Pressable>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Add category */}
      <AnimatePresence>
        {addCatOpen && (
          <Overlay onClose={() => setAddCatOpen(false)}>
            <h3 className="font-outfit text-xl font-semibold">Tambah Kategori Jajan</h3>
            <div className="mt-4 space-y-3">
              <input className="inset-field h-12 w-full px-3" placeholder="Nama kategori" value={catName} onChange={(e) => setCatName(e.target.value)} />
              <input className="inset-field h-12 w-full px-3" placeholder="Subjudul" value={catSubtitle} onChange={(e) => setCatSubtitle(e.target.value)} />
              <EmojiPicker value={catIcon} onChange={setCatIcon} />
              <input className="inset-field h-12 w-full px-3" inputMode="numeric" placeholder="Limit (cth: 500000)" value={catLimit} onChange={(e) => setCatLimit(e.target.value.replace(/[^\d]/g, ""))} />
            </div>
            {error && <p className="mt-2 font-manrope text-sm text-expense">{error}</p>}
            <Pressable className="btn-primary mt-4 h-12 w-full" onClick={() => void saveCat()} disabled={busy}>
              {busy ? "Menyimpan…" : "Tambah Kategori"}
            </Pressable>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Edit category limit */}
      <AnimatePresence>
        {editCat && (
          <Overlay onClose={() => setEditCat(null)}>
            <h3 className="font-outfit text-xl font-semibold">Edit Kategori {editCat.icon}</h3>
            <p className="mt-1 font-manrope text-sm text-muted">Ubah nama, ikon, dan limit bulanan kategori ini.</p>
            <div className="mt-4 space-y-3">
              <input className="inset-field h-12 w-full px-3" placeholder="Nama kategori" value={editCatName} onChange={(e) => setEditCatName(e.target.value)} />
              <input className="inset-field h-12 w-full px-3" placeholder="Subjudul" value={editCatSubtitle} onChange={(e) => setEditCatSubtitle(e.target.value)} />
              <EmojiPicker value={editCatIcon} onChange={setEditCatIcon} />
              <input
                className="inset-field h-12 w-full px-3"
                inputMode="numeric"
                placeholder="Limit baru"
                value={editCatLimit}
                onChange={(e) => setEditCatLimit(e.target.value.replace(/[^\d]/g, ""))}
              />
            </div>
            {error && <p className="mt-2 font-manrope text-sm text-expense">{error}</p>}
            <Pressable className="btn-primary mt-4 h-12 w-full" onClick={() => void saveEditCat()} disabled={busy}>
              {busy ? "Menyimpan…" : "Simpan Perubahan"}
            </Pressable>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Topup goal */}
      <AnimatePresence>
        {topupGoal && (
          <Overlay onClose={() => setTopupGoal(null)}>
            <h3 className="font-outfit text-xl font-semibold">Isi Celengan {topupGoal.icon}</h3>
            <p className="mt-1 font-manrope text-sm text-muted">Dana pindah dari dompet ke celengan ini.</p>
            <p className="mt-4 font-manrope text-sm font-semibold">Dari dompet</p>
            <KawaiiSelect
              className="mt-1"
              ariaLabel="Dari dompet"
              value={topupWallet}
              onChange={setTopupWallet}
              options={wallets.map((w) => ({ value: w.id, label: `${w.name} · ${formatRupiah(w.balance)}`, icon: w.icon }))}
            />
            <label className="mt-3 block font-manrope text-sm font-semibold">
              Nominal
              <input className="inset-field mt-1 h-12 w-full px-3" inputMode="numeric" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value.replace(/[^\d]/g, ""))} />
            </label>
            {error && <p className="mt-2 font-manrope text-sm text-expense">{error}</p>}
            <Pressable className="btn-primary mt-4 h-12 w-full" onClick={() => void saveTopup()} disabled={busy}>
              {busy ? "Menyimpan…" : "Setor ke Celengan"}
            </Pressable>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Add goal */}
      <AnimatePresence>
        {addGoalOpen && (
          <Overlay onClose={() => setAddGoalOpen(false)}>
            <h3 className="font-outfit text-xl font-semibold">Bikin Celengan Baru 🎯</h3>
            <div className="mt-4 space-y-3">
              <input className="inset-field h-12 w-full px-3" placeholder="Judul impian" value={gTitle} onChange={(e) => setGTitle(e.target.value)} />
              <input className="inset-field h-12 w-full px-3" placeholder="Subjudul" value={gSubtitle} onChange={(e) => setGSubtitle(e.target.value)} />
              <EmojiPicker value={gIcon} onChange={setGIcon} />
              <input className="inset-field h-12 w-full px-3" inputMode="numeric" placeholder="Target (cth: 5000000)" value={gTarget} onChange={(e) => setGTarget(e.target.value.replace(/[^\d]/g, ""))} />
              <input type="date" className="inset-field h-12 w-full px-3" value={gDate} onChange={(e) => setGDate(e.target.value)} aria-label="Tanggal target celengan" />
              <input className="inset-field h-12 w-full px-3" inputMode="numeric" placeholder="Nabung rutin /bulan (opsional)" value={gMonthly} onChange={(e) => setGMonthly(e.target.value.replace(/[^\d]/g, ""))} />
            </div>
            {error && <p className="mt-2 font-manrope text-sm text-expense">{error}</p>}
            <Pressable className="btn-primary mt-4 h-12 w-full" onClick={() => void saveGoal()} disabled={busy}>
              {busy ? "Menyimpan…" : "Bikin Celengan"}
            </Pressable>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Edit goal */}
      <AnimatePresence>
        {editGoal && (
          <Overlay onClose={() => setEditGoal(null)}>
            <h3 className="font-outfit text-xl font-semibold">Edit Celengan {editGoal.icon}</h3>
            <p className="mt-1 font-manrope text-sm text-muted">Ubah judul, ikon, dan target nabungnya.</p>
            <div className="mt-4 space-y-3">
              <input className="inset-field h-12 w-full px-3" placeholder="Judul impian" value={eTitle} onChange={(e) => setETitle(e.target.value)} />
              <input className="inset-field h-12 w-full px-3" placeholder="Subjudul" value={eSubtitle} onChange={(e) => setESubtitle(e.target.value)} />
              <EmojiPicker value={eIcon} onChange={setEIcon} />
              <input className="inset-field h-12 w-full px-3" inputMode="numeric" placeholder="Target (cth: 5000000)" value={eTarget} onChange={(e) => setETarget(e.target.value.replace(/[^\d]/g, ""))} />
              <input type="date" className="inset-field h-12 w-full px-3" value={eDate} onChange={(e) => setEDate(e.target.value)} aria-label="Tanggal target celengan" />
              <input className="inset-field h-12 w-full px-3" inputMode="numeric" placeholder="Nabung rutin /bulan (opsional)" value={eMonthly} onChange={(e) => setEMonthly(e.target.value.replace(/[^\d]/g, ""))} />
            </div>
            {error && <p className="mt-2 font-manrope text-sm text-expense">{error}</p>}
            <Pressable className="btn-primary mt-4 h-12 w-full" onClick={() => void saveEditGoal()} disabled={busy}>
              {busy ? "Menyimpan…" : "Simpan Perubahan"}
            </Pressable>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Delete category confirm */}
      <AnimatePresence>
        {deleteCat && (
          <Overlay onClose={() => setDeleteCat(null)}>
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-inset text-3xl">{deleteCat.icon}</div>
              <h3 className="mt-3 font-outfit text-xl font-semibold">Hapus Kategori "{deleteCat.name}"?</h3>
              <p className="mt-2 font-manrope text-sm leading-6 text-muted">
                Catatan lama tetap aman karena ikon & kategori tersimpan di tiap transaksi. Limit bulan ini ikut berkurang ya.
              </p>
              <div className="mt-5 grid gap-2">
                <Pressable className="btn-danger h-12" onClick={() => void confirmDeleteCat()} disabled={busy}>
                  {busy ? "Menghapus…" : "Ya, Hapus 🗑️"}
                </Pressable>
                <Pressable className="btn-ghost h-12" onClick={() => setDeleteCat(null)}>
                  Batal Aja 💖
                </Pressable>
              </div>
            </div>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Delete goal confirm */}
      <AnimatePresence>
        {deleteGoalTarget && (
          <Overlay onClose={() => setDeleteGoalTarget(null)}>
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-inset text-3xl">{deleteGoalTarget.icon}</div>
              <h3 className="mt-3 font-outfit text-xl font-semibold">Hapus Celengan "{deleteGoalTarget.title}"?</h3>
              <p className="mt-2 font-manrope text-sm leading-6 text-muted">
                Dana {formatRupiah(deleteGoalTarget.currentAmount)} di celengan ini tidak kembali ke dompet. Catatan transfer yang sudah ada tetap tersimpan.
              </p>
              <div className="mt-5 grid gap-2">
                <Pressable className="btn-danger h-12" onClick={() => void confirmDeleteGoal()} disabled={busy}>
                  {busy ? "Menghapus…" : "Ya, Hapus 🗑️"}
                </Pressable>
                <Pressable className="btn-ghost h-12" onClick={() => setDeleteGoalTarget(null)}>
                  Batal Aja 💖
                </Pressable>
              </div>
            </div>
          </Overlay>
        )}
      </AnimatePresence>
    </main>
  );
}
