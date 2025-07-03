import { useState, type ReactNode } from 'react';
import { LuChevronUp } from 'react-icons/lu';
import styled from 'styled-components';
import Icon from '../../components/Icon';

/**
 * Component definition
 */

export default function CollapsibleSection({
  title,
  open: defaultIsOpen,
  children
}: {
  title: string;
  open?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultIsOpen ?? false);

  return (
    <>
      <SectionHeader className={open ? 'open' : ''} onClick={() => setOpen((prev) => !prev)} $open={open}>
        <span>{title}</span>
        <Icon icon={LuChevronUp} />
      </SectionHeader>
      {open && children}
    </>
  );
}

/**
 * Styles
 */

const SectionHeader = styled.div<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: ${(props) => (props.$open ? '2.4rem' : '0')};

  svg {
    transform: rotate(${(props) => (props.$open ? '-180deg' : '0deg')});
    transition: transform 0.2s;
  }
`;
