import { UNSAVED_CHANGES_MESSAGE } from '@shared/constants';
import React, { ReactElement } from 'react';
import { useAppSelector } from '../store';

interface ConfirmNavigationProps {
  children: ReactElement;
  onConfirmed: () => void;
}

export function ConfirmNavigation({ children, onConfirmed }: ConfirmNavigationProps) {
  const isStoring = useAppSelector((state) => state.editor.isStoring);

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isStoring) {
      const confirmed = globalThis.confirm(UNSAVED_CHANGES_MESSAGE);
      if (!confirmed) return;
    }

    onConfirmed();
  };

  return React.cloneElement(children, {
    onClick: handleClick
  });
}
