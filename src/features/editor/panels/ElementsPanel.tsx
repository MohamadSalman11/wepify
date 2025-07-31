import { nanoid } from '@reduxjs/toolkit';
import { ElementsName } from '@shared/constants';
import type { InputChangeEvent } from '@shared/typing';
import { isElementName } from '@shared/utils';
import toast from 'react-hot-toast';
import { LuImage, LuSearch } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Input from '../../../components/form/Input';
import Icon from '../../../components/Icon';
import { useIframeContext } from '../../../context/IframeContext';
import { useFilePicker } from '../../../hooks/useFilePicker';
import { useAppSelector } from '../../../store';
import CollapsibleSection from '../CollapsibleSection';
import { useImageUpload } from '../hooks/useImageUpload';
import { addImage } from '../slices/editorSlice';

/**
 * Constants
 */

const ACCEPTED_FILE_TYPE = 'image/*';

/**
 * Component definition
 */

export default function ElementsPanel() {
  const dispatch = useDispatch();
  const { iframeConnection } = useIframeContext();
  const selectedElement = useAppSelector((state) => state.editor.selectedElement);

  const handleImageUpload = useImageUpload(
    (result) => {
      iframeConnection.insertElement(ElementsName.Image, { src: result });
      if (!result) return;
      dispatch(addImage({ id: nanoid(), dataUrl: result as string }));
    },
    (message) => toast.error(message)
  );

  const { input, openFilePicker } = useFilePicker({ accept: ACCEPTED_FILE_TYPE, onSelect: handleImageUpload });

  const handleSearchElement = (event: InputChangeEvent) => {
    const id = event.target.value;
    iframeConnection.searchElement(id);
  };

  const handleAddElement = (name: string) => {
    iframeConnection.insertElement(name);
  };

  return (
    <>
      {input}
      <div>
        <SectionTitle>Add Elements</SectionTitle>
        <SearchBar>
          <Icon icon={LuSearch} />
          <Input size='md' type='text' placeholder='Search by ID' onChange={handleSearchElement} />
        </SearchBar>
      </div>
      <div>
        <CollapsibleSection title='Layout' open={true}>
          <PanelList $disabled={isElementName(selectedElement.name, ElementsName.Grid, ElementsName.Link)}>
            <LayoutItem data-grid-active>
              <PanelBox onClick={() => handleAddElement(ElementsName.Section)}>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
              </PanelBox>
              <span>Section</span>
            </LayoutItem>
            <LayoutItem>
              <PanelBox onClick={() => handleAddElement(ElementsName.Container)}>
                <span>&nbsp;</span>
              </PanelBox>
              <span>Container</span>
            </LayoutItem>
            <LayoutItem>
              <PanelBox onClick={() => handleAddElement(ElementsName.Grid)}>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
              </PanelBox>
              <span>Grid</span>
            </LayoutItem>
            <LayoutItem>
              <PanelBox onClick={() => handleAddElement(ElementsName.List)}>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
              </PanelBox>
              <span>List</span>
            </LayoutItem>
            <LayoutItem $disabled={!isElementName(selectedElement.name, ElementsName.Grid)} data-grid-active>
              <PanelBox onClick={() => handleAddElement(ElementsName.GridItem)}>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
              </PanelBox>
              <span>Grid Item</span>
            </LayoutItem>
            <LayoutItem $disabled={!isElementName(selectedElement.name, ElementsName.List)} data-list-active>
              <PanelBox onClick={() => handleAddElement(ElementsName.ListItem)}>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
              </PanelBox>
              <span>List Item</span>
            </LayoutItem>
          </PanelList>
        </CollapsibleSection>
      </div>

      <div>
        <CollapsibleSection title='Text' open={true}>
          <PanelList $disabled={isElementName(selectedElement.name, ElementsName.Grid, ElementsName.List)}>
            <TextItem onClick={() => handleAddElement(ElementsName.Heading)}>
              <PanelBox>H</PanelBox>
              <span>Heading</span>
            </TextItem>
            <TextItem onClick={() => handleAddElement(ElementsName.Text)}>
              <PanelBox>Text</PanelBox>
              <span>Text Block</span>
            </TextItem>
            <TextItem onClick={() => handleAddElement(ElementsName.Link)}>
              <PanelBox>Link</PanelBox>
              <span>Text Link</span>
            </TextItem>
            <TextItem onClick={() => handleAddElement(ElementsName.Button)}>
              <PanelBox>
                <span>Button</span>
              </PanelBox>
              <span>Button</span>
            </TextItem>
            <TextItem onClick={() => handleAddElement(ElementsName.Input)}>
              <PanelBox>
                <span>&nbsp;</span>
              </PanelBox>
              <span>Input</span>
            </TextItem>
          </PanelList>
        </CollapsibleSection>
      </div>

      <div>
        <CollapsibleSection title='Media'>
          <PanelList $disabled={isElementName(selectedElement.name, ElementsName.Grid)}>
            <MediaItem>
              <PanelBox onClick={openFilePicker}>
                <Icon icon={LuImage} />
              </PanelBox>
              <span>Image</span>
            </MediaItem>
          </PanelList>
        </CollapsibleSection>
      </div>
    </>
  );
}

/**
 * Styles
 */

const PanelList = styled.ul<{ $disabled?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.4rem;
  list-style: none;

  li {
    width: fit-content;
    text-align: center;
  }

  li:not([data-grid-active], [data-list-active]) {
    opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
    pointer-events: ${(props) => (props.$disabled ? 'none' : 'auto')};
  }

  span {
    font-size: 1.2rem;
  }
`;

const LayoutItem = styled.li<{ $disabled?: boolean }>`
  opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'auto')};

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

  &:nth-child(3) div,
  &:nth-child(5) div {
    justify-items: center;

    span {
      width: 1.5rem;
      height: 1.2rem;
    }
  }

  &:nth-child(4) div span,
  &:nth-child(6) div span {
    grid-column: 1 / -1;
    height: 7px;
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
    font-size: 1.6rem;

    span {
      background-color: var(--color-gray-light);
    }
  }

  &:nth-child(1) div {
    font-size: 2.4rem;
  }

  &:nth-child(3) div {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  &:nth-child(4) div span {
    border-radius: var(--border-radius-md);
    padding: 0.4rem 0.8rem;
    font-size: 1rem;
  }

  &:nth-child(5) div span {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 1.5rem;

    &::after {
      position: absolute;
      top: 53%;
      left: 20%;
      transform: translateY(-50%);
      background-color: var(--color-gray);
      width: 2px;
      height: 0.8rem;
      content: '';
    }
  }
`;

const MediaItem = styled.li`
  div {
    display: flex;
    justify-content: center;
    align-items: center;
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
`;

const PanelBox = styled.div`
  cursor: pointer;
  margin-bottom: 0.8rem;
  border-radius: var(--border-radius-md);
  background-color: var(--color-white-3);
  padding: 1.2rem;
  width: 6rem;
  height: 5rem;
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
