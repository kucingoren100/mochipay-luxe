"use client";

import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useAnimationControls } from "framer-motion";
import { KawaiiIcon, type KawaiiIconName } from "@/components/ui/KawaiiIcon";
import { PeekingMascot } from "@/components/ui/PeekingMascot";
import { useTheme } from "@/context/ThemeContext";

type Tab = {
  href: string;
  label: string;
  icon: KawaiiIconName;
  emoji?: string;
};

const TABS: Tab[] = [
  { href: "/", label: "Beranda", icon: "nav-rekor" },
  { href: "/riwayat", label: "Stat", icon: "nav-stat" },
  { href: "/budgets", label: "Budget", icon: "nav-budget" },
  { href: "/cards", label: "Akun", icon: "nav-akun" },
  { href: "/settings", label: "Saya", icon: "nav-saya" },
];

const TODO_TABS: Tab[] = [
  { href: "/todo", label: "Tugas", icon: "checklist-kawaii" },
  { href: "/todo/calendar", label: "Kalender", icon: "calendar-kawaii" },
  { href: "/todo/stats", label: "Analisis", icon: "chart-bars-kawaii" },
  { href: "/", label: "Kembali", icon: "pouch-cuan" },
];

const SPRING = { type: "spring", stiffness: 420, damping: 32 } as const;

function TabButton({
  tab,
  active,
  dark,
  onNavigate,
}: {
  tab: Tab;
  active: boolean;
  dark: boolean;
  onNavigate: (href: string) => void;
}) {
  const controls = useAnimationControls();
  const pillBg = dark ? "color-mix(in srgb, var(--primary) 25%, transparent)" : "var(--track)";
  const pillFg = dark ? "color-mix(in srgb, var(--primary) 45%, white)" : "var(--secondary)";

  return (
    <motion.button
      type="button"
      layout
      transition={SPRING}
      whileTap={{ scale: 0.92 }}
      aria-label={tab.label}
      aria-current={active ? "page" : undefined}
      onClick={() => {
        onNavigate(tab.href);
        void controls.start({
          scale: [1, 1.22, 0.95, 1.05, 1],
          rotate: [0, -10, 10, -4, 0],
          transition: { duration: 0.45 },
        });
      }}
      className={`relative flex items-center rounded-[20px] transition-colors active:bg-[var(--track)] active:text-secondary ${active ? "gap-2 px-4 py-2.5" : "px-3 py-2.5 text-muted hover:bg-[var(--icon-badge-bg)] hover:text-secondary"}`}
      style={active ? { color: pillFg } : undefined}
    >
      {active && (
        <motion.div
          layoutId="active-nav-pill"
          transition={SPRING}
          className="absolute inset-0 rounded-[20px]"
          style={{ background: pillBg }}
        />
      )}
      <motion.span
        animate={controls}
        initial={false}
        className={`relative grid shrink-0 place-items-center ${active ? "" : "opacity-75 transition-opacity hover:opacity-100"}`}
      >
        {tab.emoji ? <span className="text-[22px] leading-none">{tab.emoji}</span> : <KawaiiIcon name={tab.icon} size={26} />}
      </motion.span>      <AnimatePresence mode="popLayout" initial={false}>
        {active && (
          <motion.span
            key="label"
            initial={{ opacity: 0, width: 0, x: -6 }}
            animate={{ opacity: 1, width: "auto", x: 0 }}
            exit={{ opacity: 0, width: 0, x: -6 }}
            transition={SPRING}
            className="relative overflow-hidden whitespace-nowrap font-outfit text-sm font-semibold"
          >
            {tab.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function BottomNav({ onCatat }: { onCatat: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeTheme } = useTheme();
  const dark = activeTheme === "dark";
  const isTodo = pathname.startsWith("/todo");
  const tabs = isTodo ? TODO_TABS : TABS;

  return (
    <>
      <LayoutGroup id="kawaii-bottom-nav">
        <nav
          aria-label="Navigasi bawah"
          className="fixed bottom-6 left-1/2 z-50 mb-[env(safe-area-inset-bottom)] h-[68px] w-[calc(100%-3rem)] max-w-[370px] -translate-x-1/2 rounded-[28px] p-2 backdrop-blur-xl lg:hidden"
          style={{
            background: "color-mix(in srgb, var(--card) 90%, transparent)",
            border: "1.5px solid color-mix(in srgb, var(--primary) 25%, transparent)",
            boxShadow:
              "0 12px 32px -4px rgba(var(--shadow-rgb), 0.22), 0 2px 6px 0 rgba(46, 42, 54, 0.06)",
          }}
        >
          <PeekingMascot size={40} variant="lounge" className="absolute -top-6 right-4" />
          <div className="flex h-full items-center justify-center gap-1">
            {tabs.map((tab) => (
              <TabButton
                key={tab.href}
                tab={tab}
                active={pathname === tab.href}
                dark={dark}
                onNavigate={(href) => router.push(href)}
              />
            ))}
          </div>
        </nav>
      </LayoutGroup>

      {!isTodo && (
        <motion.button
          type="button"
          aria-label="Catat Cuan"
          whileTap={{ scale: 0.9 }}
          onClick={onCatat}
          className="fixed bottom-[100px] right-6 z-40 grid h-14 w-14 place-items-center rounded-2xl text-on-primary lg:hidden"
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--tertiary))",
            boxShadow: "0 10px 24px -6px rgba(var(--shadow-rgb), 0.5)",
          }}
        >
          <KawaiiIcon name="fab-catat" size={34} />
        </motion.button>
      )}
    </>
  );
}
