# Rangkuman Aturan Main dan Analisis Awal Proyek Postly

Dokumen ini memuat rangkuman lengkap aturan main, batasan kontrak, analisis kesenjangan/asumsi awal, serta panduan langkah kerja untuk proyek **Postly**.

---

## 1. Kontrak Produk & Batasan Ruang Lingkup (Scope Guardrails)

Berdasarkan [`docs/PRODUCT-BRIEF.md`](file:///d:/Workspaces/IDNRemote/kelas-ai-native-engineer/postly-participant-kit-from-zero/docs/PRODUCT-BRIEF.md) dan [`docs/AGENTS.md`](file:///d:/Workspaces/IDNRemote/kelas-ai-native-engineer/postly-participant-kit-from-zero/docs/AGENTS.md):

### Stack Wajib
* **Frontend:** React + Apollo Client
* **Backend:** Express + Apollo Server
* **Data Access:** Prisma ORM 7 + SQLite lokal
* **API Contract:** GraphQL (kendaraan demonstrasi query contract & relation loading)
* **Assets:** Aset lokal dari folder [`assets/`](file:///d:/Workspaces/IDNRemote/kelas-ai-native-engineer/postly-participant-kit-from-zero/assets)

### Domain Model (Hanya 3 Model)
1. **`User`**: Data pengguna (register, login, author dari post & comment).
2. **`Post`**: Postingan publik dengan gambar dari allowlist lokal dan caption.
3. **`Comment`**: Komentar pada post.

### Invariant Reply & Komentar
* **Tidak ada tabel `Reply` terpisah.** Reply disimpan pada tabel `Comment` menggunakan field `parentId` (nullable).
* **Batas 1 Tingkat:** Komentar hanya boleh dibalas tepat 1 tingkat (tidak ada reply terhadap reply).
* **Validasi Parent:** `parentId` harus valid dan berasal dari `Post` yang sama dengan komentar balasan tersebut.

### Fitur yang Dilarang (Strict Non-Goals)
Dilarang keras menambahkan fitur-fitur berikut:
* ❌ Like / Reaction
* ❌ Follow / Follower count
* ❌ Story / Status sementara
* ❌ Chat / Direct message
* ❌ Notification
* ❌ Share / Bookmark
* ❌ Realtime Subscription / WebSocket
* ❌ File Upload Pipeline (gambar hanya dipilih dari 5 allowlist lokal)

---

## 2. Disiplin Kerja & Aturan Agent

1. **Bertahap (Step-by-Step):** Kerjakan satu tahap per iterasi/run sesuai plan aktif. Jangan melompat ke tahap berikutnya sebelum tahap saat ini selesai dan direview.
2. **Evidence-Based:** Klaim `done` dari AI bukan bukti valid. Setiap checklist yang diselesaikan harus mencantumkan bukti nyata (log eksekusi, perintah verifikasi, output aktual) pada bagian `Log Eksekusi` di file plan aktif.
3. **Diagnosis Sebelum Optimasi:** Jangan langsung memasang DataLoader atau batching sebelum masalah performa (*N+1 relation loading*) diobservasi dan diukur secara nyata.
4. **Tahap 0 (Murni Perencanaan):** Tidak boleh membuat `package.json`, install dependency, atau menulis kode aplikasi sebelum perencanaan Tahap 0 disetujui.

---

## 3. Analisis Kebutuhan & Asumsi Awal (Desain Teknis)

Beberapa hal teknis yang perlu disepakati saat implementasi dimulai:

| Aspek | Rekomendasi Desain | Catatan |
|---|---|---|
| **Struktur Proyek** | Modular (`client/` dan `server/`) | Memisahkan dependency React dan Express secara rapi. |
| **Autentikasi** | JWT via HTTP Header `Authorization: Bearer <token>` | Token diverifikasi pada context Apollo Server. |
| **Password Security** | Hashing menggunakan `bcrypt` / `bcryptjs` | Disimpan pada field password hash di SQLite. |
| **Static Asset Serving** | Express static middleware atau Vite static public | Menyajikan gambar allowlist dari [`assets/`](file:///d:/Workspaces/IDNRemote/kelas-ai-native-engineer/postly-participant-kit-from-zero/assets). |
| **Allowlist Gambar Post** | `post-city`, `post-code`, `post-coffee`, `post-mountain`, `post-workspace` | Sesuai [`docs/ASSET-MANIFEST.md`](file:///d:/Workspaces/IDNRemote/kelas-ai-native-engineer/postly-participant-kit-from-zero/docs/ASSET-MANIFEST.md). |
| **Avatar Pengguna** | `avatar-alex`, `avatar-emily`, `avatar-james`, `avatar-sarah` | Sesuai [`docs/ASSET-MANIFEST.md`](file:///d:/Workspaces/IDNRemote/kelas-ai-native-engineer/postly-participant-kit-from-zero/docs/ASSET-MANIFEST.md). |

---

## 4. Titik Awal Pengerjaan (Active Plan)

Plan aktif utama yang menjadi panduan pekerjaan:
* 📄 [`docs/plans/2026-09-05/01-perencanaan-awal-postly.md`](file:///d:/Workspaces/IDNRemote/kelas-ai-native-engineer/postly-participant-kit-from-zero/docs/plans/2026-09-05/01-perencanaan-awal-postly.md)

### Checklist Tahap 0 yang Harus Dipenuhi:
- [ ] **D00.1** Catat seluruh behavior yang wajib terlihat oleh pengguna.
- [ ] **D00.2** Catat seluruh fitur dan keputusan yang berada di luar scope.
- [ ] **D00.3** Jelaskan invariant `Comment.parentId`, batas satu tingkat, dan validasi parent terhadap post.
- [ ] **D00.4** Catat asumsi yang belum dijawab repository.
- [ ] **D00.5** Usulkan struktur project minimum (frontend, backend, Prisma, static assets).
- [ ] **D00.6** Pecah implementasi menjadi tahap kecil beserta acceptance criteria dan gate verifikasi.
- [ ] **D00.7** Pastikan project foundation menjadi vertical slice terkecil.
- [ ] **D00.8** Pastikan diagnosis relation loading dilakukan sebelum pemilihan solusi.
- [ ] **D00.9** Periksa rencana terhadap kontrak dan non-goal.
- [ ] **D00.10** Catat hasil planning dan evidence pembacaan pada Log Eksekusi.
