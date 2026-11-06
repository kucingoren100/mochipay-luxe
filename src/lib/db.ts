import Dexie, { type Table } from "dexie";
import { BUDGET_CATEGORY_MAP, seedBudgets, seedContacts, seedGoals, seedTodoCategories, seedTodoHabits, seedTodoTasks, seedTransactions, seedWallets } from "@/lib/seed-data";
import { makeInvoice, uid } from "@/lib/formatters";
import type { BackupFile, Budget, Contact, Goal, TodoCategory, TodoHabit, TodoTask, Transaction, Wallet } from "@/types/finance";

export class MochiPayLocalDB extends Dexie {
  wallets!: Table<Wallet, string>;
  transactions!: Table<Transaction, string>;
  budgets!: Table<Budget, string>;
  goals!: Table<Goal, string>;
  contacts!: Table<Contact, string>;
  todoCategories!: Table<TodoCategory, string>;
  todoTasks!: Table<TodoTask, string>;
  todoHabits!: Table<TodoHabit, string>;

  constructor() {
    super("MochiPayLocalDB");
    this.version(1).stores({
      wallets: "id, name, type, isLocked",
      transactions: "id, invoiceCode, type, category, walletId, toWalletId, toGoalId, date, book, tag, createdAt",
      budgets: "id, name, period",
      goals: "id, title, isLocked",
      contacts: "id, name, isFavorite",
    });
    this.version(2).stores({
      todoCategories: "id, order",
      todoTasks: "id, categoryId, dueDate, isCompleted, createdAt",
      todoHabits: "id",
    });
  }
}

let dbInstance: MochiPayLocalDB | null = null;

export function getDb(): MochiPayLocalDB {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB tidak tersedia di perangkat ini");
  }
  if (!dbInstance) dbInstance = new MochiPayLocalDB();
  return dbInstance;
}

const tables = () => {
  const db = getDb();
  return [db.wallets, db.transactions, db.budgets, db.goals, db.contacts, db.todoCategories, db.todoTasks, db.todoHabits] as const;
};

async function spentOnDay(walletId: string, date: string, exceptId?: string): Promise<number> {
  const rows = await getDb().transactions.where("walletId").equals(walletId).toArray();
  return rows
    .filter((row) => row.id !== exceptId && row.date === date && row.type === "expense")
    .reduce((sum, row) => sum + row.amount, 0);
}

async function adjustBudget(category: string, delta: number) {
  if (!delta) return;
  const budgets = await getDb().budgets.toArray();
  const mapped = BUDGET_CATEGORY_MAP[category];
  const target = budgets.find((budget) => budget.name === category) ?? budgets.find((budget) => budget.name === mapped);
  if (!target) return;
  await getDb().budgets.update(target.id, {
    spentAmount: Math.max(0, Math.round(target.spentAmount + delta)),
  });
}

async function applyEffect(tx: Transaction, dir: 1 | -1, exceptId?: string) {
  const db = getDb();
  const wallet = await db.wallets.get(tx.walletId);
  if (!wallet) throw new Error("Dompet tidak ketemu");
  if (dir === 1 && wallet.isLocked && tx.type !== "income") {
    throw new Error("Dompet ini lagi dikunci 🔒");
  }
  if (!tx.amount || tx.amount <= 0) throw new Error("Nominal harus lebih dari 0");

  if (tx.type === "expense") {
    const next = wallet.balance - tx.amount * dir;
    if (dir === 1 && next < 0) throw new Error("Saldo kurang, bestie 🥺");
    if (dir === 1 && wallet.dailyLimit > 0) {
      const used = await spentOnDay(wallet.id, tx.date, exceptId);
      if (used + tx.amount > wallet.dailyLimit) {
        const remain = Math.max(0, wallet.dailyLimit - used);
        throw new Error(`Limit harian terlampaui 🎛️. Sisa limit ${remain.toLocaleString("id-ID")}`);
      }
    }
    await db.wallets.update(wallet.id, { balance: next });
    await adjustBudget(tx.category, tx.amount * dir);
    return;
  }

  if (tx.type === "income") {
    await db.wallets.update(wallet.id, { balance: wallet.balance + tx.amount * dir });
    return;
  }

  const sourceNext = wallet.balance - tx.amount * dir;
  if (dir === 1 && sourceNext < 0) throw new Error("Saldo kurang, bestie 🥺");
  await db.wallets.update(wallet.id, { balance: sourceNext });

  if (tx.toWalletId) {
    if (tx.toWalletId === wallet.id) throw new Error("Dompet asal dan tujuan harus beda");
    const dest = await db.wallets.get(tx.toWalletId);
    if (!dest) throw new Error("Dompet tujuan tidak ketemu");
    if (dir === 1 && dest.isLocked) throw new Error("Dompet tujuan lagi dikunci 🔒");
    await db.wallets.update(dest.id, { balance: dest.balance + tx.amount * dir });
    return;
  }

  if (tx.toGoalId) {
    const goal = await db.goals.get(tx.toGoalId);
    if (!goal) throw new Error("Celengan tidak ketemu");
    await db.goals.update(goal.id, { currentAmount: Math.max(0, goal.currentAmount + tx.amount * dir) });
  }
}

