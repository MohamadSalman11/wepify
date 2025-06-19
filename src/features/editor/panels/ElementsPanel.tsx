import { useRef } from 'react';
import { LuImage, LuSearch } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../../store';
import type { InputChangeEvent } from '../../../types';
import { flattenElements } from '../../../utils/flattenElements';
import { useAddElementToPage } from '../hooks/useAddElementToPage';
import { useImageUpload } from '../hooks/useImageUpload';
import { selectElement } from '../slices/selectionSlice';

/**
 * Styles
 */

const PanelList = styled.ul<{ disabled?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.4rem;
  list-style: none;

  li {
    width: fit-content;
    text-align: center;
  }

  li:not([data-grid-active], [data-list-active]) {
    opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  }

  span {
    font-size: 1.2rem;
  }
`;

const LayoutItem = styled.li<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  div {
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem;
  }

  &:nth-child(1) div span {
    &:nth-child(1) {
      grid-row: 1 / span 3;
      grid-column: 1 / -1;
    }

    &:nth-child(2) {
      grid-row: span 2;
      grid-column: 1 / -1;
    }
  }

  &:nth-child(2) div span {
    grid-row: 1 / -1;
    grid-column: 1 / -1;
  }

  &:nth-child(4) div span,
  &:nth-child(6) div span {
    grid-column: 1 / -1;
    height: 10px;
  }

  &:nth-child(5) div span {
    &:nth-child(4) {
      background-color: var(--color-gray);
    }
  }

  &:nth-child(6) div span {
    &:nth-child(3) {
      background-color: var(--color-gray);
    }
  }
`;

const TextItem = styled.li`
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;

    span {
      background-color: var(--color-gray-light);
    }
  }

  &:nth-child(1) div {
    font-size: 3rem;
  }

  &:nth-child(3) div {
    text-decoration: underline;
    text-underline-offset: 8px;
  }

  &:nth-child(4) div span {
    border-radius: var(--border-radius-md);
    padding: 0.4rem 0.8rem;
    font-size: 1.4rem;
  }

  &:nth-child(5) div span {
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
    background-color: var(--color-white-3);
    padding: 1rem 1rem 1rem 3.6rem;
    width: 100%;
    color: var(--color-black-light);
    font-size: 1.4rem;
  }
`;

const PanelBox = styled.div`
  cursor: pointer;
  margin-bottom: 0.8rem;
  border-radius: var(--border-radius-md);
  background-color: var(--color-white-3);
  padding: 1.2rem;
  width: 8rem;
  height: 6rem;
  color: var(--color-gray);
  position: relative;

  span {
    border: 1px dashed var(--color-white-3);

    border-radius: var(--border-radius-sm);
    background-color: var(--color-gray-light-2);
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

/**
 * Component definition
 */

function ElementsPanel() {
  const page = useAppSelector((state) => state.page);
  const selection = useAppSelector((state) => state.selection.selectedElement);
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addElementToPage } = useAddElementToPage();
  const { handleImageUpload } = useImageUpload();

  const handleSearchElement = (event: InputChangeEvent) => {
    const id = event.target.value;
    const element = flattenElements(page.elements).find((el) => el.id === id);
    if (element) dispatch(selectElement(element));
  };

  return (
    <>
      <input type='file' accept='image/*' style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageUpload} />
      <div>
        <SectionTitle>Add Elements</SectionTitle>
        <SearchBar>
          <LuSearch />
          <input type='text' placeholder='Search Elements' onChange={handleSearchElement} />
        </SearchBar>
      </div>
      <div>
        <SectionTitle>Layout</SectionTitle>
        <PanelList disabled={selection.name === 'grid' || selection.name === 'list'}>
          <LayoutItem data-grid-active>
            <PanelBox onClick={() => addElementToPage('section')}>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
            </PanelBox>
            <span>Section</span>
          </LayoutItem>
          <LayoutItem>
            <PanelBox onClick={() => addElementToPage('container')}>
              <span>&nbsp;</span>
            </PanelBox>
            <span>Container</span>
          </LayoutItem>
          <LayoutItem>
            <PanelBox onClick={() => addElementToPage('grid')}>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
            </PanelBox>
            <span>Grid</span>
          </LayoutItem>
          <LayoutItem>
            <PanelBox onClick={() => addElementToPage('list')}>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
            </PanelBox>
            <span>List</span>
          </LayoutItem>
          <LayoutItem disabled={selection.name !== 'grid'} data-grid-active>
            <PanelBox onClick={() => addElementToPage('gridItem')}>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
            </PanelBox>
            <span>Grid Item</span>
          </LayoutItem>
          <LayoutItem disabled={selection.name !== 'list'} data-list-active>
            <PanelBox onClick={() => addElementToPage('listItem')}>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
            </PanelBox>
            <span>List Item</span>
          </LayoutItem>
        </PanelList>
      </div>

      <div>
        <SectionTitle>Text</SectionTitle>
        <PanelList disabled={selection.name === 'grid' || selection.name === 'list'}>
          <TextItem onClick={() => addElementToPage('heading')}>
            <PanelBox>H</PanelBox>
            <span>Heading</span>
          </TextItem>
          <TextItem onClick={() => addElementToPage('text')}>
            <PanelBox>Text</PanelBox>
            <span>Text Block</span>
          </TextItem>
          <TextItem onClick={() => addElementToPage('link')}>
            <PanelBox>Link</PanelBox>
            <span>Text Link</span>
          </TextItem>
          <TextItem onClick={() => addElementToPage('button')}>
            <PanelBox>
              <span>Button</span>
            </PanelBox>
            <span>Button</span>
          </TextItem>
          <TextItem onClick={() => addElementToPage('input')}>
            <PanelBox>
              <span>&nbsp;</span>
            </PanelBox>
            <span>Input</span>
          </TextItem>
        </PanelList>
      </div>

      <div>
        <SectionTitle>Media</SectionTitle>
        <PanelList disabled={selection.name === 'grid'}>
          <MediaItem>
            <PanelBox onClick={() => fileInputRef.current?.click()}>
              <LuImage />
            </PanelBox>
            <span>Image</span>
          </MediaItem>
        </PanelList>
      </div>
    </>
  );
}

export default ElementsPanel;
