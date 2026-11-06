"use client";

// Code points dipakai supaya ikon tidak rusak oleh encoding editor.
const ICON_CODE_POINTS = [
  0x1f354, 0x1f34e, 0x1f9cb, 0x1f370, 0x1f35c, 0x1f957, 0x2615, 0x26fd,
  0x1f6f5, 0x2708, 0x1f45f, 0x1f457, 0x1f380, 0x1f9f4, 0x1f3ae, 0x1f3f8,
  0x1f48a, 0x1f9b7, 0x1f6d2, 0x1f91d, 0x1f389, 0x1f4b0, 0x1f38a, 0x1f4bb,
  0x1f6cd, 0x1f9e7, 0x1f4c8, 0x1f39f, 0x1f338, 0x1f3e0, 0x1f45a, 0x21a9,
  0x2728, 0x1f49d, 0x1f680, 0x1f430, 0x1f43b, 0x1f431, 0x1f438, 0x1f437,
  0x1f41f, 0x1f31f, 0x2b50, 0x1f319, 0x1f525, 0x1f48e, 0x1f381, 0x1f3a7,
  0x1f4da, 0x1f9f8, 0x1f4b3, 0x1f4b5, 0x1f3e6, 0x1f6e1, 0x1f501, 0x2764,
];

export const PICKER_ICONS: readonly string[] = ICON_CODE_POINTS.map((cp) => String.fromCodePoint(cp));

export function EmojiPicker({
  value,
  onChange,
  options = PICKER_ICONS,
  label = "Pilih Ikon",
}: {
  value: string;
  onChange: (icon: string) => void;
  options?: readonly string[];
  label?: string;
}) {
  return (
    <div>
      <p className="mb-1.5 font-manrope text-xs font-bold uppercase tracking-wider text-muted">{label}</p>
      <div className="grid grid-cols-8 gap-1 rounded-xl bg-inset p-2">
        {options.map((icon) => (
          <button
            key={icon}
            type="button"
            aria-label={`Ikon ${icon}`}
            aria-pressed={value === icon}
            onClick={() => onChange(icon)}
            className={`grid h-9 w-9 place-items-center rounded-lg text-lg transition-colors ${
              value === icon ? "bg-card shadow-cloud ring-2 ring-secondary" : "hover:bg-card"
            }`}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
