"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  group?: string;
}

export function KawaiiSelect({
  value,
  onChange,
  options,
  placeholder = "Pilih dulu ya",
  className = "",
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const groups = useMemo(() => {
    const buckets: { name: string | null; items: SelectOption[] }[] = [];
    for (const option of options) {
      const key = option.group ?? null;
      const bucket = buckets.find((item) => item.name === key);
      if (bucket) bucket.items.push(option);
      else buckets.push({ name: key, items: [option] });
    }
    return buckets;
  }, [options]);

  const current = options.find((option) => option.value === value);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className="inset-field flex h-12 w-full items-center gap-2 px-3 text-left"
      >
        <span className="min-w-0 flex-1 truncate font-manrope text-sm font-semibold">
          {current ? (
            <>
              {current.icon && <span className="mr-1.5">{current.icon}</span>}
              {current.label}
            </>
          ) : (
            <span className="text-muted">{placeholder}</span>
          )}
        </span>
        <ChevronDown size={16} className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul role="listbox" aria-label={ariaLabel} className="cloud-card absolute left-0 right-0 z-40 mt-1.5 max-h-64 overflow-auto p-1.5">
          {groups.map((group) => (
            <li key={group.name ?? "__flat"}>
              {group.name && (
                <p className="px-2 pb-1 pt-2 font-manrope text-[10px] font-bold uppercase tracking-wider text-muted">{group.name}</p>
              )}
              <ul>
                {group.items.map((option) => {
                  const active = option.value === value;
                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          onChange(option.value);
                          setOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left font-manrope text-sm font-semibold ${
                          active ? "bg-inset text-secondary" : "hover:bg-inset"
                        }`}
                      >
                        {option.icon && <span className="shrink-0">{option.icon}</span>}
                        <span className="min-w-0 flex-1 truncate">{option.label}</span>
                        {active && <Check size={14} className="shrink-0 text-secondary" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
