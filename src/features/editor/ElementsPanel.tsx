import { LuFileVideo, LuImage, LuSearch, LuYoutube } from 'react-icons/lu';
import styled from 'styled-components';

const PanelContainer = styled.div`
  border-right: var(--border-base);
  background-color: var(--color-black-light-2);
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  & > div {
    border-bottom: var(--border-base);
    padding: 3.2rem 2.4rem;
    width: 100%;
  }
`;

const PanelList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.4rem;
  list-style: none;

  li {
    width: fit-content;
    text-align: center;
  }

  span {
    font-size: 1.2rem;
  }
`;

const LayoutItem = styled.li`
  div {
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem;
  }

  &:nth-child(1) span {
    &:nth-child(1) {
      grid-row: 1 / span 3;
      grid-column: 1 / -1;
    }

    &:nth-child(2) {
      grid-row: span 2;
      grid-column: 1 / -1;
    }
  }

  &:nth-child(2) span {
    grid-row: 1 / -1;
    grid-column: 1 / -1;
  }

  &:nth-child(4) span {
    grid-row: 1 / -1;
  }

  &:nth-child(5) span {
    grid-column: 1 / -1;
  }

  &:nth-child(6) span {
    grid-column: 1 / -1;
    height: 10px;
  }
`;

const TextItem = styled.li`
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;

    span {
      background-color: var(--color-gray-dark);
    }
  }

  &:nth-child(1) div {
    font-size: 3rem;
  }

  &:nth-child(3) div span {
    border-radius: var(--border-radius-xl);
    padding: 0.4rem 1.2rem;
    font-size: 1.4rem;
  }

  &:nth-child(4) div {
    text-decoration: underline;
    text-underline-offset: 8px;
  }

  &:nth-child(5) div span {
    border-radius: var(--border-radius-md);
    padding: 0.4rem 0.8rem;
    font-size: 1.4rem;
  }

  &:nth-child(6) div span {
    display: inline-block;
    position: relative;
    width: 6rem;
    height: 2.5rem;

    &::after {
      position: absolute;
      top: 50%;
      left: 20%;
      transform: translateY(-50%);
      background-color: var(--color-gray);
      width: 2px;
      height: 1.2rem;
      content: '';
    }
  }
`;

const MediaItem = styled.li`
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
  }
`;

const SearchBar = styled.div`
  position: relative;

  svg {
    position: absolute;
    top: 49%;
    left: 3%;
    transform: translateY(-50%);
    font-size: 2rem;
  }

  input {
    border-radius: var(--border-radius-md);
    background-color: var(--color-gray-dark-2);
    padding: 1rem 1rem 1rem 3.6rem;
    width: 100%;
    color: var(--color-white);
    font-size: 1.4rem;
  }
`;

const PanelBox = styled.div`
  cursor: pointer;
  margin-bottom: 0.8rem;
  border-radius: var(--border-radius-md);
  background-color: var(--color-gray-dark-2);
  padding: 1.2rem;
  width: 8rem;
  height: 6rem;
  color: var(--color-gray);
  position: relative;

  span {
    border: 1px dashed var(--color-gray-dark-2);

    border-radius: var(--border-radius-sm);
    background-color: var(--color-gray-dark);
  }

  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const SectionTitle = styled.span`
  display: inline-block;
  margin-bottom: 2.4rem;
  font-size: 2rem;
`;

function ElementsPanel() {
  return (
    <PanelContainer>
      <div>
        <SectionTitle>Add Elements</SectionTitle>
        <SearchBar>
          <LuSearch />
          <input type='text' placeholder='Search Elements' />
        </SearchBar>
      </div>
      <div>
        <SectionTitle>Layout</SectionTitle>
        <PanelList>
          <LayoutItem>
            <PanelBox>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
            </PanelBox>
            <span>Section</span>
          </LayoutItem>
          <LayoutItem>
            <PanelBox>
              <span>&nbsp;</span>
            </PanelBox>
            <span>Container</span>
          </LayoutItem>
          <LayoutItem>
            <PanelBox>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
            </PanelBox>
            <span>Grid</span>
          </LayoutItem>
          <LayoutItem>
            <PanelBox>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
            </PanelBox>
            <span>Columns</span>
          </LayoutItem>
          <LayoutItem>
            <PanelBox>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
            </PanelBox>
            <span>Rows</span>
          </LayoutItem>
          <LayoutItem>
            <PanelBox>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
            </PanelBox>
            <span>Lists</span>
          </LayoutItem>
        </PanelList>
      </div>

      <div>
        <SectionTitle>Text</SectionTitle>
        <PanelList>
          <TextItem>
            <PanelBox>H</PanelBox>
            <span>Heading</span>
          </TextItem>
          <TextItem>
            <PanelBox>Text</PanelBox>
            <span>Text Block</span>
          </TextItem>
          <TextItem>
            <PanelBox>
              <span>Label</span>
            </PanelBox>
            <span>Label</span>
          </TextItem>
          <TextItem>
            <PanelBox>Link</PanelBox>
            <span>Text Link</span>
          </TextItem>
          <TextItem>
            <PanelBox>
              <span>Button</span>
            </PanelBox>
            <span>Button</span>
          </TextItem>
          <TextItem>
            <PanelBox>
              <span>&nbsp;</span>
            </PanelBox>
            <span>Input</span>
          </TextItem>
        </PanelList>
      </div>

      <div>
        <SectionTitle>Media</SectionTitle>
        <PanelList>
          <MediaItem>
            <PanelBox>
              <LuImage />
            </PanelBox>
            <span>Image</span>
          </MediaItem>
          <MediaItem>
            <PanelBox>
              <LuFileVideo />
            </PanelBox>
            <span>Video</span>
          </MediaItem>
          <MediaItem>
            <PanelBox>
              <LuYoutube />
            </PanelBox>
            <span>YouTube</span>
          </MediaItem>
        </PanelList>
      </div>
    </PanelContainer>
  );
}

export default ElementsPanel;
