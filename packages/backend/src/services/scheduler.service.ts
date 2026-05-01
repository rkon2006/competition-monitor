import cron, { ScheduledTask } from 'node-cron';
import { App } from '@prisma/client';
import { screenshotService } from './screenshot.service';
import { prisma } from '../lib/prisma';

class SchedulerService {
  private jobs: Map<string, ScheduledTask> = new Map();

  async bootstrap(): Promise<void> {
    const apps = await prisma.app.findMany();
    for (const app of apps) {
      this.scheduleApp(app);
    }
    console.log(`[scheduler] Bootstrapped ${apps.length} app(s)`);
  }

  scheduleApp(app: App): void {
    this.unscheduleApp(app.id);

    const task = cron.schedule('0 * * * *', () => {
      console.log(`[scheduler] Triggering capture for: ${app.name}`);
      screenshotService
        .capture(app)
        .catch((err) => console.error(`[scheduler] Capture error for ${app.name}:`, err));
    });

    this.jobs.set(app.id, task);
    console.log(`[scheduler] Scheduled "${app.name}" every hour`);
  }

  unscheduleApp(appId: string): void {
    const task = this.jobs.get(appId);
    if (task) {
      task.stop();
      this.jobs.delete(appId);
    }
  }

  stopAll(): void {
    for (const task of this.jobs.values()) {
      task.stop();
    }
    this.jobs.clear();
    console.log('[scheduler] All jobs stopped');
  }

  get jobCount(): number {
    return this.jobs.size;
  }
}

export const schedulerService = new SchedulerService();
