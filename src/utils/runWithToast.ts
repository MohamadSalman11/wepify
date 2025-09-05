import toast, { Renderable } from 'react-hot-toast';
import { ToastMessages } from '../constant';
import { AppToast } from './appToast';

type RunWithToastProps<T> = {
  startMessage: string;
  successMessage: string;
  errorMessage?: string;
  icon?: Renderable;
  delay?: number;
  onExecute: () => void;
  onSuccess?: (result: T) => void;
  onFinally?: () => void;
};

export const runWithToast = async <T>({
  startMessage,
  successMessage,
  errorMessage = ToastMessages.error,
  icon,
  delay = 1000,
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
      AppToast.success(successMessage);
      onSuccess?.(result);
    }, delay);
  } catch {
    setTimeout(() => {
      AppToast.error(errorMessage);
    }, delay);
  } finally {
    setTimeout(() => {
      AppToast.dismiss(toastId);
      onFinally?.();
    }, delay);
  }
};
