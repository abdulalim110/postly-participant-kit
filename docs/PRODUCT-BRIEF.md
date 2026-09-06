# Product Brief — Postly

## Outcome

Buat aplikasi social media publik yang kecil dan enak dilihat. User dapat
membuat akun, login, melihat feed publik, membuat post dari gambar lokal yang
tersedia, memberi komentar, membalas satu tingkat, dan membuka profil publik.

Kita tidak sedang membangun platform social media lengkap. Production-grade
berarti behavior yang dijanjikan benar, data aman, error dapat dijelaskan, dan
perubahan dapat dibuktikan—bukan menambah abstraksi atau fitur sebanyak mungkin.

## Required stack

- Frontend: React dan Apollo Client.
- Backend: Express dan Apollo Server.
- API contract: GraphQL sebagai kendaraan demonstrasi.
- Data access: Prisma ORM 7.
- Database lokal: SQLite; peserta tidak diwajibkan menggunakan Docker.
- Asset: seluruh gambar aplikasi berasal dari folder `assets/`.

## User-visible behavior

1. User dapat register dan login menggunakan email atau username.
2. Feed bersifat publik dan menampilkan post terbaru lebih dahulu.
3. User yang login dapat membuat post dengan memilih satu dari lima gambar lokal.
4. User yang login dapat menambahkan top-level comment.
5. User dapat membalas comment tepat satu tingkat.
6. Reply tetap disimpan sebagai `Comment` dengan `parentId`.
7. Nama author dapat dibuka menuju profil publik.
8. Profil menampilkan identitas dan post user tersebut.

## Domain minimum

Gunakan hanya tiga model domain:

- `User`
- `Post`
- `Comment`

Relasi reply tidak menggunakan tabel baru. Balasan memakai
`Comment.parentId` yang nullable. Desain harus mencegah reply terhadap reply.

## Scope guardrails

Jangan menambahkan:

- like;
- follow atau follower count;
- story;
- chat;
- notification;
- share atau bookmark;
- subscription/realtime;
- upload pipeline.

Pemilihan gambar hanya berasal dari allowlist asset lokal. GraphQL membantu
latihan membaca contract dan relation loading; GraphQL bukan positioning utama
kelas.

## Visual direction

Gunakan gambar di `references/UI/` sebagai rujukan hierarchy, spacing, komposisi,
dan treatment gambar. Jangan menjadikan screenshot sebagai background halaman.
Implementasi harus tetap berupa UI React yang dapat digunakan.

## Definition of done

Hasil akhir belum dianggap selesai hanya karena UI dapat dibuka. Setiap flow
harus memiliki acceptance check, error state yang masuk akal, dan evidence dari
run aktual. Jangan menciptakan query count, hasil test, atau klaim performa.

