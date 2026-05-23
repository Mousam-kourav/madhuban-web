import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = process.argv[2] || 'http://localhost:3000/';

const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
});

try {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const data = await page.evaluate(() => {
    const vp = {
      innerWidth: window.innerWidth,
      visualViewportWidth: window.visualViewport?.width ?? null,
      visualViewportOffsetLeft: window.visualViewport?.offsetLeft ?? null,
      visualViewportScale: window.visualViewport?.scale ?? null,
      bodyClientWidth: document.body.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      scrollX: window.scrollX,
    };

    // Find the hero H1 specifically and measure where its TEXT renders
    const h1 = document.querySelector('h1');
    let h1Info = null;
    if (h1) {
      const box = h1.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(h1);
      const lineRects = Array.from(range.getClientRects());
      h1Info = {
        text: h1.textContent?.trim().replace(/\s+/g, ' '),
        box: { left: box.left, right: box.right, width: box.width, top: box.top },
        lines: lineRects.map((r) => ({
          left: r.left,
          right: r.right,
          width: r.width,
          top: r.top,
        })),
      };
    }

    // Find anything that's off-screen right of visual viewport
    const visualViewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const offRight = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (
        r.right > visualViewportWidth + 1 &&
        r.width > 0 &&
        r.height > 0 &&
        r.top < 4000 &&
        // skip pure children of overflow rails
        !el.closest('.scrollbar-hide, [aria-roledescription="carousel"]')
      ) {
        out: {
          for (const child of el.querySelectorAll('*')) {
            const cr = child.getBoundingClientRect();
            if (cr.right >= r.right - 1) break out;
          }
          // This is a leaf-ish overflower
        }
        offRight.push({
          tag: el.tagName,
          classes: (typeof el.className === 'string'
            ? el.className
            : '').slice(0, 100),
          left: r.left,
          right: r.right,
          width: r.width,
          top: r.top,
        });
      }
    });
    return { vp, h1: h1Info, offRight: offRight.slice(0, 30) };
  });

  console.log(`=== URL: ${URL} ===`);
  console.log('Viewport:', data.vp);
  console.log('\n=== HERO H1 ===');
  if (data.h1) {
    console.log(`text: "${data.h1.text}"`);
    console.log(`box: left=${data.h1.box.left} right=${data.h1.box.right} width=${data.h1.box.width}`);
    console.log('lines (per visual line):');
    for (const l of data.h1.lines) {
      console.log(`  top=${l.top.toFixed(1)} left=${l.left.toFixed(1)} right=${l.right.toFixed(1)} width=${l.width.toFixed(1)}`);
    }
  }
  console.log(`\n=== ELEMENTS PAST VISUAL VIEWPORT RIGHT (excluding carousels) ===`);
  for (const o of data.offRight) {
    console.log(`[${o.tag}] top=${o.top.toFixed(0)} left=${o.left.toFixed(1)} right=${o.right.toFixed(1)} width=${o.width.toFixed(1)}`);
    console.log(`   classes: ${o.classes}`);
  }
} finally {
  await browser.close();
}
