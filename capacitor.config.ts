import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.docente.app',
  appName: 'App-Docente',
  webDir: 'dist/app-docente',
  server: {
    androidScheme: 'https'
  }
};

export default config;
