"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { KawaiiMascot } from "@/components/ui/KawaiiMascot";

const SECTIONS: { id: string; emoji: string; title: string; body: string[]; steps?: string[] }[] = [
  {
    id: "mulai",
    emoji: "🌱",
    title: "Mulai Cepat",
    body: [
      "MochiMoy adalah buku kas kawaii yang jalan 100% di perangkatmu. Semua catatan, dompet, dan celengan tersimpan lokal di browser (IndexedDB), jadi tetap kebuka walau tanpa internet.",
      "Saat pertama dibuka, aplikasi menyiapkan data awal: beberapa dompet contoh dengan saldo Rp 0 supaya kamu bisa langsung coba catat cuan.",
    ],
    steps: [
      "Tekan tombol \"+ Catat Cuan\" (bawah kanan di HP, sidebar kiri di laptop) untuk mencatat transaksi pertama.",
      "Tekan \"Install App 📲\" di beranda kalau mau pakai seperti aplikasi biasa (PWA), lengkap dengan mode offline.",
      "Buka halaman Saya untuk ganti nama panggilan, tema, dan panduan privasi angka.",
    ],
  },
  {
    id: "beranda",
    emoji: "🏠",
    title: "Beranda: Pantau Cuan Sekilas",
    body: [
      "Kartu besar \"Total Cuan Kamu / Duit Dingin\" menjumlahkan saldo semua dompetmu. Angka ini sama dengan yang tampil di preview halaman Saya.",
      "Ikon mata di kartu itu untuk menyembunyikan atau menampilkan saldo (berguna saat layar diliatin orang). Chip hijau menunjukkan perbandingan cuan bulan ini vs bulan lalu, dan pill bawah menunjukkan status Limit Harian.",
      "Grafik batang mingguan membandingkan pemasukan vs jajan 7 hari terakhir, lengkap pesan semangat. Di bawahnya ada Aksi Cepat dan catatan transaksi terakhir yang bisa diketuk untuk lihat detail.",
    ],
  },
  {
    id: "catat",
    emoji: "✍️",
    title: "Catat Transaksi (Jajan, Cuan, Transfer)",
    body: [
      "Sheet \"Catat Cuan\" punya tiga tab: Pengeluaran (jajan), Pemasukan (cuan masuk), dan Transfer (pindah dana antar dompet atau setor ke celengan).",
      "Preview nominal besar muncul di atas keyboard angka supaya ketikanmu gampang dibaca. Pilih kategori beserta ikonnya, dompet sumber, tanggal & jam, plus catatan maksimal 120 kata.",
    ],
    steps: [
      "Pilih tab sesuai jenis transaksi.",
      "Ketik nominal (atau pakai tombol cepat bila ada), pilih kategori dan dompet.",
      "Untuk Transfer: pilih tujuan — dompet lain atau celengan impian.",
      "Tekan simpan; kalau pemasukan, muncul perayaan dan penawaran alokasi 10% ke celengan.",
    ],
  },
  {
    id: "detail",
    emoji: "🔍",
    title: "Detail, Edit & Hapus Catatan",
    body: [
      "Ketuk catatan mana pun (di beranda atau riwayat) untuk membuka detailnya. Dari situ kamu bisa mengubah kategori, ikon, dompet, tanggal, jam, dan catatan.",
      "Kalau catatan sudah tidak benar, bisa dihapus dari sheet yang sama. Saldo dompet otomatis menyesuaikan setelah edit atau hapus.",
    ],
  },
  {
    id: "riwayat",
    emoji: "📊",
    title: "Riwayat & Analisis",
    body: [
      "Halaman Riwayat menampilkan donat pembagian jajan per kategori plus daftar transaksi lengkap.",
      "Filter periode: Bulan Ini, Minggu Ini, Bulan Lalu, atau Custom dengan tanggal bebas. Filter tipe: Semua, Pengeluaran, Pemasukan, Transfer. Ada juga filter kategori dan dompet lewat dropdown gemas.",
      "Tombol unduh di atas menyiapkan file CSV buat rekap di spreadsheet favoritmu.",
    ],
  },
  {
    id: "budget",
    emoji: "🍰",
    title: "Kategori Jajan & Limit",
    body: [
      "Di halaman Celengan (menu Budget), kartu paling atas menunjukkan Batas Jajan bulan ini: terpakai, sisa aman, dan rata-rata jajan per hari. Tombol \"Edit Limit\" mengubah total limit dan membaginya proporsional ke semua kategori.",
      "Setiap kartu kategori punya tiga kendali: ketuk kartunya untuk buka editor, ikon pensil untuk edit nama/subjudul/ikon/limit kategori, dan ikon tempat sampah merah untuk menghapus kategori beserta konfirmasi.",
      "Menghapus kategori tidak menghapus catatan transaksi lama — catatan tetap menyimpan nama & ikon kategorinya sebagai snapshot.",
    ],
  },
  {
    id: "celengan",
    emoji: "🎯",
    title: "Celengan Impian",
    body: [
      "Celengan adalah target nabung (misal liburan atau gadget). Tombol \"+ Isi Celengan\" memindahkan dana dari dompet pilihan ke celengan lewat catatan transfer.",
      "Ikon pensil mengedit judul, subjudul, ikon, target nominal, tanggal target, dan setoran rutin. Ikon tempat sampah menghapus celengan setelah konfirmasi.",
      "Kalau celengan masih dipakai catatan transfer, penghapusan ditolak dulu — hapus atau pindahkan catatan terkait biar riwayat tetap jujur. Dana di celengan yang dihapus tidak otomatis balik ke dompet, jadi pikir matang-matang ya.",
      "Switch kunci (🔒) menandai celengan yang dananya tidak boleh diganggu gugat.",
    ],
  },
  {
    id: "dompet",
    emoji: "💳",
    title: "Dompet & Kartu",
    body: [
      "Halaman Dompet menampilkan semua dompet/kartu sebagai kartu gemas. Ketuk kartu untuk membuka detail: ubah limit harian, lihat kode tarik tunai, atau edit dompet.",
      "Tambah dompet baru lewat tombol tambah: isi nama, jenis (tabungan/kartu/e-wallet), saldo awal, dan pilih ikon dari grid ikon yang disediakan. Nama pemilik kartu otomatis mengikuti nama profilmu.",
      "Edit dompet bisa mengubah nama, jenis, saldo, ikon, dan limit harian. Saldo yang diubah manual dianggap penyesuaian, jadi cocok buat rekonsiliasi cepat.",
    ],
  },
  {
    id: "tema",
    emoji: "🌈",
    title: "Tema, Ikon & Aksesibilitas",
    body: [
      "Halaman Saya punya tujuh palet pastel (Stroberi, Lavender, Peachy, Matcha, Sky, Cocoa, Sienna Artsy). Setiap palet membawa pack ikon & maskot bergaya sendiri — ganti palet dan seluruh ikon aplikasi ikut berganti gaya.",
      "Mode tampilan: Terang, Gelap, atau Ikut Sistem. Bagian Aksesibilitas punya switch \"Angka ekstra tebal & kontras\" dan \"Sembunyikan Saldo\" untuk privasi.",
      "Kotak \"Intip Tampilan Langsung\" menunjukkan preview kartu saldo, maskot, dan ikon dengan pengaturan yang sedang aktif — angkanya sinkron dengan beranda.",
    ],
  },
  {
    id: "profil",
    emoji: "🪪",
    title: "Nama Panggilan",
    body: [
      "Kolom Profil di halaman Saya mengatur nama panggilanmu. Nama ini langsung dipakai di sapaan beranda, header halaman Saya, dan nama pemilik di semua kartu dompet.",
      "Maksimal 40 karakter, tersimpan otomatis di perangkat begitu diketik.",
    ],
  },
  {
    id: "backup",
    emoji: "🛟",
    title: "Backup, Restore & Reset",
    body: [
      "Karena data hidup di browser perangkat ini, backup itu penting: \"Export Backup (.json)\" mengunduh seluruh isi buku kas, dan \"Import Restore (.json)\" mengembalikannya (misal setelah ganti laptop).",
      "\"Download CSV\" mengeluarkan rekap transaksi untuk olah data di spreadsheet. \"Reset ke Data Awal\" mengembalikan aplikasi ke kondisi baru lahir — semua datamu hilang, jadi pastikan sudah backup.",
      "Sebelum membersihkan cache browser atau uninstall, export backup dulu ya bestie.",
    ],
  },
  {
    id: "todo",
    emoji: "✅",
    title: "Cantikk Todo: Tugas & Kebiasaan",
    body: [
      "Halaman Tugas (✅ di navigasi bawah) memisahkan tugas per keranjang: Hari Ini, Besok, Mendatang, dan Lewat Waktu. Ringkasan persen di atas menunjukkan seberapa beres keranjang yang sedang dibuka.",
      "Tugas dibuat lewat tombol \"Tambah Tugas ✏️\" dengan dua langkah: judul + kategori + tanggal/jam, lalu detail seperti prioritas, pengulangan, pengingat, subtask, dan tag. Tugas yang sudah ada bisa diedit atau dihapus dari kartunya masing-masing.",
      "Kategori juga penuh CRUD: tekan \"🗂️ Kelola\" untuk menambah, mengubah ikon/warna, atau menghapus kategori. Sedang bikin tugas? Tekan chip \"➕ Buat Sendiri\" di dalam modal — kategori baru langsung tersimpan dan otomatis terpilih.",
      "Kebiasaan Minggu Ini 🐾 kini bisa diatur mandiri: tekan \"⭐ Kelola\" atau \"➕ Tambah Kebiasaan Baru\" untuk membuat kebiasaan dengan ikon pilihan dan target hari per minggu (1–7), mengedit judul/target, atau menghapusnya beserta progres hariannya. Centang kotak tanggal di kartu kebiasaan tiap kali kamu berhasil — tanggal depan masih terkunci supaya jujur.",
      "Ada juga halaman Kalender 🗓️ dan Stat 📊 di dalam menu Cantikk Todo untuk melihat jadwal bulanan dan rekap produktivitasmu.",
      "Di halaman Kalender ada panel \"Notifikasi Jadwal 🔔\": aktifkan izin notifikasi sekali, lalu atur pengingat muncul berapa menit/jam sebelum deadline (tepat waktu sampai 1 hari sebelum), diulang berapa kali di hari yang sama beserta jaraknya, dan optional \"Ringkasan Besok\" yang mengirim daftar tugas besok tiap pagi. Shortcut \"🔔 Notif\" di halaman Tugas langsung menuju pengaturan ini.",
    ],
    steps: [
      "Buka Tugas → \"Tambah Tugas ✏️\", isi judul, pilih atau buat kategori, atur tanggal lalu lanjut ke detail.",
      "Untuk kebiasaan: \"⭐ Kelola\" → isi judul, pilih ikon, tentukan target hari/minggu → \"Tambah Kebiasaan\".",
      "Centang kotak tanggal di kartu kebiasaan tiap kali kamu berhasil menjalankannya; chip \"n/n hari\" menunjukkan progres minggu ini.",
    ],
  },
  {
    id: "widget",
    emoji: "📲",
    title: "Galeri Widget & Pintasan Home Screen",
    body: [
      "MochiMoy menyiapkan dua keluarga tampilan widget: keuangan MochiMoy 💰 (11 varian — saldo, jajan, celengan, budget, dll.) dan Meow Todo 🐱 (Daftar Tugas 3x2 + Kalender Dot Matrix 3x2). Keduanya adalah pratinjau live — angkanya data asli milikmu.",
      "Galerinya ada di Saya → \"Widget Desktop/HP 📲\" untuk melihat semua varian, dan di halaman Tugas ada \"📲 Lihat Widget\" untuk pratinjau keluarga Meow Todo. Buka salah satu untuk masuk ke modal pratinjau: geser kiri/kanan atau pakai titik pagination buat pindah varian.",
      "Catatan jujur: widget home screen langsung dari PWA masih fitur eksperimen Chrome (status Backlog, belum dirilis) dan tidak tersedia di iOS. Jadi yang bisa dipasang sekarang adalah pintasan: long-press ikon MochiMoy di Layar Utama → seret shortcut Catat Cuan / Tugas / Kalender ke home screen.",
      "Buka \"Versi Standalone 🔗\" lalu simpan lewat browser (Add to Home Screen / bookmark) untuk akses fullscreen sat-set. Datanya membaca database lokal yang sama, jadi saldo & tugas selalu sinkron.",
    ],
  },
  {
    id: "tips",
    emoji: "💡",
    title: "Tips & Tanya Jawab",
    body: [
      "Q: Datanya tersimpan di mana? A: Hanya di browser perangkat ini (IndexedDB + localStorage). Tidak ada server, tidak ada akun, tidak ada data yang dikirim keluar.",
      "Q: Kenapa saldo di dua tempat berbeda? A: Semua tampilan saldo membaca sumber yang sama; kalau terlihat beda, biasanya layar belum di-refresh — tarik ke bawah atau reload sekali.",
      "Q: Bisa pakai offline? A: Bisa. Setelah sekali dimuat (atau setelah install PWA), aplikasi tetap jalan tanpa internet.",
      "Tips: pakai kategori terpisah untuk jajan harian vs tagihan rutin biar donat riwayat lebih jujur. Tips lain: set Limit Harian di dompet utama supaya pill status di beranda bisa mengingatkanmu sebelum kebablasan.",
    ],
  },
];

