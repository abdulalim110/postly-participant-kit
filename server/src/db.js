import { PrismaClient } from '@prisma/client';

/**
 * Prisma client dengan query event logging diaktifkan.
 * Log setiap query SQL untuk keperluan Tahap 6 N+1 diagnosis.
 * Set env PRISMA_QUERY_LOG=true untuk mengaktifkan output ke console.
 */
const prisma = new PrismaClient({
  log:
    process.env.PRISMA_QUERY_LOG === 'true'
      ? [{ emit: 'event', level: 'query' }]
      : [],
});

if (process.env.PRISMA_QUERY_LOG === 'true') {
  prisma.$on('query', (e) => {
    console.log(`[PRISMA QUERY] ${e.query} | params: ${e.params} | duration: ${e.duration}ms`);
  });
}

export default prisma;
