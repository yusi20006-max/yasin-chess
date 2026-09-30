import {APP_VERSION, SERVICE_WORKER_URL} from './version';

export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener(
    'load',
    () => {
      void navigator.serviceWorker
        .register(SERVICE_WORKER_URL, {updateViaCache: 'none'})
        .then((registration) => {
          void registration.update();
          // Periodically check for updates while the app stays open.
          window.setInterval(() => void registration.update(), 60 * 60 * 1000);
        })
        .catch(() => undefined);
    },
    {once: true},
  );
}

export function requestServiceWorkerUpdate(): void {
  const worker = navigator.serviceWorker?.controller;
  worker?.postMessage({type: 'SKIP_WAITING', version: APP_VERSION});
}

export async function getServiceWorkerState(): Promise<'controlled' | 'registered' | 'unsupported' | 'none'> {
  if (!('serviceWorker' in navigator)) return 'unsupported';
  if (navigator.serviceWorker.controller) return 'controlled';
  const reg = await navigator.serviceWorker.getRegistration();
  return reg ? 'registered' : 'none';
}
