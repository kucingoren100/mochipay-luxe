"use client";

import { todayISO, WEEKDAY_LABELS } from "@/lib/formatters";
import type { TodoCategory, TodoTask } from "@/types/finance";

export function MeowCalendarWidget3x2({ tasks, categories }: { tasks: TodoTask[]; categories: TodoCategory[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const today = todayISO();
  const catOf = (id: string) => categories.find((cat) => cat.id === id);

  const byDate = new Map<string, TodoTask[]>();
  for (const task of tasks) {
    if (!task.dueDate.startsWith(prefix)) continue;
    const list = byDate.get(task.dueDate) ?? [];
    list.push(task);
    byDate.set(task.dueDate, list);
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="w-[320px] rounded-[28px] border border-[#EFE8DD] bg-[#FDFBF7] p-4 shadow-md">
      <div className="flex items-center justify-between">
        <p className="font-outfit text-[13px] font-bold text-[#4A4036]">🗓️ Jadwal {now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>
        <p className="font-manrope text-[10px] font-bold text-[#A79B8C]">{byDate.size} hari aktif</p>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-y-1.5">
        {WEEKDAY_LABELS.map((w) => (
          <span key={w} className="text-center font-manrope text-[9px] font-bold text-[#A79B8C]">{w}</span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`blank-${i}`} />;
          const iso = `${prefix}-${String(day).padStart(2, "0")}`;
          const list = byDate.get(iso) ?? [];
          const icons = [...new Set(list.map((task) => catOf(task.categoryId)?.iconName).filter((icon): icon is string => !!icon))].slice(0, 2);
          const extraDots = Math.min(3, Math.max(0, list.length - icons.length));
          const isToday = iso === today;
          return (
            <div key={iso} className={`mx-auto grid h-[34px] w-[34px] place-items-center rounded-full ${isToday ? "bg-[#FFE4EF] ring-2 ring-[#F4A6CD]" : ""}`}>
              <span className="tnum -mb-0.5 font-manrope text-[10px] font-bold text-[#4A4036]">{day}</span>
              <span className="flex h-2.5 items-center gap-0.5 leading-none">
                {icons.map((icon) => (
                  <span key={icon} className="text-[8px]">{icon}</span>
                ))}
                {Array.from({ length: extraDots }, (_, d) => (
                  <span key={`dot-${d}`} className="h-1 w-1 rounded-full bg-[#F4618F]" />
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
