import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { verifyToken } from './auth.js';
import prisma from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootAssetsDir = path.resolve(__dirname, '../../assets');

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(cors());
app.use(express.json());

// Static assets allowlist serving
app.use('/assets', express.static(rootAssetsDir));

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const decoded = verifyToken(authHeader);
      let currentUser = null;
      if (decoded && decoded.userId) {
        currentUser = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });
      }
      return { currentUser, authHeader };
    },
  })
);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Postly Backend ready at http://localhost:${PORT}/graphql`);
  console.log(`🖼️ Static assets available at http://localhost:${PORT}/assets`);
});
