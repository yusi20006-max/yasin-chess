# Phase 3 — PWA / Offline Reconciliation

**Date:** 2026-09-30  
**Branch:** `feat/phase3-pwa-offline`

## Summary

Phase 3 (PWA Manifest, Service Worker, True Offline Launch, Offline Regression) is complete.

## Issue map

| Issue | Title | Implementation |
|-------|-------|----------------|
| #33 | PWA Manifest & Installable App Foundation | `public/manifest.webmanifest`, `index.html` meta, icons |
| #34 | Service Worker & Static Asset Caching | `public/sw.js` versioned cache + app shell |
| #35 | True Offline Launch & Runtime Mode | navigate network-first + shell fallback; `offlineRuntime.ts` |
| #36 | Offline Regression & Network-Isolation Test Suite | `tests/pwa-offline.test.ts`, `scripts/offline-smoke.mjs`, CSP audit |

## Acceptance

- [x] Valid manifest (name, short_name, start_url, display standalone, theme, icons)
- [x] SW registers on load with versioned URL
- [x] App shell cached; offline navigate falls back to index.html
- [x] CSP denies wildcard network (`connect-src 'self'`)
- [x] Regression tests cover manifest, SW, assets, offline helpers

## Constraints

- Offline-first: no required external API for core play
- Core chess rules unchanged
- PWA layer isolated under `src/pwa` + `public/`

## Definition of Done

- [x] Manifest + icons + meta
- [x] Service worker caching
- [x] Offline launch path
- [x] Regression suite
- [x] Issues #33–#36 closed
