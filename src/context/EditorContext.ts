import { createContext, useContext, type RefObject } from 'react';
import type { useIframeConnection } from '../features/editor/hooks/useIframeConnection';

type EditorContextType = {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  iframeConnection: ReturnType<typeof useIframeConnection>;
  isPreview: boolean;
};

export const EditorContext = createContext<EditorContextType | null>(null);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditorContext must be used inside <EditorContext.Provider>');
  return context;
};
