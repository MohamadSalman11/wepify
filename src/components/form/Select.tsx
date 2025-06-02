import { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import styled from 'styled-components';
import useOutsideClick from '../../hooks/useOutsideClick';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 0.4rem 1.2rem;
  background-color: var(--color-black-light-2);
  border: var(--border-base);
  border-radius: var(--border-radius-sm);
  color: var(--color-white);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;

  svg {
    font-size: 2rem;
  }
`;

const DropdownList = styled.ul<{ open: boolean }>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: absolute;
  width: 100%;
  margin-top: 0.4rem;
  background: var(--color-black-light-2);
  border: var(--border-base);
  border-radius: var(--border-radius-sm);
  list-style: none;
  z-index: var(--zindex-base);
`;

const DropdownItem = styled.li`
  padding: 0.8rem 1.2rem;
  cursor: pointer;

  &:hover {
    background: var(--color-gray-dark-2);
  }
`;

const Select = ({ options }: { options: string[] }) => {
  const [selected, setSelected] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <SelectButton onClick={() => setIsOpen((prev) => !prev)}>
        {selected || 'Select...'}
        <LuChevronDown />
      </SelectButton>

      <DropdownList open={isOpen}>
        {options.map((option) => (
          <DropdownItem key={option} onClick={() => handleSelect(option)} tabIndex={0}>
            {option}
          </DropdownItem>
        ))}
      </DropdownList>
    </Wrapper>
  );
};

export default Select;
