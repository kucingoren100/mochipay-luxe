"use client";

import { LEAD_OPTIONS, REPEAT_OPTIONS, leadLabel } from "@/lib/notifications";
import { Pressable } from "@/components/ui/SquircleCard";
import { KawaiiIcon } from "@/components/ui/KawaiiIcon";
import { showBrowserNotif, useNotifSettings } from "@/hooks/useNotifications";

function Switch({ on, onChange, label }: { on: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-secondary" : "bg-inset"}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

export function NotificationSettingsCard() {
  const { settings, permission, update, askPermission } = useNotifSettings();

  const testNotif = () => {
    showBrowserNotif({
      key: `test|${Date.now()}`,
      title: "🔔 Tes notifikasi MochiMoy",
      body: "Kalau notif ini muncul, pengingat jadwalmu siap jalan 🐾✨",
      tag: "mochipay-test",
    });
  };

  return (
    <section className="cloud-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 font-outfit text-lg font-semibold">
            <KawaiiIcon name="bell-kawaii" size={20} />
            Notifikasi Jadwal
          </h2>
          <p className="mt-0.5 font-manrope text-xs leading-5 text-muted">
            Pengingat deadline muncul langsung di notifikasi HP/laptopmu (PWA). Diubah kapan saja, tersimpan di perangkat.
          </p>
        </div>
      </div>

      {permission === "unsupported" ? (
        <p className="mt-3 rounded-xl border border-line bg-inset px-3 py-2.5 font-manrope text-xs font-semibold text-expense">
          Browser ini tidak mendukung notifikasi. Coba Chrome/Edge, atau install PWA-nya dulu 🙏
        </p>
      ) : permission !== "granted" ? (
        <div className="mt-3 rounded-xl border border-line bg-inset p-3">
          <p className="font-manrope text-xs leading-5 text-muted">
            {permission === "denied"
              ? "Izin notifikasi pernah ditolak. Aktifkan lewat setelan browser (ikon gembok di address bar → Notifications → Allow), lalu tekan cek di bawah."
              : "Supaya pengingat bisa tampil di device, izinkan notifikasi dulu sekali."}
          </p>
          <Pressable className="btn-primary mt-2.5 h-10 w-full text-xs" onClick={() => void askPermission()}>
            🔔 Izinkan Notifikasi
          </Pressable>
        </div>
      ) : (
        <p className="mt-3 rounded-xl bg-income/10 px-3 py-2 font-manrope text-xs font-bold text-income">✅ Izin notifikasi sudah aktif</p>
      )}

      {settings && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-outfit text-sm font-semibold">Pengingat Deadline</p>
              <p className="font-manrope text-[11px] text-muted">Notifikasi saat tugas mendekati jam deadline</p>
            </div>
            <Switch on={settings.enabled} onChange={(enabled) => update({ enabled })} label="Aktifkan pengingat deadline" />
          </div>

          {settings.enabled && (
            <div className="rounded-xl border border-line bg-inset p-3">
              <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Tampil berapa lama sebelum deadline</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {LEAD_OPTIONS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => update({ leadMinutes: m })}
                    className={`rounded-full px-3 py-1.5 font-manrope text-[11px] font-bold ${settings.leadMinutes === m ? "bg-secondary text-white" : "bg-card text-muted"}`}
                  >
                    {m === 0 ? "Tepat waktu" : m < 60 ? `${m} mnt` : m < 1440 ? `${m / 60} jam` : "1 hari"}
                  </button>
                ))}
              </div>
              <p className="mt-2 font-manrope text-[11px] text-muted">Mode aktif: {leadLabel(settings.leadMinutes)}.</p>

              <p className="mt-3 font-manrope text-xs font-bold uppercase tracking-wider text-muted">Ulangi berapa kali di hari yang sama</p>
              <div className="mt-2 flex items-center gap-1.5">
                {REPEAT_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => update({ repeatCount: n })}
                    className={`rounded-full px-3 py-1.5 font-manrope text-[11px] font-bold ${settings.repeatCount === n ? "bg-secondary text-white" : "bg-card text-muted"}`}
                  >
                    {n}x
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-manrope text-[11px] text-muted">Jarak antar-ulang</span>
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={settings.repeatIntervalMinutes}
                  onChange={(e) => {
                    const v = Math.min(240, Math.max(5, Number(e.target.value) || 5));
                    update({ repeatIntervalMinutes: v });
                  }}
                  className="inset-field h-9 w-16 px-2 text-center font-manrope text-xs font-bold"
                  aria-label="Jarak antar pengulangan dalam menit"
                />
                <span className="font-manrope text-[11px] text-muted">menit (berikutnya di hari yang sama)</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-outfit text-sm font-semibold">Ringkasan Besok</p>
              <p className="font-manrope text-[11px] text-muted">Seberapa banyak tugas menunggu, dikirim tiap pagi</p>
            </div>
            <Switch on={settings.nextDaySummary} onChange={(nextDaySummary) => update({ nextDaySummary })} label="Aktifkan ringkasan besok" />
          </div>

          {settings.nextDaySummary && (
            <div className="flex items-center gap-2 rounded-xl border border-line bg-inset p-3">
              <span className="font-manrope text-xs font-bold text-muted">Kirim jam</span>
              <input
                type="time"
                value={settings.summaryTime}
                onChange={(e) => update({ summaryTime: e.target.value })}
                className="inset-field h-9 flex-1 px-2 font-manrope text-xs font-bold"
                aria-label="Jam ringkasan besok"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Pressable className="btn-ghost h-10 flex-1 text-xs" onClick={testNotif}>🧪 Tes Notifikasi</Pressable>
          </div>
          <p className="font-manrope text-[10px] leading-4 text-muted">
            💡 MochiMoy jalan 100% lokal tanpa server, jadi pengingat dicek tiap 30 detik selama aplikasi terbuka (tab atau jendela PWA).
            Install PWA + biarkan berjalan di latar belakang supaya notif tidak kelewat; notifikasi yang sudah muncul tidak dobel walau aplikasi dibuka ulang.
          </p>
        </div>
      )}
    </section>
  );
}
