import { useEffect, useRef, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Trigger = styled.button`
  padding: 0.4rem 1.2rem;
  background-color: var(--color-black-light-2);
  border: var(--border-base);
  border-radius: var(--border-radius-sm);
  color: var(--color-white);
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    font-size: 2rem;
  }
`;

const List = styled.ul<{ open: boolean }>`
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

const Item = styled.li`
  padding: 0.8rem 1.2rem;
  cursor: pointer;

  &:hover {
    background: var(--color-gray-dark-2);
  }
`;

const Select = ({ options }: { options: string[] }) => {
  const [selected, setSelected] = useState<string>();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onSelect = (opt: string) => {
    setSelected(opt);
    setOpen(false);
  };

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <Wrapper ref={ref}>
      <Trigger onClick={() => setOpen(!open)}>
        {selected || 'Select...'}
        <LuChevronDown />
      </Trigger>
      <List open={open}>
        {options.map((opt) => (
          <Item key={opt} onClick={() => onSelect(opt)} tabIndex={0}>
            {opt}
          </Item>
        ))}
      </List>
    </Wrapper>
  );
};

export default Select;
