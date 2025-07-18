
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Try to get Firebase config from localStorage (set by DeveloperManagement)
const getFirebaseConfigFromStorage = () => {
  try {
    const stored = localStorage.getItem('firebase_config');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error parsing stored Firebase config:', error);
  }
  return null;
};

// Fallback to environment variables if no stored config
const getFirebaseConfig = () => {
  const storedConfig = getFirebaseConfigFromStorage();
  
  if (storedConfig && storedConfig.apiKey && storedConfig.projectId) {
    return {
      apiKey: storedConfig.apiKey,
      authDomain: storedConfig.authDomain,
      projectId: storedConfig.projectId,
      storageBucket: storedConfig.storageBucket,
      messagingSenderId: storedConfig.messagingSenderId,
      appId: storedConfig.appId
    };
  }
  
  // Fallback to environment variables
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
};

const firebaseConfig = getFirebaseConfig();

// Validate required configuration
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  console.error('Missing Firebase configuration keys:', missingKeys);
  console.error('Please configure Firebase in Developer Management or check your environment variables');
  console.error('Make sure your Supabase secrets are named with VITE_ prefix:');
  console.error('- VITE_FIREBASE_API_KEY');
  console.error('- VITE_FIREBASE_AUTH_DOMAIN'); 
  console.error('- VITE_FIREBASE_PROJECT_ID');
  console.error('- VITE_FIREBASE_STORAGE_BUCKET');
  console.error('- VITE_FIREBASE_MESSAGING_SENDER_ID');
  console.error('- VITE_FIREBASE_APP_ID');
  console.error('- VITE_FIREBASE_VAPID_KEY');
  
  // Don't throw error in development to prevent app from crashing
  console.warn('Firebase features will be disabled until configuration is fixed');
}

let app: ReturnType<typeof initializeApp> | null = null;
let messaging: ReturnType<typeof getMessaging> | null = null;

// Only initialize if we have valid configuration
if (missingKeys.length === 0) {
  try {
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

export { messaging };

export const requestNotificationPermission = async () => {
  if (!messaging) {
    console.error('Firebase messaging not initialized - check your configuration');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Get VAPID key from stored config or environment
      const storedConfig = getFirebaseConfigFromStorage();
      const vapidKey = storedConfig?.vapidKey || import.meta.env.VITE_FIREBASE_VAPID_KEY;
      
      if (!vapidKey) {
        console.error('VAPID Key is missing - add it to Firebase configuration in Developer Management or VITE_FIREBASE_VAPID_KEY to Supabase secrets');
        return null;
      }
      
      const token = await getToken(messaging, {
        vapidKey: vapidKey
      });
      console.log('FCM Token:', token);
      return token;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      console.error('Firebase messaging not initialized');
      resolve(null);
      return;
    }
    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
