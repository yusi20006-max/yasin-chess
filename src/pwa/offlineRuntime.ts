/** True offline runtime helpers (Phase 3 / #35). */

export type OfflineMode = 'online' | 'offline' | 'unknown';

export function getNetworkMode(): OfflineMode {
  if (typeof navigator === 'undefined') return 'unknown';
  return navigator.onLine ? 'online' : 'offline';
}

export function isOffline(): boolean {
  return getNetworkMode() === 'offline';
}

export function subscribeNetworkMode(listener: (mode: OfflineMode) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const emit = () => listener(getNetworkMode());
  window.addEventListener('online', emit);
  window.addEventListener('offline', emit);
  emit();
  return () => {
    window.removeEventListener('online', emit);
    window.removeEventListener('offline', emit);
  };
}

/** App is offline-capable when SW is controlled and IndexedDB is available. */
export function isOfflineCapable(): boolean {
  if (typeof navigator === 'undefined') return false;
  const hasSW = 'serviceWorker' in navigator;
  const hasIDB = typeof indexedDB !== 'undefined';
  return hasSW && hasIDB;
}

export function getOfflineStatusLabel(locale: 'fa' | 'en' = 'fa'): string {
  const mode = getNetworkMode();
  if (locale === 'en') {
    return mode === 'offline' ? 'Offline mode' : mode === 'online' ? 'Online' : 'Network unknown';
  }
  return mode === 'offline' ? 'حالت آفلاین' : mode === 'online' ? 'آنلاین' : 'وضعیت شبکه نامشخص';
}