export type NewTransactionInput = Omit<Transaction, "id" | "invoiceCode" | "createdAt" | "adminFee"> & {
  adminFee?: number;
  id?: string;
  invoiceCode?: string;
};

export async function createTransaction(input: NewTransactionInput): Promise<Transaction> {
  const db = getDb();
  const record: Transaction = {
    ...input,
    id: input.id ?? uid("tx"),
    invoiceCode: input.invoiceCode ?? makeInvoice(input.date),
    adminFee: input.adminFee ?? 0,
    createdAt: Date.now(),
    tag: input.tag ?? "",
    note: input.note ?? "",
  };
  await db.transaction("rw", [...tables()], async () => {
    await applyEffect(record, 1);
    await db.transactions.add(record);
  });
  return record;
}

export async function updateTransaction(id: string, patch: Partial<Transaction>): Promise<Transaction> {
  const db = getDb();
  let updated!: Transaction;
  await db.transaction("rw", [...tables()], async () => {
    const old = await db.transactions.get(id);
    if (!old) throw new Error("Transaksi tidak ketemu");
    const next: Transaction = { ...old, ...patch, id: old.id, invoiceCode: old.invoiceCode, createdAt: old.createdAt };
    if (!next.receiptImageDataUrl) delete next.receiptImageDataUrl;
    if (!next.toWalletId) delete next.toWalletId;
    if (!next.toGoalId) delete next.toGoalId;
    await applyEffect(old, -1);
    try {
      await applyEffect(next, 1, old.id);
      await db.transactions.put(next);
      updated = next;
    } catch (error) {
      await applyEffect(old, 1, old.id);
      throw error;
    }
  });
  return updated;
}

export async function deleteTransaction(id: string): Promise<void> {
  const db = getDb();
  await db.transaction("rw", [...tables()], async () => {
    const old = await db.transactions.get(id);
    if (!old) throw new Error("Transaksi tidak ketemu");
    await applyEffect(old, -1);
    await db.transactions.delete(id);
  });
}

export async function updateWallet(id: string, patch: Partial<Wallet>): Promise<void> {
  await getDb().wallets.update(id, patch);
}

export async function addWallet(wallet: Wallet): Promise<void> {
  await getDb().wallets.add(wallet);
}

export async function addBudget(budget: Budget): Promise<void> {
  await getDb().budgets.add(budget);
}

export async function updateBudget(id: string, patch: Partial<Budget>): Promise<void> {
  await getDb().budgets.update(id, patch);
}

export async function deleteBudget(id: string): Promise<void> {
  await getDb().budgets.delete(id);
}

export async function scaleBudgetLimits(nextTotal: number): Promise<void> {
  const db = getDb();
  const rows = await db.budgets.toArray();
  const current = rows.reduce((sum, row) => sum + row.limitAmount, 0);
  if (!rows.length || nextTotal <= 0) return;
  if (current <= 0) {
    const share = Math.round(nextTotal / rows.length);
    await db.transaction("rw", db.budgets, async () => {
      for (const row of rows) await db.budgets.update(row.id, { limitAmount: share });
    });
    return;
  }
  let assigned = 0;
  await db.transaction("rw", db.budgets, async () => {
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const limit = index === rows.length - 1 ? nextTotal - assigned : Math.round((row.limitAmount / current) * nextTotal);
      assigned += limit;
      await db.budgets.update(row.id, { limitAmount: Math.max(0, limit) });
    }
  });
}

export async function addGoal(goal: Goal): Promise<void> {
  await getDb().goals.add(goal);
}

export async function updateGoal(id: string, patch: Partial<Goal>): Promise<void> {
  await getDb().goals.update(id, { ...patch });
}

export async function deleteGoal(id: string): Promise<void> {
  const db = getDb();
  const used = await db.transactions.where("toGoalId").equals(id).count();
  if (used > 0) {
    throw new Error("Celengan masih dipakai catatan transfer. Hapus catatan itu dulu ya 🥺");
  }
  await db.goals.delete(id);
}

export async function addContact(contact: Contact): Promise<void> {
  await getDb().contacts.add(contact);
}

export async function addTodoTask(task: TodoTask): Promise<void> {
  await getDb().todoTasks.add(task);
}

export async function updateTodoTask(id: string, patch: Partial<TodoTask>): Promise<void> {
  await getDb().todoTasks.update(id, patch);
}

