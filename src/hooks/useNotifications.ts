
import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '@/config/firebase';
import { useToast } from '@/hooks/use-toast';
import { updateServiceWorkerConfig } from '@/utils/serviceWorkerUtils';
import { supabase } from '@/integrations/supabase/client';

export const useNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeFCM = async () => {
      try {
        // Check if Firebase is supported
        if (!('Notification' in window)) {
          console.log('This browser does not support notifications');
          return;
        }

        setIsSupported(true);
        
        // Update service worker with actual config
        updateServiceWorkerConfig();
        
        const token = await requestNotificationPermission();
        if (token) {
          setFcmToken(token);
          console.log('FCM Token stored:', token);
          
          // Store token in database
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('user_notification_tokens')
              .upsert({
                user_id: user.id,
                fcm_token: token,
                device_type: 'web',
                is_active: true,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id,fcm_token'
              });
          }
        }
      } catch (error) {
        console.error('Error initializing FCM:', error);
        toast({
          title: "Notification Setup Error",
          description: "Unable to initialize push notifications. Please check your Firebase configuration.",
          variant: "destructive",
        });
      }
    };

    initializeFCM();

    // Set up message listener
    const setupMessageListener = async () => {
      try {
        const unsubscribe = await onMessageListener();
        if (unsubscribe && typeof unsubscribe === 'object' && 'notification' in unsubscribe) {
          const payload = unsubscribe as any;
          toast({
            title: payload.notification?.title || 'New Notification',
            description: payload.notification?.body || 'You have a new message',
          });
        }
      } catch (error) {
        console.error('Error setting up message listener:', error);
      }
    };

    if (isSupported) {
      setupMessageListener();
    }
  }, [toast, isSupported]);

  return { fcmToken, isSupported };
};
