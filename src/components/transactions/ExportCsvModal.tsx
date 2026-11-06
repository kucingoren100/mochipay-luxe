"use client";

import { AnimatePresence } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Overlay, Pressable } from "@/components/ui/SquircleCard";
import {
  buildCsv,
  buildTsv,
  CSV_COLUMNS,
  DEFAULT_COLUMNS,
  downloadJsonBackup,
  downloadText,
  toMatrix,
  type CsvColumnId,
  type CsvDelimiter,
} from "@/lib/csv-exporter";
import { exportDatabase, importDatabase, isBackupFile } from "@/lib/db";
import { useTransactions, useWallets } from "@/hooks/useLocalDb";
import { bytesLabel, endOfMonth, formatRupiah, startOfMonth, toISODate } from "@/lib/formatters";
import type { TxType } from "@/types/finance";

type RangeKey = "month" | "lastMonth" | "year" | "all" | "custom";
type FlowKey = "all" | TxType;

const RANGES: { id: RangeKey; label: string }[] = [
  { id: "month", label: "Bulan Ini 🌸" },
  { id: "lastMonth", label: "Bulan Lalu 🍂" },
  { id: "year", label: "Tahun Ini 📅" },
  { id: "all", label: "Semua Waktu ♾️" },
  { id: "custom", label: "Kustom 🎯" },
];

const FLOWS: { id: FlowKey; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "expense", label: "Hanya Pengeluaran 💸" },
  { id: "income", label: "Hanya Pemasukan 💰" },
  { id: "transfer", label: "Transfer Dompet 🔁" },
];

const DELIMITERS: { id: CsvDelimiter; label: string }[] = [
  { id: ",", label: "Koma ( , )" },
  { id: ";", label: "Titik Koma ( ; )" },
];

const PAGE_SIZE = 5;

function rangeBounds(key: RangeKey, customStart: string, customEnd: string): [string, string] | null {
  const now = new Date();
  if (key === "all") return null;
  if (key === "month") return [toISODate(startOfMonth(now)), toISODate(endOfMonth(now))];
  if (key === "year") return [`${now.getFullYear()}-01-01`, `${now.getFullYear()}-12-31`];
  if (key === "lastMonth") {
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return [toISODate(startOfMonth(lm)), toISODate(endOfMonth(lm))];
  }
  return [customStart || "0000-01-01", customEnd || "9999-12-31"];
}

