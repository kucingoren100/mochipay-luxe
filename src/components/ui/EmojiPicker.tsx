"use client";

// Code points dipakai supaya ikon tidak rusak oleh encoding editor.
type IconGroup = { label: string; points: number[] };

const ICON_GROUPS: IconGroup[] = [
  {
    label: "Kuliner",
    points: [
      0x1f35c, 0x1f35f, 0x1f355, 0x1f362, 0x1f363, 0x1f357, 0x1f96a, 0x1f32e,
      0x1f32f, 0x1f957, 0x1f371, 0x1f958, 0x1f372, 0x1f95f, 0x1f373, 0x1f9c0,
      0x1f37f, 0x1f366, 0x1f370, 0x1f9c1, 0x1f36b, 0x1f36c, 0x1f369, 0x1f36a,
    ],
  },
  {
    label: "Minuman",
    points: [
      0x2615, 0x1f375, 0x1f964, 0x1f9cb, 0x1f95b, 0x1f37a, 0x1f37b, 0x1f377,
      0x1f942, 0x1f378, 0x1f379, 0x1f37e, 0x1f9c4, 0x1f9ca, 0x1f36d, 0x1f365,
    ],
  },
  {
    label: "Belanja & Fashion",
    points: [
      0x1f6cd, 0x1f45c, 0x1f45d, 0x1f45b, 0x1f392, 0x1f45f, 0x1f460, 0x1f457,
      0x1f455, 0x1f45a, 0x1f452, 0x1f9e2, 0x1f9e3, 0x1f9e4, 0x1f9e6, 0x1f484,
      0x1f48d, 0x1f3f7,
    ],
  },
  {
    label: "Transport",
    points: [
      0x1f697, 0x1f695, 0x1f68c, 0x1f68e, 0x1f6b2, 0x1f6f5, 0x1f3cd, 0x1f69a,
      0x26fd, 0x2708, 0x1f6eb, 0x1f680, 0x1f6a2, 0x1f6f3, 0x1f681, 0x1f689,
    ],
  },
  {
    label: "Hiburan & Olahraga",
    points: [
      0x1f3ae, 0x1f3a7, 0x1f3a4, 0x1f3ac, 0x1f3b5, 0x1f3a8, 0x1f3ab, 0x1f39f,
      0x1f3aa, 0x1f3af, 0x1f3b2, 0x1f3c6, 0x26bd, 0x1f3c0, 0x1f3c8, 0x1f3d0,
      0x1f3c2, 0x1f3ca, 0x1f9d8, 0x1f6b4, 0x1f3bf, 0x1fa80,
    ],
  },
  {
    label: "Kesehatan & Perawatan",
    points: [
      0x1f48a, 0x1f489, 0x1fa79, 0x1fa7a, 0x1fa7b, 0x1f9b7, 0x1f9b8, 0x1f9b5,
      0x1f9fc, 0x1f9f4, 0x1faa5, 0x1f487, 0x1f485, 0x1f6cc, 0x1fa74, 0x1f9d6,
    ],
  },
  {
    label: "Rumah & Kerja",
    points: [
      0x1f3e0, 0x1f3e1, 0x1f3eb, 0x1f3e2, 0x1f6cb, 0x1f6cf, 0x1fa91, 0x1f6aa,
      0x1f4a1, 0x1f9f9, 0x1fab4, 0x1f9fa, 0x1f4bb, 0x1f5a5, 0x1f4f1, 0x1f4bd,
      0x1f4bc, 0x1f4da, 0x1f4ce, 0x1f4cc, 0x1f4e6, 0x1f9ea,
    ],
  },
  {
    label: "Uang & Transaksi",
    points: [
      0x1f4b0, 0x1f4b5, 0x1f4b4, 0x1f4b6, 0x1f4b7, 0x1fa99, 0x1f4b3, 0x1f4b8,
      0x1f4b9, 0x1f4c8, 0x1f4c9, 0x1f3e6, 0x1f9ee, 0x26a1, 0x1f4af, 0x1f381,
    ],
  },
  {
    label: "Alam & Hewan",
    points: [
      0x1f338, 0x1f33c, 0x1f33b, 0x1f339, 0x1f340, 0x1f335, 0x1f30a, 0x1f308,
      0x2b50, 0x1f319, 0x1f31f, 0x1f525, 0x1f431, 0x1f436, 0x1f430, 0x1f43b,
      0x1f43c, 0x1f98a, 0x1f428, 0x1f984, 0x1f41d, 0x1f98b, 0x1f422, 0x1f427,
      0x1f958, 0x1f344,
    ],
  },
  {
    label: "Perayaan & Lainnya",
    points: [
      0x1f389, 0x1f38a, 0x1f380, 0x1f9f8, 0x1f49d, 0x2764, 0x1f973, 0x1f60d,
      0x2728, 0x1f4ab, 0x1f30d, 0x1f3dc, 0x1f3ed, 0x1f5ff, 0x26e9, 0x1f3a0,
      0x1f3d8, 0x1f48e, 0x1f511, 0x1f52d, 0x1f9e7, 0x1fa82, 0x1f4f8, 0x1f6cd,
    ],
  },
];

export const PICKER_ICONS: readonly string[] = ICON_GROUPS.flatMap((group) =>
  group.points.map((cp) => String.fromCodePoint(cp))
);

export function EmojiPicker({
  value,
  onChange,
  options,
  label = "Pilih Ikon",
}: {
  value: string;
  onChange: (icon: string) => void;
  options?: readonly string[];
  label?: string;
}) {
  const button = (icon: string) => (
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
  );

  if (options) {
    return (
      <div>
        <p className="mb-1.5 font-manrope text-xs font-bold uppercase tracking-wider text-muted">{label}</p>
        <div className="grid grid-cols-8 gap-1 rounded-xl bg-inset p-2">{options.map(button)}</div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-1.5 font-manrope text-xs font-bold uppercase tracking-wider text-muted">
        {label} · {PICKER_ICONS.length} stiker
      </p>
      <div className="picker-scroll max-h-48 overflow-y-auto rounded-xl bg-inset p-2">
        {ICON_GROUPS.map((group) => (
          <div key={group.label} className="mb-2 last:mb-0">
            <p className="px-1 py-1 font-manrope text-[10px] font-bold uppercase tracking-wider text-muted">{group.label}</p>
            <div className="grid grid-cols-8 gap-1">{group.points.map((cp) => button(String.fromCodePoint(cp)))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
