import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
});

try {
  // Try plain desktop viewport at 390x844 — no mobile emulation
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await ctx.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const vp = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    docClientWidth: document.documentElement.clientWidth,
    docScrollWidth: document.documentElement.scrollWidth,
    bodyClientWidth: document.body.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
    visualViewportWidth: window.visualViewport?.width ?? null,
  }));
  console.log('Viewport diagnostics:', vp);

  // Find every element whose right edge extends past body width.
  const offenders = await page.evaluate(() => {
    const bodyRight = document.body.getBoundingClientRect().right;
    const tooWide = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > bodyRight + 1 && r.width > 0 && r.height > 0 && r.top < 6000) {
        const cs = getComputedStyle(el);
        tooWide.push({
          tag: el.tagName,
          id: el.id,
          classes: (typeof el.className === 'string' ? el.className : '').slice(0, 150),
          left: r.left,
          right: r.right,
          width: r.width,
          top: r.top,
          marginLeft: cs.marginLeft,
          marginRight: cs.marginRight,
          paddingRight: cs.paddingRight,
          width_css: cs.width,
          maxWidth: cs.maxWidth,
          minWidth: cs.minWidth,
          transform: cs.transform,
          position: cs.position,
        });
      }
    });
    return tooWide.slice(0, 60);
  });

  console.log('\n=== ELEMENTS EXTENDING PAST BODY RIGHT (right > bodyRight) ===');
  console.log('(top sorted; only first 60)');
  offenders.sort((a, b) => a.top - b.top || a.right - b.right);
  for (const o of offenders) {
    console.log(
      `[${o.tag}${o.id ? '#' + o.id : ''}] top=${o.top.toFixed(0)} left=${o.left.toFixed(1)} right=${o.right.toFixed(1)} width=${o.width.toFixed(1)} pos=${o.position} cssW=${o.width_css} maxW=${o.maxWidth} minW=${o.minWidth} mL=${o.marginLeft} mR=${o.marginRight}`,
    );
    console.log(`   classes: ${o.classes}`);
  }

  console.log(`\nTotal offenders (truncated to 60): ${offenders.length}`);
} finally {
  await browser.close();
}
