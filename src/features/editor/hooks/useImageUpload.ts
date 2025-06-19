import toast from 'react-hot-toast';
import { TOAST_DURATION } from '../../../constant';
import type { InputChangeEvent } from '../../../types';
import { useAddElementToPage } from './useAddElementToPage';

const MAX_SIZE_IN_BYTES = 2 * 1024 * 1024;

export const useImageUpload = () => {
  const { addElementToPage } = useAddElementToPage();

  const handleImageUpload = (event: InputChangeEvent) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_IN_BYTES) {
      toast.error('Image size should not exceed 2MB', { duration: TOAST_DURATION });
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      addElementToPage('image', { src: reader.result });
      event.target.value = '';
    });

    reader.readAsDataURL(file);
  };

  return { handleImageUpload };
};
