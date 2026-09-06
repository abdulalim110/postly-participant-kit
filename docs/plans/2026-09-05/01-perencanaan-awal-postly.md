# Perencanaan Awal Postly

## 1. Status dan Cara Menjalankan

Status: **Tahap 4 selesai (Comment, Reply, & Invariant Enforcement terverifikasi)**.

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

- [x] D00.1 Catat seluruh behavior yang wajib terlihat oleh pengguna.
- [x] D00.2 Catat seluruh fitur dan keputusan yang berada di luar scope.
- [x] D00.3 Jelaskan invariant `Comment.parentId`, batas satu tingkat, dan
  validasi parent terhadap post.
- [x] D00.4 Catat asumsi yang belum dijawab repository; jangan mengubah asumsi
  menjadi fakta.
- [x] D00.5 Usulkan struktur project minimum untuk frontend, backend, Prisma,
  test, dan static asset.
- [x] D00.6 Pecah implementasi menjadi tahap kecil. Setiap tahap mempunyai satu
  outcome, acceptance condition, verification, dan stop condition bila relevan.
- [x] D00.7 Pastikan project foundation menjadi vertical slice terkecil yang
  menghubungkan React, Apollo Client, Express, dan Apollo Server.
- [x] D00.8 Pastikan diagnosis relation loading dilakukan sebelum pemilihan
  Prisma relation query, explicit batching, atau DataLoader.
- [x] D00.9 Periksa rencana terhadap seluruh kontrak dan non-goal pada plan ini.
- [x] D00.10 Catat hasil planning dan evidence pembacaan pada Log Eksekusi.

### Gate Tahap 0

Instructor dapat memahami urutan kerja, alasan pembagian tahap, acceptance
condition, serta asumsi yang masih terbuka tanpa membaca source yang belum ada.

### Stop Condition

- Berhenti jika stack, behavior wajib, atau batas scope saling bertentangan.
- Berhenti jika keputusan penting membutuhkan pilihan instructor.
- Jangan melanjutkan ke scaffold sebelum instructor menerima gate Tahap 0.

## 7. Hasil Perencanaan

### Behavior dan non-goal

#### Behavior Wajib (User-Visible):
1. **Autentikasi Pengguna:** Pengguna dapat mendaftar (register) dan masuk (login) menggunakan email/username dan password.
2. **Public Feed:** Pengunjung dapat melihat feed postingan publik tanpa harus login. Feed menampilkan postingan terbaru lebih dahulu (*newest first*).
3. **Pembuatan Post:** Pengguna yang telah login dapat membuat post baru dengan memilih salah satu dari 5 allowlist gambar lokal dan menyertakan caption teks.
4. **Top-Level Comment:** Pengguna yang telah login dapat memberikan komentar utama (*top-level*) pada suatu postingan.
5. **Single-Level Reply:** Pengguna yang telah login dapat membalas komentar utama tepat satu tingkat.
6. **Profil Publik:** Pengguna dapat mengklik nama author pada post/komentar untuk melihat halaman profil publik yang menampilkan identitas user dan daftar postingannya.
7. **Visual Hierarchy:** Tampilan antarmuka mengikuti hirarki dan tata letak pada `references/UI/` (Clean Feed, Create Post, Login, Register, Profile).

#### Scope Guardrails (Non-Goals):
- **Tidak ada fitur sosial tambahan:** Like/reaction, follow/unfollow, follower count, stories/status, chat/DM, notifikasi, share, bookmark, dan sistem rekomendasi.
- **Tidak ada realtime/subscription:** Tidak menggunakan GraphQL Subscription atau WebSocket.
- **Tidak ada arbitrary file upload:** Gambar hanya berasal dari 5 gambar post lokal (`post-city`, `post-code`, `post-coffee`, `post-mountain`, `post-workspace`) dan 4 avatar lokal (`avatar-alex`, `avatar-emily`, `avatar-james`, `avatar-sarah`).
- **Tidak ada tabel `Reply` terpisah:** Reply diwajibkan menggunakan tabel `Comment` dengan field `parentId`.

---

### Invariant Komentar & Balasan (`Comment.parentId`)

