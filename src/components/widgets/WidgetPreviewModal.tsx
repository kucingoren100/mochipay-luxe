"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Smartphone } from "lucide-react";
import { Overlay, Pressable } from "@/components/ui/SquircleCard";
import { WIDGET_VARIANTS, WidgetPreviewCard, type WidgetData } from "@/components/widgets/WidgetPreviewCard";
import { MeowCalendarWidget3x2 } from "@/components/widgets/MeowCalendarWidget3x2";
import { MeowTodoWidget3x2 } from "@/components/widgets/MeowTodoWidget3x2";
import { useTheme } from "@/context/ThemeContext";
import { useBudgets, useGoals, useTodoCategories, useTodoTasks, useTransactions, useWallets } from "@/hooks/useLocalDb";
import type { TodoCategory, TodoTask } from "@/types/finance";

export type WidgetGroupId = "mochipay" | "meow";

export interface PreviewWidget {
  id: string;
  title: string;
  size: string;
  group: WidgetGroupId;
  groupTitle: string;
}

export const MEOW_WIDGETS: PreviewWidget[] = [
  { id: "meow-tasks", title: "Daftar Tugas", size: "3x2", group: "meow", groupTitle: "Meow Todo" },
  { id: "meow-calendar", title: "Kalender Dot Matrix", size: "3x2", group: "meow", groupTitle: "Meow Todo" },
];

export function widgetCatalog(): PreviewWidget[] {
  return [
    ...WIDGET_VARIANTS.map((v) => ({ id: v.id, title: v.title, size: v.size, group: "mochipay" as const, groupTitle: "MochiMoy" })),
    ...MEOW_WIDGETS,
  ];
}

const ANDROID_STEPS = [
  "Buka MochiMoy di Chrome, lalu pasang sebagai aplikasi (menu ⋮ → 'Install app').",
  "Tekan lama area kosong di Layar Utama HP → pilih menu 'Widget'.",
  "Cari 'MochiMoy' / 'Meow Todo' → geser widget ke layar utama!",
];

const IOS_STEPS = [
  "Buka halaman widget di Safari (pakai tombol 'Buka Versi Standalone' di bawah).",
  "Tekan tombol Bagikan 📤 di toolbar Safari.",
  "Pilih 'Tambah ke Layar Utama' → widget siap dipakai!",
];

function WidgetStage({ widget, data, tasks, categories, onQuickAdd }: { widget: PreviewWidget; data: WidgetData; tasks: TodoTask[]; categories: TodoCategory[]; onQuickAdd: () => void }) {
  if (widget.id === "meow-tasks") return <MeowTodoWidget3x2 tasks={tasks} categories={categories} onQuickAdd={onQuickAdd} />;
  if (widget.id === "meow-calendar") return <MeowCalendarWidget3x2 tasks={tasks} categories={categories} />;
  const variant = WIDGET_VARIANTS.find((v) => v.id === widget.id);
  if (!variant) return null;
  return (
    <div className="w-[320px]">
      <WidgetPreviewCard variant={variant} data={data} />
    </div>
  );
}

