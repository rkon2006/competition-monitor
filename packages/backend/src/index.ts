import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { config } from './config';

import appsRouter from './routes/apps';
import { appScreenshotsRouter, screenshotsRouter } from './routes/screenshots';
import { errorHandler } from './middleware/errorHandler';
import { screenshotService } from './services/screenshot.service';
import { schedulerService } from './services/scheduler.service';

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// apps endpoints
app.use('/api/apps', appsRouter);

// screenshots endpoints
app.use('/api/apps/:appId/screenshots', appScreenshotsRouter);
app.use('/api/screenshots', screenshotsRouter);

app.get('/api/test', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'ok' });
  } catch {
    res.status(503).json({ status: 'ok', db: 'error' });
  }
});

app.use(errorHandler);

screenshotService.init().then(async () => {
  await schedulerService.bootstrap();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
});