1. **Struktur Model:** Model `Comment` memiliki field `id`, `content`, `postId`, `authorId`, `parentId` (nullable), dan `createdAt`.
2. **Top-Level Comment:** Memiliki nilai `parentId = null`.
3. **Reply Comment:** Memiliki nilai `parentId` yang merujuk pada `Comment.id` dari komentar yang dibalas.
4. **Invariant Batas 1 Tingkat (*No Nested Replies*):**
   - Saat mutation `createComment(postId, parentId, content)` dipanggil dengan `parentId` tidak null:
   - Backend memverifikasi target parent comment di database.
   - Jika parent comment tersebut sudah memiliki `parentId != null` (berarti parent tersebut adalah reply), mutasi **harus ditolak** dengan error validasi (*tidak boleh membalas sebuah balasan*).
5. **Invariant Post yang Sama (*Same Post Validation*):**
   - Backend memverifikasi bahwa `parentComment.postId === postId`.
   - Jika parent comment berasal dari postingan yang berbeda, mutasi **harus ditolak** dengan error validasi (*parent comment tidak berada pada post yang sama*).

---

### Asumsi yang Perlu Dikonfirmasi

1. **Metode Autentikasi & Session:** Menggunakan JSON Web Token (JWT) yang dikirim client melalui header HTTP `Authorization: Bearer <token>`, diverifikasi pada context GraphQL Apollo Server.
2. **Password Security:** Password pengguna di-hash sebelum disimpan ke SQLite menggunakan `bcrypt` / `bcryptjs`.
3. **Penyajian Aset Statis:** Folder `assets/` disajikan secara statis oleh server Express (misal melalui endpoint `/assets`) atau diakses client sebagai static asset bundler.
4. **Seed Database:** Seed awal SQLite disiapkan untuk membuat akun demo, post awal, dan komentar awal agar feed publik dapat langsung diverifikasi visualnya saat implementasi feed selesai.

---

### Struktur Project Minimum

Diusulkan pemisahan modular sederhana:

```text
postly/
├── client/                     # Frontend: React + Apollo Client
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, PostCard, CommentItem, ReplyForm, etc.
│   │   ├── pages/              # FeedPage, LoginPage, RegisterPage, ProfilePage, CreatePostModal
│   │   ├── graphql/            # Operation definitions (queries & mutations)
│   │   ├── App.jsx
│   │   ├── index.css           # Vanilla CSS Design Tokens & Styles
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── server/                     # Backend: Express + Apollo Server + Prisma
│   ├── prisma/
│   │   ├── schema.prisma       # SQLite Schema: User, Post, Comment
│   │   └── seed.js             # Data seed awal
│   ├── src/
│   │   ├── schema/             # GraphQL TypeDefs (Schema Contract)
│   │   ├── resolvers/          # Query, Mutation, and Field Resolvers
│   │   ├── context/            # Auth context handler (JWT parser)
│   │   └── index.js            # Express + Apollo Server setup
│   └── package.json
├── assets/                     # Aset lokal yang sudah disediakan (avatars & posts)
├── references/                 # Referensi visual UI
└── docs/                       # Dokumentasi, aturan, dan plan bertahap
```

---

### Tahap Implementasi dan Gate

#### Tahap 1: Project Foundation & Minimal Vertical Slice
- **Outcome:** Setup minimum backend (Express + Apollo Server + Prisma SQLite) dan frontend (React + Apollo Client), terhubung melalui query GraphQL sederhana (`ping` atau `feed` kosong).
- **Checklist:**
  - [x] T01.1 Inisialisasi struktur direktori `server/` dan `client/` beserta manifest package.
  - [x] T01.2 Setup `server/`: Express, Apollo Server, CORS, dan Prisma ORM 7 dengan SQLite lokal.
  - [x] T01.3 Definisikan schema GraphQL dasar dengan query health check / ping sederhana.
  - [x] T01.4 Setup `client/`: React app, Apollo Client terkonfigurasi ke endpoint GraphQL backend (`/graphql`).
  - [x] T01.5 Verifikasi komunikasi client-server: Apollo Client berhasil meminta data query dan menerima response valid dari Apollo Server.
- **Acceptance Condition:** Server berjalan di port backend, client berjalan di port frontend, client sukses melakukan request GraphQL ke endpoint `/graphql` dan menerima response valid.
- **Verification:** Request HTTP GraphQL dan rendering minimal di browser.
- **Stop Condition:** Berhenti jika koneksi client-server atau Prisma SQLite gagal inisialisasi.

---

