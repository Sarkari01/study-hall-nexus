
import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '@/config/firebase';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeFCM = async () => {
      const token = await requestNotificationPermission();
      if (token) {
        setFcmToken(token);
        // Store token in database for user
        console.log('FCM Token stored:', token);
      }
    };

    initializeFCM();

    const unsubscribe = onMessageListener().then((payload: any) => {
      toast({
        title: payload.notification?.title || 'New Notification',
        description: payload.notification?.body || 'You have a new message',
      });
    });

    return () => {
      unsubscribe;
    };
  }, [toast]);

  return { fcmToken };
};
