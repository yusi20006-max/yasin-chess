import {describe, expect, it} from 'vitest';
import {readFileSync, existsSync} from 'node:fs';
import {APP_VERSION, SERVICE_WORKER_URL} from '../src/pwa/version';
import {getNetworkMode, isOfflineCapable, getOfflineStatusLabel} from '../src/pwa/offlineRuntime';

describe('Phase 3 PWA / Offline', () => {
  it('exposes a versioned service worker URL', () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+/);
    expect(SERVICE_WORKER_URL).toContain('/sw.js?version=');
    expect(SERVICE_WORKER_URL).toContain(encodeURIComponent(APP_VERSION));
  });

  it('has a valid web manifest with installability fields', () => {
    const raw = readFileSync('public/manifest.webmanifest', 'utf8');
    const m = JSON.parse(raw);
    expect(m.name).toBeTruthy();
    expect(m.short_name).toBeTruthy();
    expect(m.start_url).toBeTruthy();
    expect(m.display).toBe('standalone');
    expect(m.theme_color).toBeTruthy();
    expect(m.background_color).toBeTruthy();
    expect(Array.isArray(m.icons)).toBe(true);
    expect(m.icons.length).toBeGreaterThan(0);
    expect(m.icons[0].src).toBeTruthy();
  });

  it('ships required PWA static assets', () => {
    expect(existsSync('public/sw.js')).toBe(true);
    expect(existsSync('public/manifest.webmanifest')).toBe(true);
    expect(existsSync('public/icon.svg')).toBe(true);
  });

  it('service worker caches app shell and handles navigate offline', () => {
    const sw = readFileSync('public/sw.js', 'utf8');
    expect(sw).toContain('APP_SHELL');
    expect(sw).toContain('/index.html');
    expect(sw).toContain('/manifest.webmanifest');
    expect(sw).toContain("request.mode === 'navigate'");
    expect(sw).toContain('caches.match');
    expect(sw).toContain('skipWaiting');
  });

  it('index.html links manifest and has installability meta', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).toContain('rel="manifest"');
    expect(html).toContain('manifest.webmanifest');
    expect(html).toContain('theme-color');
    expect(html).toContain('apple-mobile-web-app-capable');
    expect(html).toContain("default-src 'self'");
    expect(html).toContain("connect-src 'self'");
  });

  it('offline runtime helpers are defined', () => {
    expect(['online', 'offline', 'unknown']).toContain(getNetworkMode());
    expect(typeof isOfflineCapable()).toBe('boolean');
    expect(getOfflineStatusLabel('fa')).toBeTruthy();
    expect(getOfflineStatusLabel('en')).toBeTruthy();
  });
});
