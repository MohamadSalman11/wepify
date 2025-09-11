import { nanoid } from '@reduxjs/toolkit';
import { EditorToIframe, ElementsName } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { Site } from '@shared/typing';
import { Dispatch, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import Masonry from 'react-masonry-css';
import styled from 'styled-components';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import LoadingDots from '../../../components/LoadingDots';
import { StorageKey, ToastMessages } from '../../../constant';
import { useFilePicker } from '../../../hooks/useFilePicker';
import { useImageUpload } from '../../../hooks/useImageUpload';
import { AppStorage } from '../../../utils/appStorage';
import { AppToast } from '../../../utils/appToast';

/**
 * Constants
 */

const DELAY_DELETE_IMAGE = 800;
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
        {uploading ? <LoadingDots color='var(--color-white)' /> : 'Upload File'}
      </Button>
      {images.length === 0 && <EmptyMessage>{loadingImages ? <LoadingDots /> : 'No images uploaded yet'}</EmptyMessage>}
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
  const [deleting, setDeleting] = useState(false);

  const handleDeleteImage = async (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();

    if (deleting) {
      return;
    }

    setDeleting(true);

    const { id, url } = img;

    const sites = await AppStorage.get<Record<string, Site>>(StorageKey.Sites);

    const used = Object.values(sites).some((site) =>
      Object.values(site.pages).some((page) =>
        Object.values(page.elements).some((el) => 'blobId' in el && el.blobId === id)
      )
    );

    if (used) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_DELETE_IMAGE));
      AppToast.error(ToastMessages.image.used);
      setDeleting(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, DELAY_DELETE_IMAGE));

    setImages((prev) => prev.filter((img) => img.id !== id));

    URL.revokeObjectURL(url);
    urlsRef.current = urlsRef.current.filter((u) => u !== url);
    await AppStorage.deleteFromObject(StorageKey.Images, id);

    setTimeout(() => setDeleting(false), DELAY_DELETE_IMAGE);
  };

  return (
    <StyledMediaItem key={img.id} $deleting={deleting} onClick={() => handleAddMediaItem(img)}>
      <img src={img.url} alt={`uploaded image ${index + 1}`} loading='lazy' />
      <span onClick={handleDeleteImage}>
        {deleting ? <LoadingDots size={6} gap={2} /> : <Icon icon={LuTrash2} color='var(--color-gray)' />}
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

const StyledMediaItem = styled.div<{ $deleting: boolean }>`
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
    transform: translateY(${({ $deleting }) => ($deleting ? '0' : '-4rem')});
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

const EmptyMessage = styled.div`
  margin-top: 2.4rem;
  text-align: center;
  color: var(--color-gray-light);
  font-size: 1.2rem;
`;
