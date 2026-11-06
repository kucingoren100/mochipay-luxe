"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Palette, Pencil, Plus, Sliders, Unlock } from "lucide-react";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { KawaiiSelect } from "@/components/ui/KawaiiSelect";
import { Overlay, Pressable } from "@/components/ui/SquircleCard";
import { useUi } from "@/components/layout/AppShell";
import { useWallets } from "@/hooks/useLocalDb";
import { useTheme } from "@/context/ThemeContext";
import { addWallet, updateWallet } from "@/lib/db";
import { CARD_SKINS, formatRupiah, uid } from "@/lib/formatters";
import type { PaletteId, Wallet, WalletType } from "@/types/finance";

const SKIN_ORDER: PaletteId[] = ["lavender", "strawberry", "peachy", "matcha", "sky", "cocoa"];

const WALLET_TYPES: { id: WalletType; label: string; icon: string }[] = [
  { id: "bank", label: "Bank", icon: "🏦" },
  { id: "ewallet", label: "E-Wallet", icon: "🐰" },
  { id: "cash", label: "Tunai", icon: "💵" },
  { id: "card", label: "Kartu", icon: "💳" },
];

export default function CardsPage() {
  const ui = useUi();
  const wallets = useWallets();
  const { userName } = useTheme();
  const [cardId, setCardId] = useState("wal_bca");
  const [showDetails, setShowDetails] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);
  const [limitDraft, setLimitDraft] = useState(100000);
  const [tarikOpen, setTarikOpen] = useState(false);
  const [tarikCode, setTarikCode] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [nwName, setNwName] = useState("");
  const [nwType, setNwType] = useState<WalletType>("ewallet");
  const [nwBalance, setNwBalance] = useState("");
  const [nwIcon, setNwIcon] = useState("🐰");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [edName, setEdName] = useState("");
  const [edType, setEdType] = useState<WalletType>("ewallet");
  const [edBalance, setEdBalance] = useState("");
  const [edIcon, setEdIcon] = useState("🐰");
  const [edLimit, setEdLimit] = useState("");

  const wallet = wallets.find((w) => w.id === cardId) ?? wallets[0] ?? null;

  const toggleLock = async () => {
    if (!wallet) return;
    try {
      await updateWallet(wallet.id, { isLocked: !wallet.isLocked });
      ui.toast(wallet.isLocked ? "Kartu dibuka 🔓" : "Kartu dikunci 🔒");
    } catch (err) {
      ui.toast(err instanceof Error ? err.message : "Gagal mengunci");
    }
  };

  const cycleSkin = async () => {
    if (!wallet) return;
    const idx = SKIN_ORDER.indexOf(wallet.skinPreset);
    const next = SKIN_ORDER[(idx + 1) % SKIN_ORDER.length];
    try {
      await updateWallet(wallet.id, { skinPreset: next });
    } catch (err) {
      ui.toast(err instanceof Error ? err.message : "Gagal ganti skin");
    }
  };

  const openLimit = () => {
    if (!wallet) return;
    setLimitDraft(wallet.dailyLimit || 100000);
    setError("");
    setLimitOpen(true);
  };

  const saveLimit = async () => {
    if (!wallet) return;
    setBusy(true);
    try {
      await updateWallet(wallet.id, { dailyLimit: limitDraft });
      setLimitOpen(false);
      ui.toast(`Limit harian diatur ${formatRupiah(limitDraft)} 🎛️`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setBusy(false);
    }
  };

  const genTarik = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setTarikCode(code);
    setTarikOpen(true);
  };

  const saveWalletNew = async () => {
    const balance = Math.round(Number(nwBalance.replace(/\D/g, "")) || 0);
    if (!nwName.trim()) return setError("Isi nama dompet dulu");
    setBusy(true);
    setError("");
    try {
      const wallet: Wallet = {
        id: uid("wal"),
        name: nwName.trim(),
        type: nwType,
        balance,
        maskedNumber: "•••• 0000",
        expiryLabel: nwType === "card" ? "12/29" : "—",
        securityLabel: "Baru ditambahkan",
        holderName: userName.toUpperCase(),
        skinPreset: "lavender",
        isLocked: false,
        dailyLimit: 0,
        internationalEnabled: false,
        icon: nwIcon.trim() || "💳",
      };
      await addWallet(wallet);
      setCardId(wallet.id);
      setAddOpen(false);
      setNwName("");
      setNwBalance("");
      setNwIcon("🐰");
      ui.toast(`Dompet "${wallet.name}" ditambahkan ✨`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah dompet");
    } finally {
      setBusy(false);
    }
  };

  const openEdit = (w: Wallet) => {
    setEditId(w.id);
    setEdName(w.name);
    setEdType(w.type);
    setEdBalance(String(w.balance));
    setEdIcon(w.icon);
    setEdLimit(w.dailyLimit > 0 ? String(w.dailyLimit) : "");
    setError("");
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!edName.trim()) return setError("Isi nama dompet dulu");
    const balance = Math.round(Number(edBalance.replace(/\D/g, "")) || 0);
    const dailyLimit = Math.round(Number(edLimit.replace(/\D/g, "")) || 0);
    setBusy(true);
    setError("");
    try {
      await updateWallet(editId, {
        name: edName.trim(),
        type: edType,
        balance,
        icon: edIcon.trim() || "💳",
        dailyLimit,
      });
      setEditOpen(false);
      ui.toast(`Dompet "${edName.trim()}" diperbarui ✨`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan dompet");
    } finally {
      setBusy(false);
    }
  };

  if (!wallet) {
    return (
      <main className="space-y-5">
        <h1 className="font-outfit text-2xl font-semibold">Dompet & Kartu Cantik 💳</h1>
        <p className="rounded-lg bg-inset px-4 py-6 text-center font-manrope text-sm text-muted">
          Belum ada dompet. Tambahkan yang pertama ✨
        </p>
        <Pressable className="btn-primary h-12 w-full" onClick={() => { setError(""); setAddOpen(true); }}>
          + Hubungkan Dompet
        </Pressable>
        <AnimatePresence>{addOpen && renderAddWallet()}</AnimatePresence>
      </main>
    );
  }

  function renderAddWallet() {
    return (
      <Overlay onClose={() => setAddOpen(false)}>
        <h3 className="font-outfit text-xl font-semibold">Hubungkan / Tambah Dompet</h3>
        <div className="mt-4 space-y-3">
          <input className="inset-field h-12 w-full px-3" placeholder="Nama dompet" value={nwName} onChange={(e) => setNwName(e.target.value)} />
          <KawaiiSelect
            ariaLabel="Tipe dompet"
            value={nwType}
            onChange={(v) => setNwType(v as WalletType)}
            options={WALLET_TYPES.map((t) => ({ value: t.id, label: t.label, icon: t.icon }))}
          />
          <EmojiPicker value={nwIcon} onChange={setNwIcon} />
          <input className="inset-field h-12 w-full px-3" inputMode="numeric" placeholder="Saldo awal" value={nwBalance} onChange={(e) => setNwBalance(e.target.value.replace(/[^\d]/g, ""))} />
        </div>
        {error && <p className="mt-2 font-manrope text-sm text-expense">{error}</p>}
        <Pressable className="btn-primary mt-4 h-12 w-full" onClick={() => void saveWalletNew()} disabled={busy}>
          {busy ? "Menyimpan…" : "Tambah Dompet"}
        </Pressable>
      </Overlay>
    );
  }

  function renderEditWallet() {
    return (
      <Overlay onClose={() => setEditOpen(false)}>
        <h3 className="font-outfit text-xl font-semibold">Edit Dompet ✏️</h3>
        <p className="mt-1 font-manrope text-sm text-muted">Ubah nama, ikon, saldo, limit, dan tipe dompet.</p>
        <div className="mt-4 space-y-3">
          <input className="inset-field h-12 w-full px-3" placeholder="Nama dompet" value={edName} onChange={(e) => setEdName(e.target.value)} />
          <KawaiiSelect
            ariaLabel="Tipe dompet"
            value={edType}
            onChange={(v) => setEdType(v as WalletType)}
            options={WALLET_TYPES.map((t) => ({ value: t.id, label: t.label, icon: t.icon }))}
          />
          <EmojiPicker value={edIcon} onChange={setEdIcon} />
          <input className="inset-field h-12 w-full px-3" inputMode="numeric" placeholder="Saldo" value={edBalance} onChange={(e) => setEdBalance(e.target.value.replace(/[^\d]/g, ""))} />
          <input className="inset-field h-12 w-full px-3" inputMode="numeric" placeholder="Limit harian (kosong = tanpa limit)" value={edLimit} onChange={(e) => setEdLimit(e.target.value.replace(/[^\d]/g, ""))} />
        </div>
        {error && <p className="mt-2 font-manrope text-sm text-expense">{error}</p>}
        <Pressable className="btn-primary mt-4 h-12 w-full" onClick={() => void saveEdit()} disabled={busy}>
          {busy ? "Menyimpan…" : "Simpan Perubahan"}
        </Pressable>
      </Overlay>
    );
  }

  return (
    <main className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-2xl font-semibold">Dompet & Kartu Cantik 💳</h1>
          <p className="font-manrope text-sm text-muted">Kelola kartu dan dompetmu sat-set ✨</p>
        </div>
        <Pressable className="btn-primary h-10 px-3 text-sm" onClick={() => { setError(""); setAddOpen(true); }}>
          <Plus size={16} /> Dompet
        </Pressable>
      </header>

      {/* Virtual card */}
      <section
        className="relative overflow-hidden rounded-xl p-5 text-white shadow-float"
        style={{ background: CARD_SKINS[wallet.skinPreset] }}
      >
        <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/25 blur-xl" />
        <AnimatePresence>
          {wallet.isLocked && (
            <div className="absolute inset-0 grid place-items-center rounded-xl bg-white/35 backdrop-blur-sm">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-white/70 text-secondary shadow-float">
                <Lock size={26} />
              </div>
            </div>
          )}
        </AnimatePresence>
        <div className="relative flex items-start justify-between">
          <div>
            <p className="font-manrope text-xs font-bold uppercase tracking-wider text-white/80">{wallet.icon} {wallet.name}</p>
            <p className="font-manrope text-[11px] text-white/70">{wallet.type === "card" ? "Kartu Pastel" : wallet.type === "bank" ? "Rekening Bank" : wallet.type === "ewallet" ? "E-Wallet" : "Dompet Tunai"}</p>
          </div>
          <span className="rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-bold">{wallet.isLocked ? "Dikunci" : "Aktif"}</span>
        </div>
        <p className="tnum relative mt-6 text-xl font-bold tracking-widest">{wallet.maskedNumber}</p>
        <div className="relative mt-4 flex items-end justify-between">
          <div>
            <p className="font-manrope text-[10px] uppercase text-white/70">EXP</p>
            <p className="tnum text-sm font-bold">{wallet.expiryLabel}</p>
          </div>
          <div className="text-right">
            <p className="font-manrope text-[10px] uppercase text-white/70">{showDetails ? "Nomor CVC" : "Pemegang"}</p>
            <p className="tnum text-sm font-bold uppercase tracking-wide">{showDetails ? wallet.securityLabel : userName.toUpperCase()}</p>
          </div>
        </div>
        {showDetails && (
          <div className="relative mt-3 rounded-lg bg-white/20 px-3 py-2 font-manrope text-xs">
            <p>Label: {wallet.securityLabel}</p>
            <p>Limit harian: {wallet.dailyLimit > 0 ? formatRupiah(wallet.dailyLimit) : "Tanpa limit"}</p>
          </div>
        )}
      </section>

      {/* 4 quick actions */}
      <section className="grid grid-cols-4 gap-3">
        <Pressable className="cloud-card flex flex-col items-center gap-2 p-3" onClick={() => void toggleLock()}>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-inset text-secondary">{wallet.isLocked ? <Lock size={18} /> : <Unlock size={18} />}</span>
          <span className="font-manrope text-[11px] font-bold">{wallet.isLocked ? "Buka Kunci" : "Kunci Kartu"}</span>
        </Pressable>
        <Pressable className="cloud-card flex flex-col items-center gap-2 p-3" onClick={openLimit}>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-inset text-secondary"><Sliders size={18} /></span>
          <span className="font-manrope text-[11px] font-bold">Atur Limit</span>
        </Pressable>
        <Pressable className="cloud-card flex flex-col items-center gap-2 p-3" onClick={() => setShowDetails((v) => !v)}>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-inset text-secondary">{showDetails ? <EyeOff size={18} /> : <Eye size={18} />}</span>
          <span className="font-manrope text-[11px] font-bold">{showDetails ? "Sembunyikan" : "Lihat Info"}</span>
        </Pressable>
        <Pressable className="cloud-card flex flex-col items-center gap-2 p-3" onClick={() => void cycleSkin()}>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-inset text-secondary"><Palette size={18} /></span>
          <span className="font-manrope text-[11px] font-bold">Ganti Skin</span>
        </Pressable>
      </section>

      {/* Wallet list */}
      <section>
        <h2 className="mb-3 font-outfit text-lg font-semibold">Semua Dompet 👛</h2>
        <div className="space-y-2">
          {wallets.map((w) => (
            <div
              key={w.id}
              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-3 ${w.id === wallet.id ? "border-secondary bg-inset" : "border-line bg-card"}`}
            >
              <button
                type="button"
                onClick={() => setCardId(w.id)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--icon-badge-bg)] text-lg">{w.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-outfit text-sm font-semibold">{w.name}</span>
                  <span className="block font-manrope text-xs text-muted">{w.maskedNumber}{w.isLocked ? " · 🔒" : ""}</span>
                </span>
                <span className="tnum text-sm font-bold">{formatRupiah(w.balance)}</span>
              </button>
              <Pressable
                ariaLabel={`Edit dompet ${w.name}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card text-secondary"
                onClick={() => openEdit(w)}
              >
                <Pencil size={16} />
              </Pressable>
            </div>
          ))}
        </div>
      </section>

      {/* Limit modal */}
      <AnimatePresence>
        {limitOpen && (
          <Overlay onClose={() => setLimitOpen(false)}>
            <h3 className="font-outfit text-xl font-semibold">Atur Limit Harian 🎛️</h3>
            <p className="mt-1 font-manrope text-sm text-muted">Geser untuk memilih batas jajan harian.</p>
            <p className="tnum mt-4 text-center text-3xl font-bold">{formatRupiah(limitDraft)}</p>
            <input
              type="range"
              min={100000}
              max={5000000}
              step={50000}
              value={limitDraft}
              onChange={(e) => setLimitDraft(Number(e.target.value))}
              className="mt-4 w-full accent-[var(--secondary)]"
            />
            <div className="flex justify-between font-manrope text-xs text-muted">
              <span>Rp 100rb</span>
              <span>Rp 5jt</span>
            </div>
            {error && <p className="mt-2 font-manrope text-sm text-expense">{error}</p>}
            <Pressable className="btn-primary mt-4 h-12 w-full" onClick={() => void saveLimit()} disabled={busy}>
              {busy ? "Menyimpan…" : "Simpan Limit"}
            </Pressable>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Tarik tunai modal */}
      <AnimatePresence>
        {tarikOpen && (
          <Overlay onClose={() => setTarikOpen(false)}>
            <h3 className="font-outfit text-xl font-semibold">Kode Tarik Tunai 🏧</h3>
            <p className="mt-1 font-manrope text-sm text-muted">Pakai kode ini di ATM. Berlaku 5 menit ya.</p>
            <p className="tnum mt-4 text-center text-4xl font-bold tracking-widest">{tarikCode}</p>
            <Pressable className="btn-ghost mt-4 h-11 w-full text-sm" onClick={() => setTarikOpen(false)}>
              Sip, Catat Ya
            </Pressable>
          </Overlay>
        )}
      </AnimatePresence>

      <AnimatePresence>{addOpen && renderAddWallet()}</AnimatePresence>
      <AnimatePresence>{editOpen && renderEditWallet()}</AnimatePresence>
    </main>
  );
}
