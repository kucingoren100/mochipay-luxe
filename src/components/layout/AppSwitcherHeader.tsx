"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KawaiiIcon, type KawaiiIconName } from "@/components/ui/KawaiiIcon";

const MODES: { id: "finance" | "todo"; label: string; icon: KawaiiIconName; href: string }[] = [
  { id: "finance", label: "Keuangan", icon: "pouch-cuan", href: "/" },
  { id: "todo", label: "Cantikk Todo", icon: "cat-paw-sparkle", href: "/todo" },
];

export function AppSwitcherHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const active = pathname.startsWith("/todo") ? "todo" : "finance";

  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-full bg-inset p-1" role="tablist" aria-label="Pilih aplikasi">
        {MODES.map((mode) => {
          const isActive = active === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                if (!isActive) router.push(mode.href);
              }}
              className={`relative rounded-full px-4 py-2 font-manrope text-xs font-bold transition-colors ${isActive ? "text-white" : "text-muted hover:text-secondary"}`}
            >
              {isActive && (
                <motion.span
                  layoutId="app-switcher-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-secondary"
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <KawaiiIcon name={mode.icon} size={16} />
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
