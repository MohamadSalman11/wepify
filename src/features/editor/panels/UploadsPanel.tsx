import { useRef } from 'react';
import { LuTrash } from 'react-icons/lu';
import Masonry from 'react-masonry-css';
import styled from 'styled-components';
import Button from '../../../components/Button';
import { useAppSelector } from '../../../store';
import { flattenElements } from '../../../utils/flattenElements';
import { useImageUpload } from '../hooks/useImageUpload';

/**
 * Styles
 */

const Nav = styled.nav`
  ul {
    display: flex;
    align-items: center;
    margin-top: 3.2rem;
    list-style: none;

    li {
      flex-grow: 1;
      cursor: pointer;
      padding: 1.2rem 0;
      text-align: center;

      &:hover {
        box-shadow: 0 2px 0 0 var(--color-primary-light);
      }

      &:hover a {
        color: var(--color-gray);
      }

      a {
        transition: var(--transition-base);
        text-decoration: none;
      }
    }
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
    z-index: 10;
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
    color: white;
  }

  &:hover svg {
    transform: translateY(0);
  }
`;

/**
 * Component definition
 */

function UploadsPanel() {
  const page = useAppSelector((state) => state.page);
  const images = flattenElements(page.elements).filter((el) => el.name === 'img');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleImageUpload } = useImageUpload();

  return (
    <>
      <input type='file' accept='image/*' style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageUpload} />
      <Button fullWidth={true} onClick={() => fileInputRef.current?.click()}>
        Upload File
      </Button>
      <Nav>
        <ul>
          <li>
            <a href='#'>images</a>
          </li>
          <li>
            <a href='#'>videos</a>
          </li>
        </ul>
      </Nav>

      <Masonry breakpointCols={2} className='my-masonry-grid' columnClassName='my-masonry-grid_column'>
        {images.map((img, i) => (
          <MediaItem key={i}>
            <img src={img.src} alt={img.alt || `uploaded image ${i + 1}`} loading='lazy' />
            <LuTrash />
          </MediaItem>
        ))}
      </Masonry>
    </>
  );
}

export default UploadsPanel;
