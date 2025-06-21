
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<string>('web');

  useEffect(() => {
    const initializeCapacitor = async () => {
      setIsNative(Capacitor.isNativePlatform());
      setPlatform(Capacitor.getPlatform());

      if (Capacitor.isNativePlatform()) {
        // Configure status bar for mobile
        try {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#10B981' });
        } catch (error) {
          console.log('StatusBar not available:', error);
        }

        // Hide splash screen after app loads
        try {
          await SplashScreen.hide();
        } catch (error) {
          console.log('SplashScreen not available:', error);
        }
      }
    };

    initializeCapacitor();
  }, []);

  return {
    isNative,
    platform,
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
    isWeb: platform === 'web'
  };
};