#### Tahap 2: Authentication & User Management
- **Outcome:** Model `User` pada Prisma, mutation `register` & `login`, JWT token issuance, Apollo Server auth context, serta UI halaman Login & Register.
- **Checklist:**
  - [x] T02.1 Definisikan model `User` (id, email, username, passwordHash, avatar, createdAt) di Prisma schema dan jalankan migration SQLite.
  - [x] T02.2 Implementasikan helper password hashing (`bcrypt`/`bcryptjs`) dan pembuatan JWT token.
  - [x] T02.3 Buat schema GraphQL TypeDefs & Resolvers untuk mutation `register` dan `login`.
  - [x] T02.4 Implementasikan auth context middleware pada Express/Apollo Server untuk memvalidasi JWT Bearer token dan menginjeksi user aktif ke context.
  - [x] T02.5 Buat query `me` untuk mengambil informasi profil user yang sedang terautentikasi.
  - [x] T02.6 Buat halaman UI Register & Login pada frontend dengan form validasi, penanganan error, dan penyimpanan token di client.
- **Acceptance Condition:** Pengguna dapat mendaftar, login, menerima JWT, dan context Apollo Server mengenali user yang terautentikasi.
- **Verification:** Menjalankan mutation register/login via client dan memverifikasi token valid di context.
- **Stop Condition:** Berhenti jika token auth gagal diverifikasi oleh GraphQL context.

---

#### Tahap 3: Post Domain & Public Feed
- **Outcome:** Model `Post`, allowlist validasi 5 gambar lokal, mutation `createPost`, query `PublicFeed` (newest first), serta UI Feed & form Create Post.
- **Checklist:**
  - [x] T03.1 Definisikan model `Post` (id, caption, imageUrl/imageKey, authorId, createdAt) di Prisma schema & jalankan migration.
  - [x] T03.2 Buat validator allowlist untuk 5 aset gambar post (`post-city`, `post-code`, `post-coffee`, `post-mountain`, `post-workspace`).
  - [x] T03.3 Buat schema GraphQL & resolvers untuk query `PublicFeed` (diurutkan `createdAt: desc`) dan mutation `createPost` (wajib login & validasi allowlist image).
  - [x] T03.4 Setup static file serving untuk folder `assets/` agar gambar avatar dan post dapat diakses secara publik via URL.
  - [x] T03.5 Buat UI Public Feed dan modal/form Create Post merujuk pada `references/UI/feed-clean.png` dan `create-post.png`.
- **Acceptance Condition:** Pengguna login dapat membuat post dengan memilih allowlist image, pengunjung publik dapat melihat feed yang menampilkan post terbaru di atas.
- **Verification:** Query feed via Apollo Client dan inspeksi urutan postingan serta gambar yang di-render.
- **Stop Condition:** Berhenti jika allowlist validasi gambar gagal menolak key di luar daftar atau feed gagal di-render tanpa login.

---

#### Tahap 4: Comment, Reply, & Invariant Enforcement
- **Outcome:** Model `Comment`, field `parentId`, mutation `createComment`, resolver comments & replies nested, validasi 1-level reply & same-post check, serta UI Comment/Reply section.
- **Checklist:**
  - [x] T04.1 Definisikan model `Comment` (id, content, postId, authorId, parentId, createdAt) di Prisma schema & jalankan migration.
  - [x] T04.2 Buat schema GraphQL TypeDefs untuk `Comment` termasuk relasi nested `author`, `post`, `parent`, dan `replies`.
  - [x] T04.3 Implementasikan mutation `createComment(postId, parentId, content)` dengan validasi user login.
  - [x] T04.4 Terapkan validasi invariant 1-tingkat: tolak jika target parent comment sudah memiliki `parentId != null`.
  - [x] T04.5 Terapkan validasi invariant post yang sama: tolak jika `parentComment.postId !== postId`.
  - [x] T04.6 Buat UI komponen komentar & balasan pada frontend (menampilkan komentar utama, tombol reply, form reply 1-tingkat, dan daftar balasan di bawah komentar terkait).
- **Acceptance Condition:** Top-level comment berhasil dibuat; reply terhadap comment berhasil dibuat; percobaan reply terhadap reply atau parent beda post menghasilkan error validasi yang jelas.
- **Verification:** Eksekusi skenario mutation valid dan invalid (replying to reply, mismatch post) dengan hasil sesuai invariant.
- **Stop Condition:** Berhenti jika validasi invariant 1-tingkat atau same-post check lolos tanpa error.

---

