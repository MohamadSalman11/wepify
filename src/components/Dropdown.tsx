import {
  cloneElement,
  createContext,
  useContext,
  useState,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode
} from 'react';
import styled from 'styled-components';
import useOutsideClick from '../hooks/useOutsideClick';

/**
 * Styles
 */

const StyledDropdown = styled.ul<{ top?: number }>`
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
}

type ClickableElement = ReactElement<{ onClick?: MouseEventHandler }>;

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

  return <DropdownContext.Provider value={{ setIsOpen, isOpen }}>{children}</DropdownContext.Provider>;
}

function Open({ children }: { children: ClickableElement }) {
  const { setIsOpen } = useDropdownContext();

  return cloneElement(children, {
    onClick: (event) => {
      event.stopPropagation();
      setIsOpen(true);
    }
  });
}

function Drop({ children, top }: { children: ReactNode; top?: number }) {
  const { isOpen, setIsOpen } = useDropdownContext();
  const dropdownRef = useOutsideClick<HTMLUListElement>(() => setIsOpen(false));

  if (!isOpen) return null;

  return (
    <StyledDropdown ref={dropdownRef} top={top}>
      {children}
    </StyledDropdown>
  );
}

Dropdown.open = Open;
Dropdown.drop = Drop;

export default Dropdown;
