import { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import styled from 'styled-components';
import useOutsideClick from '../../hooks/useOutsideClick';
import Icon from '../Icon';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.div<{ clickable: boolean }>`
  width: 100%;
  padding: 0.4rem 1.2rem;
  background-color: var(--color-black-light-2);
  border: var(--border-base);
  border-radius: var(--border-radius-sm);
  color: var(--color-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ clickable }) => clickable && `cursor: pointer;`}
`;

const LabelEditable = styled.span`
  flex: 1;
  outline: none;
`;

const Chevron = styled.span<{ clickable: boolean }>`
  ${({ clickable }) => clickable && `cursor: pointer;`}
`;

const DropdownList = styled.ul<{ open: boolean }>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: absolute;
  width: 100%;
  max-height: 12.2rem;
  margin-top: 0.4rem;
  background: var(--color-black-light-2);
  border: var(--border-base);
  border-radius: var(--border-radius-sm);
  list-style: none;
  z-index: var(--zindex-base);
  overflow-y: auto;
`;

const DropdownItem = styled.li`
  padding: 0.8rem 1.2rem;
  cursor: pointer;

  &:hover {
    background: var(--color-gray-dark-2);
  }
`;

const Select = ({
  options,
  onChange,
  defaultSelect,
  contentEditable
}: {
  options: string[];
  onChange?: (value: string) => void;
  defaultSelect?: string;
  contentEditable?: boolean;
}) => {
  const [selected, setSelected] = useState<string>(defaultSelect || '');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <Wrapper ref={wrapperRef}>
      <SelectButton clickable={!contentEditable} onClick={!contentEditable ? toggleDropdown : undefined}>
        <LabelEditable
          contentEditable={contentEditable}
          suppressContentEditableWarning
          onBlur={(e) => {
            if (contentEditable) {
              const text = e.currentTarget.textContent || '';
              setSelected(text);
              if (onChange) onChange(text);
            }
          }}
        >
          {selected || 'Select...'}
        </LabelEditable>
        <Chevron clickable={true} onClick={contentEditable ? toggleDropdown : undefined}>
          <Icon icon={LuChevronDown} />
        </Chevron>
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
