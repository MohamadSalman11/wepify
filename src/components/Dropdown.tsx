import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
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
import styled, { css } from 'styled-components';
import { setModalIsOpen } from '../features/dashboard/slices/dashboardSlice';
import useOutsideClick from '../hooks/useOutsideClick';

const DEFAULT_TRANSLATE_X = 0;
const DEFAULT_TRANSLATE_Y = 0;

/**
 * Styles
 */

const StyledDropdown = styled.ul<{
  $isHidden: boolean;
  $top: number;
  $left: number;
  $translateX?: number;
  $translateY?: number;
}>`
  position: absolute;
  top: ${(props) => props.$top}px;
  left: ${(props) => props.$left}px;
  width: 20rem;
  font-size: 1.4rem;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  z-index: var(--zindex-base);
  background-color: var(--color-white);
  transform: translate(${(props) => props.$translateX ?? 0}%, ${(props) => props.$translateY ?? 0}%);

  ${(props) =>
    props.$isHidden &&
    css`
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
  if (!context) throw new Error('Dropdown components must be used within <Dropdown>');
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
  isHidden = false,
  translateX = DEFAULT_TRANSLATE_X,
  translateY = DEFAULT_TRANSLATE_Y
}: {
  children: ReactNode;
  isHidden?: boolean;
  translateX?: number;
  translateY?: number;
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
    if (!isValidElement(child)) return child;

    const typedChild = child as ReactElement<any>;
    const originalOnClick = typedChild.props?.onClick;

    const handleClick = (event: MouseEvent) => {
      if (typeof originalOnClick === 'function') {
        originalOnClick(event);
      }
      setIsOpen(false);
    };

    return cloneElement(typedChild, { onClick: handleClick });
  });

  return createPortal(
    <StyledDropdown
      ref={dropdownRef}
      $top={position.top}
      $left={position.left}
      $isHidden={isHidden}
      $translateX={translateX}
      $translateY={translateY}
    >
      {childrenWithOnClick}
    </StyledDropdown>,
    document.body
  );
}

Dropdown.open = Open;
Dropdown.drop = Drop;

export default Dropdown;
