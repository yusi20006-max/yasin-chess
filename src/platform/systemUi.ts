import { StatusBar, Style } from '@capacitor/status-bar';

export async function syncSystemUi(theme: 'light'|'dark'): Promise<void> {
  try {
    await StatusBar.setStyle({ style: theme === 'dark' ? Style.Dark : Style.Light });
  } catch {}
}
