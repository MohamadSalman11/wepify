import toast, { Renderable } from 'react-hot-toast';
import { ToastMessages } from '../constant';

type RunWithToastProps<T> = {
  startMessage: string;
  successMessage: string;
  errorMessage?: string;
  icon?: Renderable;
  delay?: number;
  onExecute: () => Promise<T>;
  onSuccess?: (result: T) => void;
  onFinally?: () => void;
};

export const runWithToast = async <T>({
  startMessage,
  successMessage,
  errorMessage = ToastMessages.error,
  icon,
  delay = 0,
  onExecute,
  onSuccess,
  onFinally
}: RunWithToastProps<T>): Promise<void> => {
  const toastId = toast(startMessage, {
    icon,
    duration: Infinity
  });

  try {
    const result = await onExecute();
    setTimeout(() => {
      toast.success(successMessage);
      onSuccess?.(result);
    }, delay);
  } catch {
    setTimeout(() => {
      toast.error(errorMessage);
    }, delay);
  } finally {
    setTimeout(() => {
      toast.dismiss(toastId);
      onFinally?.();
    }, delay);
  }
};
