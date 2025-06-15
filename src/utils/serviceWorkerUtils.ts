
export const updateServiceWorkerConfig = () => {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  // Check if all required config is available
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

  if (missingKeys.length > 0) {
    console.warn('Cannot update service worker - missing Firebase config:', missingKeys);
    return false;
  }

  // Read the service worker template and replace placeholders
  fetch('/firebase-messaging-sw.js')
    .then(response => response.text())
    .then(swContent => {
      const updatedContent = swContent
        .replace('{{FIREBASE_API_KEY}}', firebaseConfig.apiKey)
        .replace('{{FIREBASE_AUTH_DOMAIN}}', firebaseConfig.authDomain)
        .replace('{{FIREBASE_PROJECT_ID}}', firebaseConfig.projectId)
        .replace('{{FIREBASE_STORAGE_BUCKET}}', firebaseConfig.storageBucket)
        .replace('{{FIREBASE_MESSAGING_SENDER_ID}}', firebaseConfig.messagingSenderId)
        .replace('{{FIREBASE_APP_ID}}', firebaseConfig.appId);

      // Create a blob and register the service worker
      const swBlob = new Blob([updatedContent], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(swBlob);
      
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Service worker registered successfully:', registration);
        })
        .catch(error => {
          console.error('Service worker registration failed:', error);
        });
    })
    .catch(error => {
      console.error('Failed to fetch service worker template:', error);
    });

  return true;
};