export function ExportCsvModal({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: (message: string) => void }) {
  const transactions = useTransactions();
  const wallets = useWallets();
  const fileRef = useRef<HTMLInputElement>(null);
  const [range, setRange] = useState<RangeKey>("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [flow, setFlow] = useState<FlowKey>("all");
  const [walletIds, setWalletIds] = useState<string[]>([]);
  const [columns, setColumns] = useState<CsvColumnId[]>(DEFAULT_COLUMNS);
  const [delimiter, setDelimiter] = useState<CsvDelimiter>(",");
  const [page, setPage] = useState(0);

  const selectedWallets = walletIds.length ? walletIds : wallets.map((wallet) => wallet.id);
  const bounds = useMemo(() => rangeBounds(range, customStart, customEnd), [range, customStart, customEnd]);

  const rows = useMemo(() => {
    return transactions.filter((tx) => {
      if (flow !== "all" && tx.type !== flow) return false;
      if (!selectedWallets.includes(tx.walletId)) return false;
      if (!bounds) return true;
      return tx.date >= bounds[0] && tx.date <= bounds[1];
    });
  }, [transactions, flow, selectedWallets, bounds]);

  const csv = useMemo(() => buildCsv(rows, wallets, columns, delimiter), [rows, wallets, columns, delimiter]);
  const matrix = useMemo(() => toMatrix(rows, wallets, columns), [rows, wallets, columns]);
  const size = new Blob([csv]).size;
  const inflow = rows.filter((row) => row.type === "income").reduce((sum, row) => sum + row.amount, 0);
  const outflow = rows.filter((row) => row.type === "expense").reduce((sum, row) => sum + row.amount, 0);

  const dataRows = matrix.slice(1);
  const pageCount = Math.max(1, Math.ceil(dataRows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const previewRows = dataRows.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
  const headerCells = matrix[0] ?? [];

  const toggleWallet = (id: string) => {
    setWalletIds((current) => {
      const base = current.length ? current : wallets.map((wallet) => wallet.id);
      return base.includes(id) ? base.filter((item) => item !== id) : [...base, id];
    });
  };

  const toggleColumn = (id: CsvColumnId) => {
    setColumns((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    setPage(0);
  };

  const fileName = `mochipay-laporan-keuangan-${toISODate(new Date())}.csv`;

  const copyTsv = async () => {
    try {
      await navigator.clipboard.writeText(buildTsv(rows, wallets, columns));
      onDone("Tabel TSV disalin. Tinggal paste ke Excel/Google Sheets 📋✨");
    } catch {
      onDone("Gagal menyalin ke clipboard. Coba pakai tombol download 🥺");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Overlay onClose={onClose} wide z="z-[68]">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="font-manrope text-[11px] font-bold uppercase tracking-wider text-muted">Download Riwayat CSV</p>
              <h2 className="font-outfit text-2xl font-semibold">Ekspor Laporan Rapi ✨</h2>
            </div>
            <button type="button" aria-label="Tutup ekspor" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-inset">✕</button>
          </div>

          {/* Rentang periode */}
          <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Rentang Periode</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {RANGES.map((item) => (
              <button key={item.id} type="button" onClick={() => { setRange(item.id); setPage(0); }} className={`rounded-full px-3 py-1 font-manrope text-xs font-bold ${range === item.id ? "bg-primary text-on-primary" : "bg-inset"}`}>
                {item.label}
              </button>
            ))}
          </div>
          {range === "custom" && (
            <div className="mt-2 flex flex-wrap gap-2">
              <input type="date" className="inset-field h-10 px-3 text-xs" value={customStart} onChange={(e) => { setCustomStart(e.target.value); setPage(0); }} />
              <input type="date" className="inset-field h-10 px-3 text-xs" value={customEnd} onChange={(e) => { setCustomEnd(e.target.value); setPage(0); }} />
            </div>
          )}

          {/* Alur */}
          <div className="mt-3 flex flex-wrap gap-2">
            {FLOWS.map((item) => (
              <button key={item.id} type="button" onClick={() => { setFlow(item.id); setPage(0); }} className={`rounded-full px-3 py-1 font-manrope text-xs font-bold ${flow === item.id ? "bg-secondary text-white" : "bg-inset"}`}>
                {item.label}
              </button>
            ))}
          </div>

          {/* Dompet */}
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {wallets.map((wallet) => {
              const checked = selectedWallets.includes(wallet.id);
              return (
                <label key={wallet.id} className="flex items-center gap-2 rounded-lg bg-inset px-3 py-2 font-manrope text-sm">
                  <input type="checkbox" checked={checked} onChange={() => { toggleWallet(wallet.id); setPage(0); }} />
                  {wallet.icon} {wallet.name}
                </label>
              );
            })}
          </div>

          {/* Pemisah delimiter */}
          <p className="mt-4 font-manrope text-xs font-bold uppercase tracking-wider text-muted">Pemisah Kolom (Delimiter)</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {DELIMITERS.map((item) => (
              <button key={item.id} type="button" onClick={() => setDelimiter(item.id)} className={`rounded-full px-3 py-1 font-manrope text-xs font-bold ${delimiter === item.id ? "bg-tertiary text-on-primary" : "bg-inset"}`}>
                {item.label}
              </button>
            ))}
          </div>

          {/* Kolom */}
          <div className="mt-4 flex items-center justify-between">
            <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Pilih Kolom</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setColumns(CSV_COLUMNS.map((c) => c.id)); setPage(0); }} className="font-manrope text-xs font-bold text-secondary">Pilih Semua</button>
              <button type="button" onClick={() => { setColumns(DEFAULT_COLUMNS); setPage(0); }} className="font-manrope text-xs font-bold text-muted">Reset ke Default</button>
            </div>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {CSV_COLUMNS.map((column) => {
              const active = columns.includes(column.id);
              return (
                <button
                  key={column.id}
                  type="button"
                  onClick={() => toggleColumn(column.id)}
                  className={`rounded-full px-3 py-1 font-manrope text-xs font-bold ${active ? "bg-tertiary text-on-primary" : "bg-inset"}`}
                >
                  {active ? "✓ " : ""}{column.label}
                </button>
              );
            })}
          </div>

          {/* Pratinjau tabel */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Pratinjau Data</p>
              <span className="tnum font-manrope text-xs text-muted">Halaman {safePage + 1}/{pageCount}</span>
            </div>
            <div className="mt-1.5 max-h-64 overflow-auto rounded-xl border border-line">
              <table className="w-full border-collapse text-left font-manrope text-xs">
                <thead className="sticky top-0 z-10 bg-inset">
                  <tr>
                    {headerCells.map((label, i) => (
                      <th key={i} className="whitespace-nowrap border-b border-line px-3 py-2 font-bold">{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.length === 0 ? (
                    <tr><td colSpan={Math.max(1, headerCells.length)} className="px-3 py-6 text-center text-muted">Tidak ada data untuk filter ini 🌸</td></tr>
                  ) : (
                    previewRows.map((row, r) => (
                      <tr key={r} className="odd:bg-card even:bg-inset/40">
                        {row.map((value, c) => (
                          <td key={c} className="max-w-[180px] truncate whitespace-nowrap border-b border-line px-3 py-2">{value}</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <Pressable className="btn-ghost h-9 px-3 text-xs" disabled={safePage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>← Sebelumnya</Pressable>
              <Pressable className="btn-ghost h-9 px-3 text-xs" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>Berikutnya →</Pressable>
            </div>
          </div>

          {/* Ringkasan berkas */}
          <div className="mt-4 rounded-xl border border-line bg-inset p-4">
            <p className="font-outfit font-semibold">{fileName}</p>
            <p className="mt-1 font-manrope text-sm text-muted">
              {rows.length} baris · {bytesLabel(size)} · Masuk {formatRupiah(inflow)} · Keluar {formatRupiah(outflow)}
            </p>
          </div>

          <div className="mt-4 grid gap-2">
            <Pressable
              className="btn-primary h-12"
              disabled={!rows.length || !columns.length}
              onClick={() => {
                downloadText(fileName, csv, "text/csv;charset=utf-8");
                onDone("Berkas CSV rapi siap dibuka di Excel atau Google Sheets 📥");
              }}
            >
              Download Berkas CSV Rapi 📥
            </Pressable>
            <Pressable className="btn-ghost h-12" disabled={!rows.length || !columns.length} onClick={() => void copyTsv()}>
              Salin ke Clipboard (TSV / Paste ke Excel/Sheets)
            </Pressable>
            <Pressable
              className="btn-ghost h-12"
              onClick={async () => {
                downloadJsonBackup(await exportDatabase());
                onDone("Backup Semua Data Lokal (.json) sudah diunduh ✨");
              }}
            >
              Backup Semua Data Lokal (.json)
            </Pressable>
            <Pressable className="btn-ghost h-12" onClick={() => fileRef.current?.click()}>
              Restore Data dari File (.json)
            </Pressable>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                try {
                  const parsed: unknown = JSON.parse(await file.text());
                  if (!isBackupFile(parsed)) throw new Error("File backup tidak dikenali");
                  await importDatabase(parsed);
                  onDone("Restore berhasil. Buku kas lokal sudah diganti 💖");
                  onClose();
                } catch (err) {
                  onDone(err instanceof Error ? err.message : "Restore gagal");
                }
              }}
            />
          </div>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
