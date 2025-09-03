import { EditorToIframe, ElementsName } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { Dispatch, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import Masonry from 'react-masonry-css';
import styled from 'styled-components';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import { StorageKey, ToastMessages } from '../../../constant';
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
  const [images, setImages] = useState<Image[]>([]);
  const urlsRef = useRef<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const stored = await AppStorage.get<Record<string, Blob>>(StorageKey.Images, {});
      const imgs: Image[] = [];

      for (const [id, blob] of Object.entries(stored)) {
        const url = URL.createObjectURL(blob);
        urlsRef.current.push(url);
        imgs.push({ id, blob, url });
      }

      setImages(imgs);
    };

    loadImages();

    const urlsToRevoke = [...urlsRef.current];

    return () => {
      for (const url of urlsToRevoke) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  return (
    <>
      <Button fullWidth onClick={() => {}}>
        Upload File
      </Button>
      {images.length === 0 && <EmptyMessage>No images uploaded yet</EmptyMessage>}
      <MasonryGrid breakpointCols={2} className='masonry-grid' columnClassName='masonry-grid_column'>
        {images?.map((img, i) => <MediaItem img={img} index={i} urlsRef={urlsRef} setImages={setImages} />)}
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
        <Icon icon={LuTrash2} color='var(--color-white)' />
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

  svg {
    position: absolute;
    top: 8px;
    right: 8px;
    transform: translateY(-4rem);
    transition: transform 0.2s ease-in-out;
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
