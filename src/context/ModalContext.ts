import { createContext, useContext } from 'react';

interface ModalContextType {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Modal components must be used within <Modal>');
  return context;
};
