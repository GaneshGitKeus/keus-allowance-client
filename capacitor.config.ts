import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.keus.allowance',
  appName: 'Keus Allowance',
  webDir: 'build',
  server: {
    androidScheme: 'http',
    allowNavigation: ['http://keus-allowance-app.onrender.com'],
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;