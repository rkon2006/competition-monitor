import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { config } from './config';
import { prisma } from './lib/prisma';

import appsRouter from './routes/apps';
import { appScreenshotsRouter, screenshotsRouter } from './routes/screenshots';
import { errorHandler } from './middleware/errorHandler';
import { screenshotService } from './services/screenshot.service';
import { schedulerService } from './services/scheduler.service';

const app = express();
const server = createServer(app);

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// apps endpoints
app.use('/api/apps', appsRouter);

// screenshots endpoints
app.use('/api/apps/:appId/screenshots', appScreenshotsRouter);
app.use('/api/screenshots', screenshotsRouter);

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'ok' });
  } catch {
    res.status(503).json({ status: 'error', db: 'error' });
  }
});

app.use(errorHandler);

async function shutdown(signal: string): Promise<void> {
  console.log(`[shutdown] ${signal} received, shutting down gracefully`);

  // Force exit if shutdown takes too long
  const forceExit = setTimeout(() => {
    console.error('[shutdown] Forced exit after timeout');
    process.exit(1);
  }, 10_000).unref();

  try {
    schedulerService.stopAll();
    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve())),
    );
    await screenshotService.close();
    await prisma.$disconnect();
    clearTimeout(forceExit);
    console.log('[shutdown] Clean exit');
    process.exit(0);
  } catch (err) {
    console.error('[shutdown] Error during shutdown:', err);
    process.exit(1);
  }
}

process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));

screenshotService.init().then(async () => {
  await schedulerService.bootstrap();
  server.listen(config.port, () => {
    console.log(`[server] Running on port ${config.port}`);
  });
});
