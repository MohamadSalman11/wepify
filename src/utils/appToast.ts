import { toast, ToastOptions } from 'react-hot-toast';

const DEFAULT_OPTIONS: ToastOptions = {
  duration: 3000,
  position: 'top-center'
};

export const AppToast = {
  success(message: string, options?: ToastOptions) {
    AppToast.dismiss();
    toast.success(message, { ...DEFAULT_OPTIONS, ...options });
  },
  error(message: string, options?: ToastOptions) {
    AppToast.dismiss();
    toast.error(message, { ...DEFAULT_OPTIONS, ...options });
  },
  custom(message: string, options?: ToastOptions) {
    AppToast.dismiss();
    toast(message, { ...DEFAULT_OPTIONS, ...options });
  },
  dismiss(id?: string) {
    toast.dismiss(id);
  }
};
