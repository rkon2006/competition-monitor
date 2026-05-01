import { Router } from 'express';
import { createReadStream, existsSync } from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient();

// /api/apps/:appId/screenshots
export const appScreenshotsRouter = Router({ mergeParams: true });

appScreenshotsRouter.get('/', async (req, res, next) => {
  try {
    const { appId } = req.params;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [screenshots, total] = await Promise.all([
      prisma.screenshot.findMany({
        where: { appId },
        orderBy: { takenAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.screenshot.count({ where: { appId } }),
    ]);

    const data = screenshots.map(({ id, appId, filePath, takenAt }) => ({
      id,
      appId,
      filePath,
      takenAt,
      imageUrl: `/api/screenshots/${id}/image`,
    }));

    res.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// Mounted at /api/screenshots
export const screenshotsRouter = Router();

// GET /api/screenshots/:id/image — stream PNG file
screenshotsRouter.get('/:id/image', async (req, res, next) => {
  try {
    const screenshot = await prisma.screenshot.findUnique({
      where: { id: req.params.id },
    });

    if (!screenshot) {
      res.status(404).json({ error: 'Screenshot not found' });
      return;
    }

    // Path traversal guard
    const resolved = path.resolve(screenshot.filePath);
    const dataDir = path.resolve(config.dataDir);
    if (!resolved.startsWith(dataDir + path.sep)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    if (!existsSync(resolved)) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('ETag', `"${screenshot.id}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    createReadStream(resolved).pipe(res);
  } catch (err) {
    next(err);
  }
});
