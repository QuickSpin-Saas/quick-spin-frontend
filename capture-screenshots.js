const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'ui-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('📸 Capturing UI screenshots...\n');

  const pages = [
    { path: '/auth/login', name: 'login-page' },
    { path: '/auth/signup', name: 'signup-page' },
  ];

  for (const pageInfo of pages) {
    try {
      console.log(`Capturing ${pageInfo.name}...`);
      await page.goto(`http://localhost:3000${pageInfo.path}`, {
        waitUntil: 'networkidle',
        timeout: 10000
      });
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: path.join(screenshotsDir, `${pageInfo.name}.png`),
        fullPage: true
      });

      console.log(`✅ ${pageInfo.name}.png saved`);
    } catch (error) {
      console.log(`⚠️  ${pageInfo.name} - ${error.message}`);
    }
  }

  await browser.close();
  console.log(`\n📁 Screenshots saved to: ${screenshotsDir}`);
}

captureScreenshots().catch(console.error);
