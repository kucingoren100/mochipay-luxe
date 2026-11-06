"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { TaskCard } from "@/components/todo/TaskCard";
import { Overlay, Pressable } from "@/components/ui/SquircleCard";
import { KawaiiIcon, type KawaiiIconName } from "@/components/ui/KawaiiIcon";
import { KawaiiRingFace } from "@/components/ui/KawaiiRingFace";
import { emojiToKawaii } from "@/components/ui/iconPacks/todo";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { WidgetPreviewModal } from "@/components/widgets/WidgetPreviewModal";
import { useUi } from "@/components/layout/AppShell";
import { useTodoCategories, useTodoHabits, useTodoTasks } from "@/hooks/useLocalDb";
import {
  addTodoCategory,
  addTodoHabit,
  addTodoTask,
  deleteTodoCategory,
  deleteTodoHabit,
  deleteTodoTask,
  updateTodoCategory,
  updateTodoHabit,
  updateTodoTask,
} from "@/lib/db";
import { addDays, startOfWeek, todayISO, toISODate, uid, WEEKDAY_LABELS } from "@/lib/formatters";
import type { TodoPriority, TodoRepeat, TodoHabit, TodoSubtask, TodoTask } from "@/types/finance";

const CATEGORY_COLORS = ["#1B5683", "#7D6BA8", "#D93829", "#5A9E3E", "#E9B44C", "#F4A6CD", "#99C8F5", "#CBB094"];

type Bucket = "today" | "tomorrow" | "upcoming" | "overdue";

const BUCKETS: { id: Bucket; label: string; icon: KawaiiIconName }[] = [
  { id: "today", label: "Hari Ini", icon: "sun-happy" },
  { id: "tomorrow", label: "Besok", icon: "cloud-sun-kawaii" },
  { id: "upcoming", label: "Mendatang", icon: "calendar-kawaii" },
  { id: "overdue", label: "Lewat Waktu", icon: "cat-alarm-kawaii" },
];

const PRIORITIES: { id: TodoPriority; label: string; icon: KawaiiIconName }[] = [
  { id: "high", label: "Tinggi", icon: "flame-high" },
  { id: "medium", label: "Sedang", icon: "dot-alert" },
  { id: "low", label: "Santai", icon: "leaf-calm" },
];

const REPEATS: { id: TodoRepeat; label: string }[] = [
  { id: "none", label: "Sekali" },
  { id: "daily", label: "Harian" },
  { id: "weekly", label: "Mingguan" },
  { id: "monthly", label: "Bulanan" },
];

const REMINDERS = [0, 15, 30, 60];

