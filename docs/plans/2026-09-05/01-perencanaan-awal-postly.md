# Perencanaan Awal Postly

## 1. Status dan Cara Menjalankan

Status: **belum dikerjakan**.

Agent wajib membaca seluruh plan ini, tetapi hanya mengerjakan **Tahap 0** pada
run pertama. Tahap implementasi belum boleh dimulai. Checklist hanya ditandai
selesai jika bukti atau hasilnya dicatat pada `Log Eksekusi` di file ini.

## 2. Sumber Wajib

- `AGENTS.md`
- `docs/AGENTS.md`
- `README.md`
- `docs/PRODUCT-BRIEF.md`
- `docs/PARTICIPANT-GUIDE.md`
- `docs/ASSET-MANIFEST.md`
- seluruh gambar di `references/UI/`
- seluruh asset di `assets/`

`docs/GRAPHQL-JIT.md` dibaca setelah gate planning diterima, sebelum task
project foundation diberikan.

## 3. Outcome

Menghasilkan rencana minimum yang dapat dipakai untuk membangun Postly dari
repository kosong secara bertahap. Rencana harus menjaga scope produk, dapat
direview, dan mempunyai gate verifikasi konkret tanpa mengarang evidence.

## 4. Kontrak yang Tidak Boleh Berubah

- Frontend: React dan Apollo Client.
- Backend: Express dan Apollo Server.
- Data access: Prisma ORM 7 dengan SQLite lokal.
- Domain: hanya `User`, `Post`, dan `Comment`.
- Reply memakai `Comment.parentId`, dibatasi satu tingkat, dan parent berasal
  dari post yang sama.
- Feed publik menampilkan post terbaru lebih dahulu.
- Gambar post dipilih dari allowlist asset lokal.
- Tidak ada like, follow, story, chat, notification, subscription, sharing,
  bookmark, recommendation, atau upload pipeline.

## 5. Non-Goal Tahap 0

- Tidak membuat `package.json`.
- Tidak melakukan scaffold React atau Express.
- Tidak memasang dependency.
- Tidak membuat schema, migration, resolver, component, test, atau script.
- Tidak memilih DataLoader atau solusi relation loading sebelum masalah diukur.
- Tidak menciptakan query count, hasil test, screenshot, atau angka teknis.

## 6. Tahap 0 — Define, Decompose, dan Describe Context

Objective: membuat rencana implementasi yang cukup kecil untuk dikerjakan dan
diverifikasi satu tahap pada satu waktu.

- [ ] D00.1 Catat seluruh behavior yang wajib terlihat oleh pengguna.
- [ ] D00.2 Catat seluruh fitur dan keputusan yang berada di luar scope.
- [ ] D00.3 Jelaskan invariant `Comment.parentId`, batas satu tingkat, dan
  validasi parent terhadap post.
- [ ] D00.4 Catat asumsi yang belum dijawab repository; jangan mengubah asumsi
  menjadi fakta.
- [ ] D00.5 Usulkan struktur project minimum untuk frontend, backend, Prisma,
  test, dan static asset.
- [ ] D00.6 Pecah implementasi menjadi tahap kecil. Setiap tahap mempunyai satu
  outcome, acceptance condition, verification, dan stop condition bila relevan.
- [ ] D00.7 Pastikan project foundation menjadi vertical slice terkecil yang
  menghubungkan React, Apollo Client, Express, dan Apollo Server.
- [ ] D00.8 Pastikan diagnosis relation loading dilakukan sebelum pemilihan
  Prisma relation query, explicit batching, atau DataLoader.
- [ ] D00.9 Periksa rencana terhadap seluruh kontrak dan non-goal pada plan ini.
- [ ] D00.10 Catat hasil planning dan evidence pembacaan pada Log Eksekusi.

### Gate Tahap 0

Instructor dapat memahami urutan kerja, alasan pembagian tahap, acceptance
condition, serta asumsi yang masih terbuka tanpa membaca source yang belum ada.

### Stop Condition

- Berhenti jika stack, behavior wajib, atau batas scope saling bertentangan.
- Berhenti jika keputusan penting membutuhkan pilihan instructor.
- Jangan melanjutkan ke scaffold sebelum instructor menerima gate Tahap 0.

## 7. Hasil Perencanaan

Isi bagian ini saat Tahap 0 dikerjakan.

### Behavior dan non-goal

Belum diisi.

### Asumsi yang perlu dikonfirmasi

Belum diisi.

### Struktur project minimum

Belum diisi.

### Tahap implementasi dan gate

Belum diisi.

## 8. Definition of Done Tahap 0

- [ ] Seluruh item D00.1–D00.10 mempunyai hasil yang dapat direview.
- [ ] Tidak ada source code atau package manifest yang dibuat.
- [ ] Tidak ada fitur di luar scope yang masuk ke rencana.
- [ ] Setiap klaim selesai mempunyai catatan pada Log Eksekusi.
- [ ] Instructor telah menerima gate planning.

## 9. Log Eksekusi

Belum ada evidence. Tambahkan entri bertanggal yang memuat:

- tahap atau checklist ID;
- file dan referensi yang diperiksa;
- keputusan atau hasil yang diperoleh;
- verification yang dilakukan;
- asumsi, blocker, atau risiko yang tersisa.
