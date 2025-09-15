import { nanoid } from '@reduxjs/toolkit';
import { EditorToIframe, ElementsName } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { ChangeEvent } from 'react';
import { LuImage, LuSearch } from 'react-icons/lu';
import styled from 'styled-components';
import { SectionTitle } from '.';
import Input from '../../../components/form/Input';
import Icon from '../../../components/Icon';
import { StorageKey } from '../../../constant';
import { useFilePicker } from '../../../hooks/useFilePicker';
import { useImageUpload } from '../../../hooks/useImageUpload';
import { AppStorage } from '../../../utils/appStorage';
import { AppToast } from '../../../utils/appToast';
import CollapsibleSection from '../CollapsibleSection';
import { useElementDisable } from '../hooks/useElementDisable';

/**
 * Constants
 */

const ACCEPTED_FILE_TYPE = 'image/*';

/**
 * Component definition
 */

export default function ElementsPanel() {
  const { isDisabled } = useElementDisable();

  const handleImageUpload = useImageUpload(
    async (file: File) => {
      const id = nanoid();
      const url = URL.createObjectURL(file);
      const additionalProps = { fileId: id, url, size: file.size };

      iframeConnection.send(EditorToIframe.InsertElement, { name: ElementsName.Image, additionalProps });
      await AppStorage.addToObject(StorageKey.Images, id, file, { first: true });
    },
    (message) => AppToast.error(message)
  );

  const { input, openFilePicker } = useFilePicker({ accept: ACCEPTED_FILE_TYPE, onSelect: handleImageUpload });

  return (
    <>
      {input}
      <div>
        <SectionTitle>Add Elements</SectionTitle>
        <SearchBar>
          <Icon icon={LuSearch} />
          <Input
            size='md'
            type='text'
            placeholder='Search by ID'
            onChange={handleSearchElement}
            onBlur={(event) => (event.target.value = '')}
          />
        </SearchBar>
      </div>
      <div>
        <CollapsibleSection title='Layout' open>
          <PanelList>
            <LayoutItem data-grid-active>
              <PanelBox onClick={() => handleAddElement(ElementsName.Section)}>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
              </PanelBox>
              <span>Section</span>
            </LayoutItem>
            <LayoutItem $disabled={isDisabled(ElementsName.Container)}>
              <PanelBox onClick={() => handleAddElement(ElementsName.Container)}>
                <span>&nbsp;</span>
              </PanelBox>
              <span>Container</span>
            </LayoutItem>
            <LayoutItem $disabled={isDisabled(ElementsName.Grid)}>
              <PanelBox onClick={() => handleAddElement(ElementsName.Grid)}>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
              </PanelBox>
              <span>Grid</span>
            </LayoutItem>
            <LayoutItem $disabled={isDisabled(ElementsName.List)}>
              <PanelBox onClick={() => handleAddElement(ElementsName.List)}>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
              </PanelBox>
              <span>List</span>
            </LayoutItem>
            <LayoutItem $disabled={isDisabled(ElementsName.GridItem)} data-grid-active>
              <PanelBox onClick={() => handleAddElement(ElementsName.GridItem)}>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
              </PanelBox>
              <span>Grid Item</span>
            </LayoutItem>
            <LayoutItem $disabled={isDisabled(ElementsName.ListItem)} data-list-active>
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
        <CollapsibleSection title='Text' open>
          <PanelList>
            <TextItem
              $disabled={isDisabled(ElementsName.Heading)}
              onClick={() => handleAddElement(ElementsName.Heading)}
            >
              <PanelBox>H</PanelBox>
              <span>Heading</span>
            </TextItem>
            <TextItem $disabled={isDisabled(ElementsName.Text)} onClick={() => handleAddElement(ElementsName.Text)}>
              <PanelBox>Text</PanelBox>
              <span>Text Block</span>
            </TextItem>
            <TextItem $disabled={isDisabled(ElementsName.Link)} onClick={() => handleAddElement(ElementsName.Link)}>
              <PanelBox>Link</PanelBox>
              <span>Text Link</span>
            </TextItem>
            <TextItem $disabled={isDisabled(ElementsName.Button)} onClick={() => handleAddElement(ElementsName.Button)}>
              <PanelBox>
                <span>Button</span>
              </PanelBox>
              <span>Button</span>
            </TextItem>
            <TextItem $disabled={isDisabled(ElementsName.Input)} onClick={() => handleAddElement(ElementsName.Input)}>
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
          <PanelList>
            <MediaItem $disabled={isDisabled(ElementsName.Image)}>
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

const handleAddElement = (name: string) => {
  iframeConnection.send(EditorToIframe.InsertElement, { name });
};

const handleSearchElement = (event: ChangeEvent<HTMLInputElement>) => {
  const id = event.target.value;
  iframeConnection.send(EditorToIframe.SelectElement, id);
};

/**
 * Styles
 */

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

const PanelItem = styled.li<{ $disabled?: boolean }>`
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
`;

const LayoutItem = styled(PanelItem)`
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

const TextItem = styled(PanelItem)`
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

const MediaItem = styled(PanelItem)`
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span {
    background-color: transparent !important;
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-top: 2.4rem;

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
