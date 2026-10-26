import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const failures = [];
const openMenu = async (page) => { await page.locator('.menu-trigger').click(); await page.locator('[data-section="game-settings"]').waitFor(); };
const modeSelect = (page) => page.locator('[data-section="game-settings"] select').nth(0);
const timeControlSelect = (page) => page.locator('[data-section="game-settings"] select').nth(3);
const newGameButton = (page) => page.locator('.controls button').last();

async function openFreshPage({ fakeClock = false } = {}) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', (error) => failures.push(error.message));
  if (fakeClock) await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.locator('[data-component="chess-board"]').waitFor();
  await page.locator('[data-square="e2"]').waitFor();
  await page.waitForFunction(() => document.querySelectorAll('[data-square]').length === 64);
  return { context, page };
}

try {
  // Browser interaction: legal move, selection, keyboard cancellation, and move rendering.
  {
    const { context, page } = await openFreshPage();
    await openMenu(page);
    await modeSelect(page).selectOption('human-vs-human');
    await page.locator('.settings-drawer .menu-close').click();
    await page.locator('[data-square="e2"]').click();
    assert.equal(await page.locator('[data-square="e2"]').getAttribute('aria-selected'), 'true', 'e2 should become selected');
    await page.locator('[data-square="e2"]').press('Escape');
    assert.equal(await page.locator('[data-square="e2"]').getAttribute('aria-selected'), 'false', 'Escape should clear selection');
    await page.locator('[data-square="e2"]').click();
    await page.locator('[data-square="e4"]').click();
    assert.equal(await page.locator('[data-square="e4"] .piece-svg').count(), 1, 'white pawn should render on e4 after e2-e4');
    assert.equal(await page.locator('[data-square="e2"] .piece-svg').count(), 0, 'e2 should be empty after e2-e4');
    await context.close();
    console.log('PASS browser move interaction + keyboard cancellation');
  }

  // Race regression: a new game must invalidate an AI response scheduled for the previous game.
  {
    const { context, page } = await openFreshPage();
    await page.locator('[data-square="e2"]').click();
    await page.locator('[data-square="e4"]').click();
    await newGameButton(page).click();
    await page.waitForTimeout(1600);
    assert.equal(await page.locator('[data-square="e2"] .piece-svg').count(), 1, 'new game should restore the e2 pawn');
    assert.equal(await page.locator('[data-square="e4"] .piece-svg').count(), 0, 'stale AI work must not alter the new game');
    assert.equal(await page.locator('[data-square="e7"] .piece-svg').count(), 1, 'new game should preserve the black e7 pawn');
    await context.close();
    console.log('PASS stale-AI/new-game race regression');
  }

  // Race regression: after flag fall, queued/late board clicks must not change the terminal game.
  {
    const { context, page } = await openFreshPage({ fakeClock: true });
    await openMenu(page);
    await modeSelect(page).selectOption('human-vs-human');
    await timeControlSelect(page).selectOption('bullet-1');
    await page.locator('.settings-drawer .menu-close').click();
    await page.clock.fastForward(61_000);
    await page.locator('.game-over-timeout').waitFor({ timeout: 5000 });
    await page.locator('[data-square="e2"]').click({ force: true });
    await page.locator('[data-square="e4"]').click({ force: true });
    assert.equal(await page.locator('[data-square="e2"] .piece-svg').count(), 1, 'moves after timeout must be ignored');
    assert.equal(await page.locator('[data-square="e4"] .piece-svg').count(), 0, 'terminal board must remain unchanged');
    await context.close();
    console.log('PASS clock flag-fall/late-input race regression');
  }

  assert.deepEqual(failures, [], `uncaught browser errors: ${failures.join('; ')}`);
  console.log('BROWSER_INTERACTION_AUDIT_OK');
} finally {
  await browser.close();
}
