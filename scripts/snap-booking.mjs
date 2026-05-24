import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
});

async function snap({ label, width, height, isMobile, fullPage = false }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: isMobile ? 3 : 1,
    isMobile,
    hasTouch: isMobile,
    ...(isMobile && {
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    }),
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/booking', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: `scripts/snap-booking-${label}.png`,
    fullPage,
  });
  const has = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    schemaCount: document.querySelectorAll('script[type="application/ld+json"]').length,
    hasFaqSchema: Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .some((s) => s.textContent?.includes('FAQPage')),
    trustBadges: Array.from(document.querySelectorAll('[aria-label="Booking guarantees"] li')).map(
      (l) => l.textContent?.trim(),
    ),
    primaryCtaHref: document.querySelector('a[href="/stay"]')?.getAttribute('href'),
  }));
  await ctx.close();
  return has;
}

console.log('MOBILE viewport (390x844):', await snap({ label: 'mobile', width: 390, height: 844, isMobile: true }));
await snap({ label: 'mobile-full', width: 390, height: 844, isMobile: true, fullPage: true });
console.log('DESKTOP viewport (1280x900):', await snap({ label: 'desktop', width: 1280, height: 900, isMobile: false }));
await snap({ label: 'desktop-full', width: 1280, height: 900, isMobile: false, fullPage: true });

await browser.close();
