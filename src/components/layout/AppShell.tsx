"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Bell, Plus } from "lucide-react";
import { KawaiiIcon, type KawaiiIconName } from "@/components/ui/KawaiiIcon";
import { CatatTransaksiSheet, type SavedPayload } from "@/components/transactions/CatatTransaksiSheet";
import { CelebrationModal } from "@/components/transactions/CelebrationModal";
import { ExportCsvModal } from "@/components/transactions/ExportCsvModal";
import { TransactionDetailSheet } from "@/components/transactions/TransactionDetailSheet";
import { InstallPwaBanner } from "@/components/layout/InstallPwaBanner";
import { AppSwitcherHeader } from "@/components/layout/AppSwitcherHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { KawaiiToast, type ToastItem } from "@/components/ui/KawaiiToast";
import { createTransaction } from "@/lib/db";
import { useGoals, useTransactions, useWallets } from "@/hooks/useLocalDb";
import { useNotifScheduler } from "@/hooks/useNotifications";
import { nowTime, todayISO, uid } from "@/lib/formatters";
import type { Transaction, TxType } from "@/types/finance";

interface UiApi {
  openCatat: (tab?: TxType, goalId?: string) => void;
  openExport: () => void;
  openDetail: (id: string) => void;
  celebrate: (tx: Transaction, allocated?: number) => void;
  toast: (message: string, actionLabel?: string, onAction?: () => void) => void;
}

const UiContext = createContext<UiApi | null>(null);

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi harus dipakai di dalam AppShell");
  return ctx;
}

const SIDE: { href: string; label: string; icon: KawaiiIconName }[] = [
  { href: "/", label: "Beranda", icon: "nav-rekor" },
  { href: "/budgets", label: "Celengan", icon: "nav-budget" },
  { href: "/cards", label: "Dompet", icon: "nav-akun" },
  { href: "/riwayat", label: "Riwayat", icon: "nav-stat" },
  { href: "/settings", label: "Tema", icon: "nav-saya" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const wallets = useWallets();
  const goals = useGoals();
  const transactions = useTransactions();
  useNotifScheduler(true);
  const [catat, setCatat] = useState<{ open: boolean; tab: TxType; goalId?: string }>({ open: false, tab: "expense" });
  const [exportOpen, setExportOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{ tx: Transaction; allocated?: number } | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, actionLabel?: string, onAction?: () => void) => {
    const id = uid("toast");
    setToasts((current) => [...current, { id, message, actionLabel, onAction }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 4800);
  }, []);

  const api = useMemo<UiApi>(
    () => ({
      openCatat: (tab = "expense", goalId) => setCatat({ open: true, tab, goalId }),
      openExport: () => setExportOpen(true),
      openDetail: (id) => setDetailId(id),
      celebrate: (tx, allocated) => setCelebration({ tx, allocated }),
      toast,
    }),
    [toast],
  );

  const detail = transactions.find((item) => item.id === detailId) ?? null;

  if (pathname.startsWith("/widgets/standalone")) {
    return <div className="min-h-screen bg-surface text-foreground">{children}</div>;
  }

  const onSaved = ({ tx, allocated, keepOpen }: SavedPayload) => {
    setCelebration({ tx, allocated });
    if (!keepOpen) setCatat((current) => ({ ...current, open: false }));
  };

  const allocate = async () => {
    if (!celebration || celebration.tx.type !== "income") return;
    const share = Math.round(celebration.tx.amount * 0.1);
    const goal = goals.find((item) => item.id === "goal_japan") ?? goals[0];
    if (!goal || share <= 0) return;
    try {
      await createTransaction({
        type: "transfer",
        amount: share,
        category: "Nabung Celengan",
        categoryIcon: "🌸",
        walletId: celebration.tx.walletId,
        toGoalId: goal.id,
        date: todayISO(),
        time: nowTime(),
        book: celebration.tx.book,
        tag: "Harian",
        note: "Alokasi 10% dari cuan masuk",
        adminFee: 0,
      });
      setCelebration((current) => (current ? { ...current, allocated: share } : current));
      toast(`10% sebesar alokasi masuk ke ${goal.title}`);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Alokasi gagal");
    }
  };

  return (
    <UiContext.Provider value={api}>
      <div className="min-h-screen bg-surface text-foreground">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-line bg-card px-4 py-6 lg:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-primary text-xl">🐰</div>
            <div>
              <p className="font-outfit text-lg font-bold">MochiMoy</p>
              <p className="font-manrope text-[11px] font-bold text-secondary">Kawaii Edition</p>
            </div>
          </div>
          <nav className="mt-8 flex flex-1 flex-col gap-1">
            {SIDE.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-full px-3 py-2.5 font-manrope text-sm font-bold ${active ? "bg-primary text-on-primary" : "text-muted hover:bg-inset"}`}
                >
                  <KawaiiIcon name={item.icon} size={22} /> {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4">
            <AppSwitcherHeader />
          </div>
          <button type="button" className="btn-primary mt-4 flex h-12 items-center justify-center gap-2" onClick={() => api.openCatat("expense")}>
            <Plus size={18} /> Catat Cuan
          </button>
        </aside>
        <div className="lg:pl-[260px]">
          <div className="mx-auto w-full max-w-dashboard px-4 pb-32 pt-4 sm:px-6 lg:px-8 lg:pb-10">
            <InstallPwaBanner />
            <div className="mt-3">
              <AppSwitcherHeader />
            </div>
            {children}
          </div>
        </div>
        <BottomNav onCatat={() => api.openCatat("expense")} />
        <KawaiiToast toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((item) => item.id !== id))} />
        <CatatTransaksiSheet
          open={catat.open}
          initialTab={catat.tab}
          initialGoalId={catat.goalId}
          onClose={() => setCatat((current) => ({ ...current, open: false }))}
          onSaved={onSaved}
        />
        <ExportCsvModal open={exportOpen} onClose={() => setExportOpen(false)} onDone={(message) => toast(message)} />
        <TransactionDetailSheet
          tx={detail}
          onClose={() => setDetailId(null)}
          onSaved={(message) => toast(message, "Lihat di Beranda", () => router.push("/"))}
        />
        <CelebrationModal
          tx={celebration?.tx ?? null}
          wallets={wallets}
          goals={goals}
          allocated={celebration?.allocated}
          onAllocate={() => void allocate()}
          onAnother={() => setCelebration(null)}
          onHome={() => {
            setCelebration(null);
            setCatat((current) => ({ ...current, open: false }));
            router.push("/");
          }}
        />
      </div>
    </UiContext.Provider>
  );
}

export function DesktopBell() {
  return <Bell size={18} />;
}
