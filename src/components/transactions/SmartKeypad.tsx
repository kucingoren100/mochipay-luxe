"use client";

import { motion } from "framer-motion";

const KEYS = ["1", "2", "3", "⌫", "4", "5", "6", "÷", "7", "8", "9", "×", "000", "0", "+", "-"];

export function evaluateExpression(input: string): number {
  const source = input.replace(/×/g, "*").replace(/÷/g, "/").replace(/\s/g, "");
  if (!source) return 0;
  let index = 0;
  const peek = () => source[index];
  const parseFactor = (): number => {
    let sign = 1;
    if (peek() === "-") {
      sign = -1;
      index += 1;
    }
    let digits = "";
    while (index < source.length && /[0-9]/.test(source[index])) {
      digits += source[index];
      index += 1;
    }
    const value = Number(digits || "0");
    return sign * (Number.isFinite(value) ? value : 0);
  };
  const parseTerm = (): number => {
    let left = parseFactor();
    while (peek() === "*" || peek() === "/") {
      const op = source[index];
      index += 1;
      const right = parseFactor();
      left = op === "*" ? left * right : right === 0 ? left : left / right;
    }
    return left;
  };
  const parseExpr = (): number => {
    let left = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = source[index];
      index += 1;
      const right = parseTerm();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  };
  const result = parseExpr();
  if (!Number.isFinite(result)) return 0;
  return Math.max(0, Math.min(1_000_000_000_000, Math.round(result)));
}

export function SmartKeypad({
  onKey,
  onSave,
  disabled,
}: {
  onKey: (key: string) => void;
  onSave: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {KEYS.map((key) => (
        <motion.button
          key={key}
          type="button"
          whileTap={{ scale: 0.94, y: 1 }}
          onClick={() => onKey(key)}
          className={`h-12 rounded-full font-outfit text-lg font-semibold shadow-cloud ${
            "+-×÷⌫".includes(key) ? "bg-inset text-secondary" : "bg-card text-foreground"
          }`}
        >
          {key}
        </motion.button>
      ))}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97, y: 1 }}
        onClick={() => onKey("=")}
        className="h-12 rounded-full bg-inset font-outfit text-lg font-bold text-secondary"
      >
        =
      </motion.button>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97, y: 1 }}
        disabled={disabled}
        onClick={onSave}
        className="btn-primary col-span-3 h-12 disabled:opacity-50"
      >
        Simpan
      </motion.button>
    </div>
  );
}
