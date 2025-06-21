
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.69036f38cb57496f8b169f6d33c22b62',
  appName: 'StudySpace',
  webDir: 'dist',
  server: {
    url: 'https://69036f38-cb57-496f-8b16-9f6d33c22b62.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#10B981',
      showSpinner: false
    },
    StatusBar: {
      style: 'LIGHT_CONTENT',
      backgroundColor: '#10B981'
    }
  }
};

export default config;
