"use client";

import { formatRupiah, WEEKDAY_LABELS } from "@/lib/formatters";

export function WeeklyCashflowChart({
  series,
  message,
  mask,
}: {
  series: { label: string; income: number; expense: number }[];
  message: string;
  mask: boolean;
}) {
  const max = Math.max(1, ...series.flatMap((item) => [item.income, item.expense]));
  return (
    <section className="cloud-card p-5">
      <h2 className="font-outfit text-lg font-semibold">Duit Keluar vs Masuk 📊</h2>
      <p className="font-manrope text-xs text-muted">Sen sampai Min · batang hijau cuan, batang coral jajan</p>
      <div className="mt-4 flex h-40 items-end justify-between gap-2">
        {series.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-32 w-full items-end justify-center gap-1">
              <div className="w-2.5 rounded-full bg-income" style={{ height: `${Math.max(4, (item.income / max) * 100)}%` }} title={mask ? "" : formatRupiah(item.income)} />
              <div className="w-2.5 rounded-full bg-expense" style={{ height: `${Math.max(4, (item.expense / max) * 100)}%` }} title={mask ? "" : formatRupiah(item.expense)} />
            </div>
            <span className="font-manrope text-[11px] font-bold text-muted">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-4 font-manrope text-xs">
        <span className="text-income">● Cuan</span>
        <span className="text-expense">● Jajan</span>
        <span className="text-muted">{WEEKDAY_LABELS.join(" · ")}</span>
      </div>
      <p className="mt-4 rounded-lg bg-inset px-3 py-3 font-manrope text-sm font-semibold">{message}</p>
    </section>
  );
}
