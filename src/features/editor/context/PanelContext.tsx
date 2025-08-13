import { createContext, ReactNode, useContext, useState } from 'react';

interface PanelContext {
  leftPanelOpen: boolean;
  setLeftPanelOpen: (val: boolean) => void;
}

const PanelContext = createContext<PanelContext | null>(null);

export const PanelProvider = ({ children }: { children: ReactNode }) => {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);

  return <PanelContext.Provider value={{ leftPanelOpen, setLeftPanelOpen }}>{children}</PanelContext.Provider>;
};

export const usePanel = () => {
  const context = useContext(PanelContext);
  if (!context) throw new Error('usePanel must be used within a <PanelProvider>');
  return context;
};
