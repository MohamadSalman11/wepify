import { EditorToIframe } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
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
import styled from 'styled-components';
import Icon from '../../../components/Icon';
import { useAppSelector } from '../../../store';
import { generateElementDisplayMap } from '../../../utils/generateElementDisplayMap';
import { selectCurrentPageElementsTree } from '../editorSlice';

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
  const selectedElementId = useAppSelector((state) => state.editor.currentElementId);
  const childrenMap = useAppSelector(selectCurrentPageElementsTree);

  const getChildren = (parentId: string) => childrenMap[parentId] || [];
  const rootElements = getChildren('root');

  const allElements = Object.values(childrenMap).flat();
  const displayMap = generateElementDisplayMap(allElements);

  return (
    <>
      <Title>Layers</Title>
      <LayerList>
        {rootElements.map((el) => (
          <LayerNode
            key={el.id}
            element={el}
            getChildren={getChildren}
            selectedElementId={selectedElementId}
            displayMap={displayMap}
          />
        ))}
      </LayerList>
    </>
  );
}

function LayerNode({
  element,
  getChildren,
  nested = false,
  selectedElementId,
  displayMap
}: {
  element: PageElement;
  getChildren: (parentId: string) => PageElement[];
  nested?: boolean;
  selectedElementId: string | null;
  displayMap: Record<string, string>; // add display map
}) {
  const [expanded, setExpanded] = useState(false);
  const children: PageElement[] = getChildren(element.id);
  const hasChildren = children.length > 0;

  const handleClick = () => {
    if (hasChildren) setExpanded((prev) => !prev);
    iframeConnection.send(EditorToIframe.SelectElement, element.id);
  };

  const readableName = Object.keys(displayMap).find((key) => displayMap[key] === element.id) || element.id;

  return (
    <LayerItem>
      <LayerHeader onClick={handleClick}>
        {hasChildren && <ChevronIcon icon={LuChevronRight} size='md' $expanded={expanded} />}
        <LayerBox $nested={nested} $selected={selectedElementId === element.id}>
          <Icon icon={ICON_MAP[element.name] || LuSquare} color='var(--color-white)' />
          <span>{readableName}</span>
        </LayerBox>
      </LayerHeader>

      {hasChildren && expanded && (
        <NestedList>
          {children.map((child) => (
            <LayerNode
              key={child.id}
              element={child}
              getChildren={getChildren}
              nested
              selectedElementId={selectedElementId}
              displayMap={displayMap}
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
  padding: 1.2rem 1.6rem;
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
  cursor: pointer;
  margin-right: 0.4rem;
  margin-left: -0.2rem;
  transform: rotate(${({ $expanded }) => ($expanded ? '90deg' : '0deg')});
`;
