import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { LuTrash } from 'react-icons/lu';
import Masonry from 'react-masonry-css';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import { StorageKey } from '../../../constant';
import { useFilePicker } from '../../../hooks/useFilePicker';
import { useLoadFromStorage } from '../../../hooks/useLoadFromStorage';
import { useEditorContext } from '../../../pages/Editor';
import { useAppSelector } from '../../../store';
import { useImageUpload } from '../hooks/useImageUpload';
import { setImages } from '../slices/editorSlice';

/**
 * Component definition
 */

export default function UploadsPanel() {
  const dispatch = useDispatch();
  const images = useAppSelector((state) => state.editor.images);
  const { iframeConnection } = useEditorContext();

  const handleImageUpload = useImageUpload(
    (result) => {
      iframeConnection.insertElement('image', { src: result });
      dispatch(setImages([...images, result]));
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
      <MasonryGrid breakpointCols={2} className='masonry-grid' columnClassName='masonry-grid_column'>
        {images?.map((src, i) => (
          <MediaItem key={i}>
            <img src={src} alt={`uploaded image ${i + 1}`} loading='lazy' />
            <Icon icon={LuTrash} />
          </MediaItem>
        ))}
      </MasonryGrid>
    </>
  );
}

/**
 * Styles
 */

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
