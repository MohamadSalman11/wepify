import { AppToast } from '../utils/appToast';
import { compressImage } from './compressImage';

const MESSAGE_FAILED = 'Failed to process image';

export const base64ToFile = async (base64: string, mimeType = 'image/png'): Promise<File | null> => {
  try {
    const byteString = atob(base64);
    const arrayBuffer = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.codePointAt(i)!;
    }
    const file = new File([arrayBuffer], `image.${mimeType.split('/')[1]}`, { type: mimeType });
    return await compressImage(file);
  } catch {
    AppToast.error(MESSAGE_FAILED);
    return null;
  }
};
