import { cloneElement, DOMAttributes, MouseEvent, ReactElement } from 'react';
import { MESSAGE_UNSAVED_CHANGES } from '../constant';
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

    if (isStoring && !globalThis.confirm(MESSAGE_UNSAVED_CHANGES)) {
      return;
    }

    onConfirmed();
  };

  return cloneElement(children, {
    onClick: handleClick
  } as DOMAttributes<any>);
}
