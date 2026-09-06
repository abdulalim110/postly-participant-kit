# Participant Guide — Mulai dari Nol

## Kenapa repository ini belum berisi project?

Latihannya bukan sekadar memperbaiki kode yang sudah disiapkan. Peserta akan
menggunakan AI untuk membantu merencanakan dan membangun Postly secara bertahap,
kemudian mengaudit hasilnya dengan evidence. Demo instructor menunjukkan tujuan
akhir, bukan source untuk disalin.

## Tahap pertama: planning saja

Jangan langsung meminta AI “buatkan seluruh aplikasi”. Mulai dengan meminta AI
membaca brief, UI reference, aturan kerja, dan plan aktif, lalu menghasilkan
rencana yang dapat direview.

Contoh prompt awal:

```text
Baca AGENTS.md, docs/AGENTS.md, docs/PRODUCT-BRIEF.md,
docs/PARTICIPANT-GUIDE.md, dan plan aktif di
docs/plans/2026-09-05/01-perencanaan-awal-postly.md sampai selesai.
Periksa seluruh file di references/UI dan daftar asset yang tersedia.

Kerjakan Tahap 0 pada plan aktif saja. Jangan membuat package.json atau source
code. Isi hasil perencanaan, perbarui checklist yang sudah mempunyai bukti, dan
catat buktinya pada Log Eksekusi di file plan yang sama. Jangan melanjutkan ke
implementasi sebelum instructor menyetujui gate planning.
```

## Review gate planning

Sebelum membuat project, pastikan rencana peserta menjawab:

- Apa saja flow wajib yang terlihat user?
- Apa saja fitur yang dilarang masuk scope?
- Di mana `Comment.parentId` akan dijaga?
- Bagaimana frontend, GraphQL, dan Prisma dipisahkan secara minimal?
- Apa acceptance check untuk task project foundation?
- Bagian mana yang masih asumsi, bukan fakta?

Jika jawaban belum jelas, perbaiki rencananya. Jika sudah jelas, instructor
akan memberikan task implementation berikutnya beserta acceptance condition.

## Prinsip penggunaan AI

- Gunakan AI untuk memahami, merencanakan, dan membuat perubahan kecil.
- Untuk pekerjaan berulang dengan aturan stabil, buat script atau test biasa.
- Periksa diff dan jalankan bukti; respons AI bukan evidence.
- Jangan menganggap task selesai hanya karena AI mengatakan “done”.
