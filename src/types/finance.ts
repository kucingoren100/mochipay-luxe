export type WalletType = "bank" | "ewallet" | "cash" | "card";
export type TxType = "expense" | "income" | "transfer";
export type Book = "Pribadi" | "Bisnis";
export type ThemeMode = "light" | "dark" | "system";
export type PaletteId =
  | "lavender"
  | "strawberry"
  | "peachy"
  | "matcha"
  | "sky"
  | "cocoa"
  | "sienna-artsy";

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  maskedNumber: string;
  expiryLabel: string;
  securityLabel: string;
  holderName: string;
  skinPreset: PaletteId;
  isLocked: boolean;
  dailyLimit: number;
  internationalEnabled: boolean;
  icon: string;
}

export interface Transaction {
  id: string;
  invoiceCode: string;
  type: TxType;
  amount: number;
  category: string;
  categoryIcon: string;
  walletId: string;
  toWalletId?: string;
  toGoalId?: string;
  contactId?: string;
  contactName?: string;
  greeting?: string;
  date: string;
  time: string;
  book: Book;
  tag: string;
  note: string;
  receiptImageDataUrl?: string;
  adminFee: number;
  createdAt: number;
}

export interface Budget {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  limitAmount: number;
  spentAmount: number;
  period: string;
}

export interface Goal {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  currentAmount: number;
  targetAmount: number;
  targetDate: string;
  monthlyRoutine: number;
  isLocked: boolean;
  badgeText: string;
}

export interface Contact {
  id: string;
  name: string;
  tag: string;
  avatarEmoji: string;
  bankName: string;
  accountLabel: string;
  isFavorite: boolean;
}

export interface Preferences {
  palette: PaletteId;
  mode: ThemeMode;
  highContrastNumbers: boolean;
  maskBalance: boolean;
  userName: string;
}

export interface CategoryOption {
  name: string;
  icon: string;
}

export interface BackupFile {
  version: 1;
  exportedAt: string;
  app: "mochipay-luxe";
  wallets: Wallet[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  contacts: Contact[];
  todoCategories?: TodoCategory[];
  todoTasks?: TodoTask[];
  todoHabits?: TodoHabit[];
}

export interface PaletteMeta {
  id: PaletteId;
  name: string;
  emoji: string;
  vibe: string;
  swatches: [string, string, string];
}

export type TodoPriority = "low" | "medium" | "high";
export type TodoRepeat = "none" | "daily" | "weekly" | "monthly";

export interface TodoSubtask {
  id: string;
  text: string;
  isDone: boolean;
}

export interface TodoCategory {
  id: string;
  name: string;
  iconName: string;
  color: string;
  order: number;
  isDefault: boolean;
}

export interface TodoTask {
  id: string;
  title: string;
  note: string;
  categoryId: string;
  dueDate: string;
  dueTime: string;
  priority: TodoPriority;
  isCompleted: boolean;
  completedAt: number | null;
  reminderMinutesBefore: number;
  repeat: TodoRepeat;
  subtasks: TodoSubtask[];
  tags: string[];
  createdAt: number;
}

export interface TodoHabit {
  id: string;
  title: string;
  iconName: string;
  targetDaysPerWeek: number;
  completedDates: string[];
}
