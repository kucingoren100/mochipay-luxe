import type { BackupFile, Transaction, TxType, Wallet } from "@/types/finance";
import { formatRupiah } from "@/lib/formatters";

export type CsvColumnId =
  | "no"
  | "id"
  | "date"
  | "time"
  | "type"
  | "category"
  | "amountNumber"
  | "amountRupiah"
  | "wallet"
  | "destination"
  | "book"
  | "tag"
  | "note"
  | "receiptStatus";

export type CsvDelimiter = "," | ";";

export interface CsvColumn {
  id: CsvColumnId;
  label: string;
}

export const CSV_COLUMNS: CsvColumn[] = [
  { id: "no", label: "No." },
  { id: "id", label: "ID Transaksi" },
  { id: "date", label: "Tanggal" },
  { id: "time", label: "Waktu (HH:mm WIB)" },
  { id: "type", label: "Tipe" },
  { id: "category", label: "Kategori" },
  { id: "amountNumber", label: "Nominal Angka (IDR)" },
  { id: "amountRupiah", label: "Format Rupiah" },
  { id: "wallet", label: "Dompet/Sumber" },
  { id: "destination", label: "Tujuan/Penerima" },
  { id: "book", label: "Buku Kas" },
  { id: "tag", label: "Tag/Label" },
  { id: "note", label: "Catatan" },
  { id: "receiptStatus", label: "Status Struk" },
];

export const DEFAULT_COLUMNS: CsvColumnId[] = CSV_COLUMNS.map((column) => column.id);

const TYPE_LABEL: Record<TxType, string> = {
  expense: "Pengeluaran",
  income: "Pemasukan",
  transfer: "Transfer",
};

// Buang emoji/piktograf mentah supaya kolom Kategori bersih teks saja.
function stripEmoji(text: string): string {
  return text
    .replace(/[\p{Extended_Pictographic}\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeNote(text: string): string {
  return text.replace(/\r?\n/g, " - ").replace(/\s+/g, " ").trim();
}

// RFC4180: bungkus sel yang memuat koma, titik-koma, kutip, atau newline; gandakan kutip internal.
function cell(value: string | number): string {
  const text = String(value ?? "");
  if (/[,;"\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function signedAmount(tx: Transaction): number {
  const amount = Math.round(tx.amount);
  return tx.type === "income" ? amount : -amount;
}

interface Summary {
  count: number;
  inflow: number;
  outflow: number;
  net: number;
  totalSigned: number;
}

function summarize(rows: Transaction[]): Summary {
  let inflow = 0;
  let outflow = 0;
  let totalSigned = 0;
  for (const row of rows) {
    if (row.type === "income") inflow += row.amount;
    else if (row.type === "expense") outflow += row.amount;
    totalSigned += signedAmount(row);
  }
  return { count: rows.length, inflow, outflow, net: inflow - outflow, totalSigned };
}

function rowValues(row: Transaction, index: number, walletName: Map<string, string>): Record<CsvColumnId, string | number> {
  const source = walletName.get(row.walletId) ?? row.walletId;
  let destination = row.contactName ?? "";
  if (row.type === "transfer" && row.toWalletId) destination = walletName.get(row.toWalletId) ?? row.toWalletId;
  return {
    no: index + 1,
    id: row.invoiceCode || row.id,
    date: row.date,
    time: `${row.time} WIB`,
    type: TYPE_LABEL[row.type],
    category: stripEmoji(row.category),
    amountNumber: signedAmount(row),
    amountRupiah: formatRupiah(signedAmount(row)),
    wallet: source,
    destination,
    book: row.book,
    tag: row.tag,
    note: normalizeNote(row.note),
    receiptStatus: row.receiptImageDataUrl ? "Ada Struk" : "Tanpa Struk",
  };
}

export function buildCsv(
  rows: Transaction[],
  wallets: Wallet[],
  columns: CsvColumnId[],
  delimiter: CsvDelimiter = ",",
): string {
  const walletName = new Map(wallets.map((wallet) => [wallet.id, wallet.name]));
  const summary = summarize(rows);
  const selected = CSV_COLUMNS.filter((column) => columns.includes(column.id));

  // Baris 1 langsung header kolom, biar sama persis dengan tabel pratinjau.
  const header = selected.map((column) => cell(column.label)).join(delimiter);

  const body = rows.map((row, index) => {
    const values = rowValues(row, index, walletName);
    return selected.map((column) => cell(values[column.id])).join(delimiter);
  });

  // Baris TOTAL, sejajar dengan kolom terpilih.
  const totalCells = selected.map((column, index) => {
    if (index === 0) return `"TOTAL"`;
    if (column.id === "amountNumber") return cell(summary.totalSigned);
    if (column.id === "amountRupiah") return cell(formatRupiah(summary.totalSigned));
    return "";
  });

  const lines = [header, ...body, totalCells.join(delimiter)];
  return `\uFEFF${lines.join("\n")}\n`;
}

// TSV untuk clipboard (paste langsung ke Excel/Google Sheets): tanpa BOM & tanpa baris metadata.
export function buildTsv(
  rows: Transaction[],
  wallets: Wallet[],
  columns: CsvColumnId[],
): string {
  const walletName = new Map(wallets.map((wallet) => [wallet.id, wallet.name]));
  const summary = summarize(rows);
  const selected = CSV_COLUMNS.filter((column) => columns.includes(column.id));
  const clean = (value: string | number) => String(value ?? "").replace(/[\t\r\n]+/g, " ");

  const header = selected.map((column) => clean(column.label)).join("\t");
  const body = rows.map((row, index) => {
    const values = rowValues(row, index, walletName);
    return selected.map((column) => clean(values[column.id])).join("\t");
  });
  const totalCells = selected.map((column, index) => {
    if (index === 0) return "TOTAL";
    if (column.id === "amountNumber") return String(summary.totalSigned);
    if (column.id === "amountRupiah") return clean(formatRupiah(summary.totalSigned));
    return "";
  });
  return [header, ...body, totalCells.join("\t")].join("\n");
}

// Matriks mentah (tanpa escaping/BOM) untuk tabel pratinjau di modal.
export function toMatrix(
  rows: Transaction[],
  wallets: Wallet[],
  columns: CsvColumnId[],
): string[][] {
  const walletName = new Map(wallets.map((wallet) => [wallet.id, wallet.name]));
  const selected = CSV_COLUMNS.filter((column) => columns.includes(column.id));
  const summary = summarize(rows);
  const header = selected.map((column) => column.label);
  const body = rows.map((row, index) => {
    const values = rowValues(row, index, walletName);
    return selected.map((column) => String(values[column.id] ?? ""));
  });
  const totalCells = selected.map((column, index) => {
    if (index === 0) return "TOTAL";
    if (column.id === "amountNumber") return String(summary.totalSigned);
    if (column.id === "amountRupiah") return formatRupiah(summary.totalSigned);
    return "";
  });
  return [header, ...body, totalCells];
}

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return blob.size;
}

export function downloadJsonBackup(backup: BackupFile) {
  const content = JSON.stringify(backup, null, 2);
  downloadText(`mochipay-luxe-backup-${backup.exportedAt.slice(0, 10)}.json`, content, "application/json");
}
