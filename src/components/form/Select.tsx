import { useEffect, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import styled from 'styled-components';
import useOutsideClick from '../../hooks/useOutsideClick';
import Icon from '../Icon';

/**
 * Constants
 */

const DEFAULT_EDIT_INPUT_TYPE = 'number';

/**
 * Styles
 */

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.div<{ $clickable: boolean }>`
  width: 100%;
  padding: 0.4rem 1.2rem;
  background-color: var(--color-white-3);
  border: var(--border-base);
  border-radius: var(--border-radius-sm);
  color: var(--color-black-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ $clickable }) => $clickable && `cursor: pointer;`}
`;

const LabelEditable = styled.span`
  flex: 1;
  outline: none;
`;

const LabelInput = styled.input`
  width: 100%;
  outline: none;
  background: transparent;
  border: none;
  color: var(--color-black-light);
`;

const Chevron = styled.span<{ $clickable: boolean }>`
  ${({ $clickable }) => $clickable && `cursor: pointer;`}
`;

const DropdownList = styled.ul<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  position: absolute;
  width: 100%;
  max-height: 12.2rem;
  margin-top: 0.4rem;
  background: var(--color-white);
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
    background: var(--color-white-3);
  }
`;

/**
 * Types
 */

interface SelectProps {
  options: (string | number)[];
  onChange: (option: string | number, propName?: string) => void;
  defaultSelect?: string | number;
  editable?: boolean;
  editInputType?: 'number' | 'text';
}

/**
 * Component definition
 */

const Select = ({
  options,
  onChange,
  defaultSelect = '',
  editable,
  editInputType = DEFAULT_EDIT_INPUT_TYPE
}: SelectProps) => {
  const [selected, setSelected] = useState<string | number>(defaultSelect);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  const handleSelect = (option: string | number) => {
    setSelected(option);
    setIsOpen(false);
    onChange(option);
  };

  useEffect(() => {
    setSelected(defaultSelect ?? '');
  }, [defaultSelect]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <Wrapper ref={wrapperRef}>
      <SelectButton
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        role='button'
        $clickable={!editable}
        onClick={editable ? undefined : toggleDropdown}
      >
        {editable ? (
          <LabelInput
            type={editInputType}
            value={selected}
            onChange={(event) => {
              const text = event.target.value;
              setSelected(text);
              onChange(text);
            }}
          />
        ) : (
          <LabelEditable>{selected || 'Select...'}</LabelEditable>
        )}
        <Chevron $clickable={true} onClick={editable ? toggleDropdown : undefined}>
          <Icon icon={LuChevronDown} />
        </Chevron>
      </SelectButton>
      <DropdownList role='listbox' $open={isOpen}>
        {options.map((option) => (
          <DropdownItem key={option} role='option' onClick={() => handleSelect(option)}>
            {option}
          </DropdownItem>
        ))}
      </DropdownList>
    </Wrapper>
  );
};

export default Select;
