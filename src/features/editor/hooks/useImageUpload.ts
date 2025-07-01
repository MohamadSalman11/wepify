import type { InputChangeEvent } from '@shared/types';
import toast from 'react-hot-toast';
import { TOAST_DURATION } from '../../../constant';

const MAX_SIZE_IN_BYTES = 2 * 1024 * 1024;

export const useImageUpload = (
  onLoaded: (result: FileReader['result']) => void,
  onError?: (message: string) => void
) => {
  const handleImageUpload = (event: InputChangeEvent) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_IN_BYTES) {
      const errorMessage = 'Image size should not exceed 2MB';
      toast.error(errorMessage, { duration: TOAST_DURATION });
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      onLoaded(reader.result);
      event.target.value = '';
    });
    reader.addEventListener('error', () => {
      const errorMessage = 'Failed to read image file';
      onError?.(errorMessage);
      toast.error(errorMessage, { duration: TOAST_DURATION });
      event.target.value = '';
    });

    reader.readAsDataURL(file);
  };

  return handleImageUpload;
};
