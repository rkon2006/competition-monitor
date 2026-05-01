import puppeteer, { Browser } from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { App } from '@prisma/client';
import { config } from '../config';
import { prisma } from '../lib/prisma';

const EXECUTABLE_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const LAUNCH_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--lang=en-US,en',
];

class ScreenshotService {
  private browser: Browser | null = null;

  async init(): Promise<void> {
    this.browser = await puppeteer.launch({
      executablePath: EXECUTABLE_PATH,
      headless: true,
      args: LAUNCH_ARGS,
    });
    this.browser.once('disconnected', () => {
      console.warn('[browser] Disconnected unexpectedly, will reinitialize on next capture');
      this.browser = null;
    });
    console.log(`[browser] Initialized (executable: ${EXECUTABLE_PATH})`);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async ensureBrowser(): Promise<Browser> {
    if (this.browser?.isConnected()) return this.browser;

    console.warn('[browser] Not connected, reinitializing...');
    await this.init();
    return this.browser!;
  }

  async capture(app: App): Promise<void> {
    const browser = await this.ensureBrowser();
    const page = await browser.newPage();

    try {
      await page.setViewport({ width: 1280, height: 900 });
      await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

      await page.goto(app.playUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      await page.waitForSelector('[itemprop="name"]', { timeout: 10000 });

      try {
        const consentBtn = await page.$('button[aria-label*="Accept"]');
        if (consentBtn) await consentBtn.click();
      } catch {
        // no banner
      }

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForSelector('img[src*="play-lh"]', { timeout: 5000 }).catch(() => {});

      const screenshotDir = path.join(path.resolve(config.dataDir), 'screenshots', app.id);
      fs.mkdirSync(screenshotDir, { recursive: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filePath = path.join(screenshotDir, `${timestamp}.png`);

      await page.screenshot({ path: filePath, fullPage: true });

      await prisma.screenshot.create({
        data: { appId: app.id, filePath },
      });
    } catch (err) {
      console.error(`[browser] Screenshot failed for app ${app.id}:`, err);
    } finally {
      await page.close();
    }
  }
}

export const screenshotService = new ScreenshotService();
