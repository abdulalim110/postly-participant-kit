# Instruksi Kerja Postly Participant Kit

Aturan ini berlaku untuk seluruh repository. Root `AGENTS.md` dipertahankan
ringkas sebagai pointer agar instruksi ini mudah ditemukan coding agent.
Penempatan detail di `docs/AGENTS.md` adalah pilihan organisasi repository ini,
bukan syarat universal yang harus ditiru setiap project.

## 1. Sebelum Mengubah File

- Baca `README.md`, `docs/PRODUCT-BRIEF.md`, dan plan aktif sampai selesai.
- Periksa referensi UI dan asset yang berkaitan dengan tahap yang ditugaskan.
- Kerjakan hanya tahap yang diminta instructor. Jangan melanjutkan tahap lain
  hanya karena tahap tersebut terlihat mudah.
- Jika repository tidak menjawab keputusan penting, catat sebagai asumsi di
  plan aktif. Jangan diam-diam mengisi kekosongan dengan tebakan.

## 2. Bahasa dan Bentuk Jawaban

- Bahasa kerja tidak wajib bahasa Inggris.
- Ikuti bahasa pengguna. Untuk kelas ini, penjelasan dan dokumentasi boleh
  menggunakan bahasa Indonesia yang ringkas dan alami.
- Nama library, operation GraphQL, command, path, dan identifier kode tidak perlu
  diterjemahkan.
- Jangan mengganti bahasa file yang sudah konsisten hanya demi menyeragamkan.
- Saat menyerahkan pekerjaan, laporkan file yang berubah, perintah verifikasi,
  hasil yang benar-benar teramati, dan risiko yang masih tersisa.

## 3. Kontrak Produk

- Frontend menggunakan React dan Apollo Client.
- Backend menggunakan Express dan Apollo Server.
- Data access menggunakan Prisma ORM 7 dan SQLite untuk pengembangan lokal.
- Model domain hanya `User`, `Post`, dan `Comment`.
- Reply tetap berupa `Comment` dengan `parentId`; jangan membuat tabel Reply.
- Reply dibatasi satu tingkat dan parent harus berasal dari post yang sama.
- Feed bersifat publik dan diurutkan dari post terbaru.
- Gambar post hanya boleh dipilih dari allowlist asset lokal.
- GraphQL adalah kendaraan demonstrasi, bukan tujuan utama produk.
- Jangan menambahkan like, follow, story, chat, notification, subscription,
  sharing, bookmark, recommendation, atau upload pipeline.

## 4. Aturan Plan Bertahap

- Simpan plan pekerjaan di `docs/plans/YYYY-MM-DD/`.
- Satu masalah atau outcome menggunakan satu plan. Buat plan baru jika akar
  masalah atau outcome berubah secara material.
- Agent membaca seluruh plan, tetapi mengerjakan satu tahap per run kecuali
  instructor meminta lebih.
- Setiap tahap harus mempunyai objective, checklist, acceptance condition, dan
  verification yang konkret.
- Checklist hanya boleh ditandai selesai bila buktinya dicatat pada bagian
  `Log Eksekusi` di file plan yang sama.
- Jangan menggandakan plan hanya untuk mengubah status.
- Jangan menyimpan progress tracker permanen di `AGENTS.md`.

## 5. Disiplin Implementasi

- Jaga diff cukup kecil untuk direview dalam satu checkpoint.
- Pertahankan kontrak GraphQL kecuali plan aktif secara eksplisit mengubahnya.
- Diagnosis relation loading harus dilakukan sebelum mengganti implementasinya.
- Prisma relation query, explicit batching, dan DataLoader adalah opsi dengan
  trade-off. DataLoader bukan jawaban otomatis.
- Loader dan cache yang terkait request harus terisolasi per request.
- Jangan menambah dependency atau abstraksi tanpa menjelaskan masalah konkret
  yang diselesaikannya.
- Pertahankan perubahan pengguna yang tidak terkait dan hindari operasi Git
  destruktif.

## 6. Evidence dan Stop Condition

- Respons model yang mengatakan `done` bukan evidence.
- Jangan menciptakan screenshot, query count, hasil test, timing, atau klaim
  performa.
- Gunakan data dan command aktual. Jika verification belum dapat dijalankan,
  biarkan checklist terbuka dan catat alasannya.
- Hentikan tahap jika scope, kontrak produk, atau precondition utamanya tidak
  terpenuhi. Catat blocker sebelum meminta keputusan instructor.
- Pekerjaan berulang dengan aturan stabil sebaiknya dipindahkan ke script atau
  test biasa setelah pola dan acceptance condition dipahami.
