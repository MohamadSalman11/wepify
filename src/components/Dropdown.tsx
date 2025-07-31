import {
  cloneElement,
  createContext,
  MouseEvent,
  useContext,
  useLayoutEffect,
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

/**
 * Constants
 */

const DEFAULT_TRANSLATE_X = 0;
const DEFAULT_TRANSLATE_Y = 0;

/**
 * Types
 */

type ClickableElement = ReactElement<{ onClick?: MouseEventHandler; ref: RefObject<HTMLElement | null> }>;

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleRef: RefObject<HTMLElement | null>;
}

interface Position {
  top: number;
  left: number;
}

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

  return <DropdownContext.Provider value={{ setIsOpen, isOpen, toggleRef }}>{children}</DropdownContext.Provider>;
}

function Open({ children }: { children: ClickableElement }) {
  const { setIsOpen, toggleRef } = useDropdownContext();

  return cloneElement(children, {
    ref: toggleRef,
    onClick: () => setIsOpen(true)
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
  const { isOpen, setIsOpen, toggleRef } = useDropdownContext();
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const dropdownRef = useOutsideClick<HTMLUListElement>(() => setIsOpen(false), undefined, toggleRef);

  useLayoutEffect(() => {
    if (!isOpen || !dropdownRef.current) return;

    const toggleRect = toggleRef.current?.getBoundingClientRect();
    const dropdownRect = dropdownRef.current?.getBoundingClientRect();
    if (!toggleRect || !dropdownRect) return;

    const dropdownHeight = dropdownRect.height;
    const bottomSpace = window.innerHeight - toggleRect.bottom;

    const top =
      bottomSpace < dropdownHeight
        ? toggleRect.top + window.scrollY - (dropdownHeight - bottomSpace)
        : toggleRect.bottom + window.scrollY;

    setPosition({ top, left: toggleRect.left + window.scrollX });
  }, [isOpen, dropdownRef, toggleRef]);

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
  onClick?: (event?: MouseEventHandler) => void;
}) {
  const { setIsOpen } = useDropdownContext();

  const handleClick = (event: MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();
    onClick?.();
    setIsOpen(false);
  };

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
  $position: Position | null;
  $translateX?: number;
  $translateY?: number;
}>`
  position: fixed;
  top: ${(props) => props.$position?.top}px;
  left: ${(props) => props.$position?.left}px;
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
      background-color: var(--color-gray-light-4);
    }

    svg {
      font-size: 1.8rem;
    }
  }
`;
