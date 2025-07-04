import { createContext, useContext, type RefObject } from 'react';
import type { useIframeConnection } from '../features/editor/hooks/useIframeConnection';

type IframeContext = {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  iframeConnection: ReturnType<typeof useIframeConnection>;
};

export const IframeContext = createContext<IframeContext | null>(null);

export const useIframeContext = () => {
  const context = useContext(IframeContext);
  if (!context) throw new Error('useIframeContext must be used inside <IframeContext.Provider>');
  return context;
};
