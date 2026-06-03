# BEDEBAH FC — Panduan Edit

## Struktur File
```
bedebah-fc/
├── index.html          ← Website utama (jangan diedit kecuali perlu)
├── data/
│   ├── players.json    ← ✏️ EDIT DI SINI untuk tambah/ubah pemain
│   └── matches.json    ← ✏️ EDIT DI SINI untuk tambah/ubah jadwal
└── README.md
```

---

## Cara Tambah Pemain Baru (`data/players.json`)

Salin blok ini dan tambahkan di akhir array (sebelum `]`):

```json
{
  "id": 34,
  "name": "Nama Pemain",
  "gk": false,
  "overall": 82,
  "skills": [
    { "label": "Skill Lucu 1",  "value": 88 },
    { "label": "Skill Lucu 2",  "value": 75 },
    { "label": "Skill Lucu 3",  "value": 92 },
    { "label": "Skill Lucu 4",  "value": 61 }
  ],
  "quote": "Quote konyol si pemain."
}
```

- `"gk": true` → Kiper (dapat tag GK 🔐)
- `"gk": false` → Player biasa
- `"overall"` → minimal 80, bebas 80–99
- `"id"` → urutan angka, jangan sama dengan yang lain

---

## Cara Tambah Jadwal Baru (`data/matches.json`)

```json
{
  "id": 4,
  "date": "2026-07-05",
  "day": "05",
  "month": "Jul",
  "competition": "Friendmatch",
  "opponent": "NAMA LAWAN FC",
  "venue": "Nama Lapangan",
  "time": "16.00",
  "type": "upcoming"
}
```

- `"type"` → `"upcoming"` (badge kuning) atau `"trofeo"` (badge merah)
- Untuk pertandingan internal: `"opponent": "INTERNAL"`

---

## Deploy ke Netlify via GitHub

1. Push semua file ke repo GitHub
2. Buka [app.netlify.com](https://app.netlify.com)
3. New site → Import from Git → pilih repo
4. Build command: *(kosongkan)*
5. Publish directory: `/` atau `.`
6. Deploy!

Setiap kali edit file di GitHub → Netlify otomatis redeploy.

---

## Absensi

Data absensi tersimpan di **localStorage browser masing-masing pemain**.
Artinya: setiap orang buka website → konfirmasi hadir → tersimpan di browser mereka sendiri.

> Kalau nanti mau data absensi terpusat (semua orang lihat siapa yang hadir),
> perlu tambahkan Google Sheets atau Netlify Forms — bisa upgrade nanti.