export default function TodoPage() {
  const ui = useUi();
  const tasks = useTodoTasks();
  const categories = useTodoCategories();
  const habits = useTodoHabits();

  const today = todayISO();
  const tomorrow = toISODate(addDays(new Date(), 1));
  const [bucket, setBucket] = useState<Bucket>("today");
  const [catFilter, setCatFilter] = useState("all");

  const scoped = useMemo(() => {
    return tasks.filter((task) => {
      if (bucket === "today") return task.dueDate === today;
      if (bucket === "tomorrow") return task.dueDate === tomorrow;
      if (bucket === "upcoming") return task.dueDate > tomorrow;
      return task.dueDate < today && !task.isCompleted;
    });
  }, [tasks, bucket, today, tomorrow]);

  const visible = catFilter === "all" ? scoped : scoped.filter((task) => task.categoryId === catFilter);
  const doneCount = scoped.filter((task) => task.isCompleted).length;
  const pct = scoped.length ? Math.round((doneCount / scoped.length) * 100) : 0;
  const catOf = (id: string) => categories.find((cat) => cat.id === id);

  const toggleTask = async (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    const next = !task.isCompleted;
    try {
      await updateTodoTask(id, { isCompleted: next, completedAt: next ? Date.now() : null });
      if (next) ui.toast(`Miaaw! "${task.title}" selesai 🐾✨`);
    } catch (err) {
      ui.toast(err instanceof Error ? err.message : "Gagal mengubah tugas");
    }
  };

  const toggleSubtask = async (taskId: string, subId: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    const subtasks = task.subtasks.map((sub) => (sub.id === subId ? { ...sub, isDone: !sub.isDone } : sub));
    await updateTodoTask(taskId, { subtasks });
  };

  const removeTask = async (id: string) => {
    await deleteTodoTask(id);
    ui.toast("Tugas dihapus dari daftar 🗑️");
  };

  const toggleHabitDate = async (habitId: string, date: string) => {
    const habit = habits.find((item) => item.id === habitId);
    if (!habit || date > today) return;
    const has = habit.completedDates.includes(date);
    const completedDates = has ? habit.completedDates.filter((d) => d !== date) : [...habit.completedDates, date];
    await updateTodoHabit(habitId, { completedDates });
  };

  /* Quick add sheet */
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [fTitle, setFTitle] = useState("");
  const [fNote, setFNote] = useState("");
  const [fCat, setFCat] = useState("");
  const [fDate, setFDate] = useState(today);
  const [fTime, setFTime] = useState("09:00");
  const [fPriority, setFPriority] = useState<TodoPriority>("medium");
  const [fRepeat, setFRepeat] = useState<TodoRepeat>("none");
  const [fReminder, setFReminder] = useState(30);
  const [fSubs, setFSubs] = useState<TodoSubtask[]>([]);
  const [fSubInput, setFSubInput] = useState("");
  const [fTags, setFTags] = useState("");
  const [fError, setFError] = useState("");

  /* Category manager */
  const [manageOpen, setManageOpen] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [catForm, setCatForm] = useState<{ id: string | null; name: string; icon: string; color: string }>({
    id: null,
    name: "",
    icon: "✨",
    color: CATEGORY_COLORS[0],
  });
  const [catError, setCatError] = useState("");

  /* Habit manager (CRUD Kebiasaan Mingguan) */
  const [habitManageOpen, setHabitManageOpen] = useState(false);
  const [habitForm, setHabitForm] = useState<{ id: string | null; title: string; icon: string; target: number }>({
    id: null,
    title: "",
    icon: "⭐",
    target: 5,
  });
  const [habitError, setHabitError] = useState("");

  /* Inline category creation inside the add-task sheet */
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("✨");
  const [newCatColor, setNewCatColor] = useState(CATEGORY_COLORS[5]);
  const [newCatError, setNewCatError] = useState("");

  const resetSheet = () => {
    setEditingId(null);
    setStep(1);
    setFTitle("");
    setFNote("");
    setFCat(categories[0]?.id ?? "");
    setFDate(today);
    setFTime("09:00");
    setFPriority("medium");
    setFRepeat("none");
    setFReminder(30);
    setFSubs([]);
    setFSubInput("");
    setFTags("");
    setFError("");
    setNewCatOpen(false);
    setNewCatName("");
    setNewCatIcon("✨");
    setNewCatColor(CATEGORY_COLORS[5]);
    setNewCatError("");
  };

  const openSheet = () => {
    resetSheet();
    setSheetOpen(true);
  };

  const openEdit = (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    setEditingId(id);
    setStep(1);
    setFTitle(task.title);
    setFNote(task.note);
    setFCat(task.categoryId);
    setFDate(task.dueDate);
    setFTime(task.dueTime);
    setFPriority(task.priority);
    setFRepeat(task.repeat);
    setFReminder(task.reminderMinutesBefore);
    setFSubs(task.subtasks);
    setFSubInput("");
    setFTags(task.tags.join(", "));
    setFError("");
    setSheetOpen(true);
  };

  const addSub = () => {
    const text = fSubInput.trim();
    if (!text) return;
    setFSubs((current) => [...current, { id: uid("sub"), text, isDone: false }]);
    setFSubInput("");
  };

  const saveTask = async () => {
    if (!fTitle.trim()) return setFError("Judul tugas wajib diisi dulu ya");
    if (!fCat) return setFError("Pilih kategori dulu ya");
    try {
      const payload = {
        title: fTitle.trim(),
        note: fNote.trim(),
        categoryId: fCat,
        dueDate: fDate || today,
        dueTime: fTime || "09:00",
        priority: fPriority,
        reminderMinutesBefore: fReminder,
        repeat: fRepeat,
        subtasks: fSubs,
        tags: fTags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };
      if (editingId) {
        await updateTodoTask(editingId, payload);
        setSheetOpen(false);
        ui.toast(`Tugas diperbarui ✏️ "${payload.title}"`);
      } else {
        await addTodoTask({
          ...payload,
          id: uid("task"),
          isCompleted: false,
          completedAt: null,
          createdAt: Date.now(),
        });
        setSheetOpen(false);
        ui.toast(`Tugas baru masuk daftar 🐾 "${payload.title}"`);
      }
    } catch (err) {
      setFError(err instanceof Error ? err.message : "Gagal menyimpan tugas");
    }
  };

  const resetCatForm = () => {
    setCatForm({ id: null, name: "", icon: "✨", color: CATEGORY_COLORS[0] });
    setCatError("");
  };

  const startEditCat = (id: string) => {
    const cat = categories.find((item) => item.id === id);
    if (!cat) return;
    setCatForm({ id: cat.id, name: cat.name, icon: cat.iconName, color: cat.color });
    setCatError("");
  };

  const persistCategory = async (form: { id: string | null; name: string; icon: string; color: string }): Promise<string> => {
    const name = form.name.trim();
    if (form.id) {
      await updateTodoCategory(form.id, { name, iconName: form.icon, color: form.color });
      return form.id;
    }
    const maxOrder = categories.reduce((max, cat) => Math.max(max, cat.order), 0);
    const id = uid("tcat");
    await addTodoCategory({ id, name, iconName: form.icon, color: form.color, order: maxOrder + 1, isDefault: false });
    return id;
  };

  const saveCategory = async () => {
    const name = catForm.name.trim();
    if (!name) return setCatError("Nama kategori wajib diisi dulu ya");
    try {
      await persistCategory(catForm);
      ui.toast(catForm.id ? `Kategori diperbarui ✏️ "${name}"` : `Kategori baru ditambahkan 🐾 "${name}"`);
      resetCatForm();
    } catch (err) {
      setCatError(err instanceof Error ? err.message : "Gagal menyimpan kategori");
    }
  };

  const saveInlineCategory = async () => {
    const name = newCatName.trim();
    if (!name) return setNewCatError("Nama kategori wajib diisi dulu ya");
    try {
      const id = await persistCategory({ id: null, name, icon: newCatIcon, color: newCatColor });
      setFCat(id);
      setNewCatOpen(false);
      setNewCatName("");
      setNewCatError("");
      ui.toast(`Kategori baru "${name}" langsung kepilih 🐾`);
    } catch (err) {
      setNewCatError(err instanceof Error ? err.message : "Gagal menyimpan kategori");
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await deleteTodoCategory(id);
      if (catForm.id === id) resetCatForm();
      ui.toast("Kategori dihapus 🗑️");
    } catch (err) {
      ui.toast(err instanceof Error ? err.message : "Gagal menghapus kategori");
    }
  };

  const resetHabitForm = () => {
    setHabitForm({ id: null, title: "", icon: "⭐", target: 5 });
    setHabitError("");
  };

  const startEditHabit = (id: string) => {
    const habit = habits.find((item) => item.id === id);
    if (!habit) return;
    setHabitForm({ id: habit.id, title: habit.title, icon: habit.iconName, target: habit.targetDaysPerWeek });
    setHabitError("");
  };

  const saveHabit = async () => {
    const title = habitForm.title.trim();
    if (!title) return setHabitError("Judul kebiasaan wajib diisi dulu ya");
    try {
      if (habitForm.id) {
        await updateTodoHabit(habitForm.id, { title, iconName: habitForm.icon, targetDaysPerWeek: habitForm.target });
        ui.toast(`Kebiasaan diperbarui ✏️ "${title}"`);
      } else {
        const habit: TodoHabit = { id: uid("habit"), title, iconName: habitForm.icon, targetDaysPerWeek: habitForm.target, completedDates: [] };
        await addTodoHabit(habit);
        ui.toast(`Kebiasaan baru dibuat 🐾 "${title}" — tinggal centang tiap hari ya`);
      }
      resetHabitForm();
    } catch (err) {
      setHabitError(err instanceof Error ? err.message : "Gagal menyimpan kebiasaan");
    }
  };

  const removeHabit = async (id: string) => {
    const habit = habits.find((item) => item.id === id);
    try {
      await deleteTodoHabit(id);
      if (habitForm.id === id) resetHabitForm();
      ui.toast(`Kebiasaan "${habit?.title ?? id}" dihapus beserta progres hariannya 🗑️`);
    } catch (err) {
      ui.toast(err instanceof Error ? err.message : "Gagal menghapus kebiasaan");
    }
  };

  const weekStart = startOfWeek(new Date());
  const weekDates = Array.from({ length: 7 }, (_, i) => toISODate(addDays(weekStart, i)));

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("action") === "new") openSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.main initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
      <header className="cloud-card p-5">
        <div className="flex items-center gap-4">
          <div className="relative grid h-16 w-16 shrink-0 place-items-center">
            <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--track)" strokeWidth="8" />
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="var(--secondary)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 163.4} 163.4`}
              />
            </svg>
            <span className="kawaii-icon absolute grid h-9 w-9 place-items-center rounded-full border-2 border-line bg-card">
              <KawaiiRingFace pct={pct} size={30} />
            </span>
            <span className="tnum absolute -bottom-1.5 rounded-full bg-secondary px-1.5 py-0.5 font-manrope text-[9px] font-bold text-white">{pct}%</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-outfit text-xl font-semibold leading-7">Yuk Beresin Tugas Hari Ini! 🐾✨</h1>
            <p className="mt-1 font-manrope text-sm text-muted">
              {doneCount} dari {scoped.length} selesai • {pct}% di tampilan ini
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href="/todo/calendar" className="flex items-center gap-1.5 rounded-full bg-inset px-3.5 py-2 text-center font-manrope text-xs font-bold text-secondary">
            <KawaiiIcon name="bell-kawaii" size={14} /> Notif
          </Link>
          <button
            type="button"
            onClick={() => setWidgetOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-inset px-3.5 py-2 font-manrope text-xs font-bold text-secondary"
          >
            <KawaiiIcon name="phone-widget-kawaii" size={14} /> Lihat Widget
          </button>
        </div>
      </header>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {BUCKETS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setBucket(item.id)}
            className={`shrink-0 rounded-full px-4 py-2 font-manrope text-xs font-bold ${bucket === item.id ? "bg-primary text-on-primary" : "bg-inset text-muted"}`}
          >
            <span className="flex items-center gap-1.5">
              <KawaiiIcon name={item.icon} size={14} /> {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <button
          type="button"
          onClick={() => setCatFilter("all")}
          className={`shrink-0 rounded-full px-4 py-2 font-manrope text-xs font-bold ${catFilter === "all" ? "bg-secondary text-white" : "bg-card text-muted"}`}
        >
          <span className="flex items-center gap-1.5">
            <KawaiiIcon name="paw-double" size={14} /> Semua
          </span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCatFilter(cat.id)}
            className={`shrink-0 rounded-full px-4 py-2 font-manrope text-xs font-bold ${catFilter === cat.id ? "text-white" : "bg-card text-muted"}`}
            style={catFilter === cat.id ? { background: cat.color } : undefined}
          >
            <span className="flex items-center gap-1.5">
              <KawaiiIcon name={emojiToKawaii(cat.iconName)} size={14} /> {cat.name}
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setManageOpen(true)}
          className="shrink-0 rounded-full bg-secondary px-4 py-2 font-manrope text-xs font-bold text-white"
        >
          <span className="flex items-center gap-1.5">
            <KawaiiIcon name="checklist-kawaii" size={14} /> Kelola
          </span>
        </button>
      </div>

      <section className="space-y-3">
        {visible.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            category={catOf(task.categoryId)}
            onToggle={(id) => void toggleTask(id)}
            onToggleSubtask={(taskId, subId) => void toggleSubtask(taskId, subId)}
            onEdit={openEdit}
            onDelete={(id) => void removeTask(id)}
          />
        ))}
        {visible.length === 0 && (
          <div className="cloud-card px-4 py-8 text-center">
            <p className="text-4xl">🐱</p>
            <p className="mt-2 font-manrope text-sm text-muted">Tidak ada tugas di sini. Meong santai dulu atau tambah tugas baru ✨</p>
          </div>
        )}
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="font-outfit text-lg font-semibold">
            <span className="flex items-center gap-1.5">
              <KawaiiIcon name="cat-paw-sparkle" size={18} /> Kebiasaan Minggu Ini
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setHabitManageOpen(true)}
            className="shrink-0 rounded-full bg-secondary px-3.5 py-1.5 font-manrope text-xs font-bold text-white"
          >
            <span className="flex items-center gap-1.5">
              <KawaiiIcon name="checklist-kawaii" size={14} /> Kelola
            </span>
          </button>
        </div>
        <div className="space-y-3">
          {habits.map((habit) => {
            const weekDone = habit.completedDates.filter((date) => weekDates.includes(date)).length;
            return (
              <div key={habit.id} className="cloud-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-outfit text-sm font-semibold">
                    {habit.iconName} {habit.title}
                  </p>
                  <span className={`tnum rounded-full px-2 py-0.5 font-manrope text-[10px] font-bold ${weekDone >= habit.targetDaysPerWeek ? "bg-income text-white" : "bg-inset text-muted"}`}>
                    {weekDone}/{habit.targetDaysPerWeek} hari
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-7 gap-1.5">
                  {weekDates.map((date, i) => {
                    const done = habit.completedDates.includes(date);
                    const future = date > today;
                    return (
                      <button
                        key={date}
                        type="button"
                        disabled={future}
                        aria-label={`${habit.title} tanggal ${date}`}
                        onClick={() => void toggleHabitDate(habit.id, date)}
                        className={`flex flex-col items-center gap-1 rounded-xl py-2 ${done ? "bg-secondary text-white" : "bg-inset text-muted"} ${future ? "opacity-40" : ""}`}
                      >
                        <span className="font-manrope text-[10px] font-bold">{WEEKDAY_LABELS[i]}</span>
                        <span className="tnum text-xs font-bold">{Number(date.slice(8))}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => { resetHabitForm(); setHabitManageOpen(true); }}
            className="w-full rounded-xl border border-dashed border-secondary px-4 py-3 font-manrope text-xs font-bold text-secondary"
          >
            ➕ Tambah Kebiasaan Baru
          </button>
        </div>
      </section>

      <Pressable
        ariaLabel="Tambah Tugas"
        className="fixed bottom-[100px] right-6 z-40 grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--tertiary))] text-on-primary shadow-[0_10px_24px_-6px_rgba(var(--shadow-rgb),0.5)] lg:bottom-8"
        onClick={openSheet}
      >
        <motion.span animate={{ rotate: sheetOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="block">
          <Plus size={24} />
        </motion.span>
      </Pressable>

      {sheetOpen && (
        <Overlay onClose={() => setSheetOpen(false)}>
          <div className="mb-3 flex items-center gap-2">
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${step === 1 ? "bg-secondary text-white" : "bg-inset text-muted"}`}>1</span>
            <span className="h-0.5 flex-1 rounded bg-inset" />
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${step === 2 ? "bg-secondary text-white" : "bg-inset text-muted"}`}>2</span>
          </div>
          {step === 1 ? (
            <>
              <h3 className="font-outfit text-xl font-semibold">{editingId ? "Edit Tugas ✏️" : "Tugas Baru Apa Nih? 🐾"}</h3>
              <input className="inset-field mt-4 h-12 w-full px-3" placeholder="Judul tugas, misal: Review laporan cuan" value={fTitle} onChange={(e) => setFTitle(e.target.value)} />
              <textarea className="inset-field mt-2 min-h-16 w-full px-3 py-2" placeholder="Catatan tambahan (opsional)" value={fNote} onChange={(e) => setFNote(e.target.value)} />
              <p className="mt-3 font-manrope text-xs font-bold uppercase tracking-wider text-muted">Kategori</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFCat(cat.id)}
                    className={`rounded-full px-3 py-1.5 font-manrope text-xs font-bold ${fCat === cat.id ? "text-white" : "bg-inset text-muted"}`}
                    style={fCat === cat.id ? { background: cat.color } : undefined}
                  >
                    <span className="flex items-center gap-1.5">
                      <KawaiiIcon name={emojiToKawaii(cat.iconName)} size={14} /> {cat.name}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setNewCatOpen((open) => !open)}
                  className={`rounded-full px-3 py-1.5 font-manrope text-xs font-bold ${newCatOpen ? "bg-secondary text-white" : "border border-dashed border-secondary text-secondary"}`}
                >
                  ➕ Buat Sendiri
                </button>
              </div>
              {newCatOpen && (
                <div className="mt-2 rounded-xl border border-line bg-inset p-3">
                  <input className="inset-field h-11 w-full px-3" placeholder="Nama kategori baru, misal: Nongkrong" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
                  <div className="mt-2">
                    <EmojiPicker value={newCatIcon} onChange={setNewCatIcon} label="Ikon Kategori Baru" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CATEGORY_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        aria-label={`Warna kategori ${color}`}
                        onClick={() => setNewCatColor(color)}
                        className={`h-7 w-7 rounded-full ${newCatColor === color ? "ring-2 ring-secondary ring-offset-2 ring-offset-card" : ""}`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  {newCatError && <p className="mt-2 font-manrope text-sm text-expense">{newCatError}</p>}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Pressable className="btn-ghost h-10 text-xs" onClick={() => setNewCatOpen(false)}>Batal</Pressable>
                    <Pressable className="btn-primary h-10 text-xs" onClick={() => void saveInlineCategory()}>Simpan & Pakai</Pressable>
                  </div>
                </div>
              )}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input type="date" className="inset-field h-12 px-3" value={fDate} onChange={(e) => setFDate(e.target.value)} />
                <input type="time" className="inset-field h-12 px-3" value={fTime} onChange={(e) => setFTime(e.target.value)} />
              </div>
              {fError && <p className="mt-2 font-manrope text-sm text-expense">{fError}</p>}
              <Pressable className="btn-primary mt-4 h-12 w-full" onClick={() => setStep(2)}>
                Lanjut ke Detail ➡️
              </Pressable>
            </>
          ) : (
            <>
              <h3 className="font-outfit text-xl font-semibold">Detail Biar Makin Rapi ✨</h3>
              <p className="mt-3 font-manrope text-xs font-bold uppercase tracking-wider text-muted">Prioritas</p>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {PRIORITIES.map((p) => (
                  <button key={p.id} type="button" onClick={() => setFPriority(p.id)} className={`rounded-xl border px-2 py-2 font-manrope text-xs font-bold ${fPriority === p.id ? "border-secondary bg-inset" : "border-line bg-card"}`}>
                    <span className="flex items-center justify-center gap-1.5">
                      <KawaiiIcon name={p.icon} size={14} /> {p.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 font-manrope text-xs font-bold uppercase tracking-wider text-muted">Pengulangan</p>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {REPEATS.map((r) => (
                  <button key={r.id} type="button" onClick={() => setFRepeat(r.id)} className={`rounded-xl border px-1 py-2 font-manrope text-[11px] font-bold ${fRepeat === r.id ? "border-secondary bg-inset" : "border-line bg-card"}`}>
                    <span className="flex items-center justify-center gap-1.5">
                      {r.id !== "none" && <KawaiiIcon name="repeat-loop" size={12} />} {r.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 font-manrope text-xs font-bold uppercase tracking-wider text-muted">Ingatkan Sebelum</p>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {REMINDERS.map((m) => (
                  <button key={m} type="button" onClick={() => setFReminder(m)} className={`rounded-xl border px-1 py-2 font-manrope text-[11px] font-bold ${fReminder === m ? "border-secondary bg-inset" : "border-line bg-card"}`}>
                    {m === 0 ? "Off" : `${m} mnt`}
                  </button>
                ))}
              </div>
              <p className="mt-3 font-manrope text-xs font-bold uppercase tracking-wider text-muted">Subtask</p>
              <div className="mt-1.5 flex gap-2">
                <input className="inset-field h-11 min-w-0 flex-1 px-3" placeholder="Tambah subtask lalu Enter" value={fSubInput} onChange={(e) => setFSubInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSub(); } }} />
                <Pressable className="btn-ghost h-11 px-3 text-xs" onClick={addSub}>+ Tambah</Pressable>
              </div>
              {fSubs.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {fSubs.map((sub, i) => (
                    <div key={sub.id} className="flex items-center gap-2 rounded-lg bg-inset px-3 py-2">
                      <span className="tnum font-manrope text-[10px] font-bold text-muted">{i + 1}.</span>
                      <span className="min-w-0 flex-1 truncate font-manrope text-xs font-semibold">{sub.text}</span>
                      <button type="button" aria-label={`Hapus subtask ${sub.text}`} className="text-expense" onClick={() => setFSubs((current) => current.filter((item) => item.id !== sub.id))}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              <input className="inset-field mt-3 h-11 w-full px-3" placeholder="Tag pisahkan koma, misal: Kerja, Rutin" value={fTags} onChange={(e) => setFTags(e.target.value)} />
              {fError && <p className="mt-2 font-manrope text-sm text-expense">{fError}</p>}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Pressable className="btn-ghost h-12" onClick={() => setStep(1)}>⬅️ Kembali</Pressable>
                <Pressable className="btn-primary h-12" onClick={() => void saveTask()}>{editingId ? "Simpan Perubahan ✏️" : "Simpan Tugas 🐾"}</Pressable>
              </div>
            </>
          )}
        </Overlay>
      )}

      {manageOpen && (
        <Overlay onClose={() => { setManageOpen(false); resetCatForm(); }}>
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="font-manrope text-[11px] font-bold uppercase tracking-wider text-muted">Kelola Kategori</p>
              <h2 className="font-outfit text-2xl font-semibold">Kategori Tugas 🗂️</h2>
            </div>
            <button type="button" aria-label="Tutup kelola kategori" onClick={() => { setManageOpen(false); resetCatForm(); }} className="grid h-10 w-10 place-items-center rounded-full bg-inset">✕</button>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 rounded-lg bg-inset px-3 py-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg" style={{ background: cat.color, color: "#fff" }}>{cat.iconName}</span>
                <span className="min-w-0 flex-1 truncate font-manrope text-sm font-semibold">{cat.name}</span>
                <button type="button" aria-label={`Edit kategori ${cat.name}`} onClick={() => startEditCat(cat.id)} className="grid h-8 w-8 place-items-center rounded-full bg-card text-secondary"><Pencil size={14} /></button>
                <button type="button" aria-label={`Hapus kategori ${cat.name}`} onClick={() => void removeCategory(cat.id)} className="grid h-8 w-8 place-items-center rounded-full bg-card text-expense"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-line bg-inset p-4">
            <h3 className="font-outfit font-semibold">{catForm.id ? "Edit Kategori ✏️" : "Tambah Kategori Baru ➕"}</h3>
            <input className="inset-field mt-3 h-11 w-full px-3" placeholder="Nama kategori, misal: Kerjaan Kantor" value={catForm.name} onChange={(e) => setCatForm((c) => ({ ...c, name: e.target.value }))} />
            <div className="mt-3">
              <EmojiPicker value={catForm.icon} onChange={(icon) => setCatForm((c) => ({ ...c, icon }))} label="Ikon Kategori" />
            </div>
            <p className="mt-3 mb-1.5 font-manrope text-xs font-bold uppercase tracking-wider text-muted">Warna</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Warna ${color}`}
                  onClick={() => setCatForm((c) => ({ ...c, color }))}
                  className={`h-8 w-8 rounded-full ${catForm.color === color ? "ring-2 ring-secondary ring-offset-2 ring-offset-card" : ""}`}
                  style={{ background: color }}
                />
              ))}
            </div>
            {catError && <p className="mt-2 font-manrope text-sm text-expense">{catError}</p>}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Pressable className="btn-ghost h-11" onClick={resetCatForm}>Reset Form</Pressable>
              <Pressable className="btn-primary h-11" onClick={() => void saveCategory()}>{catForm.id ? "Simpan Perubahan" : "Tambah Kategori"}</Pressable>
            </div>
          </div>
        </Overlay>
      )}
      {habitManageOpen && (
        <Overlay onClose={() => { setHabitManageOpen(false); resetHabitForm(); }}>
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="font-manrope text-[11px] font-bold uppercase tracking-wider text-muted">Kelola Kebiasaan</p>
              <h2 className="font-outfit text-2xl font-semibold">Kebiasaan Mingguan ⭐</h2>
            </div>
            <button type="button" aria-label="Tutup kelola kebiasaan" onClick={() => { setHabitManageOpen(false); resetHabitForm(); }} className="grid h-10 w-10 place-items-center rounded-full bg-inset">✕</button>
          </div>

          {habits.length === 0 ? (
            <div className="rounded-xl border border-line bg-inset px-4 py-6 text-center">
              <p className="text-3xl">🐱</p>
              <p className="mt-2 font-manrope text-sm text-muted">Belum ada kebiasaan. Buat satu di form bawah, terus centang tiap hari ya ✨</p>
            </div>
          ) : (
            <div className="space-y-2">
              {habits.map((habit) => {
                const weekDone = habit.completedDates.filter((date) => weekDates.includes(date)).length;
                return (
                  <div key={habit.id} className="flex items-center gap-3 rounded-lg bg-inset px-3 py-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-card text-lg">{habit.iconName}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-manrope text-sm font-semibold">{habit.title}</p>
                      <p className="tnum font-manrope text-[10px] font-bold text-muted">{weekDone}/{habit.targetDaysPerWeek} hari minggu ini</p>
                    </div>
                    <button type="button" aria-label={`Edit kebiasaan ${habit.title}`} onClick={() => startEditHabit(habit.id)} className="grid h-8 w-8 place-items-center rounded-full bg-card text-secondary"><Pencil size={14} /></button>
                    <button type="button" aria-label={`Hapus kebiasaan ${habit.title}`} onClick={() => void removeHabit(habit.id)} className="grid h-8 w-8 place-items-center rounded-full bg-card text-expense"><Trash2 size={14} /></button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 rounded-xl border border-line bg-inset p-4">
            <h3 className="font-outfit font-semibold">{habitForm.id ? "Edit Kebiasaan ✏️" : "Tambah Kebiasaan Baru ➕"}</h3>
            <input className="inset-field mt-3 h-11 w-full px-3" placeholder="Judul kebiasaan, misal: Minum air 8 gelas" value={habitForm.title} onChange={(e) => setHabitForm((c) => ({ ...c, title: e.target.value }))} />
            <div className="mt-3">
              <EmojiPicker value={habitForm.icon} onChange={(icon) => setHabitForm((c) => ({ ...c, icon }))} label="Ikon Kebiasaan" />
            </div>
            <p className="mt-3 mb-1.5 font-manrope text-xs font-bold uppercase tracking-wider text-muted">Target Hari / Minggu</p>
            <div className="grid grid-cols-7 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`Target ${n} hari per minggu`}
                  onClick={() => setHabitForm((c) => ({ ...c, target: n }))}
                  className={`tnum rounded-lg border py-2 font-manrope text-xs font-bold ${habitForm.target === n ? "border-secondary bg-secondary text-white" : "border-line bg-card text-muted"}`}
                >
                  {n}
                </button>
              ))}
            </div>
            {habitError && <p className="mt-2 font-manrope text-sm text-expense">{habitError}</p>}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Pressable className="btn-ghost h-11" onClick={resetHabitForm}>Reset Form</Pressable>
              <Pressable className="btn-primary h-11" onClick={() => void saveHabit()}>{habitForm.id ? "Simpan Perubahan" : "Tambah Kebiasaan"}</Pressable>
            </div>
          </div>
        </Overlay>
      )}
      <WidgetPreviewModal open={widgetOpen} onClose={() => setWidgetOpen(false)} group="meow" />
    </motion.main>
  );
}
