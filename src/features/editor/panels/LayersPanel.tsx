import { useState } from 'react';
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

function LayersPanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Title>Layers</Title>

      <LayerList>
        <LayerItem>
          <LayerHeader>
            <ChevronIcon expanded={expanded} onClick={() => setExpanded((prev) => !prev)} />
            <LayerBox>
              <LuGroup />
              <span>Group 1</span>
            </LayerBox>
          </LayerHeader>

          {expanded && (
            <NestedList>
              <li>
                <LayerBox nested>
                  <LuSquare />
                  <span>Container</span>
                </LayerBox>
              </li>
              <li>
                <LayerBox nested>
                  <LuTextCursorInput />
                  <span>Input</span>
                </LayerBox>
              </li>
            </NestedList>
          )}
        </LayerItem>

        <LayerItem>
          <LayerBox>
            <LuTextCursorInput />
            <span>Input</span>
          </LayerBox>
        </LayerItem>

        <LayerItem>
          <LayerBox>
            <LuHeading />
            <span>Heading</span>
          </LayerBox>
        </LayerItem>

        <LayerItem>
          <LayerBox>
            <LuImage />
            <span>Image</span>
          </LayerBox>
        </LayerItem>

        <LayerItem>
          <LayerBox>
            <LuFileVideo />
            <span>Video</span>
          </LayerBox>
        </LayerItem>

        <LayerItem>
          <LayerBox>
            <LuLink />
            <span>Link</span>
          </LayerBox>
        </LayerItem>
      </LayerList>
    </>
  );
}

export default LayersPanel;
