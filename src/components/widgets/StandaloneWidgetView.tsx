"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WIDGET_VARIANTS, WidgetPreviewCard, type WidgetData } from "@/components/widgets/WidgetPreviewCard";
import { MeowCalendarWidget3x2 } from "@/components/widgets/MeowCalendarWidget3x2";
import { MeowTodoWidget3x2 } from "@/components/widgets/MeowTodoWidget3x2";
import { useTheme } from "@/context/ThemeContext";
import { useBudgets, useGoals, useTodoCategories, useTodoTasks, useTransactions, useWallets } from "@/hooks/useLocalDb";

const TITLES: Record<string, { title: string; group: string; size: string }> = {
  "meow-tasks": { title: "Daftar Tugas", group: "Meow Todo", size: "3x2" },
  "meow-calendar": { title: "Kalender Dot Matrix", group: "Meow Todo", size: "3x2" },
};

export default function StandaloneWidgetView({ type }: { type: string }) {
  const theme = useTheme();
  const transactions = useTransactions();
  const wallets = useWallets();
  const goals = useGoals();
  const budgets = useBudgets();
  const tasks = useTodoTasks();
  const categories = useTodoCategories();

  const data: WidgetData = { transactions, wallets, goals, budgets, mask: theme.maskBalance };
  const meow = TITLES[type];
  const variant = WIDGET_VARIANTS.find((v) => v.id === type);

  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4 py-10 text-foreground">
      <div className="w-full max-w-md space-y-6 text-center">
        <Link href={meow ? "/todo" : "/"} className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-card shadow-sm" aria-label="Kembali ke aplikasi">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="font-manrope text-[11px] font-bold uppercase tracking-wider text-muted">{meow?.group ?? "MochiMoy"} · Widget {variant?.size ?? meow?.size ?? "3x2"}</p>
          <h1 className="mt-1 font-outfit text-2xl font-bold">{meow?.title ?? variant?.title ?? "Widget"}</h1>
        </div>
        <div className="mx-auto w-fit rounded-[32px] border border-line bg-[#FAF7F2] px-4 py-8">
          {type === "meow-tasks" && <MeowTodoWidget3x2 tasks={tasks} categories={categories} onQuickAdd={() => (window.location.href = "/todo?action=new")} />}
          {type === "meow-calendar" && <MeowCalendarWidget3x2 tasks={tasks} categories={categories} />}
          {variant && (
            <div className="w-[320px]">
              <WidgetPreviewCard variant={variant} data={data} />
            </div>
          )}
        </div>
        <p className="font-manrope text-xs text-muted">
          Pin halaman ini lewat menu browser → &quot;Tambah ke Layar Utama&quot; supaya widget selalu tampil fresh dengan data lokal. 🐾
        </p>
      </div>
    </div>
  );
}
