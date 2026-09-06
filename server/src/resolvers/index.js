import prisma from '../db.js';
import { hashPassword, comparePassword, generateToken } from '../auth.js';
import { ALLOWED_POST_IMAGES } from '../constants.js';

// ─── Helper: Prisma include shape reused across feed & profile ────────────────
const POST_INCLUDE_WITH_RELATIONS = {
  author: true,
  comments: {
    where: { parentId: null },
    orderBy: { createdAt: 'asc' },
    include: {
      author: true,
      replies: {
        orderBy: { createdAt: 'asc' },
        include: { author: true },
      },
    },
  },
};

export const resolvers = {
  Query: {
    ping: () => 'pong - Postly GraphQL Server ready!',
    me: async (_, __, context) => {
      if (!context.currentUser) return null;
      return prisma.user.findUnique({
        where: { id: context.currentUser.id },
      });
    },

    /**
     * T06.5 OPTIMIZED: Menggunakan Prisma `include` untuk eager loading semua relasi
     * dalam satu batch query. Mengeliminasi N+1 problem.
     * SEBELUM: 1 + P + P + C + C + R queries (N+1)
     * SESUDAH:  6 queries tetap (1 posts + 1 authors + 1 top-comments + 1 comment-authors
     *           + 1 replies + 1 reply-authors), tidak bergantung pada jumlah data.
     */
    feed: async () => {
      return prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: POST_INCLUDE_WITH_RELATIONS,
      });
    },

    post: async (_, { id }) => {
      return prisma.post.findUnique({
        where: { id },
        include: POST_INCLUDE_WITH_RELATIONS,
      });
    },

    userProfile: async (_, { username }) => {
      if (!username) {
        throw new Error('Username wajib diisi.');
      }
      const user = await prisma.user.findFirst({
        where: { username },
      });
      if (!user) {
        throw new Error(`Pengguna dengan username @${username} tidak ditemukan.`);
      }
      return user;
    },
  },
  Mutation: {
    register: async (_, { email, username, password, avatar }) => {
      if (!email || !username || !password) {
        throw new Error('Email, username, dan password wajib diisi.');
      }
      if (password.length < 4) {
        throw new Error('Password minimal 4 karakter.');
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new Error('Email sudah terdaftar.');
        }
        throw new Error('Username sudah digunakan.');
      }

      const passwordHash = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          username,
          passwordHash,
          avatar: avatar || 'avatar-alex',
        },
      });

      const token = generateToken(user);
      return { token, user };
    },
    login: async (_, { identifier, password }) => {
      if (!identifier || !password) {
        throw new Error('Email/username dan password wajib diisi.');
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: identifier }, { username: identifier }],
        },
      });

      if (!user) {
        throw new Error('Email/username tidak ditemukan.');
      }

      const isValid = await comparePassword(password, user.passwordHash);
      if (!isValid) {
        throw new Error('Password salah.');
      }

      const token = generateToken(user);
      return { token, user };
    },
    createPost: async (_, { caption, imageUrl }, context) => {
      if (!context.currentUser) {
        throw new Error('Anda harus login terlebih dahulu untuk membuat postingan.');
      }

      if (!caption || !caption.trim()) {
        throw new Error('Caption postingan tidak boleh kosong.');
      }

      if (!imageUrl || !ALLOWED_POST_IMAGES.includes(imageUrl.trim())) {
        throw new Error(
          `Gambar post tidak valid. Gambar harus dipilih dari allowlist: ${ALLOWED_POST_IMAGES.join(', ')}`
        );
      }

      const post = await prisma.post.create({
        data: {
          caption: caption.trim(),
          imageUrl: imageUrl.trim(),
          authorId: context.currentUser.id,
        },
        include: POST_INCLUDE_WITH_RELATIONS,
      });

      return post;
    },
    createComment: async (_, { postId, parentId, content }, context) => {
      if (!context.currentUser) {
        throw new Error('Anda harus login terlebih dahulu untuk menambahkan komentar.');
      }

      if (!content || !content.trim()) {
        throw new Error('Konten komentar tidak boleh kosong.');
      }

      // Verifikasi bahwa post tujuan ada
      const targetPost = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!targetPost) {
        throw new Error('Postingan yang dikomentari tidak ditemukan.');
      }

      // Jika ini adalah balasan (reply), tegakkan 2 invariant wajib
      if (parentId) {
        const parentComment = await prisma.comment.findUnique({
          where: { id: parentId },
        });

        if (!parentComment) {
          throw new Error('Komentar yang ingin dibalas tidak ditemukan.');
        }

        // Invariant 1: Parent comment harus berasal dari post yang sama
        if (parentComment.postId !== postId) {
          throw new Error(
            'Komentar yang dibalas tidak berada pada postingan yang sama.'
          );
        }

        // Invariant 2: Batas tepat 1 tingkat (tidak boleh membalas sebuah balasan)
        if (parentComment.parentId !== null) {
          throw new Error(
            'Tidak dapat membalas balasan. Balasan komentar hanya diperbolehkan satu tingkat.'
          );
        }
      }

      const comment = await prisma.comment.create({
        data: {
          postId,
          authorId: context.currentUser.id,
          parentId: parentId || null,
          content: content.trim(),
        },
        include: {
          author: true,
          replies: {
            include: { author: true },
          },
        },
      });

      return comment;
    },
  },
  /**
   * Field resolvers di bawah ini tetap dipertahankan sebagai fallback.
   * Ketika `feed` resolver sudah menyertakan data via `include`, Apollo Server
   * akan menggunakan data yang sudah ada di `parent` object dan TIDAK memanggil
   * field resolver ini. Field resolver hanya terpanggil jika field tsb belum ada
   * di parent object (e.g., saat resolver lain mengembalikan partial object).
   */
  Post: {
    author: async (parent) => {
      if (parent.author) return parent.author; // sudah di-eager-load
      return prisma.user.findUnique({ where: { id: parent.authorId } });
    },
    comments: async (parent) => {
      if (parent.comments) return parent.comments; // sudah di-eager-load
      return prisma.comment.findMany({
        where: { postId: parent.id, parentId: null },
        orderBy: { createdAt: 'asc' },
      });
    },
  },
  Comment: {
    author: async (parent) => {
      if (parent.author) return parent.author; // sudah di-eager-load
      return prisma.user.findUnique({ where: { id: parent.authorId } });
    },
    post: async (parent) => {
      return prisma.post.findUnique({ where: { id: parent.postId } });
    },
    parent: async (parent) => {
      if (!parent.parentId) return null;
      return prisma.comment.findUnique({ where: { id: parent.parentId } });
    },
    replies: async (parent) => {
      if (parent.replies) return parent.replies; // sudah di-eager-load
      return prisma.comment.findMany({
        where: { parentId: parent.id },
        orderBy: { createdAt: 'asc' },
      });
    },
  },
  User: {
    /**
     * T06.5 OPTIMIZED: user.posts juga menggunakan include untuk eager loading
     * relasi komentar ketika profile view membutuhkan nested data.
     */
    posts: async (parent) => {
      return prisma.post.findMany({
        where: { authorId: parent.id },
        orderBy: { createdAt: 'desc' },
        include: POST_INCLUDE_WITH_RELATIONS,
      });
    },
  },
};