export async function deleteTodoTask(id: string): Promise<void> {
  await getDb().todoTasks.delete(id);
}

export async function updateTodoHabit(id: string, patch: Partial<TodoHabit>): Promise<void> {
  await getDb().todoHabits.update(id, patch);
}

export async function addTodoHabit(habit: TodoHabit): Promise<void> {
  await getDb().todoHabits.add(habit);
}

export async function deleteTodoHabit(id: string): Promise<void> {
  await getDb().todoHabits.delete(id);
}

export async function addTodoCategory(category: TodoCategory): Promise<void> {
  await getDb().todoCategories.add(category);
}

export async function updateTodoCategory(id: string, patch: Partial<TodoCategory>): Promise<void> {
  await getDb().todoCategories.update(id, patch);
}

export async function deleteTodoCategory(id: string): Promise<void> {
  const used = await getDb().todoTasks.where("categoryId").equals(id).count();
  if (used > 0) {
    throw new Error(`Kategori masih dipakai ${used} tugas. Pindahkan atau hapus tugas itu dulu 🥺`);
  }
  await getDb().todoCategories.delete(id);
}

async function seedTodos() {
  const db = getDb();
  await db.transaction("rw", db.todoCategories, db.todoTasks, db.todoHabits, async () => {
    await db.todoCategories.bulkAdd(seedTodoCategories);
    await db.todoTasks.bulkAdd(seedTodoTasks);
    await db.todoHabits.bulkAdd(seedTodoHabits);
  });
}

async function seedAll() {
  const db = getDb();
  await db.transaction("rw", [...tables()], async () => {
    await db.wallets.bulkAdd(seedWallets);
    await db.budgets.bulkAdd(seedBudgets);
    await db.goals.bulkAdd(seedGoals);
    await db.contacts.bulkAdd(seedContacts);
    await db.transactions.bulkAdd(seedTransactions);
  });
  await seedTodos();
}

let bootPromise: Promise<void> | null = null;

export function bootDatabase(): Promise<void> {
  if (!bootPromise) {
    bootPromise = (async () => {
      if (typeof navigator !== "undefined" && navigator.storage?.persist) {
        try {
          await navigator.storage.persist();
        } catch {
          /* persistence is best-effort */
        }
      }
      const count = await getDb().wallets.count();
      if (count === 0) await seedAll();
      else if ((await getDb().todoCategories.count()) === 0) await seedTodos();
    })().catch((error) => {
      bootPromise = null;
      throw error;
    });
  }
  return bootPromise;
}

export async function resetDatabase(): Promise<void> {
  const db = getDb();
  await db.transaction("rw", [...tables()], async () => {
    await Promise.all(tables().map((table) => table.clear()));
  });
  await seedAll();
}

export async function exportDatabase(): Promise<BackupFile> {
  const db = getDb();
  const [wallets, transactions, budgets, goals, contacts, todoCategories, todoTasks, todoHabits] = await Promise.all([
    db.wallets.toArray(),
    db.transactions.toArray(),
    db.budgets.toArray(),
    db.goals.toArray(),
    db.contacts.toArray(),
    db.todoCategories.toArray(),
    db.todoTasks.toArray(),
    db.todoHabits.toArray(),
  ]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: "mochipay-luxe",
    wallets,
    transactions,
    budgets,
    goals,
    contacts,
    todoCategories,
    todoTasks,
    todoHabits,
  };
}

export function isBackupFile(value: unknown): value is BackupFile {
  if (!value || typeof value !== "object") return false;
  const data = value as BackupFile;
  return (
    data.app === "mochipay-luxe" &&
    Array.isArray(data.wallets) &&
    Array.isArray(data.transactions) &&
    Array.isArray(data.budgets) &&
    Array.isArray(data.goals) &&
    Array.isArray(data.contacts)
  );
}

export async function importDatabase(backup: BackupFile): Promise<void> {
  const db = getDb();
  await db.transaction("rw", [...tables()], async () => {
    await Promise.all(tables().map((table) => table.clear()));
    if (backup.wallets.length) await db.wallets.bulkAdd(backup.wallets);
    if (backup.transactions.length) await db.transactions.bulkAdd(backup.transactions);
    if (backup.budgets.length) await db.budgets.bulkAdd(backup.budgets);
    if (backup.goals.length) await db.goals.bulkAdd(backup.goals);
    if (backup.contacts.length) await db.contacts.bulkAdd(backup.contacts);
    if (backup.todoCategories?.length) await db.todoCategories.bulkAdd(backup.todoCategories);
    if (backup.todoTasks?.length) await db.todoTasks.bulkAdd(backup.todoTasks);
    if (backup.todoHabits?.length) await db.todoHabits.bulkAdd(backup.todoHabits);
  });
  if ((await db.todoCategories.count()) === 0) await seedTodos();
}
