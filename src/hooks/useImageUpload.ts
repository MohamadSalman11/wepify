import { compressImage } from '../utils/compressImage';

const MAX_SIZE_IN_BYTES = 1 * 1024 * 1024;
const MESSAGE_SIZE_EXCEED = 'Image size should not exceed 1MB';
const MESSAGE_FAILED = 'Failed to read image file';

export const useImageUpload = (onLoaded: (result: File) => void, onError?: (message: string) => void) => {
  const handleImageUpload = async (file: File) => {
    if (file.size > MAX_SIZE_IN_BYTES) {
      onError?.(MESSAGE_SIZE_EXCEED);
      return;
    }

    const compressedFile = await compressImage(file);

    if (!compressedFile) {
      onError?.(MESSAGE_FAILED);
      return;
    }

    onLoaded(compressedFile);
  };

  return handleImageUpload;
};
