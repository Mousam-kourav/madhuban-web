import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
});

async function snap({ label, width, height, isMobile }) {
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
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const data = await page.evaluate(() => {
    const tagline = Array.from(document.querySelectorAll('header span')).find(
      (s) => s.textContent?.includes('Ratapani Tiger Reserve, Bhopal'),
    );
    const taglineDisplay = tagline ? getComputedStyle(tagline).display : 'not-found';
    const taglineVisible = tagline
      ? tagline.getBoundingClientRect().width > 0
      : false;
    return {
      innerWidth: window.innerWidth,
      visualWidth: window.visualViewport?.width ?? null,
      bodyScrollWidth: document.body.scrollWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      taglineDisplay,
      taglineVisible,
    };
  });

  await page.screenshot({
    path: `scripts/verify-${label}.png`,
    fullPage: false,
    clip: { x: 0, y: 0, width, height: Math.min(height, 200) },
  });
  await ctx.close();
  return data;
}

const mobile = await snap({ label: 'mobile-390', width: 390, height: 844, isMobile: true });
console.log('MOBILE (390px iPhone 12 Pro):', mobile);
const tablet = await snap({ label: 'tablet-768', width: 768, height: 1024, isMobile: false });
console.log('TABLET (768px):', tablet);
const desktop = await snap({ label: 'desktop-1280', width: 1280, height: 900, isMobile: false });
console.log('DESKTOP (1280px):', desktop);

await browser.close();
