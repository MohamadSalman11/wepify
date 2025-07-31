import type { PageElement } from '@shared/typing';
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
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Icon from '../../../components/Icon';
import { useIframeContext } from '../../../context/IframeContext';
import { useAppSelector } from '../../../store';
import { flattenElements } from '../../../utils/flattenElements';

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
 * Component definition
 */

export default function LayersPanel() {
  const { pageId } = useParams();
  const { site, selectedElement } = useAppSelector((state) => state.editor);
  const page = site.pages.find((p) => p.id === pageId);

  return (
    <>
      <Title>Layers</Title>
      <LayerList>
        {page?.elements.map((element) => (
          <LayerNode
            key={element.id}
            elements={page.elements}
            element={element}
            selectedElementId={selectedElement.id}
          />
        ))}
      </LayerList>
    </>
  );
}

function LayerNode({
  elements,
  element,
  nested = false,
  selectedElementId
}: {
  elements: PageElement[];
  element: PageElement;
  nested?: boolean;
  selectedElementId: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = (element.children?.length ?? 0) > 0;
  const { iframeConnection } = useIframeContext();

  const handleClick = () => {
    if (!elements) return;

    if (hasChildren) {
      setExpanded((prev) => !prev);
    }

    const flatElements = flattenElements(elements);
    const found = flatElements.find((el) => el.id === element.id);

    if (found) {
      iframeConnection.handleSelectionChange(found.id);
    }
  };

  return (
    <LayerItem>
      <LayerHeader onClick={handleClick}>
        <LayerBox $nested={nested} $selected={selectedElementId === element.id}>
          {hasChildren && <ChevronIcon icon={LuChevronRight} size='md' $expanded={expanded} />}
          <Icon icon={ICON_MAP[element.name] || LuSquare} color='var(--color-white)' />
          <span>{element.id}</span>
        </LayerBox>
      </LayerHeader>

      {hasChildren && expanded && (
        <NestedList>
          {element.children?.map((child) => (
            <LayerNode
              key={child.id}
              elements={elements}
              element={child}
              nested
              selectedElementId={selectedElementId}
            />
          ))}
        </NestedList>
      )}
    </LayerItem>
  );
}

/**
 * Styles
 */

const Title = styled.span`
  font-size: 1.4rem;
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

const LayerBox = styled.div<{ $nested?: boolean; $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  background-color: ${({ $selected }) => ($selected ? 'var(--color-primary-light)' : 'var(--color-gray-light-2)')};
  border-radius: var(--border-radius-md);
  cursor: pointer;
  margin-left: ${({ $nested }) => ($nested ? 'auto' : '0')};
  width: ${({ $nested }) => ($nested ? '90%' : '100%')};

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

const ChevronIcon = styled(Icon)<{ $expanded: boolean }>`
  transform: translateX(-3.1rem) rotate(${({ $expanded }) => ($expanded ? '90deg' : '0deg')});
`;
