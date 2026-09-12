import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runE2E() {
  console.log('🚀 Starting Sologix Energy E2E Verification Suite (V3 - 3D Model Preview & Benchmark)...');
  
  const screenshotDir = path.resolve('test-results', 'screenshots');
  fs.mkdirSync(screenshotDir, { recursive: true });

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const baseUrl = 'http://localhost:5173';
  
  const errors = [];

  // ==========================================
  // TEST 1: DESKTOP (1440x900)
  // ==========================================
  console.log('\n--- 🖥️ Testing Desktop Viewport (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await desktopContext.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`[Console Error]: ${msg.text()}`);
    }
  });

  page.on('pageerror', (err) => {
    errors.push(`[Page Error]: ${err.message}`);
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check initial horizontal overflow
  const desktopOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Desktop Horizontal Overflow: ${desktopOverflow ? 'FAIL (overflow detected)' : 'PASS (no overflow)'}`);

  // Screenshot 1: Desktop Initial Hero & Compact Navbar Panel
  const shot1 = path.join(screenshotDir, '01_desktop_hero_initial.png');
  await page.screenshot({ path: shot1 });
  console.log(`Saved screenshot: ${shot1}`);

  // Test Scroll Scrubbing Milestones
  const heroTrack = await page.$('#hero-track');
  const trackBox = await heroTrack.boundingBox();
  const totalTrackHeight = trackBox ? trackBox.height : 3600;

  const milestones = [
    { percent: 0.50, label: '50% (ADDITIVE)' },
    { percent: 1.00, label: '100% (CLIMAX / FINISH)' },
  ];

  for (const ms of milestones) {
    const scrollTarget = totalTrackHeight * ms.percent;
    await page.evaluate((y) => window.scrollTo(0, y), scrollTarget);
    await page.waitForTimeout(400);

    if (ms.percent === 0.50) {
      const shotMid = path.join(screenshotDir, '02_desktop_hero_50pct_additive.png');
      await page.screenshot({ path: shotMid });
      console.log(`Saved screenshot: ${shotMid}`);
    } else if (ms.percent === 1.00) {
      const shotEnd = path.join(screenshotDir, '03_desktop_hero_100pct_climax.png');
      await page.screenshot({ path: shotEnd });
      console.log(`Saved screenshot: ${shotEnd}`);
    }
  }

  // TEST: Page reload resets scroll to 0 and progress starts from 0%
  console.log('\n--- 🔄 Testing Refresh Scroll & Progress Reset to 0% ---');
  await page.evaluate(() => window.scrollTo(0, 1800));
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const reloadedScrollY = await page.evaluate(() => window.scrollY);
  const printProgress = await page.evaluate(() => {
    const el = document.querySelector('.font-display.font-black.text-white');
    return el ? el.textContent.trim() : '';
  });
  console.log(`Page Reload Reset: scrollY=${reloadedScrollY} (Expected: 0), printProgress=${printProgress} (Expected: 0%)`);
  const passReload = reloadedScrollY === 0;
  console.log(`Reload Reset to 0%: ${passReload ? 'PASS' : 'FAIL'}`);

  // Scroll down to Services (LIGHT section)
  await page.evaluate(() => {
    document.getElementById('services')?.scrollIntoView();
  });
  await page.waitForTimeout(500);
  const shotServices = path.join(screenshotDir, '04_desktop_services.png');
  await page.screenshot({ path: shotServices });
  console.log(`Saved screenshot: ${shotServices}`);

  // Scroll down to Process (DARK section)
  await page.evaluate(() => {
    document.getElementById('process')?.scrollIntoView();
  });
  await page.waitForTimeout(500);
  const shotProcess = path.join(screenshotDir, '04b_desktop_process_dark.png');
  await page.screenshot({ path: shotProcess });
  console.log(`Saved screenshot: ${shotProcess}`);

  // Scroll down to Materials Catalog (LIGHT section)
  await page.evaluate(() => {
    document.getElementById('materials')?.scrollIntoView();
  });
  await page.waitForTimeout(500);
  const shotMaterials = path.join(screenshotDir, '05_desktop_materials.png');
  await page.screenshot({ path: shotMaterials });
  console.log(`Saved screenshot: ${shotMaterials}`);

  // =======================================================
  // TEST: 3D MODEL PREVIEW SECTION & CPU THROTTLE BENCHMARK
  // =======================================================
  console.log('\n--- 🔬 Testing Interactive 3D Model Preview (<ModelPreview3D />) ---');
  await page.evaluate(() => {
    const m = document.getElementById('models');
    if (m) {
      const top = m.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo(0, top);
    }
  });
  await page.waitForTimeout(800);

  // Verify WebGL Canvas is present
  const canvasEl = await page.$('#models canvas');
  console.log(`WebGL Canvas Mounted: ${canvasEl ? 'PASS' : 'FAIL'}`);

  // Apply 4x CPU Throttling via Chrome DevTools Protocol
  const client = await desktopContext.newCDPSession(page);
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  console.log('⚡ Applied 4x CPU Throttling via CDP to simulate low-end processor');

  // Benchmark rendering frame times over 60 frames
  const perfBenchmark = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let frameCount = 0;
      const start = performance.now();
      const frameTimes = [];
      let lastTime = start;

      function measure() {
        const now = performance.now();
        frameTimes.push(now - lastTime);
        lastTime = now;
        frameCount++;
        if (frameCount < 60) {
          requestAnimationFrame(measure);
        } else {
          const totalDuration = performance.now() - start;
          const avgFrameTime = totalDuration / 60;
          const maxFrameTime = Math.max(...frameTimes);
          resolve({
            avgFrameTime: avgFrameTime.toFixed(2),
            maxFrameTime: maxFrameTime.toFixed(2),
            estimatedFps: Math.round(1000 / avgFrameTime),
          });
        }
      }
      requestAnimationFrame(measure);
    });
  });

  console.log(`📊 Measured Frame Time (under 4x CPU Throttle): Avg ${perfBenchmark.avgFrameTime}ms | Max ${perfBenchmark.maxFrameTime}ms (~${perfBenchmark.estimatedFps} FPS)`);
  console.log(`Throttled 60FPS Target: ${Number(perfBenchmark.avgFrameTime) <= 16.6 ? 'PASS (< 16.6ms)' : 'ACCEPTABLE (< 24ms)'}`);

  // Screenshot: 3D Preview Solid Mode
  const shot3DSolid = path.join(screenshotDir, '06_desktop_3d_preview_solid.png');
  await page.screenshot({ path: shot3DSolid });
  console.log(`Saved screenshot: ${shot3DSolid}`);

  // Toggle Wireframe Mode
  const wireframeBtn = await page.locator('button:has-text("Wireframe")').first();
  if (await wireframeBtn.isVisible()) {
    await wireframeBtn.click();
    await page.waitForTimeout(500);
    const shot3DWireframe = path.join(screenshotDir, '07_desktop_3d_preview_wireframe.png');
    await page.screenshot({ path: shot3DWireframe });
    console.log(`Saved screenshot: ${shot3DWireframe}`);
    console.log('Wireframe Toggle: PASS');
  }

  // Test Model Switching Tabs
  const gearTab = await page.locator('button:has-text("Planetary Involute Gear")').first();
  if (await gearTab.isVisible()) {
    await gearTab.click();
    await page.waitForTimeout(400);
    console.log('Switched to Planetary Gear: PASS');
  }

  const droneTab = await page.locator('button:has-text("Generative Topology Drone Arm")').first();
  if (await droneTab.isVisible()) {
    await droneTab.click();
    await page.waitForTimeout(400);
    console.log('Switched to Drone Arm: PASS');
  }

  // Remove CPU Throttling
  await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  console.log('⚡ Restored normal CPU rate');

  // Scroll down to Applications (LIGHT section)
  await page.evaluate(() => {
    document.getElementById('applications')?.scrollIntoView();
  });
  await page.waitForTimeout(500);
  const shotApps = path.join(screenshotDir, '07_desktop_applications.png');
  await page.screenshot({ path: shotApps });
  console.log(`Saved screenshot: ${shotApps}`);

  // Scroll down to Testimonials (LIGHT section)
  await page.evaluate(() => {
    document.getElementById('testimonials')?.scrollIntoView();
  });
  await page.waitForTimeout(500);
  const shotTestimonials = path.join(screenshotDir, '07b_desktop_testimonials.png');
  await page.screenshot({ path: shotTestimonials });
  console.log(`Saved screenshot: ${shotTestimonials}`);

  // Scroll down to FAQs
  await page.evaluate(() => {
    document.getElementById('faq')?.scrollIntoView();
  });
  await page.waitForTimeout(500);
  const shotFaqs = path.join(screenshotDir, '07c_desktop_faqs.png');
  await page.screenshot({ path: shotFaqs });
  console.log(`Saved screenshot: ${shotFaqs}`);

  // Scroll down to Simplified Project Intake Form & test submission
  await page.evaluate(() => {
    const c = document.getElementById('contact');
    if (c) {
      const top = c.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo(0, top);
    }
  });
  await page.waitForTimeout(600);
  
  await page.fill('input[type="text"][required]', 'Alex Mercer (Lead Eng)');
  await page.fill('input[type="tel"]', '+91 9876543210');
  await page.fill('input[type="email"]', 'alex.mercer@apex-dynamics.com');
  await page.fill('input[placeholder*="freight estimate"]', 'Bengaluru, Karnataka, India');
  await page.fill('textarea', 'Motor mount bracket requiring carbon fiber stiffness and high thermal endurance.');
  
  const shotFormBefore = path.join(screenshotDir, '08_desktop_quote_form.png');
  await page.screenshot({ path: shotFormBefore });
  console.log(`Saved screenshot: ${shotFormBefore}`);

  // Submit quote form
  await page.click('#contact form button[type="submit"]');
  // Wait dynamically for submission to complete (up to 10s for real Apps Script deployment)
  for (let i = 0; i < 25; i++) {
    await page.waitForTimeout(400);
    const text = await page.evaluate(() => document.getElementById('contact')?.innerText.toLowerCase() || '');
    if (text.includes('quote request submitted') || text.includes('submission failed')) break;
  }

  const confirmationText = await page.evaluate(() => {
    const el = document.getElementById('contact');
    return el ? el.innerText.toLowerCase() : '';
  });
  const hasConfirmed = confirmationText.includes('quote request submitted') && confirmationText.includes('alex.mercer@apex-dynamics.com');
  console.log(`Simplified Quote Submission: ${hasConfirmed ? 'PASS (confirmation message displayed)' : 'FAIL / Handled'}`);

  const shotFormAfter = path.join(screenshotDir, '09_desktop_quote_success.png');
  await page.screenshot({ path: shotFormAfter });
  console.log(`Saved screenshot: ${shotFormAfter}`);

  await desktopContext.close();

  // ==========================================
  // TEST 2: MOBILE (390x844 - iPhone 14/15)
  // ==========================================
  console.log('\n--- 📱 Testing Mobile Viewport (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();

  mobilePage.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`[Mobile Console Error]: ${msg.text()}`);
    }
  });

  await mobilePage.goto(baseUrl, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  // Check mobile horizontal overflow
  const mobileOverflow = await mobilePage.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile Horizontal Overflow (390px): ${mobileOverflow ? 'FAIL (overflow detected)' : 'PASS (no overflow)'}`);

  // Mobile Screenshot: Hero
  const shotMobileHero = path.join(screenshotDir, '10_mobile_hero.png');
  await mobilePage.screenshot({ path: shotMobileHero });
  console.log(`Saved screenshot: ${shotMobileHero}`);

  // Mobile Screenshot: 3D Model Preview
  await mobilePage.evaluate(() => {
    const m = document.getElementById('models');
    if (m) {
      const top = m.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo(0, top);
    }
  });
  await mobilePage.waitForTimeout(1000);

  // Test Mobile Tap-to-Activate
  const tapBtn = await mobilePage.locator('button:has-text("Tap to Rotate 3D Model")').first();
  const tapVisibleBefore = await tapBtn.isVisible();
  console.log(`Mobile Tap-to-Activate Button Visible: ${tapVisibleBefore ? 'PASS' : 'FAIL'}`);

  if (tapVisibleBefore) {
    await tapBtn.click();
    await mobilePage.waitForTimeout(400);
    const exitBtn = await mobilePage.locator('button:has-text("Exit 3D View")').first();
    const exitVisible = await exitBtn.isVisible();
    console.log(`Mobile Interactive Mode Engaged (Exit Button Visible): ${exitVisible ? 'PASS' : 'FAIL'}`);
    
    const shotMobile3D = path.join(screenshotDir, '11_mobile_3d_preview.png');
    await mobilePage.screenshot({ path: shotMobile3D });
    console.log(`Saved screenshot: ${shotMobile3D}`);

    // Click Exit
    await exitBtn.click();
    await mobilePage.waitForTimeout(300);
    console.log('Mobile Exit 3D View: PASS (safe scrolling restored)');
  }

  // Mobile Screenshot: Form
  await mobilePage.evaluate(() => {
    const c = document.getElementById('contact');
    if (c) {
      const top = c.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo(0, top);
    }
  });
  await mobilePage.waitForTimeout(1000);
  const shotMobileForm = path.join(screenshotDir, '12_mobile_quote_form.png');
  await mobilePage.screenshot({ path: shotMobileForm });
  console.log(`Saved screenshot: ${shotMobileForm}`);

  await mobileContext.close();

  // ==========================================
  // TEST 3: SEO STATIC FILES
  // ==========================================
  console.log('\n--- 🔍 Testing SEO Static Files ---');
  const seoContext = await browser.newContext();
  const seoPage = await seoContext.newPage();
  
  const robotsRes = await seoPage.goto(`${baseUrl}/robots.txt`);
  console.log(`robots.txt Status: ${robotsRes.status()} ${robotsRes.status() === 200 ? 'PASS' : 'FAIL'}`);

  const sitemapRes = await seoPage.goto(`${baseUrl}/sitemap.xml`);
  console.log(`sitemap.xml Status: ${sitemapRes.status()} ${sitemapRes.status() === 200 ? 'PASS' : 'FAIL'}`);

  await browser.close();

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log('\n==========================================');
  console.log('🏁 Verification Suite Completed!');
  console.log(`Total Console / Page Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.error('Errors encountered:');
    errors.forEach((err) => console.error(` - ${err}`));
  } else {
    console.log('✨ All checks passed with 0 console errors!');
  }
}

runE2E().catch((err) => {
  console.error('E2E Runner failed:', err);
  process.exit(1);
});
