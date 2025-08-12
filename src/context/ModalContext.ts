import { createContext, useContext } from 'react';

interface ModalContext {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

export const ModalContext = createContext<ModalContext | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Modal components must be used within <Modal>');
  return context;
};
