"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Pressable } from "@/components/ui/SquircleCard";
import { KawaiiIcon, type KawaiiIconName } from "@/components/ui/KawaiiIcon";
import { emojiToKawaii } from "@/components/ui/iconPacks/todo";
import { formatIdDate, parseISODate, todayISO } from "@/lib/formatters";
import type { TodoCategory, TodoTask } from "@/types/finance";

export const PRIORITY_META: Record<TodoTask["priority"], { label: string; icon: KawaiiIconName; color: string }> = {
  high: { label: "Tinggi", icon: "flame-high", color: "#EA7B7B" },
  medium: { label: "Sedang", icon: "dot-alert", color: "#E8AA42" },
  low: { label: "Santai", icon: "leaf-calm", color: "#98D8AA" },
};

export const REPEAT_LABEL: Record<TodoTask["repeat"], string> = {
  none: "",
  daily: "Harian",
  weekly: "Mingguan",
  monthly: "Bulanan",
};

const CONFETTI = ["#F4A6CD", "#B8A7E0", "#98D8AA", "#F8B896", "#99C8F5", "#E8AA42"];

export function dueLabel(task: TodoTask): { text: string; overdue: boolean } {
  const today = todayISO();
  if (task.dueDate === today) return { text: `Hari ini • ${task.dueTime} WIB`, overdue: false };
  if (task.dueDate < today) {
    const days = Math.max(1, Math.round((parseISODate(today).getTime() - parseISODate(task.dueDate).getTime()) / 86_400_000));
    return { text: `Lewat ${days} hari • ${task.dueTime} WIB`, overdue: true };
  }
  return { text: `${formatIdDate(task.dueDate)} • ${task.dueTime} WIB`, overdue: false };
}

function ConfettiBurst() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden>
      {CONFETTI.map((color, i) => {
        const angle = (i / CONFETTI.length) * Math.PI * 2;
        return (
          <motion.span
            key={color}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: Math.cos(angle) * 44, y: Math.sin(angle) * 44, scale: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-[2px]"
            style={{ background: color }}
          />
        );
      })}
    </span>
  );
}

export function TaskCard({
  task,
  category,
  onToggle,
  onToggleSubtask,
  onDelete,
  onEdit,
}: {
  task: TodoTask;
  category?: TodoCategory;
  onToggle: (id: string) => void;
  onToggleSubtask: (taskId: string, subId: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [burst, setBurst] = useState(0);
  const due = dueLabel(task);
  const doneSubs = task.subtasks.filter((sub) => sub.isDone).length;
  const priority = PRIORITY_META[task.priority];

  const handleToggle = () => {
    if (!task.isCompleted) {
      setBurst((current) => current + 1);
      window.setTimeout(() => setBurst(0), 800);
    }
    onToggle(task.id);
  };

  return (
    <div className="cloud-card relative p-4">
      {burst > 0 && <ConfettiBurst key={burst} />}
      <div className="flex items-start gap-3">
        <Pressable
          ariaLabel={task.isCompleted ? `Tandai ${task.title} belum selesai` : `Tandai ${task.title} selesai`}
          className={`relative grid h-7 w-7 shrink-0 place-items-center rounded-xl border-2 ${task.isCompleted ? "border-secondary bg-secondary text-white" : "border-line bg-inset"}`}
          onClick={handleToggle}
        >
          <motion.span
            key={task.isCompleted ? "done" : "open"}
            initial={{ scale: 0.7 }}
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{ duration: 0.35 }}
            className="grid place-items-center"
          >
            {task.isCompleted ? (
              <Check size={15} strokeWidth={3} />
            ) : (
              <KawaiiIcon name="paw-double" size={14} className="opacity-30" />
            )}
          </motion.span>
        </Pressable>
        <button type="button" onClick={() => setOpen((current) => !current)} className="min-w-0 flex-1 text-left">
          <p className={`font-outfit text-sm font-semibold leading-5 ${task.isCompleted ? "text-muted line-through" : ""}`}>{task.title}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {category && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-manrope text-[10px] font-bold text-white" style={{ background: category.color }}>
                <KawaiiIcon name={emojiToKawaii(category.iconName)} size={12} />
                {category.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-inset px-2 py-0.5 font-manrope text-[10px] font-bold" style={{ color: priority.color }}>
              <KawaiiIcon name={priority.icon} size={12} />
              {priority.label}
            </span>
            <span className={`rounded-full px-2 py-0.5 font-manrope text-[10px] font-bold ${due.overdue && !task.isCompleted ? "bg-expense text-white" : "bg-inset text-muted"}`}>
              {due.text}
            </span>
            {REPEAT_LABEL[task.repeat] && (
              <span className="inline-flex items-center gap-1 rounded-full bg-inset px-2 py-0.5 font-manrope text-[10px] font-bold text-muted">
                <KawaiiIcon name="repeat-loop" size={12} />
                {REPEAT_LABEL[task.repeat]}
              </span>
            )}
            {task.subtasks.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-inset px-2 py-0.5 font-manrope text-[10px] font-bold text-secondary">
                {doneSubs}/{task.subtasks.length} subtask
                <span className="ml-1 inline-block h-1.5 w-10 overflow-hidden rounded-full bg-inset">
                  <span className="block h-full rounded-full bg-secondary" style={{ width: `${(doneSubs / task.subtasks.length) * 100}%` }} />
                </span>
              </span>
            )}
          </div>
        </button>
        <ChevronDown size={16} className={`mt-1 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2 border-t border-line pt-3">
              {task.note && <p className="font-manrope text-xs leading-5 text-muted">{task.note}</p>}
              {task.subtasks.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onToggleSubtask(task.id, sub.id)}
                  className="flex w-full items-center gap-2 rounded-lg bg-inset px-3 py-2 text-left"
                >
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-lg border ${sub.isDone ? "border-secondary bg-secondary text-white" : "border-line bg-card"}`}>
                    {sub.isDone ? <Check size={11} strokeWidth={3} /> : <KawaiiIcon name="paw-double" size={10} className="opacity-30" />}
                  </span>
                  <span className={`font-manrope text-xs font-semibold ${sub.isDone ? "text-muted line-through" : ""}`}>{sub.text}</span>
                </button>
              ))}
              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary/15 px-2 py-0.5 font-manrope text-[10px] font-bold text-secondary">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                {onEdit && (
                  <Pressable className="flex h-9 flex-1 items-center justify-center gap-2 rounded-full bg-inset px-3 font-manrope text-xs font-bold text-secondary" onClick={() => onEdit(task.id)}>
                    <Pencil size={13} /> Edit Tugas
                  </Pressable>
                )}
                <Pressable ariaLabel={`Hapus tugas ${task.title}`} className="flex h-9 flex-1 items-center justify-center gap-2 rounded-full bg-inset px-3 font-manrope text-xs font-bold text-expense" onClick={() => onDelete(task.id)}>
                  <Trash2 size={13} /> Hapus Tugas
                </Pressable>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
