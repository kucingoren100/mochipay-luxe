"use client";

import { Pressable } from "@/components/ui/SquircleCard";
import { KawaiiIcon, type KawaiiIconName } from "@/components/ui/KawaiiIcon";

const ACTIONS = [
  { id: "catat", label: "Catat Cuan", hint: "Manual Log", icon: "pill-ledger" },
  { id: "riwayat", label: "Riwayat & Analisis", hint: "Lihat buku kas", icon: "pill-category" },
  { id: "csv", label: "Download CSV", hint: "Backup", icon: "pill-bookmark" },
] as const satisfies readonly { id: string; label: string; hint: string; icon: KawaiiIconName }[];

export function QuickActionsGrid({ onAction }: { onAction: (id: (typeof ACTIONS)[number]["id"]) => void }) {
  return (
    <section>
      <h2 className="mb-3 font-outfit text-lg font-semibold">Aksi Cepat Sat-Set ⚡</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ACTIONS.map((action) => (
          <Pressable key={action.id} onClick={() => onAction(action.id)} className="cloud-card flex flex-col items-start gap-3 p-4 text-left">
            <KawaiiIcon name={action.icon} size={30} badge className="h-11 w-11" />
            <span>
              <span className="block font-outfit text-base font-semibold">{action.label}</span>
              <span className="block font-manrope text-xs text-muted">{action.hint}</span>
            </span>
          </Pressable>
        ))}
      </div>
    </section>
  );
}
