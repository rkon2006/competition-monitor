import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { config } from './config';

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get('/api/test', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'ok' });
  } catch {
    res.status(503).json({ status: 'ok', db: 'error' });
  }
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
