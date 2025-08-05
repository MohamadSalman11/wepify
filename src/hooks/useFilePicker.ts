import { ElementsName } from '@shared/constants';
import type { InputChangeEvent } from '@shared/typing';
import { createElement, useMemo, useRef } from 'react';

interface Options {
  accept?: string;
  onSelect: (file: File) => void;
}

export const useFilePicker = ({ accept = '*', onSelect }: Options) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const input = useMemo(
    () =>
      createElement(ElementsName.Input, {
        type: 'file',
        accept,
        ref: inputRef,
        style: { display: 'none' },
        onChange: (event: InputChangeEvent) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) onSelect(file);
        }
      }),
    [accept, onSelect]
  );

  return { input, openFilePicker };
};
