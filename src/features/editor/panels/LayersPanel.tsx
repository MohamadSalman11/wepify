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

/**
 * Constants
 */

const ICON_MAP: Record<string, IconType> = {
  group: LuGroup,
  container: LuSquare,
  input: LuTextCursorInput,
  heading: LuHeading,
  img: LuImage,
  video: LuFileVideo,
  link: LuLink
};

/**
 * Styles
 */

const Title = styled.span`
  font-size: 1.6rem;
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

const LayerBox = styled.div<{ nested?: boolean; selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  background-color: ${({ selected }) => (selected ? 'var(--color-primary-light)' : 'var(--color-gray-light-2)')};
  border-radius: var(--border-radius-md);
  cursor: pointer;
  margin-left: ${({ nested }) => (nested ? 'auto' : '0')};
  width: ${({ nested }) => (nested ? '90%' : '100%')};

  svg {
    color: var(--color-white);
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
  cursor: pointer;
  font-size: 1.6rem;
  color: var(--color-gray) !important;
  transform: translateX(-3.1rem) rotate(${({ expanded }) => (expanded ? '90deg' : '0deg')});
`;

/**
 * Component definition
 */

function LayersPanel() {
  const page = useAppSelector((state) => state.page);
  const selectedElementId = useAppSelector((state) => state.selection.present.selectedElement.id);

  return (
    <>
      <Title>Layers</Title>
      <LayerList>
        {page.elements.map((element) => (
          <LayerNode key={element.id} element={element} selectedElementId={selectedElementId} />
        ))}
      </LayerList>
    </>
  );
}

function LayerNode({
  element,
  nested = false,
  selectedElementId
}: {
  element: PageElement;
  nested?: boolean;
  selectedElementId: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = (element.children?.length ?? 0) > 0;
  const Icon = ICON_MAP[element.name] || LuSquare;
  const dispatch = useDispatch();
  const page = useAppSelector((state) => state.page);

  const handleClick = () => {
    // if (hasChildren) {
    //   setExpanded((prev) => !prev);
    // }
    // const flatElements = flattenElements(page.elements);
    // const found = flatElements.find((el) => el.id === element.id);
    // if (found) {
    //   dispatch(selectElement(found));
    // }
  };

  return (
    <LayerItem>
      <LayerHeader onClick={handleClick}>
        <LayerBox nested={nested} selected={selectedElementId === element.id}>
          {hasChildren && <ChevronIcon expanded={expanded} />}

          <Icon />
          <span>{element.id}</span>
        </LayerBox>
      </LayerHeader>

      {hasChildren && expanded && (
        <NestedList>
          {element.children?.map((child) => (
            <LayerNode key={child.id} element={child} nested selectedElementId={selectedElementId} />
          ))}
        </NestedList>
      )}
    </LayerItem>
  );
}
export default LayersPanel;
