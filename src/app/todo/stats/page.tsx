"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { PRIORITY_META, REPEAT_LABEL, dueLabel } from "@/components/todo/TaskCard";
import { Pressable } from "@/components/ui/SquircleCard";
import { KawaiiIcon } from "@/components/ui/KawaiiIcon";
import { useUi } from "@/components/layout/AppShell";
import { useTodoCategories, useTodoTasks } from "@/hooks/useLocalDb";
import { downloadText } from "@/lib/csv-exporter";
import { addDays, startOfWeek, todayISO, toISODate, WEEKDAY_LABELS } from "@/lib/formatters";

function cell(value: string | number): string {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export default function TodoStatsPage() {
  const ui = useUi();
  const tasks = useTodoTasks();
  const categories = useTodoCategories();
  const today = todayISO();

  const completed = tasks.filter((task) => task.isCompleted);

  const pie = useMemo(() => {
    const total = completed.length || 1;
    return categories
      .map((cat) => ({ cat, count: completed.filter((task) => task.categoryId === cat.id).length }))
      .filter((row) => row.count > 0)
      .map((row) => ({ ...row, frac: row.count / total }));
  }, [completed, categories]);

  const heat = useMemo(() => {
    const counts = new Map<string, number>();
    for (const task of completed) {
      if (task.completedAt == null) continue;
      const iso = toISODate(new Date(task.completedAt));
      counts.set(iso, (counts.get(iso) ?? 0) + 1);
    }
    const start = startOfWeek(addDays(new Date(), -90));
    const weeks: { iso: string; count: number }[][] = [];
    for (let w = 0; w < 14; w += 1) {
      const column: { iso: string; count: number }[] = [];
      for (let d = 0; d < 7; d += 1) {
        const iso = toISODate(addDays(start, w * 7 + d));
        column.push({ iso, count: counts.get(iso) ?? 0 });
      }
      weeks.push(column);
    }
    return weeks;
  }, [completed]);

  const weekStart = startOfWeek(new Date());
  const weekDone = completed.filter((task) => task.completedAt != null && toISODate(new Date(task.completedAt)) >= toISODate(weekStart)).length;
  const score =
    weekDone >= 15
      ? `Meong Super Rajin! 🐱 Kamu menyelesaikan ${weekDone} tugas minggu ini!`
      : weekDone >= 7
        ? `Meong Rajin! 🐱✨ Kamu menyelesaikan ${weekDone} tugas minggu ini!`
        : weekDone > 0
          ? `Meong mulai hangat! 🐾 Kamu menyelesaikan ${weekDone} tugas minggu ini, gas terus!`
          : "Meong masih santai 😴 Belum ada tugas selesai minggu ini, yuk mulai satu!";

  const heatColor = (count: number) => {
    if (count === 0) return "var(--track)";
    if (count === 1) return "color-mix(in srgb, var(--secondary) 35%, var(--track))";
    if (count === 2) return "color-mix(in srgb, var(--secondary) 65%, var(--track))";
    return "var(--secondary)";
  };

  const exportCsv = () => {
    const catName = new Map(categories.map((cat) => [cat.id, `${cat.iconName} ${cat.name}`]));
    const header = ["Judul Tugas", "Kategori", "Prioritas", "Tenggat", "Jam", "Status", "Selesai Pada", "Subtask Selesai", "Pengulangan", "Tag", "Catatan"];
    const body = tasks.map((task) => {
      const doneSubs = task.subtasks.filter((sub) => sub.isDone).length;
      return [
        cell(task.title),
        cell(catName.get(task.categoryId) ?? task.categoryId),
        cell(PRIORITY_META[task.priority].label),
        cell(task.dueDate),
        cell(task.dueTime),
        cell(task.isCompleted ? "Selesai" : "Belum"),
        cell(task.completedAt ? new Date(task.completedAt).toLocaleString("id-ID") : ""),
        cell(`${doneSubs}/${task.subtasks.length}`),
        cell(REPEAT_LABEL[task.repeat] || "Sekali"),
        cell(task.tags.join(" | ")),
        cell(task.note),
      ].join(",");
    });
    const csv = `﻿${header.map(cell).join(",")}\n${body.join("\n")}\n`;
    downloadText("laporan-tugas-cantikk.csv", csv, "text/csv;charset=utf-8");
    ui.toast("laporan-tugas-cantikk.csv sudah diunduh 📊✨");
  };

  let acc = 0;
  const C = 2 * Math.PI * 40;

  return (
    <motion.main initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-outfit text-2xl font-semibold">
            <KawaiiIcon name="chart-bars-kawaii" size={22} />
            Laporan Produktivitas Cantikk
          </h1>
          <p className="font-manrope text-sm text-muted">Seberapa rajin kucingmu beresin tugas? Intip di sini.</p>
        </div>
        <Pressable className="btn-primary flex h-10 shrink-0 items-center gap-2 px-3 text-xs" onClick={exportCsv}>
          <Download size={14} /> CSV
        </Pressable>
      </header>

      <section className="cloud-card p-5">
        <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Skor Produktivitas Kucing Cantikk</p>
        <p className="mt-2 font-outfit text-lg font-semibold leading-7">{score}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-inset p-3">
            <p className="tnum text-xl font-bold">{tasks.length}</p>
            <p className="font-manrope text-[10px] font-bold text-muted">Total Tugas</p>
          </div>
          <div className="rounded-lg bg-inset p-3">
            <p className="tnum text-xl font-bold text-income">{completed.length}</p>
            <p className="font-manrope text-[10px] font-bold text-muted">Selesai</p>
          </div>
          <div className="rounded-lg bg-inset p-3">
            <p className="tnum text-xl font-bold text-expense">{tasks.length - completed.length}</p>
            <p className="font-manrope text-[10px] font-bold text-muted">Aktif</p>
          </div>
        </div>
      </section>

      <section className="cloud-card p-5">
        <h2 className="flex items-center gap-2 font-outfit text-lg font-semibold">
          <KawaiiIcon name="chart-bars-kawaii" size={18} />
          Donat Kategori Selesai
        </h2>
        {pie.length === 0 ? (
          <p className="mt-3 font-manrope text-sm text-muted">Belum ada tugas selesai. Donatnya masih kosong nih 🥺</p>
        ) : (
          <div className="mt-3 flex items-center gap-5">
            <svg viewBox="0 0 100 100" className="h-36 w-36 shrink-0 -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--track)" strokeWidth="14" />
              {pie.map((row) => {
                const dash = row.frac * C;
                const offset = -acc * C;
                acc += row.frac;
                return (
                  <circle key={row.cat.id} cx="50" cy="50" r="40" fill="none" stroke={row.cat.color} strokeWidth="14" strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={offset} />
                );
              })}
            </svg>
            <div className="min-w-0 flex-1 space-y-1.5">
              {pie.map((row) => (
                <div key={row.cat.id} className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: row.cat.color }} />
                  <span className="min-w-0 flex-1 truncate font-manrope text-xs font-semibold">{row.cat.iconName} {row.cat.name}</span>
                  <span className="tnum font-manrope text-xs font-bold text-muted">{row.count} • {Math.round(row.frac * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="cloud-card p-5">
        <h2 className="flex items-center gap-2 font-outfit text-lg font-semibold">
          <KawaiiIcon name="chart-bars-kawaii" size={18} />
          Peta Rajin 3 Bulan Terakhir
        </h2>
        <p className="mt-1 font-manrope text-xs text-muted">Tiap kotak = satu hari. Makin pekat, makin banyak tugas diberesin.</p>
        <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
          <div className="mr-1 grid grid-rows-7 gap-1">
            {WEEKDAY_LABELS.map((label, i) => (
              <span key={label} className="grid h-4 place-items-center font-manrope text-[8px] font-bold text-muted">{i % 2 === 0 ? label : ""}</span>
            ))}
          </div>
          {heat.map((week, w) => (
            <div key={w} className="grid grid-rows-7 gap-1">
              {week.map((day) => (
                <span
                  key={day.iso}
                  title={`${day.iso}: ${day.count} tugas selesai`}
                  className="h-4 w-4 rounded-[4px]"
                  style={{ background: heatColor(day.count), opacity: day.iso > today ? 0.3 : 1 }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-end gap-1 font-manrope text-[10px] font-bold text-muted">
          Santai
          {[0, 1, 2, 3].map((level) => (
            <span key={level} className="h-3 w-3 rounded-[3px]" style={{ background: heatColor(level) }} />
          ))}
          Rajin
        </div>
      </section>

      <section className="cloud-card p-5">
        <h2 className="flex items-center gap-2 font-outfit text-lg font-semibold">
          <KawaiiIcon name="bell-kawaii" size={18} />
          Tenggat Terdekat
        </h2>
        <div className="mt-2 space-y-1.5">
          {tasks
            .filter((task) => !task.isCompleted)
            .slice(0, 5)
            .map((task) => {
              const due = dueLabel(task);
              return (
                <div key={task.id} className="flex items-center justify-between gap-2 rounded-lg bg-inset px-3 py-2">
                  <span className="min-w-0 flex-1 truncate font-manrope text-xs font-semibold">{task.title}</span>
                  <span className={`shrink-0 font-manrope text-[10px] font-bold ${due.overdue ? "text-expense" : "text-muted"}`}>{due.text}</span>
                </div>
              );
            })}
          {tasks.filter((task) => !task.isCompleted).length === 0 && (
            <p className="font-manrope text-sm text-muted">Semua tugas beres! Meong boleh tidur dulu 🐱💤</p>
          )}
        </div>
      </section>
    </motion.main>
  );
}
