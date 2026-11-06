"use client";

import { Eye, EyeOff } from "lucide-react";
import { PeekingMascot } from "@/components/ui/PeekingMascot";
import { Pressable } from "@/components/ui/SquircleCard";
import { formatRupiah } from "@/lib/formatters";

export function HeroBalanceCard({
  total,
  mask,
  onToggleMask,
  growthLabel,
  inflow,
  outflow,
  limitLabel,
}: {
  total: number;
  mask: boolean;
  onToggleMask: () => void;
  growthLabel: string;
  inflow: number;
  outflow: number;
  limitLabel: string;
}) {
  return (
    <section className="cloud-card relative overflow-hidden p-5 sm:p-6">
      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-primary/40 blur-2xl" />
      <PeekingMascot size={54} variant="sit" className="absolute right-14 top-1" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Dompet Mochi 🐰</p>
          <h2 className="font-outfit text-lg font-semibold">Total Cuan Kamu / Duit Dingin</h2>
        </div>
        <Pressable ariaLabel={mask ? "Tampilkan saldo" : "Sembunyikan saldo"} className="grid h-10 w-10 place-items-center rounded-full bg-inset" onClick={onToggleMask}>
          {mask ? <EyeOff size={18} /> : <Eye size={18} />}
        </Pressable>
      </div>
      <p className="tnum relative mt-3 text-4xl font-bold sm:text-5xl">{formatRupiah(total, mask)}</p>
      <span className="chip-income relative mt-3 inline-flex rounded-full px-3 py-1 font-manrope text-[11px] font-bold">{growthLabel}</span>
      <div className="relative mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-inset p-3">
          <p className="font-manrope text-xs text-muted">Masuk</p>
          <p className="tnum text-lg font-bold text-income">{formatRupiah(inflow, mask)}</p>
        </div>
        <div className="rounded-lg bg-inset p-3">
          <p className="font-manrope text-xs text-muted">Jajan</p>
          <p className="tnum text-lg font-bold text-expense">{formatRupiah(outflow, mask)}</p>
        </div>
      </div>
      <p className="relative mt-3 inline-flex rounded-full bg-tertiary px-3 py-1 font-manrope text-xs font-bold text-on-primary">{limitLabel}</p>
    </section>
  );
}