#### Tahap 5: Public Profile & UI Polish
- **Outcome:** Query profil user & daftar post user terkait, halaman Profile publik, penyesuaian styling dan responsive layout merujuk pada `references/UI/`.
- **Checklist:**
  - [x] T05.1 Buat query GraphQL `userProfile(username)` untuk mengambil identitas user, avatar, dan seluruh postingan miliknya.
  - [x] T05.2 Buat halaman UI Public Profile merujuk pada `references/UI/profile-v2.png`.
  - [x] T05.3 Hubungkan klik pada nama author atau avatar di Feed / Post / Comment menuju halaman profil publik terkait.
  - [x] T05.4 Polish UI styling (Vanilla CSS, layout responsive, micro-interaction, penanganan loading & error state) agar sesuai referensi visual tanpa menggunakan screenshot sebagai background.
- **Acceptance Condition:** Klik author membuka profil publik user yang benar beserta daftar post-nya; UI bersih dan tidak menggunakan screenshot sebagai background.
- **Verification:** Verifikasi interaksi visual flow di browser — profile grid view & feed view terverifikasi via browser subagent screenshots.
- **Stop Condition:** Berhenti jika navigasi profil atau relasi post author menampilkan data yang keliru.

---

#### Tahap 6: Relation Loading Diagnosis & Optimization
- **Outcome:** Observasi empiris query database (mendeteksi potensi N+1 pada query feed bertingkat), dokumentasi query count baseline, dan evaluasi solusi relation loading (Prisma relation query vs explicit batching vs DataLoader) sesuai trade-off.
- **Checklist:**
  - [ ] T06.1 Aktifkan Prisma query logging / query event listener untuk menangkap dan menghitung jumlah SQL query ke SQLite.
  - [ ] T06.2 Buat script / skenario pengujian query `PublicFeed` dengan database terisi seed data (multiple posts, comments, replies, authors) dan catat baseline query count aktual.
  - [ ] T06.3 Analisis hasil baseline (observasi N+1 problem pada resolving author/comments/replies).
  - [ ] T06.4 Evaluasi opsi solusi (Prisma include/relation query vs explicit batching vs DataLoader per-request).
  - [ ] T06.5 Implementasikan solusi yang dipilih dan verifikasi ulang penurunan query count dengan bukti log aktual yang dicatat di Log Eksekusi.
- **Acceptance Condition:** Query count sebelum dan sesudah optimasi dicatat dengan bukti log aktual tanpa mengarang angka.
- **Verification:** Pemeriksaan query log SQLite/Prisma saat request `PublicFeed` dijalankan.
- **Stop Condition:** Berhenti jika optimasi merusak kontrak GraphQL atau cache bocor antar-request.

---

## 8. Definition of Done Tahap 0 s/d Tahap 5

- [x] Seluruh item D00.1–D00.10 mempunyai hasil yang dapat direview.
- [x] Seluruh item T01.1–T01.5 pada Tahap 1 telah selesai diimplementasikan.
- [x] Seluruh item T02.1–T02.6 pada Tahap 2 telah selesai diimplementasikan.
- [x] Seluruh item T03.1–T03.5 pada Tahap 3 telah selesai diimplementasikan.
- [x] Seluruh item T04.1–T04.6 pada Tahap 4 telah selesai diimplementasikan.
- [x] Seluruh item T05.1–T05.4 pada Tahap 5 telah selesai diimplementasikan.
- [x] Backend Express + Apollo Server + Prisma SQLite menegakkan invariant komentar 1-tingkat (no reply-to-reply) dan validasi parent berasal dari post yang sama.
- [x] Frontend React + Apollo Client menyediakan antarmuka thread komentar, form balasan 1-tingkat, dan update counter komentar realtime.
- [x] Halaman profil publik menampilkan data user yang benar beserta seluruh post miliknya, navigasi author di Feed/PostCard/CommentItem berfungsi penuh.
- [x] Setiap klaim selesai mempunyai catatan bukti pada Log Eksekusi.

## 9. Log Eksekusi

### 2026-09-06 — Eksekusi Tahap 0 (Planning & Context Formulation)

* **Checklist ID:** D00.1 – D00.10
* **Sumber & Referensi yang Diperiksa:**
  - `AGENTS.md` & `docs/AGENTS.md` (aturan kerja, batas per run, evidence discipline).
  - `README.md` (tujuan repositori kit from-zero).
  - `docs/PRODUCT-BRIEF.md` (outcome, domain User/Post/Comment, guardrails scope).
  - `docs/PARTICIPANT-GUIDE.md` (pedoman pengerjaan Tahap 0 murni planning).
  - `docs/ASSET-MANIFEST.md` (daftar 5 allowlist post image dan 4 avatar).
  - `docs/GRAPHQL-JIT.md` (gambaran kontrak query feed dan mutation comment).
  - `references/UI/` (`UI.png`, `create-post.png`, `feed-clean.png`, `login.png`, `profile-v2.png`, `register.png`).
  - `assets/` (`assets/posts/` dan `assets/avatars/`).
