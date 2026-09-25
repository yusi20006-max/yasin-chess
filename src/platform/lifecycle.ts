import { App } from '@capacitor/app';

export async function bindLifecycle(): Promise<() => void> {
  const handle = await App.addListener('appStateChange', ({ isActive }) => {
    document.documentElement.dataset.appState = isActive ? 'active' : 'background';
  });
  return () => handle.remove();
}
