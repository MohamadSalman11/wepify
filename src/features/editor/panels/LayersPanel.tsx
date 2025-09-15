import { EditorToIframe } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { DragEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  LuChevronRight,
  LuGrid2X2,
  LuHeading,
  LuImage,
  LuLink,
  LuList,
  LuListOrdered,
  LuRectangleHorizontal,
  LuSquare,
  LuTextCursorInput
} from 'react-icons/lu';
import styled from 'styled-components';
import { SectionTitle } from '.';
import Icon from '../../../components/Icon';
import { useAppSelector } from '../../../store';
import { selectCurrentPageElementsTree } from '../editorSlice';

/**
 * Constants
 */

const ICON_MAP: Record<string, IconType> = {
  section: LuSquare,
  container: LuSquare,
  grid: LuGrid2X2,
  gridItem: LuSquare,
  item: LuSquare,
  image: LuImage,
  input: LuTextCursorInput,
  link: LuLink,
  a: LuLink,
  list: LuList,
  listItem: LuListOrdered,
  heading: LuHeading,
  text: LuTextCursorInput,
  button: LuRectangleHorizontal
};

/**
 * Types
 */

interface LayerElement {
  id: string;
  name: string;
  parentId: string;
  domIndex: number;
}

/**
 * Component definition
 */

export default function LayersPanel() {
  const selectedElementId = useAppSelector((state) => state.editor.currentElementId);
  const childrenMap = useAppSelector(selectCurrentPageElementsTree);
  const [draggedId, setDraggedId] = useState<string>('');
  const getChildren = (parentId: string) => childrenMap[parentId] || [];
  const rootElements = [...getChildren('root')].sort((a, b) => a.domIndex - b.domIndex);

  return (
    <>
      <SectionTitle>Layers</SectionTitle>
      <LayerList>
        {rootElements.map((el) => (
          <LayerNode
            key={el.id}
            element={el}
            getChildren={getChildren}
            selectedElementId={selectedElementId}
            childrenMap={childrenMap}
            draggedId={draggedId}
            setDraggedId={setDraggedId}
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
  childrenMap,
  draggedId,
  setDraggedId
}: {
  element: LayerElement;
  getChildren: (parentId: string) => LayerElement[];
  nested?: boolean;
  selectedElementId: string | null;
  childrenMap: ReturnType<typeof selectCurrentPageElementsTree>;
  draggedId: string;
  setDraggedId: (id: string) => void;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const children: LayerElement[] = [...getChildren(element.id)].sort((a, b) => a.domIndex - b.domIndex);
  const hasChildren = children.length > 0;
  const [expanded, setExpanded] = useState(() => hasChildren && hasSelectedDescendant(element.id, selectedElementId));

  useEffect(() => {
    if (selectedElementId === element.id && layerRef.current) {
      layerRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedElementId, element.id]);

  useEffect(() => {
    if (hasChildren && hasSelectedDescendant(element.id, selectedElementId)) {
      setExpanded(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element.id, hasChildren, selectedElementId]);

  function hasSelectedDescendant(elementId: string, selectedId: string | null): boolean {
    if (!selectedId) return false;
    const children = getChildren(elementId);
    if (children.some((child) => child.id === selectedId)) return true;
    return children.some((child) => hasSelectedDescendant(child.id, selectedId));
  }

  const handleClick = (event: MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();

    if (hasChildren) setExpanded((prev) => !prev);
    iframeConnection.send(EditorToIframe.SelectElement, element.id);
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setDraggedId?.(element.id);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const draggedElement = Object.values(childrenMap)
      .flat()
      .find((el) => el.id === draggedId);

    if (draggedElement && draggedElement.parentId === element.parentId && draggedElement.id !== element.id) {
      setIsDragOver(true);
    } else {
      setIsDragOver(false);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!draggedId) return;

    const target = event.currentTarget;
    const container = target.closest('ul');

    if (!container) {
      return;
    }

    const siblings = [...container.querySelectorAll<HTMLElement>('[draggable]')];
    const newIndex = siblings.indexOf(target);

    if (newIndex === -1) {
      return;
    }

    iframeConnection.send(EditorToIframe.ChangeElementPosition, {
      elementId: draggedId,
      newIndex
    });

    setIsDragOver(false);
  };

  return (
    <LayerItem onClick={handleClick}>
      <LayerHeader>
        {hasChildren && <ChevronIcon icon={LuChevronRight} size='md' $expanded={expanded} />}
        <LayerBox
          ref={layerRef}
          $isDragOver={isDragOver}
          $nested={nested}
          $selected={selectedElementId === element.id}
          draggable
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Icon icon={ICON_MAP[element.name] || LuSquare} color='var(--color-white)' />
          <span>{element.name}</span>
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
              childrenMap={childrenMap}
              draggedId={draggedId}
              setDraggedId={setDraggedId}
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

const LayerList = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: 1.2rem;
  list-style: none;
  background-color: transparent;
`;

const LayerItem = styled.li`
  display: flex;
  flex-direction: column;
  transform: translate(0, 0);
`;

const LayerBox = styled.div<{ $nested?: boolean; $selected?: boolean; $isDragOver: boolean }>`
  cursor: grab;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 1.6rem;
  background-color: ${({ $selected, $isDragOver }) =>
    $isDragOver ? 'var(--color-white)' : $selected ? 'var(--color-primary-light)' : 'var(--color-gray-light-2)'};
  border-radius: var(--border-radius-md);
  border: ${({ $isDragOver }) => ($isDragOver ? '2px dashed var(--color-primary)' : 'none')};
  box-shadow: ${({ $isDragOver }) => ($isDragOver ? 'var(--box-shadow)' : 'none')};
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
