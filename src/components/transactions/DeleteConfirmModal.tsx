"use client";

import { AnimatePresence } from "framer-motion";
import { Overlay, Pressable } from "@/components/ui/SquircleCard";

export function DeleteConfirmModal({
  open,
  busy,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <Overlay onClose={onCancel} z="z-[80]">
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-inset text-3xl">🥺</div>
            <h3 className="mt-3 font-outfit text-2xl font-semibold">Yakin Mau Hapus Catatan Ini? 🥺</h3>
            <p className="mt-2 font-manrope text-sm leading-6 text-muted">
              Transaksi bakal hilang permanen dari buku kas dan saldo dompet kamu bakal dikembaliin otomatis lho!
            </p>
            <div className="mt-5 grid gap-2">
              <Pressable className="btn-danger h-12" onClick={onConfirm} disabled={busy}>
                {busy ? "Menghapus…" : "Ya, Hapus Aja 🗑️"}
              </Pressable>
              <Pressable className="btn-ghost h-12" onClick={onCancel}>
                Gak Jadi, Simpan Aja 💖
              </Pressable>
            </div>
          </div>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
