import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
});

try {
  // Mobile emulation matching DevTools "iPhone 12 Pro" mode
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const vp = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    visualViewportWidth: window.visualViewport?.width ?? null,
    visualViewportScale: window.visualViewport?.scale ?? null,
    docClientWidth: document.documentElement.clientWidth,
    docScrollWidth: document.documentElement.scrollWidth,
    bodyClientWidth: document.body.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));
  console.log('=== VIEWPORT DIAG (isMobile mode) ===');
  console.log(vp);
  console.log('');

  const measurements = await page.evaluate(() => {
    // For each heading-like element on the page, measure the actual TEXT RANGE bounding rect
    // (which differs from the element box rect when text overflows).
    const results = [];
    document
      .querySelectorAll('h1, h2, h3, p, span, blockquote')
      .forEach((el) => {
        if (!el.firstChild || !el.textContent?.trim()) return;
        const box = el.getBoundingClientRect();
        if (box.top > 6000 || box.width === 0) return;

        // Build a Range covering all the element's text
        const range = document.createRange();
        try {
          range.selectNodeContents(el);
        } catch {
          return;
        }
        // Use getClientRects, which returns per-line rects for wrapped text
        const lineRects = Array.from(range.getClientRects()).filter(
          (r) => r.width > 0 && r.height > 0,
        );
        if (lineRects.length === 0) return;
        const lefts = lineRects.map((r) => r.left);
        const rights = lineRects.map((r) => r.right);
        const minLeft = Math.min(...lefts);
        const maxRight = Math.max(...rights);
        // Only report cases where text OVERFLOWS its box
        const overflowsLeft = box.left - minLeft;
        const overflowsRight = maxRight - box.right;
        if (overflowsLeft > 0.5 || overflowsRight > 0.5) {
          results.push({
            tag: el.tagName,
            text: el.textContent?.trim().replace(/\s+/g, ' ').slice(0, 50),
            classes: (typeof el.className === 'string'
              ? el.className
              : ''
            ).slice(0, 100),
            boxLeft: box.left,
            boxRight: box.right,
            textMinLeft: minLeft,
            textMaxRight: maxRight,
            overflowsLeft,
            overflowsRight,
            lines: lineRects.length,
            top: box.top,
          });
        }
      });
    return results.sort((a, b) => a.top - b.top);
  });

  console.log('=== TEXT OVERFLOW (rendered text extends past element box) ===');
  console.log('viewport = 390px wide. Negative overflowsLeft = text past left edge.');
  for (const m of measurements) {
    console.log(
      `[${m.tag}] top=${m.top.toFixed(0)} box=[${m.boxLeft.toFixed(1)},${m.boxRight.toFixed(1)}] text=[${m.textMinLeft.toFixed(1)},${m.textMaxRight.toFixed(1)}] ovL=${m.overflowsLeft.toFixed(1)} ovR=${m.overflowsRight.toFixed(1)} lines=${m.lines}`,
    );
    console.log(`   text: "${m.text}"`);
    console.log(`   classes: ${m.classes}`);
  }
  console.log(`\nTotal text-overflowing elements: ${measurements.length}`);
} finally {
  await browser.close();
}
