# BEDEBAH FC — Official Web Portal & Panduan Kelola Data

Website resmi klub sepak bola **BEDEBAH FC** (Sragen). Didesain dengan tema modern, sporty, dan profesional ala klub sepak bola dunia.

---

## 📁 Struktur File & Folder
```
bedebahfc/
├── index.html          ← Halaman website utama (Navigasi, Hero, Jadwal, Skuad, Galeri)
├── css/
│   └── style.css       ← Sistem desain klub, layout responsif, & tema athletic
├── js/
│   └── app.js          ← Logika aplikasi, filter & pencarian pemain, render kartu FUT & galeri
├── data/
│   ├── players.json    ← ✏️ EDIT DI SINI: Data skuad & rating pemain
│   ├── matches.json    ← ✏️ EDIT DI SINI: Jadwal & agenda pertandingan
│   └── gallery.json    ← ✏️ EDIT DI SINI: Arsip dokumentasi match & Google Drive
├── assets/
│   ├── bedebah_fc.png  ← Logo resmi klub Bedebah FC (1024x1024)
│   ├── card_bg.png     ← Latar belakang kartu EA Sports FUT
│   ├── anon.png        ← Siluet pemain default
│   └── indonesia.png   ← Bendera kebangsaan
└── README.md           ← Panduan teknis & pembaruan data
```

---

## 1. 📸 Cara Menambah Dokumentasi Galeri Baru (`data/gallery.json`)
Menu **Galeri** mengarsipkan dokumentasi foto/video setiap pertandingan tim melalui tautan Google Drive.

Untuk menambahkan dokumentasi pertandingan baru, tambahkan blok JSON berikut ke dalam array di `data/gallery.json`:

```json
{
  "id": 7,
  "title": "BEDEBAH FC vs NAMA LAWAN",
  "opponent": "NAMA LAWAN",
  "competition": "Sparring Match",
  "date": "15 Juli 2026",
  "venue": "Morley Minisoccer, Sragen",
  "photoCount": "50+ Foto",
  "driveUrl": "https://drive.google.com/drive/folders/KODE_FOLDER_DRIVE_ANDA",
  "thumbnail": "",
  "description": "Catatan singkat keseruan dan momen terbaik laga persahabatan ini."
}
```

> **Catatan Foto Thumbnail:**
> - Jika ada foto cover pertandingan, masukkan URL foto ke `"thumbnail": "https://link-foto.com/cover.jpg"` atau file lokal `"thumbnail": "assets/gallery/cover.jpg"`.
> - Jika `"thumbnail": ""` dikosongkan, sistem website secara otomatis membuat **Matchday Artwork Cover** eksklusif dengan pola lapangan dan logo Bedebah FC.
> - `"driveUrl"` akan dibuka otomatis oleh pengunjung di tab baru saat tombol **"Buka Google Drive"** diklik.

---

## 2. ⚽ Cara Menambah / Mengubah Pemain (`data/players.json`)

Tambahkan data pemain baru pada array di `data/players.json`:

```json
{
  "id": 55,
  "name": "Nama Pemain",
  "gk": false,
  "overall": 88,
  "skills": [
    { "label": "Sprint Nekat", "value": 91 },
    { "label": "Umpan Santai", "value": 85 },
    { "label": "Dribble Ngasal", "value": 78 },
    { "label": "Nongkrong Power", "value": 99 }
  ],
  "quote": "Kalah menang sing penting guyub rukun."
}
```

- `"gk": true` → Penjaga Gawang (Badge GK & Sarung Tangan)
- `"gk": false` → Pemain Lapangan (Outfield Player)
- `"overall"` → Rating kartu pemain (80–99)
- `"skills"` → 4 skill khas si pemain beserta nilainya
- `"id"` → Nomor ID berurutan unik

---

## 3. 🗓️ Cara Menambah Jadwal Pertandingan (`data/matches.json`)

Tambahkan data pertandingan baru pada array di `data/matches.json`:

```json
{
  "id": 5,
  "date": "2026-07-15",
  "day": "15",
  "month": "Jul",
  "competition": "Sparring",
  "opponent": "PERSEBAYA SRAGEN",
  "venue": "Stadion Taruna Sragen",
  "time": "16.00",
  "type": "upcoming",
  "htm": "± Rp. 25.000,-"
}
```

- `"type"`: `"upcoming"` (badge emas) atau `"trofeo"` (badge merah).
- Pertandingan internal: isi `"opponent": "INTERNAL"`.

---

## 4. 🚀 Deploy ke Netlify via GitHub

1. Commit dan push seluruh perubahan ke repositori GitHub.
2. Buka dashboard [app.netlify.com](https://app.netlify.com).
3. Pilih repositori Bedebah FC.
4. **Build command**: *(kosongkan)*
5. **Publish directory**: `/` atau `.`
6. Klik **Deploy Site**.
