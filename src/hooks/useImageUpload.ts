import imageCompression from 'browser-image-compression';
import { AppToast } from '../utils/appToast';

const MAX_SIZE_IN_BYTES = 1 * 1024 * 1024;
const MESSAGE_SIZE_EXCEED = 'Image size should not exceed 1MB';
const MESSAGE_FAILED = 'Failed to read image file';

export const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  useWebWorker: true,
  fileType: 'image/webp',
  initialQuality: 0.9
};

export const useImageUpload = (onLoaded: (result: Blob) => void, onError?: (message: string) => void) => {
  const handleImageUpload = async (file: File) => {
    if (file.size > MAX_SIZE_IN_BYTES) {
      onError?.(MESSAGE_SIZE_EXCEED);
      return;
    }

    try {
      const compressedBlob = await imageCompression(file, IMAGE_COMPRESSION_OPTIONS);
      onLoaded(compressedBlob);
    } catch {
      onError?.(MESSAGE_FAILED);
      AppToast.error(MESSAGE_FAILED);
    }
  };

  return handleImageUpload;
};
