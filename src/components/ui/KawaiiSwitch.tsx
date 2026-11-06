"use client";

import { motion } from "framer-motion";

export function KawaiiSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative h-[30px] w-[52px] shrink-0 rounded-full transition-colors"
      style={{ background: checked ? "var(--secondary)" : "var(--track)" }}
    >
      <motion.span
        className="absolute top-[3px] h-6 w-6 rounded-full bg-white shadow"
        animate={{ left: checked ? 25 : 3 }}
        transition={{ type: "spring", stiffness: 520, damping: 22 }}
      />
    </button>
  );
}
