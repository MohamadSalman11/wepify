import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TOAST_DURATION, ToastMessages } from '../constant';

export const useNetworkStatus = (showToast = true) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);

      if (showToast) {
        toast.error(ToastMessages.network.offline, { duration: TOAST_DURATION });
      }
    };

    const handleOnline = () => {
      setIsOnline(true);

      if (showToast) {
        toast.success(ToastMessages.network.online, { duration: TOAST_DURATION });
      }
    };

    globalThis.addEventListener('offline', handleOffline);
    globalThis.addEventListener('online', handleOnline);

    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      globalThis.removeEventListener('offline', handleOffline);
      globalThis.removeEventListener('online', handleOnline);
    };
  }, [showToast]);

  return isOnline;
};