export default function PanduanPage() {
  return (
    <main className="space-y-5">
      <header className="flex items-center gap-3">
        <Link
          href="/settings"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-inset text-secondary"
          aria-label="Kembali ke halaman Saya"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-outfit text-2xl font-semibold">Panduan Lengkap MochiMoy 📖</h1>
          <p className="font-manrope text-sm text-muted">Tata cara pakai dari A sampai Z, versi bestie ✨</p>
        </div>
      </header>

      <nav className="cloud-card p-4" aria-label="Daftar isi panduan">
        <p className="font-manrope text-xs font-bold uppercase tracking-wider text-muted">Daftar Isi</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full bg-inset px-3 py-1 font-manrope text-xs font-bold text-secondary"
            >
              {s.emoji} {s.title}
            </a>
          ))}
        </div>
      </nav>

      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="cloud-card scroll-mt-4 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--icon-badge-bg)] text-xl">{s.emoji}</span>
            <h2 className="font-outfit text-lg font-semibold">{s.title}</h2>
          </div>
          <div className="mt-3 space-y-2">
            {s.body.map((p, i) => (
              <p key={i} className="font-manrope text-sm leading-6 text-muted">{p}</p>
            ))}
          </div>
          {s.steps && (
            <ol className="mt-3 space-y-1.5">
              {s.steps.map((step, i) => (
                <li key={i} className="flex gap-2 font-manrope text-sm leading-6">
                  <span className="tnum grid h-5 w-5 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-bold text-white">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}

      <section className="cloud-card flex items-center gap-4 p-5">
        <KawaiiMascot size={110} />
        <div>
          <p className="font-outfit text-lg font-semibold">Siap jadi bestie finansialmu 💖</p>
          <p className="mt-1 font-manrope text-sm leading-6 text-muted">
            Kalau masih bingung, buka lagi halaman ini kapan saja dari Saya → Panduan. Semangat rapikan cuan!
          </p>
          <Link href="/" className="btn-primary mt-3 inline-flex h-11 items-center px-4 text-sm">
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
}
