import {
  cloneElement,
  createContext,
  useContext,
  useRef,
  useState,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  type RefObject
} from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setModalIsOpen } from '../features/dashboard/slices/dashboardSlice';
import useOutsideClick from '../hooks/useOutsideClick';

/**
 * Styles
 */

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledDialog = styled.div`
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: 2.4rem;
  width: 30rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  row-gap: 1.2rem;

  h3 {
    margin-bottom: 1.2rem;
    font-size: 1.6rem;
  }
`;

/**
 * types
 */

interface ModalContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  overlayRef: RefObject<HTMLDivElement | null>;
  toggleRef: RefObject<HTMLElement | null>;
}

type ClickableElement = ReactElement<{
  onClick?: MouseEventHandler;
  onCloseModal?: () => void;
  ref: RefObject<HTMLElement | null>;
}>;

export type OnCloseModal = () => void;

/**
 * Context
 */

const ModalContext = createContext<ModalContextType | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Modal components must be used within <Modal>');
  return context;
};

/**
 * Component definition
 */

function Modal({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLElement>(null);

  return <ModalContext.Provider value={{ isOpen, setIsOpen, overlayRef, toggleRef }}>{children}</ModalContext.Provider>;
}

function Open({ children }: { children: ClickableElement }) {
  const { setIsOpen, toggleRef } = useModalContext();
  const dispatch = useDispatch();

  return cloneElement(children, {
    ref: toggleRef,
    onClick: () => {
      setIsOpen(true);
      dispatch(setModalIsOpen(true));
    }
  });
}

function Close({ children }: { children: ClickableElement }) {
  const { setIsOpen } = useModalContext();

  return cloneElement(children, {
    onClick: () => setIsOpen(false)
  });
}

function Window({ children }: { children: ReactNode }) {
  const { isOpen, overlayRef } = useModalContext();

  if (!isOpen) return null;

  return createPortal(
    <ModalOverlay onClick={(event) => event.stopPropagation()} ref={overlayRef}>
      {children}
    </ModalOverlay>,
    document.body
  );
}

function Dialog({ children, title }: { children: ClickableElement; title: string }) {
  const { setIsOpen, overlayRef, toggleRef } = useModalContext();
  const dialogRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false), overlayRef, toggleRef);

  return (
    <StyledDialog ref={dialogRef}>
      <h3>{title}</h3>
      {cloneElement(children, {
        onCloseModal: () => setIsOpen(false)
      })}
    </StyledDialog>
  );
}

Modal.open = Open;
Modal.close = Close;
Modal.window = Window;
Modal.dialog = Dialog;

export default Modal;