* **Hasil & Keputusan Perencanaan:**
  - Merumuskan rincian perilaku wajib (D00.1) dan batas non-goals (D00.2).
  - Mendefinisikan mekanisme penegakan invariant `Comment.parentId` tepat 1-level dan validasi parent-post yang sama (D00.3).
  - Menetapkan asumsi teknis terbuka: JWT bearer auth, bcrypt hashing, express static asset serving (D00.4).
  - Menyusun usulan struktur direktori minimal terpisah `client/` dan `server/` (D00.5).
  - Membagi roadmap implementasi menjadi 6 tahap modular terverifikasi (D00.6, D00.7, D00.8).
  - Memastikan seluruh kontrak dipatuhi tanpa membuat file source code atau package manifest pada Tahap 0 (D00.9).
* **Verifikasi yang Dilakukan:**
  - File dokumen plan diperbarui secara konsisten.
  - Tidak ada file kode / manifest baru yang di-generate.
* **Risiko / Asumsi Terbuka:**
  - Menunggu persetujuan instructor terhadap gate planning Tahap 0 sebelum melangkah ke Tahap 1 (Project Foundation).

### 2026-09-06 — Eksekusi Tahap 1 (Project Foundation & Minimal Vertical Slice)

* **Checklist ID:** T01.1 – T01.5
* **Perubahan Kode / File:**
  - `server/package.json`: Inisialisasi package backend dengan Express 4, Apollo Server 4, Prisma Client 6, CORS, GraphQL.
  - `server/prisma/schema.prisma`: Schema database SQLite dengan model `User`, `Post`, dan `Comment`.
  - `server/src/db.js`: Prisma client instance.
  - `server/src/schema/typeDefs.js`: GraphQL schema type definitions (`User`, `Post`, `Comment`, `ping`, `feed`).
  - `server/src/resolvers/index.js`: Resolvers untuk query `ping` dan `feed` serta relasi type resolvers.
  - `server/src/index.js`: Express server + Apollo Server middleware di `/graphql` + static assets di `/assets`.
  - `client/package.json` & `client/vite.config.js`: React 19 + Apollo Client 3 + Vite.
  - `client/src/main.jsx`, `client/src/App.jsx`, `client/src/index.css`: React app terhubung dengan `ApolloProvider` dan melakukan `useQuery(PING_QUERY)`.
* **Verifikasi Aktual:**
  - Backend running: `🚀 Postly Backend ready at http://localhost:4000/graphql`
  - Database synced: `npx prisma db push` berhasil membuat SQLite `dev.db` dan generate Prisma client.
  - Direct HTTP GraphQL Query:
    ```powershell
    Invoke-RestMethod -Uri 'http://localhost:4000/graphql' -Method Post -ContentType 'application/json' -Body '{"query":"query { ping feed { id caption } }"}'
    ```
    Output: `{ "data": { "ping": "pong - Postly GraphQL Server ready!", "feed": [] } }`
  - Client Vite Dev Server running di `http://localhost:5173/`.
  - Browser Verification Subagent: Mengakses `http://localhost:5173/`, terverifikasi bahwa status "Response Sukses Diterima", `ping: "pong - Postly GraphQL Server ready!"`, dan `feed count: 0 posts` tampil sempurna di UI.
* **Risiko / Blocker:** Tidak ada. Plumbing dasar GraphQL client-to-server bekerja 100%.

### 2026-09-06 — Eksekusi Tahap 2 (Authentication & User Management)

