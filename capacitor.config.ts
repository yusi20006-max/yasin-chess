import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yasin.chess',
  appName: 'Yasin Chess',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    cleartext: false,
  },
};

export default config;
