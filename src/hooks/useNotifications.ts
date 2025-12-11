import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const notify = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      try {
        new Notification(title, options);
      } catch (e) {
        console.error("Notification failed", e);
      }
    } else if (permission !== 'denied') {
      requestPermission().then(res => {
        if (res === 'granted') {
          new Notification(title, options);
        }
      });
    }
  };

  return { permission, requestPermission, notify };
};