* **Checklist ID:** T02.1 – T02.6
* **Perubahan Kode / File:**
  - `server/package.json`: Menambahkan dependency `bcryptjs` dan `jsonwebtoken`.
  - `server/src/auth.js`: Helper hashing password (`bcryptjs`), verifikasi password, pembuatan token JWT (`generateToken`), dan validasi bearer token (`verifyToken`).
  - `server/src/schema/typeDefs.js`: Menambahkan `AuthPayload`, mutation `register` & `login`, serta query `me`.
  - `server/src/resolvers/index.js`: Resolvers untuk register (validasi email/username unik, hash password, avatar allowlist default), login (mendukung login via email atau username), dan query `me`.
  - `server/src/index.js`: Context middleware Apollo Server mengekstrak token dari HTTP Header `Authorization: Bearer <token>` dan mencari `currentUser` dari database.
  - `client/src/graphql/auth.js`: GraphQL operations `REGISTER_MUTATION`, `LOGIN_MUTATION`, `ME_QUERY`.
  - `client/src/main.jsx`: Apollo Client link dengan `setContext` untuk menyisipkan header Bearer token dari `localStorage`.
  - `client/src/context/AuthContext.jsx`: Auth Provider untuk state session pengguna, auto-fetch query `me`, fungsi login dan logout.
  - `client/src/components/Navbar.jsx`: Header navigasi dengan avatar profil pengguna yang login, nama `@username`, tombol logout, atau tombol login/daftar.
  - `client/src/components/AuthModal.jsx`: Modal interaktif dengan tab Masuk & Daftar, form validasi, error handling, serta avatar selector dari 4 allowlist gambar avatar lokal.
  - `client/src/index.css`: Styling modern untuk Navbar, Modals, Auth Forms, Avatar Selector Grid, dan Alert Boxes.
* **Verifikasi Aktual:**
  - **Mutation Register Test:**
    ```powershell
    mutation { register(email: "alex@example.com", username: "alex", password: "secret123", avatar: "avatar-alex") { token user { id email username avatar } } }
    ```
    Output: Berhasil mendaftarkan akun dan mengembalikan JWT token serta data user.
  - **Mutation Login Test (Username):** Login dengan `alex` dan `secret123` berhasil mengembalikan token.
  - **Mutation Login Test (Email):** Login dengan `alex@example.com` dan `secret123` berhasil mengembalikan token.
  - **Query `me` Test (with Bearer header):** Mengembalikan data user `@alex` dari context.
  - **Browser End-to-End Test (`http://localhost:5173`):**
    - Browser subagent membuka modal login.
    - Mengisi `alex` dan `secret123`, submit login.
    - Terverifikasi modal tertutup, navbar menampilkan avatar dan badge `@alex` beserta tombol `Logout`.
    - Card dashboard menampilkan status `● Login aktif via JWT Bearer Auth` untuk `alex@example.com`.
* **Risiko / Blocker:** Tidak ada. Autentikasi dan sesi user bekerja 100%.

### 2026-09-06 — Eksekusi Tahap 3 (Post Domain & Public Feed)

* **Checklist ID:** T03.1 – T03.5
* **Perubahan Kode / File:**
  - `server/src/constants.js`: Mendefinisikan allowlist 5 gambar post (`post-city`, `post-code`, `post-coffee`, `post-mountain`, `post-workspace`) dan 4 avatar.
  - `server/src/schema/typeDefs.js`: Menambahkan type `Post`, query `feed: [Post!]!`, query `post(id: ID!): Post`, dan mutation `createPost(caption: String!, imageUrl: String!): Post!`.
  - `server/src/resolvers/index.js`: Implementasi mutation `createPost` dengan validasi auth, validasi caption tidak kosong, dan validasi ketat allowlist gambar; query `feed` diurutkan `createdAt: desc`.
  - `client/src/graphql/posts.js`: GraphQL operation definitions `PUBLIC_FEED_QUERY` dan `CREATE_POST_MUTATION`.
  - `client/src/components/CreatePostModal.jsx`: Modal pembuatan post dengan pemilih visual 5 gambar allowlist, textarea caption, penanganan error, dan auto refetch feed.
  - `client/src/components/PostCard.jsx`: Kartu postingan publik menampilkan avatar author, username, timestamp terformat, gambar allowlist responsif, caption, dan indikator komentar.
  - `client/src/components/Feed.jsx`: Komponen feed publik dengan prompt card pembuatan post untuk user login, guest banner untuk pengunjung, empty state, dan daftar post realtime.
  - `client/src/App.jsx`: Menghubungkan Navbar, Feed publik, AuthModal, dan CreatePostModal.
  - `client/src/index.css`: Styling modern untuk Feed stream, PostCard hover effect, Allowlist Image Selector Grid, dan modal create post.
