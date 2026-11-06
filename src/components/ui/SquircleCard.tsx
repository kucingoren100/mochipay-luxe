"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SquircleCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`cloud-card p-4 sm:p-6 ${className}`}>{children}</section>;
}

export function Overlay({
  children,
  onClose,
  wide = false,
  z = "z-[70]",
}: {
  children: ReactNode;
  onClose?: () => void;
  wide?: boolean;
  z?: string;
}) {
  return (
    <div className={`fixed inset-0 ${z} flex items-end justify-center sm:items-center`}>
      <button aria-label="Tutup lapisan" className="absolute inset-0 bg-[#2E2A36]/45" onClick={onClose} />
      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className={`relative max-h-[92vh] w-full overflow-y-auto bg-card p-4 shadow-float sm:rounded-xl sm:p-6 ${
          wide ? "max-w-3xl" : "max-w-lg"
        } rounded-t-[1.75rem]`}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function Pressable({
  children,
  className = "",
  onClick,
  type = "button",
  disabled,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      whileTap={{ scale: 0.97, y: 1 }}
      onClick={onClick}
      className={`disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </motion.button>
  );
}
