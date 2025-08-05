import { cloneElement, useState, type MouseEventHandler, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { LuX } from 'react-icons/lu';
import styled from 'styled-components';
import { ModalContext, useModalContext } from '../context/ModalContext';
import Icon from './Icon';

/**
 * types
 */

type ClickableElement = ReactElement<{
  onClick?: MouseEventHandler;
  onCloseModal?: () => void;
}>;

export type OnCloseModal = () => void;

/**
 * Component definition
 */

export default function Modal({ children }: { children: ReactNode }) {
  const [openName, setOpenName] = useState('');

  const close = () => setOpenName('');
  const open = setOpenName;

  return <ModalContext.Provider value={{ openName, close, open }}>{children}</ModalContext.Provider>;
}

function Open({ children, openName }: { children: ClickableElement; openName: string }) {
  const { open } = useModalContext();

  return cloneElement(children, {
    onClick: () => open(openName)
  });
}

function Close({ children }: { children: ClickableElement }) {
  const { close } = useModalContext();

  return cloneElement(children, {
    onClick: close
  });
}

function Window({ children, name }: { children: ReactNode; name: string }) {
  const { openName } = useModalContext();

  if (name !== openName) return null;

  return createPortal(
    <ModalOverlay key='modal-overlay' onClick={(event) => event.stopPropagation()}>
      {children}
    </ModalOverlay>,
    document.body
  );
}

function Dialog({ children, title }: { children: ClickableElement; title: string }) {
  const { close } = useModalContext();

  return (
    <StyledDialog>
      <DialogHeader>
        <h3>{title}</h3>
        <Icon onClick={close} icon={LuX} hover={true} />
      </DialogHeader>
      {cloneElement(children, {
        onCloseModal: close
      })}
    </StyledDialog>
  );
}

Modal.Open = Open;
Modal.Close = Close;
Modal.Window = Window;
Modal.Dialog = Dialog;

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
    font-weight: var(--font-weight-regular);
    font-size: 1.6rem;
  }

  span {
    transform: translateY(-2px);
  }
`;