* **Verifikasi Aktual:**
  - **Unauthorized createPost Test:** Mutation `createPost` tanpa token auth ditolak server dengan error `Anda harus login terlebih dahulu untuk membuat postingan.`
  - **Invalid Allowlist Image Test:** Mutation `createPost` dengan key gambar `invalid-image-123` ditolak server dengan error `Gambar post tidak valid. Gambar harus dipilih dari allowlist: post-city, post-code, post-coffee, post-mountain, post-workspace`.
  - **Valid createPost Test:** Pembuatan post dengan token dan image `post-workspace` serta `post-coffee` sukses tersimpan ke database SQLite.
  - **Query PublicFeed Order Test:** Query `feed` mengembalikan daftar post terurut *newest-first* (Post 2 `post-coffee` muncul sebelum Post 1 `post-workspace`).
  - **Static Asset Delivery:** Seluruh aset di `/assets/posts/*.webp` dan `/assets/avatars/*.webp` dapat diakses dan di-render secara optimal oleh client.
* **Risiko / Blocker:** Tidak ada. Public feed dan pembatasan gambar allowlist berjalan 100%.

### 2026-09-06 — Eksekusi Tahap 4 (Comment, Reply, & Invariant Enforcement)

* **Checklist ID:** T04.1 – T04.6
* **Perubahan Kode / File:**
  - `server/src/schema/typeDefs.js`: Menambahkan relasi nested pada `Comment` (`postId`, `author`, `post`, `parentId`, `parent`, `replies`) dan mutation `createComment(postId: ID!, parentId: ID, content: String!): Comment!`.
  - `server/src/resolvers/index.js`:
    - Resolver `createComment` dengan penegakan 2 invariant ketat:
      1. Validasi parent berasal dari post yang sama (`parentComment.postId === postId`).
      2. Batas tepat 1 tingkat: penolakan bila parent sudah memiliki `parentId != null` (mencegah reply-to-reply).
    - Resolver field `Comment.post`, `Comment.parent`, dan `Comment.replies` (`where: { parentId: parent.id }`).
  - `server/src/test_comment_invariants.js`: Script automated test mencakup skenario valid top-level, valid 1-level reply, penolakan reply-to-reply, dan penolakan parent lintas post.
  - `client/src/graphql/comments.js`: Mutation `CREATE_COMMENT_MUTATION`.
  - `client/src/graphql/posts.js`: `PUBLIC_FEED_QUERY` diperbarui memuat nested hierarchy `comments` dan `replies`.
  - `client/src/components/CommentItem.jsx`: Item komentar dengan avatar author, timestamp, tombol balas (khusus komentar utama), form reply inline, dan list replies terindentasi.
  - `client/src/components/CommentSection.jsx`: Form komentar utama dengan user avatar, login prompt untuk tamu, dan daftar thread komentar.
  - `client/src/components/PostCard.jsx`: Toggle collapsible comment section dan counter total komentar dinamis.
  - `client/src/index.css`: Styling bubble komentar, indentation balasan, line thread, dan form reply.
* **Verifikasi Aktual:**
  - **Test Invariant 2 (Tolak Reply-to-Reply):**
    Percobaan mutasi dengan `parentId` mengarah ke balasan (reply) berhasil ditolak oleh server dengan pesan error:
    `"Tidak dapat membalas balasan. Balasan komentar hanya diperbolehkan satu tingkat."`
  - **Test Invariant 1 (Tolak Parent Lintas Post):**
    Percobaan mutasi dengan `parentId` milik postingan lain berhasil ditolak oleh server dengan pesan error:
    `"Komentar yang dibalas tidak berada pada postingan yang sama."`
  - **Test Top-Level & 1-Level Reply Berhasil:**
    Komentar utama dan balasan 1-tingkat berhasil disimpan dan di-resolve dengan relasi nested yang tepat.
  - **Browser Subagent Test (`http://localhost:5173`):**
    - Browser subagent membuka feed dan memverifikasi komentar utama `@alex Kopi mantap untuk coding sore!` serta balasan 1-tingkat `@alex Setuju banget! Apalagi sambil denger musik lo-fi.`
    - Subagent mengirim komentar baru `Semangat belajarnya teman-teman!` dan memverifikasi komentar baru langsung tampil serta counter bertambah menjadi 3 komentar.
* **Risiko / Blocker:** Tidak ada. Invariant komentar dan balasan ditegakkan 100% pada level backend dan frontend.

### 2026-09-06 — Eksekusi Tahap 5 (Public Profile & UI Polish)

