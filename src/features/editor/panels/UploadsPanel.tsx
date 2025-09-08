import { nanoid } from '@reduxjs/toolkit';
import { EditorToIframe, ElementsName } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { Dispatch, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import Masonry from 'react-masonry-css';
import styled from 'styled-components';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import { StorageKey, ToastMessages } from '../../../constant';
import { useFilePicker } from '../../../hooks/useFilePicker';
import { useImageUpload } from '../../../hooks/useImageUpload';
import { useAppSelector } from '../../../store';
import { AppStorage } from '../../../utils/appStorage';
import { AppToast } from '../../../utils/appToast';
import { selectCurrentSite } from '../editorSlice';

/**
 * Constants
 */

const ACCEPTED_FILE_TYPE = 'image/*';

/**
 * Types
 */

interface Image {
  id: string;
  blob: Blob;
  url: string;
}

/**
 * Component definition
 */

export default function UploadsPanel() {
  const [loadingImages, setLoadingImages] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const urlsRef = useRef<string[]>([]);

  const handleImageUpload = useImageUpload(
    async (blob: Blob) => {
      try {
        const id = nanoid();
        await AppStorage.addToObject(StorageKey.Images, id, blob);

        const url = URL.createObjectURL(blob);
        urlsRef.current.push(url);

        setImages((prev) => [...prev, { id, blob, url }]);
      } finally {
        setUploading(false);
      }
    },
    (message: string) => {
      setUploading(false);
      AppToast.error(message);
    }
  );

  useEffect(() => {
    const loadImages = async () => {
      setLoadingImages(true);

      const stored = await AppStorage.get<Record<string, Blob>>(StorageKey.Images, {});
      const imgs: Image[] = [];

      for (const [id, blob] of Object.entries(stored)) {
        const url = URL.createObjectURL(blob);
        urlsRef.current.push(url);
        imgs.push({ id, blob, url });
      }

      setTimeout(() => {
        setImages(imgs);
        setLoadingImages(false);
      }, 300);
    };

    loadImages();

    const urlsToRevoke = [...urlsRef.current];

    return () => {
      for (const url of urlsToRevoke) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  const { input, openFilePicker } = useFilePicker({
    accept: ACCEPTED_FILE_TYPE,
    onSelect: async (file) => {
      setUploading(true);
      await handleImageUpload(file);
    }
  });

  return (
    <>
      {input}
      <Button fullWidth onClick={openFilePicker} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload File'}
      </Button>
      {images.length === 0 && (
        <EmptyMessage>
          {loadingImages ? (
            <LoadingDots>
              <span></span>
              <span></span>
              <span></span>
            </LoadingDots>
          ) : (
            'No images uploaded yet'
          )}
        </EmptyMessage>
      )}
      <MasonryGrid breakpointCols={2} className='masonry-grid' columnClassName='masonry-grid_column'>
        {images?.map((img, i) => (
          <MediaItem key={img.id} img={img} index={i} urlsRef={urlsRef} setImages={setImages} />
        ))}
      </MasonryGrid>
    </>
  );
}

function MediaItem({
  img,
  index,
  urlsRef,
  setImages
}: {
  img: Image;
  index: number;
  urlsRef: RefObject<string[]>;
  setImages: Dispatch<React.SetStateAction<Image[]>>;
}) {
  const site = useAppSelector(selectCurrentSite);

  const handleDeleteImage = (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();

    const { id, url } = img;

    const pages = site ? Object.values(site.pages) : [];
    const elements = pages.flatMap((page) => Object.values(page.elements));
    const used = elements.some((el) => 'blobId' in el && el.blobId === id);

    if (used) {
      AppToast.error(ToastMessages.image.used);
      return;
    }

    setImages((prev) => prev.filter((img) => img.id !== id));

    URL.revokeObjectURL(url);
    urlsRef.current = urlsRef.current.filter((u) => u !== url);
    AppStorage.deleteFromObject(StorageKey.Images, id);
  };

  return (
    <StyledMediaItem key={img.id} onClick={() => handleAddMediaItem(img)}>
      <img src={img.url} alt={`uploaded image ${index + 1}`} loading='lazy' />
      <span onClick={handleDeleteImage}>
        <Icon icon={LuTrash2} color='var(--color-gray)' />
      </span>
    </StyledMediaItem>
  );
}

const handleAddMediaItem = (img: Image) => {
  const payload = {
    name: ElementsName.Image,
    additionalProps: {
      blobId: img.id,
      url: img.url,
      size: img.blob.size
    }
  };

  iframeConnection.send(EditorToIframe.InsertElement, payload);
};

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
    margin-bottom: 1.2rem;
    background:
      linear-gradient(45deg, var(--color-gray-light-4) 25%, transparent 25%),
      linear-gradient(-45deg, var(--color-gray-light-4) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--color-gray-light-4) 75%),
      linear-gradient(-45deg, transparent 75%, var(--color-gray-light-4) 75%);
    background-position:
      0 0,
      0 10px,
      10px -10px,
      -10px 0px;
    background-size: 20px 20px;
  }
`;

const StyledMediaItem = styled.div`
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

  > span {
    position: absolute;
    top: 5px;
    right: 8px;
    transform: translateY(-4rem);
    transition: transform 0.2s ease-in-out;
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius-sm);
    background-color: var(--color-white);
    padding: 0.4rem;
  }

  &:hover > span {
    transform: translateY(0);
  }
`;

const EmptyMessage = styled.p`
  margin-top: 2.4rem;
  text-align: center;
  color: var(--color-gray-light);
  font-size: 1.2rem;
`;

const LoadingDots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  margin-top: 4.8rem;

  span {
    display: block;
    animation: bounce 0.6s infinite alternate;
    border-radius: 50%;
    background-color: var(--color-gray);
    width: 0.8rem;
    height: 0.8rem;
  }

  span:nth-child(2) {
    animation-delay: 0.2s;
  }

  span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes bounce {
    0% {
      transform: translateY(0);
      opacity: 0.6;
    }
    100% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
`;
