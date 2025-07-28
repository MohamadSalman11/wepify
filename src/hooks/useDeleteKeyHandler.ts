import { RefObject, useEffect } from 'react';
import { isTyping } from '../utils/isTyping';

const DELETE_KEY = 'Backspace';

interface UseDeleteKeyHandlerParams {
  iframeRef?: RefObject<HTMLIFrameElement | null>;
  onDelete: () => void;
}

export function useDeleteKeyHandler({ iframeRef, onDelete }: UseDeleteKeyHandlerParams) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === DELETE_KEY && (iframeRef ? !isTyping(iframeRef) : true)) {
        onDelete();
      }
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
}
