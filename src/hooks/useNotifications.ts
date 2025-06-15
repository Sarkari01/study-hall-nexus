
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { requestNotificationPermission, onMessageListener } from '@/config/firebase';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    const initializeFCM = async () => {
      try {
        // Check if the browser supports notifications
        if (!('Notification' in window)) {
          console.warn('This browser does not support notifications');
          return;
        }

        // Check current permission status
        setNotificationPermission(Notification.permission);

        // Only proceed if permission is granted or default
        if (Notification.permission === 'denied') {
          console.warn('Notification permission denied');
          return;
        }

        // Request permission and get FCM token
        const token = await requestNotificationPermission();
        if (token) {
          setFcmToken(token);
          console.log('FCM Token obtained:', token);
        }
      } catch (error) {
        console.error('Error initializing FCM:', error);
        // Don't show toast for FCM initialization errors as they're not critical
      }
    };

    initializeFCM();
  }, []);

  useEffect(() => {
    const setupMessageListener = async () => {
      try {
        // Only set up listener if FCM is properly initialized
        if (!fcmToken) return;

        const unsubscribe = await onMessageListener();
        
        return unsubscribe;
      } catch (error) {
        console.error('Error setting up message listener:', error);
      }
    };

    let unsubscribe: (() => void) | undefined;

    setupMessageListener().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fcmToken, toast]);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        const token = await requestNotificationPermission();
        if (token) {
          setFcmToken(token);
          toast({
            title: "Notifications enabled",
            description: "You will now receive push notifications",
          });
        }
      } else {
        toast({
          title: "Notifications disabled",
          description: "Please enable notifications in your browser settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Error",
        description: "Failed to enable notifications",
        variant: "destructive"
      });
    }
  };

  const showNotification = (title: string, body: string, icon?: string) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: false,
        silent: false
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    }
  };

  return {
    fcmToken,
    notificationPermission,
    requestPermission,
    showNotification,
    isSupported: 'Notification' in window
  };
};
