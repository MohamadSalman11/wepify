import {
  cloneElement,
  createContext,
  useContext,
  useState,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode
} from 'react';
import { createPortal } from 'react-dom';
import { LuX } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setModalIsOpen } from '../features/dashboard/slices/dashboardSlice';
import Icon from './Icon';

/**
 * types
 */

interface ModalContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

type ClickableElement = ReactElement<{
  onClick?: MouseEventHandler;
  onCloseModal?: () => void;
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

export function Modal({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return <ModalContext.Provider value={{ isOpen, setIsOpen }}>{children}</ModalContext.Provider>;
}

function Open({ children }: { children: ClickableElement }) {
  const { setIsOpen } = useModalContext();
  const dispatch = useDispatch();

  return cloneElement(children, {
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
  const { isOpen } = useModalContext();

  if (!isOpen) return null;

  return createPortal(
    <ModalOverlay onClick={(event) => event.stopPropagation()}>{children}</ModalOverlay>,
    document.body
  );
}

function Dialog({ children, title }: { children: ClickableElement; title: string }) {
  const { setIsOpen } = useModalContext();

  return (
    <StyledDialog>
      <DialogHeader>
        <h3>{title}</h3>
        <Icon onClick={() => setIsOpen(false)} icon={LuX} hover={true} />
      </DialogHeader>
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

/**
 * Styles
 */

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--box-shadow);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--zindex-modal);
`;

const StyledDialog = styled.div`
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: 2.4rem;
  width: 35rem;
  box-shadow: var(--box-shadow);
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  row-gap: 1.2rem;
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;

  h3 {
    font-size: 1.6rem;
  }

  span {
    transform: translateY(-2px);
  }
`;
