import toast from 'react-hot-toast';
import { TOAST_DURATION } from '../../../constant';

const MAX_SIZE_IN_BYTES = 1 * 1024 * 1024;
const MESSAGE_SIZE_EXCEED = 'Image size should not exceed 1MB';
const MESSAGE_FAILED = 'Failed to read image file';

export const useImageUpload = (
  onLoaded: (result: FileReader['result']) => void,
  onError?: (message: string) => void
) => {
  const handleImageUpload = (file: File) => {
    if (file.size > MAX_SIZE_IN_BYTES) {
      toast.error(MESSAGE_SIZE_EXCEED, { duration: TOAST_DURATION });
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      onLoaded(reader.result);
    });

    reader.addEventListener('error', () => {
      onError?.(MESSAGE_FAILED);
      toast.error(MESSAGE_FAILED, { duration: TOAST_DURATION });
    });

    reader.readAsDataURL(file);
  };

  return handleImageUpload;
};
