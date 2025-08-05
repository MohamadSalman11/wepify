import { UNSAVED_CHANGES_MESSAGE } from '@shared/constants';
import { cloneElement, DOMAttributes, MouseEvent, ReactElement } from 'react';
import { useAppSelector } from '../store';

/**
 * Types
 */

interface ConfirmNavigationProps {
  children: ReactElement;
  onConfirmed: () => void;
}

/**
 * Component definition
 */

export default function ConfirmNavigation({ children, onConfirmed }: ConfirmNavigationProps) {
  const isStoring = useAppSelector((state) => state.editor.isStoring);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isStoring) {
      const confirmed = globalThis.confirm(UNSAVED_CHANGES_MESSAGE);
      if (!confirmed) return;
    }

    onConfirmed();
  };

  return cloneElement(children, {
    onClick: handleClick
  } as DOMAttributes<any>);
}
