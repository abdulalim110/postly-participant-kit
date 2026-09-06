# Postly Participant Kit — From Zero

Repository ini adalah titik awal peserta, bukan aplikasi yang sudah berjalan.
Target akhirnya dapat dilihat dari demo instructor dan referensi UI, tetapi
implementasinya harus dibangun peserta secara bertahap.

## Yang sudah disediakan

- `docs/PRODUCT-BRIEF.md`: outcome, scope, dan kontrak produk.
- `docs/AGENTS.md`: aturan kerja lengkap untuk coding agent.
- `docs/ASSET-MANIFEST.md`: daftar asset yang boleh digunakan aplikasi.
- `docs/GRAPHQL-JIT.md`: pengetahuan GraphQL minimum untuk mengerjakan case.
- `AGENTS.md`: pointer ringkas agar aturan repository otomatis ditemukan.
- `docs/PARTICIPANT-GUIDE.md`: cara memulai tahap pertama.
- `docs/plans/2026-09-05/01-perencanaan-awal-postly.md`: plan aktif pertama;
  checklist dan log eksekusi berada di file yang sama.
- `references/UI/`: referensi tampilan, bukan screenshot untuk ditempel ke UI.
- `assets/`: lima gambar post dan empat avatar lokal.

## Yang sengaja belum tersedia

- Project React atau Express.
- Apollo Client atau Apollo Server.
- `package.json` dan dependency lock.
- Prisma schema, migration, database, dan seed.
- GraphQL schema, resolver, auth, halaman, komponen, dan styling.
- Test, instrumentation, query count, serta solution relation loading.

## Mulai

1. Baca `AGENTS.md` dan `docs/AGENTS.md` sampai selesai.
2. Baca `docs/PRODUCT-BRIEF.md` dan seluruh referensi yang diwajibkan plan aktif.
3. Kerjakan hanya tahap planning pada
   `docs/plans/2026-09-05/01-perencanaan-awal-postly.md`, lalu minta review instructor.
4. Setelah rencana awal diterima, baca `docs/GRAPHQL-JIT.md` dan tunggu task
   implementasi berikutnya dari instructor.

Jangan menyalin project instructor. Demo instructor hanya menunjukkan target
produk; repository ini dipakai untuk mengalami proses engineering-nya.
