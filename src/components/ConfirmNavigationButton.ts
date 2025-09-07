import { cloneElement, MouseEvent, ReactElement } from 'react';
import { MESSAGE_UNSAVED_CHANGES } from '../constant';
import { useAppSelector } from '../store';

/**
 * Types
 */

interface ConfirmNavigationProps {
  children: ReactElement<{ onClick?: (event: MouseEvent<any>) => void }>;
  onConfirmed: () => void;
}

/**
 * Component definition
 */

export function ConfirmNavigation({ children, onConfirmed }: ConfirmNavigationProps) {
  const storing = useAppSelector((state) => state.editor.storing);

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (storing) {
      const confirmed = globalThis.confirm(MESSAGE_UNSAVED_CHANGES);
      if (!confirmed) return;
    }

    onConfirmed();
  };

  return cloneElement(children, {
    onClick: handleClick
  });
}
