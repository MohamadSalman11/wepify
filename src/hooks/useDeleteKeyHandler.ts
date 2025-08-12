import { RefObject, useEffect } from 'react';
import { isTyping } from '../utils/isTyping';

const KEY_DELETE_ELEMENT = 'Backspace';

interface UseDeleteKeyHandlerProps {
  iframeRef?: RefObject<HTMLIFrameElement | null>;
  onDelete: () => void;
}

export const useDeleteKeyHandler = ({ iframeRef, onDelete }: UseDeleteKeyHandlerProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const canDelete = iframeRef ? !isTyping(iframeRef) : true;

      if (event.key === KEY_DELETE_ELEMENT && canDelete) onDelete();
    };

    document.addEventListener('keydown', handleKeyDown);

    const iframeDoc = iframeRef?.current?.contentWindow;

    if (iframeDoc) {
      iframeDoc.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      if (iframeDoc) {
        iframeDoc.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [onDelete, iframeRef]);
};
