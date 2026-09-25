import { ScreenOrientation } from '@capacitor/screen-orientation';

export async function allowResponsiveOrientation(): Promise<void> {
  try { await ScreenOrientation.unlock(); } catch {}
}
