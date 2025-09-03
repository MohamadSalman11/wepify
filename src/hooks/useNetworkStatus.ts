import { useEffect, useState } from 'react';
import { ToastMessages } from '../constant';
import { AppToast } from '../utils/appToast';

export const useNetworkStatus = (showToast = true) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);

      if (showToast) {
        AppToast.error(ToastMessages.network.offline);
      }
    };

    const handleOnline = () => {
      setIsOnline(true);

      if (showToast) {
        AppToast.success(ToastMessages.network.online);
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
