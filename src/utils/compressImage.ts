import imageCompression from 'browser-image-compression';
import { AppToast } from '../utils/appToast';

const MESSAGE_FAILED = 'Failed to process image';

const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  useWebWorker: true,
  fileType: 'image/webp',
  initialQuality: 0.9
};

export const compressImage = async (file: File): Promise<File | null> => {
  try {
    return await imageCompression(file, IMAGE_COMPRESSION_OPTIONS);
  } catch {
    AppToast.error(MESSAGE_FAILED);
    return null;
  }
};
