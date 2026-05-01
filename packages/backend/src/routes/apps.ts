import { Router } from 'express';
import { z } from 'zod';
import { schedulerService } from '../services/scheduler.service';
import { prisma } from '../lib/prisma';

const router = Router();

const createAppSchema = z.object({
  name: z.string().min(1).max(120),
  play_url: z
    .string()
    .url()
    .refine((url) => url.includes('play.google.com/store/apps/details'), {
      message: 'Must be a valid Google Play Store URL',
    }),
});

const updateAppSchema = z.object({
  name: z.string().min(1).max(120).optional(),
});

// POST /api/apps
router.post('/', async (req, res, next) => {
  try {
    const body = createAppSchema.parse(req.body);

    const url = new URL(body.play_url);
    const packageName = url.searchParams.get('id');
    if (!packageName) {
      res.status(400).json({ error: 'Invalid Google Play URL: missing app id' });
      return;
    }

    const app = await prisma.app.create({
      data: {
        name: body.name,
        playUrl: body.play_url,
        packageName,
      },
    });

    schedulerService.scheduleApp(app.id);
    res.status(201).json(app);
  } catch (err) {
    next(err);
  }
});

// GET /api/apps
router.get('/', async (_req, res, next) => {
  try {
    const apps = await prisma.app.findMany({
      include: {
        _count: { select: { screenshots: true } },
        screenshots: { orderBy: { takenAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = apps.map(({ screenshots, ...app }) => ({
      ...app,
      latestScreenshot: screenshots[0] ?? null,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/apps/:id
router.get('/:id', async (req, res, next) => {
  try {
    const app = await prisma.app.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { screenshots: true } },
        screenshots: { orderBy: { takenAt: 'desc' }, take: 1 },
      },
    });

    if (!app) {
      res.status(404).json({ error: 'App not found' });
      return;
    }

    const { screenshots, ...rest } = app;
    res.json({ ...rest, latestScreenshot: screenshots[0] ?? null });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/apps/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const body = updateAppSchema.parse(req.body ?? {});

    const app = await prisma.app.update({
      where: { id: req.params.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
      },
    });

    res.json(app);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/apps/:id
router.delete('/:id', async (req, res, next) => {
  try {
    schedulerService.unscheduleApp(req.params.id);
    await prisma.app.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
