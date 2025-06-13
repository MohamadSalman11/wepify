import { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  LuChevronRight,
  LuFileVideo,
  LuGroup,
  LuHeading,
  LuImage,
  LuLink,
  LuSquare,
  LuTextCursorInput
} from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../../store';
import type { PageElement } from '../../../types';
import { flattenElements } from '../../../utils/flatten-elements';
import { selectElement } from '../slices/selectionSlice';

const Title = styled.span`
  font-size: 1.6rem;
  color: var(--color-white);
  font-weight: 500;
`;

const LayerList = styled.ul`
  margin-top: 2.4rem;
  display: flex;
  flex-direction: column;
  row-gap: 1.2rem;
  list-style: none;
`;

const LayerItem = styled.li`
  display: flex;
  flex-direction: column;
`;

const LayerBox = styled.div<{ nested?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  background-color: var(--color-gray-dark-2);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: var(--transition-base);
  margin-left: ${({ nested }) => (nested ? 'auto' : '0')};
  width: ${({ nested }) => (nested ? '90%' : '100%')};

  &:hover {
    background-color: var(--color-gray-dark);
  }

  svg {
    color: var(--color-gray);
    font-size: 1.6rem;
  }

  span {
    color: var(--color-white);
    font-size: 1.4rem;
  }
`;

const NestedList = styled.ul`
  margin-top: 0.8rem;
  display: flex;
  flex-direction: column;
  list-style: none;
  row-gap: 0.8rem;
`;

const LayerHeader = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const ChevronIcon = styled(LuChevronRight)<{ expanded: boolean }>`
  position: absolute;
  left: -1.6rem;
  cursor: pointer;
  font-size: 1.6rem;
  transform: rotate(${({ expanded }) => (expanded ? '90deg' : '0deg')});
`;

const ICON_MAP: Record<string, IconType> = {
  group: LuGroup,
  container: LuSquare,
  input: LuTextCursorInput,
  heading: LuHeading,
  img: LuImage,
  video: LuFileVideo,
  link: LuLink
};

function LayersPanel() {
  const page = useAppSelector((state) => state.page);

  return (
    <>
      <Title>Layers</Title>
      <LayerList>
        {page.elements.map((element) => (
          <LayerNode key={element.id} element={element} />
        ))}
      </LayerList>
    </>
  );
}

function LayerNode({ element, nested = false }: { element: PageElement; nested?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = element.children?.length > 0;
  const Icon = ICON_MAP[element.name] || LuSquare;
  const dispatch = useDispatch();
  const page = useAppSelector((state) => state.page);

  const handleClick = () => {
    const flatElements = flattenElements(page.elements);
    const found = flatElements.find((el) => el.id === element.id);
    if (found) {
      dispatch(selectElement(found));
    }
  };

  return (
    <LayerItem>
      <LayerHeader>
        {hasChildren && <ChevronIcon expanded={expanded} onClick={() => setExpanded((prev) => !prev)} />}
        <LayerBox nested={nested} onClick={handleClick}>
          <Icon />
          <span>{element.id}</span>
        </LayerBox>
      </LayerHeader>
      {hasChildren && expanded && (
        <NestedList>
          {element.children.map((child: PageElement) => (
            <LayerNode key={child.id} element={child} nested />
          ))}
        </NestedList>
      )}
    </LayerItem>
  );
}

export default LayersPanel;
