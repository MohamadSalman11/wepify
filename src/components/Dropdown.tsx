import {
  cloneElement,
  createContext,
  MouseEvent,
  useContext,
  useRef,
  useState,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  type RefObject
} from 'react';
import { createPortal } from 'react-dom';
import type { IconType } from 'react-icons';
import styled from 'styled-components';
import useOutsideClick from '../hooks/useOutsideClick';
import Icon from './Icon';

const DEFAULT_TRANSLATE_X = 0;
const DEFAULT_TRANSLATE_Y = 0;

/**
 * Types
 */

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleRef: RefObject<HTMLElement | null>;
}

type ClickableElement = ReactElement<{ onClick?: MouseEventHandler; ref: RefObject<HTMLElement | null> }>;

/**
 * Context
 */

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('Dropdown components must be used within <Dropdown>');
  return context;
};

/**
 * Component definition
 */

export default function Dropdown({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState(null);

  return (
    <DropdownContext.Provider value={{ setIsOpen, isOpen, toggleRef, position, setPosition }}>
      {children}
    </DropdownContext.Provider>
  );
}

function Open({ children }: { children: ClickableElement }) {
  const { setIsOpen, toggleRef, setPosition } = useDropdownContext();

  return cloneElement(children, {
    ref: toggleRef,
    onClick: () => {
      const rect = toggleRef.current?.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });

      setIsOpen(true);
    }
  });
}

function Drop({
  children,
  translateX = DEFAULT_TRANSLATE_X,
  translateY = DEFAULT_TRANSLATE_Y
}: {
  children: ReactNode;
  translateX?: number;
  translateY?: number;
}) {
  const { isOpen, setIsOpen, toggleRef, position } = useDropdownContext();
  const dropdownRef = useOutsideClick<HTMLUListElement>(() => setIsOpen(false), undefined, toggleRef);

  if (!isOpen) return null;

  return createPortal(
    <StyledDropdown ref={dropdownRef} $position={position} $translateX={translateX} $translateY={translateY}>
      {children}
    </StyledDropdown>,
    document.body
  );
}

function Button({
  children,
  icon,
  onClick,
  ...props
}: {
  children: ReactNode;
  icon: IconType;
  onClick?: (event?: any) => void;
}) {
  const { setIsOpen } = useDropdownContext();

  function handleClick(event: MouseEvent<HTMLLIElement>) {
    event.stopPropagation();
    onClick?.();
    setIsOpen(false);
  }

  return (
    <li onClick={handleClick} {...props}>
      <Icon size='md' icon={icon} /> {children}
    </li>
  );
}

Dropdown.Open = Open;
Dropdown.Drop = Drop;
Dropdown.Button = Button;

/**
 * Styles
 */

const StyledDropdown = styled.ul<{
  $position: Record<string, any>;
  $translateX?: number;
  $translateY?: number;
}>`
  position: fixed;
  top: ${(props) => props.$position.top}px;
  left: ${(props) => props.$position.left}px;
  width: 20rem;
  font-size: 1.4rem;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  z-index: var(--zindex-base);
  background-color: var(--color-white);
  transform: translate(${(props) => props.$translateX ?? 0}%, ${(props) => props.$translateY ?? 0}%);

  li {
    display: flex;
    column-gap: 1.2rem;
    align-items: center;
    cursor: pointer;
    padding: 1.2rem;
    width: 100%;

    &:hover {
      background-color: var(--color-gray-light-3);
    }

    svg {
      font-size: 1.7rem;
    }
  }
`;