export function WidgetPreviewModal({
  open,
  onClose,
  group,
  initialIndex = 0,
}: {
  open: boolean;
  onClose: () => void;
  group: WidgetGroupId;
  initialIndex?: number;
}) {
  const theme = useTheme();
  const router = useRouter();
  const transactions = useTransactions();
  const wallets = useWallets();
  const goals = useGoals();
  const budgets = useBudgets();
  const tasks = useTodoTasks();
  const categories = useTodoCategories();

  const [index, setIndex] = useState(initialIndex);
  const [guideOpen, setGuideOpen] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios">("android");
  const [nativeState, setNativeState] = useState<"idle" | "ok" | "unsupported">("idle");

  useEffect(() => {
    if (open) {
      setIndex(initialIndex);
      setGuideOpen(false);
      setNativeState("idle");
    }
  }, [open, initialIndex]);

  const data: WidgetData = { transactions, wallets, goals, budgets, mask: theme.maskBalance };
  const list = widgetCatalog().filter((w) => w.group === group);
  const safeIndex = list.length ? Math.min(index, list.length - 1) : 0;
  const widget = list[safeIndex];
  const groupTitle = group === "meow" ? "Meow Todo" : "MochiMoy";
  const steps = platform === "android" ? ANDROID_STEPS : IOS_STEPS;

  const move = (delta: number) => setIndex((current) => (current + delta + list.length) % list.length);

  const tryNativeInstall = async () => {
    try {
      const nav = window.navigator as Navigator & { widget?: { install?: (config: { id: string }) => Promise<boolean> }; setAppBadge?: () => Promise<void> };
      if (nav.widget?.install) {
        const ok = await nav.widget.install({ id: widget.id });
        setNativeState(ok ? "ok" : "unsupported");
      } else if (nav.setAppBadge) {
        await nav.setAppBadge();
        setNativeState("ok");
      } else {
        setNativeState("unsupported");
      }
    } catch {
      setNativeState("unsupported");
    }
    setGuideOpen(true);
  };

  if (!open || !widget) return null;

  return (
    <Overlay onClose={onClose} wide z="z-[72]">
      <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-neutral-300" />
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Kembali" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white shadow-sm">
          <ArrowLeft size={18} className="text-[#4A4036]" />
        </button>
        <h2 className="flex-1 text-center font-outfit text-lg font-bold text-foreground">{groupTitle}</h2>
        <span className="w-10 shrink-0" />
      </div>

      <p className="mt-4 text-center font-outfit text-2xl font-bold">{groupTitle}</p>
      <p className="mt-1 text-center font-manrope text-xs font-bold uppercase tracking-wider text-muted">
        {widget.title} · {widget.size}
      </p>

      <div className="relative mt-4">
        <div className="overflow-hidden rounded-[32px] border border-line bg-[#FAF7F2] px-4 py-8">
          <motion.div
            key={widget.id}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -350) move(1);
              else if (info.offset.x > 60 || info.velocity.x > 350) move(-1);
            }}
            className="mx-auto flex w-fit cursor-grab touch-pan-y justify-center active:cursor-grabbing"
          >
            <WidgetStage widget={widget} data={data} tasks={tasks} categories={categories} onQuickAdd={() => { onClose(); router.push("/todo?action=new"); }} />
          </motion.div>
        </div>
        {list.length > 1 && (
          <>
            <button type="button" aria-label="Widget sebelumnya" onClick={() => move(-1)} className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 shadow-sm">
              <ChevronLeft size={16} />
            </button>
            <button type="button" aria-label="Widget berikutnya" onClick={() => move(1)} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 shadow-sm">
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {list.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Lihat widget ${item.title}`}
            aria-current={i === safeIndex}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === safeIndex ? "w-6 bg-secondary" : "w-1.5 bg-inset"}`}
          />
        ))}
      </div>

      <div className="sticky bottom-0 -mx-4 mt-5 rounded-b-[1.75rem] bg-[var(--card)]/85 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        <Pressable className="mx-auto block h-14 w-full max-w-sm rounded-full bg-[var(--primary)] font-outfit text-base font-semibold text-white" onClick={() => void tryNativeInstall()}>
          Tambahkan ke Layar Utama
        </Pressable>
      </div>

      {guideOpen && (
        <Overlay onClose={() => setGuideOpen(false)} z="z-[74]">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="font-manrope text-[11px] font-bold uppercase tracking-wider text-muted">Panduan Instalasi · 3 Langkah</p>
              <h3 className="font-outfit text-xl font-semibold">Pasang Widget {widget.title} 📲</h3>
            </div>
            <button type="button" aria-label="Tutup panduan" onClick={() => setGuideOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-inset">✕</button>
          </div>
          {nativeState === "unsupported" && (
            <p className="mb-3 rounded-lg bg-inset px-3 py-2 font-manrope text-xs text-muted">
              Browser ini belum mendukung pemasangan widget otomatis, jadi ikuti langkah manual di bawah ya 🐾
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {(["android", "ios"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPlatform(key)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-2 py-2.5 font-manrope text-xs font-bold ${platform === key ? "border-secondary bg-inset text-foreground" : "border-line bg-card text-muted"}`}
              >
                <Smartphone size={14} /> {key === "android" ? "Android (Chrome)" : "iPhone (iOS Safari)"}
              </button>
            ))}
          </div>
          <ol className="mt-4 space-y-2">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-3 rounded-lg bg-inset px-3 py-2.5">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-bold text-white">{i + 1}</span>
                <span className="font-manrope text-xs font-semibold leading-5">{step}</span>
              </li>
            ))}
          </ol>
          <Link
            href={`/widgets/standalone/${widget.id}`}
            className="btn-ghost mt-4 flex h-12 items-center justify-center font-outfit text-sm font-bold"
          >
            Buka Versi Standalone 🔗
          </Link>
          <p className="mt-2 text-center font-manrope text-[11px] text-muted">Versi standalone bisa di-bookmark atau di-pin langsung dari browser.</p>
        </Overlay>
      )}
    </Overlay>
  );
}
