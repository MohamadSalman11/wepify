import type { InputChangeEvent } from '../../../types';
import { useAddElementToPage } from './useAddElementToPage';

export const useImageUpload = () => {
  const { addElementToPage } = useAddElementToPage();

  const handleImageUpload = (event: InputChangeEvent) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      addElementToPage('image', { src: reader.result });
    });

    reader.readAsDataURL(file);
  };

  return { handleImageUpload };
};
