import { App } from '@capacitor/app';

export async function bindBackNavigation(handler: () => void): Promise<() => void> {
  const listener = await App.addListener('backButton', handler);
  return () => listener.remove();
}
