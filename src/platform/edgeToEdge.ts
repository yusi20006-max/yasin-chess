import { StatusBar, Style } from '@capacitor/status-bar';

export async function enableEdgeToEdge(): Promise<void> {
  try {
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({ style: Style.Dark });
  } catch {}
}
