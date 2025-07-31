import { RefObject, useEffect } from 'react';
import { isTyping } from '../utils/isTyping';

const KEY_DELETE_ELEMENT = 'Backspace';

interface UseDeleteKeyHandlerParams {
  iframeRef?: RefObject<HTMLIFrameElement | null>;
  onDelete: () => void;
}

export const useDeleteKeyHandler = ({ iframeRef, onDelete }: UseDeleteKeyHandlerParams) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEY_DELETE_ELEMENT && (iframeRef ? !isTyping(iframeRef) : true)) {
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
};
