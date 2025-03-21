import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.keus.allowance',
  appName: 'Keus Allowance',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    allowNavigation: ['https://keus-allowance-app.onrender.com']
  }
};

export default config;
