import { nanoid } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { LuTrash2 } from 'react-icons/lu';
import Masonry from 'react-masonry-css';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import { StorageKey } from '../../../constant';
import { useIframeContext } from '../../../context/IframeContext';
import { useFilePicker } from '../../../hooks/useFilePicker';
import { useLoadFromStorage } from '../../../hooks/useLoadFromStorage';
import { useAppSelector } from '../../../store';
import { useImageUpload } from '../hooks/useImageUpload';
import { addImage, deleteImage, setImages } from '../slices/editorSlice';

export default function UploadsPanel() {
  const dispatch = useDispatch();
  const images = useAppSelector((state) => state.editor.images);
  const { iframeConnection } = useIframeContext();

  const handleImageUpload = useImageUpload(
    (result) => {
      iframeConnection.insertElement('image', { src: result });
      dispatch(addImage({ id: nanoid(), dataUrl: result }));
    },
    (message) => toast.error(message)
  );

  const { input, openFilePicker } = useFilePicker({ accept: 'image/*', onSelect: handleImageUpload });

  const onLoaded = useCallback(
    (images: string[] | null) => {
      if (images) {
        dispatch(setImages(images));
      }
    },
    [dispatch]
  );

  useLoadFromStorage<string[]>({
    storageKey: StorageKey.Images,
    loadingDuration: 0,
    onLoaded
  });

  return (
    <>
      {input}
      <Button fullWidth={true} onClick={openFilePicker}>
        Upload File
      </Button>

      {images.length === 0 && <EmptyMessage>No images uploaded yet</EmptyMessage>}

      <MasonryGrid breakpointCols={2} className='masonry-grid' columnClassName='masonry-grid_column'>
        {images?.map((img, i) => (
          <MediaItem key={i} onClick={() => iframeConnection.insertElement('image', { src: img.dataUrl })}>
            <img src={img.dataUrl} alt={`uploaded image ${i + 1}`} loading='lazy' />
            <span
              onClick={(event) => {
                event.stopPropagation();
                dispatch(deleteImage(img.id));
              }}
            >
              <Icon icon={LuTrash2} />
            </span>
          </MediaItem>
        ))}
      </MasonryGrid>
    </>
  );
}

const MasonryGrid = styled(Masonry)`
  display: flex !important;
  flex-direction: row !important;
  gap: 1.2rem;
  margin-top: 2.4rem;
  width: 100%;

  & > div {
    flex: 1;
  }

  & > div > div {
    margin-bottom: 12px;
    background:
      linear-gradient(45deg, var(--color-gray-light-3) 25%, transparent 25%),
      linear-gradient(-45deg, var(--color-gray-light-3) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--color-gray-light-3) 75%),
      linear-gradient(-45deg, transparent 75%, var(--color-gray-light-3) 75%);
    background-position:
      0 0,
      0 10px,
      10px -10px,
      -10px 0px;
    background-size: 20px 20px;
  }
`;

const MediaItem = styled.div`
  position: relative;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  cursor: pointer;

  img {
    display: block;
    border-radius: var(--border-radius-md);
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  svg {
    position: absolute;
    top: 8px;
    right: 8px;
    transform: translateY(-4rem);
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
    color: var(--color-white);
  }

  &:hover svg {
    transform: translateY(0);
  }
`;

const EmptyMessage = styled.p`
  margin-top: 2.4rem;
  text-align: center;
  color: var(--color-gray-light);
  font-size: 1.2rem;
`;
