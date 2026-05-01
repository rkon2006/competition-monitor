import { screenshotService } from './services/screenshot.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const app = await prisma.app.findFirst();
  if (!app) throw new Error('No apps in DB — add one first');

  await screenshotService.init();
  await screenshotService.capture(app);
  await screenshotService.close();
  await prisma.$disconnect();
}

main().catch(console.error);