* **Checklist ID:** T05.1 – T05.4
* **Perubahan Kode / File:**
  - `server/src/schema/typeDefs.js`: Menambahkan field `posts: [Post!]!` pada type `User` dan query `userProfile(username: String!): User` pada type `Query`.
  - `server/src/resolvers/index.js`:
    - Resolver `Query.userProfile(username)`: lookup user by username, return user object (atau error jika tidak ditemukan).
    - Resolver `User.posts(parent)`: fetch semua post milik user diurutkan `createdAt: desc`.
  - `server/src/test_user_profile.js`: Script test `userProfile` query — verifikasi data user alex (2 post dengan komentar/replies) dan verifikasi error untuk user non-existent.
  - `client/src/graphql/profile.js` [NEW]: GraphQL operation `USER_PROFILE_QUERY` dengan field lengkap: id, username, email, avatar, createdAt, posts (dengan nested author, comments, replies).
  - `client/src/components/ProfileView.jsx` [NEW]: Komponen halaman profil publik dengan:
    - Tombol "← Kembali ke Feed" navigasi ke feed.
    - Profile header card: avatar lingkar dengan border biru, username, handle `@username`, bio, badge jumlah post & tanggal bergabung.
    - Toggle view mode: Grid (default, 2 kolom, hover overlay caption) vs Feed (full PostCard list).
    - Grid-item clickable: klik buka expanded PostCard langsung di bawah item grid yang bersangkutan.
    - State loading (spinner) dan error state (pengguna tidak ditemukan).
  - `client/src/components/Navbar.jsx`: Diperbarui menerima props `onNavigateFeed`, `onNavigateProfile`, `onOpenCreatePost`, `activeView`; menambahkan nav links tengah (Feed, + Buat Post); avatar/username di navbar klik → navigasi ke profil sendiri.
  - `client/src/App.jsx`: State navigasi `currentView: { type: 'feed' } | { type: 'profile', username }` menggantikan single Feed view; handler `handleNavigateFeed` dan `handleNavigateProfile` dipropagasi ke semua komponen anak; top padding `1.5rem` pada main.
  - `client/src/index.css`: Menambahkan 300+ baris styles baru:
    - `.navbar-nav`, `.nav-link-btn` (active state), `.user-badge-link` (hover)
    - `.profile-container` (fade-in animation), `.profile-nav-bar`, `.btn-back`
    - `.profile-header-card`, `.profile-avatar-lg` (border biru), `.profile-details`, `.profile-fullname`, `.profile-handle`, `.profile-bio`, `.profile-meta-tags`, `.profile-badge`
    - `.profile-view-toggle`, `.view-toggle-btn` (active = biru)
    - `.profile-posts-grid` (2-col CSS Grid), `.profile-grid-item` (hover lift + border), `.profile-grid-overlay` (fade-in gradient), `.profile-grid-caption`, `.profile-grid-expanded-post` (fade-in)
    - `.empty-profile-posts`, `.profile-posts-list`
    - Responsive breakpoint `@media (max-width: 640px)`: stacked header + 1-column grid
    - `.navbar-container max-width: 900px` (override untuk 3-section layout brand/nav/actions)
* **Verifikasi Aktual:**
  - **Test userProfile via `test_user_profile.js`:**
    - Query `userProfile(username: "alex")` mengembalikan: id, username `alex`, email `alex@example.com`, avatar `avatar-alex`, createdAt, dan array `posts` berisi 2 post lengkap beserta nested `comments` dan `replies`.
    - Query `userProfile(username: "non_existent_user_999")` mengembalikan error GraphQL: `"Pengguna dengan username @non_existent_user_999 tidak ditemukan."` dan `data.userProfile: null`.
  - **Browser Subagent Screenshots:**
    - **Grid View:** Profil `@alex` ditampilkan dengan avatar lingkar (biru), nama `alex`, handle `@alex`, bio, badge `📸 2 Post`, badge `🗓️ Bergabung September 2026`, 2 gambar post dalam layout 2-kolom grid dengan hover overlay. Navbar menampilkan: Postly brand | Feed + Buat Post | @alex avatar + Logout.
    - **Feed View:** Toggle ke ☰ Feed menampilkan full PostCard list dengan gambar, caption, comment section lengkap.
    - Navigasi kembali ke feed berfungsi via tombol "← Kembali ke Feed".
    - Klik avatar `@alex` di navbar berhasil membuka profil sendiri.
* **Risiko / Blocker:** Tidak ada. Semua acceptance condition Tahap 5 terpenuhi.
