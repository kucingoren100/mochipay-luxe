"use client";

import { AnimatePresence, motion } from "framer-motion";

export interface ToastItem {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function KawaiiToast({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[90] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -12, opacity: 0 }}
            className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border border-line bg-card px-4 py-3 shadow-float"
          >
            <span className="text-xl" aria-hidden>✨</span>
            <div className="min-w-0 flex-1">
              <p className="font-manrope text-sm font-semibold text-foreground">{toast.message}</p>
              {toast.actionLabel && toast.onAction && (
                <button type="button" className="mt-1 font-manrope text-xs font-bold text-secondary" onClick={toast.onAction}>
                  {toast.actionLabel}
                </button>
              )}
            </div>
            <button type="button" aria-label="Tutup notifikasi" className="text-muted" onClick={() => onDismiss(toast.id)}>
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
