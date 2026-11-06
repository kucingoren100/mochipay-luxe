"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { createContext, useContext, useEffect, useState } from "react";
import { bootDatabase, getDb } from "@/lib/db";
import type { Budget, Contact, Goal, TodoCategory, TodoHabit, TodoTask, Transaction, Wallet } from "@/types/finance";

const ReadyContext = createContext(false);

export function useDbReady() {
  return useContext(ReadyContext);
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    bootDatabase()
      .then(() => {
        if (active) setReady(true);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Database lokal gagal dibuka");
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface px-6 text-center text-foreground">
        <div>
          <p className="font-outfit text-2xl font-semibold">Database lokal belum siap 🥺</p>
          <p className="mt-2 font-manrope text-sm text-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface text-foreground">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-3xl shadow-cloud">🐰</div>
          <p className="mt-4 font-outfit text-xl font-semibold">MochiMoy</p>
          <p className="mt-1 font-manrope text-sm text-muted">Menyiapkan buku kas di perangkatmu…</p>
        </div>
      </div>
    );
  }

  return <ReadyContext.Provider value={ready}>{children}</ReadyContext.Provider>;
}

function sortTransactions(rows: Transaction[]) {
  return [...rows].sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time) || b.createdAt - a.createdAt);
}

export function useWallets(): Wallet[] {
  const rows = useLiveQuery(async () => {
    if (typeof indexedDB === "undefined") return [] as Wallet[];
    return getDb().wallets.toArray();
  }, []);
  return rows ?? [];
}

export function useTransactions(): Transaction[] {
  const rows = useLiveQuery(async () => {
    if (typeof indexedDB === "undefined") return [] as Transaction[];
    return getDb().transactions.toArray();
  }, []);
  return sortTransactions(rows ?? []);
}

export function useBudgets(): Budget[] {
  const rows = useLiveQuery(async () => {
    if (typeof indexedDB === "undefined") return [] as Budget[];
    return getDb().budgets.toArray();
  }, []);
  return rows ?? [];
}

export function useGoals(): Goal[] {
  const rows = useLiveQuery(async () => {
    if (typeof indexedDB === "undefined") return [] as Goal[];
    return getDb().goals.toArray();
  }, []);
  return rows ?? [];
}

export function useContacts(): Contact[] {
  const rows = useLiveQuery(async () => {
    if (typeof indexedDB === "undefined") return [] as Contact[];
    return getDb().contacts.toArray();
  }, []);
  return rows ?? [];
}

export function useTodoCategories(): TodoCategory[] {
  const rows = useLiveQuery(async () => {
    if (typeof indexedDB === "undefined") return [] as TodoCategory[];
    return getDb().todoCategories.orderBy("order").toArray();
  }, []);
  return rows ?? [];
}

export function useTodoTasks(): TodoTask[] {
  const rows = useLiveQuery(async () => {
    if (typeof indexedDB === "undefined") return [] as TodoTask[];
    return getDb().todoTasks.toArray();
  }, []);
  return [...(rows ?? [])].sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.dueTime.localeCompare(b.dueTime) || a.createdAt - b.createdAt);
}

export function useTodoHabits(): TodoHabit[] {
  const rows = useLiveQuery(async () => {
    if (typeof indexedDB === "undefined") return [] as TodoHabit[];
    return getDb().todoHabits.toArray();
  }, []);
  return rows ?? [];
}
