import { Capacitor } from '@capacitor/core';

export type RuntimeKind = 'android' | 'ios' | 'web';

export function runtimeKind(): RuntimeKind {
  if (!Capacitor.isNativePlatform()) return 'web';
  return Capacitor.getPlatform() === 'android' ? 'android' : 'ios';
}

export function isStandaloneRuntime(): boolean {
  return Capacitor.isNativePlatform();
}
