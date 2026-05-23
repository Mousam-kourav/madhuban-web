import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

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

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  // give CSS/web fonts a moment to apply
  await page.waitForTimeout(800);

  const viewportWidth = await page.evaluate(() => window.innerWidth);
  const documentScrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const horizontalScroll = await page.evaluate(() => window.scrollX);

  console.log('=== VIEWPORT ===');
  console.log('window.innerWidth :', viewportWidth);
  console.log('document scrollWidth:', documentScrollWidth);
  console.log('body scrollWidth   :', bodyScrollWidth);
  console.log('window.scrollX     :', horizontalScroll);

  // Find the hero H1 and ALL its ancestors
  const data = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return { error: 'no h1 found' };
    const get = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        classes: (el.className && typeof el.className === 'string'
          ? el.className
          : '').slice(0, 200),
        left: r.left,
        right: r.right,
        width: r.width,
        top: r.top,
        position: cs.position,
        cssLeft: cs.left,
        cssRight: cs.right,
        marginLeft: cs.marginLeft,
        marginRight: cs.marginRight,
        paddingLeft: cs.paddingLeft,
        paddingRight: cs.paddingRight,
        transform: cs.transform,
        cssWidth: cs.width,
        maxWidth: cs.maxWidth,
        overflow: cs.overflow,
        overflowX: cs.overflowX,
        textAlign: cs.textAlign,
        whiteSpace: cs.whiteSpace,
        fontSize: cs.fontSize,
      };
    };
    const trail = [];
    let el = h1;
    while (el) {
      trail.push(get(el));
      if (el === document.documentElement) break;
      el = el.parentElement;
    }
    return {
      h1Text: h1.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80),
      h1InnerHTML: h1.innerHTML.slice(0, 200),
      trail,
    };
  });

  console.log('\n=== H1 ===');
  console.log('text:', data.h1Text);
  console.log('innerHTML:', data.h1InnerHTML);
  console.log('\n=== ANCESTOR TRAIL (H1 -> root) ===');
  for (const node of data.trail) {
    console.log(
      `[${node.tag}] left=${node.left.toFixed(1)} right=${node.right.toFixed(1)} width=${node.width.toFixed(1)} pos=${node.position} mL=${node.marginLeft} mR=${node.marginRight} pL=${node.paddingLeft} pR=${node.paddingRight} tx=${node.transform} ovX=${node.overflowX} ta=${node.textAlign} ws=${node.whiteSpace} fs=${node.fontSize}`,
    );
    console.log(`   classes: ${node.classes}`);
  }

  // Now check ALL h1/h2 on page and any element with negative left
  console.log('\n=== ALL HEADINGS BOUNDING RECTS ===');
  const headings = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('h1, h2, h3').forEach((h) => {
      const r = h.getBoundingClientRect();
      items.push({
        tag: h.tagName,
        text: h.textContent?.trim().replace(/\s+/g, ' ').slice(0, 60),
        left: r.left,
        right: r.right,
        width: r.width,
        top: r.top,
      });
    });
    return items;
  });
  for (const h of headings) {
    console.log(
      `${h.tag} top=${h.top.toFixed(0)} left=${h.left.toFixed(1)} right=${h.right.toFixed(1)} width=${h.width.toFixed(1)} | "${h.text}"`,
    );
  }

  // Look for any element with negative left within visible scroll region
  console.log('\n=== ELEMENTS WITH NEGATIVE BOUNDING-RECT LEFT ===');
  const negs = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.left < -1 && r.width > 0 && r.height > 0 && r.top < 4000) {
        const cs = getComputedStyle(el);
        out.push({
          tag: el.tagName,
          classes: (typeof el.className === 'string' ? el.className : '').slice(
            0,
            120,
          ),
          left: r.left,
          right: r.right,
          width: r.width,
          top: r.top,
          marginLeft: cs.marginLeft,
          transform: cs.transform,
          position: cs.position,
        });
      }
    });
    return out.slice(0, 40);
  });
  for (const n of negs) {
    console.log(
      `[${n.tag}] left=${n.left.toFixed(1)} right=${n.right.toFixed(1)} width=${n.width.toFixed(1)} top=${n.top.toFixed(0)} pos=${n.position} mL=${n.marginLeft} tx=${n.transform}`,
    );
    console.log(`   classes: ${n.classes}`);
  }

  // Take a screenshot for posterity
  await page.screenshot({
    path: 'scripts/measure-hero-clip.png',
    fullPage: false,
  });
  console.log('\nScreenshot saved to scripts/measure-hero-clip.png');
} finally {
  await browser.close();
}
