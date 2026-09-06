/**
 * Tahap 6 — N+1 Diagnosis & Optimization Baseline Script
 *
 * Script ini:
 * 1. Menambahkan seed data (jika belum ada): 2 user tambahan, 4 post, komentar & replies
 * 2. Mengaktifkan Prisma query counter
 * 3. Mengirim GraphQL request PublicFeed dan menghitung total SQL queries yang terpicu
 * 4. Mencetak laporan baseline query count beserta analisis N+1
 *
 * Jalankan dengan: node src/diagnosis_n1_baseline.js
 */

import { PrismaClient } from '@prisma/client';

// ─── Query counter setup ──────────────────────────────────────────────────────
let queryCount = 0;
const queryLog = [];

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }],
});

prisma.$on('query', (e) => {
  queryCount++;
  queryLog.push({ query: e.query.slice(0, 120), duration: e.duration });
});

// ─── Seed helper ──────────────────────────────────────────────────────────────
async function ensureSeedData() {
  const userCount = await prisma.user.count();
  if (userCount >= 3) {
    console.log(`[SEED] Database sudah memiliki ${userCount} user — skip seeding.`);
    return;
  }

  console.log('[SEED] Memulai seeding data...');

  const bcryptjs = await import('bcryptjs');
  const hash = await bcryptjs.default.hash('password123', 10);

  // Seed 2 user tambahan (alex biasanya sudah ada)
  const sarah = await prisma.user.upsert({
    where: { username: 'sarah' },
    update: {},
    create: {
      email: 'sarah@example.com',
      username: 'sarah',
      passwordHash: hash,
      avatar: 'avatar-sarah',
    },
  });

  const james = await prisma.user.upsert({
    where: { username: 'james' },
    update: {},
    create: {
      email: 'james@example.com',
      username: 'james',
      passwordHash: hash,
      avatar: 'avatar-james',
    },
  });

  const emily = await prisma.user.upsert({
    where: { username: 'emily' },
    update: {},
    create: {
      email: 'emily@example.com',
      username: 'emily',
      passwordHash: hash,
      avatar: 'avatar-emily',
    },
  });

  // Seed 3 post tambahan dari berbagai author
  const p1 = await prisma.post.create({
    data: { caption: 'Pagi di pegunungan yang sejuk!', imageUrl: 'post-mountain', authorId: sarah.id },
  });
  const p2 = await prisma.post.create({
    data: { caption: 'Kota di malam hari selalu memukau.', imageUrl: 'post-city', authorId: james.id },
  });
  const p3 = await prisma.post.create({
    data: { caption: 'Deep work session hari ini.', imageUrl: 'post-code', authorId: emily.id },
  });

  // Seed komentar dan replies pada setiap post
  for (const post of [p1, p2, p3]) {
    const c1 = await prisma.comment.create({
      data: { postId: post.id, authorId: sarah.id, content: 'Bagus banget!', parentId: null },
    });
    const c2 = await prisma.comment.create({
      data: { postId: post.id, authorId: james.id, content: 'Keren!', parentId: null },
    });
    // 1-level replies
    await prisma.comment.create({
      data: { postId: post.id, authorId: emily.id, content: 'Setuju!', parentId: c1.id },
    });
    await prisma.comment.create({
      data: { postId: post.id, authorId: sarah.id, content: 'Ikut merasakan vibes-nya!', parentId: c2.id },
    });
  }

  console.log('[SEED] Seeding selesai: 3 user, 3 post, 12 komentar+replies.\n');
}

// ─── Simulate GraphQL resolver chain (same logic as resolvers/index.js) ───────
async function simulateFeedResolverChain(label) {
  queryCount = 0;
  queryLog.length = 0;

  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });

  for (const post of posts) {
    // Post.author
    await prisma.user.findUnique({ where: { id: post.authorId } });
    // Post.comments (top-level only)
    const comments = await prisma.comment.findMany({
      where: { postId: post.id, parentId: null },
      orderBy: { createdAt: 'asc' },
    });
    for (const comment of comments) {
      // Comment.author
      await prisma.user.findUnique({ where: { id: comment.authorId } });
      // Comment.replies
      const replies = await prisma.comment.findMany({
        where: { parentId: comment.id },
        orderBy: { createdAt: 'asc' },
      });
      for (const reply of replies) {
        // Reply.author
        await prisma.user.findUnique({ where: { id: reply.authorId } });
      }
    }
  }

  const total = queryCount;
  const details = [...queryLog];
  return { label, posts: posts.length, total, details };
}

// ─── Optimized: using Prisma include (single query with JOIN) ─────────────────
async function simulateFeedOptimized(label) {
  queryCount = 0;
  queryLog.length = 0;

  await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
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
    },
  });

  const total = queryCount;
  const details = [...queryLog];
  return { label, total, details };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  await ensureSeedData();

  const totalPosts = await prisma.post.count();
  const totalComments = await prisma.comment.count();
  const totalReplies = await prisma.comment.count({ where: { parentId: { not: null } } });
  const totalUsers = await prisma.user.count();

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('          TAHAP 6 — N+1 DIAGNOSIS BASELINE REPORT');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Database state: ${totalUsers} users | ${totalPosts} posts | ${totalComments - totalReplies} top-level comments | ${totalReplies} replies`);
  console.log('───────────────────────────────────────────────────────────────\n');

  // Run BASELINE (N+1 pattern)
  const baseline = await simulateFeedResolverChain('BEFORE — N+1 resolver chain (naive)');

  console.log(`[${baseline.label}]`);
  console.log(`  Posts resolved: ${baseline.posts}`);
  console.log(`  Total SQL queries: ${baseline.total}`);
  console.log('  Query breakdown:');
  baseline.details.forEach((q, i) => {
    console.log(`    ${String(i + 1).padStart(3, ' ')}. ${q.query} (${q.duration}ms)`);
  });

  console.log();

  // Run OPTIMIZED (Prisma include)
  const optimized = await simulateFeedOptimized('AFTER  — Prisma include (eager loading)');

  console.log(`[${optimized.label}]`);
  console.log(`  Total SQL queries: ${optimized.total}`);
  console.log('  Query breakdown:');
  optimized.details.forEach((q, i) => {
    console.log(`    ${String(i + 1).padStart(3, ' ')}. ${q.query} (${q.duration}ms)`);
  });

  console.log();
  console.log('───────────────────────────────────────────────────────────────');
  console.log('  SUMMARY');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  Baseline (N+1):  ${baseline.total} queries`);
  console.log(`  Optimized:       ${optimized.total} queries`);
  const reduction = baseline.total - optimized.total;
  const pct = ((reduction / baseline.total) * 100).toFixed(1);
  console.log(`  Reduction:       ${reduction} queries saved (${pct}% lebih sedikit)`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // N+1 formula verification
  console.log('ANALISIS N+1 FORMULA:');
  console.log(`  Dengan ${totalPosts} posts:`);
  console.log(`  - 1 query feed`);
  console.log(`  - ${totalPosts} queries Post.author`);
  console.log(`  - ${totalPosts} queries Post.comments`);
  const topLevelComments = totalComments - totalReplies;
  console.log(`  - ${topLevelComments} queries Comment.author (1 per top-level comment)`);
  console.log(`  - ${topLevelComments} queries Comment.replies`);
  console.log(`  - ${totalReplies} queries Reply.author`);
  console.log(`  Formula: 1 + P + P + C + C + R = 1 + ${totalPosts}*2 + ${topLevelComments}*2 + ${totalReplies} = ~${baseline.total} queries\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
