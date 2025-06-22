import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
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

const StyledDropdown = styled.ul<{
  shouldHide: boolean;
  top: number;
  left: number;
  translateX?: number;
  translateY?: number;
}>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  width: 20rem;
  font-size: 1.4rem;
  border-radius: var(--border-radius-sm);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  overflow: hidden;
  z-index: 999;
  background-color: var(--color-white);
  transform: translate(${(props) => props.translateX ?? 0}%, ${(props) => props.translateY ?? 0}%);

  ${(props) =>
    props.shouldHide &&
    `
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    `}

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
  if (!context) throw new Error('Modal components must be used within <Dropdown>');
  return context;
};

/**
 * Component definition
 */

function Dropdown({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLElement>(null);

  return <DropdownContext.Provider value={{ setIsOpen, isOpen, toggleRef }}>{children}</DropdownContext.Provider>;
}

function Open({ children }: { children: ClickableElement }) {
  const { setIsOpen, toggleRef } = useDropdownContext();
  const dispatch = useDispatch();

  return cloneElement(children, {
    ref: toggleRef,
    onClick: () => {
      dispatch(setModalIsOpen(false));
      setIsOpen(true);
    }
  });
}

function Drop({
  children,
  translateX = 0,
  translateY = 0,
  shouldHide
}: {
  children: ReactNode;
  translateX?: number;
  translateY?: number;
  shouldHide: boolean;
}) {
  const { isOpen, setIsOpen, toggleRef } = useDropdownContext();
  const dropdownRef = useOutsideClick<HTMLUListElement>(() => setIsOpen(false), undefined, toggleRef);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  }, [isOpen, toggleRef]);

  if (!isOpen) return null;

  const childrenWithOnClick = Children.map(children, (child) => {
    return cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        if (child.props.onClick) child.props.onClick(e);
        setIsOpen(false);
      }
    });
  });

  return createPortal(
    <StyledDropdown
      ref={dropdownRef}
      top={position.top}
      left={position.left}
      shouldHide={shouldHide}
      translateX={translateX}
      translateY={translateY}
    >
      {childrenWithOnClick}
    </StyledDropdown>,
    document.body
  );
}

Dropdown.open = Open;
Dropdown.drop = Drop;

export default Dropdown;
