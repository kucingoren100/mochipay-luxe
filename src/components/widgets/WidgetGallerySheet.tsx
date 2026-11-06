"use client";

import { Overlay } from "@/components/ui/SquircleCard";
import { WIDGET_VARIANTS, WidgetPreviewCard, type WidgetData } from "@/components/widgets/WidgetPreviewCard";
import { MeowCalendarWidget3x2 } from "@/components/widgets/MeowCalendarWidget3x2";
import { MeowTodoWidget3x2 } from "@/components/widgets/MeowTodoWidget3x2";
import { MEOW_WIDGETS, type WidgetGroupId } from "@/components/widgets/WidgetPreviewModal";
import { useTheme } from "@/context/ThemeContext";
import { useBudgets, useGoals, useTodoCategories, useTodoTasks, useTransactions, useWallets } from "@/hooks/useLocalDb";

export interface WidgetPreviewRequest {
  group: WidgetGroupId;
  index: number;
}

export function WidgetGallerySheet({ open, onClose, onPreview }: { open: boolean; onClose: () => void; onPreview: (req: WidgetPreviewRequest) => void }) {
  const theme = useTheme();
  const transactions = useTransactions();
  const wallets = useWallets();
  const goals = useGoals();
  const budgets = useBudgets();
  const tasks = useTodoTasks();
  const categories = useTodoCategories();

  const data: WidgetData = { transactions, wallets, goals, budgets, mask: theme.maskBalance };

  if (!open) return null;
  return (
    <div>
      <Overlay onClose={onClose} wide z="z-[69]">
          <div className="mb-1 flex items-start justify-between">
            <div>
              <p className="font-manrope text-[11px] font-bold uppercase tracking-wider text-muted">Pengelolaan · Widget Desktop</p>
              <h2 className="font-outfit text-2xl font-semibold">Galeri Widget 📲</h2>
            </div>
            <button type="button" aria-label="Tutup galeri widget" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-inset">✕</button>
          </div>
          <p className="mb-4 font-manrope text-sm text-muted">
            Pratinjau langsung (theme-adaptive & tersambung data lokal) untuk {WIDGET_VARIANTS.length + MEOW_WIDGETS.length} varian widget: keuangan MochiMoy + jadwal Meow Todo.
          </p>

          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-outfit text-lg font-semibold">MochiMoy Finance 💰</h3>
            <button type="button" onClick={() => onPreview({ group: "mochipay", index: 0 })} className="rounded-full bg-primary px-3 py-1.5 font-manrope text-xs font-bold text-on-primary">
              Lihat Widget ▸
            </button>
          </div>
          <div className="space-y-4">
            {WIDGET_VARIANTS.map((variant, i) => (
              <div key={variant.id} className="cloud-card p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <h4 className="truncate font-outfit text-base font-semibold">{variant.title}</h4>
                    <span className="rounded-full bg-inset px-2 py-0.5 font-manrope text-[10px] font-bold text-muted">{variant.size}</span>
                  </div>
                  <button type="button" onClick={() => onPreview({ group: "mochipay", index: i })} className="shrink-0 font-manrope text-[11px] font-bold text-secondary">
                    Pratinjau ▸
                  </button>
                </div>
                <WidgetPreviewCard variant={variant} data={data} />
                <p className="mt-2 font-manrope text-xs text-muted">{variant.desc}</p>
              </div>
            ))}
          </div>

          <div className="mb-2 mt-6 flex items-center justify-between">
            <h3 className="font-outfit text-lg font-semibold">Meow Todo 🐱</h3>
            <button type="button" onClick={() => onPreview({ group: "meow", index: 0 })} className="rounded-full bg-primary px-3 py-1.5 font-manrope text-xs font-bold text-on-primary">
              Lihat Widget ▸
            </button>
          </div>
          <div className="space-y-4">
            {MEOW_WIDGETS.map((widget, i) => (
              <div key={widget.id} className="cloud-card p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <h4 className="truncate font-outfit text-base font-semibold">{widget.title}</h4>
                    <span className="rounded-full bg-inset px-2 py-0.5 font-manrope text-[10px] font-bold text-muted">{widget.size}</span>
                  </div>
                  <button type="button" onClick={() => onPreview({ group: "meow", index: i })} className="shrink-0 font-manrope text-[11px] font-bold text-secondary">
                    Pratinjau ▸
                  </button>
                </div>
                <div className="overflow-x-auto">
                  {widget.id === "meow-tasks" ? (
                    <MeowTodoWidget3x2 tasks={tasks} categories={categories} />
                  ) : (
                    <MeowCalendarWidget3x2 tasks={tasks} categories={categories} />
                  )}
                </div>
                <p className="mt-2 font-manrope text-xs text-muted">
                  {widget.id === "meow-tasks"
                    ? "Squircle krem dengan badge kategori pastel, tanggal jatuh tempo, indikator prioritas, dan pencil FAB merah untuk catat cepat."
                    : "Matriks kalender bulanan: sel tanggal bundar dengan ikon kategori dan titik aktivitas pink/merah di tanggal bertugas."}
                </p>
              </div>
            ))}
          </div>

        </Overlay>
    </div>
  );
}
