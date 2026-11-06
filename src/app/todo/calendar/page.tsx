"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TaskCard } from "@/components/todo/TaskCard";
import { NotificationSettingsCard } from "@/components/todo/NotificationSettingsCard";
import { Pressable } from "@/components/ui/SquircleCard";
import { KawaiiIcon } from "@/components/ui/KawaiiIcon";
import { KawaiiMascot } from "@/components/ui/KawaiiMascot";
import { useUi } from "@/components/layout/AppShell";
import { useTodoCategories, useTodoTasks } from "@/hooks/useLocalDb";
import { deleteTodoTask, updateTodoTask } from "@/lib/db";
import { addDays, formatIdDate, formatLongMonth, startOfMonth, startOfWeek, todayISO, toISODate, WEEKDAY_LABELS } from "@/lib/formatters";

type View = "month" | "week";

export default function TodoCalendarPage() {
  const ui = useUi();
  const tasks = useTodoTasks();
  const categories = useTodoCategories();
  const today = todayISO();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(today);
  const [view, setView] = useState<View>("month");

  const byDate = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    for (const task of tasks) {
      const list = map.get(task.dueDate) ?? [];
      list.push(task);
      map.set(task.dueDate, list);
    }
    return map;
  }, [tasks]);

  const catOf = (id: string) => categories.find((cat) => cat.id === id);

  const monthCells = useMemo(() => {
    const first = startOfMonth(cursor);
    const offset = (first.getDay() + 6) % 7;
    const gridStart = addDays(first, -offset);
    return Array.from({ length: 42 }, (_, i) => {
      const date = addDays(gridStart, i);
      return { iso: toISODate(date), inMonth: date.getMonth() === cursor.getMonth() };
    });
  }, [cursor]);

  const weekCells = useMemo(() => {
    const start = startOfWeek(new Date(`${selected}T00:00:00`));
    return Array.from({ length: 7 }, (_, i) => toISODate(addDays(start, i)));
  }, [selected]);

  const agenda = byDate.get(selected) ?? [];

  const shiftMonth = (delta: number) => setCursor((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));

  const Dots = ({ iso }: { iso: string }) => {
    const list = byDate.get(iso) ?? [];
    if (list.length === 0) return null;
    return (
      <span className="mt-1 flex items-center justify-center gap-0.5">
        {list.slice(0, 3).map((task) => (
          <span
            key={task.id}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: catOf(task.categoryId)?.color ?? "var(--secondary)", opacity: task.isCompleted ? 1 : 0.4 }}
          />
        ))}
        {list.length > 3 && <span className="font-manrope text-[8px] font-bold text-muted">+{list.length - 3}</span>}
      </span>
    );
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    const next = !task.isCompleted;
    await updateTodoTask(id, { isCompleted: next, completedAt: next ? Date.now() : null });
    if (next) ui.toast(`Miaaw! "${task.title}" selesai 🐾✨`);
  };

  const toggleSubtask = async (taskId: string, subId: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    await updateTodoTask(taskId, { subtasks: task.subtasks.map((sub) => (sub.id === subId ? { ...sub, isDone: !sub.isDone } : sub)) });
  };

  const removeTask = async (id: string) => {
    await deleteTodoTask(id);
    ui.toast("Tugas dihapus dari kalender 🗑️");
  };

  return (
    <motion.main initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
      <header>
        <h1 className="flex items-center gap-2 font-outfit text-2xl font-semibold">
          <KawaiiIcon name="calendar-kawaii" size={22} />
          Kalender Jadwal Cantikk
        </h1>
        <p className="font-manrope text-sm text-muted">Intip sebaran tugas per tanggal, titik warna = kategori kamu.</p>
      </header>

      <section className="cloud-card p-4">
        <div className="flex items-center justify-between gap-2">
          <Pressable ariaLabel="Bulan sebelumnya" className="grid h-9 w-9 place-items-center rounded-full bg-inset text-secondary" onClick={() => shiftMonth(-1)}>
            <ChevronLeft size={16} />
          </Pressable>
          <p className="font-outfit text-base font-semibold">{formatLongMonth(cursor)}</p>
          <Pressable ariaLabel="Bulan berikutnya" className="grid h-9 w-9 place-items-center rounded-full bg-inset text-secondary" onClick={() => shiftMonth(1)}>
            <ChevronRight size={16} />
          </Pressable>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(["month", "week"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 font-manrope text-xs font-bold ${view === v ? "border-secondary bg-inset" : "border-line bg-card"}`}
            >
              {v === "month" ? (
                <>
                  <KawaiiIcon name="calendar-kawaii" size={14} />
                  Tampilan Bulan
                </>
              ) : (
                <>
                  <KawaiiIcon name="sun-happy" size={14} />
                  Tampilan Minggu
                </>
              )}
            </button>
          ))}
        </div>

        {view === "month" ? (
          <>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {WEEKDAY_LABELS.map((label) => (
                <span key={label} className="py-1 text-center font-manrope text-[10px] font-bold text-muted">{label}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthCells.map((cell) => (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => setSelected(cell.iso)}
                  className={`flex min-h-12 flex-col items-center rounded-xl py-1.5 ${selected === cell.iso ? "bg-inset ring-2 ring-secondary" : ""} ${cell.inMonth ? "" : "opacity-35"}`}
                >
                  <span className={`tnum text-xs font-bold ${cell.iso === today ? "grid h-5 w-5 place-items-center rounded-full bg-secondary text-white" : ""}`}>
                    {Number(cell.iso.slice(8))}
                  </span>
                  <Dots iso={cell.iso} />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {weekCells.map((iso, i) => {
              const count = (byDate.get(iso) ?? []).length;
              const done = (byDate.get(iso) ?? []).filter((task) => task.isCompleted).length;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelected(iso)}
                  className={`flex flex-col items-center gap-1 rounded-xl py-2 ${selected === iso ? "bg-inset ring-2 ring-secondary" : "bg-inset/60"}`}
                >
                  <span className="font-manrope text-[10px] font-bold text-muted">{WEEKDAY_LABELS[i]}</span>
                  <span className={`tnum text-sm font-bold ${iso === today ? "grid h-6 w-6 place-items-center rounded-full bg-secondary text-white" : ""}`}>{Number(iso.slice(8))}</span>
                  <span className="tnum font-manrope text-[9px] font-bold text-muted">{count > 0 ? `${done}/${count}` : "•"}</span>
                  <Dots iso={iso} />
                </button>
              );
            })}
          </div>
        )}

        <Pressable
          className="btn-ghost mt-3 h-10 w-full text-xs"
          onClick={() => {
            const now = new Date();
            setCursor(now);
            setSelected(todayISO());
          }}
        >
          <span className="flex items-center justify-center gap-1.5">
            <KawaiiIcon name="cat-alarm-kawaii" size={14} />
            Snap ke Hari Ini
          </span>
        </Pressable>
      </section>

      <NotificationSettingsCard />

      <section>
        <h2 className="mb-2 flex items-center gap-1.5 font-outfit text-lg font-semibold">
          Agenda {selected === today ? "Hari Ini ☀️" : formatIdDate(selected)}
          <KawaiiIcon name="cat-paw-sparkle" size={18} />
        </h2>
        <div className="space-y-3">
          {agenda.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              category={catOf(task.categoryId)}
              onToggle={(id) => void toggleTask(id)}
              onToggleSubtask={(taskId, subId) => void toggleSubtask(taskId, subId)}
              onDelete={(id) => void removeTask(id)}
            />
          ))}
          {agenda.length === 0 && (
            <div className="cloud-card flex flex-col items-center px-4 py-8 text-center">
              <KawaiiMascot size={120} />
              <p className="mt-2 font-manrope text-sm text-muted">Tanggal ini masih kosong. Jadwal meong santai 🐱💤</p>
            </div>
          )}
        </div>
      </section>
    </motion.main>
  );
}
