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
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setModalIsOpen } from '../features/dashboard/slices/dashboardSlice';
import useOutsideClick from '../hooks/useOutsideClick';

/**
 * Styles
 */

const StyledDropdown = styled.ul<{ top?: number; shouldHide: boolean }>`
  position: absolute;
  ${(props) => (props.top === undefined ? 'left: 0;' : 'right: 0;')}
  ${(props) => props.top !== undefined && `top: ${props.top}px;`}
  width: 20rem;
  font-size: 1.4rem;
  border-radius: var(--border-radius-sm);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  overflow: hidden;
  z-index: 999;
  background-color: var(--color-white);

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

function Drop({ children, top, shouldHide }: { children: ReactNode; top?: number; shouldHide: boolean }) {
  const { isOpen, setIsOpen, toggleRef } = useDropdownContext();
  const dropdownRef = useOutsideClick<HTMLUListElement>(() => setIsOpen(false), undefined, toggleRef);

  if (!isOpen) return null;

  return (
    <StyledDropdown ref={dropdownRef} top={top} shouldHide={shouldHide}>
      {children}
    </StyledDropdown>
  );
}

Dropdown.open = Open;
Dropdown.drop = Drop;

export default Dropdown;
