"use client";

import { Download, Share } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Overlay, Pressable } from "@/components/ui/SquircleCard";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { bytesLabel } from "@/lib/formatters";

export function InstallPwaBanner() {
  const pwa = usePwaInstall();
  return (
    <>
      {!pwa.installed && <div className="mx-4 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card px-4 py-3 shadow-cloud lg:mx-0">
        <div>
          <p className="font-outfit font-semibold">Download Aplikasi ke HP / Laptop 📲</p>
          <p className="font-manrope text-xs text-muted">Pasang MochiMoy biar buku kas tetap kebuka tanpa internet.</p>
        </div>
        <Pressable className="btn-primary h-10 px-4 text-sm" onClick={() => void pwa.requestInstall()}>
          Install App
        </Pressable>
      </div>}
      <InstallHelp />
    </>
  );
}

export function InstallHelp() {
  const pwa = usePwaInstall();
  const usage = pwa.usage.usage ?? 0;
  const quota = pwa.usage.quota ?? 0;
  return (
    <AnimatePresence>
      {pwa.helpOpen && (
        <Overlay onClose={() => pwa.setHelpOpen(false)}>
          <h3 className="font-outfit text-2xl font-semibold">{pwa.ios ? "Cara Install di iPhone/iPad" : "Pasang MochiMoy"}</h3>
          {pwa.ios ? (
            <ol className="mt-3 space-y-2 font-manrope text-sm leading-6">
              <li className="flex items-center gap-2"><Share size={16} /> Buka menu Share di Safari.</li>
              <li>Pilih <strong>Add to Home Screen</strong>.</li>
              <li>Ketuk Add. Ikon kelinci mochi muncul di layar utama.</li>
            </ol>
          ) : (
            <p className="mt-3 font-manrope text-sm leading-6 text-muted">
              {pwa.canInstall
                ? "Browser ini siap memasang aplikasi. Ketuk Install sekali lagi untuk memunculkan dialog sistem."
                : pwa.installed
                  ? "Aplikasi sudah terpasang dan berjalan mandiri."
                  : "Kalau dialog instal belum muncul, pakai Chrome, Edge, atau Samsung Internet lalu buka menu browser → Install app."}
            </p>
          )}
          <div className="mt-4 rounded-lg bg-inset p-3 font-manrope text-sm">
            <p>Penyimpanan persisten: {pwa.persisted ? "aktif, database tidak mudah terhapus 🔒" : "menunggu izin perangkat"}</p>
            <p className="mt-1">Pemakaian IndexedDB: {bytesLabel(usage)}{quota ? ` dari ${bytesLabel(quota)}` : ""}</p>
          </div>
          {!pwa.ios && !pwa.installed && (
            <Pressable className="btn-primary mt-4 flex h-11 w-full items-center justify-center gap-2" onClick={() => void pwa.requestInstall()}>
              <Download size={16} /> Download Aplikasi
            </Pressable>
          )}
        </Overlay>
      )}
    </AnimatePresence>
  );
}
