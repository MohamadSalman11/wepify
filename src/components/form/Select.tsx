import { ChangeEvent, useEffect, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import styled, { css } from 'styled-components';
import useOutsideClick from '../../hooks/useOutsideClick';
import Icon from '../Icon';

/**
 * Constants
 */

const DEFAULT_EDIT_INPUT_TYPE = 'number';

/**
 * Types
 */

interface SelectProps {
  id?: string;
  name: string;
  editable?: boolean;
  editInputType?: 'number' | 'text';
  options: (string | number)[];
  defaultSelect?: string | number;
  disabled?: boolean;
  onChange?: (event: { target: { value: string | number; name: string } }) => void;
}

/**
 * Component definition
 */

export default function Select({
  id,
  name,
  editable,
  editInputType = DEFAULT_EDIT_INPUT_TYPE,
  options,
  defaultSelect = '',
  disabled = false,
  onChange
}: SelectProps) {
  const [selected, setSelected] = useState<string | number>(defaultSelect);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  useEffect(() => {
    setSelected(defaultSelect ?? '');
  }, [defaultSelect]);

  const handleSelect = (option: string | number) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.({ target: { value: option, name } });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelected(value);
    onChange?.({ target: { value, name } });
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <Wrapper ref={wrapperRef} $disabled={disabled}>
      <SelectButton
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        role='button'
        $clickable={!editable}
        $disabled={disabled}
        onClick={!editable && !disabled ? toggleDropdown : undefined}
      >
        {editable ? (
          <LabelInput id={id} type={editInputType} value={selected} disabled={disabled} onChange={handleInputChange} />
        ) : (
          <LabelEditable>{selected || 'Select...'}</LabelEditable>
        )}
        <Chevron $clickable={true} onClick={!disabled && editable ? toggleDropdown : undefined}>
          <Icon icon={LuChevronDown} color={`${disabled ? 'var(--color-white-3)' : ''}`} />
        </Chevron>
      </SelectButton>
      {!disabled && (
        <DropdownList role='listbox' $open={isOpen}>
          {options.map((option) => (
            <DropdownItem key={option} role='option' onClick={() => handleSelect(option)}>
              {option}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </Wrapper>
  );
}

/**
 * Styles
 */

const Wrapper = styled.div<{ $disabled: boolean }>`
  position: relative;
  width: 100%;

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      * {
        cursor: not-allowed !important;
        pointer-events: none;
      }
    `}
`;

const SelectButton = styled.div<{ $clickable: boolean; $disabled: boolean }>`
  width: 100%;
  padding: 0.5rem 1.2rem;
  background-color: var(--color-white-3);
  border-radius: var(--border-radius-md);
  border: var(--border-base);
  color: var(--color-black-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ $clickable }) => $clickable && `cursor: pointer;`}
  ${(props) => props.$disabled && 'opacity: 0.7;'}
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
