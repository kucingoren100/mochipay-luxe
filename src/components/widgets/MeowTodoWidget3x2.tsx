"use client";

import { ChevronsUp, Pencil } from "lucide-react";
import { todayISO } from "@/lib/formatters";
import type { TodoCategory, TodoTask } from "@/types/finance";

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const dueLabel = (iso: string) => `${MONTH_SHORT[Number(iso.slice(5, 7)) - 1]} ${iso.slice(8, 10)}`;

export function MeowTodoWidget3x2({
  tasks,
  categories,
  onQuickAdd,
}: {
  tasks: TodoTask[];
  categories: TodoCategory[];
  onQuickAdd?: () => void;
}) {
  const catOf = (id: string) => categories.find((cat) => cat.id === id);
  const today = todayISO();
  const upcoming = tasks
    .filter((task) => !task.isCompleted && task.dueDate >= today)
    .sort((a, b) => `${a.dueDate}${a.dueTime}`.localeCompare(`${b.dueDate}${b.dueTime}`))
    .slice(0, 4);

  return (
    <div className="relative w-[320px] rounded-[28px] border border-[#EFE8DD] bg-[#FDFBF7] p-4 shadow-md">
      <div className="flex items-center justify-between">
        <p className="font-outfit text-[13px] font-bold text-[#4A4036]">🐱 Meow Todo</p>
        <p className="font-manrope text-[10px] font-bold text-[#A79B8C]">{upcoming.length} tugas</p>
      </div>
      <div className="mt-2 space-y-1.5">
        {upcoming.map((task, i) => {
          const cat = catOf(task.categoryId);
          return (
            <div key={task.id} className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 ${i % 2 === 0 ? "bg-[#EAF6EC]" : "bg-[#FDEEE3]"}`}>
              <span className="min-w-0 flex-1 truncate rounded-full px-2 py-0.5 font-manrope text-[10px] font-bold text-white" style={{ background: cat?.color ?? "#CBB094" }}>
                {cat ? `${cat.iconName} ${cat.name}` : "Lainnya"}
              </span>
              <span className="tnum shrink-0 font-manrope text-[10px] font-bold text-[#6B5F52]">{dueLabel(task.dueDate)}</span>
              {task.priority === "high" && <ChevronsUp size={13} className="shrink-0 text-[#D93829]" aria-label="Prioritas tinggi" />}
            </div>
          );
        })}
        {upcoming.length === 0 && (
          <div className="rounded-xl bg-[#EAF6EC] px-2.5 py-4 text-center font-manrope text-[11px] text-[#6B5F52]">
            Belum ada tugas mendatang — meong santai dulu 🐾
          </div>
        )}
      </div>
      <button
        type="button"
        aria-label="Tambah tugas cepat dari widget"
        onClick={onQuickAdd}
        className="absolute -bottom-1.5 -right-1.5 grid h-11 w-11 -rotate-6 place-items-center rounded-full border-2 border-white bg-[#D9534F] text-white shadow-sm"
      >
        <Pencil size={18} />
      </button>
    </div>
  );
}
